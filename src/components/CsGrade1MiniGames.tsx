import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Delete,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Volume2,
} from 'lucide-react';
import type { CsInteractiveRound } from '../data/curriculum';
import { soundEngine } from '../utils/sound';

export interface CsGrade1StageProps {
  round: CsInteractiveRound;
  solved: boolean;
  onSolve: () => void;
  onStepSuccess?: (message?: string) => void;
  onStepMistake?: (teacherHint: string) => void;
}

// =========================================================================
// 1-DARS: "SEHRLI DURBIN VA QULOQCHIN" (senses_sorter)
// =========================================================================
export const SensesSorterStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.sensesData ?? {
    mode: 'audio',
    clueEmoji: '🐦🎵',
    clueTitle: 'Qushcha sayrashi',
    clueSubtitle: 'Quloqchinni bosib tingla!',
    soundKind: 'bird',
    targetSense: 'ear',
  };
  const [playingClue, setPlayingClue] = useState(false);
  const [wrongSense, setWrongSense] = useState<string | null>(null);

  const playClueSound = () => {
    setPlayingClue(true);
    if (data.soundKind === 'bell') {
      soundEngine.playElevatorDing();
    } else if (data.soundKind === 'melody') {
      soundEngine.playFruitPluck(5);
    } else {
      soundEngine.playWindWhoosh();
    }
    window.setTimeout(() => setPlayingClue(false), 750);
  };

  useEffect(() => {
    if (data.mode === 'audio') {
      const t = window.setTimeout(() => playClueSound(), 280);
      return () => window.clearTimeout(t);
    }
  }, [round, data.mode]);

  const handlePickSense = (sense: 'ear' | 'eye') => {
    if (solved) return;
    if (sense === data.targetSense) {
      setWrongSense(null);
      onSolve();
    } else {
      setWrongSense(sense);
      soundEngine.playWrong();
      onStepMistake?.(
        round.teacherHint ||
          (data.targetSense === 'ear'
            ? 'Bu tovush axboroti! Tovushlarni 👂 Quloqimiz bilan eshitamiz!'
            : 'Bu rang va shakl axboroti! Ularni 👁️ Ko‘zimiz bilan ko‘ramiz!')
      );
      window.setTimeout(() => setWrongSense(null), 550);
    }
  };

  return (
    <div className="space-y-4">
      {/* Interactive Headphones OR Magic Binoculars Viewport */}
      <div className="rounded-2xl bg-gradient-to-b from-violet-50 via-sky-50 to-white border-2 border-violet-200 p-4 flex flex-col items-center text-center gap-2.5 select-none">
        {data.mode === 'audio' ? (
          <>
            <button
              type="button"
              onClick={playClueSound}
              className="group relative w-32 h-28 rounded-3xl bg-violet-600 hover:bg-violet-700 active:scale-95 text-white shadow-md border-b-4 border-violet-800 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <motion.span
                animate={playingClue ? { scale: [1, 1.2, 1], rotate: [-8, 8, 0] } : {}}
                transition={{ duration: 0.45 }}
                className="text-4xl leading-none"
              >
                🎧
              </motion.span>
              <span className="text-xs font-extrabold inline-flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> Tinglash
              </span>
              {/* Soundwave bars */}
              {playingClue && (
                <div className="absolute -right-7 flex items-center gap-1">
                  {[12, 22, 16].map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 rounded-full bg-violet-500"
                      animate={{ height: [6, h, 6] }}
                      transition={{ duration: 0.35, delay: i * 0.08, repeat: 2 }}
                    />
                  ))}
                </div>
              )}
            </button>
            <div>
              <div className="text-base font-display font-extrabold text-slate-900">
                {data.clueEmoji} {data.clueTitle}
              </div>
              <div className="text-xs font-semibold text-violet-700">{data.clueSubtitle}</div>
            </div>
          </>
        ) : (
          <>
            {/* Magic Binoculars Twin Lens SVG */}
            <svg viewBox="0 0 280 112" className="w-64 h-28" aria-label="Sehrli durbin">
              <rect x="115" y="42" width="50" height="24" rx="8" fill="#334155" />
              <circle cx="84" cy="56" r="46" fill="#0EA5E9" stroke="#1E293B" strokeWidth="7" />
              <circle cx="196" cy="56" r="46" fill="#0EA5E9" stroke="#1E293B" strokeWidth="7" />
              <circle cx="84" cy="56" r="38" fill="#E0F2FE" />
              <circle cx="196" cy="56" r="38" fill="#E0F2FE" />

              {data.visualKind === 'rainbow' ? (
                <>
                  {/* Rainbow arcs inside both lenses */}
                  {[84, 196].map((cx) => (
                    <g key={cx}>
                      <path d={`M${cx - 28},68 A28,28 0 0,1 ${cx + 28},68`} fill="none" stroke="#EF4444" strokeWidth="5" />
                      <path d={`M${cx - 23},68 A23,23 0 0,1 ${cx + 23},68`} fill="none" stroke="#F59E0B" strokeWidth="5" />
                      <path d={`M${cx - 18},68 A18,18 0 0,1 ${cx + 18},68`} fill="none" stroke="#22C55E" strokeWidth="5" />
                      <path d={`M${cx - 13},68 A13,13 0 0,1 ${cx + 13},68`} fill="none" stroke="#3B82F6" strokeWidth="5" />
                    </g>
                  ))}
                </>
              ) : (
                <>
                  {/* Colorful geometric shapes inside binocular lenses */}
                  <polygon points="84,32 62,72 106,72" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
                  <rect x="172" y="38" width="24" height="24" rx="4" fill="#FACC15" stroke="#B45309" strokeWidth="2" />
                  <circle cx="212" cy="64" r="14" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2" />
                </>
              )}
              {/* Lens shine */}
              <ellipse cx="68" cy="36" rx="8" ry="4" transform="rotate(-30 68 36)" fill="#FFFFFF" opacity="0.7" />
              <ellipse cx="180" cy="36" rx="8" ry="4" transform="rotate(-30 180 36)" fill="#FFFFFF" opacity="0.7" />
            </svg>
            <div>
              <div className="text-base font-display font-extrabold text-slate-900">
                🔍 {data.clueTitle}
              </div>
              <div className="text-xs font-semibold text-sky-700">{data.clueSubtitle}</div>
            </div>
          </>
        )}
      </div>

      {/* Connect to Ear or Eye Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { id: 'ear', emoji: '👂', title: 'Quloq', sub: 'Tovush (Eshitish)' },
            { id: 'eye', emoji: '👁️', title: 'Ko‘z', sub: 'Rasm (Ko‘rish)' },
          ] as const
        ).map((s) => {
          const isRight = solved && s.id === data.targetSense;
          const isWrong = wrongSense === s.id;
          return (
            <motion.button
              key={s.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : isRight ? { scale: [1, 1.04, 1] } : {}}
              onClick={() => handlePickSense(s.id)}
              className={`min-h-[82px] rounded-2xl border-2 border-b-4 px-4 py-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ${
                isRight
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 text-white'
                  : 'bg-white hover:bg-violet-50 border-violet-300 border-b-violet-500 text-slate-900'
              }`}
            >
              <span className="text-3xl leading-none">{s.emoji}</span>
              <span className="text-base font-display font-extrabold leading-none">{s.title}</span>
              <span className={`text-xs font-semibold ${isRight || isWrong ? 'text-white/90' : 'text-slate-500'}`}>
                {s.sub}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 2-DARS: "SEHRLI KONVEYER (BELGILARI BO'YICHA TOP)" (taste_conveyor)
// =========================================================================
const CONVEYOR_SENSES = [
  { id: 'tongue', emoji: '👅', label: 'Til', sub: 'Ta’m bilish', bg: 'from-rose-50 to-pink-100 border-rose-300' },
  { id: 'nose', emoji: '👃', label: 'Burun', sub: 'Hidlash', bg: 'from-amber-50 to-yellow-100 border-amber-300' },
  { id: 'hand', emoji: '✋', label: 'Teri / Qo‘l', sub: 'Ushlab sezish', bg: 'from-sky-50 to-cyan-100 border-sky-300' },
] as const;

export const TasteConveyorStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.conveyorData ?? {
    itemEmoji: '🍦',
    itemLabel: 'Muzqaymoq',
    traitBadge: 'Muzdek va shirin',
    targetSense: 'tongue',
  };
  const [wrongSense, setWrongSense] = useState<string | null>(null);
  const stationsRef = useRef<HTMLDivElement>(null);

  const handleSensePick = (senseId: string) => {
    if (solved) return;
    if (senseId === data.targetSense) {
      setWrongSense(null);
      onSolve();
    } else {
      setWrongSense(senseId);
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || `${data.itemLabel} (${data.traitBadge}) qaysi sezgi a’zosiga mos?`);
      window.setTimeout(() => setWrongSense(null), 550);
    }
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    if (solved || !stationsRef.current) return;
    const rect = stationsRef.current.getBoundingClientRect();
    if (
      info.point.x < rect.left - 12 ||
      info.point.x > rect.right + 12 ||
      info.point.y < rect.top - 12 ||
      info.point.y > rect.bottom + 12
    ) {
      return;
    }
    const ratio = (info.point.x - rect.left) / rect.width;
    const idx = ratio < 1 / 3 ? 0 : ratio < 2 / 3 ? 1 : 2;
    const station = CONVEYOR_SENSES[idx];
    if (station) handleSensePick(station.id);
  };

  return (
    <div className="space-y-4">
      {/* Animated Factory Conveyor Belt */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-100 to-violet-50 border-2 border-violet-200 px-4 pt-4 pb-3 overflow-hidden select-none">
        <div className="flex flex-col items-center gap-2">
          {!solved ? (
            <motion.div
              drag
              dragSnapToOrigin
              whileDrag={{ scale: 1.15, zIndex: 30 }}
              onDragEnd={handleDragEnd}
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="px-6 py-3 rounded-2xl bg-white border-2 border-b-4 border-violet-400 shadow-md flex items-center gap-3 cursor-grab active:cursor-grabbing touch-none"
            >
              <span className="text-5xl leading-none">{data.itemEmoji}</span>
              <div className="text-left">
                <div className="text-base font-display font-extrabold text-slate-900">{data.itemLabel}</div>
                <div className="text-xs font-bold text-violet-700">{data.traitBadge}</div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-5 py-2.5 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-display font-extrabold text-sm flex items-center gap-2"
            >
              <Check className="w-5 h-5 text-emerald-600" />
              <span>{data.itemLabel} to‘g‘ri stansiyaga joylashdi!</span>
            </motion.div>
          )}

          {/* Belt Track & Spinning Rollers */}
          <div className="w-full max-w-[380px] h-7 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-around px-4 mt-1">
            {[0, 1, 2, 3, 4].map((gear) => (
              <motion.span
                key={gear}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900 inline-block"
              />
            ))}
          </div>
          <div className="text-[11px] font-semibold text-slate-500">
            Buyumni to‘g‘ri sezgi a’zosiga sudra yoki pastdagi tugmani bos!
          </div>
        </div>
      </div>

      {/* 3 Sense Station Targets */}
      <div ref={stationsRef} className="grid grid-cols-3 gap-2.5">
        {CONVEYOR_SENSES.map((s) => {
          const isSolvedHere = solved && s.id === data.targetSense;
          const isWrong = wrongSense === s.id;
          return (
            <motion.button
              key={s.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : isSolvedHere ? { scale: [1, 1.05, 1] } : {}}
              onClick={() => handleSensePick(s.id)}
              className={`min-h-[96px] rounded-2xl border-2 border-b-4 p-3 flex flex-col items-center justify-center gap-1 text-center cursor-pointer bg-gradient-to-b transition-all ${
                isSolvedHere
                  ? 'from-emerald-500 to-emerald-600 border-emerald-700 text-white shadow-md'
                  : isWrong
                  ? 'from-rose-500 to-rose-600 border-rose-700 text-white'
                  : `${s.bg} text-slate-900 hover:brightness-95`
              }`}
            >
              <span className="text-3xl leading-none">
                {isSolvedHere ? `${s.emoji}${data.itemEmoji}` : s.emoji}
              </span>
              <span className="text-sm font-display font-extrabold leading-tight">{s.label}</span>
              <span className={`text-[11px] font-semibold ${isSolvedHere || isWrong ? 'text-white/90' : 'text-slate-600'}`}>
                {s.sub}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 3-DARS: "VAQT MASHINASI (EDI ➔ BO'LDI)" (time_machine)
// =========================================================================
export const TimeMachineStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.timeData ?? {
    beforeEmoji: '🥚',
    beforeLabel: 'Tuxum',
    machineEmoji: '⏳',
    machineLabel: 'Vaqt mashinasi',
    afterChoices: [],
  };
  const [wrongId, setWrongId] = useState<string | null>(null);
  const correctChoice = data.afterChoices.find((c) => c.isCorrect);

  const handlePickAfter = (ch: { id: string; isCorrect: boolean }) => {
    if (solved) return;
    if (ch.isCorrect) {
      setWrongId(null);
      onSolve();
    } else {
      setWrongId(ch.id);
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || `${data.beforeLabel} o‘zgargach nimaga aylanadi? Yaxshilab o‘yla!`);
      window.setTimeout(() => setWrongId(null), 550);
    }
  };

  return (
    <div className="space-y-4">
      {/* Whimsical Time Machine Chamber */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950 via-violet-900 to-indigo-950 border-2 border-violet-500 p-4 text-white select-none">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-2">
          {/* BEFORE Pod */}
          <div className="rounded-2xl bg-white/10 border border-violet-400/50 p-3 flex flex-col items-center text-center gap-1">
            <span className="text-[11px] font-extrabold text-amber-300">OLDIN (EDI)</span>
            <span className="text-4xl leading-none">{data.beforeEmoji}</span>
            <span className="text-xs font-bold">{data.beforeLabel}</span>
          </div>

          <span className="text-lg font-black text-amber-400">➔</span>

          {/* CENTER TIME MACHINE */}
          <motion.div
            animate={solved ? { rotate: [0, 360] } : { scale: [1, 1.05, 1] }}
            transition={solved ? { duration: 0.7 } : { duration: 2.2, repeat: Infinity }}
            className="rounded-full w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-amber-200 shadow-lg flex flex-col items-center justify-center text-slate-950 text-center p-1"
          >
            <span className="text-2xl sm:text-3xl leading-none">{data.machineEmoji}</span>
            <span className="text-[10px] font-black leading-tight mt-0.5">{data.machineLabel}</span>
          </motion.div>

          <span className="text-lg font-black text-amber-400">➔</span>

          {/* AFTER Pod */}
          <motion.div
            animate={solved ? { scale: [0.8, 1.08, 1] } : {}}
            className={`rounded-2xl border-2 p-3 flex flex-col items-center text-center gap-1 ${
              solved
                ? 'bg-emerald-500/25 border-emerald-400'
                : 'bg-white/10 border-dashed border-amber-300'
            }`}
          >
            <span className="text-[11px] font-extrabold text-emerald-300">KEYIN (BO‘LDI)</span>
            <span className="text-4xl leading-none">
              {solved && correctChoice ? correctChoice.emoji : '❓'}
            </span>
            <span className="text-xs font-bold">
              {solved && correctChoice ? correctChoice.label : 'Nima bo‘ldi?'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* 3 Result Options */}
      <div className="grid grid-cols-3 gap-2.5">
        {data.afterChoices.map((ch) => {
          const isRight = solved && ch.isCorrect;
          const isWrong = wrongId === ch.id;
          return (
            <motion.button
              key={ch.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              onClick={() => handlePickAfter(ch)}
              className={`min-h-[82px] rounded-2xl border-2 border-b-4 px-2 py-2.5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ${
                isRight
                  ? 'bg-emerald-600 border-emerald-700 text-white'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 text-white'
                  : 'bg-white hover:bg-violet-50 border-violet-300 border-b-violet-500 text-slate-900'
              }`}
            >
              <span className="text-3xl leading-none">{ch.emoji}</span>
              <span className="text-xs sm:text-sm font-extrabold leading-tight">{ch.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 4-DARS: "KICHIK OSHPAZ (BIRINCHI ALGORITMIM)" (chef_algo)
// =========================================================================
export const ChefAlgoStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.chefData ?? {
    recipeTitle: 'Choy damlash algoritmi',
    resultEmoji: '🍵✨',
    resultLabel: 'Mazali choy tayyor!',
    steps: [],
  };
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const shuffled = useMemo(() => {
    if (data.steps.length === 3) {
      return [data.steps[2], data.steps[0], data.steps[1]];
    }
    return [...data.steps].reverse();
  }, [data.steps]);

  const handleTapBlock = (step: { id: string; emoji: string; label: string }) => {
    if (solved || placedIds.includes(step.id)) return;
    const expected = data.steps[placedIds.length];
    if (expected && step.id === expected.id) {
      const next = [...placedIds, step.id];
      setPlacedIds(next);
      setWrongId(null);
      soundEngine.playFruitPluck(next.length);
      if (next.length === data.steps.length) {
        onSolve();
      } else {
        onStepSuccess?.(`${next.length}-qadam zo‘r! Endi ${next.length + 1}-qadamni tanla!`);
      }
    } else {
      setWrongId(step.id);
      soundEngine.playWrong();
      onStepMistake?.(
        expected
          ? `Avval ${placedIds.length + 1}-qadamni qo‘y: «${expected.label}» (${expected.emoji})!`
          : round.teacherHint || 'Qadamlarni to‘g‘ri tartibda joylashtir!'
      );
      window.setTimeout(() => setWrongId(null), 550);
    }
  };

  return (
    <div className="space-y-4">
      {/* Kitchen Algorithm Pipeline */}
      <div className="rounded-2xl bg-gradient-to-b from-amber-50 via-orange-50 to-white border-2 border-amber-200 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-amber-900">
          <span>👨‍🍳 {data.recipeTitle}</span>
          <span className="font-mono-num">{solved ? data.resultLabel : `${placedIds.length} / ${data.steps.length}`}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-2">
          {data.steps.map((step, idx) => {
            const filled = idx < placedIds.length || solved;
            const active = idx === placedIds.length && !solved;
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  animate={filled ? { scale: [0.9, 1.05, 1] } : {}}
                  className={`rounded-2xl border-2 p-2.5 min-h-[100px] flex flex-col items-center justify-center text-center gap-1 ${
                    filled
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                      : active
                      ? 'bg-amber-100/80 border-dashed border-amber-500'
                      : 'bg-white border-dashed border-slate-300'
                  }`}
                >
                  <span className="font-mono-num text-[11px] font-black text-amber-800">{idx + 1}-blok</span>
                  {filled ? (
                    <>
                      <span className="text-3xl leading-none">{step.emoji}</span>
                      <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 leading-tight">
                        {step.label}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-display font-black text-amber-400">?</span>
                  )}
                </motion.div>
                {idx < data.steps.length - 1 && (
                  <span className="text-base sm:text-xl font-black text-amber-500">➔</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {solved && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-center font-display font-extrabold text-sm flex items-center justify-center gap-2"
          >
            <span className="text-xl">{data.resultEmoji}</span>
            <span>{data.resultLabel}</span>
          </motion.div>
        )}
      </div>

      {/* Shuffled Colorful Scratch-Style Blocks */}
      <div className="grid grid-cols-3 gap-2.5">
        {shuffled.map((step) => {
          const isUsed = placedIds.includes(step.id) || solved;
          const isWrong = wrongId === step.id;
          return (
            <motion.button
              key={step.id}
              type="button"
              disabled={isUsed}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              onClick={() => handleTapBlock(step)}
              className={`min-h-[84px] rounded-2xl border-2 border-b-4 px-2 py-2.5 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-all ${
                isUsed
                  ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-45 cursor-default'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 text-white'
                  : 'bg-violet-600 hover:bg-violet-700 border-violet-800 text-white active:scale-95 shadow-sm'
              }`}
            >
              <span className="text-2xl sm:text-3xl leading-none">{step.emoji}</span>
              <span className="text-xs font-extrabold leading-tight">{step.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 5-DARS: "SEHRLI KARUSEL (DOIMIY TAKRORLANISH / TSIKL)" (cycle_carousel)
// =========================================================================
const CAROUSEL_COORDS = [
  { x: 140, y: 34 },  // Top (1)
  { x: 242, y: 94 },  // Right (2)
  { x: 140, y: 154 }, // Bottom (3)
  { x: 38, y: 94 },   // Left (4)
];

export const CycleCarouselStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.carouselData ?? { cycleTitle: 'Tsikl', steps: [] };
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const shuffled = useMemo(() => {
    if (data.steps.length === 4) {
      return [data.steps[2], data.steps[0], data.steps[3], data.steps[1]];
    }
    return [...data.steps].reverse();
  }, [data.steps]);

  const handlePick = (step: { id: string; emoji: string; label: string }) => {
    if (solved || placedIds.includes(step.id)) return;
    const expected = data.steps[placedIds.length];
    if (expected && step.id === expected.id) {
      const next = [...placedIds, step.id];
      setPlacedIds(next);
      setWrongId(null);
      soundEngine.playFruitPluck(next.length);
      if (next.length === data.steps.length) {
        onSolve();
      } else {
        onStepSuccess?.(`🔁 ${next.length}-bosqich o‘rniga tushdi! Keyingisini tanla!`);
      }
    } else {
      setWrongId(step.id);
      soundEngine.playWrong();
      onStepMistake?.(
        expected
          ? `Karuselda ${placedIds.length + 1}-o‘ringa «${expected.label}» (${expected.emoji}) mos keladi!`
          : round.teacherHint || 'Bosqichlarni doira bo‘ylab tartib bilan ter!'
      );
      window.setTimeout(() => setWrongId(null), 550);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Circular Spinning Carousel SVG */}
      <div className="rounded-2xl bg-gradient-to-b from-indigo-50 via-violet-50 to-amber-50 border-2 border-violet-200 px-3 py-2.5 flex flex-col items-center select-none">
        <div className="w-full flex items-center justify-between text-xs font-bold text-violet-900 mb-1 px-1">
          <span>🎡 {data.cycleTitle}</span>
          <span>{solved ? '🔁 Tsikl cheksiz aylanmoqda!' : `${placedIds.length} / 4 bosqich`}</span>
        </div>

        <svg viewBox="0 0 280 188" className="w-full max-w-[320px] h-[176px] overflow-visible" aria-label="Sehrli karusel">
          {/* Circular Loop Track */}
          <g transform="translate(140, 94)">
            <motion.g
              animate={solved ? { rotate: 360 } : {}}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="0" cy="0" r="64" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="10 6" />
              {/* Center Loop Hub */}
              <circle cx="0" cy="0" r="22" fill={solved ? '#16A34A' : '#7C3AED'} />
              <text x="0" y="7" textAnchor="middle" fontSize="18" fill="#FFFFFF">🔁</text>
            </motion.g>
          </g>

          {/* 4 Carousel Pods */}
          {data.steps.slice(0, 4).map((step, idx) => {
            const pos = CAROUSEL_COORDS[idx];
            const filled = idx < placedIds.length || solved;
            const isNext = idx === placedIds.length && !solved;
            return (
              <g key={step.id} transform={`translate(${pos.x}, ${pos.y})`}>
                <rect
                  x="-36"
                  y="-24"
                  width="72"
                  height="48"
                  rx="14"
                  fill={filled ? '#FFFFFF' : isNext ? '#FEF3C7' : '#F8FAFC'}
                  stroke={filled ? '#16A34A' : isNext ? '#F59E0B' : '#CBD5E1'}
                  strokeWidth={filled || isNext ? 2.8 : 2}
                  strokeDasharray={filled ? undefined : '5 3'}
                />
                {filled ? (
                  <>
                    <text x="0" y="-1" textAnchor="middle" fontSize="20">{step.emoji}</text>
                    <text x="0" y="16" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0F172A">
                      {step.label}
                    </text>
                  </>
                ) : (
                  <text x="0" y="6" textAnchor="middle" fontSize="15" fontWeight="900" fill="#D97706">
                    {idx + 1} ?
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 4 Tappable Carousel Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {shuffled.map((step) => {
          const isUsed = placedIds.includes(step.id) || solved;
          const isWrong = wrongId === step.id;
          return (
            <motion.button
              key={step.id}
              type="button"
              disabled={isUsed}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              onClick={() => handlePick(step)}
              className={`min-h-[68px] rounded-2xl border-2 border-b-4 px-2 py-2 flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer transition-all ${
                isUsed
                  ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-45 cursor-default'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 text-white'
                  : 'bg-white hover:bg-violet-50 border-violet-300 border-b-violet-500 text-slate-900 active:scale-95'
              }`}
            >
              <span className="text-2xl leading-none">{step.emoji}</span>
              <span className="text-xs font-extrabold leading-tight">{step.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 6-DARS: "AQLLI DRON PARVOZI (KOORDINATALAR)" (drone_flight)
// =========================================================================
export const DroneFlightStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.droneData ?? {
    gridSize: 4,
    start: { x: 1, y: 3 },
    target: { x: 2, y: 1 },
    missionText: '2 qadam ⬆️ TEPAGA va 1 qadam ➡️ O‘NGGA uchir!',
  };

  const [pos, setPos] = useState(data.start);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([data.start]);
  const [bump, setBump] = useState(false);

  const cellSize = 46;
  const gridPx = data.gridSize * cellSize;

  const moveDrone = (dx: number, dy: number) => {
    if (solved) return;
    const nx = pos.x + dx;
    const ny = pos.y + dy;
    if (nx < 0 || nx >= data.gridSize || ny < 0 || ny >= data.gridSize) {
      setBump(true);
      soundEngine.playWrong();
      onStepMistake?.('Voy, maydon chetiga yetib keldik! Nishon 🎯 turgan tomonga uchir!');
      window.setTimeout(() => setBump(false), 400);
      return;
    }
    const nextPos = { x: nx, y: ny };
    setPos(nextPos);
    setTrail((prev) => [...prev, nextPos]);
    soundEngine.playFruitPluck(trail.length + 1);

    if (nx === data.target.x && ny === data.target.y) {
      onSolve();
    }
  };

  const resetDrone = () => {
    if (solved) return;
    setPos(data.start);
    setTrail([data.start]);
    soundEngine.playEquip();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_195px] gap-4 items-center">
      {/* Coordinate Sky Grid */}
      <div className="rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-indigo-50 border-2 border-sky-200 p-3 flex flex-col items-center gap-2 select-none">
        <div className="text-xs font-extrabold text-sky-900 text-center">
          🎯 {data.missionText}
        </div>

        <svg
          viewBox={`0 0 ${gridPx + 8} ${gridPx + 8}`}
          className="w-[196px] h-[196px] overflow-visible"
          aria-label="Aqlli dron koordinata maydoni"
        >
          {/* Grid Tiles */}
          {Array.from({ length: data.gridSize }).map((_, gy) =>
            Array.from({ length: data.gridSize }).map((__, gx) => {
              const isTarget = gx === data.target.x && gy === data.target.y;
              return (
                <rect
                  key={`${gx}-${gy}`}
                  x={4 + gx * cellSize}
                  y={4 + gy * cellSize}
                  width={cellSize - 4}
                  height={cellSize - 4}
                  rx="9"
                  fill={isTarget ? '#FEF08A' : '#FFFFFF'}
                  stroke={isTarget ? '#D97706' : '#BAE6FD'}
                  strokeWidth={isTarget ? 2.5 : 1.5}
                />
              );
            })
          )}

          {/* Dotted Flight Trail */}
          {trail.length > 1 && (
            <polyline
              points={trail
                .map((p) => `${4 + p.x * cellSize + (cellSize - 4) / 2},${4 + p.y * cellSize + (cellSize - 4) / 2}`)
                .join(' ')}
              fill="none"
              stroke="#0284C7"
              strokeWidth="3.5"
              strokeDasharray="5 5"
              strokeLinecap="round"
            />
          )}

          {/* Target Star */}
          <text
            x={4 + data.target.x * cellSize + (cellSize - 4) / 2}
            y={4 + data.target.y * cellSize + (cellSize - 4) / 2 + 8}
            textAnchor="middle"
            fontSize="24"
          >
            🎯
          </text>

          {/* Animated Hovering Quadcopter Drone */}
          <motion.g
            animate={{
              x: 4 + pos.x * cellSize + (cellSize - 4) / 2,
              y: 4 + pos.y * cellSize + (cellSize - 4) / 2,
              scale: bump ? [1, 0.85, 1] : solved ? [1, 1.25, 1] : 1,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <circle cx="0" cy="0" r="17" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2.5" />
            <text x="0" y="7" textAnchor="middle" fontSize="20">🚁</text>
          </motion.g>
        </svg>
      </div>

      {/* Tactile 4-Way Flight Controller */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={solved}
          onClick={() => moveDrone(0, -1)}
          className="w-16 h-14 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 border-b-4 border-sky-800 text-white flex flex-col items-center justify-center cursor-pointer transition-transform"
        >
          <ArrowUp className="w-6 h-6" />
          <span className="text-[10px] font-extrabold leading-none">Tepa</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={solved}
            onClick={() => moveDrone(-1, 0)}
            className="w-16 h-14 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 border-b-4 border-sky-800 text-white flex flex-col items-center justify-center cursor-pointer transition-transform"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-[10px] font-extrabold leading-none">Chap</span>
          </button>

          <button
            type="button"
            disabled={solved}
            onClick={resetDrone}
            className="w-14 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 flex items-center justify-center cursor-pointer"
            title="Boshiga qaytarish"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            disabled={solved}
            onClick={() => moveDrone(1, 0)}
            className="w-16 h-14 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 border-b-4 border-sky-800 text-white flex flex-col items-center justify-center cursor-pointer transition-transform"
          >
            <ArrowRight className="w-6 h-6" />
            <span className="text-[10px] font-extrabold leading-none">O‘ng</span>
          </button>
        </div>

        <button
          type="button"
          disabled={solved}
          onClick={() => moveDrone(0, 1)}
          className="w-16 h-14 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 border-b-4 border-sky-800 text-white flex flex-col items-center justify-center cursor-pointer transition-transform"
        >
          <ArrowDown className="w-6 h-6" />
          <span className="text-[10px] font-extrabold leading-none">Past</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 7-DARS: "QUYONCHANING ENG QISQA YO'LI" (short_path)
// =========================================================================
export const ShortPathStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.shortPathData ?? {
    pathASteps: [
      { x: 0, y: 2 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 },
      { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 },
    ],
    pathBSteps: [
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
    ],
    correctPath: 'B',
  };

  const [wrongPath, setWrongPath] = useState<'A' | 'B' | null>(null);
  const [bunnyIdx, setBunnyIdx] = useState(0);

  const countA = Math.max(1, data.pathASteps.length - 1);
  const countB = Math.max(1, data.pathBSteps.length - 1);
  const winningSteps = data.correctPath === 'A' ? data.pathASteps : data.pathBSteps;
  const startCell = data.pathASteps[0] ?? { x: 0, y: 2 };
  const carrotCell = winningSteps[winningSteps.length - 1] ?? { x: 4, y: 2 };

  const cellW = 72;
  const cellH = 44;

  const handlePickPath = (picked: 'A' | 'B') => {
    if (solved) return;
    if (picked === data.correctPath) {
      setWrongPath(null);
      // Animate bunny hopping tile by tile to the carrot
      winningSteps.forEach((_, idx) => {
        window.setTimeout(() => {
          setBunnyIdx(idx);
          if (idx > 0) soundEngine.playFruitPluck(idx);
        }, idx * 140);
      });
      onSolve();
    } else {
      setWrongPath(picked);
      soundEngine.playWrong();
      onStepMistake?.(
        round.teacherHint ||
          `Kataklarni qayta sana: A yo‘lida ${countA} qadam, B yo‘lida ${countB} qadam bor! Kichikroq sonli yo‘lni tanla!`
      );
      window.setTimeout(() => setWrongPath(null), 550);
    }
  };

  const bunnyPos = solved ? winningSteps[Math.min(bunnyIdx, winningSteps.length - 1)] : startCell;

  const toPt = (p: { x: number; y: number }) => `${36 + p.x * cellW},${24 + p.y * cellH}`;

  return (
    <div className="space-y-3.5">
      {/* Garden Stepping Grid SVG */}
      <div className="rounded-2xl bg-gradient-to-b from-emerald-50 via-lime-50 to-emerald-100 border-2 border-emerald-200 p-3 select-none">
        <svg viewBox="0 0 364 182" className="w-full h-[172px] sm:h-[184px] overflow-visible" aria-label="Quyoncha yo'llari">
          {/* Background Garden Tiles */}
          {Array.from({ length: 4 }).map((_, gy) =>
            Array.from({ length: 5 }).map((__, gx) => (
              <rect
                key={`${gx}-${gy}`}
                x={8 + gx * cellW}
                y={6 + gy * cellH}
                width={cellW - 12}
                height={cellH - 8}
                rx="10"
                fill="#FFFFFF"
                stroke="#BBF7D0"
                strokeWidth="1.5"
              />
            ))
          )}

          {/* Path A Polyline (Blue) */}
          <polyline
            points={data.pathASteps.map(toPt).join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.82"
          />

          {/* Path B Polyline (Orange) */}
          <polyline
            points={data.pathBSteps.map(toPt).join(' ')}
            fill="none"
            stroke="#F97316"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Step dots on Path A */}
          {data.pathASteps.slice(1, -1).map((p, idx) => (
            <circle key={`a-${idx}`} cx={36 + p.x * cellW} cy={24 + p.y * cellH} r="6.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
          ))}

          {/* Step dots on Path B */}
          {data.pathBSteps.slice(1, -1).map((p, idx) => (
            <circle key={`b-${idx}`} cx={36 + p.x * cellW} cy={24 + p.y * cellH} r="6.5" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2" />
          ))}

          {/* Juicy Carrot Goal */}
          <text x={36 + carrotCell.x * cellW} y={32 + carrotCell.y * cellH} textAnchor="middle" fontSize="28">
            🥕
          </text>

          {/* Animated Hopping Bunny */}
          <motion.g
            animate={{
              x: 36 + bunnyPos.x * cellW,
              y: 24 + bunnyPos.y * cellH,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <circle cx="0" cy="0" r="18" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2.5" />
            <text x="0" y="7" textAnchor="middle" fontSize="22">🐰</text>
          </motion.g>
        </svg>
      </div>

      {/* 2 Path Selection Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { id: 'A', label: 'A yo‘li (Ko‘k)', count: countA, accent: 'bg-blue-50 hover:bg-blue-100 border-blue-300 border-b-blue-500 text-blue-950' },
            { id: 'B', label: 'B yo‘li (Zarg‘aldoq)', count: countB, accent: 'bg-orange-50 hover:bg-orange-100 border-orange-300 border-b-orange-500 text-orange-950' },
          ] as const
        ).map((btn) => {
          const isRight = solved && btn.id === data.correctPath;
          const isWrong = wrongPath === btn.id;
          return (
            <motion.button
              key={btn.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              onClick={() => handlePickPath(btn.id)}
              className={`min-h-[68px] rounded-2xl border-2 border-b-4 px-4 py-2.5 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all active:scale-95 ${
                isRight
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 text-white'
                  : btn.accent
              }`}
            >
              <span className="text-sm sm:text-base font-display font-extrabold">{btn.label}</span>
              <span className="font-mono-num text-xs font-bold opacity-90">{btn.count} ta katak</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 8-DARS: "ROBOTCHA LABIRINTI (MINI-SCRATCH)" (robot_maze)
// =========================================================================
type MazeCmd = 'forward' | 'right' | 'left';
type RobotDir = 'up' | 'right' | 'down' | 'left';

const DIR_ROTATION: Record<RobotDir, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

const DIR_DELTA: Record<RobotDir, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  right: { dx: 1, dy: 0 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
};

function turnRight(d: RobotDir): RobotDir {
  const order: RobotDir[] = ['up', 'right', 'down', 'left'];
  return order[(order.indexOf(d) + 1) % 4];
}

function turnLeft(d: RobotDir): RobotDir {
  const order: RobotDir[] = ['up', 'right', 'down', 'left'];
  return order[(order.indexOf(d) + 3) % 4];
}

const CMD_META: Record<MazeCmd, { emoji: string; label: string; color: string }> = {
  forward: { emoji: '⬆️', label: 'Oldinga', color: 'bg-blue-600 border-blue-800 text-white' },
  right: { emoji: '↪️', label: 'O‘ngga buril', color: 'bg-amber-500 border-amber-700 text-slate-950' },
  left: { emoji: '↩️', label: 'Chapga buril', color: 'bg-violet-600 border-violet-800 text-white' },
};

export const RobotMazeStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.mazeData ?? {
    gridSize: 4,
    start: { x: 1, y: 3, dir: 'up' as RobotDir },
    flag: { x: 2, y: 1 },
    walls: [{ x: 2, y: 2 }],
    hintFormula: '⬆️ ➔ ⬆️ ➔ ↪️ O‘ngga ➔ ⬆️',
  };

  const [program, setProgram] = useState<MazeCmd[]>([]);
  const [robot, setRobot] = useState(data.start);
  const [running, setRunning] = useState(false);
  const [activeCmdIdx, setActiveCmdIdx] = useState<number | null>(null);
  const [crashed, setCrashed] = useState(false);

  const cellSize = 46;
  const gridPx = data.gridSize * cellSize;

  const isWall = (x: number, y: number) => data.walls.some((w) => w.x === x && w.y === y);

  const handleAddCmd = (cmd: MazeCmd) => {
    if (running || solved || program.length >= 8) return;
    soundEngine.playEquip();
    setProgram((prev) => [...prev, cmd]);
  };

  const handleRun = () => {
    if (running || solved || program.length === 0) return;
    setRunning(true);
    setCrashed(false);
    setRobot(data.start);

    // Precompute step-by-step simulation frames
    const frames: { x: number; y: number; dir: RobotDir; crash: boolean; reachedFlag: boolean }[] = [];
    let curX = data.start.x;
    let curY = data.start.y;
    let curDir: RobotDir = data.start.dir;

    for (const cmd of program) {
      let crash = false;
      if (cmd === 'right') {
        curDir = turnRight(curDir);
      } else if (cmd === 'left') {
        curDir = turnLeft(curDir);
      } else {
        const nx = curX + DIR_DELTA[curDir].dx;
        const ny = curY + DIR_DELTA[curDir].dy;
        if (nx < 0 || nx >= data.gridSize || ny < 0 || ny >= data.gridSize || isWall(nx, ny)) {
          crash = true;
        } else {
          curX = nx;
          curY = ny;
        }
      }
      const reachedFlag = curX === data.flag.x && curY === data.flag.y;
      frames.push({ x: curX, y: curY, dir: curDir, crash, reachedFlag });
      if (crash || reachedFlag) break;
    }

    frames.forEach((frame, idx) => {
      window.setTimeout(() => {
        setActiveCmdIdx(idx);
        setRobot({ x: frame.x, y: frame.y, dir: frame.dir });
        if (frame.crash) {
          setCrashed(true);
          soundEngine.playWrong();
        } else {
          soundEngine.playFruitPluck(idx + 1);
        }

        if (idx === frames.length - 1) {
          window.setTimeout(() => {
            setRunning(false);
            setActiveCmdIdx(null);
            if (frame.reachedFlag) {
              onSolve();
            } else {
              if (!frame.crash) soundEngine.playWrong();
              onStepMistake?.(
                frame.crash
                  ? `Voy, robotcha devorga urildi! Maslahat: ${data.hintFormula}`
                  : `Robotcha bayroqchaga yetmadi! Maslahat: ${data.hintFormula}`
              );
              setRobot(data.start);
              setCrashed(false);
            }
          }, 420);
        }
      }, (idx + 1) * 420);
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-[206px_1fr] gap-3.5 items-start">
        {/* Left: 4x4 Interactive Maze Grid */}
        <div className="rounded-2xl bg-slate-900 border-2 border-slate-700 p-2.5 flex flex-col items-center select-none mx-auto">
          <svg viewBox={`0 0 ${gridPx + 8} ${gridPx + 8}`} className="w-[188px] h-[188px]" aria-label="Robotcha labirinti">
            {Array.from({ length: data.gridSize }).map((_, gy) =>
              Array.from({ length: data.gridSize }).map((__, gx) => {
                const wall = isWall(gx, gy);
                const flag = gx === data.flag.x && gy === data.flag.y;
                return (
                  <g key={`${gx}-${gy}`}>
                    <rect
                      x={4 + gx * cellSize}
                      y={4 + gy * cellSize}
                      width={cellSize - 4}
                      height={cellSize - 4}
                      rx="8"
                      fill={wall ? '#475569' : flag ? '#FEF08A' : '#1E293B'}
                      stroke={flag ? '#EAB308' : '#334155'}
                      strokeWidth="2"
                    />
                    {wall && (
                      <text x={4 + gx * cellSize + 21} y={4 + gy * cellSize + 28} textAnchor="middle" fontSize="20">
                        🧱
                      </text>
                    )}
                    {flag && (
                      <text x={4 + gx * cellSize + 21} y={4 + gy * cellSize + 29} textAnchor="middle" fontSize="22">
                        🚩
                      </text>
                    )}
                  </g>
                );
              })
            )}

            {/* Animated Robot with Clear Golden Heading Arrow */}
            <motion.g
              animate={{
                x: 4 + robot.x * cellSize + (cellSize - 4) / 2,
                y: 4 + robot.y * cellSize + (cellSize - 4) / 2,
                scale: crashed ? [1, 0.8, 1.1, 1] : 1,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            >
              <motion.g animate={{ rotate: DIR_ROTATION[robot.dir] }} transition={{ duration: 0.25 }}>
                {/* Golden Direction Nose Triangle pointing where robot faces! */}
                <polygon points="0,-22 -7,-12 7,-12" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />
                <rect x="-14" y="-12" width="28" height="24" rx="7" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.2" />
                <circle cx="-5" cy="-2" r="2.5" fill="#0F172A" />
                <circle cx="5" cy="-2" r="2.5" fill="#0F172A" />
                <line x1="-5" y1="6" x2="5" y2="6" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              </motion.g>
            </motion.g>
          </svg>
        </div>

        {/* Right: Mini-Scratch Block Palette & Code Tape */}
        <div className="space-y-2.5">
          {/* Block Palette */}
          <div className="grid grid-cols-3 gap-2">
            {(['forward', 'right', 'left'] as MazeCmd[]).map((cmd) => {
              const meta = CMD_META[cmd];
              return (
                <button
                  key={cmd}
                  type="button"
                  disabled={running || solved}
                  onClick={() => handleAddCmd(cmd)}
                  className={`min-h-[56px] rounded-xl border-b-4 px-2 py-1.5 flex flex-col items-center justify-center gap-0.5 font-extrabold text-xs cursor-pointer active:scale-95 transition-transform ${meta.color}`}
                >
                  <span className="text-lg leading-none">{meta.emoji}</span>
                  <span className="whitespace-nowrap">{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Assembled Code Tape */}
          <div className="min-h-[68px] rounded-2xl bg-slate-50 border-2 border-slate-200 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Dastur bloklari ({program.length}/8):</span>
              <span className="text-violet-700">Sariq uchburchak = robot oldi</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {program.length === 0 ? (
                <span className="text-xs font-semibold text-slate-400">
                  Yuqoridagi bloklarni bosib buyruq zanjirini tuz!
                </span>
              ) : (
                program.map((cmd, idx) => (
                  <span
                    key={`${cmd}-${idx}`}
                    className={`px-2 py-1 rounded-lg text-xs font-extrabold inline-flex items-center gap-1 border transition-transform ${
                      activeCmdIdx === idx
                        ? 'bg-emerald-500 text-white border-emerald-700 scale-110 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-300'
                    }`}
                  >
                    <span>{CMD_META[cmd].emoji}</span>
                    <span>{CMD_META[cmd].label}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Run / Undo / Reset Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={running || solved || program.length === 0}
              onClick={handleRun}
              className={`flex-1 min-h-[46px] rounded-xl border-b-4 font-display font-extrabold text-sm flex items-center justify-center gap-1.5 transition-all ${
                program.length > 0 && !running && !solved
                  ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-800 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Boshlash</span>
            </button>

            <button
              type="button"
              disabled={running || solved || program.length === 0}
              onClick={() => setProgram((prev) => prev.slice(0, -1))}
              className="min-h-[46px] px-3 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 cursor-pointer"
              title="Oxirgisini o'chirish"
            >
              <Delete className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={running || solved}
              onClick={() => {
                setProgram([]);
                setRobot(data.start);
              }}
              className="min-h-[46px] px-3 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 cursor-pointer"
              title="Tozalash"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 9-DARS: "KOMPYUTER QISMLARI KONSTRUKTORI" (pc_builder)
// =========================================================================
const PC_PARTS = [
  { id: 'monitor', emoji: '🖥️', label: 'Monitor', role: 'Ko‘rish uchun' },
  { id: 'cpu', emoji: '🗄️', label: 'Tizim bloki', role: 'Miya / Protsessor' },
  { id: 'keyboard', emoji: '⌨️', label: 'Klaviatura', role: 'Yozish uchun' },
  { id: 'mouse', emoji: '🖱️', label: 'Sichqoncha', role: 'Ko‘rsatish uchun' },
] as const;

export const PcBuilderStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.pcData ?? { mode: 'assemble_all' };
  const [installed, setInstalled] = useState<string[]>([]);
  const [wrongPart, setWrongPart] = useState<string | null>(null);

  const isAssemble = data.mode === 'assemble_all';
  const hasPart = (id: string) => !isAssemble || installed.includes(id) || solved;
  const allOn = !isAssemble || installed.length === 4 || solved;

  const handleInstallPart = (partId: string) => {
    if (solved || installed.includes(partId)) return;
    const next = [...installed, partId];
    setInstalled(next);
    soundEngine.playFruitPluck(next.length);
    const meta = PC_PARTS.find((p) => p.id === partId);
    if (next.length === 4) {
      soundEngine.playScaleBalance();
      onSolve();
    } else {
      onStepSuccess?.(`${meta?.emoji} ${meta?.label} o‘rnatildi! (${next.length} / 4)`);
    }
  };

  const handleFindPartClick = (partId: string) => {
    if (solved || isAssemble) return;
    if (partId === data.targetPart) {
      setWrongPart(null);
      onSolve();
    } else {
      setWrongPart(partId);
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || 'Har bir qismning vazifasiga qara va to‘g‘risini bos!');
      window.setTimeout(() => setWrongPart(null), 550);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Interactive Computer Desk SVG */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-100 via-sky-50 to-amber-100/70 border-2 border-sky-200 px-3 pt-2.5 pb-3 select-none">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1 px-1">
          <span>{isAssemble ? '🛠️ Kompyuter stoli' : '🖱️ Kerakli qismni to‘g‘ridan-to‘g‘ri bos!'}</span>
          <span className="font-mono-num text-emerald-700">
            {allOn ? '🟢 Kompyuter yoniq!' : `${installed.length} / 4 ulandi`}
          </span>
        </div>

        <svg viewBox="0 0 460 198" className="w-full h-[186px] sm:h-[198px]" aria-label="Kompyuter qismlari konstruktori">
          {/* Wooden Desk */}
          <rect x="24" y="164" width="412" height="22" rx="8" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />

          {/* Cables connecting CPU to Monitor, Keyboard, Mouse */}
          <path d="M270,126 Q300,126 320,120" fill="none" stroke={allOn ? '#22C55E' : '#94A3B8'} strokeWidth="3" strokeDasharray={allOn ? undefined : '4 4'} />
          <path d="M268,150 Q296,156 320,145" fill="none" stroke={allOn ? '#22C55E' : '#94A3B8'} strokeWidth="3" strokeDasharray={allOn ? undefined : '4 4'} />

          {/* 1. MONITOR SLOT (Top Center-Left) */}
          <g
            transform="translate(116, 22)"
            className={!isAssemble && !solved ? 'cursor-pointer' : ''}
            onClick={() => handleFindPartClick('monitor')}
          >
            {hasPart('monitor') ? (
              <motion.g initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <rect x="64" y="96" width="26" height="16" fill="#475569" />
                <rect x="44" y="108" width="66" height="9" rx="4" fill="#334155" />
                <rect
                  x="0"
                  y="0"
                  width="154"
                  height="98"
                  rx="12"
                  fill="#1E293B"
                  stroke={solved && data.targetPart === 'monitor' ? '#22C55E' : wrongPart === 'monitor' ? '#EF4444' : '#0F172A'}
                  strokeWidth="3.5"
                />
                <rect x="10" y="10" width="134" height="76" rx="6" fill={allOn ? '#38BDF8' : '#334155'} />
                {allOn ? (
                  <>
                    <text x="77" y="45" textAnchor="middle" fontSize="22">😊✨</text>
                    <text x="77" y="68" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#0F172A">
                      Xush kelibsiz!
                    </text>
                  </>
                ) : (
                  <text x="77" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="#94A3B8">
                    Monitor ulandi ✓
                  </text>
                )}
              </motion.g>
            ) : (
              <g>
                <rect x="0" y="0" width="154" height="98" rx="12" fill="#FFFFFF" opacity="0.6" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="7 5" />
                <text x="77" y="54" textAnchor="middle" fontSize="13" fontWeight="800" fill="#64748B">
                  🖥️ Monitor joyi
                </text>
              </g>
            )}
          </g>

          {/* 2. SYSTEM UNIT / CPU SLOT (Right Side) */}
          <g
            transform="translate(322, 34)"
            className={!isAssemble && !solved ? 'cursor-pointer' : ''}
            onClick={() => handleFindPartClick('cpu')}
          >
            {hasPart('cpu') ? (
              <motion.g initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <rect
                  x="0"
                  y="0"
                  width="82"
                  height="130"
                  rx="10"
                  fill="#334155"
                  stroke={solved && data.targetPart === 'cpu' ? '#22C55E' : wrongPart === 'cpu' ? '#EF4444' : '#0F172A'}
                  strokeWidth="3"
                />
                <rect x="12" y="16" width="58" height="14" rx="3" fill="#1E293B" />
                <rect x="12" y="38" width="58" height="10" rx="3" fill="#1E293B" />
                <circle cx="41" cy="78" r="11" fill={allOn ? '#22C55E' : '#64748B'} stroke="#FFFFFF" strokeWidth="2" />
                <text x="41" y="114" textAnchor="middle" fontSize="10" fontWeight="800" fill="#E2E8F0">
                  MIYA (CPU)
                </text>
              </motion.g>
            ) : (
              <g>
                <rect x="0" y="0" width="82" height="130" rx="10" fill="#FFFFFF" opacity="0.6" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="7 5" />
                <text x="41" y="64" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748B">
                  🗄️ Tizim
                </text>
                <text x="41" y="79" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748B">
                  bloki
                </text>
              </g>
            )}
          </g>

          {/* 3. KEYBOARD SLOT (Bottom Left-Center) */}
          <g
            transform="translate(92, 134)"
            className={!isAssemble && !solved ? 'cursor-pointer' : ''}
            onClick={() => handleFindPartClick('keyboard')}
          >
            {hasPart('keyboard') ? (
              <motion.g initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <rect
                  x="0"
                  y="0"
                  width="156"
                  height="28"
                  rx="7"
                  fill="#475569"
                  stroke={solved && data.targetPart === 'keyboard' ? '#22C55E' : wrongPart === 'keyboard' ? '#EF4444' : '#0F172A'}
                  strokeWidth="2.5"
                />
                {[12, 30, 48, 66, 84, 102, 120, 136].map((kx) => (
                  <rect key={kx} x={kx} y="6" width="12" height="7" rx="2" fill="#E2E8F0" />
                ))}
                <rect x="38" y="16" width="76" height="6" rx="2" fill="#CBD5E1" />
              </motion.g>
            ) : (
              <g>
                <rect x="0" y="0" width="156" height="28" rx="7" fill="#FFFFFF" opacity="0.6" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" />
                <text x="78" y="18" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748B">
                  ⌨️ Klaviatura
                </text>
              </g>
            )}
          </g>

          {/* 4. MOUSE SLOT (Bottom Center-Right) */}
          <g
            transform="translate(262, 134)"
            className={!isAssemble && !solved ? 'cursor-pointer' : ''}
            onClick={() => handleFindPartClick('mouse')}
          >
            {hasPart('mouse') ? (
              <motion.g initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <rect
                  x="0"
                  y="0"
                  width="40"
                  height="28"
                  rx="13"
                  fill="#E2E8F0"
                  stroke={solved && data.targetPart === 'mouse' ? '#22C55E' : wrongPart === 'mouse' ? '#EF4444' : '#334155'}
                  strokeWidth="2.5"
                />
                <line x1="20" y1="2" x2="20" y2="14" stroke="#64748B" strokeWidth="2" />
              </motion.g>
            ) : (
              <g>
                <rect x="0" y="0" width="44" height="28" rx="12" fill="#FFFFFF" opacity="0.6" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 4" />
                <text x="22" y="19" textAnchor="middle" fontSize="13">🖱️</text>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Bottom 4 Part Cards (install in assemble mode OR click in find_part mode) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PC_PARTS.map((p) => {
          const isInstalled = isAssemble && (installed.includes(p.id) || solved);
          const isFoundRight = !isAssemble && solved && p.id === data.targetPart;
          const isWrong = wrongPart === p.id;
          return (
            <motion.button
              key={p.id}
              type="button"
              disabled={isInstalled || solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              onClick={() => (isAssemble ? handleInstallPart(p.id) : handleFindPartClick(p.id))}
              className={`min-h-[72px] rounded-2xl border-2 border-b-4 px-2 py-2 flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer transition-all ${
                isFoundRight || isInstalled
                  ? 'bg-emerald-600 border-emerald-700 text-white'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 text-white'
                  : 'bg-white hover:bg-sky-50 border-sky-300 border-b-sky-500 text-slate-900 active:scale-95'
              }`}
            >
              <span className="text-2xl leading-none">{p.emoji}</span>
              <span className="text-xs font-extrabold leading-tight">{p.label}</span>
              <span className={`text-[10px] font-semibold ${isFoundRight || isInstalled || isWrong ? 'text-white/90' : 'text-slate-500'}`}>
                {p.role}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 10-DARS: "ROST YOKI YOLG'ON CHIROQLARI (MANTIQIY DETEKTIV)" (logic_detective)
// =========================================================================
export const LogicDetectiveStage: React.FC<CsGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.logicData ?? {
    illustrationEmoji: '🌙☀️',
    statement: '«Quyosh kechasi osmonda porlaydi.»',
    isTrue: false,
  };
  const [wrongBtn, setWrongBtn] = useState<'true' | 'false' | null>(null);

  const handleJudge = (pickedTrue: boolean) => {
    if (solved) return;
    if (pickedTrue === data.isTrue) {
      setWrongBtn(null);
      onSolve();
    } else {
      setWrongBtn(pickedTrue ? 'true' : 'false');
      soundEngine.playWrong();
      onStepMistake?.(
        round.teacherHint ||
          (data.isTrue
            ? 'Yaxshilab o‘yla — bu haqiqat! Yashil [✅ ROST] chirog‘ini yoq!'
            : 'Ehtiyot bo‘l, bu xato fikr! Qizil [❌ YOLG‘ON] chirog‘ini yoq!')
      );
      window.setTimeout(() => setWrongBtn(null), 550);
    }
  };

  return (
    <div className="space-y-4">
      {/* Detective Clue Console */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-400 p-5 text-center text-white space-y-2.5 overflow-hidden select-none">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
          <Search className="w-4 h-4" />
          <span>Mantiqiy Detektiv Tekshiruvi</span>
        </div>

        <div className="text-5xl sm:text-6xl leading-none py-1">{data.illustrationEmoji}</div>

        <p className="text-lg sm:text-xl font-display font-extrabold text-white text-balance">
          {data.statement}
        </p>

        {solved && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.6, 1.15, 1], opacity: 1 }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 text-slate-950 px-3.5 py-1 font-display font-black text-xs sm:text-sm shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>DETEKTIV YULDUZCHASI OLINDI! ⭐</span>
          </motion.div>
        )}
      </div>

      {/* 2 Giant Glowing Logic Bulbs: ✅ ROST vs ❌ YOLG'ON */}
      <div className="grid grid-cols-2 gap-3.5">
        <motion.button
          type="button"
          disabled={solved}
          animate={wrongBtn === 'true' ? { x: [0, -6, 6, -4, 4, 0] } : solved && data.isTrue ? { scale: [1, 1.05, 1] } : {}}
          onClick={() => handleJudge(true)}
          className={`min-h-[88px] rounded-2xl border-2 border-b-4 px-4 py-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
            solved && data.isTrue
              ? 'bg-emerald-500 border-emerald-700 border-b-emerald-900 text-white shadow-[0_0_24px_rgba(34,197,94,0.55)]'
              : solved
              ? 'bg-slate-100 border-slate-200 text-slate-400'
              : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-400 border-b-emerald-600 text-emerald-950'
          }`}
        >
          <span className="text-3xl leading-none">✅</span>
          <span className="text-lg sm:text-xl font-display font-black tracking-wide">ROST</span>
        </motion.button>

        <motion.button
          type="button"
          disabled={solved}
          animate={wrongBtn === 'false' ? { x: [0, -6, 6, -4, 4, 0] } : solved && !data.isTrue ? { scale: [1, 1.05, 1] } : {}}
          onClick={() => handleJudge(false)}
          className={`min-h-[88px] rounded-2xl border-2 border-b-4 px-4 py-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
            solved && !data.isTrue
              ? 'bg-rose-500 border-rose-700 border-b-rose-900 text-white shadow-[0_0_24px_rgba(244,63,94,0.55)]'
              : solved
              ? 'bg-slate-100 border-slate-200 text-slate-400'
              : 'bg-rose-50 hover:bg-rose-100 border-rose-400 border-b-rose-600 text-rose-950'
          }`}
        >
          <span className="text-3xl leading-none">❌</span>
          <span className="text-lg sm:text-xl font-display font-black tracking-wide">YOLG‘ON</span>
        </motion.button>
      </div>
    </div>
  );
};

// Suppress unused RotateCw if not needed
export const CS_GAME_TITLES: Record<string, string> = {
  senses_sorter: 'Sehrli Durbin va Quloqchin',
  taste_conveyor: 'Sehrli Konveyer',
  time_machine: "Vaqt Mashinasi (Edi ➔ Bo'ldi)",
  chef_algo: 'Kichik Oshpaz (Algoritm)',
  cycle_carousel: 'Sehrli Karusel (Tsikl)',
  drone_flight: 'Aqlli Dron Parvozi',
  short_path: "Quyonchaning Eng Qisqa Yo'li",
  robot_maze: 'Robotcha Labirinti (Mini-Scratch)',
  pc_builder: 'Kompyuter Qismlari Konstruktori',
  logic_detective: "Rost yoki Yolg'on Chiroqlari",
};
