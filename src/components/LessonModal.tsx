import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Atom,
  Award,
  CheckCircle2,
  Clock,
  Coins,
  Droplet,
  Flame,
  Globe,
  Heart,
  Leaf,
  Play,
  RotateCcw,
  Sun,
  Volume2,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  AlifbeRound,
  CsRound,
  EnglishRound,
  LessonPlan,
  MathRound,
  ScienceRound,
  SUBJECT_META,
} from '../data/curriculum';
import { getTierLabel } from '../utils/storage';
import { soundEngine, speakUzbek, stopSpeaking } from '../utils/sound';
import { ConfettiCanvas } from './ConfettiCanvas';
import { AutoFitModal } from './AutoFitModal';

interface LessonModalProps {
  lesson: LessonPlan;
  grade: number;
  initialStage?: 'explain' | 'game';
  testMode?: boolean;
  onComplete: (earnedCoins: number, correctCount: number) => void;
  onClose: () => void;
}

const POINTS_PER_CORRECT = 20;
const COMPLETION_BONUS = 30;

const BlockyTeacherAvatar: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16 shrink-0" aria-hidden="true">
    <rect x="24" y="8" width="32" height="10" rx="3" fill="#2C221E" />
    <rect x="24" y="14" width="32" height="28" rx="4" fill="#FCD2A2" />
    <rect x="30" y="24" width="6" height="6" rx="1" fill="#0F172A" />
    <rect x="44" y="24" width="6" height="6" rx="1" fill="#0F172A" />
    <rect x="28" y="22" width="10" height="10" rx="2" fill="none" stroke="#1E293B" strokeWidth="2" />
    <rect x="42" y="22" width="10" height="10" rx="2" fill="none" stroke="#1E293B" strokeWidth="2" />
    <line x1="38" y1="27" x2="42" y2="27" stroke="#1E293B" strokeWidth="2" />
    <rect x="34" y="35" width="12" height="3" rx="1.5" fill="#7C2D12" />
    <rect x="16" y="45" width="48" height="30" rx="6" fill={color} />
    <polygon points="40,45 34,55 46,55" fill="#FFFFFF" />
  </svg>
);

// =========================================================================
// 1. MATH MINI-GAME: Moving/Floating Answer Blocks against Countdown Timer
// =========================================================================
interface FloatingBlock {
  option: string;
  x: number; // percentage 10..76
  y: number; // percentage 12..72
  vx: number;
  vy: number;
  color: string;
}

const MATH_BLOCK_COLORS = ['#2563EB', '#0284C7', '#7C3AED', '#0D9488'];

