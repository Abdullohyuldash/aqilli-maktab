import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AvatarEmote,
  AwardDefinition,
  EmoteRequest,
  EquippedAccessories,
  EthicsFeedbackToast,
  FloorNumber,
  GymGameSnapshot,
  PlayerGender,
  PlayerProfile,
  ShopItem,
  SubjectId,
  TeacherGreetingPrompt,
  TrashPickupPrompt,
  VirtualControlsState,
  WorldZone,
  ZoneId,
} from './types';
import {
  DEFAULT_PROFILE,
  filterEquippedForGender,
  getSubjectOrderForGrade,
  loadProfile,
  saveProfile,
} from './utils/storage';
import { FLOOR_META, getLessonForPlayer, SUBJECT_META } from './data/curriculum';
import { ALL_AWARDS, evaluateNewlyUnlockedAwards } from './data/awards';
import { soundEngine, stopSpeaking } from './utils/sound';
import { StartScreen } from './components/StartScreen';
import { SchoolCanvas3D, TrashOutcome } from './components/SchoolCanvas3D';
import type { TeacherGreetingOutcome } from './components/SchoolNPCs';
import { HudOverlay } from './components/HudOverlay';
import { LessonModal } from './components/LessonModal';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';
import { CurriculumInspectorModal } from './components/CurriculumInspectorModal';
import { ScheduleModal } from './components/ScheduleModal';
import { LiftModal } from './components/LiftModal';
import { AwardCelebrationPopup, AwardsModal } from './components/AwardsModal';
import { GymHudOverlay } from './components/GymHudOverlay';
import { GymLockerModal } from './components/GymLockerModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';

