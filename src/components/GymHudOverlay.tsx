import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Coins,
  DoorOpen,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import {
  EthicsFeedbackToast,
  GymGameSnapshot,
  PlayerProfile,
  VirtualControlsState,
} from '../types';
import { PE_GRADE_1_LESSONS } from '../data/peGrade1';
import { soundEngine, speakUzbek, stopSpeaking } from '../utils/sound';

interface GymHudOverlayProps {
  profile: PlayerProfile;
  activePeLessonIndex: number;
  snapshot: GymGameSnapshot | null;
  muted: boolean;
  ethicsFeedback: EthicsFeedbackToast | null;
  virtualControlsRef: React.MutableRefObject<VirtualControlsState>;
  onToggleMute: () => void;
  onSelectLesson: (index: number) => void;
  onActionTrigger: () => void;
  onSpaceTapTrigger: () => void;
  onExitGym: () => void;
}

export const GymHudOverlay: React.FC<GymHudOverlayProps> = ({
  profile,
  activePeLessonIndex,
  snapshot,
  muted,
  ethicsFeedback,
  virtualControlsRef,
  onToggleMute,
  onSelectLesson,
  onActionTrigger,
  onSpaceTapTrigger,
  onExitGym,
}) => {
  const [showSelector, setShowSelector] = useState(false);

  const lessonPlan = PE_GRADE_1_LESSONS[activePeLessonIndex] || PE_GRADE_1_LESSONS[0];
  const commandText = snapshot?.commandText || lessonPlan.ruleTitle;
  const subHintText = snapshot?.subHintText || lessonPlan.explanation;
  const step = snapshot?.step ?? 0;
  const totalSteps = snapshot?.totalSteps ?? 3;
  const completed = Boolean(snapshot?.completed);

  useEffect(() => {
    stopSpeaking();
  }, [activePeLessonIndex]);

  const handleSpeakTeacher = () => {
    soundEngine.playEquip();
    speakUzbek(`Ustoz Rustam: ${commandText}. ${subHintText}`);
  };

  const setControl = (key: keyof VirtualControlsState, value: boolean) => {
    virtualControlsRef.current[key] = value;
  };

  const makeHoldHandlers = (key: keyof VirtualControlsState) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setControl(key, true);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.stopPropagation();
      setControl(key, false);
    },
    onPointerLeave: () => setControl(key, false),
    onPointerCancel: () => setControl(key, false),
  });

  const stopHudEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const hudGuardProps = {
    onPointerDown: stopHudEvent,
    onWheel: stopHudEvent,
  };

  const sweetMin = snapshot?.timingSweetMin ?? 35;
  const sweetMax = snapshot?.timingSweetMax ?? 65;
  const timingVal = Math.max(0, Math.min(100, snapshot?.timingValue ?? 50));

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 z-30 select-none">
      {/* TOP BAR & USTOZ RUSTAM LIVE COMMAND STRIP */}
      <div className="flex flex-col gap-2.5 items-center w-full">
        {/* Top Header Bar */}
        <div
          {...hudGuardProps}
          className="w-full flex flex-wrap items-center justify-between gap-2 bg-slate-900/88 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl pointer-events-auto border border-sky-500/35"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0" aria-hidden="true">
              🏃
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-sky-300 font-bold">
                <span>3D Sport Zali · 1-Sinf</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-300 font-mono-num">
                  Bosqich: {Math.min(step + (completed ? 0 : 1), totalSteps)}/{totalSteps}
                </span>
                {snapshot?.timerSec !== null && snapshot?.timerSec !== undefined && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span
                      className={`font-mono-num ${
                        snapshot.timerSec <= 3 ? 'text-rose-400 font-extrabold' : 'text-amber-300'
                      }`}
                    >
                      ⏱ {Math.ceil(snapshot.timerSec)}s
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm font-display font-extrabold text-white truncate">
                {lessonPlan.topicTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playEquip();
                setShowSelector((prev) => !prev);
              }}
              className="h-9 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dars tanlash (1–34)</span>
            </button>

            <div
              className="h-9 px-3 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-mono-num font-bold border border-amber-500/35 flex items-center gap-1.5"
              title="Tangalar"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile.coins}</span>
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center transition cursor-pointer"
              title={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
              aria-label={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onExitGym}
              className="h-9 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>Zaldan chiqish</span>
            </button>
          </div>
        </div>

        {/* Ustoz Rustam Live Command Strip (compact, non-blocking) */}
        <div
          {...hudGuardProps}
          className="pointer-events-auto max-w-2xl w-full bg-white/94 backdrop-blur-md border-2 border-sky-400/70 rounded-2xl px-4 py-2.5 shadow-lg flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
              👨‍🏫
            </div>
            <div className="min-w-0">
              <div className="font-display font-extrabold text-sm sm:text-base text-slate-900 truncate">
                {commandText}
              </div>
              <div className="text-xs font-medium text-slate-600 truncate">{subHintText}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Lesson 19: KUN / TUN live badge */}
            {snapshot?.dayNightPhase && (
              <div
                className={`px-3 py-1.5 rounded-xl font-display font-extrabold text-xs border-2 shadow-xs ${
                  snapshot.dayNightPhase === 'kun'
                    ? 'bg-amber-100 border-amber-400 text-amber-900'
                    : 'bg-indigo-950 border-indigo-500 text-indigo-100 animate-pulse'
                }`}
              >
                {snapshot.dayNightPhase === 'kun' ? '☀️ KUN — YUGUR!' : '🌙 TUN — QOTIB TUR!'}
              </div>
            )}

            <button
              type="button"
              onClick={handleSpeakTeacher}
              className="h-9 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold border border-sky-300 transition flex items-center gap-1.5 cursor-pointer"
              title="Ustoz ko'rsatmasini tinglash"
            >
              <span>🔊</span>
              <span className="hidden sm:inline">Tinglash</span>
            </button>
          </div>
        </div>
      </div>

      {/* LESSON SELECTOR DRAWER MODAL (1–34) */}
      {showSelector && (
        <div
          {...hudGuardProps}
          className="fixed top-20 left-4 right-4 max-w-2xl mx-auto bg-slate-900/96 backdrop-blur-lg border border-sky-500/45 rounded-2xl p-4 shadow-2xl pointer-events-auto max-h-[68vh] overflow-y-auto z-40"
        >
          <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
            <h3 className="text-white font-display font-bold text-sm">
              Jismoniy tarbiya: Barcha 34 ta 3D dars
            </h3>
            <button
              type="button"
              onClick={() => setShowSelector(false)}
              className="text-slate-300 hover:text-white text-xs font-bold px-2.5 py-1 bg-slate-800 rounded-lg cursor-pointer"
            >
              ✕ Yopish
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PE_GRADE_1_LESSONS.map((l, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundEngine.playEquip();
                  onSelectLesson(idx);
                  setShowSelector(false);
                }}
                className={`text-left p-2.5 rounded-xl text-xs transition border cursor-pointer ${
                  activePeLessonIndex === idx
                    ? 'bg-sky-600 text-white border-sky-400 font-bold shadow-lg'
                    : 'bg-slate-800/85 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div className="text-[10px] text-sky-300 font-bold">{idx + 1}-dars</div>
                <div className="truncate">{l.topicTitle.split(':')[1]?.trim() || l.topicTitle}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FLOATING ETHICS / LOCKER ROOM FEEDBACK TOAST */}
      {ethicsFeedback && (
        <div
          key={ethicsFeedback.id}
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed top-32 left-1/2 -translate-x-1/2 z-40 px-3"
        >
          <div
            className={`rounded-2xl px-5 py-3 shadow-xl border-2 flex items-center gap-3 ${
              ethicsFeedback.kind === 'reward'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-extrabold shrink-0 ${
                ethicsFeedback.kind === 'reward'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {ethicsFeedback.kind === 'reward' ? '⭐' : '⚠️'}
            </div>
            <div className="leading-tight max-w-md">
              <div className="font-display font-extrabold text-sm">
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

      {/* BOTTOM CONTROLS & CONTEXTUAL 3D MECHANIC BARS */}
      <div className="flex items-end justify-between gap-3 w-full">
        {/* Bottom-Left: Movement D-Pad */}
        <div {...hudGuardProps} className="pointer-events-auto select-none shrink-0">
          <div className="grid grid-cols-3 gap-1.5 bg-white/92 border border-slate-200 p-2 rounded-2xl shadow-md">
            <div />
            <button
              type="button"
              {...makeHoldHandlers('up')}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-sky-600 active:text-white text-slate-800 flex items-center justify-center transition-colors cursor-pointer touch-none"
              aria-label="Oldinga yurish"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />
            <button
              type="button"
              {...makeHoldHandlers('left')}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-sky-600 active:text-white text-slate-800 flex items-center justify-center transition-colors cursor-pointer touch-none"
              aria-label="Chapga yurish"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              {...makeHoldHandlers('down')}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-sky-600 active:text-white text-slate-800 flex items-center justify-center transition-colors cursor-pointer touch-none"
              aria-label="Orqaga yurish"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              type="button"
              {...makeHoldHandlers('right')}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-sky-600 active:text-white text-slate-800 flex items-center justify-center transition-colors cursor-pointer touch-none"
              aria-label="O'ngga yurish"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom-Center: Pure 3D Contextual HUD (Timing Bar / Shashka Hint / Action Prompt / Completion) */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-md mx-auto">
          {/* 3D Shashka Board Active Banner */}
          {snapshot?.shashkaActive && !completed && (
            <div
              {...hudGuardProps}
              className="pointer-events-auto w-full bg-slate-900/92 border-2 border-amber-400 rounded-2xl px-4 py-2.5 text-white shadow-xl flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase">
                  3D Shashka Doskasi
                </div>
                <div className="text-sm font-display font-bold">
                  {snapshot.shashkaTurnHint || 'Oq donani va yashil katakni bosing'}
                </div>
              </div>
              <button
                type="button"
                onClick={onActionTrigger}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold cursor-pointer shrink-0"
              >
                Turish (E)
              </button>
            </div>
          )}

          {/* Timing / Power / Aim Bar for Apparatus, Long Jump & Ball Throw */}
          {snapshot?.timingActive && !completed && (
            <div
              {...hudGuardProps}
              className="pointer-events-auto w-full bg-slate-900/92 border-2 border-sky-400 rounded-2xl px-4 py-3 text-white shadow-xl space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-sky-300">{snapshot.timingLabel}</span>
                <span className="font-mono-num text-emerald-300">{timingVal}%</span>
              </div>
              <div className="relative h-5 rounded-full bg-slate-800 border border-slate-600 overflow-hidden">
                {/* Green Sweet Spot Zone */}
                <div
                  className="absolute top-0 bottom-0 bg-emerald-500/55 border-x-2 border-emerald-300"
                  style={{
                    left: `${sweetMin}%`,
                    width: `${Math.max(4, sweetMax - sweetMin)}%`,
                  }}
                />
                {/* Moving Needle */}
                <div
                  className="absolute top-0 bottom-0 w-2 -ml-1 bg-amber-300 rounded-full shadow-[0_0_8px_#fcd34d]"
                  style={{ left: `${timingVal}%` }}
                />
              </div>
            </div>
          )}

          {/* Contextual Action Prompt Pill */}
          {snapshot?.actionPrompt && !completed && (
            <div {...hudGuardProps} className="pointer-events-auto">
              <button
                type="button"
                onClick={() => {
                  if (snapshot.actionPrompt?.startsWith('E')) {
                    onActionTrigger();
                  } else {
                    onSpaceTapTrigger();
                  }
                }}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-display font-bold text-xs sm:text-sm shadow-xl border-2 border-emerald-300 flex items-center gap-2 cursor-pointer transition"
              >
                <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{snapshot.actionPrompt}</span>
              </button>
            </div>
          )}

          {/* Lesson Completed Celebration Card */}
          {completed && (
            <div
              {...hudGuardProps}
              className="pointer-events-auto w-full bg-emerald-950/95 border-2 border-emerald-400 rounded-2xl px-5 py-3.5 text-center text-white shadow-2xl space-y-2"
            >
              <div className="font-display font-black text-base sm:text-lg text-emerald-300">
                🏆 Barakalla! +25 🪙 olindi!
              </div>
              <div className="flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playEquip();
                    const nextIdx = (activePeLessonIndex + 1) % PE_GRADE_1_LESSONS.length;
                    onSelectLesson(nextIdx);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  Keyingi dars ➡️
                </button>
                <button
                  type="button"
                  onClick={onExitGym}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Zaldan chiqish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom-Right: [E] Harakat + Space Sakrash/Bajarish */}
        <div
          {...hudGuardProps}
          className="pointer-events-auto flex flex-col items-end gap-2 select-none shrink-0"
        >
          {snapshot?.actionPrompt && !completed && (
            <button
              type="button"
              onClick={onActionTrigger}
              className="h-11 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-display font-extrabold text-xs shadow-md border border-amber-500 cursor-pointer whitespace-nowrap"
            >
              Harakat (E)
            </button>
          )}
          <button
            type="button"
            {...makeHoldHandlers('jump')}
            className="h-14 px-5 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-display font-bold text-sm shadow-md transition-colors cursor-pointer touch-none whitespace-nowrap"
          >
            Sakrash
          </button>
        </div>
      </div>
    </div>
  );
};
