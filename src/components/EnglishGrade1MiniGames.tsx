import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Check, Sparkles, Volume2 } from 'lucide-react';
import type { EnglishInteractiveRound } from '../data/curriculum';
import { soundEngine, speakEnglish } from '../utils/sound';

export interface EnglishGrade1StageProps {
  round: EnglishInteractiveRound;
  solved: boolean;
  studentName?: string;
  onSolve: () => void;
  onStepSuccess?: (message?: string) => void;
  onStepMistake?: (teacherHint: string) => void;
}

/** Shared compact English Listen button used across all 10 stages */
const ListenBanner: React.FC<{
  englishText: string;
  uzbekHint?: string;
  speakText: string;
  accent?: 'emerald' | 'sky' | 'amber' | 'violet' | 'rose';
}> = ({ englishText, uzbekHint, speakText, accent = 'emerald' }) => {
  const palette = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    sky: 'bg-sky-50 border-sky-200 text-sky-950',
    amber: 'bg-amber-50 border-amber-200 text-amber-950',
    violet: 'bg-violet-50 border-violet-200 text-violet-950',
    rose: 'bg-rose-50 border-rose-200 text-rose-950',
  }[accent];

  const btnCls = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    sky: 'bg-sky-600 hover:bg-sky-700 text-white',
    amber: 'bg-amber-500 hover:bg-amber-600 text-white',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
  }[accent];

  return (
    <div
      className={`rounded-2xl border px-4 py-3 flex items-center justify-between gap-3 ${palette}`}
    >
      <div className="min-w-0">
        <div className="text-base sm:text-lg font-display font-extrabold leading-snug">
          {englishText}
        </div>
        {uzbekHint && (
          <div className="text-xs font-semibold opacity-80 mt-0.5">{uzbekHint}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => speakEnglish(speakText)}
        aria-label="Inglizcha talaffuzni tinglash"
        className={`h-11 px-3.5 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-transform active:scale-95 whitespace-nowrap ${btnCls}`}
      >
        <Volume2 className="w-4 h-4 shrink-0" />
        <span>Listen</span>
      </button>
    </div>
  );
};

