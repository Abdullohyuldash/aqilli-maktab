import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  BookOpen,
  CalendarDays,
  Coins,
  DoorOpen,
  Lock,
  Settings,
  ShoppingBag,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  AvatarEmote,
  EthicsFeedbackToast,
  FloorNumber,
  PlayerProfile,
  SubjectId,
  TeacherGreetingPrompt,
  TrashPickupPrompt,
  VirtualControlsState,
  WorldZone,
  ZoneId,
} from '../types';
import { SUBJECT_META } from '../data/curriculum';
import { ALL_AWARDS } from '../data/awards';

const EMOTE_MENU_ITEMS: {
  id: AvatarEmote;
  icon: string;
  label: string;
  durationSec: number;
}[] = [
  { id: 'salom', icon: '✋', label: 'Salom berish', durationSec: 2.75 },
  { id: 'qarsak', icon: '👏', label: 'Qarsak chalish', durationSec: 2.8 },
  { id: 'quvonch', icon: '🎉', label: 'Quvonish', durationSec: 2.85 },
  { id: 'milliy_raqs', icon: '💃', label: 'Milliy raqs', durationSec: 3.0 },
];

interface HudOverlayProps {
  profile: PlayerProfile;
  currentFloor: FloorNumber;
  activeSubject: SubjectId;
  muted: boolean;
  isPaused: boolean;
  activeEmote: AvatarEmote | null;
  nearbyInactiveZone: ZoneId | null;
  nearbyComingSoon: WorldZone | null;
  teacherGreetingPrompt: TeacherGreetingPrompt | null;
  trashPrompt: TrashPickupPrompt | null;
  ethicsFeedback: EthicsFeedbackToast | null;
  virtualControlsRef: React.MutableRefObject<VirtualControlsState>;
  onToggleMute: () => void;
  onOpenSchedule: () => void;
  onOpenAwards: () => void;
  onOpenShop: () => void;
  onOpenInspector: () => void;
  onOpenSettings: () => void;
  onEnterSpecificSubject: (subject: SubjectId) => void;
  onTriggerEmote: (emote: AvatarEmote, durationSec?: number) => void;
  onGreetTeacher: () => void;
  onPickupTrash: () => void;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({
  profile,
  currentFloor,
  activeSubject,
  muted,
  isPaused,
  activeEmote,
  nearbyInactiveZone,
  nearbyComingSoon,
  teacherGreetingPrompt,
  trashPrompt,
  ethicsFeedback,
  virtualControlsRef,
  onToggleMute,
  onOpenSchedule,
  onOpenAwards,
  onOpenShop,
  onOpenInspector,
  onOpenSettings,
  onEnterSpecificSubject,
  onTriggerEmote,
  onGreetTeacher,
  onPickupTrash,
}) => {
  const [emotesOpen, setEmotesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);
  const emoteMenuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isPaused) {
      setEmotesOpen(false);
      setProfileOpen(false);
      setProfileHovered(false);
    }
  }, [isPaused]);

  useEffect(() => {
    if (!emotesOpen && !profileOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (emotesOpen && emoteMenuRef.current && !emoteMenuRef.current.contains(target)) {
        setEmotesOpen(false);
      }
      if (profileOpen && profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEmotesOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [emotesOpen, profileOpen]);

  const activeMeta = SUBJECT_META[activeSubject];
  const isLessonOnThisFloor = activeMeta.floor === currentFloor;
  const showProfilePopover = (profileOpen || profileHovered) && !isPaused;

  const bannerMessage = isLessonOnThisFloor
    ? `Hozir ${activeMeta.name} darsi — ${activeMeta.roomName}ga kiring`
    : `${activeMeta.name} darsi (${activeMeta.floor}-qavat) — Liftga boring`;

  const setControl = (key: keyof VirtualControlsState, value: boolean) => {
    virtualControlsRef.current[key] = value;
  };

  const makeHoldHandlers = (key: keyof VirtualControlsState) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      setControl(key, true);
    },
    onPointerUp: () => setControl(key, false),
    onPointerLeave: () => setControl(key, false),
    onPointerCancel: () => setControl(key, false),
  });

  const nearbyMeta =
    nearbyInactiveZone &&
    nearbyInactiveZone in SUBJECT_META
      ? SUBJECT_META[nearbyInactiveZone as SubjectId]
      : null;

  const stopHudEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const hudGuardProps = {
    onPointerDown: stopHudEvent,
    onWheel: stopHudEvent,
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 sm:p-4">
      {/* TOP BAR: Clean Minimalist 3-Zone HUD (Profile | Single-line Lesson Strip | Coins & Actions) */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5 sm:gap-3">
        {/* Top-Left: Minimalist Profile Chip ([Initial] + Name) with Hover/Click Stats Popover */}
        <div
          ref={profileMenuRef}
          {...hudGuardProps}
          onMouseEnter={() => setProfileHovered(true)}
          onMouseLeave={() => setProfileHovered(false)}
          className="pointer-events-auto relative shrink-0"
        >
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={showProfilePopover}
            aria-haspopup="dialog"
            className="h-10 pl-1.5 pr-3.5 rounded-full bg-white/92 backdrop-blur-md hover:bg-white border border-slate-200/90 shadow-sm transition-colors flex items-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="O'quvchi ma'lumotlari"
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-display font-extrabold text-xs shrink-0 shadow-xs"
              style={{ backgroundColor: profile.shirtColor }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-bold text-slate-900 truncate max-w-[130px] sm:max-w-[170px] whitespace-nowrap">
              {profile.name}
            </span>
          </button>

          {showProfilePopover && (
            <div
              role="dialog"
              aria-label="O'quvchi statistikasi"
              className="absolute top-full left-0 mt-2 w-56 bg-white/96 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-3.5 text-xs text-slate-700 z-30"
            >
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-display font-extrabold text-sm shrink-0"
                  style={{ backgroundColor: profile.shirtColor }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-sm text-slate-900 truncate">
                    {profile.name}
                  </div>
                  <div className="text-slate-500 font-medium">{profile.grade}-sinf o&apos;quvchisi</div>
                </div>
              </div>

              <div className="pt-2.5 space-y-1.5 font-mono-num">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Joriy qavat</span>
                  <span className="font-bold text-slate-900">{currentFloor}-qavat</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bajarilgan darslar</span>
                  <span className="font-bold text-slate-900">{profile.completedLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Medallar</span>
                  <span className="font-bold text-slate-900">
                    {profile.unlockedAwards.length} / {ALL_AWARDS.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top-Center: Sleek Single-Line Lesson Guidance Strip */}
        <div
          {...hudGuardProps}
          className="pointer-events-auto order-3 lg:order-2 w-full lg:w-auto flex justify-center min-w-0"
        >
          <div
            className="h-10 bg-white/92 backdrop-blur-md border rounded-full pl-2 pr-4 shadow-sm flex items-center gap-2.5 max-w-full lg:max-w-xl"
            style={{ borderColor: `${activeMeta.color}55` }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: activeMeta.color }}
              aria-hidden="true"
            >
              <Bell className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs sm:text-sm font-display font-bold text-slate-900 truncate whitespace-nowrap">
              {bannerMessage}
            </span>
          </div>
        </div>

        {/* Top-Right: Clean Coins + Compact Trophy + Uniform h-10 Actions */}
        <div
          {...hudGuardProps}
          className="pointer-events-auto order-2 lg:order-3 flex items-center gap-1.5 sm:gap-2 shrink-0"
        >
          <div
            className="h-10 px-3 rounded-xl bg-amber-50/95 backdrop-blur-md border border-amber-300/90 shadow-sm flex items-center gap-1.5 shrink-0"
            title="Tangalar"
          >
            <Coins className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-mono-num font-extrabold text-sm text-amber-950 whitespace-nowrap">
              {profile.coins}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenAwards}
            className="h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-amber-300 shadow-sm transition-colors flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title={`Yutuqlar (${profile.unlockedAwards.length}/${ALL_AWARDS.length})`}
            aria-label="Yutuqlar"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenSchedule}
            className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            title="Dars jadvali"
            aria-label="Dars jadvali"
          >
            <CalendarDays className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenShop}
            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            title="Maktab do'koni"
            aria-label="Maktab do'koni"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenInspector}
            className="w-10 h-10 rounded-xl bg-white/92 backdrop-blur-md hover:bg-slate-100 border border-slate-200/90 text-blue-600 shadow-sm transition-colors flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Barcha darslar"
            aria-label="Barcha darslar"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="h-10 w-10 rounded-xl bg-white/92 backdrop-blur-md hover:bg-slate-100 border border-slate-200/90 text-slate-700 shadow-sm transition-colors flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
            aria-label={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="h-10 w-10 rounded-xl bg-white/92 backdrop-blur-md hover:bg-slate-100 border border-slate-200/90 text-slate-700 shadow-sm transition-colors flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Sozlamalar"
            aria-label="Sozlamalar"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FLOATING ETHICS REWARD / PENALTY FEEDBACK BANNER (non-obstructive upper-center) */}
      {ethicsFeedback && (
        <div
          key={ethicsFeedback.id}
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 px-3"
        >
          <div
            className={`rounded-2xl px-5 py-3 shadow-xl border-2 flex items-center gap-3 transition-transform duration-300 ${
              ethicsFeedback.kind === 'reward'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold shrink-0 ${
                ethicsFeedback.kind === 'reward'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {ethicsFeedback.kind === 'reward' ? '⭐' : '😔'}
            </div>
            <div className="leading-tight">
              <div className="font-display font-extrabold text-sm sm:text-base whitespace-nowrap">
                {ethicsFeedback.title}
              </div>
              <div
                className={`text-xs font-semibold mt-0.5 ${
                  ethicsFeedback.kind === 'reward' ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {ethicsFeedback.subtitle}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM AREA: D-Pad Movement (left) + Contextual Prompts (center) + Emotes & Jump (right) */}
      <div className="flex items-end justify-between gap-3 sm:gap-4">
        {/* Bottom-Left: Ergonomic Left-Thumb Movement D-Pad */}
        <div
          {...hudGuardProps}
          className="pointer-events-auto select-none shrink-0"
        >
          <div className="grid grid-cols-3 gap-1.5 bg-white/92 border border-slate-200 p-2 rounded-2xl shadow-md">
            <div />
            <button
              type="button"
              {...makeHoldHandlers('up')}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-blue-600 active:text-white text-slate-800 flex items-center justify-center transition-colors cursor-pointer touch-none"
              aria-label="Oldinga yurish"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />
            <button
              type="button"
              {...makeHoldHandlers('left')}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-blue-600 active:text-white text-slate-800 flex items-center justify-center transition-colors cursor-pointer touch-none"
              aria-label="Chapga yurish"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              {...makeHoldHandlers('down')}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-blue-600 active:text-white text-slate-800 flex items-center justify-center transition-colors cursor-pointer touch-none"
              aria-label="Orqaga yurish"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              type="button"
              {...makeHoldHandlers('right')}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-blue-600 active:text-white text-slate-800 flex items-center justify-center transition-colors cursor-pointer touch-none"
              aria-label="O'ngga yurish"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom-Center: Teacher Greeting Prompt (priority) OR Trash Pickup OR Coming-Soon / Inactive Room Toast */}
        {teacherGreetingPrompt && !isPaused ? (
          <div
            {...hudGuardProps}
            role="dialog"
            aria-label="Ustozga salom berish"
            className="pointer-events-auto mx-auto bg-white border-2 border-amber-400 rounded-2xl px-4 py-3 shadow-xl flex flex-col gap-2 min-w-[270px] sm:min-w-[360px] max-w-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                  <span>👨‍🏫 {teacherGreetingPrompt.teacherName}</span>
                  <span className="text-slate-300">·</span>
                  <span
                    className={`font-mono-num font-extrabold ${
                      teacherGreetingPrompt.timeRemainingSec <= 2 ? 'text-rose-600' : 'text-amber-700'
                    }`}
                  >
                    {Math.max(1, Math.ceil(teacherGreetingPrompt.timeRemainingSec))}s
                  </span>
                </div>
                <div className="font-display font-extrabold text-sm sm:text-base text-slate-900">
                  Ustozga salom bering!
                </div>
              </div>

              <button
                type="button"
                onClick={onGreetTeacher}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-display font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span aria-hidden="true">✋</span>
                <span>Salom berish (E)</span>
              </button>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  teacherGreetingPrompt.timeRemainingSec <= 2 ? 'bg-rose-500' : 'bg-amber-400'
                }`}
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      (teacherGreetingPrompt.timeRemainingSec / teacherGreetingPrompt.totalTimeSec) * 100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        ) : trashPrompt && !isPaused ? (
          trashPrompt.mode === 'carrying' ? (
            <div
              {...hudGuardProps}
              role="status"
              aria-live="polite"
              className="pointer-events-auto mx-auto bg-emerald-900/95 border border-emerald-400 text-emerald-50 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-xs sm:text-sm font-display font-bold whitespace-nowrap"
            >
              <span aria-hidden="true">🗑️</span>
              <span>Axlat qutisiga olib boring</span>
              <span className="text-emerald-300/80 font-normal">·</span>
              <span className="text-emerald-200 font-semibold">{trashPrompt.trashLabel}</span>
            </div>
          ) : trashPrompt.mode === 'dropoff' ? (
            <div
              {...hudGuardProps}
              role="dialog"
              aria-label="Chiqindini axlat qutisiga tashlash"
              className="pointer-events-auto mx-auto bg-white border-2 border-emerald-500 rounded-2xl px-4 py-3 shadow-xl flex items-center justify-between gap-3 min-w-[260px] sm:min-w-[340px] max-w-md"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold text-emerald-700">
                  🗑️ {trashPrompt.trashLabel}
                </div>
                <div className="font-display font-extrabold text-sm sm:text-base text-slate-900">
                  Qutiga tashlash [E]
                </div>
              </div>

              <button
                type="button"
                onClick={onPickupTrash}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-display font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span aria-hidden="true">🗑️</span>
                <span>Qutiga tashlash (E)</span>
              </button>
            </div>
          ) : (
            <div
              {...hudGuardProps}
              role="dialog"
              aria-label="Chiqindini olish"
              className="pointer-events-auto mx-auto bg-white border-2 border-amber-400 rounded-2xl px-4 py-3 shadow-xl flex flex-col gap-2 min-w-[270px] sm:min-w-[370px] max-w-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <span>♻️ {trashPrompt.trashLabel}</span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={`font-mono-num font-extrabold ${
                        trashPrompt.timeRemainingSec <= 5 ? 'text-rose-600' : 'text-amber-700'
                      }`}
                    >
                      {Math.max(1, Math.ceil(trashPrompt.timeRemainingSec))}s
                    </span>
                  </div>
                  <div className="font-display font-extrabold text-sm sm:text-base text-slate-900">
                    Chiqindini oling va qutiga olib boring!
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onPickupTrash}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-display font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <span aria-hidden="true">✋</span>
                  <span>Olish (E)</span>
                </button>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    trashPrompt.timeRemainingSec <= 5 ? 'bg-rose-500' : 'bg-amber-400'
                  }`}
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(
                        100,
                        (trashPrompt.timeRemainingSec / trashPrompt.totalTimeSec) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          )
        ) : nearbyComingSoon ? (
          <div
            {...hudGuardProps}
            className="pointer-events-auto mx-auto bg-slate-900/95 border border-slate-700 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm">
              <div className="font-display font-bold text-white">{nearbyComingSoon.title}</div>
              <div className="text-amber-200 font-medium">Bu xona tez orada ochiladi!</div>
            </div>
          </div>
        ) : nearbyMeta ? (
          <div
            {...hudGuardProps}
            className="pointer-events-auto mx-auto bg-white/95 border border-slate-200 rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-3"
          >
            <div className="text-xs sm:text-sm">
              <div className="font-bold text-slate-900">{nearbyMeta.roomName}</div>
              <div className="text-slate-500">
                Hozir {activeMeta.name} darsi, lekin bu xonaga ham kirishingiz mumkin.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEnterSpecificSubject(nearbyMeta.id)}
              className="px-3.5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: nearbyMeta.color }}
            >
              <DoorOpen className="w-4 h-4" />
              Kirish
            </button>
          </div>
        ) : null}

        {/* Bottom-Right: Right-Hand Emotes & Jump Controls */}
        <div
          {...hudGuardProps}
          className="pointer-events-auto flex flex-col items-end gap-2 select-none shrink-0"
        >
            {/* Compact Emotes Trigger & Popover Menu */}
            <div ref={emoteMenuRef} className="relative">
              {emotesOpen && (
                <div
                  role="menu"
                  aria-label="Odobli harakatlar menyusi"
                  className="absolute bottom-full right-0 mb-2.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1"
                >
                  <div className="flex items-center justify-between px-2.5 py-1 border-b border-slate-100 mb-1">
                    <span className="text-xs font-semibold text-slate-500">Odobli harakatlar</span>
                    <button
                      type="button"
                      onClick={() => setEmotesOpen(false)}
                      className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Menyuni yopish"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {EMOTE_MENU_ITEMS.map((item) => {
                    const isCurrent = activeEmote === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onTriggerEmote(item.id, item.durationSec);
                          setEmotesOpen(false);
                        }}
                        className={`w-full min-h-[42px] px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          isCurrent
                            ? 'bg-amber-50 text-amber-900 border border-amber-300'
                            : 'text-slate-800 hover:bg-slate-100 active:bg-slate-200 border border-transparent'
                        }`}
                      >
                        <span className="text-lg leading-none" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={() => setEmotesOpen((prev) => !prev)}
                aria-expanded={emotesOpen}
                aria-haspopup="menu"
                className={`h-11 px-3.5 rounded-2xl border font-display font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  emotesOpen || activeEmote
                    ? 'bg-amber-400 hover:bg-amber-500 border-amber-500 text-slate-950'
                    : 'bg-white/95 hover:bg-amber-50 border-slate-200 text-slate-800'
                }`}
                title="Odobli harakatlar (Emotes)"
              >
                <span aria-hidden="true">😊</span>
                <span>Harakatlar</span>
              </button>
            </div>

            <button
              type="button"
              {...makeHoldHandlers('jump')}
              className="h-14 w-full px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-display font-bold text-sm shadow-md transition-colors cursor-pointer touch-none whitespace-nowrap"
            >
              Sakrash
            </button>
        </div>
      </div>
    </div>
  );
};
