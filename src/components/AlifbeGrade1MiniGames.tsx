import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Award, Check, Sparkles, Volume2 } from 'lucide-react';
import type { AlifbeInteractiveRound } from '../data/curriculum';
import { soundEngine, speakUzbek, speakUzbekLetter } from '../utils/sound';

export interface AlifbeGrade1StageProps {
  round: AlifbeInteractiveRound;
  solved: boolean;
  onSolve: (praiseText: string) => void;
  onStepSuccess?: (message?: string) => void;
  onStepMistake?: (teacherHint: string) => void;
}

// =========================================================================
// PHONETIC COLOR HELPERS: QIZIL = UNLI (A, O, I, U, E, O') | KO'K = UNDOSH
// =========================================================================
const UZ_VOWELS = new Set(['A', 'O', 'I', 'U', 'E', "O'", 'O‘', 'Oʻ']);
const UZ_DIGRAPHS = new Set(["O'", 'O‘', 'Oʻ', "G'", 'G‘', 'Gʻ', 'SH', 'CH', 'NG']);

function normToken(token: string): string {
  return token.trim().toUpperCase().replace(/[‘’`ʻ]/g, "'");
}

export function isAlifbeVowel(letter: string): boolean {
  return UZ_VOWELS.has(normToken(letter));
}

export function splitAlifbeLetters(text: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < text.length) {
    const pair = text.slice(i, i + 2);
    if (pair.length === 2 && UZ_DIGRAPHS.has(normToken(pair))) {
      result.push(pair);
      i += 2;
    } else {
      result.push(text[i]);
      i += 1;
    }
  }
  return result;
}

export const PhoneticText: React.FC<{
  text: string;
  className?: string;
  highlightUntil?: number;
}> = ({ text, className = '', highlightUntil }) => {
  const tokens = splitAlifbeLetters(text);
  return (
    <span className={className}>
      {tokens.map((ch, idx) => {
        const isLetter = /[A-Za-z'‘’ʻ]/.test(ch);
        const lit = highlightUntil === undefined || idx < highlightUntil;
        if (!isLetter) {
          return (
            <span key={idx} className={lit ? 'text-amber-700' : 'text-slate-300'}>
              {ch}
            </span>
          );
        }
        const vowel = isAlifbeVowel(ch);
        const colorCls = !lit
          ? 'text-slate-300'
          : vowel
          ? 'text-rose-600'
          : 'text-blue-600';
        const glowCls =
          highlightUntil !== undefined && idx === highlightUntil - 1
            ? 'inline-block scale-125 drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] transition-transform'
            : 'transition-colors';
        return (
          <span key={idx} className={`${colorCls} ${glowCls}`}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

// =========================================================================
// 1-DARS: "SEHRLI HARF SHARIKLARI (POP THE LETTER!)" (balloon_pop)
// =========================================================================
export const BalloonPopStage: React.FC<AlifbeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.balloonData ?? {
    targetLetter: 'A',
    singSound: 'Aaaa! Anor!',
    revealEmoji: '🍎',
    revealWord: 'ANOR',
    balloons: [],
  };
  const [poppedId, setPoppedId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const handleTapBalloon = (b: (typeof data.balloons)[number]) => {
    if (solved) return;
    if (b.letter === data.targetLetter) {
      setWrongId(null);
      setPoppedId(b.id);
      soundEngine.playBalloonPop();
      speakUzbek(data.speakUzbek ?? data.singSound, { subtitleText: data.singSound });
      onSolve(round.praiseText);
    } else {
      setWrongId(b.id);
      soundEngine.playWrong();
      speakUzbekLetter(b.letter);
      onStepMistake?.(
        round.teacherHint || `Bu "${b.letter}" shari! Bizga "${data.targetLetter}" harfli shar kerak!`
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-3xl border-2 border-sky-200 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 min-h-[245px] overflow-hidden p-4 select-none">
        {/* Clouds */}
        <div className="pointer-events-none absolute top-3 left-5 text-3xl opacity-80">☁️</div>
        <div className="pointer-events-none absolute top-6 right-8 text-3xl opacity-80">☁️</div>

        {/* Target Letter Callout */}
        <div className="relative z-10 flex justify-center">
          <button
            type="button"
            onClick={() =>
              speakUzbek(round.speakUzbek ?? round.spokenPrompt, {
                subtitleText: round.spokenPrompt,
              })
            }
            className="px-4 py-1.5 rounded-2xl bg-white/95 border border-rose-200 shadow-sm text-sm font-display font-extrabold text-slate-900 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Toping va yoring:</span>
            <span className="text-xl text-rose-600">{data.targetLetter}</span>
            <Volume2 className="w-4 h-4 text-rose-600" />
          </button>
        </div>

        {/* Floating Red Vowel Balloons */}
        {!solved ? (
          <div className="relative h-[185px] w-full mt-2">
            {data.balloons.map((b) => {
              const isWrong = wrongId === b.id;
              return (
                <motion.button
                  key={b.id}
                  type="button"
                  style={{ left: `${b.xPct}%` }}
                  animate={
                    isWrong
                      ? { x: [-8, 8, -5, 5, 0], y: [0, -10, 0] }
                      : { y: [14, -14, 14] }
                  }
                  transition={{
                    duration: isWrong ? 0.35 : 2.8,
                    delay: isWrong ? 0 : b.delay,
                    repeat: isWrong ? 0 : Infinity,
                    ease: 'easeInOut',
                  }}
                  onClick={() => handleTapBalloon(b)}
                  className="absolute top-6 -translate-x-1/2 flex flex-col items-center cursor-pointer group active:scale-90"
                >
                  <svg width="78" height="106" viewBox="0 0 78 106" className="drop-shadow-md">
                    {/* String */}
                    <path
                      d="M39 76 Q33 88 41 103"
                      fill="none"
                      stroke="#64748B"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Knot */}
                    <polygon points="35,76 43,76 39,70" fill={b.colorHex} />
                    {/* Balloon Body */}
                    <ellipse cx="39" cy="38" rx="31" ry="35" fill={b.colorHex} />
                    {/* Gloss */}
                    <ellipse cx="27" cy="24" rx="7" ry="12" fill="#FFFFFF" opacity="0.32" transform="rotate(-18 27 24)" />
                    {/* Vowel Letter */}
                    <text
                      x="39"
                      y="50"
                      textAnchor="middle"
                      fontSize="34"
                      fontWeight="900"
                      fill="#FFFFFF"
                    >
                      {b.letter}
                    </text>
                  </svg>
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* PAQ! Popped Surprise Reveal */
          <motion.div
            key={poppedId || 'pop'}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="relative z-10 flex flex-col items-center justify-center py-6 gap-2"
          >
            <div className="px-3.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-display font-black text-sm shadow-sm">
              💥 PAQ! {data.singSound}
            </div>
            <div className="text-7xl leading-none drop-shadow-sm">{data.revealEmoji}</div>
            <div className="text-3xl font-display font-black tracking-wide bg-white/95 px-5 py-1.5 rounded-2xl border border-rose-200 shadow-sm">
              <PhoneticText text={data.revealWord} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 2-DARS: "SEHRLI MEVALAR SAVATI" (basket_sort)
// =========================================================================
export const BasketSortStage: React.FC<AlifbeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.basketData ?? { baskets: [], items: [] };
  const [sortedIds, setSortedIds] = useState<string[]>([]);
  const [wrongBasket, setWrongBasket] = useState<string | null>(null);
  const [dragOverLetter, setDragOverLetter] = useState<string | null>(null);

  const activeItem = data.items[sortedIds.length];
  const allSorted = sortedIds.length >= data.items.length;

  useEffect(() => {
    if (activeItem) {
      const t = window.setTimeout(
        () =>
          speakUzbek(activeItem.speakUzbek ?? activeItem.word, {
            subtitleText: activeItem.word,
          }),
        250
      );
      return () => window.clearTimeout(t);
    }
  }, [sortedIds.length, activeItem]);

  const tryDropInBasket = (basketLetter: string) => {
    if (solved || allSorted || !activeItem) return;
    if (basketLetter === activeItem.targetLetter) {
      setWrongBasket(null);
      const next = [...sortedIds, activeItem.id];
      setSortedIds(next);
      soundEngine.playFruitPluck(next.length + 3);
      speakUzbekLetter(basketLetter, activeItem.speakUzbek ?? activeItem.word);
      if (next.length >= data.items.length) {
        onSolve(round.praiseText);
      } else {
        onStepSuccess?.(`Barakalla! ${activeItem.word} ➔ [${basketLetter}] savatiga tushdi!`);
      }
    } else {
      setWrongBasket(basketLetter);
      soundEngine.playWrong();
      speakUzbek("Qayta urinib ko'r!");
      onStepMistake?.(
        `"${activeItem.word}" so'zi "${activeItem.targetLetter}" unli harfidan boshlanadi!`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Falling / Active Picture Card */}
      <div className="rounded-3xl border-2 border-rose-200 bg-gradient-to-b from-amber-50 to-white p-4 flex flex-col items-center justify-center min-h-[140px]">
        {activeItem ? (
          <motion.div
            key={activeItem.id}
            draggable
            onDragStart={(e) => {
              (e as unknown as React.DragEvent).dataTransfer?.setData('text/plain', activeItem.id);
            }}
            initial={{ y: -26, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            onClick={() =>
              speakUzbek(activeItem.speakUzbek ?? activeItem.word, {
                subtitleText: activeItem.word,
              })
            }
            className="flex flex-col items-center gap-1.5 cursor-grab active:cursor-grabbing select-none"
          >
            <span className="text-6xl sm:text-7xl leading-none drop-shadow-sm">
              {activeItem.emoji}
            </span>
            <div className="text-xl font-display font-black tracking-wide">
              <PhoneticText text={activeItem.word} />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Rasmni bosh harfi savatiga bosing yoki sudrab soling ({sortedIds.length + 1}/
              {data.items.length})
            </span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-emerald-700">
            <span className="text-5xl">🧺✨</span>
            <span className="font-display font-extrabold text-base">
              Barcha savatchalar to‘ldi!
            </span>
          </div>
        )}
      </div>

      {/* 3 Red Vowel Baskets */}
      <div className="grid grid-cols-3 gap-3">
        {data.baskets.map((basket) => {
          const itemsInBasket = data.items.filter(
            (i) => i.targetLetter === basket.letter && sortedIds.includes(i.id)
          );
          const isWrong = wrongBasket === basket.letter;
          const isOver = dragOverLetter === basket.letter;

          return (
            <motion.button
              key={basket.letter}
              type="button"
              disabled={solved || allSorted}
              animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverLetter(basket.letter);
              }}
              onDragLeave={() => setDragOverLetter(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverLetter(null);
                tryDropInBasket(basket.letter);
              }}
              onClick={() => tryDropInBasket(basket.letter)}
              className={`min-h-[118px] rounded-2xl border-2 border-b-4 p-3 flex flex-col items-center justify-between gap-2 cursor-pointer transition-all active:scale-95 ${
                isOver
                  ? 'bg-rose-100 border-rose-500 scale-105'
                  : isWrong
                  ? 'bg-red-50 border-red-400'
                  : 'bg-white hover:bg-rose-50 border-amber-300 border-b-amber-500'
              }`}
            >
              {/* Red Vowel Badge */}
              <span className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-display font-black text-2xl flex items-center justify-center shadow-sm">
                {basket.letter}
              </span>

              {/* Woven Basket Visual + Collected Emojis */}
              <div className="w-full rounded-xl bg-amber-100 border border-amber-300 py-1.5 px-2 min-h-[34px] flex items-center justify-center gap-1">
                {itemsInBasket.length > 0 ? (
                  itemsInBasket.map((it) => (
                    <span key={it.id} className="text-xl leading-none">
                      {it.emoji}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] font-bold text-amber-800">Savat</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 3-DARS: "SEHRLI BO'G'IN CHARXPALAGI" (syllable_wheel)
// =========================================================================
export const SyllableWheelStage: React.FC<AlifbeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.wheelData ?? {
    leftChoices: ['N', 'M', 'L'],
    rightChoices: ['O', 'A', 'I'],
    targetLeft: 'N',
    targetRight: 'O',
    syllableResult: 'NO',
    finalWord: 'NON',
    finalEmoji: '🥖',
    finalCaption: "Non dasturxonga qo'yildi!",
  };

  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(0);
  const [phase, setPhase] = useState<'wheel' | 'suffix' | 'done'>('wheel');
  const [wrongSuffix, setWrongSuffix] = useState<string | null>(null);

  const selectedLeft = data.leftChoices[leftIdx] ?? data.targetLeft;
  const selectedRight = data.rightChoices[rightIdx] ?? data.targetRight;

  const spinLeft = () => {
    if (phase !== 'wheel' || solved) return;
    const next = (leftIdx + 1) % data.leftChoices.length;
    setLeftIdx(next);
    soundEngine.playEquip();
    speakUzbekLetter(data.leftChoices[next]);
  };

  const spinRight = () => {
    if (phase !== 'wheel' || solved) return;
    const next = (rightIdx + 1) % data.rightChoices.length;
    setRightIdx(next);
    soundEngine.playEquip();
    speakUzbekLetter(data.rightChoices[next]);
  };

  const handleMergeWheels = () => {
    if (phase !== 'wheel' || solved) return;
    if (selectedLeft === data.targetLeft && selectedRight === data.targetRight) {
      soundEngine.playMagicMerge();
      speakUzbek(data.syllableResult.toLowerCase(), { subtitleText: data.syllableResult });
      if (data.extraLetterChoices && data.targetExtra) {
        setPhase('suffix');
        onStepSuccess?.(
          `Zo'r! [${data.syllableResult}] bo'g'ini chiqdi! Endi "${data.finalWord}" so'zini tugating!`
        );
      } else {
        setPhase('done');
        onSolve(round.praiseText);
      }
    } else {
      soundEngine.playWrong();
      speakUzbek('Qayta aylantir!');
      onStepMistake?.(
        `Charxpalakni aylantiring: chapda ko'k [${data.targetLeft}], o'ngda qizil [${data.targetRight}] bo'lsin!`
      );
    }
  };

  const handlePickSuffix = (piece: string) => {
    if (phase !== 'suffix' || solved) return;
    if (piece === data.targetExtra) {
      setWrongSuffix(null);
      setPhase('done');
      soundEngine.playMagicMerge();
      speakUzbek(data.speakUzbek ?? data.finalWord, { subtitleText: data.finalWord });
      onSolve(round.praiseText);
    } else {
      setWrongSuffix(piece);
      soundEngine.playWrong();
      speakUzbekLetter(piece);
      onStepMistake?.(
        `"${data.finalWord}" so'zini yasash uchun [${data.targetExtra}] harfini qo'shing!`
      );
    }
  };

  // Detect whether targetExtra prepends (e.g. O + NA = ONA) or appends (NO + N = NON)
  const isPrefixExtra =
    Boolean(data.targetExtra) &&
    data.finalWord.startsWith(data.targetExtra!) &&
    data.finalWord.endsWith(data.syllableResult);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50 via-white to-amber-50/70 p-4 sm:p-5">
        {phase === 'wheel' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-xs font-extrabold text-indigo-800">
              🎡 Charxpalaklarni bosib aylantiring va birlashtiring: [{data.targetLeft}] + [{data.targetRight}]
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {/* Left Blue Consonant Wheel */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold text-blue-700">Undosh (Ko‘k)</span>
                <motion.button
                  type="button"
                  key={`L-${selectedLeft}`}
                  initial={{ rotate: -25, scale: 0.92 }}
                  animate={{ rotate: 0, scale: 1 }}
                  onClick={spinLeft}
                  className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 border-4 border-blue-200 shadow-lg text-white font-display font-black text-4xl flex items-center justify-center cursor-pointer active:scale-95"
                >
                  {selectedLeft}
                </motion.button>
                <span className="text-[11px] text-slate-500">Bosib aylantir</span>
              </div>

              <span className="text-2xl font-black text-indigo-400">+</span>

              {/* Right Red Vowel Wheel */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold text-rose-700">Unli (Qizil)</span>
                <motion.button
                  type="button"
                  key={`R-${selectedRight}`}
                  initial={{ rotate: 25, scale: 0.92 }}
                  animate={{ rotate: 0, scale: 1 }}
                  onClick={spinRight}
                  className="w-24 h-24 rounded-full bg-rose-600 hover:bg-rose-700 border-4 border-rose-200 shadow-lg text-white font-display font-black text-4xl flex items-center justify-center cursor-pointer active:scale-95"
                >
                  {selectedRight}
                </motion.button>
                <span className="text-[11px] text-slate-500">Bosib aylantir</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMergeWheels}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 border-b-4 border-indigo-800 text-white font-display font-extrabold text-base flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>
                Birlashtirish ➔ {selectedLeft}
                {selectedRight}
              </span>
            </button>
          </div>
        )}

        {phase === 'suffix' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-xs font-extrabold text-emerald-800">
              ✨ Ajoyib! Endi [{data.finalWord}] so&apos;zini tugating ({data.finalEmoji}):
            </div>

            <div className="flex items-center justify-center gap-3 text-4xl font-display font-black">
              {isPrefixExtra ? (
                <>
                  <span className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-500 bg-amber-50 flex items-center justify-center text-amber-500">
                    ?
                  </span>
                  <span className="text-slate-400">+</span>
                  <span className="px-5 h-16 rounded-2xl bg-white border-2 border-emerald-400 flex items-center justify-center shadow-sm">
                    <PhoneticText text={data.syllableResult} />
                  </span>
                </>
              ) : (
                <>
                  <span className="px-5 h-16 rounded-2xl bg-white border-2 border-emerald-400 flex items-center justify-center shadow-sm">
                    <PhoneticText text={data.syllableResult} />
                  </span>
                  <span className="text-slate-400">+</span>
                  <span className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-500 bg-amber-50 flex items-center justify-center text-amber-500">
                    ?
                  </span>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              {(data.extraLetterChoices ?? []).map((piece) => {
                const isWrong = wrongSuffix === piece;
                return (
                  <motion.button
                    key={piece}
                    type="button"
                    animate={isWrong ? { x: [-5, 5, -4, 4, 0] } : {}}
                    onClick={() => handlePickSuffix(piece)}
                    className="h-16 rounded-2xl border-2 border-b-4 border-slate-200 hover:border-indigo-400 border-b-slate-300 bg-white font-display font-black text-2xl cursor-pointer active:scale-95"
                  >
                    <PhoneticText text={piece} />
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-4 gap-2"
          >
            <div className="text-7xl leading-none drop-shadow-sm">{data.finalEmoji}</div>
            <div className="text-4xl font-display font-black bg-white px-6 py-2 rounded-2xl border-2 border-emerald-300 shadow-sm">
              <PhoneticText text={data.finalWord} />
            </div>
            <div className="text-sm font-bold text-emerald-800">{data.finalCaption}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 4-DARS: "SO'Z TERUVCHI POYEZD" (train_builder)
// =========================================================================
export const TrainBuilderStage: React.FC<AlifbeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.trainData ?? {
    emoji: '👦',
    word: 'BOLA',
    targetSyllables: ['BO', 'LA'],
    deskSyllables: ['BO', 'TO', 'LA', 'SA'],
  };
  const [filledIndices, setFilledIndices] = useState<number[]>([]);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);

  const allFilled = filledIndices.length >= data.targetSyllables.length;

  const handleSyllableTap = (deskIdx: number, syllable: string) => {
    if (solved || allFilled || filledIndices.includes(deskIdx)) return;
    const expected = data.targetSyllables[filledIndices.length];
    speakUzbek(syllable.toLowerCase(), { subtitleText: syllable });

    if (syllable === expected) {
      setWrongIdx(null);
      const next = [...filledIndices, deskIdx];
      setFilledIndices(next);
      if (next.length >= data.targetSyllables.length) {
        soundEngine.playTrainWhistle();
        window.setTimeout(
          () => speakUzbek(data.speakUzbek ?? data.word, { subtitleText: data.word }),
          380
        );
        onSolve(round.praiseText);
      } else {
        soundEngine.playFruitPluck(next.length + 3);
        onStepSuccess?.(`Zo'r! [${syllable}] vagon to'ldi — endi keyingi bo'g'inni joylang!`);
      }
    } else {
      setWrongIdx(deskIdx);
      soundEngine.playWrong();
      onStepMistake?.(
        `Hozirgi vagonga [${expected}] bo'g'ini kerak! ("${data.word}")`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Picture Prompt Banner */}
      <button
        type="button"
        onClick={() => speakUzbek(data.speakUzbek ?? data.word, { subtitleText: data.word })}
        className="w-full rounded-2xl bg-sky-50 border border-sky-200 px-4 py-3 flex items-center justify-center gap-3 cursor-pointer"
      >
        <span className="text-5xl leading-none">{data.emoji}</span>
        <div className="text-left">
          <div className="text-xl font-display font-black tracking-wide">
            {allFilled ? <PhoneticText text={data.word} /> : <span className="text-slate-800">{data.word}</span>}
          </div>
          <div className="text-xs font-semibold text-sky-700 inline-flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Bo&apos;g&apos;inlarni vagonlarga joylang!</span>
          </div>
        </div>
      </button>

      {/* Animated Steam Train + Carriages on Track */}
      <div className="relative rounded-3xl border border-slate-200 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 p-4 pt-6 overflow-hidden">
        <motion.div
          animate={allFilled ? { x: [0, 14, 0, 26] } : { x: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="flex items-end justify-center gap-2 sm:gap-3"
        >
          {/* Carriages */}
          {data.targetSyllables.map((_, slotIdx) => {
            const tileIdx = filledIndices[slotIdx];
            const placedText = tileIdx !== undefined ? data.deskSyllables[tileIdx] : null;
            const isNext = slotIdx === filledIndices.length;

            return (
              <div key={slotIdx} className="flex flex-col items-center">
                <div
                  className={`w-24 sm:w-28 h-20 rounded-2xl border-4 flex items-center justify-center font-display font-black text-3xl shadow-sm transition-all ${
                    placedText
                      ? 'bg-white border-emerald-500'
                      : isNext
                      ? 'bg-amber-50 border-dashed border-amber-500 text-amber-400'
                      : 'bg-white/80 border-dashed border-slate-300 text-slate-300'
                  }`}
                >
                  {placedText ? <PhoneticText text={placedText} /> : '?'}
                </div>
                {/* Wheels */}
                <div className="flex items-center justify-around w-20 -mt-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border-2 border-amber-400 block" />
                  <span className="w-6 h-6 rounded-full bg-slate-800 border-2 border-amber-400 block" />
                </div>
              </div>
            );
          })}

          {/* Locomotive Engine */}
          <div className="relative flex flex-col items-center">
            {allFilled && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: [0.9, 0], y: -26 }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="absolute -top-6 right-2 text-2xl"
              >
                💨
              </motion.span>
            )}
            <svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true">
              {/* Chimney */}
              <rect x="58" y="10" width="14" height="22" rx="3" fill="#1E293B" />
              {/* Cabin */}
              <rect x="8" y="18" width="32" height="46" rx="6" fill="#2563EB" />
              <rect x="14" y="26" width="20" height="16" rx="4" fill="#BAE6FD" />
              {/* Boiler */}
              <rect x="38" y="30" width="40" height="34" rx="8" fill="#EF4444" />
              {/* Bumper */}
              <polygon points="78,48 86,64 78,64" fill="#F59E0B" />
              {/* Wheels */}
              <circle cx="24" cy="68" r="10" fill="#1E293B" stroke="#FACC15" strokeWidth="3" />
              <circle cx="58" cy="68" r="10" fill="#1E293B" stroke="#FACC15" strokeWidth="3" />
            </svg>
          </div>
        </motion.div>

        {/* Railway Track */}
        <div className="mt-1 h-2.5 rounded-full bg-slate-700 border-t-2 border-slate-400" />
      </div>

      {/* Desk Syllable Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.deskSyllables.map((syl, idx) => {
          const used = filledIndices.includes(idx);
          const isWrong = wrongIdx === idx;
          return (
            <motion.button
              key={`${syl}-${idx}`}
              type="button"
              disabled={used || solved}
              animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              onClick={() => handleSyllableTap(idx, syl)}
              className={`min-h-[68px] rounded-2xl border-2 border-b-4 font-display font-black text-2xl sm:text-3xl transition-all ${
                used
                  ? 'bg-slate-100 border-slate-200 opacity-35 cursor-default'
                  : isWrong
                  ? 'bg-rose-50 border-rose-400 cursor-pointer'
                  : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-400 border-b-slate-300 cursor-pointer active:scale-95'
              }`}
            >
              <PhoneticText text={syl} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 5-DARS: "TUSHIB QOLGAN HARF MOZAIKASI" (missing_letter)
// =========================================================================
export const MissingLetterStage: React.FC<AlifbeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.missingData ?? {
    emoji: '📖',
    word: 'KITOB',
    letters: ['_', 'I', 'T', 'O', 'B'],
    missingLetter: 'K',
    options: ['K', 'Q', 'R', 'D'],
  };
  const [wrongOpt, setWrongOpt] = useState<string | null>(null);

  const handlePickLetter = (opt: string) => {
    if (solved) return;
    if (opt === data.missingLetter) {
      setWrongOpt(null);
      soundEngine.playMagicMerge();
      speakUzbekLetter(opt, data.speakUzbek ?? data.word);
      onSolve(round.praiseText);
    } else {
      setWrongOpt(opt);
      soundEngine.playWrong();
      speakUzbekLetter(opt);
      onStepMistake?.(
        round.teacherHint || `"${data.word}" so'zi "${data.missingLetter}" harfidan boshlanadi!`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Picture & Word Mosaic Tiles */}
      <div
        className={`rounded-3xl border-2 p-5 flex flex-col items-center justify-center gap-4 transition-all ${
          solved
            ? 'bg-gradient-to-b from-amber-50 via-emerald-50 to-white border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.22)]'
            : 'bg-gradient-to-b from-blue-50/70 to-white border-blue-200'
        }`}
      >
        <button
          type="button"
          onClick={() => speakUzbek(data.speakUzbek ?? data.word, { subtitleText: data.word })}
          className="text-7xl leading-none cursor-pointer hover:scale-105 transition-transform"
          title="So'zni eshitish"
        >
          {data.emoji}
        </button>

        {/* Mosaic Tiles */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {data.letters.map((ch, idx) => {
            const isBlank = ch === '_';
            const displayChar = isBlank ? (solved ? data.missingLetter : '?') : ch;
            const vowel = displayChar !== '?' && isAlifbeVowel(displayChar);

            return (
              <motion.div
                key={idx}
                animate={solved && isBlank ? { scale: [0.8, 1.18, 1] } : {}}
                className={`min-w-[50px] sm:min-w-[60px] h-14 sm:h-16 px-2.5 rounded-2xl border-2 flex items-center justify-center font-display font-black text-3xl sm:text-4xl ${
                  isBlank && !solved
                    ? 'bg-amber-50 border-dashed border-amber-500 text-amber-500'
                    : solved
                    ? 'bg-white border-emerald-400 shadow-sm'
                    : 'bg-white border-slate-200'
                }`}
              >
                {displayChar === '?' ? (
                  '?'
                ) : (
                  <span className={vowel ? 'text-rose-600' : 'text-blue-600'}>
                    {displayChar}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4 Consonant Letter Options */}
      <div className="grid grid-cols-4 gap-3">
        {data.options.map((opt) => {
          const vowel = isAlifbeVowel(opt);
          const isWrong = wrongOpt === opt;
          const isWin = solved && opt === data.missingLetter;
          return (
            <motion.button
              key={opt}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              onClick={() => handlePickLetter(opt)}
              className={`min-h-[72px] rounded-2xl border-b-4 font-display font-black text-3xl sm:text-4xl transition-all cursor-pointer active:scale-95 ${
                isWin
                  ? 'bg-emerald-600 border-emerald-800 text-white scale-105'
                  : isWrong
                  ? 'bg-rose-700 border-rose-900 text-white'
                  : vowel
                  ? 'bg-rose-600 hover:bg-rose-700 border-rose-800 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 border-blue-800 text-white'
              }`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 6-DARS: "SEHRLI GULZOR (HARFLARDAN SO'ZLAR)" (flower_garden)
// =========================================================================
export const FlowerGardenStage: React.FC<AlifbeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.flowerData ?? {
    emoji: '🌸',
    word: 'GUL',
    letters: ['G', 'U', 'L'],
    petalColor: '#F472B6',
  };
  const [pickedCount, setPickedCount] = useState(0);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);

  const allPicked = pickedCount >= data.letters.length;

  const handlePetalTap = (idx: number, letter: string) => {
    if (solved || allPicked || idx < pickedCount) return;
    speakUzbekLetter(letter);

    if (idx === pickedCount) {
      setWrongIdx(null);
      const next = pickedCount + 1;
      setPickedCount(next);
      soundEngine.playFruitPluck(next + 2);

      if (next >= data.letters.length) {
        window.setTimeout(
          () => speakUzbek(data.speakUzbek ?? data.word, { subtitleText: data.word }),
          360
        );
        onSolve(round.praiseText);
      } else {
        onStepSuccess?.(`Barakalla! "${letter}" bargi ochildi — endi "${data.letters[next]}" ni bosing!`);
      }
    } else {
      setWrongIdx(idx);
      soundEngine.playWrong();
      onStepMistake?.(
        `Tartib bilan bosing! Navbatdagi harf: "${data.letters[pickedCount]}" (${pickedCount + 1}-barg)!`
      );
    }
  };

  const count = data.letters.length;

  return (
    <div className="space-y-4">
      {/* Assembled Word Bar */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center justify-center gap-2 flex-wrap">
        <span className="text-3xl leading-none mr-1">{data.emoji}</span>
        {data.letters.map((ch, idx) => {
          const revealed = idx < pickedCount;
          const vowel = isAlifbeVowel(ch);
          return (
            <span
              key={idx}
              className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center font-display font-black text-2xl transition-all ${
                revealed
                  ? 'bg-white border-emerald-400 shadow-xs'
                  : idx === pickedCount
                  ? 'bg-amber-50 border-dashed border-amber-500 text-amber-400'
                  : 'bg-white/70 border-dashed border-slate-300 text-slate-300'
              }`}
            >
              {revealed ? (
                <span className={vowel ? 'text-rose-600' : 'text-blue-600'}>{ch}</span>
              ) : (
                idx + 1
              )}
            </span>
          );
        })}
      </div>

      {/* Blooming Flower Garden Stage */}
      <div className="relative rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-sky-100 via-emerald-50 to-lime-100 p-4 min-h-[250px] flex items-center justify-center overflow-hidden">
        {/* Fluttering Butterflies on Bloom */}
        {allPicked && (
          <>
            <motion.span
              initial={{ x: -70, y: 10, opacity: 0 }}
              animate={{ x: [-70, -10, -30], y: [10, -24, -12], opacity: 1 }}
              transition={{ duration: 1.4, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute top-6 left-10 text-3xl pointer-events-none"
            >
              🦋
            </motion.span>
            <motion.span
              initial={{ x: 70, y: 0, opacity: 0 }}
              animate={{ x: [70, 12, 34], y: [0, -20, -8], opacity: 1 }}
              transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute top-8 right-10 text-3xl pointer-events-none"
            >
              🦋
            </motion.span>
          </>
        )}

        {/* Green Stem */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-24 bg-emerald-600 rounded-t-full" />

        {/* Flower Radial Layout */}
        <div className="relative w-[228px] h-[228px] flex items-center justify-center">
          {/* Flower Center */}
          <motion.div
            animate={allPicked ? { scale: [1, 1.18, 1] } : {}}
            transition={{ duration: 0.8, repeat: allPicked ? Infinity : 0 }}
            className="relative z-10 w-20 h-20 rounded-full bg-amber-300 border-4 border-amber-500 shadow-md flex flex-col items-center justify-center"
          >
            <span className="text-3xl leading-none">{data.emoji}</span>
            <span className="text-[10px] font-extrabold text-amber-950 mt-0.5">
              {allPicked ? data.word : `${pickedCount}/${count}`}
            </span>
          </motion.div>

          {/* Interactive Letter Petals */}
          {data.letters.map((letter, idx) => {
            const angleRad = (-90 + (360 / count) * idx) * (Math.PI / 180);
            const radius = 80;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            const isPicked = idx < pickedCount;
            const isNext = idx === pickedCount;
            const isWrong = wrongIdx === idx;
            const vowel = isAlifbeVowel(letter);

            return (
              <motion.button
                key={`${letter}-${idx}`}
                type="button"
                disabled={isPicked || solved}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
                animate={
                  isWrong
                    ? { x: [-6, 6, -4, 4, 0] }
                    : isPicked
                    ? { scale: 1.08 }
                    : isNext
                    ? { scale: [1, 1.07, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: isNext ? 1.1 : 0.3, repeat: isNext ? Infinity : 0 }}
                onClick={() => handlePetalTap(idx, letter)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-3 font-display font-black text-2xl flex flex-col items-center justify-center shadow-md cursor-pointer transition-colors ${
                  isPicked
                    ? 'bg-emerald-500 border-emerald-700 text-white'
                    : vowel
                    ? 'bg-rose-50 hover:bg-rose-100 border-rose-500 text-rose-600'
                    : 'bg-blue-50 hover:bg-blue-100 border-blue-500 text-blue-600'
                }`}
              >
                <span className="leading-none">{letter}</span>
                <span
                  className={`text-[10px] font-bold leading-none mt-0.5 ${
                    isPicked ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  {isPicked ? '✓' : idx + 1}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 7-DARS: "EGIZAK HARFLAR SEHRGARI" (twin_letters)
// =========================================================================
export const TwinLettersStage: React.FC<AlifbeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
}) => {
  const data = round.twinData ?? {
    leftLetter: 'S',
    rightLetter: 'H',
    mergedLetter: 'SH',
    phoneticSound: 'Shshsh! Shahar!',
    word: 'SHAHAR',
    emoji: '🏙️',
  };
  const [merging, setMerging] = useState(false);

  const handleMagicMerge = () => {
    if (solved || merging) return;
    setMerging(true);
    soundEngine.playMagicMerge();
    speakUzbek(data.speakUzbek ?? data.phoneticSound, { subtitleText: data.phoneticSound });
    window.setTimeout(() => {
      onSolve(round.praiseText);
    }, 520);
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-3xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-950 via-indigo-900 to-blue-900 p-6 min-h-[225px] flex flex-col items-center justify-center overflow-hidden text-white">
        {/* Starry sparkles */}
        <div className="pointer-events-none absolute top-4 left-6 text-xl opacity-70">✨</div>
        <div className="pointer-events-none absolute top-5 right-8 text-xl opacity-70">⭐</div>
        <div className="pointer-events-none absolute bottom-5 left-10 text-xl opacity-60">✨</div>

        {!solved ? (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="text-xs font-bold text-indigo-200">
              ✨ Ikki ko&apos;k harfni birlashtirib egizak tovush hosil qiling!
            </div>

            <div className="flex items-center justify-center gap-6 sm:gap-10">
              <motion.button
                type="button"
                animate={merging ? { x: 46, scale: 1.15 } : { y: [0, -6, 0] }}
                transition={{ duration: merging ? 0.45 : 2, repeat: merging ? 0 : Infinity }}
                onClick={() => speakUzbekLetter(data.leftLetter)}
                className="w-24 h-24 rounded-3xl bg-blue-500 border-4 border-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.55)] font-display font-black text-5xl text-white flex items-center justify-center cursor-pointer"
              >
                {data.leftLetter}
              </motion.button>

              <span className="text-3xl font-black text-amber-300">+</span>

              <motion.button
                type="button"
                animate={merging ? { x: -46, scale: 1.15 } : { y: [0, 6, 0] }}
                transition={{ duration: merging ? 0.45 : 2, repeat: merging ? 0 : Infinity }}
                onClick={() => speakUzbekLetter(data.rightLetter)}
                className="w-24 h-24 rounded-3xl bg-blue-500 border-4 border-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.55)] font-display font-black text-5xl text-white flex items-center justify-center cursor-pointer"
              >
                {data.rightLetter}
              </motion.button>
            </div>

            <button
              type="button"
              disabled={merging}
              onClick={handleMagicMerge}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 border-b-4 border-amber-600 text-slate-950 font-display font-black text-base inline-flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>
                Birlashtirish: [{data.leftLetter}] + [{data.rightLetter}] ➔ [{data.mergedLetter}]
              </span>
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="flex flex-col items-center gap-2.5 text-center"
          >
            <div className="px-5 py-2 rounded-2xl bg-blue-500 border-4 border-amber-300 shadow-[0_0_32px_rgba(251,191,36,0.75)] font-display font-black text-4xl text-white">
              {data.mergedLetter}
            </div>
            <div className="text-6xl leading-none">{data.emoji}</div>
            <div className="text-3xl font-display font-black bg-white px-5 py-1.5 rounded-2xl shadow-sm">
              <PhoneticText text={data.word} />
            </div>
            <div className="text-xs font-bold text-amber-200">{data.phoneticSound}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 8-DARS: "OLTIN KITOBXON (MUSTAQIL O'QISH)" (golden_reader)
// =========================================================================
export const GoldenReaderStage: React.FC<AlifbeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.readerData ?? {
    sentence: 'ONA VATAN',
    emoji: '🇺🇿',
    subtitle: "Jonajon O'zbekistonimiz!",
    pictureChoices: [],
  };
  const tokens = splitAlifbeLetters(data.sentence);
  const [litCount, setLitCount] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [hasReadOnce, setHasReadOnce] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const startKaraokeRead = () => {
    if (isReading) return;
    setIsReading(true);
    setLitCount(0);
    speakUzbek(data.speakUzbek ?? data.sentence, { subtitleText: data.sentence, rate: 0.88 });

    let i = 0;
    const interval = window.setInterval(() => {
      i += 1;
      setLitCount(i);
      soundEngine.playFruitPluck((i % 8) + 1);
      if (i >= tokens.length) {
        window.clearInterval(interval);
        setIsReading(false);
        setHasReadOnce(true);
        onStepSuccess?.("Ajoyib o'qidingiz! Endi ushbu gapga mos rasmni tanlang!");
      }
    }, 150);
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      setLitCount(tokens.length);
    }, 120);
    return () => window.clearTimeout(t);
  }, [tokens.length]);

  const handlePickPicture = (choice: (typeof data.pictureChoices)[number]) => {
    if (solved) return;
    if (choice.isCorrect) {
      setWrongId(null);
      setLitCount(tokens.length);
      if (data.isFinalMedalRound) {
        soundEngine.playAwardUnlocked();
      } else {
        soundEngine.playMagicMerge();
      }
      speakUzbek(round.praiseSpeakUzbek ?? round.praiseText, { subtitleText: round.praiseText });
      onSolve(round.praiseText);
    } else {
      setWrongId(choice.id);
      soundEngine.playWrong();
      onStepMistake?.(
        round.teacherHint || `Oltin kitobdagi "${data.sentence}" gapiga mos rasmni tanlang!`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Open Golden Alifbe Book */}
      <div className="relative rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-amber-50 via-yellow-50/70 to-white p-5 shadow-md overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-extrabold text-amber-900">
            📖 Oltin Alifbe Kitobi
          </span>
          <button
            type="button"
            disabled={isReading}
            onClick={startKaraokeRead}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 border-b-2 border-amber-600 text-slate-950 font-display font-extrabold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isReading ? "O'qilmoqda..." : "Karaoke O'qish"}</span>
          </button>
        </div>

        {/* Karaoke Highlighted Sentence */}
        <div
          onClick={startKaraokeRead}
          className="rounded-2xl bg-white border-2 border-amber-200 py-5 px-4 text-center cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="text-2xl sm:text-4xl font-display font-black tracking-wide leading-snug">
            <PhoneticText text={data.sentence} highlightUntil={litCount} />
          </div>
          <div className="text-xs font-semibold text-amber-800 mt-2">
            {hasReadOnce || solved ? data.subtitle : "Matnni bosing — harfma-harf nurlanib o'qiladi!"}
          </div>
        </div>

        {/* Golden "Alifbe Bilimdoni" Medal Celebration on Final Round */}
        {solved && data.isFinalMedalRound && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            className="mt-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-2 border-amber-600 p-4 flex items-center justify-center gap-3 text-slate-950 shadow-lg"
          >
            <Award className="w-10 h-10 text-amber-900 shrink-0" />
            <div className="text-left">
              <div className="text-base sm:text-lg font-display font-black">
                🏅 OLTIN &quot;ALIFBE BILIMDONI&quot; MEDALI!
              </div>
              <div className="text-xs font-bold text-amber-950">
                Barakalla! Endi sen barcha kitoblarni mustaqil o&apos;qiy olasan!
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Picture Verification Choices */}
      <div className="grid grid-cols-3 gap-3">
        {data.pictureChoices.map((choice) => {
          const isWrong = wrongId === choice.id;
          const isWin = solved && choice.isCorrect;
          return (
            <motion.button
              key={choice.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              onClick={() => handlePickPicture(choice)}
              className={`min-h-[86px] rounded-2xl border-2 border-b-4 px-3 py-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ${
                isWin
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-900 text-white'
                  : isWrong
                  ? 'bg-rose-50 border-rose-400 text-rose-900'
                  : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-400 border-b-slate-300 text-slate-900'
              }`}
            >
              <span className="text-3xl leading-none">{choice.emoji}</span>
              <span className="text-xs sm:text-sm font-display font-extrabold">
                {choice.label}
              </span>
              {isWin && <Check className="w-4 h-4" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export const ALIFBE_GAME_TITLES: Record<string, string> = {
  balloon_pop: 'Sehrli Harf Shariklari',
  basket_sort: 'Sehrli Mevalar Savati',
  syllable_wheel: "Sehrli Bo'g'in Charxpalagi",
  train_builder: "So'z Teruvchi Poyezd",
  missing_letter: 'Tushib Qolgan Harf Mozaikasi',
  flower_garden: 'Sehrli Gulzor',
  twin_letters: 'Egizak Harflar Sehrgari',
  golden_reader: 'Oltin Kitobxon',
};