// =========================================================================
// 1-DARS: "HELLO & GOODBYE CLUB" (greetings_club)
// =========================================================================
export const GreetingsClubStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  studentName,
  onSolve,
  onStepMistake,
}) => {
  const data = round.greetingsData ?? {
    mode: 'greeting_choice',
    scene: 'morning',
    characterPromptEn: 'Say Hello! 👋',
    options: [],
  };
  const [wrongId, setWrongId] = useState<string | null>(null);
  const displayName = (studentName && studentName.trim()) || 'Ali';

  useEffect(() => {
    const t = window.setTimeout(() => speakEnglish(round.speakText), 240);
    return () => window.clearTimeout(t);
  }, [round.speakText]);

  const skyGradient =
    data.scene === 'sunset'
      ? 'from-amber-200 via-orange-100 to-rose-100'
      : data.scene === 'gift'
      ? 'from-pink-100 via-amber-50 to-emerald-100'
      : 'from-sky-200 via-sky-100 to-emerald-100';

  const handleOption = (opt: NonNullable<typeof data.options>[number]) => {
    if (solved) return;
    speakEnglish(opt.speakText);
    if (opt.isCorrect) {
      setWrongId(null);
      onSolve();
    } else {
      setWrongId(opt.id);
      soundEngine.playWrong();
      onStepMistake?.(
        round.teacherHint || `Yana urinib ko'ring! "${opt.labelEn}" — ${opt.labelUz}.`
      );
    }
  };

  const handleNameSay = () => {
    if (solved) return;
    speakEnglish(`Hello! My name is ${displayName}!`);
    onSolve();
  };

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={data.characterPromptEn}
        uzbekHint={round.translation}
        speakText={round.speakText}
        accent="emerald"
      />

      {/* Cartoon Friend Stage */}
      <div
        className={`relative rounded-3xl border border-slate-200 bg-gradient-to-b ${skyGradient} p-5 flex flex-col items-center justify-center min-h-[195px] overflow-hidden`}
      >
        {/* Decorative sun or sunset */}
        <div
          className={`absolute top-4 right-5 w-11 h-11 rounded-full ${
            data.scene === 'sunset' ? 'bg-orange-400' : 'bg-amber-300'
          } shadow-[0_0_24px_rgba(251,191,36,0.6)]`}
        />

        {/* Speech Bubble */}
        <motion.div
          key={solved ? 'done' : 'ask'}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-3 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm text-center max-w-xs"
        >
          <span className="text-sm sm:text-base font-display font-extrabold text-slate-900">
            {solved
              ? data.mode === 'name_intro'
                ? `Nice to meet you, ${displayName}! ⭐`
                : round.praiseText
              : data.characterPromptEn}
          </span>
        </motion.div>

        {/* Animated Cartoon Friend SVG */}
        <motion.div
          animate={
            solved
              ? { y: [0, -10, 0], rotate: [0, -4, 4, 0] }
              : { y: [0, -3, 0] }
          }
          transition={{ duration: solved ? 0.65 : 2.2, repeat: Infinity }}
          className="relative"
        >
          <svg width="130" height="122" viewBox="0 0 130 122" aria-hidden="true">
            {/* Shirt */}
            <rect x="38" y="76" width="54" height="40" rx="16" fill="#2563EB" />
            {/* Collar */}
            <path d="M53 76 L65 89 L77 76 Z" fill="#FFFFFF" />
            {/* Left arm */}
            <rect x="22" y="80" width="16" height="32" rx="8" fill="#FDBA74" />
            {/* Right waving arm */}
            <motion.g
              style={{ transformOrigin: '92px 86px' }}
              animate={
                solved
                  ? { rotate: [-28, 22, -28] }
                  : { rotate: [-12, 8, -12] }
              }
              transition={{ duration: solved ? 0.45 : 1.3, repeat: Infinity }}
            >
              <rect x="92" y="54" width="16" height="36" rx="8" fill="#FDBA74" />
              <circle cx="100" cy="52" r="9" fill="#FDBA74" />
            </motion.g>
            {/* Head */}
            <circle cx="65" cy="46" r="31" fill="#FED7AA" stroke="#F59E0B" strokeWidth="1.5" />
            {/* Hair */}
            <path
              d="M34 42 C34 18, 96 18, 96 42 C88 29, 76 26, 65 28 C54 26, 42 29, 34 42 Z"
              fill="#334155"
            />
            {/* Eyes */}
            <circle cx="53" cy="46" r="4" fill="#0F172A" />
            <circle cx="77" cy="46" r="4" fill="#0F172A" />
            <circle cx="54.5" cy="44.5" r="1.4" fill="#FFFFFF" />
            <circle cx="78.5" cy="44.5" r="1.4" fill="#FFFFFF" />
            {/* Rosy cheeks */}
            <circle cx="44" cy="54" r="5" fill="#FB7185" opacity="0.45" />
            <circle cx="86" cy="54" r="5" fill="#FB7185" opacity="0.45" />
            {/* Smile */}
            <path
              d={solved ? 'M51 56 Q65 71 79 56' : 'M55 58 Q65 65 75 58'}
              fill={solved ? '#F43F5E' : 'none'}
              stroke="#0F172A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          {data.scene === 'gift' && (
            <span className="absolute -left-5 bottom-1 text-3xl">🎁</span>
          )}
        </motion.div>
      </div>

      {/* Controls */}
      {data.mode === 'name_intro' ? (
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            disabled={solved}
            onClick={handleNameSay}
            className={`w-full max-w-md min-h-[64px] rounded-2xl border-2 border-b-4 px-5 py-3.5 flex items-center justify-center gap-3 font-display font-extrabold text-lg sm:text-xl transition-all cursor-pointer active:scale-95 ${
              solved
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'bg-white hover:bg-emerald-50 border-emerald-400 border-b-emerald-600 text-emerald-950'
            }`}
          >
            <span className="text-2xl">🗣️</span>
            <span>My name is {displayName}!</span>
            <Volume2 className="w-5 h-5 shrink-0 opacity-80" />
          </button>
          <span className="text-xs font-medium text-slate-500">
            Tugmani bosing va inglizcha o&apos;z ismingizni ayting!
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(data.options ?? []).map((opt) => {
            const isWrong = wrongId === opt.id;
            const isWin = solved && opt.isCorrect;
            return (
              <motion.button
                key={opt.id}
                type="button"
                disabled={solved}
                animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
                onClick={() => handleOption(opt)}
                className={`min-h-[76px] rounded-2xl border-2 border-b-4 px-4 py-3 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 ${
                  isWin
                    ? 'bg-emerald-600 border-emerald-700 border-b-emerald-900 text-white'
                    : isWrong
                    ? 'bg-rose-50 border-rose-400 text-rose-900'
                    : 'bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-400 border-b-slate-300 text-slate-900'
                }`}
              >
                <span className="text-2xl leading-none">{opt.emoji}</span>
                <span className="text-base font-display font-extrabold">{opt.labelEn}</span>
                <span className={`text-xs font-medium ${isWin ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {opt.labelUz}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2-DARS: "RAINBOW PAINTER (SEHRLI KAMALAK)" (rainbow_paint)
// =========================================================================
export const RainbowPaintStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.rainbowData ?? { bands: [], palette: [] };
  const [paintedCount, setPaintedCount] = useState(0);
  const [wrongColor, setWrongColor] = useState<string | null>(null);

  const activeBand = data.bands[paintedCount];
  const allPainted = paintedCount >= data.bands.length;

  useEffect(() => {
    if (activeBand) {
      const t = window.setTimeout(() => speakEnglish(activeBand.speakText), 240);
      return () => window.clearTimeout(t);
    }
  }, [paintedCount, activeBand]);

  const handlePickColor = (pot: (typeof data.palette)[number]) => {
    if (solved || allPainted || !activeBand) return;
    speakEnglish(pot.speakText);

    if (pot.colorId === activeBand.colorId) {
      setWrongColor(null);
      const nextCount = paintedCount + 1;
      setPaintedCount(nextCount);
      soundEngine.playFruitPluck(nextCount + 2);
      if (nextCount >= data.bands.length) {
        window.setTimeout(() => speakEnglish('Rainbow! Great job!'), 420);
        onSolve();
      } else {
        onStepSuccess?.(
          `Zo'r! ${activeBand.numberWord} — ${activeBand.colorNameEn} (${activeBand.colorNameUz}) bo'yaldi!`
        );
      }
    } else {
      setWrongColor(pot.colorId);
      soundEngine.playWrong();
      onStepMistake?.(
        `Bu ${pot.colorNameEn} (${pot.colorNameUz}). Hozir ${activeBand.number}-chiziq uchun ${activeBand.colorNameEn} (${activeBand.colorNameUz}) rangini tanlang!`
      );
    }
  };

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={
          activeBand
            ? `Color ${activeBand.numberWord} (${activeBand.number}) — ${activeBand.colorNameEn}! 🎨`
            : 'Magical Glowing Rainbow! 🌈✨'
        }
        uzbekHint={
          activeBand
            ? `${activeBand.number}-chiziqni ${activeBand.colorNameUz} (${activeBand.colorNameEn}) rangga bo'yang!`
            : round.praiseText
        }
        speakText={activeBand ? activeBand.speakText : 'Rainbow! Great job!'}
        accent="sky"
      />

      {/* Interactive SVG Rainbow Canvas */}
      <div
        className={`relative rounded-3xl border border-slate-200 p-4 flex flex-col items-center justify-center transition-all ${
          allPainted
            ? 'bg-gradient-to-b from-sky-200 via-amber-50 to-emerald-50 shadow-[0_0_28px_rgba(250,204,21,0.35)]'
            : 'bg-gradient-to-b from-sky-100 to-white'
        }`}
      >
        <svg viewBox="0 0 360 190" className="w-full max-w-[360px] h-auto" aria-label="Sehrli kamalak">
          {data.bands.map((band, idx) => {
            const radius = 140 - idx * 24;
            const isFilled = idx < paintedCount;
            const isCurrent = idx === paintedCount;
            const d = `M ${180 - radius} 162 A ${radius} ${radius} 0 0 1 ${180 + radius} 162`;

            return (
              <g key={`${band.number}-${band.colorId}`}>
                <path
                  d={d}
                  fill="none"
                  stroke={isFilled ? band.hex : '#E2E8F0'}
                  strokeWidth={20}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke 0.35s ease',
                    filter:
                      allPainted
                        ? 'drop-shadow(0 0 6px rgba(255,255,255,0.9))'
                        : undefined,
                  }}
                />
                {isCurrent && (
                  <path
                    d={d}
                    fill="none"
                    stroke="#64748B"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    opacity="0.7"
                  />
                )}
                {/* Band Number Label at Top Center */}
                <circle
                  cx={180}
                  cy={162 - radius}
                  r={11}
                  fill={isFilled ? '#FFFFFF' : isCurrent ? '#0F172A' : '#CBD5E1'}
                />
                <text
                  x={180}
                  y={166 - radius}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="800"
                  fill={isFilled ? '#0F172A' : isCurrent ? '#FFFFFF' : '#475569'}
                >
                  {band.number}
                </text>
              </g>
            );
          })}

          {/* Fluffy Clouds at Both Ends */}
          <g fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5">
            <circle cx="48" cy="162" r="18" />
            <circle cx="68" cy="158" r="22" />
            <circle cx="90" cy="164" r="16" />
            <circle cx="270" cy="164" r="16" />
            <circle cx="292" cy="158" r="22" />
            <circle cx="312" cy="162" r="18" />
          </g>

          {/* Sparkling Stars on Completion */}
          {allPainted && (
            <g fill="#FACC15" fontSize="18">
              <text x="58" y="54">✨</text>
              <text x="284" y="52">✨</text>
              <text x="171" y="24">⭐</text>
            </g>
          )}
        </svg>
      </div>

      {/* Paint Pots Palette */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {data.palette.map((pot) => {
          const isWrong = wrongColor === pot.colorId;
          return (
            <motion.button
              key={pot.colorId}
              type="button"
              disabled={solved || allPainted}
              animate={isWrong ? { x: [-5, 5, -4, 4, 0] } : {}}
              onClick={() => handlePickColor(pot)}
              className="min-h-[68px] rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 bg-white hover:border-slate-400 px-3 py-2.5 flex items-center gap-2.5 cursor-pointer transition-transform active:scale-95"
            >
              <span
                className="w-9 h-9 rounded-xl border-2 border-white shadow-sm shrink-0"
                style={{ backgroundColor: pot.hex }}
              />
              <div className="text-left min-w-0">
                <div className="text-sm font-display font-extrabold text-slate-900 truncate">
                  {pot.colorNameEn}
                </div>
                <div className="text-xs font-medium text-slate-500 truncate">
                  {pot.colorNameUz}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 3-DARS: "BACKPACK PACKER (AQLLI SUMKA)" (backpack_pack)
// =========================================================================
export const BackpackPackStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.backpackData ?? { targets: [], distractors: [] };
  const [stepIdx, setStepIdx] = useState(0);
  const [packedIds, setPackedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [dragOverBag, setDragOverBag] = useState(false);

  const activeTarget = data.targets[stepIdx];
  const allPacked = packedIds.length >= data.targets.length;

  const deskItems = useMemo(() => {
    const combined = [
      ...data.targets.map((t) => ({
        id: t.id,
        labelEn: t.labelEn,
        labelUz: t.labelUz,
        emoji: t.emoji,
        speakText: t.speakText,
      })),
      ...data.distractors,
    ];
    return combined.sort((a, b) => a.labelEn.localeCompare(b.labelEn));
  }, [data]);

  useEffect(() => {
    if (activeTarget) {
      const t = window.setTimeout(
        () => speakEnglish(`Put the ${activeTarget.speakText} into the bag!`),
        240
      );
      return () => window.clearTimeout(t);
    }
  }, [stepIdx, activeTarget]);

  const tryPackItem = (item: (typeof deskItems)[number]) => {
    if (solved || allPacked || !activeTarget) return;
    speakEnglish(item.speakText);

    if (item.id === activeTarget.id) {
      setWrongId(null);
      const nextPacked = [...packedIds, item.id];
      setPackedIds(nextPacked);
      soundEngine.playFruitPluck(nextPacked.length + 3);

      if (nextPacked.length >= data.targets.length) {
        setStepIdx(data.targets.length);
        soundEngine.playLessonComplete();
        window.setTimeout(() => speakEnglish('Great job! Your bag is ready!'), 420);
        onSolve();
      } else {
        setStepIdx(stepIdx + 1);
        onStepSuccess?.(`Barakalla! ${item.labelEn} (${item.labelUz}) sumkaga solindi! 🎒`);
      }
    } else {
      setWrongId(item.id);
      soundEngine.playWrong();
      onStepMistake?.(
        `Bu ${item.labelEn} (${item.labelUz}). Hozir ${activeTarget.labelEn} (${activeTarget.labelUz} ${activeTarget.emoji}) ni sumkaga soling!`
      );
    }
  };

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={
          activeTarget ? activeTarget.commandEn : 'Backpack zipped! Ready for school! 🎒✨'
        }
        uzbekHint={
          activeTarget
            ? `${activeTarget.labelUz} (${activeTarget.labelEn}) ni bosing yoki sumkaga sudrab soling!`
            : round.praiseText
        }
        speakText={
          activeTarget
            ? `Put the ${activeTarget.speakText} into the bag!`
            : 'Great job! Your bag is ready!'
        }
        accent="amber"
      />

      {/* Smart Backpack Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOverBag(true);
        }}
        onDragLeave={() => setDragOverBag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverBag(false);
          const droppedId = e.dataTransfer.getData('text/plain');
          const found = deskItems.find((i) => i.id === droppedId);
          if (found) tryPackItem(found);
        }}
        className={`rounded-3xl border-2 border-dashed p-4 flex flex-col sm:flex-row items-center justify-center gap-5 transition-all ${
          allPacked
            ? 'bg-emerald-50 border-emerald-400'
            : dragOverBag
            ? 'bg-amber-100 border-amber-500 scale-[1.01]'
            : 'bg-amber-50/60 border-amber-300'
        }`}
      >
        <motion.div
          animate={allPacked ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center"
        >
          <svg width="116" height="122" viewBox="0 0 116 122" aria-hidden="true">
            {/* Handle */}
            <path
              d="M42 22 C42 6, 74 6, 74 22"
              fill="none"
              stroke="#1D4ED8"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Main Body */}
            <rect x="18" y="22" width="80" height="92" rx="22" fill="#2563EB" />
            {/* Open / Closed Flap */}
            <path
              d={
                allPacked
                  ? 'M18 42 Q58 64 98 42 L98 28 Q58 18 18 28 Z'
                  : 'M18 32 Q58 14 98 32 L94 22 Q58 10 22 22 Z'
              }
              fill="#1E40AF"
            />
            {/* Front Pocket */}
            <rect x="30" y="64" width="56" height="36" rx="12" fill="#60A5FA" />
            {/* Zipper */}
            <line
              x1="34"
              y1="66"
              x2="82"
              y2="66"
              stroke="#FACC15"
              strokeWidth="3.5"
              strokeDasharray={allPacked ? 'none' : '5 4'}
            />
            <circle cx={allPacked ? 82 : 38} cy="66" r="5" fill="#F59E0B" />
          </svg>
          <span className="text-xs font-extrabold text-blue-900 mt-1">
            {allPacked ? 'Yopildi! ✓' : `Sumka (${packedIds.length}/${data.targets.length})`}
          </span>
        </motion.div>

        {/* Packed items checklist */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {data.targets.map((t) => {
            const isIn = packedIds.includes(t.id);
            return (
              <div
                key={t.id}
                className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                  isIn
                    ? 'bg-emerald-600 border-emerald-700 text-white'
                    : 'bg-white border-amber-200 text-slate-500'
                }`}
              >
                <span className="text-lg">{t.emoji}</span>
                <span>{t.labelEn}</span>
                {isIn && <Check className="w-4 h-4" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desk Items (Draggable + Tappable) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {deskItems.map((item) => {
          const isPacked = packedIds.includes(item.id);
          const isWrong = wrongId === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              draggable={!isPacked && !solved}
              onDragStart={(e) => {
                (e as unknown as React.DragEvent).dataTransfer?.setData('text/plain', item.id);
              }}
              disabled={isPacked || solved}
              animate={isWrong ? { x: [-5, 5, -4, 4, 0] } : {}}
              onClick={() => tryPackItem(item)}
              className={`min-h-[82px] rounded-2xl border-2 border-b-4 px-2.5 py-2.5 flex flex-col items-center justify-center gap-1 transition-all ${
                isPacked
                  ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-45 cursor-default'
                  : isWrong
                  ? 'bg-rose-50 border-rose-400 text-rose-900 cursor-pointer'
                  : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-400 border-b-slate-300 text-slate-900 cursor-grab active:scale-95'
              }`}
            >
              <span className="text-3xl leading-none">{item.emoji}</span>
              <span className="text-xs font-display font-extrabold">{item.labelEn}</span>
              <span className="text-[11px] font-medium text-slate-500">{item.labelUz}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 4-DARS: "MYSTERY TOY BOX (SOYA DETEKTIVI)" (toy_box)
// =========================================================================
export const ToyBoxStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.toyBoxData ?? {
    toyId: 'ball',
    toyEmoji: '⚽',
    answerEn: 'It is a Ball!',
    answerUz: 'Bu koptok!',
    actionCaptionEn: 'Bounce!',
    options: [],
  };
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => speakEnglish(round.speakText), 240);
    return () => window.clearTimeout(t);
  }, [round.speakText]);

  const handleGuess = (opt: (typeof data.options)[number]) => {
    if (solved) return;
    if (opt.isCorrect) {
      setWrongId(null);
      speakEnglish(data.answerEn);
      onSolve();
    } else {
      speakEnglish(opt.speakText);
      setWrongId(opt.id);
      soundEngine.playWrong();
      onStepMistake?.(
        round.teacherHint || `Bu ${opt.labelEn} (${opt.labelUz}) emas. Soyaga diqqat bilan qarang!`
      );
    }
  };

  const toyAnimation =
    data.toyId === 'ball'
      ? { y: [0, -28, 0, -16, 0], rotate: [0, 180, 360] }
      : data.toyId === 'car'
      ? { x: [-40, 48, 0] }
      : data.toyId === 'robot'
      ? { rotate: [-12, 12, -12, 12, 0], scale: [1, 1.12, 1] }
      : { scale: [1, 1.18, 0.96, 1.12, 1] };

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={solved ? data.answerEn : 'What is it? 🔦'}
        uzbekHint={solved ? data.answerUz : round.translation}
        speakText={solved ? data.answerEn : 'What is it?'}
        accent="violet"
      />

      {/* Projector Spotlight Stage */}
      <div
        className={`relative rounded-3xl border overflow-hidden min-h-[195px] flex flex-col items-center justify-center p-5 transition-colors duration-500 ${
          solved
            ? 'bg-gradient-to-b from-amber-100 via-yellow-50 to-emerald-50 border-amber-300'
            : 'bg-slate-900 border-slate-700'
        }`}
      >
        {/* Spotlight Cone */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-55"
          style={{
            background: solved
              ? 'radial-gradient(circle at 50% 45%, rgba(253,224,71,0.55), transparent 65%)'
              : 'conic-gradient(from 155deg at 50% 0%, rgba(254,240,138,0.42) 0deg, rgba(254,240,138,0.12) 50deg, transparent 58deg)',
          }}
        />

        {/* Projector Lamp Icon at Top */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold tracking-wide text-amber-300/90 flex items-center gap-1">
          <span>🔦</span>
          <span className={solved ? 'text-amber-800' : 'text-amber-200'}>
            {solved ? data.actionCaptionEn : 'Mystery Spotlight'}
          </span>
        </div>

        {/* Silhouette -> Lit Animated Toy */}
        <motion.div
          animate={solved ? toyAnimation : { scale: [1, 1.04, 1] }}
          transition={{ duration: solved ? 1.1 : 2, repeat: Infinity }}
          className="relative z-10 mt-4 select-none"
        >
          <span
            className="text-7xl sm:text-8xl leading-none block transition-all duration-500"
            style={{
              filter: solved
                ? 'drop-shadow(0 10px 14px rgba(0,0,0,0.18))'
                : 'brightness(0) drop-shadow(0 0 18px rgba(253,224,71,0.65))',
            }}
          >
            {data.toyEmoji}
          </span>
        </motion.div>

        {!solved && (
          <div className="relative z-10 mt-2 text-xs font-semibold text-amber-200/90">
            Soyadan qaysi o&apos;yinchoqligini toping!
          </div>
        )}
      </div>

      {/* Toy Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {data.options.map((opt) => {
          const isWrong = wrongId === opt.id;
          const isWin = solved && opt.isCorrect;
          return (
            <motion.button
              key={opt.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              onClick={() => handleGuess(opt)}
              className={`min-h-[76px] rounded-2xl border-2 border-b-4 px-4 py-3 flex items-center justify-center gap-3 cursor-pointer transition-all active:scale-95 ${
                isWin
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-900 text-white'
                  : isWrong
                  ? 'bg-rose-50 border-rose-400 text-rose-900'
                  : 'bg-white hover:bg-violet-50 border-slate-200 hover:border-violet-400 border-b-slate-300 text-slate-900'
              }`}
            >
              <span className="text-3xl leading-none">{opt.emoji}</span>
              <div className="text-left">
                <div className="text-base font-display font-extrabold">{opt.labelEn}</div>
                <div className={`text-xs font-medium ${isWin ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {opt.labelUz}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 5-DARS: "FAMILY PHOTO ALBUM (OILA SHAJARASI)" (family_album)
// =========================================================================
export const FamilyAlbumStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.familyData ?? { frames: [] };
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const activeFrame = data.frames[placedIds.length];
  const allPlaced = placedIds.length >= data.frames.length;

  const photoCards = useMemo(() => {
    const cards = [
      ...data.frames.map((f) => ({
        id: f.id,
        roleEn: f.roleEn,
        roleUz: f.roleUz,
        emoji: f.emoji,
        speakText: f.roleEn,
      })),
      ...(data.extraCards ?? []),
    ];
    return cards.sort((a, b) => a.roleEn.localeCompare(b.roleEn));
  }, [data]);

  useEffect(() => {
    if (activeFrame) {
      const t = window.setTimeout(() => speakEnglish(activeFrame.speakText), 240);
      return () => window.clearTimeout(t);
    }
  }, [placedIds.length, activeFrame]);

  const handleSelectPhoto = (card: (typeof photoCards)[number]) => {
    if (solved || allPlaced || !activeFrame) return;

    if (card.id === activeFrame.id) {
      setWrongId(null);
      speakEnglish(activeFrame.speakText);
      const next = [...placedIds, card.id];
      setPlacedIds(next);
      soundEngine.playFruitPluck(next.length + 2);

      if (next.length >= data.frames.length) {
        onSolve();
      } else {
        onStepSuccess?.(`Ajoyib! ${activeFrame.sentenceEn} (${activeFrame.roleUz})`);
      }
    } else {
      speakEnglish(card.speakText);
      setWrongId(card.id);
      soundEngine.playWrong();
      onStepMistake?.(
        `Bu ${card.roleEn} (${card.roleUz}). Hozir ${activeFrame.roleEn} (${activeFrame.roleUz} ${activeFrame.emoji}) suratini tanlang!`
      );
    }
  };

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={activeFrame ? activeFrame.sentenceEn : 'I love my FAMILY! ❤️'}
        uzbekHint={
          activeFrame
            ? `${activeFrame.roleUz} (${activeFrame.roleEn}) fotosuratini ramkaga joylashtiring!`
            : round.praiseText
        }
        speakText={activeFrame ? activeFrame.speakText : 'I love my family!'}
        accent="rose"
      />

      {/* Family Photo Album Tree */}
      <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 via-orange-50/40 to-emerald-50/60 p-4">
        <div className="text-center text-xs font-extrabold text-amber-900 mb-3">
          🌳 Family Photo Album · Oila Shajarasi
        </div>
        <div
          className={`grid gap-3 justify-items-center ${
            data.frames.length === 1
              ? 'grid-cols-1'
              : data.frames.length === 2
              ? 'grid-cols-2 max-w-md mx-auto'
              : 'grid-cols-2 sm:grid-cols-4'
          }`}
        >
          {data.frames.map((frame, idx) => {
            const isPlaced = placedIds.includes(frame.id);
            const isActive = idx === placedIds.length;
            return (
              <motion.div
                key={frame.id}
                animate={isPlaced ? { scale: [0.9, 1.05, 1] } : {}}
                className={`w-full max-w-[140px] rounded-2xl border-4 p-3 flex flex-col items-center justify-center min-h-[112px] transition-all ${
                  isPlaced
                    ? 'bg-white border-amber-400 shadow-md'
                    : isActive
                    ? 'bg-rose-50/80 border-dashed border-rose-400'
                    : 'bg-white/60 border-dashed border-amber-200'
                }`}
              >
                {isPlaced ? (
                  <>
                    <span className="text-4xl leading-none">{frame.emoji}</span>
                    <span className="text-xs font-display font-extrabold text-slate-900 mt-1.5">
                      {frame.roleEn}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700">
                      {frame.roleUz} ✓
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl opacity-50">🖼️</span>
                    <span className="text-xs font-bold text-slate-600 mt-1">
                      {isActive ? `${frame.roleEn}?` : 'Bo‘sh ramka'}
                    </span>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Photo Cards Tray */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {photoCards.map((card) => {
          const used = placedIds.includes(card.id);
          const isWrong = wrongId === card.id;
          return (
            <motion.button
              key={card.id}
              type="button"
              disabled={used || solved}
              animate={isWrong ? { x: [-5, 5, -4, 4, 0] } : {}}
              onClick={() => handleSelectPhoto(card)}
              className={`min-h-[76px] rounded-2xl border-2 border-b-4 px-3 py-2.5 flex flex-col items-center justify-center gap-1 transition-all ${
                used
                  ? 'bg-slate-100 border-slate-200 opacity-40 cursor-default'
                  : isWrong
                  ? 'bg-rose-50 border-rose-400 text-rose-900 cursor-pointer'
                  : 'bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-400 border-b-slate-300 text-slate-900 cursor-pointer active:scale-95'
              }`}
            >
              <span className="text-3xl leading-none">{card.emoji}</span>
              <span className="text-xs font-display font-extrabold">{card.roleEn}</span>
              <span className="text-[11px] font-medium text-slate-500">{card.roleUz}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 6-DARS: "DREAM HOUSE BUILDER (ORZUDAGI UYCHA)" (house_builder)
// =========================================================================
export const HouseBuilderStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.houseData ?? { slots: [], extraPieces: [] };
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const activeSlot = data.slots[placedIds.length];
  const allPlaced = placedIds.length >= data.slots.length;

  const pieces = useMemo(() => {
    const list = [
      ...data.slots.map((s) => ({
        id: s.id as string,
        shapeEn: s.shapeEn,
        itemEn: s.itemEn,
        labelUz: s.labelUz,
        emoji: s.emoji,
        speakText: `${s.shapeEn} ${s.itemEn}`,
      })),
      ...data.extraPieces,
    ];
    return list.sort((a, b) => a.itemEn.localeCompare(b.itemEn));
  }, [data]);

  useEffect(() => {
    if (activeSlot) {
      const t = window.setTimeout(() => speakEnglish(activeSlot.speakText), 240);
      return () => window.clearTimeout(t);
    }
  }, [placedIds.length, activeSlot]);

  const handlePickPiece = (piece: (typeof pieces)[number]) => {
    if (solved || allPlaced || !activeSlot) return;
    speakEnglish(piece.speakText);

    if (piece.id === activeSlot.id) {
      setWrongId(null);
      const next = [...placedIds, piece.id];
      setPlacedIds(next);
      soundEngine.playFruitPluck(next.length + 3);
      if (next.length >= data.slots.length) {
        onSolve();
      } else {
        onStepSuccess?.(
          `Zo'r! ${activeSlot.shapeEn} ${activeSlot.itemEn} (${activeSlot.labelUz}) joylandi!`
        );
      }
    } else {
      setWrongId(piece.id);
      soundEngine.playWrong();
      onStepMistake?.(
        `Bu ${piece.shapeEn} ${piece.itemEn}. Hozir ${activeSlot.shapeEn} ${activeSlot.itemEn} (${activeSlot.labelUz} ${activeSlot.emoji}) ni tanlang!`
      );
    }
  };

  const hasSlot = (id: string) => data.slots.some((s) => s.id === id);
  const isDone = (id: string) => placedIds.includes(id);

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={activeSlot ? activeSlot.commandEn : 'Dream House Complete! 🏠✨'}
        uzbekHint={
          activeSlot
            ? `${activeSlot.labelUz} (${activeSlot.shapeEn} ${activeSlot.itemEn}) shaklini tanlang!`
            : round.praiseText
        }
        speakText={activeSlot ? activeSlot.speakText : 'Dream house! Great job!'}
        accent="sky"
      />

      {/* Interactive SVG Dream House Canvas */}
      <div className="rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 p-4 flex justify-center">
        <svg viewBox="0 0 340 190" className="w-full max-w-[340px] h-auto" aria-label="Orzudagi uycha">
          {/* Lawn */}
          <rect x="0" y="156" width="340" height="34" rx="8" fill="#86EFAC" />

          {/* Sun slot (top right) */}
          {hasSlot('sun') ? (
            <g>
              <circle
                cx="294"
                cy="34"
                r="22"
                fill={isDone('sun') ? '#FACC15' : '#FFFFFF'}
                stroke={isDone('sun') ? '#EAB308' : '#0284C7'}
                strokeWidth="3"
                strokeDasharray={isDone('sun') ? 'none' : '5 4'}
              />
              {isDone('sun') && (
                <text x="294" y="42" textAnchor="middle" fontSize="24">
                  ☀️
                </text>
              )}
            </g>
          ) : (
            <circle cx="296" cy="34" r="18" fill="#FDE047" />
          )}

          {/* Triangle Tree slot (right yard) */}
          {hasSlot('tree') && (
            <g>
              <rect x="278" y="136" width="12" height="24" fill="#92400E" />
              <polygon
                points="284,78 256,138 312,138"
                fill={isDone('tree') ? '#16A34A' : '#FFFFFF'}
                stroke={isDone('tree') ? '#15803D' : '#0284C7'}
                strokeWidth="3"
                strokeDasharray={isDone('tree') ? 'none' : '5 4'}
              />
              {isDone('tree') && (
                <text x="284" y="124" textAnchor="middle" fontSize="22">
                  🌲
                </text>
              )}
            </g>
          )}

          {/* House Roof */}
          <polygon
            points="155,22 68,84 242,84"
            fill={
              hasSlot('roof')
                ? isDone('roof')
                  ? '#EF4444'
                  : '#FFFFFF'
                : '#F97316'
            }
            stroke={hasSlot('roof') && !isDone('roof') ? '#0284C7' : '#B91C1C'}
            strokeWidth="3"
            strokeDasharray={hasSlot('roof') && !isDone('roof') ? '6 5' : 'none'}
          />

          {/* House Walls */}
          <rect
            x="82"
            y="84"
            width="146"
            height="78"
            rx="6"
            fill={allPlaced ? '#FEF9C3' : '#FFFBEB'}
            stroke="#D97706"
            strokeWidth="2.5"
          />

          {/* Square Window Slot (left wall) */}
          <g>
            <rect
              x="96"
              y="98"
              width="36"
              height="36"
              rx="5"
              fill={
                hasSlot('window')
                  ? isDone('window')
                    ? '#38BDF8'
                    : '#FFFFFF'
                  : '#BAE6FD'
              }
              stroke={hasSlot('window') && !isDone('window') ? '#0284C7' : '#0369A1'}
              strokeWidth="2.5"
              strokeDasharray={hasSlot('window') && !isDone('window') ? '4 4' : 'none'}
            />
            {(!hasSlot('window') || isDone('window')) && (
              <>
                <line x1="114" y1="98" x2="114" y2="134" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1="96" y1="116" x2="132" y2="116" stroke="#FFFFFF" strokeWidth="2.5" />
              </>
            )}
          </g>

          {/* Door Slot (center) */}
          <g>
            <rect
              x="142"
              y="108"
              width="32"
              height="54"
              rx="4"
              fill={
                hasSlot('door')
                  ? isDone('door')
                    ? '#92400E'
                    : '#FFFFFF'
                  : '#B45309'
              }
              stroke={hasSlot('door') && !isDone('door') ? '#0284C7' : '#78350F'}
              strokeWidth="2.5"
              strokeDasharray={hasSlot('door') && !isDone('door') ? '4 4' : 'none'}
            />
            {(!hasSlot('door') || isDone('door')) && (
              <circle cx="167" cy="136" r="3" fill="#FACC15" />
            )}
          </g>

          {/* Round Clock / Star Lamp / Bed / Table right interior */}
          {hasSlot('clock') && (
            <g>
              <circle
                cx="202"
                cy="116"
                r="18"
                fill={isDone('clock') ? '#FEF08A' : '#FFFFFF'}
                stroke={isDone('clock') ? '#CA8A04' : '#0284C7'}
                strokeWidth="2.5"
                strokeDasharray={isDone('clock') ? 'none' : '4 4'}
              />
              {isDone('clock') && (
                <text x="202" y="123" textAnchor="middle" fontSize="20">
                  🕒
                </text>
              )}
            </g>
          )}

          {hasSlot('lamp') && (
            <g>
              <circle
                cx="202"
                cy="110"
                r="17"
                fill={isDone('lamp') ? '#FEF08A' : '#FFFFFF'}
                stroke={isDone('lamp') ? '#EAB308' : '#0284C7'}
                strokeWidth="2.5"
                strokeDasharray={isDone('lamp') ? 'none' : '4 4'}
              />
              {isDone('lamp') && (
                <text x="202" y="117" textAnchor="middle" fontSize="20">
                  ⭐
                </text>
              )}
            </g>
          )}

          {hasSlot('bed') && (
            <g>
              <rect
                x="182"
                y="124"
                width="38"
                height="30"
                rx="6"
                fill={isDone('bed') ? '#E0E7FF' : '#FFFFFF'}
                stroke={isDone('bed') ? '#4F46E5' : '#0284C7'}
                strokeWidth="2.5"
                strokeDasharray={isDone('bed') ? 'none' : '4 4'}
              />
              {isDone('bed') && (
                <text x="201" y="146" textAnchor="middle" fontSize="20">
                  🛏️
                </text>
              )}
            </g>
          )}

          {hasSlot('table') && (
            <g>
              <rect
                x="96"
                y="134"
                width="34"
                height="24"
                rx="6"
                fill={isDone('table') ? '#FED7AA' : '#FFFFFF'}
                stroke={isDone('table') ? '#EA580C' : '#0284C7'}
                strokeWidth="2.5"
                strokeDasharray={isDone('table') ? 'none' : '4 4'}
              />
              {isDone('table') && (
                <text x="113" y="152" textAnchor="middle" fontSize="18">
                  🪑
                </text>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* Shape Pieces Tray */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {pieces.map((p) => {
          const used = placedIds.includes(p.id);
          const isWrong = wrongId === p.id;
          return (
            <motion.button
              key={p.id}
              type="button"
              disabled={used || solved}
              animate={isWrong ? { x: [-5, 5, -4, 4, 0] } : {}}
              onClick={() => handlePickPiece(p)}
              className={`min-h-[78px] rounded-2xl border-2 border-b-4 px-3 py-2.5 flex flex-col items-center justify-center gap-1 transition-all ${
                used
                  ? 'bg-slate-100 border-slate-200 opacity-40 cursor-default'
                  : isWrong
                  ? 'bg-rose-50 border-rose-400 text-rose-900 cursor-pointer'
                  : 'bg-white hover:bg-sky-50 border-slate-200 hover:border-sky-400 border-b-slate-300 text-slate-900 cursor-pointer active:scale-95'
              }`}
            >
              <span className="text-3xl leading-none">{p.emoji}</span>
              <span className="text-xs font-display font-extrabold">
                {p.shapeEn} {p.itemEn}
              </span>
              <span className="text-[11px] font-medium text-slate-500">{p.labelUz}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 7-DARS: "FUNNY FACE MAKER (QUVNOQ QAHRAMON YUZI)" (face_maker)
// =========================================================================
export const FaceMakerStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.faceData ?? { mode: 'build_face', parts: [], extraParts: [] };
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [senseStep, setSenseStep] = useState(0);
  const [soapDone, setSoapDone] = useState(false);
  const [waterDone, setWaterDone] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const parts = data.parts ?? [];
  const activePart = parts[placedIds.length];
  const senseTargets = data.senseTargets ?? [];
  const activeSense = senseTargets[senseStep];

  const trayParts = useMemo(() => {
    const all = [
      ...parts.map((p) => ({
        id: p.id as string,
        labelEn: p.labelEn,
        labelUz: p.labelUz,
        emoji: p.emoji,
        speakText: p.labelEn,
      })),
      ...(data.extraParts ?? []),
    ];
    return all.sort((a, b) => a.labelEn.localeCompare(b.labelEn));
  }, [parts, data.extraParts]);

  useEffect(() => {
    if (data.mode === 'build_face' && activePart) {
      const t = window.setTimeout(() => speakEnglish(activePart.speakText), 240);
      return () => window.clearTimeout(t);
    }
    if (data.mode === 'senses_tap' && activeSense) {
      const t = window.setTimeout(() => speakEnglish(activeSense.speakText), 240);
      return () => window.clearTimeout(t);
    }
    if (data.mode === 'wash_hands') {
      const t = window.setTimeout(() => speakEnglish('Wash your hands!'), 240);
      return () => window.clearTimeout(t);
    }
  }, [data.mode, activePart, activeSense]);

  if (data.mode === 'wash_hands') {
    const handleSoap = () => {
      if (solved || soapDone) return;
      speakEnglish('Soap! Wash your hands!');
      soundEngine.playWaterSplash();
      setSoapDone(true);
      onStepSuccess?.("Ajoyib! Endi suv (Water 💧) bilan chaying!");
    };
    const handleWater = () => {
      if (solved) return;
      if (!soapDone) {
        soundEngine.playWrong();
        onStepMistake?.("Avval sovun (Soap 🧼) bilan ko'piklang, keyin suv quying!");
        return;
      }
      speakEnglish('Clean hands! Great job!');
      soundEngine.playWaterSplash();
      setWaterDone(true);
      onSolve();
    };

    return (
      <div className="space-y-4">
        <ListenBanner
          englishText="Wash your HANDS! 🧼💧"
          uzbekHint="Avval sovun (Soap), keyin suv (Water) tugmasini bosing!"
          speakText="Wash your hands!"
          accent="sky"
        />
        <div className="rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-6 flex flex-col items-center justify-center min-h-[175px]">
          <motion.div
            animate={waterDone ? { scale: [1, 1.15, 1] } : soapDone ? { rotate: [-6, 6, -6] } : {}}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-7xl leading-none relative"
          >
            <span>🙌</span>
            {soapDone && !waterDone && (
              <span className="absolute -top-3 -right-4 text-3xl">🫧</span>
            )}
            {waterDone && (
              <span className="absolute -top-3 -right-4 text-3xl">✨</span>
            )}
          </motion.div>
          <div className="text-sm font-display font-extrabold text-sky-900 mt-3">
            {waterDone
              ? 'Clean hands! Sparkling! ✨'
              : soapDone
              ? 'Bubbly soap! Now add Water! 💧'
              : 'Wash with Soap & Water!'}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={soapDone || solved}
            onClick={handleSoap}
            className={`min-h-[68px] rounded-2xl border-2 border-b-4 px-4 py-3 font-display font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
              soapDone
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                : 'bg-white hover:bg-pink-50 border-pink-300 border-b-pink-500 text-slate-900'
            }`}
          >
            <span className="text-2xl">🧼</span>
            <span>1. SOAP (Sovun)</span>
          </button>
          <button
            type="button"
            disabled={waterDone || solved}
            onClick={handleWater}
            className={`min-h-[68px] rounded-2xl border-2 border-b-4 px-4 py-3 font-display font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
              waterDone
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'bg-white hover:bg-sky-50 border-sky-300 border-b-sky-500 text-slate-900'
            }`}
          >
            <span className="text-2xl">💧</span>
            <span>2. WATER (Suv)</span>
          </button>
        </div>
      </div>
    );
  }

  if (data.mode === 'senses_tap') {
    const handleTapSense = (id: 'eyes' | 'ears' | 'mouth') => {
      if (solved || !activeSense) return;
      if (id === activeSense.id) {
        setWrongId(null);
        speakEnglish(activeSense.speakText);
        soundEngine.playFruitPluck(senseStep + 4);
        if (senseStep + 1 >= senseTargets.length) {
          onSolve();
        } else {
          setSenseStep(senseStep + 1);
          onStepSuccess?.(`Barakalla! ${activeSense.speakText}`);
        }
      } else {
        setWrongId(id);
        soundEngine.playWrong();
        onStepMistake?.(
          round.teacherHint || `Hozir ${activeSense.labelEn} (${activeSense.labelUz}) ni bosing!`
        );
      }
    };

    return (
      <div className="space-y-4">
        <ListenBanner
          englishText={activeSense ? activeSense.commandEn : 'Great 5 Senses! 👀👂'}
          uzbekHint={
            activeSense
              ? `${activeSense.labelUz} (${activeSense.labelEn}) tugmasini bosing!`
              : round.praiseText
          }
          speakText={activeSense ? activeSense.speakText : 'Great job!'}
          accent="emerald"
        />
        <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-5 flex flex-col items-center gap-4">
          <div className="text-6xl leading-none">😄</div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-md">
            {[
              { id: 'eyes' as const, emoji: '👀', en: 'EYES', uz: "Ko'zlar" },
              { id: 'ears' as const, emoji: '👂', en: 'EARS', uz: 'Quloqlar' },
              { id: 'mouth' as const, emoji: '👄', en: 'MOUTH', uz: "Og'iz" },
            ].map((item) => (
              <motion.button
                key={item.id}
                type="button"
                disabled={solved}
                animate={wrongId === item.id ? { x: [-5, 5, -4, 4, 0] } : {}}
                onClick={() => handleTapSense(item.id)}
                className="min-h-[80px] rounded-2xl border-2 border-b-4 border-slate-200 hover:border-emerald-400 border-b-slate-300 bg-white px-3 py-2 flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
              >
                <span className="text-3xl leading-none">{item.emoji}</span>
                <span className="text-xs font-display font-extrabold text-slate-900">{item.en}</span>
                <span className="text-[11px] text-slate-500">{item.uz}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default: build_face
  const allPlaced = placedIds.length >= parts.length;
  const hasFeature = (id: string) =>
    placedIds.includes(id) || !parts.some((p) => p.id === id);

  const handlePickPart = (card: (typeof trayParts)[number]) => {
    if (solved || allPlaced || !activePart) return;
    speakEnglish(card.speakText);

    if (card.id === activePart.id) {
      setWrongId(null);
      const next = [...placedIds, card.id];
      setPlacedIds(next);
      soundEngine.playFruitPluck(next.length + 3);
      if (next.length >= parts.length) {
        window.setTimeout(() => speakEnglish('Haha! Funny face! Well done!'), 360);
        onSolve();
      } else {
        onStepSuccess?.(`Zo'r! ${activePart.labelEn} (${activePart.labelUz}) joylandi!`);
      }
    } else {
      setWrongId(card.id);
      soundEngine.playWrong();
      onStepMistake?.(
        `Bu ${card.labelEn} (${card.labelUz}). Hozir ${activePart.labelEn} (${activePart.labelUz} ${activePart.emoji}) ni yuzga qo'ying!`
      );
    }
  };

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={activePart ? activePart.commandEn : 'Haha! Funny Smiling Face! 😄✨'}
        uzbekHint={
          activePart
            ? `${activePart.labelUz} (${activePart.labelEn}) ni tanlab yuzga joylashtiring!`
            : round.praiseText
        }
        speakText={activePart ? activePart.speakText : 'Funny face! Great job!'}
        accent="amber"
      />

      {/* Cartoon Face Canvas */}
      <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4 flex justify-center">
        <motion.svg
          viewBox="0 0 220 180"
          className="w-full max-w-[220px] h-auto"
          animate={allPlaced ? { rotate: [-4, 4, -4, 0], scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 0.9, repeat: allPlaced ? Infinity : 0 }}
        >
          {/* Ears */}
          <circle
            cx="42"
            cy="96"
            r="14"
            fill={hasFeature('ears') ? '#FDBA74' : '#FFFFFF'}
            stroke={hasFeature('ears') ? '#EA580C' : '#94A3B8'}
            strokeWidth="2.5"
            strokeDasharray={hasFeature('ears') ? 'none' : '4 4'}
          />
          <circle
            cx="178"
            cy="96"
            r="14"
            fill={hasFeature('ears') ? '#FDBA74' : '#FFFFFF'}
            stroke={hasFeature('ears') ? '#EA580C' : '#94A3B8'}
            strokeWidth="2.5"
            strokeDasharray={hasFeature('ears') ? 'none' : '4 4'}
          />

          {/* Face Circle */}
          <circle cx="110" cy="96" r="64" fill="#FED7AA" stroke="#F59E0B" strokeWidth="3" />

          {/* Hair */}
          {hasFeature('hair') ? (
            <path
              d="M46 84 C46 28, 174 28, 174 84 C156 54, 134 48, 110 54 C86 48, 64 54, 46 84 Z"
              fill="#334155"
            />
          ) : (
            <path
              d="M52 72 C62 34, 158 34, 168 72"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeDasharray="5 5"
            />
          )}

          {/* Eyes */}
          {hasFeature('eyes') ? (
            <g>
              <circle cx="86" cy="88" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <circle cx="86" cy="88" r="4.5" fill="#0F172A" />
              {allPlaced ? (
                /* Playful Wink! */
                <path
                  d="M124 88 Q134 80 144 88"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <circle cx="134" cy="88" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                  <circle cx="134" cy="88" r="4.5" fill="#0F172A" />
                </>
              )}
            </g>
          ) : (
            <g stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" fill="#FFFFFF">
              <circle cx="86" cy="88" r="10" />
              <circle cx="134" cy="88" r="10" />
            </g>
          )}

          {/* Nose */}
          {hasFeature('nose') ? (
            <circle cx="110" cy="106" r="7" fill="#FB923C" />
          ) : (
            <circle cx="110" cy="106" r="7" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
          )}

          {/* Rosy Cheeks */}
          <circle cx="70" cy="112" r="8" fill="#FB7185" opacity="0.38" />
          <circle cx="150" cy="112" r="8" fill="#FB7185" opacity="0.38" />

          {/* Mouth */}
          {hasFeature('mouth') ? (
            <path
              d={allPlaced ? 'M84 122 Q110 148 136 122 Z' : 'M88 124 Q110 140 132 124'}
              fill={allPlaced ? '#F43F5E' : 'none'}
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ) : (
            <rect
              x="88"
              y="120"
              width="44"
              height="14"
              rx="7"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}
        </motion.svg>
      </div>

      {/* Parts Tray */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {trayParts.map((part) => {
          const used = placedIds.includes(part.id);
          const isWrong = wrongId === part.id;
          return (
            <motion.button
              key={part.id}
              type="button"
              disabled={used || solved}
              animate={isWrong ? { x: [-5, 5, -4, 4, 0] } : {}}
              onClick={() => handlePickPart(part)}
              className={`min-h-[76px] rounded-2xl border-2 border-b-4 px-3 py-2.5 flex flex-col items-center justify-center gap-1 transition-all ${
                used
                  ? 'bg-slate-100 border-slate-200 opacity-40 cursor-default'
                  : isWrong
                  ? 'bg-rose-50 border-rose-400 text-rose-900 cursor-pointer'
                  : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-400 border-b-slate-300 text-slate-900 cursor-pointer active:scale-95'
              }`}
            >
              <span className="text-3xl leading-none">{part.emoji}</span>
              <span className="text-xs font-display font-extrabold">{part.labelEn}</span>
              <span className="text-[11px] font-medium text-slate-500">{part.labelUz}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 8-DARS: "PICNIC BASKET (MAZALI PIKNIK)" (picnic_basket)
// =========================================================================
export const PicnicBasketStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.picnicData ?? {
    characterQuoteEn: '',
    characterQuoteUz: '',
    foods: [],
  };
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const likedFoods = useMemo(() => data.foods.filter((f) => f.liked), [data.foods]);

  useEffect(() => {
    const t = window.setTimeout(() => speakEnglish(round.speakText), 240);
    return () => window.clearTimeout(t);
  }, [round.speakText]);

  const handlePickFood = (food: (typeof data.foods)[number]) => {
    if (solved || pickedIds.includes(food.id)) return;
    speakEnglish(food.speakText);

    if (food.liked) {
      setWrongId(null);
      const next = [...pickedIds, food.id];
      setPickedIds(next);
      soundEngine.playFruitPluck(next.length + 3);
      if (next.length >= likedFoods.length) {
        onSolve();
      } else {
        onStepSuccess?.(`Mazzali! "I like ${food.labelEn}!" (${food.labelUz}) dasturxonga qo'yildi!`);
      }
    } else {
      setWrongId(food.id);
      soundEngine.playWrong();
      onStepMistake?.(
        `Qahramon "${food.speakText}" (${food.labelUz} menga yoqmaydi) dedi! Faqat yoqtirganlarini tanlang.`
      );
    }
  };

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={data.characterQuoteEn}
        uzbekHint={data.characterQuoteUz}
        speakText={round.speakText}
        accent="emerald"
      />

      {/* Checkered Picnic Blanket */}
      <div
        className="rounded-3xl border-2 border-rose-200 p-4 flex flex-col items-center justify-center min-h-[156px] relative overflow-hidden"
        style={{
          backgroundImage:
            'repeating-conic-gradient(#FFE4E6 0% 25%, #FFFFFF 0% 50%)',
          backgroundSize: '28px 28px',
        }}
      >
        <div className="bg-white/95 rounded-2xl border border-rose-200 px-4 py-3 shadow-sm flex flex-col items-center gap-2 min-w-[230px]">
          <div className="text-xs font-extrabold text-rose-700">
            🧺 Picnic Blanket ({pickedIds.length} / {likedFoods.length})
          </div>
          <div className="flex items-center justify-center gap-3 min-h-[54px]">
            {likedFoods.map((food) => {
              const placed = pickedIds.includes(food.id);
              return (
                <motion.div
                  key={food.id}
                  animate={placed ? { scale: [0.6, 1.15, 1] } : {}}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl ${
                    placed
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'
                  }`}
                >
                  {placed ? food.emoji : '?'}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Food Basket Choices */}
      <div className="grid grid-cols-3 gap-3">
        {data.foods.map((food) => {
          const placed = pickedIds.includes(food.id);
          const isWrong = wrongId === food.id;
          return (
            <motion.button
              key={food.id}
              type="button"
              disabled={placed || solved}
              animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              onClick={() => handlePickFood(food)}
              className={`min-h-[86px] rounded-2xl border-2 border-b-4 px-3 py-3 flex flex-col items-center justify-center gap-1 transition-all ${
                placed
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-700 opacity-65 cursor-default'
                  : isWrong
                  ? 'bg-rose-50 border-rose-400 text-rose-900 cursor-pointer'
                  : 'bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-400 border-b-slate-300 text-slate-900 cursor-pointer active:scale-95'
              }`}
            >
              <span className="text-3xl leading-none">{food.emoji}</span>
              <span className="text-sm font-display font-extrabold">{food.labelEn}</span>
              <span className="text-[11px] font-medium text-slate-500">
                {placed ? 'Dasturxonda ✓' : food.labelUz}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 9-DARS: "SUPERHERO RUNNER (SUPERQAHRAMON SARGUZASHTI)" (superhero_actions)
// =========================================================================
export const SuperheroActionsStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.superheroData ?? { obstacles: [], actionButtons: [] };
  const [stepIdx, setStepIdx] = useState(0);
  const [heroMotion, setHeroMotion] = useState<'idle' | 'jump' | 'dash'>('idle');
  const [wrongId, setWrongId] = useState<string | null>(null);

  const activeObs = data.obstacles[stepIdx];
  const allCleared = stepIdx >= data.obstacles.length;

  useEffect(() => {
    if (activeObs) {
      const t = window.setTimeout(() => speakEnglish(activeObs.speakText), 240);
      return () => window.clearTimeout(t);
    }
  }, [stepIdx, activeObs]);

  const handleAction = (btn: (typeof data.actionButtons)[number]) => {
    if (solved || allCleared || !activeObs) return;
    speakEnglish(btn.speakText);

    if (btn.id === activeObs.actionId) {
      setWrongId(null);
      setHeroMotion(btn.id === 'jump' || btn.id === 'fly' ? 'jump' : 'dash');
      soundEngine.playJump(true);

      window.setTimeout(() => {
        setHeroMotion('idle');
        const next = stepIdx + 1;
        setStepIdx(next);
        if (next >= data.obstacles.length) {
          onSolve();
        } else {
          onStepSuccess?.(`Ajoyib! ${activeObs.sentenceEn} — to'siqdan o'tdik!`);
        }
      }, 520);
    } else {
      setWrongId(btn.id);
      soundEngine.playWrong();
      onStepMistake?.(
        `Oldinda "${activeObs.obstacleLabelUz}" bor! "${activeObs.actionEn}" (${activeObs.actionUz} ${activeObs.actionEmoji}) tugmasini bosing!`
      );
    }
  };

  const progressPct =
    data.obstacles.length > 0
      ? Math.min(86, 12 + (stepIdx / data.obstacles.length) * 74)
      : 12;

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={activeObs ? activeObs.sentenceEn : 'Superhero Finish! 🏆✨'}
        uzbekHint={
          activeObs
            ? `To'siq: ${activeObs.obstacleLabelUz} ${activeObs.obstacleEmoji} — To'g'ri harakat tugmasini bosing!`
            : round.praiseText
        }
        speakText={activeObs ? activeObs.speakText : 'Great job, superhero!'}
        accent="violet"
      />

      {/* Adventure Track Stage */}
      <div className="relative rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 p-4 min-h-[168px] overflow-hidden flex flex-col justify-end">
        {/* Decorative clouds */}
        <div className="absolute top-3 left-6 text-2xl opacity-80">☁️</div>
        <div className="absolute top-5 right-10 text-2xl opacity-80">☁️</div>

        {/* Obstacles along track */}
        <div className="relative z-10 flex items-end justify-around pb-2 pt-10">
          {data.obstacles.map((obs, idx) => {
            const cleared = idx < stepIdx;
            const current = idx === stepIdx;
            return (
              <div
                key={obs.id}
                className={`flex flex-col items-center transition-opacity ${
                  cleared ? 'opacity-45' : 'opacity-100'
                }`}
              >
                <span
                  className={`text-4xl sm:text-5xl leading-none ${
                    current ? 'drop-shadow-[0_0_10px_rgba(124,58,237,0.45)]' : ''
                  }`}
                >
                  {obs.obstacleEmoji}
                </span>
                <span className="text-[11px] font-bold text-slate-800 bg-white/85 rounded-lg px-2 py-0.5 mt-1">
                  {cleared ? '✓' : obs.obstacleLabelUz}
                </span>
              </div>
            );
          })}
        </div>

        {/* Animated Superhero Character */}
        <motion.div
          animate={{
            left: `${progressPct}%`,
            y: heroMotion === 'jump' ? -44 : heroMotion === 'dash' ? -10 : 0,
            scale: heroMotion !== 'idle' ? 1.18 : 1,
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="absolute bottom-9 -translate-x-1/2 z-20 pointer-events-none select-none"
        >
          <span className="text-5xl leading-none block drop-shadow-md">🦸</span>
        </motion.div>

        {/* Ground Track Strip */}
        <div className="h-3 rounded-full bg-emerald-600/80 border-t-2 border-emerald-400" />
      </div>

      {/* Action Command Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {data.actionButtons.map((btn) => {
          const isWrong = wrongId === btn.id;
          return (
            <motion.button
              key={btn.id}
              type="button"
              disabled={solved || allCleared}
              animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              onClick={() => handleAction(btn)}
              className={`min-h-[80px] rounded-2xl border-2 border-b-4 px-3 py-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ${
                isWrong
                  ? 'bg-rose-50 border-rose-400 text-rose-900'
                  : 'bg-white hover:bg-violet-50 border-violet-300 hover:border-violet-500 border-b-violet-500 text-slate-900'
              }`}
            >
              <span className="text-3xl leading-none">{btn.emoji}</span>
              <span className="text-sm sm:text-base font-display font-extrabold">
                {btn.labelEn}
              </span>
              <span className="text-[11px] font-medium text-slate-500">{btn.labelUz}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 10-DARS: "MAGICAL SAFARI (SEHRLI HAYVONOT BOG'I)" (safari_animals)
// =========================================================================
export const SafariAnimalsStage: React.FC<EnglishGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.safariData ?? {
    targetId: 'elephant',
    targetPhraseEn: 'Look! A BIG ELEPHANT! 🐘',
    targetPhraseUz: 'Katta fil!',
    soundType: 'elephant',
    animals: [],
  };
  const [flash, setFlash] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => speakEnglish(round.speakText), 240);
    return () => window.clearTimeout(t);
  }, [round.speakText]);

  const handleSnapAnimal = (animal: (typeof data.animals)[number]) => {
    if (solved) return;
    soundEngine.playAnimalSound(animal.soundType);

    if (animal.id === data.targetId) {
      setWrongId(null);
      soundEngine.playCameraShutter();
      setFlash(true);
      window.setTimeout(() => setFlash(false), 320);
      window.setTimeout(() => speakEnglish(animal.speakText), 320);
      onSolve();
    } else {
      setWrongId(animal.id);
      speakEnglish(animal.speakText);
      onStepMistake?.(
        `Bu ${animal.adjectiveEn} ${animal.labelEn} (${animal.labelUz}). Bizga "${data.targetPhraseUz}" kerak!`
      );
    }
  };

  const targetAnimal = data.animals.find((a) => a.id === data.targetId);

  return (
    <div className="space-y-4">
      <ListenBanner
        englishText={data.targetPhraseEn}
        uzbekHint={`${data.targetPhraseUz} — Hayvonni bosib 📸 suratga oling!`}
        speakText={round.speakText}
        accent="amber"
      />

      {/* Interactive Safari Savanna Landscape */}
      <div className="relative rounded-3xl border-2 border-amber-300 overflow-hidden min-h-[225px] bg-gradient-to-b from-sky-300 via-amber-100 to-lime-200 select-none">
        {/* Savanna SVG Scenery */}
        <svg
          viewBox="0 0 400 220"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          {/* Warm Savanna Sun */}
          <circle cx="54" cy="40" r="24" fill="#FDE047" />
          {/* Rolling Hills */}
          <path d="M0 140 Q100 100 220 135 T400 125 L400 220 L0 220 Z" fill="#A3E635" />
          <path d="M0 162 Q150 136 280 165 T400 154 L400 220 L0 220 Z" fill="#84CC16" />
          {/* Blue Pond */}
          <ellipse cx="328" cy="184" rx="58" ry="18" fill="#38BDF8" opacity="0.85" />
          {/* Acacia Tree */}
          <rect x="38" y="96" width="8" height="46" fill="#78350F" />
          <ellipse cx="42" cy="92" rx="34" ry="11" fill="#15803D" />
        </svg>

        {/* Camera Viewfinder Corners */}
        <div className="pointer-events-none absolute inset-3 border-2 border-dashed border-white/75 rounded-2xl flex items-start justify-between p-2">
          <span className="text-[11px] font-bold text-slate-900 bg-white/80 rounded-lg px-2 py-0.5 inline-flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-amber-700" />
            <span>SAFARI CAM</span>
          </span>
          {solved && (
            <span className="text-[11px] font-extrabold text-emerald-900 bg-emerald-200 rounded-lg px-2 py-0.5 inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SNAPSHOT! 📸</span>
            </span>
          )}
        </div>

        {/* Clickable Animals in Savanna */}
        {data.animals.map((animal) => {
          const isTarget = animal.id === data.targetId;
          const isWrong = wrongId === animal.id;
          return (
            <motion.button
              key={animal.id}
              type="button"
              disabled={solved}
              style={{ left: `${animal.xPct}%`, top: `${animal.yPct}%` }}
              animate={
                solved && isTarget
                  ? { scale: [1, 1.25, 1.1] }
                  : isWrong
                  ? { x: [-6, 6, -4, 4, 0] }
                  : { y: [0, -4, 0] }
              }
              transition={{ duration: solved ? 0.5 : 2.1, repeat: solved ? 0 : Infinity }}
              onClick={() => handleSnapAnimal(animal)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl p-2 flex flex-col items-center cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
                solved && isTarget
                  ? 'bg-white/95 ring-4 ring-amber-400 shadow-lg z-20'
                  : 'hover:bg-white/55 z-10'
              }`}
            >
              <span className={`${animal.sizeClass} leading-none drop-shadow-sm`}>
                {animal.emoji}
              </span>
              <span className="text-[11px] font-display font-extrabold text-slate-900 bg-white/90 rounded-lg px-2 py-0.5 mt-1 shadow-xs whitespace-nowrap">
                {animal.adjectiveEn} {animal.labelEn}
              </span>
            </motion.button>
          );
        })}

        {/* Camera Flash Overlay */}
        {flash && (
          <div className="pointer-events-none absolute inset-0 bg-white/90 z-30" />
        )}
      </div>

      {/* Polaroid Captured Banner on Solve */}
      {solved && targetAnimal && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl bg-amber-50 border border-amber-300 px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-display font-extrabold text-amber-950"
        >
          <span className="text-2xl">📸</span>
          <span>
            Click! {targetAnimal.adjectiveEn} {targetAnimal.labelEn} ({targetAnimal.labelUz})!
          </span>
        </motion.div>
      )}
    </div>
  );
};

export const ENGLISH_GAME_TITLES: Record<string, string> = {
  greetings_club: 'Hello & Goodbye Club',
  rainbow_paint: 'Rainbow Painter (Sehrli Kamalak)',
  backpack_pack: 'Backpack Packer (Aqlli Sumka)',
  toy_box: 'Mystery Toy Box (Soya Detektivi)',
  family_album: 'Family Photo Album (Oila Shajarasi)',
  house_builder: 'Dream House Builder (Orzudagi Uycha)',
  face_maker: 'Funny Face Maker (Quvnoq Yuz)',
  picnic_basket: 'Picnic Basket (Mazali Piknik)',
  superhero_actions: 'Superhero Runner (Superqahramon)',
  safari_animals: 'Magical Safari (Sehrli Hayvonot Bog‘i)',
};