const MathMiniGame: React.FC<{
  rounds: MathRound[];
  grade: number;
  onFinish: (correctCount: number) => void;
}> = ({ rounds, grade, onFinish }) => {
  const isGrade1 = grade === 1;
  const speedScale = isGrade1 ? 0.6 : 1; // 40% slower for 6-7 year olds
  const maxX = isGrade1 ? 61 : 71;
  const maxY = isGrade1 ? 64 : 68;

  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(rounds[0].timeLimitSec);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong' | 'timeout'; picked?: string } | null>(
    null
  );
  const [blocks, setBlocks] = useState<FloatingBlock[]>([]);
  const blocksRef = useRef<FloatingBlock[]>([]);
  const current = rounds[roundIdx];

  // Initialize floating block coordinates per round
  useEffect(() => {
    const startPositions = [
      { x: 6, y: 10, vx: 14 * speedScale, vy: 10 * speedScale },
      { x: isGrade1 ? 52 : 56, y: 12, vx: -13 * speedScale, vy: 12 * speedScale },
      { x: 10, y: isGrade1 ? 52 : 58, vx: 12 * speedScale, vy: -11 * speedScale },
      { x: isGrade1 ? 54 : 58, y: isGrade1 ? 50 : 56, vx: -14 * speedScale, vy: -10 * speedScale },
    ];
    const shuffled = [...current.options].sort(() => Math.random() - 0.5);
    const next = shuffled.map((opt, idx) => ({
      option: opt,
      x: startPositions[idx % 4].x,
      y: startPositions[idx % 4].y,
      vx: startPositions[idx % 4].vx,
      vy: startPositions[idx % 4].vy,
      color: MATH_BLOCK_COLORS[idx % MATH_BLOCK_COLORS.length],
    }));
    blocksRef.current = next;
    setBlocks(next);
    setTimeLeft(current.timeLimitSec);
    setFeedback(null);
  }, [roundIdx, current, isGrade1, speedScale]);

  // Smooth drifting animation loop
  useEffect(() => {
    if (feedback) return;
    let last = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const updated = blocksRef.current.map((b) => {
        let nx = b.x + b.vx * dt;
        let ny = b.y + b.vy * dt;
        let nvx = b.vx;
        let nvy = b.vy;

        if (nx < 3) {
          nx = 3;
          nvx = Math.abs(nvx);
        } else if (nx > maxX) {
          nx = maxX;
          nvx = -Math.abs(nvx);
        }
        if (ny < 5) {
          ny = 5;
          nvy = Math.abs(nvy);
        } else if (ny > maxY) {
          ny = maxY;
          nvy = -Math.abs(nvy);
        }
        return { ...b, x: nx, y: ny, vx: nvx, vy: nvy };
      });
      blocksRef.current = updated;
      setBlocks(updated);
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [feedback, roundIdx, maxX, maxY]);

  // Countdown timer
  useEffect(() => {
    if (feedback) return;
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          window.clearInterval(interval);
          soundEngine.playWrong();
          setFeedback({ status: 'timeout' });
          return 0;
        }
        return Math.max(0, +(prev - 0.1).toFixed(1));
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [feedback, roundIdx]);

  const advance = (nextCorrect: number) => {
    window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1150);
  };

  // Auto-advance on timeout
  useEffect(() => {
    if (feedback?.status === 'timeout') {
      const t = window.setTimeout(() => {
        if (roundIdx + 1 < rounds.length) {
          setRoundIdx((i) => i + 1);
        } else {
          onFinish(correctCount);
        }
      }, 1400);
      return () => window.clearTimeout(t);
    }
  }, [feedback, roundIdx, rounds.length, correctCount, onFinish]);

  const handlePick = (opt: string) => {
    if (feedback) return;
    const isCorrect = opt === current.correctAnswer;
    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) {
      soundEngine.playCorrect();
      setCorrectCount(nextCorrect);
      setFeedback({ status: 'correct', picked: opt });
    } else {
      soundEngine.playWrong();
      setFeedback({ status: 'wrong', picked: opt });
    }
    advance(nextCorrect);
  };

  const timePercent = Math.max(0, (timeLeft / current.timeLimitSec) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>
          Raund {roundIdx + 1} / {rounds.length} · Harakatlanuvchi to&apos;g&apos;ri javob blokini bosing!
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono-num text-blue-700">
          <Clock className="w-4 h-4" />
          {Math.ceil(timeLeft)} soniya
        </span>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${
            timePercent < 30 ? 'bg-rose-500' : 'bg-blue-600'
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Question Prompt */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 text-center">
        <div className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight">
          {current.prompt}
        </div>
        <div className="text-xs text-slate-300 mt-1.5">Yordam: {current.hint}</div>
      </div>

      {/* Moving Blocks Arena */}
      <div
        className={`relative rounded-2xl bg-sky-50 border border-sky-200 overflow-hidden select-none ${
          isGrade1 ? 'h-72 sm:h-80' : 'h-64 sm:h-72'
        }`}
      >
        {blocks.map((b) => {
          const isPicked = feedback?.picked === b.option;
          const isAnswer = b.option === current.correctAnswer;
          let bg = b.color;
          if (feedback) {
            if (isAnswer) bg = '#16A34A';
            else if (isPicked) bg = '#E11D48';
            else bg = '#94A3B8';
          }

          return (
            <button
              key={b.option}
              type="button"
              disabled={Boolean(feedback)}
              onClick={() => handlePick(b.option)}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                backgroundColor: bg,
              }}
              className={`absolute rounded-2xl text-white font-mono-num font-bold shadow-lg border-b-4 border-black/20 hover:brightness-110 active:scale-95 transition-transform cursor-pointer leading-snug ${
                isGrade1
                  ? 'w-[35%] min-w-[124px] py-4 px-3.5 text-base sm:text-xl'
                  : 'w-[26%] min-w-[92px] py-3.5 px-3 text-lg sm:text-xl'
              }`}
            >
              {b.option}
            </button>
          );
        })}
      </div>

      {/* Round Feedback */}
      {feedback && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2 ${
            feedback.status === 'correct'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.status === 'correct' ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              Barakalla! To&apos;g&apos;ri javob (+{POINTS_PER_CORRECT} ball)
            </>
          ) : feedback.status === 'timeout' ? (
            <>
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              Vaqt tugadi! To&apos;g&apos;ri javob: {current.correctAnswer}
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              Noto&apos;g&apos;ri. To&apos;g&apos;ri javob: {current.correctAnswer}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. ENGLISH MINI-GAME: Word Matching & Fill-in-the-Blank
// =========================================================================
const EnglishMiniGame: React.FC<{
  rounds: EnglishRound[];
  onFinish: (correctCount: number) => void;
}> = ({ rounds, onFinish }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedUz, setSelectedUz] = useState<string | null>(null);
  const [matchedUz, setMatchedUz] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [mistakesInMatch, setMistakesInMatch] = useState(0);
  const [fillResult, setFillResult] = useState<{ picked: string; ok: boolean } | null>(null);

  const current = rounds[roundIdx];

  const shuffledEnglish = useMemo(() => {
    if (current.kind !== 'match') return [];
    return [...current.pairs.map((p) => p.en)].sort(() => Math.random() - 0.5);
  }, [current]);

  useEffect(() => {
    setSelectedUz(null);
    setMatchedUz([]);
    setWrongFlash(null);
    setMistakesInMatch(0);
    setFillResult(null);
  }, [roundIdx]);

  const goNext = (nextCorrect: number) => {
    window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1000);
  };

  const handleSelectEn = (enWord: string) => {
    if (current.kind !== 'match' || !selectedUz) return;
    const pair = current.pairs.find((p) => p.uz === selectedUz);
    if (!pair) return;

    if (pair.en === enWord) {
      soundEngine.playCorrect();
      const updated = [...matchedUz, selectedUz];
      setMatchedUz(updated);
      setSelectedUz(null);

      if (updated.length === current.pairs.length) {
        const earned = mistakesInMatch <= 2;
        const nextCorrect = earned ? correctCount + 1 : correctCount;
        if (earned) setCorrectCount(nextCorrect);
        goNext(nextCorrect);
      }
    } else {
      soundEngine.playWrong();
      setMistakesInMatch((m) => m + 1);
      setWrongFlash(enWord);
      window.setTimeout(() => setWrongFlash(null), 500);
    }
  };

  const handleFillPick = (opt: string) => {
    if (current.kind !== 'fill' || fillResult) return;
    const ok = opt === current.correctAnswer;
    const nextCorrect = ok ? correctCount + 1 : correctCount;
    if (ok) {
      soundEngine.playCorrect();
      setCorrectCount(nextCorrect);
    } else {
      soundEngine.playWrong();
    }
    setFillResult({ picked: opt, ok });
    goNext(nextCorrect);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>
          Raund {roundIdx + 1} / {rounds.length} ·{' '}
          {current.kind === 'match' ? "So'zlarni juftlash" : "Bo'sh joyni to'ldirish"}
        </span>
        {current.kind === 'match' && (
          <span className="font-mono-num text-emerald-700">
            Juftlandi: {matchedUz.length} / {current.pairs.length}
          </span>
        )}
      </div>

      <p className="text-base font-bold text-slate-900">{current.instruction}</p>

      {current.kind === 'match' ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Uzbek Column */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-500">O&apos;zbekcha</div>
            {current.pairs.map((p) => {
              const isMatched = matchedUz.includes(p.uz);
              const isSelected = selectedUz === p.uz;
              return (
                <button
                  key={p.uz}
                  type="button"
                  disabled={isMatched}
                  onClick={() => setSelectedUz(p.uz)}
                  className={`w-full py-3.5 px-4 rounded-xl border-2 font-semibold text-sm sm:text-base text-left transition-all cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 opacity-75 cursor-default'
                      : isSelected
                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm'
                      : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-800'
                  }`}
                >
                  {p.uz} {isMatched && '✓'}
                </button>
              );
            })}
          </div>

          {/* English Column */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-500">Inglizcha</div>
            {shuffledEnglish.map((enWord) => {
              const pairForEn = current.pairs.find((p) => p.en === enWord);
              const isMatched = pairForEn ? matchedUz.includes(pairForEn.uz) : false;
              const isWrong = wrongFlash === enWord;

              return (
                <button
                  key={enWord}
                  type="button"
                  disabled={isMatched || !selectedUz}
                  onClick={() => handleSelectEn(enWord)}
                  className={`w-full py-3.5 px-4 rounded-xl border-2 font-semibold text-sm sm:text-base text-left transition-all ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 opacity-75 cursor-default'
                      : isWrong
                      ? 'bg-rose-50 border-rose-500 text-rose-700'
                      : selectedUz
                      ? 'bg-white border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-900 cursor-pointer'
                      : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {enWord} {isMatched && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <div className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              {current.sentence.replace('___', fillResult ? current.correctAnswer : '______')}
            </div>
            <div className="text-sm text-emerald-800 mt-2">{current.translation}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {current.options.map((opt) => {
              let cls =
                'bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-900';
              if (fillResult) {
                if (opt === current.correctAnswer) {
                  cls = 'bg-emerald-600 border-emerald-700 text-white';
                } else if (opt === fillResult.picked) {
                  cls = 'bg-rose-600 border-rose-700 text-white';
                } else {
                  cls = 'bg-slate-50 border-slate-200 text-slate-400';
                }
              }
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={Boolean(fillResult)}
                  onClick={() => handleFillPick(opt)}
                  className={`py-3.5 px-4 rounded-xl border-2 font-bold text-base transition-colors cursor-pointer ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 3. COMPUTER SCIENCE MINI-GAME: Algorithm Ordering & Binary/Logic Blocks
// =========================================================================
const CsMiniGame: React.FC<{
  rounds: CsRound[];
  onFinish: (correctCount: number) => void;
}> = ({ rounds, onFinish }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState<{ ok: boolean; picked?: string } | null>(null);

  const current = rounds[roundIdx];

  const shuffledSteps = useMemo(() => {
    if (current.kind !== 'order') return [];
    const copy = [...current.correctSteps];
    // Guarantee non-trivial shuffle
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    if (copy.every((val, idx) => val === current.correctSteps[idx])) {
      copy.reverse();
    }
    return copy;
  }, [current]);

  useEffect(() => {
    setSelectedOrder([]);
    setChecked(null);
  }, [roundIdx]);

  const advance = (nextCorrect: number) => {
    window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1500);
  };

  const handleCheckOrder = () => {
    if (current.kind !== 'order' || checked) return;
    const ok = current.correctSteps.every((step, i) => selectedOrder[i] === step);
    const nextCorrect = ok ? correctCount + 1 : correctCount;
    if (ok) {
      soundEngine.playCorrect();
      setCorrectCount(nextCorrect);
    } else {
      soundEngine.playWrong();
    }
    setChecked({ ok });
    advance(nextCorrect);
  };

  const handleChoicePick = (opt: string) => {
    if (current.kind !== 'choice' || checked) return;
    const ok = opt === current.correctAnswer;
    const nextCorrect = ok ? correctCount + 1 : correctCount;
    if (ok) {
      soundEngine.playCorrect();
      setCorrectCount(nextCorrect);
    } else {
      soundEngine.playWrong();
    }
    setChecked({ ok, picked: opt });
    advance(nextCorrect);
  };

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold text-slate-600">
        Raund {roundIdx + 1} / {rounds.length} ·{' '}
        {current.kind === 'order' ? 'Algoritm bloklarini tartiblash' : 'Mantiqiy topshiriq'}
      </div>

      <p className="text-base font-bold text-slate-900">{current.prompt}</p>

      {current.kind === 'order' ? (
        <div className="space-y-4">
          {/* Assembled algorithm slots */}
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-violet-800">Siz tuzgan ketma-ketlik:</span>
              {selectedOrder.length > 0 && !checked && (
                <button
                  type="button"
                  onClick={() => setSelectedOrder([])}
                  className="text-xs font-semibold text-violet-700 hover:text-violet-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Tozalash
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {current.correctSteps.map((_, slotIdx) => {
                const val = selectedOrder[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className={`px-3.5 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2.5 ${
                      val
                        ? 'bg-white border-violet-400 text-slate-900'
                        : 'bg-white/60 border-dashed border-violet-300 text-slate-400'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-mono-num text-xs flex items-center justify-center shrink-0">
                      {slotIdx + 1}
                    </span>
                    <span className="truncate">{val || 'Blokni tanlang...'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {shuffledSteps.map((step) => {
              const used = selectedOrder.includes(step);
              return (
                <button
                  key={step}
                  type="button"
                  disabled={used || Boolean(checked)}
                  onClick={() => setSelectedOrder((prev) => [...prev, step])}
                  className={`py-3 px-4 rounded-xl border-2 text-left text-sm font-semibold transition-all ${
                    used
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-default'
                      : 'bg-white border-slate-200 hover:border-violet-500 hover:bg-violet-50/40 text-slate-800 cursor-pointer'
                  }`}
                >
                  {step}
                </button>
              );
            })}
          </div>

          {!checked && (
            <button
              type="button"
              disabled={selectedOrder.length !== current.correctSteps.length}
              onClick={handleCheckOrder}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${
                selectedOrder.length === current.correctSteps.length
                  ? 'bg-violet-600 hover:bg-violet-700 text-white cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Algoritmni tekshirish
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {current.codeSnippet && (
            <pre className="bg-slate-900 text-violet-200 rounded-2xl p-4 font-mono-num text-sm sm:text-base overflow-x-auto">
              {current.codeSnippet}
            </pre>
          )}

          <div className="grid grid-cols-2 gap-3">
            {current.options.map((opt) => {
              let cls =
                'bg-white border-slate-200 hover:border-violet-500 hover:bg-violet-50/40 text-slate-900';
              if (checked) {
                if (opt === current.correctAnswer) {
                  cls = 'bg-emerald-600 border-emerald-700 text-white';
                } else if (opt === checked.picked) {
                  cls = 'bg-rose-600 border-rose-700 text-white';
                } else {
                  cls = 'bg-slate-50 border-slate-200 text-slate-400';
                }
              }
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={Boolean(checked)}
                  onClick={() => handleChoicePick(opt)}
                  className={`py-3.5 px-4 rounded-xl border-2 font-bold text-sm sm:text-base transition-colors cursor-pointer ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {checked && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-start gap-2 ${
            checked.ok
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {checked.ok ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>
            <div>
              {checked.ok
                ? `Ajoyib! To'g'ri yechim (+${POINTS_PER_CORRECT} ball)`
                : "Ketma-ketlik yoki javob noto'g'ri."}
            </div>
            <div className="text-xs font-normal mt-0.5 opacity-90">{current.explanation}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 4. SCIENCE MINI-GAME: Illustrated Rapid Facts & True/False Quiz
// =========================================================================
const ScienceIcon: React.FC<{ name: ScienceRound['icon'] }> = ({ name }) => {
  const cls = 'w-10 h-10 text-orange-600';
  switch (name) {
    case 'sun':
      return <Sun className={cls} />;
    case 'leaf':
      return <Leaf className={cls} />;
    case 'atom':
      return <Atom className={cls} />;
    case 'droplet':
      return <Droplet className={cls} />;
    case 'globe':
      return <Globe className={cls} />;
    case 'zap':
      return <Zap className={cls} />;
    case 'flame':
      return <Flame className={cls} />;
    case 'heart':
      return <Heart className={cls} />;
  }
};

const ScienceMiniGame: React.FC<{
  rounds: ScienceRound[];
  onFinish: (correctCount: number) => void;
}> = ({ rounds, onFinish }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const current = rounds[roundIdx];

  useEffect(() => {
    setPicked(null);
  }, [roundIdx]);

  const handleAnswer = (opt: string) => {
    if (picked) return;
    const ok = opt === current.correctAnswer;
    const nextCorrect = ok ? correctCount + 1 : correctCount;
    if (ok) {
      soundEngine.playCorrect();
      setCorrectCount(nextCorrect);
    } else {
      soundEngine.playWrong();
    }
    setPicked(opt);

    window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1700);
  };

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold text-slate-600">
        Raund {roundIdx + 1} / {rounds.length} ·{' '}
        {current.kind === 'true_false' ? "To'g'ri yoki Noto'g'ri?" : 'Tezkor viktorina'}
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-white border border-orange-200 shadow-sm flex items-center justify-center">
          <ScienceIcon name={current.icon} />
        </div>
        <p className="text-lg sm:text-xl font-display font-bold text-slate-900 text-balance">
          {current.statement}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {current.options.map((opt) => {
          let cls =
            'bg-white border-slate-200 hover:border-orange-500 hover:bg-orange-50/40 text-slate-900';
          if (picked) {
            if (opt === current.correctAnswer) {
              cls = 'bg-emerald-600 border-emerald-700 text-white';
            } else if (opt === picked) {
              cls = 'bg-rose-600 border-rose-700 text-white';
            } else {
              cls = 'bg-slate-50 border-slate-200 text-slate-400';
            }
          }
          return (
            <button
              key={opt}
              type="button"
              disabled={Boolean(picked)}
              onClick={() => handleAnswer(opt)}
              className={`py-4 px-4 rounded-xl border-2 font-bold text-base transition-colors cursor-pointer ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {picked && (
        <div
          className={`rounded-xl px-4 py-3 text-sm flex items-start gap-2 ${
            picked === current.correctAnswer
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-amber-50 text-amber-950 border border-amber-200'
          }`}
        >
          {picked === current.correctAnswer ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold">
              {picked === current.correctAnswer
                ? `To'g'ri! (+${POINTS_PER_CORRECT} ball)`
                : `To'g'ri javob: ${current.correctAnswer}`}
            </div>
            <div className="text-xs mt-0.5">{current.fact}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 5. ALIFBE MINI-GAME (1-sinf Voice + Visual Pre-Reader UX)
//    Vowels (A, O, I, U, E, O') = RED | Consonants = BLUE
// =========================================================================
const UZBEK_VOWELS = new Set(['A', 'O', 'I', 'U', 'E', "O'", 'O‘', 'Oʻ']);
const UZBEK_DIGRAPHS = new Set(["O'", 'O‘', 'Oʻ', "G'", 'G‘', 'Gʻ', 'SH', 'CH', 'NG']);

function normalizeAlifbeToken(token: string): string {
  return token.trim().toUpperCase().replace(/[‘’`ʻ]/g, "'");
}

function isUzbekVowel(letter: string): boolean {
  return UZBEK_VOWELS.has(normalizeAlifbeToken(letter));
}

function isSingleUzbekLetter(token: string): boolean {
  const norm = normalizeAlifbeToken(token);
  return norm.length === 1 || UZBEK_DIGRAPHS.has(norm);
}

function splitUzbekLetters(text: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < text.length) {
    const pair = text.slice(i, i + 2);
    const normPair = normalizeAlifbeToken(pair);
    if (pair.length === 2 && UZBEK_DIGRAPHS.has(normPair)) {
      result.push(pair);
      i += 2;
    } else {
      result.push(text[i]);
      i += 1;
    }
  }
  return result;
}

const ColoredAlifbeWord: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const letters = splitUzbekLetters(text);
  return (
    <span className={className}>
      {letters.map((ch, idx) => {
        if (!/[A-Za-z'‘’ʻ]/.test(ch)) {
          return <span key={idx}>{ch}</span>;
        }
        const vowel = isUzbekVowel(ch);
        return (
          <span key={idx} className={vowel ? 'text-rose-600' : 'text-blue-600'}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

const AlifbeMiniGame: React.FC<{
  rounds: AlifbeRound[];
  onFinish: (correctCount: number) => void;
}> = ({ rounds, onFinish }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const [retryMsg, setRetryMsg] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState<string | null>(null);

  // State for build_word (index-based so duplicate syllables like BO+BO or DA+DA both work!)
  const [usedPartIndices, setUsedPartIndices] = useState<number[]>([]);

  // State for letter_match
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [matchedLetters, setMatchedLetters] = useState<string[]>([]);

  const current = rounds[roundIdx];

  const shuffledParts = useMemo(() => {
    if (current.kind !== 'build_word') return [];
    const indexed = current.parts.map((text, origIdx) => ({ text, origIdx }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    if (indexed.length > 1 && indexed.every((item, idx) => item.text === current.parts[idx])) {
      indexed.reverse();
    }
    return indexed;
  }, [current]);

  const shuffledMatchPairs = useMemo(() => {
    if (current.kind !== 'letter_match') return [];
    const copy = [...current.pairs];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    if (copy.length > 1 && copy.every((p, idx) => p.letter === current.pairs[idx].letter)) {
      copy.reverse();
    }
    return copy;
  }, [current]);

  // Reset per round & auto-speak prompt
  useEffect(() => {
    setSolved(false);
    setRetryMsg(null);
    setShakeKey(null);
    setUsedPartIndices([]);
    setSelectedLetter(null);
    setMatchedLetters([]);

    const speakTimer = window.setTimeout(() => {
      speakUzbek(current.spokenPrompt);
    }, 180);

    return () => {
      window.clearTimeout(speakTimer);
    };
  }, [roundIdx, current]);

  const triggerRetry = (key: string) => {
    soundEngine.playWrong();
    setShakeKey(key);
    setRetryMsg("Qayta urinib ko'r!");
    speakUzbek("Qayta urinib ko'r!");
    window.setTimeout(() => {
      setShakeKey((prev) => (prev === key ? null : prev));
    }, 520);
  };

  const completeRound = (praiseText: string) => {
    const nextCorrect = correctCount + 1;
    setCorrectCount(nextCorrect);
    setSolved(true);
    setRetryMsg(null);
    soundEngine.playCorrect();
    speakUzbek(praiseText);

    window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1350);
  };

  const handleFirstLetterPick = (opt: string) => {
    if (current.kind !== 'first_letter' || solved) return;
    if (opt === current.correctAnswer) {
      completeRound(`Barakalla! ${current.word}!`);
    } else {
      triggerRetry(`fl-${opt}`);
    }
  };

  const handleBuildWordTap = (tileIdx: number, text: string) => {
    if (current.kind !== 'build_word' || solved || usedPartIndices.includes(tileIdx)) return;
    const expected = current.parts[usedPartIndices.length];
    if (text === expected) {
      const nextUsed = [...usedPartIndices, tileIdx];
      setUsedPartIndices(nextUsed);
      setRetryMsg(null);
      if (nextUsed.length === current.parts.length) {
        completeRound(`Barakalla! ${current.word}!`);
      } else {
        soundEngine.playEquip();
        speakUzbek(text);
      }
    } else {
      triggerRetry(`bw-${tileIdx}`);
    }
  };

  const handleMatchEmojiTap = (pair: { letter: string; emoji: string; word: string }) => {
    if (current.kind !== 'letter_match' || solved || !selectedLetter) return;
    if (pair.letter === selectedLetter) {
      const nextMatched = [...matchedLetters, selectedLetter];
      setMatchedLetters(nextMatched);
      setSelectedLetter(null);
      setRetryMsg(null);
      if (nextMatched.length === current.pairs.length) {
        completeRound('Barakalla! Hammasi to‘g‘ri!');
      } else {
        soundEngine.playCorrect();
        speakUzbek(`${pair.letter}, ${pair.word}`);
      }
    } else {
      triggerRetry(`lm-${pair.letter}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Progress + Big Bright Listen Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">
            Raund {roundIdx + 1} / {rounds.length}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Unli
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block ml-1" /> Undosh
          </span>
        </div>

        <button
          type="button"
          onClick={() => speakUzbek(current.spokenPrompt)}
          className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-display font-extrabold text-sm sm:text-base shadow-md border-b-4 border-amber-600 flex items-center gap-2 cursor-pointer transition-transform"
        >
          <Volume2 className="w-5 h-5" />
          <span>🔊 Eshitish</span>
        </button>
      </div>

      {/* Short, clean prompt caption */}
      <p className="text-sm sm:text-base font-bold text-slate-700 text-center">
        {current.spokenPrompt}
      </p>

      {/* KIND 1: FIRST LETTER */}
      {current.kind === 'first_letter' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => speakUzbek(current.word)}
            className="w-full py-5 px-4 rounded-3xl bg-rose-50 border-2 border-rose-200 hover:border-rose-300 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
            title="So'zni eshitish uchun bosing"
          >
            <span className="text-7xl sm:text-8xl leading-none select-none">{current.emoji}</span>
            <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
              {solved ? current.word : 'Rasmni bosib eshiting'}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {current.options.map((opt) => {
              const vowel = isUzbekVowel(opt);
              const isShaking = shakeKey === `fl-${opt}`;
              const isRight = solved && opt === current.correctAnswer;

              let cls = vowel
                ? 'bg-rose-600 hover:bg-rose-700 border-rose-800 text-white'
                : 'bg-blue-600 hover:bg-blue-700 border-blue-800 text-white';

              if (isShaking) {
                cls = 'bg-red-700 border-red-900 text-white animate-alifbe-shake';
              } else if (isRight) {
                cls = 'bg-emerald-600 border-emerald-800 text-white scale-[1.03]';
              } else if (solved) {
                cls = 'bg-slate-200 border-slate-300 text-slate-400';
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={solved}
                  onClick={() => handleFirstLetterPick(opt)}
                  className={`py-5 sm:py-6 px-4 rounded-2xl border-b-4 font-display font-black text-4xl sm:text-5xl shadow-md active:scale-95 transition-all cursor-pointer ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* KIND 2: BUILD WORD */}
      {current.kind === 'build_word' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => speakUzbek(current.word)}
            className="w-full py-4 px-4 rounded-3xl bg-rose-50 border-2 border-rose-200 hover:border-rose-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
            title="So'zni eshitish uchun bosing"
          >
            <span className="text-7xl sm:text-8xl leading-none select-none">{current.emoji}</span>
            <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
              {solved ? current.word : 'So‘zni eshitish uchun bosing'}
            </span>
          </button>

          {/* Word Assembly Slots */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
            {current.parts.map((_, slotIdx) => {
              const chosenTileIdx = usedPartIndices[slotIdx];
              const chosenPart =
                chosenTileIdx !== undefined ? shuffledParts[chosenTileIdx]?.text : null;

              return (
                <div
                  key={slotIdx}
                  className={`min-w-[76px] sm:min-w-[96px] h-16 sm:h-20 px-4 rounded-2xl border-2 flex items-center justify-center font-display font-black text-3xl sm:text-4xl transition-all ${
                    chosenPart
                      ? 'bg-white border-emerald-500 shadow-sm'
                      : slotIdx === usedPartIndices.length
                      ? 'bg-amber-50 border-dashed border-amber-500 text-amber-400'
                      : 'bg-white/70 border-dashed border-slate-300 text-slate-300'
                  }`}
                >
                  {chosenPart ? <ColoredAlifbeWord text={chosenPart} /> : '?'}
                </div>
              );
            })}
          </div>

          {/* Tappable Shuffled Letter / Syllable Blocks */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {shuffledParts.map((item, tileIdx) => {
              const isUsed = usedPartIndices.includes(tileIdx);
              const isShaking = shakeKey === `bw-${tileIdx}`;
              const singleLetter = isSingleUzbekLetter(item.text);
              const vowel = singleLetter && isUzbekVowel(item.text);

              let cls = singleLetter
                ? vowel
                  ? 'bg-rose-600 hover:bg-rose-700 border-rose-800 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 border-blue-800 text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900';

              if (isUsed) {
                cls = 'bg-slate-100 border-slate-200 text-slate-300 opacity-45 cursor-default';
              } else if (isShaking) {
                cls = 'bg-rose-600 border-rose-800 text-white animate-alifbe-shake';
              }

              return (
                <button
                  key={`${item.origIdx}-${item.text}`}
                  type="button"
                  disabled={isUsed || solved}
                  onClick={() => handleBuildWordTap(tileIdx, item.text)}
                  className={`min-w-[96px] sm:min-w-[118px] py-4 sm:py-5 px-5 rounded-2xl border-2 border-b-4 font-display font-black text-3xl sm:text-4xl shadow-md active:scale-95 transition-all cursor-pointer ${cls}`}
                >
                  {!singleLetter && !isUsed && !isShaking ? (
                    <ColoredAlifbeWord text={item.text} />
                  ) : (
                    item.text
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* KIND 3: LETTER MATCH */}
      {current.kind === 'letter_match' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {/* Letters Column (Red for vowels, Blue for consonants) */}
          <div className="space-y-2.5">
            {current.pairs.map((p) => {
              const isMatched = matchedLetters.includes(p.letter);
              const isSelected = selectedLetter === p.letter;
              const vowel = isUzbekVowel(p.letter);

              let cls = vowel
                ? 'bg-rose-50 border-rose-400 text-rose-700 hover:bg-rose-100'
                : 'bg-blue-50 border-blue-400 text-blue-700 hover:bg-blue-100';

              if (isMatched) {
                cls = 'bg-emerald-50 border-emerald-400 text-emerald-700 opacity-70 cursor-default';
              } else if (isSelected) {
                cls = vowel
                  ? 'bg-rose-600 border-rose-800 text-white shadow-md scale-[1.03]'
                  : 'bg-blue-600 border-blue-800 text-white shadow-md scale-[1.03]';
              }

              return (
                <button
                  key={p.letter}
                  type="button"
                  disabled={isMatched || solved}
                  onClick={() => {
                    setSelectedLetter(p.letter);
                    setRetryMsg(null);
                    speakUzbek(p.letter);
                  }}
                  className={`w-full py-4 sm:py-5 px-4 rounded-2xl border-2 border-b-4 font-display font-black text-4xl sm:text-5xl flex items-center justify-center gap-2 transition-all cursor-pointer ${cls}`}
                >
                  <span>{p.letter}</span>
                  {isMatched && <CheckCircle2 className="w-7 h-7 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Huge Emoji Column */}
          <div className="space-y-2.5">
            {shuffledMatchPairs.map((p) => {
              const isMatched = matchedLetters.includes(p.letter);
              const isShaking = shakeKey === `lm-${p.letter}`;

              let cls = selectedLetter
                ? 'bg-white border-amber-400 hover:bg-amber-50 shadow-sm cursor-pointer'
                : 'bg-slate-50 border-slate-200 opacity-80 cursor-pointer';

              if (isMatched) {
                cls = 'bg-emerald-50 border-emerald-400 opacity-75 cursor-default';
              } else if (isShaking) {
                cls = 'bg-rose-100 border-rose-500 animate-alifbe-shake';
              }

              return (
                <button
                  key={`${p.letter}-${p.emoji}`}
                  type="button"
                  disabled={isMatched || solved}
                  onClick={() => {
                    if (!selectedLetter) {
                      speakUzbek(p.word);
                      return;
                    }
                    handleMatchEmojiTap(p);
                  }}
                  className={`w-full py-3 sm:py-4 px-4 rounded-2xl border-2 border-b-4 flex items-center justify-center gap-2.5 transition-all ${cls}`}
                  title={p.word}
                >
                  <span className="text-5xl sm:text-6xl leading-none select-none">{p.emoji}</span>
                  {isMatched && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Gentle Feedback Banner */}
      {solved && (
        <div className="rounded-2xl px-4 py-3.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-display font-bold text-base flex items-center justify-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>Barakalla! +{POINTS_PER_CORRECT} ball</span>
        </div>
      )}

      {!solved && retryMsg && (
        <div className="rounded-2xl px-4 py-3 bg-rose-50 border-2 border-rose-300 text-rose-800 font-display font-bold text-base flex items-center justify-center gap-2">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{retryMsg}</span>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// MAIN LESSON MODAL (3 Stages: Explanation -> Mini-Game -> Celebration Reward)
// =========================================================================
export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  grade,
  initialStage = 'explain',
  testMode = false,
  onComplete,
  onClose,
}) => {
  const [stage, setStage] = useState<'explain' | 'game' | 'reward'>(initialStage);
  const [correctCount, setCorrectCount] = useState(0);
  const meta = SUBJECT_META[lesson.subject];

  // Auto-speak Alifbe lesson explanation on Stage 1, and cancel speech on unmount
  useEffect(() => {
    if (stage === 'explain' && lesson.subject === 'alifbe') {
      const timer = window.setTimeout(() => {
        speakUzbek(lesson.explanation);
      }, 220);
      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [stage, lesson]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleCloseModal = () => {
    stopSpeaking();
    onClose();
  };

  const handleGameFinish = (correct: number) => {
    stopSpeaking();
    setCorrectCount(correct);
    setStage('reward');
    soundEngine.playLessonComplete();
  };

  const earnedFromAnswers = correctCount * POINTS_PER_CORRECT;
  const totalEarned = earnedFromAnswers + COMPLETION_BONUS;

  return (
    <>
      <ConfettiCanvas active={stage === 'reward'} />

      <AutoFitModal overlayClassName="z-50 bg-slate-900/65">
        <div className="w-[min(672px,94vw)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4"
            style={{ backgroundColor: meta.bgTint }}
          >
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-600">
                {meta.roomName} · {getTierLabel(grade)}
                {testMode ? ' · Tekshiruv rejimi' : ''}
              </div>
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 truncate">
                {lesson.topicTitle}
              </h2>
            </div>

            {stage !== 'reward' && (
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Darsdan chiqish"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6">
            {/* STAGE 1: SHORT EXPLANATION ON CHALKBOARD */}
            {stage === 'explain' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <BlockyTeacherAvatar color={meta.color} />
                    <div>
                      <div className="text-base font-display font-bold text-slate-900">
                        {meta.teacherName}
                      </div>
                      <div className="text-xs text-slate-500">{meta.teacherTitle}</div>
                    </div>
                  </div>

                  {lesson.subject === 'alifbe' && (
                    <button
                      type="button"
                      onClick={() => speakUzbek(lesson.explanation)}
                      className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-display font-extrabold text-sm sm:text-base shadow-md border-b-4 border-amber-600 flex items-center gap-2 cursor-pointer transition-transform"
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>🔊 Eshitish</span>
                    </button>
                  )}
                </div>

                {/* Alifbe Interactive Big Flashcards (Red=Vowel, Blue=Consonant) */}
                {lesson.subject === 'alifbe' && lesson.alifbeCards && lesson.alifbeCards.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>Harf kartochkasini bosing va eshiting:</span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Qizil — Unli
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block ml-1.5" /> Ko&apos;k — Undosh
                      </span>
                    </div>
                    <div
                      className={`grid gap-3 ${
                        lesson.alifbeCards.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
                      }`}
                    >
                      {lesson.alifbeCards.map((card) => {
                        const single = isSingleUzbekLetter(card.letter);
                        const vowel = single && isUzbekVowel(card.letter);
                        const cardCls = single
                          ? vowel
                            ? 'bg-rose-50 border-rose-400 hover:bg-rose-100'
                            : 'bg-blue-50 border-blue-400 hover:bg-blue-100'
                          : 'bg-white border-slate-300 hover:bg-slate-50';
                        const letterCls = single
                          ? vowel
                            ? 'text-rose-600'
                            : 'text-blue-600'
                          : '';

                        return (
                          <button
                            key={`${card.letter}-${card.word}`}
                            type="button"
                            onClick={() => {
                              soundEngine.playEquip();
                              speakUzbek(`${card.letter}, ${card.word}`);
                            }}
                            className={`p-4 rounded-2xl border-2 border-b-4 flex flex-col items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${cardCls}`}
                          >
                            <span className={`font-display font-black text-4xl sm:text-5xl leading-none ${letterCls}`}>
                              {single ? card.letter : <ColoredAlifbeWord text={card.letter} />}
                            </span>
                            <span className="text-4xl sm:text-5xl leading-none my-1">{card.emoji}</span>
                            <span className="text-sm font-bold text-slate-800">{card.word}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Classroom Chalkboard */}
                <div className="rounded-2xl bg-[#1E4635] border-4 border-[#92400E] p-5 sm:p-6 text-emerald-50 shadow-inner space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-amber-200 mb-1">
                      {lesson.ruleTitle}
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-white">
                      {lesson.explanation}
                    </p>
                  </div>

                  <div className="bg-black/25 rounded-xl px-4 py-3 font-mono-num text-base sm:text-lg font-bold text-amber-300 text-center">
                    {lesson.formulaOrRule}
                  </div>

                  <div className="pt-3 border-t border-white/15 text-sm space-y-1">
                    <div className="text-emerald-200 font-semibold">Misol:</div>
                    <div className="font-mono-num text-white font-semibold">
                      {lesson.exampleProblem}
                    </div>
                    <div className="text-amber-200 font-medium">
                      Yechim: {lesson.exampleSolution}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    soundEngine.playEquip();
                    setStage('game');
                  }}
                  style={{ backgroundColor: meta.color }}
                  className="w-full py-3.5 px-6 rounded-xl text-white font-display font-bold text-base shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Tushundim, o&apos;yinni boshlash!
                </button>
              </div>
            )}

            {/* STAGE 2: SUBJECT-SPECIFIC MINI-GAME */}
            {stage === 'game' && (
              <div>
                {lesson.subject === 'alifbe' && lesson.alifbeRounds && (
                  <AlifbeMiniGame rounds={lesson.alifbeRounds} onFinish={handleGameFinish} />
                )}
                {lesson.subject === 'math' && lesson.mathRounds && (
                  <MathMiniGame
                    rounds={lesson.mathRounds}
                    grade={grade}
                    onFinish={handleGameFinish}
                  />
                )}
                {lesson.subject === 'english' && lesson.englishRounds && (
                  <EnglishMiniGame rounds={lesson.englishRounds} onFinish={handleGameFinish} />
                )}
                {lesson.subject === 'cs' && lesson.csRounds && (
                  <CsMiniGame rounds={lesson.csRounds} onFinish={handleGameFinish} />
                )}
                {lesson.subject === 'science' && lesson.scienceRounds && (
                  <ScienceMiniGame rounds={lesson.scienceRounds} onFinish={handleGameFinish} />
                )}
              </div>
            )}

            {/* STAGE 3: REWARD SUMMARY & CONFETTI */}
            {stage === 'reward' && (
              <div className="text-center space-y-6 py-2">
                <div className="w-20 h-20 rounded-3xl bg-amber-100 border border-amber-300 mx-auto flex items-center justify-center">
                  <Award className="w-11 h-11 text-amber-600" />
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                    Dars muvaffaqiyatli yakunlandi!
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Ajoyib harakat! Endi keyingi darsga o&apos;tishingiz yoki do&apos;kondan yangi 3D aksessuar olishingiz mumkin.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">To&apos;g&apos;ri javoblar ({correctCount} / 4)</span>
                    <span className="font-mono-num font-bold text-slate-900">
                      +{earnedFromAnswers} ball
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Darsni tugatish bonusi</span>
                    <span className="font-mono-num font-bold text-emerald-700">
                      +{COMPLETION_BONUS} ball
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base">
                    <span className="font-bold text-slate-900">Jami mukofot</span>
                    <span className="font-mono-num font-extrabold text-amber-600 inline-flex items-center gap-1.5">
                      <Coins className="w-5 h-5 text-amber-500" />+{totalEarned} ball
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playCoin();
                    onComplete(totalEarned, correctCount);
                  }}
                  className="w-full max-w-md mx-auto py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-base shadow-md transition-colors cursor-pointer"
                >
                  {testMode
                    ? "Tekshiruv oynasiga qaytish"
                    : "Ballarni olish va koridorga qaytish"}
                </button>
              </div>
            )}
          </div>
        </div>
      </AutoFitModal>
    </>
  );
};