export default function App() {
  const [savedExists] = useState<boolean>(() => Boolean(loadProfile()?.name));
  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile() || DEFAULT_PROFILE);
  const [screen, setScreen] = useState<'start' | 'school'>('start');
  const [activePeLessonIndex, setActivePeLessonIndex] = useState<number>(0);

  // 3-Floor Architecture state (default Floor 1)
  const [currentFloor, setCurrentFloor] = useState<FloorNumber>(1);
  const [elevatorTeleportToken, setElevatorTeleportToken] = useState(0);
  const [elevatorTransition, setElevatorTransition] = useState<{ targetFloor: FloorNumber } | null>(
    null
  );
  const transitionTimersRef = useRef<number[]>([]);

  const [activeModal, setActiveModal] = useState<
    | { type: 'none' }
    | { type: 'lesson'; subject: SubjectId }
    | { type: 'shop' }
    | { type: 'schedule' }
    | { type: 'awards' }
    | { type: 'lift' }
    | { type: 'settings' }
    | { type: 'inspector' }
  >({ type: 'none' });
  const [startInspectorOpen, setStartInspectorOpen] = useState(false);

  const [muted, setMuted] = useState(false);
  const [inGym, setInGym] = useState(false);
  const [gymLockerOpen, setGymLockerOpen] = useState(false);
  const [gymWearEquipped, setGymWearEquipped] = useState(false);
  const [gymSnapshot, setGymSnapshot] = useState<GymGameSnapshot | null>(null);
  const [gymActionToken, setGymActionToken] = useState(0);
  const [gymSpaceToken, setGymSpaceToken] = useState(0);
  const [gymConfettiActive, setGymConfettiActive] = useState(false);
  const [gymTransition, setGymTransition] = useState<string | null>(null);
  const [nudgeToken, setNudgeToken] = useState(0);
  const [emoteRequest, setEmoteRequest] = useState<EmoteRequest | null>(null);
  const [activeEmote, setActiveEmote] = useState<AvatarEmote | null>(null);
  const [nearbyInactiveZone, setNearbyInactiveZone] = useState<ZoneId | null>(null);
  const [nearbyComingSoon, setNearbyComingSoon] = useState<WorldZone | null>(null);
  const [teacherGreetingPrompt, setTeacherGreetingPrompt] =
    useState<TeacherGreetingPrompt | null>(null);
  const [greetTriggerToken, setGreetTriggerToken] = useState(0);
  const [trashPrompt, setTrashPrompt] = useState<TrashPickupPrompt | null>(null);
  const [trashPickupToken, setTrashPickupToken] = useState(0);
  const [ethicsFeedback, setEthicsFeedback] = useState<EthicsFeedbackToast | null>(null);
  const [awardCelebrationQueue, setAwardCelebrationQueue] = useState<AwardDefinition[]>([]);
  const seenUnlockedAwardsRef = useRef<Set<string>>(new Set(profile.unlockedAwards));
  const emoteClearTimerRef = useRef<number | null>(null);
  const victoryEmoteTimerRef = useRef<number | null>(null);
  const ethicsToastTimerRef = useRef<number | null>(null);
  const gymConfettiTimerRef = useRef<number | null>(null);
  const gymPrevCompletedRef = useRef<boolean>(false);

  const virtualControlsRef = useRef<VirtualControlsState>({
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
  });

  // Clean up elevator, emote, confetti & ethics toast timers on unmount
  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
      if (emoteClearTimerRef.current !== null) window.clearTimeout(emoteClearTimerRef.current);
      if (victoryEmoteTimerRef.current !== null) window.clearTimeout(victoryEmoteTimerRef.current);
      if (ethicsToastTimerRef.current !== null) window.clearTimeout(ethicsToastTimerRef.current);
      if (gymConfettiTimerRef.current !== null) window.clearTimeout(gymConfettiTimerRef.current);
    };
  }, []);

  // Persist profile automatically to localStorage whenever state updates
  useEffect(() => {
    if (profile.name.trim().length >= 2) {
      saveProfile(profile);
    }
  }, [profile]);

  // Detect any newly unlocked medals cleanly (StrictMode-safe) and trigger celebration + fanfare
  useEffect(() => {
    const newlySeen: AwardDefinition[] = [];
    for (const awardId of profile.unlockedAwards) {
      if (!seenUnlockedAwardsRef.current.has(awardId)) {
        seenUnlockedAwardsRef.current.add(awardId);
        const def = ALL_AWARDS.find((a) => a.id === awardId);
        if (def) newlySeen.push(def);
      }
    }
    if (newlySeen.length > 0) {
      soundEngine.playAwardUnlocked();
      setAwardCelebrationQueue((prev) => [...prev, ...newlySeen]);
    }
  }, [profile.unlockedAwards]);

  const gradeSubjectOrder = getSubjectOrderForGrade(profile.grade);
  const activeSubject: SubjectId =
    gradeSubjectOrder[profile.activeSubjectIndex % gradeSubjectOrder.length];

  const isPaused =
    activeModal.type !== 'none' ||
    elevatorTransition !== null ||
    gymTransition !== null ||
    gymLockerOpen ||
    awardCelebrationQueue.length > 0;

  const handleStartGame = (
    name: string,
    gender: PlayerGender,
    grade: number,
    shirtColor: string
  ) => {
    const next: PlayerProfile = {
      ...profile,
      name,
      gender,
      grade,
      shirtColor,
      equipped: filterEquippedForGender(profile.equipped, gender),
    };
    setProfile(next);
    saveProfile(next);
    soundEngine.playEquip();
    setScreen('school');
  };

  const enterGym = useCallback(() => {
    soundEngine.playEquip();
    setNearbyInactiveZone(null);
    setNearbyComingSoon(null);
    setTeacherGreetingPrompt(null);
    setTrashPrompt(null);
    setGymTransition('🏃 Sport zaliga kirilmoqda...');
    window.setTimeout(() => {
      setCurrentFloor(2);
      setInGym(true);
      setGymLockerOpen(true);
      setGymWearEquipped(false);
      gymPrevCompletedRef.current = false;
      setGymTransition(null);
    }, 500);
  }, []);

  const exitGym = useCallback(() => {
    soundEngine.playEquip();
    setGymLockerOpen(false);
    setGymConfettiActive(false);
    setGymTransition('Maktab koridoriga chiqilmoqda...');
    window.setTimeout(() => {
      setInGym(false);
      setGymWearEquipped(false);
      setGymSnapshot(null);
      gymPrevCompletedRef.current = false;
      setGymTransition(null);
    }, 500);
  }, []);

  const handleEnterZone = useCallback(
    (zone: ZoneId) => {
      if (zone === 'elevator') {
        soundEngine.playEquip();
        setActiveModal({ type: 'lift' });
      } else if (zone === 'shop') {
        soundEngine.playEquip();
        setActiveModal({ type: 'shop' });
      } else if (zone === 'schedule') {
        soundEngine.playEquip();
        setActiveModal({ type: 'schedule' });
      } else if (zone === 'pe') {
        enterGym();
      } else if (zone === 'exit_gym') {
        exitGym();
      } else if (zone in SUBJECT_META) {
        soundEngine.playEquip();
        setActiveModal({ type: 'lesson', subject: zone as SubjectId });
      }
    },
    [enterGym, exitGym]
  );

  const closeModalAndNudge = useCallback(() => {
    setActiveModal({ type: 'none' });
    setNudgeToken((n) => n + 1);
  }, []);

  const handleSelectFloor = useCallback(
    (targetFloor: FloorNumber) => {
      if (targetFloor === currentFloor) {
        closeModalAndNudge();
        return;
      }

      soundEngine.playElevatorDing();
      setActiveModal({ type: 'none' });
      setNearbyInactiveZone(null);
      setNearbyComingSoon(null);
      setElevatorTransition({ targetFloor });

      transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
      transitionTimersRef.current = [];

      // Swap 3D floor cleanly beneath the 0.5s transition overlay
      const swapTimer = window.setTimeout(() => {
        setCurrentFloor(targetFloor);
        setElevatorTeleportToken((t) => t + 1);
      }, 220);

      const doneTimer = window.setTimeout(() => {
        setElevatorTransition(null);
      }, 520);

      transitionTimersRef.current = [swapTimer, doneTimer];
    },
    [currentFloor, closeModalAndNudge]
  );

  const handleTriggerEmote = useCallback(
    (
      emote: AvatarEmote,
      durationSec = 2.8,
      playVictoryFanfare = false,
      silentSound = false
    ) => {
      setEmoteRequest((prev) => ({
        emote,
        durationSec,
        token: (prev?.token ?? 0) + 1,
      }));
      setActiveEmote(emote);

      if (!silentSound) {
        if (playVictoryFanfare) {
          soundEngine.playLessonComplete();
        } else {
          soundEngine.playEmote(emote);
        }
      }

      if (emoteClearTimerRef.current !== null) {
        window.clearTimeout(emoteClearTimerRef.current);
      }
      emoteClearTimerRef.current = window.setTimeout(() => {
        setActiveEmote(null);
        emoteClearTimerRef.current = null;
      }, Math.round(durationSec * 1000));
    },
    []
  );

  const showEthicsToast = useCallback((toast: Omit<EthicsFeedbackToast, 'id'>) => {
    setEthicsFeedback({ ...toast, id: Date.now() });
    if (ethicsToastTimerRef.current !== null) {
      window.clearTimeout(ethicsToastTimerRef.current);
    }
    ethicsToastTimerRef.current = window.setTimeout(() => {
      setEthicsFeedback(null);
      ethicsToastTimerRef.current = null;
    }, 3400);
  }, []);

  const handleGreetTeacher = useCallback(() => {
    if (isPaused || !teacherGreetingPrompt) return;
    setGreetTriggerToken((t) => t + 1);
  }, [isPaused, teacherGreetingPrompt]);

  const canTriggerTrashAction =
    trashPrompt !== null && (trashPrompt.mode === 'pickup' || trashPrompt.mode === 'dropoff');

  const handlePickupTrash = useCallback(() => {
    if (isPaused || !canTriggerTrashAction) return;
    setTrashPickupToken((t) => t + 1);
  }, [isPaused, canTriggerTrashAction]);

  // Press 'E' keyboard shortcut for 3D Gym interactions OR politely greet Ustoz OR pick up / throw trash
  useEffect(() => {
    if (
      screen !== 'school' ||
      isPaused ||
      (!inGym && !teacherGreetingPrompt && !canTriggerTrashAction)
    ) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE') return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      if (inGym) {
        setGymActionToken((t) => t + 1);
      } else if (teacherGreetingPrompt) {
        handleGreetTeacher();
      } else if (canTriggerTrashAction) {
        handlePickupTrash();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    screen,
    isPaused,
    inGym,
    teacherGreetingPrompt,
    canTriggerTrashAction,
    handleGreetTeacher,
    handlePickupTrash,
  ]);

  const handleTeacherGreetingOutcome = useCallback(
    (outcome: TeacherGreetingOutcome) => {
      if (outcome.kind === 'reward') {
        handleTriggerEmote('salom', 2.8, false, true);
        soundEngine.playGreetingReward();
        setProfile((prev) => {
          const nextStats = {
            ...prev.stats,
            greetingsGiven: prev.stats.greetingsGiven + 1,
          };
          const newlyEarned = evaluateNewlyUnlockedAwards(nextStats, prev.unlockedAwards);
          const bonusCoins = newlyEarned.reduce((sum, a) => sum + a.rewardCoins, 0);
          const updated: PlayerProfile = {
            ...prev,
            coins: prev.coins + 10 + bonusCoins,
            stats: nextStats,
            unlockedAwards:
              newlyEarned.length > 0
                ? [...prev.unlockedAwards, ...newlyEarned.map((a) => a.id)]
                : prev.unlockedAwards,
          };
          saveProfile(updated);
          return updated;
        });
        showEthicsToast({
          kind: 'reward',
          deltaCoins: 10,
          title: "+10 ⭐ Odobli o'quvchi!",
          subtitle: 'Va alaykum assalom, barakalla!',
        });
      } else {
        soundEngine.playGreetingWarning();
        setProfile((prev) => {
          const updated: PlayerProfile = {
            ...prev,
            coins: Math.max(0, prev.coins - 5),
          };
          saveProfile(updated);
          return updated;
        });
        showEthicsToast({
          kind: 'penalty',
          deltaCoins: -5,
          title: '-5 🪙 Ustozga salom qani?',
          subtitle: "Ustoz yonidan salom bermay o'tdingiz",
        });
      }
    },
    [handleTriggerEmote, showEthicsToast]
  );

  const handleCompleteLesson = useCallback(
    (subject: SubjectId, earnedCoins: number) => {
      setProfile((prev) => {
        const nextSubjectCompletions = {
          ...prev.subjectCompletions,
          [subject]: (prev.subjectCompletions[subject] || 0) + 1,
        };
        const nextStats = {
          ...prev.stats,
          sportCompleted: subject === 'pe' ? prev.stats.sportCompleted + 1 : prev.stats.sportCompleted,
        };
        const newlyEarned = evaluateNewlyUnlockedAwards(nextStats, prev.unlockedAwards);
        const bonusCoins = newlyEarned.reduce((sum, a) => sum + a.rewardCoins, 0);
        const updated: PlayerProfile = {
          ...prev,
          coins: prev.coins + earnedCoins + bonusCoins,
          completedLessons: prev.completedLessons + 1,
          subjectCompletions: nextSubjectCompletions,
          stats: nextStats,
          unlockedAwards:
            newlyEarned.length > 0
              ? [...prev.unlockedAwards, ...newlyEarned.map((a) => a.id)]
              : prev.unlockedAwards,
        };
        saveProfile(updated);
        return updated;
      });
    },
    []
  );

  const handleLockerAttemptSchoolUniform = useCallback(() => {
    soundEngine.playGreetingWarning();
    setProfile((prev) => {
      const updated: PlayerProfile = {
        ...prev,
        coins: Math.max(0, prev.coins - 5),
      };
      saveProfile(updated);
      return updated;
    });
    showEthicsToast({
      kind: 'penalty',
      deltaCoins: -5,
      title: '-5 🪙 Sport zaliga maktab formasi va sumka bilan kirish mumkin emas!',
      subtitle: 'Iltimos, sport formasini kiying.',
    });
  }, [showEthicsToast]);

  const handleLockerEquipSportswear = useCallback(() => {
    soundEngine.playGreetingReward();
    setProfile((prev) => {
      const updated: PlayerProfile = {
        ...prev,
        coins: prev.coins + 10,
      };
      saveProfile(updated);
      return updated;
    });
    setGymWearEquipped(true);
    setGymLockerOpen(false);
    showEthicsToast({
      kind: 'reward',
      deltaCoins: 10,
      title: '+10 ⭐ Barakalla! Sport formasi tayyor!',
      subtitle: 'Endi 3D Sport zalida mashqlarni boshlashingiz mumkin.',
    });
  }, [showEthicsToast]);

  const handleGymSnapshot = useCallback(
    (snap: GymGameSnapshot) => {
      setGymSnapshot(snap);
      if (snap.completed && !gymPrevCompletedRef.current) {
        gymPrevCompletedRef.current = true;
        handleCompleteLesson('pe', 25);
        setGymConfettiActive(true);
        if (gymConfettiTimerRef.current !== null) {
          window.clearTimeout(gymConfettiTimerRef.current);
        }
        gymConfettiTimerRef.current = window.setTimeout(() => {
          setGymConfettiActive(false);
          gymConfettiTimerRef.current = null;
        }, 3600);
      } else if (!snap.completed) {
        gymPrevCompletedRef.current = false;
      }
    },
    [handleCompleteLesson]
  );

  const handleTrashOutcome = useCallback(
    (outcome: TrashOutcome) => {
      if (outcome.kind === 'deposited') {
        soundEngine.playTrashCollect();
        setProfile((prev) => {
          const nextStats = {
            ...prev.stats,
            trashCollected: prev.stats.trashCollected + 1,
          };
          const newlyEarned = evaluateNewlyUnlockedAwards(nextStats, prev.unlockedAwards);
          const bonusCoins = newlyEarned.reduce((sum, a) => sum + a.rewardCoins, 0);
          const updated: PlayerProfile = {
            ...prev,
            coins: prev.coins + 10 + bonusCoins,
            stats: nextStats,
            unlockedAwards:
              newlyEarned.length > 0
                ? [...prev.unlockedAwards, ...newlyEarned.map((a) => a.id)]
                : prev.unlockedAwards,
          };
          saveProfile(updated);
          return updated;
        });
        showEthicsToast({
          kind: 'reward',
          deltaCoins: 10,
          title: '+10 ⭐ Ozodalik uchun!',
          subtitle: `${outcome.trashLabel} axlat qutisiga tashlandi!`,
        });
      } else {
        soundEngine.playGreetingWarning();
        setProfile((prev) => {
          const updated: PlayerProfile = {
            ...prev,
            coins: Math.max(0, prev.coins - 3),
          };
          saveProfile(updated);
          return updated;
        });
        showEthicsToast({
          kind: 'penalty',
          deltaCoins: -3,
          title: "-3 🪙 Chiqindiga befarq bo'ldingiz!",
          subtitle: "Chiqindiga befarq bo'ldingiz! Atrofni toza tuting.",
        });
      }
    },
    [showEthicsToast]
  );

  const handleLessonComplete = (earnedCoins: number, correctCount: number, totalRounds: number) => {
    if (activeModal.type !== 'lesson') return;
    const finishedSubject = activeModal.subject;
    const finishedWasActive = finishedSubject === activeSubject;

    const isPerfect = totalRounds > 0 && correctCount >= totalRounds;
    const isGreat = totalRounds > 0 && correctCount >= Math.max(1, Math.ceil(totalRounds * 0.75));
    const countsForMath = isGreat && (finishedSubject === 'math' || finishedSubject === 'cs');
    const countsForLanguage =
      isGreat && (finishedSubject === 'alifbe' || finishedSubject === 'english');
    const countsForSport = isGreat && finishedSubject === 'pe';

    setProfile((prev) => {
      const nextStats = {
        ...prev.stats,
        mathCompleted: prev.stats.mathCompleted + (countsForMath ? 1 : 0),
        languageCompleted: prev.stats.languageCompleted + (countsForLanguage ? 1 : 0),
        sportCompleted: prev.stats.sportCompleted + (countsForSport ? 1 : 0),
      };
      const newlyEarned = evaluateNewlyUnlockedAwards(nextStats, prev.unlockedAwards);
      const bonusCoins = newlyEarned.reduce((sum, a) => sum + a.rewardCoins, 0);

      const updated: PlayerProfile = {
        ...prev,
        coins: prev.coins + earnedCoins + bonusCoins,
        completedLessons: prev.completedLessons + 1,
        subjectCompletions: {
          ...prev.subjectCompletions,
          [finishedSubject]: (prev.subjectCompletions[finishedSubject] || 0) + 1,
        },
        activeSubjectIndex: finishedWasActive
          ? (prev.activeSubjectIndex + 1) % getSubjectOrderForGrade(prev.grade).length
          : prev.activeSubjectIndex,
        stats: nextStats,
        unlockedAwards:
          newlyEarned.length > 0
            ? [...prev.unlockedAwards, ...newlyEarned.map((a) => a.id)]
            : prev.unlockedAwards,
      };
      saveProfile(updated);
      return updated;
    });

    closeModalAndNudge();

    // Celebrate in the 3D corridor after closing the modal on excellent / high scores
    if (isPerfect || isGreat) {
      if (victoryEmoteTimerRef.current !== null) {
        window.clearTimeout(victoryEmoteTimerRef.current);
      }
      victoryEmoteTimerRef.current = window.setTimeout(() => {
        handleTriggerEmote(isPerfect ? 'quvonch' : 'qarsak', isPerfect ? 3.0 : 2.8, true);
        victoryEmoteTimerRef.current = null;
      }, 140);
    }
  };

  const handleBuyItem = (item: ShopItem) => {
    const genderAllowed =
      item.genderRestriction === 'both' || item.genderRestriction === profile.gender;
    if (!genderAllowed || profile.coins < item.price || profile.ownedItems.includes(item.id)) {
      return;
    }
    soundEngine.playPurchase();

    setProfile((prev) => {
      const nextEquipped: EquippedAccessories = {
        ...prev.equipped,
        [item.slot]: item.id,
      };
      return {
        ...prev,
        coins: prev.coins - item.price,
        ownedItems: [...prev.ownedItems, item.id],
        equipped: nextEquipped,
      };
    });
  };

  const handleToggleEquip = (item: ShopItem) => {
    const genderAllowed =
      item.genderRestriction === 'both' || item.genderRestriction === profile.gender;
    if (!genderAllowed || !profile.ownedItems.includes(item.id)) return;
    soundEngine.playEquip();

    setProfile((prev) => {
      const currentlyEquipped = prev.equipped[item.slot] === item.id;
      const nextEquipped: EquippedAccessories = { ...prev.equipped };
      if (currentlyEquipped) {
        delete nextEquipped[item.slot];
      } else {
        (nextEquipped as Record<string, string>)[item.slot] = item.id;
      }
      return {
        ...prev,
        equipped: nextEquipped,
      };
    });
  };

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
    if (next) {
      stopSpeaking();
    }
  };

  const handleSaveSettings = (
    name: string,
    gender: PlayerGender,
    grade: number,
    shirtColor: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      name,
      gender,
      grade,
      shirtColor,
      equipped: filterEquippedForGender(prev.equipped, gender),
    }));
  };

  if (screen === 'start') {
    return (
      <div className="h-dvh w-screen overflow-hidden relative bg-slate-100">
        <StartScreen
          initialProfile={profile}
          isReturning={savedExists}
          onStart={handleStartGame}
          onOpenInspector={() => {
            soundEngine.playEquip();
            setStartInspectorOpen(true);
          }}
        />
        {startInspectorOpen && (
          <CurriculumInspectorModal onClose={() => setStartInspectorOpen(false)} />
        )}
      </div>
    );
  }

  const currentLesson =
    activeModal.type === 'lesson'
      ? getLessonForPlayer(
          activeModal.subject,
          profile.grade,
          profile.subjectCompletions[activeModal.subject] || 0
        )
      : null;

  return (
    <main className="h-dvh w-screen relative overflow-hidden bg-sky-100">
      {/* Dedicated isolated WebGL 3D School World (renders ONLY currentFloor for peak FPS) */}
      <SchoolCanvas3D
        currentFloor={currentFloor}
        gender={profile.gender}
        shirtColor={profile.shirtColor}
        equipped={profile.equipped}
        activeSubject={activeSubject}
        inGym={inGym}
        gymWearEquipped={gymWearEquipped}
        activePeLessonIndex={activePeLessonIndex}
        gymActionToken={gymActionToken}
        gymSpaceToken={gymSpaceToken}
        isPaused={isPaused}
        nudgeToken={nudgeToken}
        elevatorTeleportToken={elevatorTeleportToken}
        emoteRequest={emoteRequest}
        greetTriggerToken={greetTriggerToken}
        trashPickupToken={trashPickupToken}
        virtualControlsRef={virtualControlsRef}
        onEnterZone={handleEnterZone}
        onNearbyInactiveZone={setNearbyInactiveZone}
        onNearbyComingSoon={setNearbyComingSoon}
        onTeacherGreetingPromptChange={setTeacherGreetingPrompt}
        onTeacherGreetingOutcome={handleTeacherGreetingOutcome}
        onTrashPromptChange={setTrashPrompt}
        onTrashOutcome={handleTrashOutcome}
        onGymSnapshot={handleGymSnapshot}
        onGymPlayerEmote={(emote, dur) => setActiveEmote(dur ? emote : null)}
        onEmoteEnded={() => {
          setActiveEmote(null);
          if (emoteClearTimerRef.current !== null) {
            window.clearTimeout(emoteClearTimerRef.current);
            emoteClearTimerRef.current = null;
          }
        }}
      />

      {/* Always-visible lightweight Game HUD or Pure 3D Gym HUD */}
      {inGym ? (
        <GymHudOverlay
          profile={profile}
          activePeLessonIndex={activePeLessonIndex}
          snapshot={gymSnapshot}
          muted={muted}
          ethicsFeedback={ethicsFeedback}
          virtualControlsRef={virtualControlsRef}
          onToggleMute={handleToggleMute}
          onSelectLesson={(idx) => {
            gymPrevCompletedRef.current = false;
            setGymConfettiActive(false);
            setActivePeLessonIndex(idx);
          }}
          onActionTrigger={() => setGymActionToken((t) => t + 1)}
          onSpaceTapTrigger={() => setGymSpaceToken((t) => t + 1)}
          onExitGym={exitGym}
        />
      ) : (
        <HudOverlay
          profile={profile}
          currentFloor={currentFloor}
          activeSubject={activeSubject}
          muted={muted}
          isPaused={isPaused}
          activeEmote={activeEmote}
          nearbyInactiveZone={isPaused ? null : nearbyInactiveZone}
          nearbyComingSoon={isPaused ? null : nearbyComingSoon}
          teacherGreetingPrompt={isPaused ? null : teacherGreetingPrompt}
          trashPrompt={isPaused ? null : trashPrompt}
          ethicsFeedback={ethicsFeedback}
          virtualControlsRef={virtualControlsRef}
          onToggleMute={handleToggleMute}
          onOpenSchedule={() => {
            soundEngine.playEquip();
            setActiveModal({ type: 'schedule' });
          }}
          onOpenAwards={() => {
            soundEngine.playEquip();
            setActiveModal({ type: 'awards' });
          }}
          onOpenShop={() => {
            soundEngine.playEquip();
            setActiveModal({ type: 'shop' });
          }}
          onOpenInspector={() => {
            soundEngine.playEquip();
            setActiveModal({ type: 'inspector' });
          }}
          onOpenSettings={() => {
            soundEngine.playEquip();
            setActiveModal({ type: 'settings' });
          }}
          onEnterSpecificSubject={(subject) => {
            soundEngine.playEquip();
            if (subject === 'pe') {
              enterGym();
            } else {
              setActiveModal({ type: 'lesson', subject });
            }
          }}
          onTriggerEmote={(emote, durationSec) => {
            if (emote === 'salom' && teacherGreetingPrompt && !isPaused) {
              handleGreetTeacher();
            } else {
              handleTriggerEmote(emote, durationSec, false);
            }
          }}
          onGreetTeacher={handleGreetTeacher}
          onPickupTrash={handlePickupTrash}
        />
      )}

      {/* Pre-Gym Locker Room Outfit Check Modal */}
      {inGym && gymLockerOpen && !gymTransition && (
        <GymLockerModal
          profile={profile}
          onAttemptSchoolUniform={handleLockerAttemptSchoolUniform}
          onEquipSportswear={handleLockerEquipSportswear}
          onExitGym={exitGym}
        />
      )}

      {/* Confetti Celebration on completing a 3D PE lesson */}
      <ConfettiCanvas active={gymConfettiActive} zIndexClass="z-40" />

      {/* 0.5-Second Elevator Floor / Gym Transition Overlay */}
      {(elevatorTransition || gymTransition) && (
        <div className="fixed inset-0 z-[60] bg-slate-900/90 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl px-8 py-6 shadow-2xl border-2 border-sky-400 text-center max-w-md w-full">
            <div className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
              {gymTransition ? gymTransition : `🛗 ${elevatorTransition?.targetFloor}-qavatga o'tilmoqda...`}
            </div>
            {elevatorTransition && (
              <div className="text-sm font-medium text-slate-500 mt-1.5">
                {FLOOR_META[elevatorTransition.targetFloor].roomsSummary}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Elevator Modal (AutoFitModal, zero scroll) */}
      {activeModal.type === 'lift' && (
        <LiftModal
          currentFloor={currentFloor}
          activeSubject={activeSubject}
          onSelectFloor={handleSelectFloor}
          onClose={closeModalAndNudge}
        />
      )}

      {/* Interactive Lesson Modal */}
      {activeModal.type === 'lesson' && currentLesson && (
        <LessonModal
          lesson={currentLesson}
          grade={profile.grade}
          studentName={profile.name}
          onComplete={handleLessonComplete}
          onClose={closeModalAndNudge}
        />
      )}

      {/* 3D Accessories Shop Modal */}
      {activeModal.type === 'shop' && (
        <ShopModal
          profile={profile}
          onBuy={handleBuyItem}
          onToggleEquip={handleToggleEquip}
          onClose={closeModalAndNudge}
        />
      )}

      {/* Interactive School Schedule Modal (AutoFitModal, zero scroll) */}
      {activeModal.type === 'schedule' && (
        <ScheduleModal profile={profile} onClose={closeModalAndNudge} />
      )}

      {/* Multi-Category 3-Tier Awards Showcase Modal (AutoFitModal, zero scroll) */}
      {activeModal.type === 'awards' && (
        <AwardsModal profile={profile} onClose={() => setActiveModal({ type: 'none' })} />
      )}

      {/* Curriculum Inspector & Play-Test Modal */}
      {activeModal.type === 'inspector' && (
        <CurriculumInspectorModal onClose={() => setActiveModal({ type: 'none' })} />
      )}

      {/* Settings Modal (Change grade, name, gender, color) */}
      {activeModal.type === 'settings' && (
        <SettingsModal
          profile={profile}
          onSave={handleSaveSettings}
          onBackToStart={() => {
            setActiveModal({ type: 'none' });
            setTeacherGreetingPrompt(null);
            setTrashPrompt(null);
            setEthicsFeedback(null);
            setAwardCelebrationQueue([]);
            setScreen('start');
          }}
          onClose={() => setActiveModal({ type: 'none' })}
        />
      )}

      {/* Celebratory Medal Unlock Popup with Confetti & Fanfare */}
      {awardCelebrationQueue.length > 0 && (
        <AwardCelebrationPopup
          key={awardCelebrationQueue[0].id}
          award={awardCelebrationQueue[0]}
          remainingInQueue={awardCelebrationQueue.length - 1}
          onClose={() => {
            soundEngine.playEquip();
            setAwardCelebrationQueue((prev) => prev.slice(1));
          }}
        />
      )}
    </main>
  );
}
