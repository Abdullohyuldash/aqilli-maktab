import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EquippedAccessories,
  FloorNumber,
  PlayerGender,
  PlayerProfile,
  ShopItem,
  SubjectId,
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
import { soundEngine, stopSpeaking } from './utils/sound';
import { StartScreen } from './components/StartScreen';
import { SchoolCanvas3D } from './components/SchoolCanvas3D';
import { HudOverlay } from './components/HudOverlay';
import { LessonModal } from './components/LessonModal';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';
import { CurriculumInspectorModal } from './components/CurriculumInspectorModal';
import { ScheduleModal } from './components/ScheduleModal';
import { LiftModal } from './components/LiftModal';

export default function App() {
  const [savedExists] = useState<boolean>(() => Boolean(loadProfile()?.name));
  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile() || DEFAULT_PROFILE);
  const [screen, setScreen] = useState<'start' | 'school'>('start');

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
    | { type: 'lift' }
    | { type: 'settings' }
    | { type: 'inspector' }
  >({ type: 'none' });
  const [startInspectorOpen, setStartInspectorOpen] = useState(false);

  const [muted, setMuted] = useState(false);
  const [nudgeToken, setNudgeToken] = useState(0);
  const [nearbyInactiveZone, setNearbyInactiveZone] = useState<ZoneId | null>(null);
  const [nearbyComingSoon, setNearbyComingSoon] = useState<WorldZone | null>(null);

  const virtualControlsRef = useRef<VirtualControlsState>({
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
  });

  // Clean up elevator transition timers on unmount
  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Persist profile automatically to localStorage whenever state updates
  useEffect(() => {
    if (profile.name.trim().length >= 2) {
      saveProfile(profile);
    }
  }, [profile]);

  const gradeSubjectOrder = getSubjectOrderForGrade(profile.grade);
  const activeSubject: SubjectId =
    gradeSubjectOrder[profile.activeSubjectIndex % gradeSubjectOrder.length];

  const isPaused = activeModal.type !== 'none' || elevatorTransition !== null;

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

  const handleEnterZone = useCallback((zone: ZoneId) => {
    if (zone === 'elevator') {
      soundEngine.playEquip();
      setActiveModal({ type: 'lift' });
    } else if (zone === 'shop') {
      soundEngine.playEquip();
      setActiveModal({ type: 'shop' });
    } else if (zone === 'schedule') {
      soundEngine.playEquip();
      setActiveModal({ type: 'schedule' });
    } else if (zone in SUBJECT_META) {
      soundEngine.playEquip();
      setActiveModal({ type: 'lesson', subject: zone as SubjectId });
    }
  }, []);

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

  const handleLessonComplete = (earnedCoins: number) => {
    if (activeModal.type !== 'lesson') return;
    const finishedSubject = activeModal.subject;
    const finishedWasActive = finishedSubject === activeSubject;

    setProfile((prev) => ({
      ...prev,
      coins: prev.coins + earnedCoins,
      completedLessons: prev.completedLessons + 1,
      subjectCompletions: {
        ...prev.subjectCompletions,
        [finishedSubject]: (prev.subjectCompletions[finishedSubject] || 0) + 1,
      },
      activeSubjectIndex: finishedWasActive
        ? (prev.activeSubjectIndex + 1) % getSubjectOrderForGrade(prev.grade).length
        : prev.activeSubjectIndex,
    }));

    closeModalAndNudge();
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
        isPaused={isPaused}
        nudgeToken={nudgeToken}
        elevatorTeleportToken={elevatorTeleportToken}
        virtualControlsRef={virtualControlsRef}
        onEnterZone={handleEnterZone}
        onNearbyInactiveZone={setNearbyInactiveZone}
        onNearbyComingSoon={setNearbyComingSoon}
      />

      {/* Always-visible lightweight Game HUD */}
      <HudOverlay
        profile={profile}
        currentFloor={currentFloor}
        activeSubject={activeSubject}
        muted={muted}
        nearbyInactiveZone={isPaused ? null : nearbyInactiveZone}
        nearbyComingSoon={isPaused ? null : nearbyComingSoon}
        virtualControlsRef={virtualControlsRef}
        onToggleMute={handleToggleMute}
        onOpenSchedule={() => {
          soundEngine.playEquip();
          setActiveModal({ type: 'schedule' });
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
          setActiveModal({ type: 'lesson', subject });
        }}
      />

      {/* 0.5-Second Elevator Floor Transition Overlay */}
      {elevatorTransition && (
        <div className="fixed inset-0 z-[60] bg-slate-900/90 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl px-8 py-6 shadow-2xl border-2 border-sky-400 text-center max-w-md w-full">
            <div className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
              🛗 {elevatorTransition.targetFloor}-qavatga o&apos;tilmoqda...
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1.5">
              {FLOOR_META[elevatorTransition.targetFloor].roomsSummary}
            </div>
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
            setScreen('start');
          }}
          onClose={() => setActiveModal({ type: 'none' })}
        />
      )}
    </main>
  );
}
