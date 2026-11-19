import React from 'react';
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
  Volume2,
  VolumeX,
} from 'lucide-react';
import { FloorNumber, PlayerProfile, SubjectId, VirtualControlsState, WorldZone, ZoneId } from '../types';
import { SUBJECT_META } from '../data/curriculum';

interface HudOverlayProps {
  profile: PlayerProfile;
  currentFloor: FloorNumber;
  activeSubject: SubjectId;
  muted: boolean;
  nearbyInactiveZone: ZoneId | null;
  nearbyComingSoon: WorldZone | null;
  virtualControlsRef: React.MutableRefObject<VirtualControlsState>;
  onToggleMute: () => void;
  onOpenSchedule: () => void;
  onOpenShop: () => void;
  onOpenInspector: () => void;
  onOpenSettings: () => void;
  onEnterSpecificSubject: (subject: SubjectId) => void;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({
  profile,
  currentFloor,
  activeSubject,
  muted,
  nearbyInactiveZone,
  nearbyComingSoon,
  virtualControlsRef,
  onToggleMute,
  onOpenSchedule,
  onOpenShop,
  onOpenInspector,
  onOpenSettings,
  onEnterSpecificSubject,
}) => {
  const activeMeta = SUBJECT_META[activeSubject];
  const isLessonOnThisFloor = activeMeta.floor === currentFloor;

  const bannerMessage = isLessonOnThisFloor
    ? `🔔 Hozir ${activeMeta.name} darsi! ${activeMeta.roomName}ga kiring!`
    : `🔔 Hozir ${activeMeta.name} darsi (${activeMeta.floor}-qavat)! Liftga boring! 🛗`;

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

  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 sm:p-4">
      {/* TOP BAR: 3 clean zones (Student Info + Floor | Active Lesson Banner | Coins & Actions) */}
      <div className="flex flex-wrap lg:flex-nowrap items-start justify-between gap-2.5 sm:gap-4">
        {/* Top-Left: Student Profile, Current Floor & Completed Lessons */}
        <div className="pointer-events-auto bg-white/95 border border-slate-200 rounded-2xl px-4 py-2.5 shadow-md flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-display font-extrabold text-base shrink-0 shadow-sm"
            style={{ backgroundColor: profile.shirtColor }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[240px]">
              {profile.name} <span className="text-slate-400 font-normal">·</span>{' '}
              <span className="text-blue-700">{profile.grade}-sinf</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-mono-num">
              <span className="font-bold text-slate-800">🏢 {currentFloor}-qavat</span>
              <span className="text-slate-300">·</span>
              <span>
                Darslar: <strong className="text-slate-800">{profile.completedLessons}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Top-Center: Smart Active Lesson / Elevator Guidance Banner */}
        <div className="pointer-events-auto order-3 lg:order-2 w-full lg:w-auto flex justify-center">
          <div
            className="bg-white/95 border-2 rounded-2xl px-4 sm:px-5 py-2.5 shadow-md flex items-center gap-3 max-w-2xl"
            style={{ borderColor: activeMeta.color }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: activeMeta.color }}
            >
              <Bell className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-500">
                {isLessonOnThisFloor
                  ? `Dars bildirishnomasi · ${currentFloor}-qavat`
                  : `Boshqa qavatda dars · ${activeMeta.floor}-qavatga chiqing`}
              </div>
              <div className="text-sm sm:text-base font-display font-bold text-slate-900 leading-snug">
                {bannerMessage}
              </div>
            </div>
          </div>
        </div>

        {/* Top-Right: Coins + Schedule + Shop + Inspector + Mute + Settings */}
        <div className="pointer-events-auto order-2 lg:order-3 flex items-center gap-2">
          <div
            className="bg-amber-50 border border-amber-300 rounded-xl px-3.5 py-2 shadow-sm flex items-center gap-2"
            title="Yig'ilgan ballaringiz"
          >
            <Coins className="w-5 h-5 text-amber-500 shrink-0" />
            <span className="font-mono-num font-bold text-sm sm:text-base text-amber-950 whitespace-nowrap">
              {profile.coins} ball
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenSchedule}
            className="h-10 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            title="Dars jadvalini ko'rish"
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Jadval</span>
          </button>

          <button
            type="button"
            onClick={onOpenShop}
            className="h-10 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            title="Maktab do'konini ochish"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Do&apos;kon</span>
          </button>

          <button
            type="button"
            onClick={onOpenInspector}
            className="h-10 px-3 rounded-xl bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-sm shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Barcha darslar va savollarni tekshirish"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Darslar</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="h-10 w-10 rounded-xl bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-sm transition-colors flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
            aria-label={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="h-10 w-10 rounded-xl bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-sm transition-colors flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Sozlamalar (sinf va kiyim)"
            aria-label="Sozlamalar"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BOTTOM AREA: Controls hint (left) + Contextual Room Toast (center) + Touch Pad (right) */}
      <div className="flex items-end justify-between gap-4">
        {/* Bottom-Left: Subtle keyboard hint on desktop */}
        <div className="hidden md:block pointer-events-auto bg-white/92 border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm text-xs text-slate-600">
          <span className="font-mono-num font-bold text-slate-900">WASD / Strelkalar</span> — yurish
          <span className="mx-2 text-slate-300">|</span>
          <span className="font-mono-num font-bold text-slate-900">Space</span> — sakrash
        </div>

        {/* Bottom-Center: Non-blocking Coming-Soon Toast OR Optional Inactive Room Entry */}
        {nearbyComingSoon ? (
          <div className="pointer-events-auto mx-auto bg-slate-900/95 border border-slate-700 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm">
              <div className="font-display font-bold text-white">{nearbyComingSoon.title}</div>
              <div className="text-amber-200 font-medium">Bu xona tez orada ochiladi!</div>
            </div>
          </div>
        ) : nearbyMeta ? (
          <div className="pointer-events-auto mx-auto bg-white/95 border border-slate-200 rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-3">
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

        {/* Bottom-Right: On-Screen Movement & Jump Controls */}
        <div className="pointer-events-auto ml-auto flex items-end gap-2.5 select-none">
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

          <button
            type="button"
            {...makeHoldHandlers('jump')}
            className="h-14 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-display font-bold text-sm shadow-md transition-colors cursor-pointer touch-none whitespace-nowrap"
          >
            Sakrash
          </button>
        </div>
      </div>
    </div>
  );
};
