import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  Square,
  Sun,
  Volume2,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  AlifbeGameType,
  AlifbeRound,
  CsGameType,
  CsRound,
  EnglishGameType,
  EnglishRound,
  LessonPlan,
  MathGameType,
  MathRound,
  PeGameType,
  PeRound,
  ScienceGameType,
  ScienceRound,
  SUBJECT_META,
} from '../data/curriculum';
import { getTierLabel } from '../utils/storage';
import {
  getSpeechState,
  playLessonAudio,
  resolveLessonAudioId,
  resolveLetterAudioId,
  soundEngine,
  SpeechState,
  speakEnglish,
  speakUzbek,
  speakUzbekLetter,
  stopSpeaking,
  subscribeSpeechState,
} from '../utils/sound';
import { ConfettiCanvas } from './ConfettiCanvas';
import { AutoFitModal } from './AutoFitModal';
import {
  BankTensStage,
  BridgeTensStage,
  MagicChainStage,
  MagicLockStage,
  RoomSortStage,
  StepConfettiBurst,
  TangramStage,
  TowerBlocksStage,
  TrainTensStage,
  TwoPocketsStage,
} from './MathGrade1MiniGames';
import {
  AnimalHomesStage,
  BreadChainStage,
  CleanHandsStage,
  EcoPatrolStage,
  FlagMapStage,
  PlantLabStage,
  SafetyHomeStage,
  SCIENCE_GAME_TITLES,
  SeasonsWheelStage,
  TrafficLightStage,
  WaterStatesStage,
} from './ScienceGrade1MiniGames';
import {
  ChefAlgoStage,
  CS_GAME_TITLES,
  CycleCarouselStage,
  DroneFlightStage,
  LogicDetectiveStage,
  PcBuilderStage,
  RobotMazeStage,
  SensesSorterStage,
  ShortPathStage,
  TasteConveyorStage,
  TimeMachineStage,
} from './CsGrade1MiniGames';
import {
  BackpackPackStage,
  ENGLISH_GAME_TITLES,
  FaceMakerStage,
  FamilyAlbumStage,
  GreetingsClubStage,
  HouseBuilderStage,
  PicnicBasketStage,
  RainbowPaintStage,
  SafariAnimalsStage,
  SuperheroActionsStage,
  ToyBoxStage,
} from './EnglishGrade1MiniGames';
import {
  ALIFBE_GAME_TITLES,
  BalloonPopStage,
  BasketSortStage,
  FlowerGardenStage,
  GoldenReaderStage,
  MissingLetterStage,
  SyllableWheelStage,
  TrainBuilderStage,
  TwinLettersStage,
} from './AlifbeGrade1MiniGames';
import {
  BallThrowStage,
  CheckersIntroStage,
  DayNightFreezeStage,
  GymnasticsBalanceStage,
  JumpPowerStage,
  LineFormationStage,
  NumberReactionStage,
  PE_GAME_TITLES,
  RelayRaceStage,
  TagChaseStage,
  TrainRouteStage,
  WarmupRhythmStage,
} from './PeGrade1MiniGames';

interface LessonModalProps {
  lesson: LessonPlan;
  grade: number;
  studentName?: string;
  initialStage?: 'explain' | 'game';
  testMode?: boolean;
  onComplete: (earnedCoins: number, correctCount: number, totalRounds: number) => void;
  onClose: () => void;
}

const POINTS_PER_CORRECT = 20;
const COMPLETION_BONUS = 30;

const BlockyTeacherAvatar: React.FC<{ color: string; speaking?: boolean }> = ({
  color,
  speaking = false,
}) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16 shrink-0" aria-hidden="true">
    <rect x="24" y="8" width="32" height="10" rx="3" fill="#2C221E" />
    <rect x="24" y="14" width="32" height="28" rx="4" fill="#FCD2A2" />
    <rect x="30" y="24" width="6" height="6" rx="1" fill="#0F172A" />
    <rect x="44" y="24" width="6" height="6" rx="1" fill="#0F172A" />
    <rect x="28" y="22" width="10" height="10" rx="2" fill="none" stroke="#1E293B" strokeWidth="2" />
    <rect x="42" y="22" width="10" height="10" rx="2" fill="none" stroke="#1E293B" strokeWidth="2" />
    <line x1="38" y1="27" x2="42" y2="27" stroke="#1E293B" strokeWidth="2" />
    {speaking ? (
      <rect x="35" y="34" width="10" height="5.5" rx="2.5" fill="#7C2D12" />
    ) : (
      <rect x="34" y="35" width="12" height="3" rx="1.5" fill="#7C2D12" />
    )}
    <rect x="16" y="45" width="48" height="30" rx="6" fill={color} />
    <polygon points="40,45 34,55 46,55" fill="#FFFFFF" />
  </svg>
);

const KaraokeSubtitleText: React.FC<{
  text: string;
  speech: SpeechState;
  activeClassName: string;
  pendingClassName: string;
  cursorClassName?: string;
}> = ({ text, speech, activeClassName, pendingClassName, cursorClassName = 'text-amber-300' }) => {
  const isTrackingThis = speech.fullText === text && (speech.isSpeaking || speech.visibleLength < text.length);
  if (!isTrackingThis) {
    return <span className={activeClassName}>{text}</span>;
  }

  const cut = Math.min(text.length, Math.max(0, speech.visibleLength));
  const spoken = text.slice(0, cut);
  const remaining = text.slice(cut);

  return (
    <span>
      <span className={activeClassName}>{spoken}</span>
      {speech.isSpeaking && cut < text.length && (
        <span className={`inline-block font-bold mx-[1px] ${cursorClassName}`} aria-hidden="true">
          |
        </span>
      )}
      <span className={pendingClassName}>{remaining}</span>
    </span>
  );
};

// =========================================================================
// 1. MATH MINI-GAMES:
//    - 'croc_compare'  : "Ochko'z Timsohcha" (Sonlarni taqqoslash: < , = , >)
//    - 'scale_balance' : "Sehrli Tarozi" (Noma'lum sonni topish: ? + 3 = 8)
//    - 'fruit_basket'  : "Meva Terish va Savatga Solish" (Qo'shish va ayirish)
//    - 'moving_blocks' : Harakatlanuvchi bloklar (umumiy testlar va yuqori sinflar)
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

// -------------------------------------------------------------------------
// 1A. "OCHKO'Z TIMSOHCHA" MINI-O'YINI (Sonlarni taqqoslash: < , = , >)
// -------------------------------------------------------------------------
const CrocItemCluster: React.FC<{
  count: number;
  emoji: string;
  bundleSize?: number;
  beingEaten: boolean;
  eatDirection: 'left' | 'right';
}> = ({ count, emoji, bundleSize, beingEaten, eatDirection }) => {
  const useBundles = Boolean(bundleSize && bundleSize >= 10 && count >= bundleSize);
  const tens = useBundles && bundleSize ? Math.floor(count / bundleSize) : 0;
  const ones = useBundles && bundleSize ? count % bundleSize : count;

  return (
    <motion.div
      animate={
        beingEaten
          ? {
              x: eatDirection === 'left' ? 38 : -38,
              scale: [1, 1.08, 0.25],
              opacity: [1, 1, 0],
            }
          : { x: 0, scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.55, delay: beingEaten ? 0.14 : 0, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center gap-2 min-h-[118px]"
    >
      {useBundles ? (
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex flex-wrap items-center justify-center gap-1 max-w-[144px]">
            {Array.from({ length: tens }).map((_, idx) => (
              <div
                key={`t-${idx}`}
                className="px-2 py-1 rounded-lg bg-amber-100 border-2 border-amber-400 text-amber-900 font-mono-num text-xs font-extrabold shadow-xs flex items-center gap-0.5"
              >
                <span className="text-sm leading-none">{emoji === '📦' ? '📦' : '📦'}</span>
                <span>10</span>
              </div>
            ))}
          </div>
          {ones > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1 max-w-[144px]">
              {Array.from({ length: ones }).map((_, idx) => (
                <span key={`o-${idx}`} className="text-xl sm:text-2xl leading-none select-none">
                  {emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[148px]">
          {Array.from({ length: Math.min(count, 12) }).map((_, idx) => (
            <motion.span
              key={idx}
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: idx * 0.035, type: 'spring', stiffness: 320, damping: 18 }}
              className="text-2xl sm:text-[28px] leading-none select-none drop-shadow-xs"
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      )}

      <div className="font-mono-num text-2xl sm:text-3xl font-black text-emerald-950 leading-none">
        {count}
      </div>
    </motion.div>
  );
};

const CrocCompareStage: React.FC<{
  round: MathRound;
  feedback: { status: 'correct' | 'wrong' | 'timeout'; picked?: string } | null;
  onSelect: (answer: string) => void;
}> = ({ round, feedback, onSelect }) => {
  const leftCount = round.crocData?.leftCount ?? 4;
  const rightCount = round.crocData?.rightCount ?? 7;
  const itemEmoji = round.crocData?.itemEmoji ?? '🐟';
  const bundleSize = round.crocData?.bundleSize;

  const isCorrect = feedback?.status === 'correct';
  const isWrong = feedback?.status === 'wrong';

  const correctSign = round.correctAnswer; // '<' | '>' | '='
  const eatingRight = isCorrect && correctSign === '<';
  const eatingLeft = isCorrect && correctSign === '>';
  const happyEqual = isCorrect && correctSign === '=';

  // Flip crocodile toward the side it is eating
  const crocFlipX = eatingLeft ? -1 : 1;

  const buttons: { sign: '<' | '=' | '>'; label: string }[] = [
    { sign: '<', label: "Katta o'ngda" },
    { sign: '=', label: 'Teng' },
    { sign: '>', label: 'Katta chapda' },
  ];

  return (
    <div className="space-y-3.5">
      {/* Pond & Crocodile Visual Arena */}
      <div className="relative rounded-2xl bg-gradient-to-b from-sky-100 via-emerald-50 to-teal-100 border-2 border-emerald-200 px-3 py-4 sm:px-5 sm:py-5 overflow-hidden select-none">
        {/* Soft water ripples */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 25% 100%, #5EEAD4 0%, transparent 65%), radial-gradient(ellipse at 75% 100%, #5EEAD4 0%, transparent 65%)',
          }}
        />

        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          {/* Left Lilypad Tray */}
          <div className="rounded-2xl bg-white/85 border-2 border-emerald-200/90 px-2.5 py-3 shadow-xs">
            <CrocItemCluster
              count={leftCount}
              emoji={itemEmoji}
              bundleSize={bundleSize}
              beingEaten={eatingLeft}
              eatDirection="left"
            />
          </div>

          {/* Center Cartoon Crocodile */}
          <div className="relative flex flex-col items-center justify-center w-[124px] sm:w-[152px]">
            {/* Comic "QARS!" & Starburst on correct chomp */}
            <AnimatePresence>
              {isCorrect && (
                <motion.div
                  initial={{ scale: 0.3, opacity: 0, y: 8 }}
                  animate={{ scale: [0.6, 1.18, 1], opacity: 1, y: -12 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute -top-4 z-10 pointer-events-none flex items-center gap-1 rounded-xl bg-amber-400 border-2 border-amber-600 px-2.5 py-0.5 text-xs sm:text-sm font-display font-black text-slate-950 shadow-md"
                >
                  <span>⭐</span>
                  <span>{happyEqual ? 'TENG!' : 'QARS!'}</span>
                  <span>⭐</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={
                isWrong
                  ? { x: [0, -8, 8, -5, 5, 0] }
                  : isCorrect
                  ? { scale: [1, 1.08, 1], y: [0, -4, 0] }
                  : { y: [0, -3, 0] }
              }
              transition={
                isWrong
                  ? { duration: 0.4 }
                  : isCorrect
                  ? { duration: 0.5 }
                  : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <svg
                viewBox="0 0 160 128"
                className="w-[120px] h-[98px] sm:w-[148px] sm:h-[120px] overflow-visible"
                aria-label="Ochko'z Timsohcha"
              >
                <g transform={`translate(80, 68) scale(${crocFlipX}, 1)`}>
                  {/* Neck / Cute Back Scales */}
                  <ellipse cx="-26" cy="8" rx="34" ry="26" fill="#16A34A" stroke="#14532D" strokeWidth="3" />
                  <path d="M-46,-12 L-38,-22 L-30,-14 L-22,-23 L-14,-13" fill="#15803D" stroke="#14532D" strokeWidth="2.5" strokeLinejoin="round" />

                  {/* Lower Jaw (pivots at -8, 14) */}
                  <g transform="translate(-8, 14)">
                    <motion.g
                      animate={
                        eatingRight || eatingLeft
                          ? { rotate: [0, 26, 28, 2, 0] }
                          : happyEqual
                          ? { rotate: 6 }
                          : { rotate: [4, 9, 4] }
                      }
                      transition={
                        eatingRight || eatingLeft
                          ? { duration: 0.62, times: [0, 0.3, 0.52, 0.78, 1] }
                          : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                      }
                    >
                      {/* Lower jaw green body */}
                      <path
                        d="M-6,-2 L62,-2 C70,-2 72,11 60,15 L-8,18 C-16,18 -16,-2 -6,-2 Z"
                        fill="#22C55E"
                        stroke="#14532D"
                        strokeWidth="3"
                      />
                      {/* Soft cream chin */}
                      <path d="M2,8 L56,6 C58,11 52,13 44,14 L4,15 Z" fill="#DCFCE7" />
                      {/* Pink tongue inside */}
                      <ellipse cx="26" cy="1" rx="18" ry="5" fill="#FB7185" />
                      {/* Cute rounded bottom teeth */}
                      <polygon points="10,-2 15,-10 20,-2" fill="#FFFFFF" stroke="#14532D" strokeWidth="1.8" strokeLinejoin="round" />
                      <polygon points="28,-2 33,-10 38,-2" fill="#FFFFFF" stroke="#14532D" strokeWidth="1.8" strokeLinejoin="round" />
                      <polygon points="46,-2 51,-9 56,-2" fill="#FFFFFF" stroke="#14532D" strokeWidth="1.8" strokeLinejoin="round" />
                    </motion.g>
                  </g>

                  {/* Upper Jaw + Eyes (pivots at -8, 4) */}
                  <g transform="translate(-8, 4)">
                    <motion.g
                      animate={
                        eatingRight || eatingLeft
                          ? { rotate: [0, -28, -30, -1, 0] }
                          : happyEqual
                          ? { rotate: -6 }
                          : { rotate: [-4, -9, -4] }
                      }
                      transition={
                        eatingRight || eatingLeft
                          ? { duration: 0.62, times: [0, 0.3, 0.52, 0.78, 1] }
                          : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                      }
                    >
                      {/* Upper jaw snout */}
                      <path
                        d="M-20,6 C-22,-18 -4,-28 14,-24 L64,-12 C75,-9 75,6 62,8 L-12,8 Z"
                        fill="#22C55E"
                        stroke="#14532D"
                        strokeWidth="3"
                      />
                      {/* Nostril bump */}
                      <circle cx="58" cy="-10" r="6" fill="#22C55E" stroke="#14532D" strokeWidth="2.5" />
                      <circle cx="59" cy="-10" r="2.2" fill="#14532D" />

                      {/* Cute upper white teeth */}
                      <polygon points="14,7 19,16 24,7" fill="#FFFFFF" stroke="#14532D" strokeWidth="1.8" strokeLinejoin="round" />
                      <polygon points="32,7 37,16 42,7" fill="#FFFFFF" stroke="#14532D" strokeWidth="1.8" strokeLinejoin="round" />
                      <polygon points="50,7 55,15 60,7" fill="#FFFFFF" stroke="#14532D" strokeWidth="1.8" strokeLinejoin="round" />

                      {/* Big Expressive Cartoon Eyes */}
                      <circle cx="-4" cy="-24" r="12" fill="#FFFFFF" stroke="#14532D" strokeWidth="2.8" />
                      <circle cx="14" cy="-22" r="11" fill="#FFFFFF" stroke="#14532D" strokeWidth="2.8" />
                      {happyEqual ? (
                        <>
                          <path d="M-9,-24 Q-4,-30 1,-24" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                          <path d="M9,-22 Q14,-28 19,-22" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                        </>
                      ) : (
                        <>
                          <circle cx="-1" cy="-24" r="5" fill="#0F172A" />
                          <circle cx="17" cy="-22" r="4.6" fill="#0F172A" />
                          <circle cx="1" cy="-26" r="1.8" fill="#FFFFFF" />
                          <circle cx="19" cy="-24" r="1.7" fill="#FFFFFF" />
                        </>
                      )}

                      {/* Rosy cheek */}
                      <ellipse cx="-8" cy="-4" rx="6.5" ry="4" fill="#FDA4AF" opacity="0.85" />
                    </motion.g>
                  </g>
                </g>

                {/* Sparkle Stars when solved */}
                {isCorrect && (
                  <>
                    <motion.text
                      x="18"
                      y="26"
                      fontSize="20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], opacity: 1, rotate: [0, 18, 0] }}
                      transition={{ duration: 0.45 }}
                    >
                      ✨
                    </motion.text>
                    <motion.text
                      x="124"
                      y="24"
                      fontSize="20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], opacity: 1, rotate: [0, -18, 0] }}
                      transition={{ duration: 0.45, delay: 0.08 }}
                    >
                      ⭐
                    </motion.text>
                  </>
                )}
              </svg>
            </motion.div>

            {/* Sign reveal badge below croc */}
            <div className="mt-0.5 text-center font-mono-num text-lg font-black text-emerald-800">
              {feedback ? (
                <span className="inline-flex items-center gap-1.5">
                  <span>{leftCount}</span>
                  <span className="text-amber-600 text-2xl">{correctSign}</span>
                  <span>{rightCount}</span>
                </span>
              ) : (
                <span className="text-emerald-700/80 text-xs font-sans font-bold">
                  Qaysi tomon ko&apos;p?
                </span>
              )}
            </div>
          </div>

          {/* Right Lilypad Tray */}
          <div className="rounded-2xl bg-white/85 border-2 border-emerald-200/90 px-2.5 py-3 shadow-xs">
            <CrocItemCluster
              count={rightCount}
              emoji={itemEmoji}
              bundleSize={bundleSize}
              beingEaten={eatingRight}
              eatDirection="right"
            />
          </div>
        </div>
      </div>

      {/* 3 Big Tactile Comparison Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {buttons.map(({ sign, label }) => {
          const isPicked = feedback?.picked === sign;
          const isRight = sign === correctSign;

          let cls =
            'bg-white hover:bg-emerald-50 border-slate-300 border-b-slate-400 text-slate-900 hover:border-emerald-400';
          if (feedback) {
            if (isRight) {
              cls = 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white scale-[1.02]';
            } else if (isPicked) {
              cls = 'bg-rose-600 border-rose-700 border-b-rose-800 text-white';
            } else {
              cls = 'bg-slate-100 border-slate-200 border-b-slate-300 text-slate-400';
            }
          }

          return (
            <button
              key={sign}
              type="button"
              disabled={Boolean(feedback)}
              onClick={() => onSelect(sign)}
              className={`min-h-[70px] rounded-2xl border-2 border-b-4 px-2 py-2.5 flex flex-col items-center justify-center gap-0.5 shadow-sm active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${cls}`}
            >
              <span className="font-mono-num text-3xl sm:text-4xl font-black leading-none">{sign}</span>
              <span className="text-[11px] sm:text-xs font-bold leading-tight whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// 1B. "SEHRLI TAROZI" MINI-O'YINI (Noma'lum sonni topish: ? + 3 = 8)
// -------------------------------------------------------------------------
const CoinStackSvg: React.FC<{ count: number; baseX: number; baseY: number }> = ({
  count,
  baseX,
  baseY,
}) => {
  // Neat stacked columns of shiny golden coins (max 5 per column)
  const visible = Math.min(count, 12);
  const cols = visible <= 5 ? 1 : visible <= 10 ? 2 : 3;
  const colSpacing = 22;
  const startX = baseX - ((cols - 1) * colSpacing) / 2;

  return (
    <g>
      {Array.from({ length: visible }).map((_, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cx = startX + col * colSpacing;
        const cy = baseY - row * 7.5;
        return (
          <g key={idx}>
            <ellipse cx={cx} cy={cy + 2.5} rx="10" ry="4.2" fill="#B45309" />
            <ellipse cx={cx} cy={cy} rx="10" ry="4.2" fill="#FACC15" stroke="#D97706" strokeWidth="1.2" />
            <ellipse cx={cx - 2.5} cy={cy - 1} rx="4" ry="1.4" fill="#FEF08A" opacity="0.85" />
          </g>
        );
      })}
    </g>
  );
};

const ScaleBalanceStage: React.FC<{
  round: MathRound;
  feedback: { status: 'correct' | 'wrong' | 'timeout'; picked?: string } | null;
  onSelect: (answer: string) => void;
}> = ({ round, feedback, onSelect }) => {
  const leftTotal = round.scaleData?.leftTotal ?? 7;
  const rightKnown = round.scaleData?.rightKnown ?? 4;
  const unknownValue = round.scaleData?.unknownValue ?? Math.max(1, leftTotal - rightKnown);
  const equationLabel = round.scaleData?.equationLabel ?? `${leftTotal} = ${rightKnown} + ?`;

  const pickedNum = feedback?.picked ? Number(feedback.picked) : null;
  const isSolved = feedback?.status === 'correct';
  const isWrong = feedback?.status === 'wrong';

  // Physical torque difference: negative = left pan heavier (down), 0 = balanced!
  const rightCurrentTotal = rightKnown + (pickedNum !== null && !Number.isNaN(pickedNum) ? pickedNum : 0);
  const weightDiff = rightCurrentTotal - leftTotal;
  const rawTilt = Math.max(-13, Math.min(13, weightDiff * 3.1));
  const beamAngle = isSolved ? 0 : rawTilt;

  const springPhysics = {
    type: 'spring' as const,
    stiffness: 78,
    damping: 9,
    mass: 1.25,
  };

  return (
    <div className="space-y-3.5">
      {/* Balance Scale Visual Arena */}
      <div className="relative rounded-2xl bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100/70 border-2 border-amber-200 px-3 pt-3 pb-2 overflow-hidden select-none">
        {/* Live Equation Header inside stage */}
        <div className="flex items-center justify-between gap-2 mb-1 px-1">
          <span className="text-xs font-bold text-amber-900/80">
            Sirli sandiqchaga nechta tanga kerak?
          </span>
          <span
            className={`font-mono-num text-base sm:text-lg font-black px-3 py-0.5 rounded-xl border transition-colors ${
              isSolved
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white text-slate-900 border-amber-300'
            }`}
          >
            {isSolved ? equationLabel.replace('?', String(unknownValue)) + ' ✓' : equationLabel}
          </span>
        </div>

        <svg viewBox="0 0 480 218" className="w-full h-[200px] sm:h-[220px] overflow-visible" aria-label="Sehrli tarozi">
          {/* Wooden table surface */}
          <rect x="20" y="196" width="440" height="14" rx="7" fill="#D97706" opacity="0.22" />

          {/* Scale Base & Pillar */}
          <path d="M186,202 L294,202 L282,184 L198,184 Z" fill="#92400E" stroke="#78350F" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="231" y="64" width="18" height="122" rx="6" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          {/* Decorative brass ring */}
          <rect x="225" y="174" width="30" height="12" rx="4" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />

          {/* Equilibrium Center Tick Mark */}
          <line
            x1="240"
            y1="20"
            x2="240"
            y2="34"
            stroke={isSolved ? '#16A34A' : '#94A3B8'}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {isSolved && (
            <motion.circle
              cx="240"
              cy="22"
              r="7"
              fill="#22C55E"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.35, 1] }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Pivoting Beam Group centered at (240, 64) */}
          <g transform="translate(240, 64)">
            <motion.g animate={{ rotate: beamAngle }} transition={springPhysics}>
              {/* Pointer Needle pointing UP */}
              <polygon
                points="0,-36 -6,-4 6,-4"
                fill={isSolved ? '#16A34A' : '#F59E0B'}
                stroke="#78350F"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Horizontal Brass Beam */}
              <rect
                x="-150"
                y="-7"
                width="300"
                height="14"
                rx="7"
                fill="#F59E0B"
                stroke="#78350F"
                strokeWidth="2.5"
              />
              {/* End knobs */}
              <circle cx="-146" cy="0" r="7" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
              <circle cx="146" cy="0" r="7" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />

              {/* LEFT PAN (counter-rotated to stay level) */}
              <g transform="translate(-142, 4)">
                <motion.g animate={{ rotate: -beamAngle }} transition={springPhysics}>
                  {/* Hanging Chains */}
                  <line x1="0" y1="0" x2="-46" y2="74" stroke="#92400E" strokeWidth="2.4" />
                  <line x1="0" y1="0" x2="46" y2="74" stroke="#92400E" strokeWidth="2.4" />
                  <line x1="0" y1="0" x2="0" y2="74" stroke="#B45309" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Shiny Gold Coins on Left Pan */}
                  <CoinStackSvg count={leftTotal} baseX={0} baseY={68} />

                  {/* Brass Dish */}
                  <path
                    d="M-54,74 L54,74 C48,92 -48,92 -54,74 Z"
                    fill="#F59E0B"
                    stroke="#78350F"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Count Plate under Left Dish */}
                  <rect x="-26" y="94" width="52" height="24" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
                  <text
                    x="0"
                    y="111"
                    textAnchor="middle"
                    className="font-mono-num"
                    fontSize="15"
                    fontWeight="900"
                    fill="#0F172A"
                  >
                    🪙 {leftTotal}
                  </text>
                </motion.g>
              </g>

              {/* RIGHT PAN (counter-rotated to stay level) */}
              <g transform="translate(142, 4)">
                <motion.g animate={{ rotate: -beamAngle }} transition={springPhysics}>
                  {/* Hanging Chains */}
                  <line x1="0" y1="0" x2="-48" y2="74" stroke="#92400E" strokeWidth="2.4" />
                  <line x1="0" y1="0" x2="48" y2="74" stroke="#92400E" strokeWidth="2.4" />
                  <line x1="0" y1="0" x2="0" y2="74" stroke="#B45309" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Known Coins on left side of Right Pan */}
                  <CoinStackSvg count={rightKnown} baseX={-24} baseY={68} />

                  {/* Falling Coins Animation dropping into Mystery Chest when option picked */}
                  {pickedNum !== null && !Number.isNaN(pickedNum) && (
                    <g>
                      {Array.from({ length: Math.min(pickedNum, 8) }).map((_, cIdx) => (
                        <motion.g
                          key={`drop-${pickedNum}-${cIdx}`}
                          initial={{ y: -62 - cIdx * 8, opacity: 1, scale: 1 }}
                          animate={{ y: 28, opacity: [1, 1, 0], scale: [1, 1, 0.7] }}
                          transition={{ duration: 0.45, delay: cIdx * 0.055, ease: 'easeIn' }}
                        >
                          <ellipse cx="22" cy="14" rx="8" ry="4" fill="#FACC15" stroke="#B45309" strokeWidth="1.3" />
                        </motion.g>
                      ))}
                    </g>
                  )}

                  {/* Wooden Mystery Chest "?" on right side of Right Pan */}
                  <g transform="translate(22, 54)">
                    <motion.g
                      animate={isSolved ? { scale: [1, 1.15, 1] } : isWrong ? { x: [0, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Chest Box */}
                      <rect
                        x="-21"
                        y="-16"
                        width="42"
                        height="35"
                        rx="6"
                        fill={isSolved ? '#16A34A' : '#B45309'}
                        stroke={isSolved ? '#14532D' : '#78350F'}
                        strokeWidth="2.5"
                      />
                      {/* Chest Lid Trim */}
                      <rect
                        x="-22"
                        y="-17"
                        width="44"
                        height="10"
                        rx="4"
                        fill={isSolved ? '#22C55E' : '#D97706'}
                        stroke={isSolved ? '#14532D' : '#78350F'}
                        strokeWidth="2"
                      />
                      {/* Golden clasp / "?" or solved value */}
                      <text
                        x="0"
                        y="11"
                        textAnchor="middle"
                        className="font-mono-num"
                        fontSize="19"
                        fontWeight="900"
                        fill="#FEF08A"
                      >
                        {pickedNum !== null && !Number.isNaN(pickedNum) ? pickedNum : '?'}
                      </text>
                    </motion.g>
                  </g>

                  {/* Brass Dish */}
                  <path
                    d="M-56,74 L56,74 C50,92 -50,92 -56,74 Z"
                    fill="#F59E0B"
                    stroke="#78350F"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Count Plate under Right Dish */}
                  <rect
                    x="-34"
                    y="94"
                    width="68"
                    height="24"
                    rx="8"
                    fill={isSolved ? '#DCFCE7' : '#FFFFFF'}
                    stroke={isSolved ? '#16A34A' : '#D97706'}
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="111"
                    textAnchor="middle"
                    className="font-mono-num"
                    fontSize="14"
                    fontWeight="900"
                    fill={isSolved ? '#14532D' : '#0F172A'}
                  >
                    {pickedNum !== null && !Number.isNaN(pickedNum)
                      ? `${rightKnown} + ${pickedNum}`
                      : `${rightKnown} + ?`}
                  </text>
                </motion.g>
              </g>
            </motion.g>

            {/* Center Brass Pivot Medallion */}
            <circle cx="0" cy="0" r="12" fill="#FDE047" stroke="#78350F" strokeWidth="3" />
            <circle cx="0" cy="0" r="4.5" fill="#92400E" />
          </g>

          {/* Celebration Sparkles on Balance */}
          {isSolved && (
            <>
              <motion.text
                x="194"
                y="42"
                fontSize="20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ✨
              </motion.text>
              <motion.text
                x="266"
                y="42"
                fontSize="20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                transition={{ delay: 0.28 }}
              >
                ⭐
              </motion.text>
              <motion.text
                x="240"
                y="150"
                textAnchor="middle"
                fontSize="14"
                fontWeight="900"
                fill="#15803D"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                MUVOZANAT!
              </motion.text>
            </>
          )}
        </svg>
      </div>

      {/* 4 Big Number Option Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {round.options.map((opt) => {
          const isPicked = feedback?.picked === opt;
          const isRight = opt === round.correctAnswer;

          let cls =
            'bg-white hover:bg-amber-50 border-amber-300 border-b-amber-500 text-slate-900';
          if (feedback) {
            if (isRight) {
              cls = 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white scale-[1.03]';
            } else if (isPicked) {
              cls = 'bg-rose-600 border-rose-700 border-b-rose-800 text-white';
            } else {
              cls = 'bg-slate-100 border-slate-200 border-b-slate-300 text-slate-400';
            }
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={Boolean(feedback)}
              onClick={() => onSelect(opt)}
              className={`min-h-[60px] rounded-2xl border-2 border-b-4 font-mono-num text-2xl sm:text-3xl font-black shadow-sm active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// 1C. "MEVA TERISH VA SAVATGA SOLISH" MINI-O'YINI (Qo'shish va ayirish)
// -------------------------------------------------------------------------
const TREE_APPLE_SLOTS: { x: number; y: number }[] = [
  { x: 162, y: 82 },
  { x: 215, y: 62 },
  { x: 268, y: 58 },
  { x: 320, y: 68 },
  { x: 368, y: 88 },
  { x: 138, y: 118 },
  { x: 192, y: 106 },
  { x: 245, y: 98 },
  { x: 298, y: 106 },
  { x: 348, y: 122 },
  { x: 170, y: 142 },
  { x: 226, y: 138 },
  { x: 282, y: 140 },
  { x: 332, y: 148 },
];

const BASKET_APPLE_SLOTS: { x: number; y: number }[] = [
  { x: 228, y: 220 },
  { x: 256, y: 220 },
  { x: 284, y: 220 },
  { x: 214, y: 212 },
  { x: 242, y: 210 },
  { x: 270, y: 210 },
  { x: 298, y: 212 },
  { x: 228, y: 202 },
  { x: 256, y: 201 },
  { x: 284, y: 202 },
  { x: 242, y: 193 },
  { x: 270, y: 193 },
  { x: 216, y: 197 },
  { x: 296, y: 197 },
];

const AppleSvgGlyph: React.FC<{ variant: 'red' | 'yellow'; badge?: number | null }> = ({
  variant,
  badge,
}) => {
  const fill = variant === 'red' ? '#EF4444' : '#FACC15';
  const stroke = variant === 'red' ? '#991B1B' : '#B45309';
  const shine = variant === 'red' ? '#FCA5A5' : '#FEF9C3';

  return (
    <g>
      {/* Stem */}
      <path d="M0,-14 Q2,-21 5,-22" fill="none" stroke="#78350F" strokeWidth="2.6" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M2,-18 C9,-24 16,-20 13,-13 C9,-11 4,-14 2,-18 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.4" />
      {/* Apple Body */}
      <path
        d="M0,-12 C-10,-16 -17,-6 -15,5 C-13,15 -5,18 0,15 C5,18 13,15 15,5 C17,-6 10,-16 0,-12 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.2"
      />
      {/* Highlight */}
      <ellipse cx="-6" cy="-4" rx="3.2" ry="5.5" transform="rotate(-18 -6 -4)" fill={shine} opacity="0.85" />
      {badge !== null && badge !== undefined && (
        <g transform="translate(0, 2)">
          <circle cx="0" cy="0" r="9.5" fill="#FFFFFF" stroke={stroke} strokeWidth="2" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            className="font-mono-num"
            fontSize="11.5"
            fontWeight="900"
            fill="#0F172A"
          >
            {badge}
          </text>
        </g>
      )}
    </g>
  );
};

const FruitBasketStage: React.FC<{
  round: MathRound;
  feedback: { status: 'correct' | 'wrong' | 'timeout'; picked?: string } | null;
  onSelect: (answer: string) => void;
}> = ({ round, feedback, onSelect }) => {
  const mode = round.fruitData?.mode ?? 'add';
  const a = round.fruitData?.a ?? 3;
  const b = round.fruitData?.b ?? 2;
  const subtractEffect = round.fruitData?.subtractEffect ?? 'bird';

  const totalToPick = mode === 'add' ? a + b : a;
  const remainingTarget = mode === 'subtract' ? Math.max(0, a - b) : a + b;

  // Mode 'add': indices of plucked apples in exact order plucked
  const [pluckedOrder, setPluckedOrder] = useState<number[]>([]);
  const [lastPopCount, setLastPopCount] = useState<number | null>(null);

  // Mode 'subtract': whether bird/wind has taken away `b` apples + tap-to-count helper
  const [takenAway, setTakenAway] = useState(false);
  const [replayNonce, setReplayNonce] = useState(0);
  const [countedIndices, setCountedIndices] = useState<number[]>([]);

  // Trigger subtraction bird/wind animation cleanly
  useEffect(() => {
    if (mode !== 'subtract') return;
    setTakenAway(false);
    setCountedIndices([]);
    const t = window.setTimeout(() => {
      soundEngine.playWindWhoosh();
      setTakenAway(true);
    }, 520);
    return () => window.clearTimeout(t);
  }, [mode, replayNonce, a, b]);

  // Build apple descriptors
  const apples = useMemo(() => {
    const count = Math.min(totalToPick, TREE_APPLE_SLOTS.length);
    return Array.from({ length: count }).map((_, idx) => ({
      id: idx,
      variant: (mode === 'add' && idx >= a ? 'yellow' : 'red') as 'red' | 'yellow',
      treePos: TREE_APPLE_SLOTS[idx],
      isTakenInSubtract: mode === 'subtract' && idx >= count - b,
    }));
  }, [totalToPick, mode, a, b]);

  const handlePluckApple = (appleId: number) => {
    if (feedback) return;
    if (mode === 'add') {
      if (pluckedOrder.includes(appleId)) return;
      const next = [...pluckedOrder, appleId];
      const nextCount = next.length;
      setPluckedOrder(next);
      setLastPopCount(nextCount);
      soundEngine.playFruitPluck(nextCount);

      if (nextCount === apples.length) {
        // Every apple is now in the basket! Celebrate & award round win
        window.setTimeout(() => {
          onSelect(String(a + b));
        }, 280);
      }
    } else if (takenAway) {
      // Optional interactive touch-counting helper on remaining tree apples!
      if (countedIndices.includes(appleId)) return;
      const next = [...countedIndices, appleId];
      setCountedIndices(next);
      soundEngine.playFruitPluck(next.length);
    }
  };

  const handleReplaySubtract = () => {
    if (feedback) return;
    setReplayNonce((n) => n + 1);
  };

  const isSolved = feedback?.status === 'correct';

  return (
    <div className="space-y-3.5">
      {/* Sunlit Orchard Stage */}
      <div className="relative rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 border-2 border-emerald-200 overflow-hidden select-none">
        {/* Top strip inside orchard */}
        <div className="flex items-center justify-between gap-2 px-3.5 pt-2.5">
          <div className="text-xs font-bold text-emerald-950/85">
            {mode === 'add' ? (
              <span>
                🍎 {a} ta qizil + 🟡 {b} ta sariq — har birini bosib savatga ter!
              </span>
            ) : (
              <span>
                Daraxtda {a} ta olma bor edi, {b} tasi ketdi. Qolganini sana!
              </span>
            )}
          </div>

          {mode === 'subtract' && !feedback && (
            <button
              type="button"
              onClick={handleReplaySubtract}
              className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white border border-emerald-300 text-xs font-bold text-emerald-800 inline-flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Qayta ko&apos;rish
            </button>
          )}
        </div>

        <svg viewBox="0 0 520 260" className="w-full h-[230px] sm:h-[252px] overflow-visible" aria-label="Mevali daraxt va savat">
          {/* Smiling Sun */}
          <circle cx="52" cy="40" r="22" fill="#FDE047" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="46" cy="37" r="2.2" fill="#92400E" />
          <circle cx="58" cy="37" r="2.2" fill="#92400E" />
          <path d="M46,45 Q52,50 58,45" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />

          {/* Soft Clouds */}
          <g fill="#FFFFFF" opacity="0.88">
            <ellipse cx="440" cy="38" rx="28" ry="13" />
            <ellipse cx="422" cy="42" rx="18" ry="10" />
            <ellipse cx="458" cy="42" rx="18" ry="10" />
          </g>

          {/* Rolling Grassy Meadow */}
          <path d="M0,218 Q130,194 260,210 T520,214 L520,260 L0,260 Z" fill="#4ADE80" />
          <path d="M0,232 Q180,214 360,228 T520,226 L520,260 L0,260 Z" fill="#22C55E" />

          {/* Tree Trunk & Branches */}
          <path
            d="M236,222 C240,182 242,150 242,126 L278,126 C278,152 280,184 286,222 C270,226 250,226 236,222 Z"
            fill="#92400E"
            stroke="#78350F"
            strokeWidth="2.5"
          />
          <path d="M244,148 L195,120" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
          <path d="M276,146 L325,118" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />

          {/* Lush Layered Green Canopy */}
          <g>
            <ellipse cx="176" cy="116" rx="68" ry="52" fill="#16A34A" />
            <ellipse cx="344" cy="118" rx="68" ry="52" fill="#16A34A" />
            <ellipse cx="260" cy="86" rx="94" ry="62" fill="#22C55E" />
            <ellipse cx="204" cy="96" rx="64" ry="46" fill="#22C55E" />
            <ellipse cx="318" cy="98" rx="64" ry="46" fill="#22C55E" />
            {/* Sunlit leaf highlights */}
            <ellipse cx="222" cy="64" rx="44" ry="24" fill="#4ADE80" opacity="0.55" />
            <ellipse cx="300" cy="70" rx="38" ry="20" fill="#4ADE80" opacity="0.45" />
          </g>

          {/* Animated Bird or Wind Swirl for Subtraction */}
          {mode === 'subtract' && takenAway && subtractEffect === 'bird' && (
            <motion.g
              key={`bird-${replayNonce}`}
              initial={{ x: -60, y: 78, opacity: 1 }}
              animate={{ x: [20, 260, 560], y: [88, 62, 30], opacity: [1, 1, 0] }}
              transition={{ duration: 1.35, ease: 'easeInOut' }}
            >
              {/* Cute Cartoon Blue Bird */}
              <ellipse cx="0" cy="0" rx="18" ry="12" fill="#0EA5E9" stroke="#0369A1" strokeWidth="2.2" />
              <circle cx="14" cy="-6" r="9" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.2" />
              <polygon points="22,-7 31,-4 22,-1" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
              <circle cx="16" cy="-8" r="2.2" fill="#0F172A" />
              <motion.path
                d="M-6,-4 Q-16,-24 4,-12"
                fill="#0284C7"
                stroke="#0369A1"
                strokeWidth="2"
                style={{ transformOrigin: '0px -8px' }}
                animate={{ rotate: [-18, 22, -18] }}
                transition={{ duration: 0.22, repeat: Infinity }}
              />
            </motion.g>
          )}

          {mode === 'subtract' && takenAway && subtractEffect === 'wind' && (
            <motion.g
              key={`wind-${replayNonce}`}
              initial={{ x: -90, opacity: 0 }}
              animate={{ x: [0, 120, 240], opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.25, ease: 'easeOut' }}
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            >
              <path d="M90,78 C150,70 210,82 260,64 C276,58 272,44 256,48" />
              <path d="M110,116 C175,108 245,120 300,104 C318,98 314,84 298,88" />
            </motion.g>
          )}

          {/* Subtraction "-b" floating pill indicator */}
          {mode === 'subtract' && takenAway && (
            <motion.g
              key={`sub-ind-${replayNonce}`}
              initial={{ opacity: 0, x: 350, y: 84 }}
              animate={{ opacity: [0, 1, 1], x: 424, y: 74 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <rect x="-36" y="-16" width="72" height="32" rx="12" fill="#FFF1F2" stroke="#FB7185" strokeWidth="2" />
              <text
                x="0"
                y="6"
                textAnchor="middle"
                className="font-mono-num"
                fontSize="16"
                fontWeight="900"
                fill="#BE123C"
              >
                −{b} 🍎
              </text>
            </motion.g>
          )}

          {/* Interactive Apples */}
          {apples.map((apple, idx) => {
            const pluckedPosIdx = pluckedOrder.indexOf(apple.id);
            const isPlucked = pluckedPosIdx !== -1;
            const basketTarget =
              BASKET_APPLE_SLOTS[Math.max(0, pluckedPosIdx) % BASKET_APPLE_SLOTS.length];
            const isFlyingOff = mode === 'subtract' && takenAway && apple.isTakenInSubtract;
            const countedBadgeIdx = countedIndices.indexOf(apple.id);
            const countBadge =
              mode === 'add'
                ? isPlucked
                  ? pluckedPosIdx + 1
                  : null
                : countedBadgeIdx !== -1
                ? countedBadgeIdx + 1
                : null;

            const canClick =
              !feedback &&
              ((mode === 'add' && !isPlucked) ||
                (mode === 'subtract' && takenAway && !apple.isTakenInSubtract));

            return (
              <motion.g
                key={`${apple.id}-${replayNonce}`}
                initial={{
                  x: apple.treePos.x,
                  y: apple.treePos.y,
                  scale: 0.2,
                  opacity: 0,
                }}
                animate={
                  isPlucked
                    ? {
                        x: basketTarget.x,
                        y: basketTarget.y,
                        scale: 0.86,
                        opacity: 1,
                        rotate: (pluckedPosIdx % 2 === 0 ? 1 : -1) * 8,
                      }
                    : isFlyingOff
                    ? {
                        x: apple.treePos.x + 210,
                        y: apple.treePos.y - 46 - (idx % 3) * 14,
                        scale: 0.55,
                        opacity: 0,
                        rotate: 38,
                      }
                    : {
                        x: apple.treePos.x,
                        y: apple.treePos.y,
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                      }
                }
                transition={
                  isPlucked
                    ? { type: 'spring', stiffness: 170, damping: 16 }
                    : isFlyingOff
                    ? { duration: 0.85, delay: (idx - (apples.length - b)) * 0.08, ease: 'easeIn' }
                    : { delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 18 }
                }
                whileHover={canClick ? { scale: 1.18 } : undefined}
                whileTap={canClick ? { scale: 0.9 } : undefined}
                onClick={() => canClick && handlePluckApple(apple.id)}
                style={{ cursor: canClick ? 'pointer' : 'default' }}
              >
                {/* Generous invisible hit circle for 6-7 year olds' touch/mouse */}
                <circle cx="0" cy="0" r="24" fill="transparent" />
                <AppleSvgGlyph variant={apple.variant} badge={countBadge} />
              </motion.g>
            );
          })}

          {/* Woven Wicker Basket (front layer so plucked apples sit snugly inside!) */}
          {mode === 'add' && (
            <g transform="translate(256, 224)">
              <motion.g
                animate={
                  isSolved
                    ? { scale: [1, 1.09, 1] }
                    : lastPopCount !== null
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.25 }}
              >
                {/* Basket Front Rim */}
                <path
                  d="M-64,-8 L64,-8 L52,28 C48,34 -48,34 -52,28 Z"
                  fill="#D97706"
                  stroke="#78350F"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Wicker weave lines */}
                <line x1="-58" y1="6" x2="58" y2="6" stroke="#92400E" strokeWidth="2" />
                <line x1="-54" y1="18" x2="54" y2="18" stroke="#92400E" strokeWidth="2" />
                <line x1="-30" y1="-8" x2="-24" y2="30" stroke="#92400E" strokeWidth="2" />
                <line x1="0" y1="-8" x2="0" y2="32" stroke="#92400E" strokeWidth="2" />
                <line x1="30" y1="-8" x2="24" y2="30" stroke="#92400E" strokeWidth="2" />
                {/* Top rim lip */}
                <rect x="-68" y="-14" width="136" height="11" rx="5.5" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />

                {/* Basket Live Counter Tag */}
                <rect x="-46" y="-2" width="92" height="25" rx="9" fill="#FFFFFF" stroke="#78350F" strokeWidth="2" />
                <text
                  x="0"
                  y="15"
                  textAnchor="middle"
                  className="font-mono-num"
                  fontSize="14"
                  fontWeight="900"
                  fill={isSolved ? '#15803D' : '#0F172A'}
                >
                  Savatda: {pluckedOrder.length}
                </text>
              </motion.g>
            </g>
          )}

          {/* Floating Count Pop Bubble ("1!", "2!", "3!"...) when plucking in add mode */}
          <AnimatePresence>
            {mode === 'add' && lastPopCount !== null && (
              <motion.g
                key={`pop-${lastPopCount}`}
                initial={{ x: 256, y: 186, scale: 0.4, opacity: 0 }}
                animate={{ x: 256, y: 158, scale: [0.6, 1.25, 1], opacity: [0, 1, 1] }}
                exit={{ opacity: 0, y: 145 }}
                transition={{ duration: 0.38 }}
              >
                <circle cx="0" cy="0" r="20" fill="#FACC15" stroke="#B45309" strokeWidth="2.5" />
                <text
                  x="0"
                  y="7"
                  textAnchor="middle"
                  className="font-mono-num"
                  fontSize="20"
                  fontWeight="900"
                  fill="#0F172A"
                >
                  {lastPopCount}
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Celebration Stars on Win */}
          {isSolved && (
            <>
              <motion.text
                x="146"
                y="216"
                fontSize="24"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.35, 1] }}
              >
                ⭐
              </motion.text>
              <motion.text
                x="352"
                y="216"
                fontSize="24"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.35, 1] }}
                transition={{ delay: 0.08 }}
              >
                ✨
              </motion.text>
            </>
          )}
        </svg>
      </div>

      {/* Bottom Interaction Zone */}
      {mode === 'add' ? (
        <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
          <div className="font-mono-num text-lg sm:text-xl font-black text-emerald-950">
            {a} + {b} ={' '}
            <span className={isSolved ? 'text-emerald-600' : 'text-amber-600'}>
              {pluckedOrder.length === a + b ? `${a + b} ✓` : pluckedOrder.length > 0 ? pluckedOrder.length : '?'}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-800">
            {pluckedOrder.length < apples.length
              ? `Yana ${apples.length - pluckedOrder.length} ta olmani bosib uzing!`
              : 'Hamma olmalar savatga terildi!'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {round.options.map((opt) => {
            const isPicked = feedback?.picked === opt;
            const isRight = opt === round.correctAnswer;

            let cls =
              'bg-white hover:bg-emerald-50 border-emerald-300 border-b-emerald-500 text-slate-900';
            if (feedback) {
              if (isRight) {
                cls = 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white scale-[1.03]';
              } else if (isPicked) {
                cls = 'bg-rose-600 border-rose-700 border-b-rose-800 text-white';
              } else {
                cls = 'bg-slate-100 border-slate-200 border-b-slate-300 text-slate-400';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={Boolean(feedback) || !takenAway}
                onClick={() => onSelect(opt)}
                className={`min-h-[60px] rounded-2xl border-2 border-b-4 font-mono-num text-2xl sm:text-3xl font-black shadow-sm active:scale-95 transition-all cursor-pointer disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* Subtle screen-reader / status text for subtract */}
      {mode === 'subtract' && !feedback && takenAway && (
        <div className="text-center text-xs font-semibold text-slate-500">
          Maslahat: Daraxtda qolgan olmalarning ustiga bosib bittadan sanashingiz mumkin ({countedIndices.length}/{remainingTarget} sanaldi)
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------------------
// 1D. UNIFIED MATH MINI-GAME CONTROLLER (Dispatches all 12 Grade 1 gameTypes)
// -------------------------------------------------------------------------
const GAME_TYPE_TITLES: Record<MathGameType, string> = {
  room_sort: 'Tartibli Xona (Sehrli Javon)',
  croc_compare: "Ochko'z Timsohcha",
  tangram: 'Shakllar Konstruktori',
  fruit_basket: "Bog'bon — Meva Terish",
  scale_balance: 'Sehrli Tarozi',
  two_pockets: "Ikkita Cho'ntak",
  train_tens: 'Aqlli Poyezd',
  magic_lock: 'Sehrli Qulf',
  bridge_tens: "Ko'prik Qurish",
  bank_tens: 'Maktab Banki',
  tower_blocks: 'Rangli Minora',
  magic_chain: 'Sehrli Zanjir',
};

const GAME_TYPE_DEFAULT_TIPS: Record<MathGameType, string> = {
  room_sort: "Buyumni kerakli joyga sudrab olib boring yoki joyini bosing!",
  croc_compare: "Timsohcha ko'p tomonga og'iz ochadi — to'g'ri belgini tanlang!",
  tangram: "Chala rasmga mos keladigan geometrik shaklni tanlang!",
  fruit_basket: "Daraxtdagi olmalarni bosib tering yoki qolganini sanang!",
  scale_balance: "Tarozi tekislanishi uchun sandiqchaga kerakli sonni tanlang!",
  two_pockets: "Cho'ntaklar o'rnini almashtirib ko'ring va jami sonini toping!",
  train_tens: "Katta 10 talik vagon va kichik 1 talik o'rindiqlarni ulab son yasang!",
  magic_lock: "Avval qulflangan sandiq ichini oching, so'ng tashqarisini yeching!",
  bridge_tens: "Avval ko'prikni 10 ta taxta qilib to'ldiring, keyin qolganini qo'shing!",
  bank_tens: "10 talik tangalarni sanab peshtaxtaga qo'ying va xarid qiling!",
  tower_blocks: "Moviy o'nliklar va yashil birliklar ustunini to'g'ri balandlikka ko'taring!",
  magic_chain: "Avval qo'shilsa 10 bo'ladigan 2 ta do'st sonni bosib bog'lang!",
};

const MathMiniGame: React.FC<{
  rounds: MathRound[];
  grade: number;
  gameType?: MathGameType;
  onFinish: (correctCount: number) => void;
}> = ({ rounds, grade, gameType, onFinish }) => {
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
  const [confettiKey, setConfettiKey] = useState(0);
  const [teacherNote, setTeacherNote] = useState<{ kind: 'praise' | 'hint'; text: string } | null>(null);
  const [blocks, setBlocks] = useState<FloatingBlock[]>([]);
  const blocksRef = useRef<FloatingBlock[]>([]);
  const advanceTimerRef = useRef<number | null>(null);

  const current = rounds[roundIdx];
  const roundKind = current.kind ?? gameType ?? 'moving_blocks';
  const isInteractiveVisual = roundKind !== 'moving_blocks';

  // Clear pending advance timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  // Reset per round & initialize floating blocks when moving_blocks
  useEffect(() => {
    setTimeLeft(current.timeLimitSec);
    setFeedback(null);
    setTeacherNote(null);

    if (roundKind !== 'moving_blocks') {
      blocksRef.current = [];
      setBlocks([]);
      return;
    }

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
  }, [roundIdx, current, roundKind, isGrade1, speedScale]);

  // Smooth drifting animation loop (only for moving_blocks)
  useEffect(() => {
    if (feedback || roundKind !== 'moving_blocks') return;
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
  }, [feedback, roundIdx, roundKind, maxX, maxY]);

  // Countdown timer (only for timed moving_blocks rounds; Grade 1 visual games stay calm & stress-free)
  useEffect(() => {
    if (feedback || isInteractiveVisual) return;
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
  }, [feedback, roundIdx, isInteractiveVisual]);

  const advance = (nextCorrect: number, delayMs: number) => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
    }
    advanceTimerRef.current = window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, delayMs);
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

  const handleStepSuccess = (msg?: string) => {
    setConfettiKey((k) => k + 1);
    if (msg) {
      setTeacherNote({ kind: 'praise', text: msg });
    }
  };

  const handleStepMistake = (teacherHint: string) => {
    setTeacherNote({ kind: 'hint', text: teacherHint });
  };

  const handlePick = (opt: string) => {
    if (feedback) return;
    const isCorrect = opt === current.correctAnswer;
    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;

    if (isCorrect) {
      if (roundKind === 'croc_compare') {
        soundEngine.playCrocChomp();
      } else if (roundKind === 'scale_balance') {
        soundEngine.playScaleBalance();
      } else if (roundKind !== 'bank_tens') {
        soundEngine.playCorrect();
      }
      setConfettiKey((k) => k + 1);
      setTeacherNote(null);
      setCorrectCount(nextCorrect);
      setFeedback({ status: 'correct', picked: opt });
    } else {
      soundEngine.playWrong();
      setTeacherNote({ kind: 'hint', text: current.hint });
      setFeedback({ status: 'wrong', picked: opt });
    }

    const delayMs = isInteractiveVisual ? (isCorrect ? 1550 : 1650) : 1150;
    advance(nextCorrect, delayMs);
  };

  const roundModeTitle =
    roundKind === 'moving_blocks'
      ? "Harakatlanuvchi to'g'ri javob blokini bosing!"
      : GAME_TYPE_TITLES[roundKind];

  const defaultIdleTip =
    roundKind === 'moving_blocks'
      ? "Harakatlanuvchi bloklardan to'g'ri javobni tanlang."
      : roundKind === 'fruit_basket' && current.fruitData?.mode === 'subtract'
      ? "Daraxtda qolgan olmalarni sanab, to'g'ri javobni bosing!"
      : GAME_TYPE_DEFAULT_TIPS[roundKind];

  const timePercent = Math.max(0, (timeLeft / current.timeLimitSec) * 100);

  return (
    <div className="space-y-3.5 relative">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>
          Raund {roundIdx + 1} / {rounds.length} · {roundModeTitle}
        </span>
        {!isInteractiveVisual && (
          <span className="inline-flex items-center gap-1.5 font-mono-num text-blue-700">
            <Clock className="w-4 h-4" />
            {Math.ceil(timeLeft)} soniya
          </span>
        )}
      </div>

      {/* Timer bar (moving_blocks only) */}
      {!isInteractiveVisual && (
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              timePercent < 30 ? 'bg-rose-500' : 'bg-blue-600'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
      )}

      {/* Question Prompt Banner */}
      <div className="bg-slate-900 text-white rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 text-center">
        <div
          className={`font-display font-bold tracking-tight text-balance ${
            isInteractiveVisual ? 'text-lg sm:text-xl leading-snug' : 'font-mono-num text-2xl sm:text-3xl'
          }`}
        >
          {current.prompt}
        </div>
        <div className="text-xs text-slate-300 mt-1">Maslahat: {current.hint}</div>
      </div>

      {/* Interactive Stage Container with Per-Step Confetti Overlay */}
      <div className="relative">
        <StepConfettiBurst burstKey={confettiKey} />

        {roundKind === 'room_sort' && (
          <RoomSortStage
            key={`room-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
            onStepSuccess={handleStepSuccess}
            onStepMistake={handleStepMistake}
          />
        )}

        {roundKind === 'croc_compare' && (
          <CrocCompareStage
            key={`croc-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
          />
        )}

        {roundKind === 'tangram' && (
          <TangramStage
            key={`tangram-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
            onStepSuccess={handleStepSuccess}
            onStepMistake={handleStepMistake}
          />
        )}

        {roundKind === 'fruit_basket' && (
          <FruitBasketStage
            key={`fruit-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
          />
        )}

        {roundKind === 'scale_balance' && (
          <ScaleBalanceStage
            key={`scale-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
          />
        )}

        {roundKind === 'two_pockets' && (
          <TwoPocketsStage
            key={`pockets-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
            onStepSuccess={handleStepSuccess}
            onStepMistake={handleStepMistake}
          />
        )}

        {roundKind === 'train_tens' && (
          <TrainTensStage
            key={`train-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
            onStepSuccess={handleStepSuccess}
            onStepMistake={handleStepMistake}
          />
        )}

        {roundKind === 'magic_lock' && (
          <MagicLockStage
            key={`lock-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
            onStepSuccess={handleStepSuccess}
            onStepMistake={handleStepMistake}
          />
        )}

        {roundKind === 'bridge_tens' && (
          <BridgeTensStage
            key={`bridge-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
            onStepSuccess={handleStepSuccess}
            onStepMistake={handleStepMistake}
          />
        )}

        {roundKind === 'bank_tens' && (
          <BankTensStage
            key={`bank-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
            onStepSuccess={handleStepSuccess}
            onStepMistake={handleStepMistake}
          />
        )}

        {roundKind === 'tower_blocks' && (
          <TowerBlocksStage
            key={`tower-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
            onStepSuccess={handleStepSuccess}
            onStepMistake={handleStepMistake}
          />
        )}

        {roundKind === 'magic_chain' && (
          <MagicChainStage
            key={`chain-${roundIdx}`}
            round={current}
            feedback={feedback}
            onSelect={handlePick}
            onStepSuccess={handleStepSuccess}
            onStepMistake={handleStepMistake}
          />
        )}

        {roundKind === 'moving_blocks' && (
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
        )}
      </div>

      {/* Round Feedback & Warm Teacher Guidance (reserved height prevents modal shrinking) */}
      <div
        className={`min-h-[54px] rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2.5 transition-colors ${
          feedback?.status === 'correct'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : feedback?.status === 'wrong' || feedback?.status === 'timeout'
            ? 'bg-amber-50 text-amber-950 border border-amber-300'
            : teacherNote?.kind === 'hint'
            ? 'bg-amber-50 text-amber-950 border border-amber-300'
            : teacherNote?.kind === 'praise'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-slate-50 text-slate-600 border border-slate-200/80'
        }`}
      >
        {feedback?.status === 'correct' ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Barakalla, bilimdonim! To&apos;g&apos;ri javob (+{POINTS_PER_CORRECT} ball)</span>
          </>
        ) : feedback?.status === 'timeout' ? (
          <>
            <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Vaqt tugadi! To&apos;g&apos;ri javob: {current.correctAnswer}</span>
          </>
        ) : feedback?.status === 'wrong' ? (
          <>
            <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Ustoz maslahati: {current.hint} (To&apos;g&apos;ri javob: {current.correctAnswer})
            </span>
          </>
        ) : teacherNote?.kind === 'hint' ? (
          <span>💛 Ustoz maslahati: {teacherNote.text}</span>
        ) : teacherNote?.kind === 'praise' ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{teacherNote.text}</span>
          </>
        ) : (
          <span>{defaultIdleTip}</span>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 2. ENGLISH MINI-GAME: Grade 1 Interactive Audio-Visual + Grades 2-11 Match/Fill
// =========================================================================
const EnglishMiniGame: React.FC<{
  rounds: EnglishRound[];
  englishGameType?: EnglishGameType;
  studentName?: string;
  onFinish: (correctCount: number) => void;
}> = ({ rounds, englishGameType, studentName, onFinish }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedUz, setSelectedUz] = useState<string | null>(null);
  const [matchedUz, setMatchedUz] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [mistakesInMatch, setMistakesInMatch] = useState(0);
  const [fillResult, setFillResult] = useState<{ picked: string; ok: boolean } | null>(null);
  const [interactiveSolved, setInteractiveSolved] = useState(false);
  const [teacherHint, setTeacherHint] = useState<string | null>(null);
  const [stepPraise, setStepPraise] = useState<string | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);

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
    setInteractiveSolved(false);
    setTeacherHint(null);
    setStepPraise(null);
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

  const handleInteractiveSolve = () => {
    if (interactiveSolved) return;
    const nextCorrect = correctCount + 1;
    setInteractiveSolved(true);
    setTeacherHint(null);
    setStepPraise(null);
    setCorrectCount(nextCorrect);
    setConfettiKey((k) => k + 1);
    soundEngine.playCorrect();

    window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1900);
  };

  const handleStepSuccess = (message?: string) => {
    setTeacherHint(null);
    setConfettiKey((k) => k + 1);
    if (message) {
      setStepPraise(message);
    }
  };

  const handleStepMistake = (hint: string) => {
    setStepPraise(null);
    setTeacherHint(hint);
  };

  const handleSelectEn = (enWord: string) => {
    if (current.kind !== 'match' || !selectedUz) return;
    speakEnglish(enWord);
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
    speakEnglish(opt);
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

  if (current.kind !== 'match' && current.kind !== 'fill') {
    const resolvedKind = current.kind;
    const stageProps = {
      round: current,
      solved: interactiveSolved,
      studentName,
      onSolve: handleInteractiveSolve,
      onStepSuccess: handleStepSuccess,
      onStepMistake: handleStepMistake,
    };

    return (
      <div className="relative space-y-4">
        <StepConfettiBurst burstKey={confettiKey} />

        {/* Clean Top Metadata Line */}
        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-600">
          <span>
            Raund {roundIdx + 1} / {rounds.length} ·{' '}
            {ENGLISH_GAME_TITLES[resolvedKind] ??
              (englishGameType ? ENGLISH_GAME_TITLES[englishGameType] : undefined) ??
              "Ingliz tili o'yini"}
          </span>
          <span className="font-mono-num text-emerald-700 font-bold">
            +{correctCount * POINTS_PER_CORRECT} ball
          </span>
        </div>

        {/* Kid-Friendly Instruction + Optional Uzbek Phonetic Listen Cue */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          <p className="text-sm sm:text-base font-bold text-slate-800">{current.instruction}</p>
          {(current.speakUzbek || current.translation) && (
            <button
              type="button"
              onClick={() =>
                speakUzbek(current.speakUzbek ?? current.translation, {
                  subtitleText: current.translation,
                })
              }
              className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold inline-flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
              title="O'zbekcha tushuntirishni eshitish"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>O&apos;zbekcha</span>
            </button>
          )}
        </div>

        {/* Bespoke Interactive English Stage */}
        <div key={`${resolvedKind}-${roundIdx}`}>
          {resolvedKind === 'greetings_club' && <GreetingsClubStage {...stageProps} />}
          {resolvedKind === 'rainbow_paint' && <RainbowPaintStage {...stageProps} />}
          {resolvedKind === 'backpack_pack' && <BackpackPackStage {...stageProps} />}
          {resolvedKind === 'toy_box' && <ToyBoxStage {...stageProps} />}
          {resolvedKind === 'family_album' && <FamilyAlbumStage {...stageProps} />}
          {resolvedKind === 'house_builder' && <HouseBuilderStage {...stageProps} />}
          {resolvedKind === 'face_maker' && <FaceMakerStage {...stageProps} />}
          {resolvedKind === 'picnic_basket' && <PicnicBasketStage {...stageProps} />}
          {resolvedKind === 'superhero_actions' && <SuperheroActionsStage {...stageProps} />}
          {resolvedKind === 'safari_animals' && <SafariAnimalsStage {...stageProps} />}
        </div>

        {/* Reserved Cheerful Praise / Teacher Hint Box */}
        <div
          className={`min-h-[76px] rounded-2xl px-4 py-3 text-sm flex items-center gap-2.5 transition-colors ${
            interactiveSolved
              ? 'bg-emerald-50 text-emerald-950 border-2 border-emerald-300'
              : teacherHint
              ? 'bg-amber-50 text-amber-950 border-2 border-amber-300'
              : stepPraise
              ? 'bg-sky-50 text-sky-950 border border-sky-200'
              : 'bg-slate-50 text-slate-600 border border-slate-200/80'
          }`}
        >
          {interactiveSolved ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="leading-snug">
                <div className="font-display font-extrabold text-emerald-900">
                  {current.praiseText} (+{POINTS_PER_CORRECT} ball)
                </div>
                <div className="text-xs font-medium mt-0.5 text-emerald-800">
                  {current.translation}
                </div>
              </div>
            </>
          ) : teacherHint ? (
            <>
              <span className="text-2xl leading-none shrink-0" aria-hidden="true">👩‍🏫</span>
              <div className="leading-snug">
                <div className="text-xs font-extrabold text-amber-800">Teacher Malika maslahati:</div>
                <div className="text-xs sm:text-sm font-semibold text-amber-950 mt-0.5">
                  {teacherHint}
                </div>
              </div>
            </>
          ) : stepPraise ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
              <span className="font-bold text-xs sm:text-sm">{stepPraise}</span>
            </>
          ) : (
            <span className="text-xs sm:text-sm font-medium">
              Listen &amp; Repeat: Har bir inglizcha so&apos;zni bosib tinglang va takrorlang!
            </span>
          )}
        </div>
      </div>
    );
  }

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
          <div className="min-h-[116px] bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col justify-center text-center">
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
  csGameType?: CsGameType;
  onFinish: (correctCount: number) => void;
}> = ({ rounds, csGameType, onFinish }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState<{ ok: boolean; picked?: string } | null>(null);
  const [interactiveSolved, setInteractiveSolved] = useState(false);
  const [teacherHint, setTeacherHint] = useState<string | null>(null);
  const [stepPraise, setStepPraise] = useState<string | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);

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
    setInteractiveSolved(false);
    setTeacherHint(null);
    setStepPraise(null);
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

  const handleInteractiveSolve = () => {
    if (interactiveSolved) return;
    const nextCorrect = correctCount + 1;
    setInteractiveSolved(true);
    setTeacherHint(null);
    setStepPraise(null);
    setCorrectCount(nextCorrect);
    setConfettiKey((k) => k + 1);
    soundEngine.playCorrect();

    window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1900);
  };

  const handleStepSuccess = (message?: string) => {
    setTeacherHint(null);
    setConfettiKey((k) => k + 1);
    if (message) {
      setStepPraise(message);
    }
  };

  const handleStepMistake = (hint: string) => {
    setStepPraise(null);
    setTeacherHint(hint);
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

  if (current.kind !== 'order' && current.kind !== 'choice') {
    const resolvedKind = current.kind;
    const stageProps = {
      round: current,
      solved: interactiveSolved,
      onSolve: handleInteractiveSolve,
      onStepSuccess: handleStepSuccess,
      onStepMistake: handleStepMistake,
    };

    return (
      <div className="relative space-y-4">
        <StepConfettiBurst burstKey={confettiKey} />

        {/* Clean Top Metadata Line */}
        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-600">
          <span>
            Raund {roundIdx + 1} / {rounds.length} ·{' '}
            {CS_GAME_TITLES[resolvedKind] ??
              (csGameType ? CS_GAME_TITLES[csGameType] : undefined) ??
              "Interaktiv mantiq o'yini"}
          </span>
          <span className="font-mono-num text-violet-700 font-bold">
            +{correctCount * POINTS_PER_CORRECT} ball
          </span>
        </div>

        {/* Kid-Friendly Prompt Banner */}
        <div className="rounded-2xl bg-violet-50/90 border border-violet-200 px-4 py-3 text-center">
          <p className="text-base sm:text-lg font-display font-extrabold text-slate-900 text-balance leading-snug">
            {current.prompt}
          </p>
        </div>

        {/* Bespoke Interactive CS & Logic Stage */}
        <div key={`${resolvedKind}-${roundIdx}`}>
          {resolvedKind === 'senses_sorter' && <SensesSorterStage {...stageProps} />}
          {resolvedKind === 'taste_conveyor' && <TasteConveyorStage {...stageProps} />}
          {resolvedKind === 'time_machine' && <TimeMachineStage {...stageProps} />}
          {resolvedKind === 'chef_algo' && <ChefAlgoStage {...stageProps} />}
          {resolvedKind === 'cycle_carousel' && <CycleCarouselStage {...stageProps} />}
          {resolvedKind === 'drone_flight' && <DroneFlightStage {...stageProps} />}
          {resolvedKind === 'short_path' && <ShortPathStage {...stageProps} />}
          {resolvedKind === 'robot_maze' && <RobotMazeStage {...stageProps} />}
          {resolvedKind === 'pc_builder' && <PcBuilderStage {...stageProps} />}
          {resolvedKind === 'logic_detective' && <LogicDetectiveStage {...stageProps} />}
        </div>

        {/* Reserved Warm Teacher Hint / Praise / Celebration Box */}
        <div
          className={`min-h-[78px] rounded-2xl px-4 py-3 text-sm flex items-center gap-2.5 transition-colors ${
            interactiveSolved
              ? 'bg-emerald-50 text-emerald-950 border-2 border-emerald-300'
              : teacherHint
              ? 'bg-amber-50 text-amber-950 border-2 border-amber-300'
              : stepPraise
              ? 'bg-sky-50 text-sky-950 border border-sky-200'
              : 'bg-slate-50 text-slate-600 border border-slate-200/80'
          }`}
        >
          {interactiveSolved ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="leading-snug">
                <div className="font-display font-extrabold text-emerald-900">
                  Barakalla! Ajoyib yechim! (+{POINTS_PER_CORRECT} ball)
                </div>
                <div className="text-xs font-medium mt-0.5 text-emerald-800">
                  {current.explanation}
                </div>
              </div>
            </>
          ) : teacherHint ? (
            <>
              <span className="text-2xl leading-none shrink-0" aria-hidden="true">👩‍🏫</span>
              <div className="leading-snug">
                <div className="text-xs font-extrabold text-amber-800">Ustoz maslahati:</div>
                <div className="text-xs sm:text-sm font-semibold text-amber-950 mt-0.5">
                  {teacherHint}
                </div>
              </div>
            </>
          ) : stepPraise ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
              <span className="font-bold text-xs sm:text-sm">{stepPraise}</span>
            </>
          ) : (
            <span className="text-xs sm:text-sm font-medium">
              Topshiriqni bajaring — mantiq va dasturlash siri shu yerda ochiladi!
            </span>
          )}
        </div>
      </div>
    );
  }

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

      {/* Reserved Action / Feedback Footer (prevents modal shrinking after answering) */}
      <div className="min-h-[78px] flex items-center">
        {checked ? (
          <div
            className={`w-full min-h-[78px] rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2.5 ${
              checked.ok
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {checked.ok ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div className="leading-snug">
              <div>
                {checked.ok
                  ? `Ajoyib! To'g'ri yechim (+${POINTS_PER_CORRECT} ball)`
                  : "Ketma-ketlik yoki javob noto'g'ri."}
              </div>
              <div className="text-xs font-normal mt-0.5 opacity-90">{current.explanation}</div>
            </div>
          </div>
        ) : current.kind === 'order' ? (
          <button
            type="button"
            disabled={selectedOrder.length !== current.correctSteps.length}
            onClick={handleCheckOrder}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${
              selectedOrder.length === current.correctSteps.length
                ? 'bg-violet-600 hover:bg-violet-700 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Algoritmni tekshirish
          </button>
        ) : (
          <div className="w-full min-h-[78px] rounded-xl px-4 py-3 text-sm font-medium bg-slate-50 text-slate-500 border border-slate-200/80 flex items-center">
            To&apos;g&apos;ri javob variantini tanlang.
          </div>
        )}
      </div>
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
  scienceGameType?: ScienceGameType;
  onFinish: (correctCount: number) => void;
}> = ({ rounds, scienceGameType, onFinish }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [interactiveSolved, setInteractiveSolved] = useState(false);
  const [teacherHint, setTeacherHint] = useState<string | null>(null);
  const [stepPraise, setStepPraise] = useState<string | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);

  const current = rounds[roundIdx];
  const resolvedKind =
    current.kind !== 'quiz' && current.kind !== 'true_false'
      ? current.kind
      : scienceGameType ?? current.kind;
  const isInteractiveLab = resolvedKind !== 'quiz' && resolvedKind !== 'true_false';

  useEffect(() => {
    setPicked(null);
    setInteractiveSolved(false);
    setTeacherHint(null);
    setStepPraise(null);
  }, [roundIdx]);

  const handleInteractiveSolve = () => {
    if (interactiveSolved) return;
    const nextCorrect = correctCount + 1;
    setInteractiveSolved(true);
    setTeacherHint(null);
    setStepPraise(null);
    setCorrectCount(nextCorrect);
    setConfettiKey((k) => k + 1);
    soundEngine.playCorrect();

    window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1900);
  };

  const handleStepSuccess = (message?: string) => {
    setTeacherHint(null);
    setConfettiKey((k) => k + 1);
    if (message) {
      setStepPraise(message);
    }
  };

  const handleStepMistake = (hint: string) => {
    setStepPraise(null);
    setTeacherHint(hint);
  };

  const handleAnswer = (opt: string) => {
    if (picked) return;
    const ok = opt === current.correctAnswer;
    const nextCorrect = ok ? correctCount + 1 : correctCount;
    if (ok) {
      soundEngine.playCorrect();
      setConfettiKey((k) => k + 1);
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

  if (isInteractiveLab) {
    const stageProps = {
      round: current,
      solved: interactiveSolved,
      onSolve: handleInteractiveSolve,
      onStepSuccess: handleStepSuccess,
      onStepMistake: handleStepMistake,
    };

    return (
      <div className="relative space-y-4">
        <StepConfettiBurst burstKey={confettiKey} />

        {/* Clean Top Metadata Line */}
        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-600">
          <span>
            Raund {roundIdx + 1} / {rounds.length} ·{' '}
            {SCIENCE_GAME_TITLES[resolvedKind] ?? 'Interaktiv laboratoriya'}
          </span>
          <span className="font-mono-num text-emerald-700 font-bold">
            +{correctCount * POINTS_PER_CORRECT} ball
          </span>
        </div>

        {/* Kid-Friendly Prompt */}
        <div className="rounded-2xl bg-orange-50/80 border border-orange-200 px-4 py-3 text-center">
          <p className="text-base sm:text-lg font-display font-extrabold text-slate-900 text-balance leading-snug">
            {current.statement}
          </p>
        </div>

        {/* Bespoke Interactive Science Stage */}
        <div key={`${resolvedKind}-${roundIdx}`}>
          {resolvedKind === 'flag_map' && <FlagMapStage {...stageProps} />}
          {resolvedKind === 'plant_lab' && <PlantLabStage {...stageProps} />}
          {resolvedKind === 'animal_homes' && <AnimalHomesStage {...stageProps} />}
          {resolvedKind === 'seasons_wheel' && <SeasonsWheelStage {...stageProps} />}
          {resolvedKind === 'water_states' && <WaterStatesStage {...stageProps} />}
          {resolvedKind === 'bread_chain' && <BreadChainStage {...stageProps} />}
          {resolvedKind === 'safety_home' && <SafetyHomeStage {...stageProps} />}
          {resolvedKind === 'traffic_light' && <TrafficLightStage {...stageProps} />}
          {resolvedKind === 'clean_hands' && <CleanHandsStage {...stageProps} />}
          {resolvedKind === 'eco_patrol' && <EcoPatrolStage {...stageProps} />}
        </div>

        {/* Reserved Warm Teacher Hint / Celebration Fact Box */}
        <div
          className={`min-h-[78px] rounded-2xl px-4 py-3 text-sm flex items-center gap-2.5 transition-colors ${
            interactiveSolved
              ? 'bg-emerald-50 text-emerald-950 border-2 border-emerald-300'
              : teacherHint
              ? 'bg-amber-50 text-amber-950 border-2 border-amber-300'
              : stepPraise
              ? 'bg-sky-50 text-sky-950 border border-sky-200'
              : 'bg-slate-50 text-slate-600 border border-slate-200/80'
          }`}
        >
          {interactiveSolved ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="leading-snug">
                <div className="font-display font-extrabold text-emerald-900">
                  Barakalla! Ajoyib tajriba! (+{POINTS_PER_CORRECT} ball)
                </div>
                <div className="text-xs font-medium mt-0.5 text-emerald-800">{current.fact}</div>
              </div>
            </>
          ) : teacherHint ? (
            <>
              <span className="text-2xl leading-none shrink-0" aria-hidden="true">👩‍🏫</span>
              <div className="leading-snug">
                <div className="text-xs font-extrabold text-amber-800">Ustoz maslahati:</div>
                <div className="text-xs sm:text-sm font-semibold text-amber-950 mt-0.5">{teacherHint}</div>
              </div>
            </>
          ) : stepPraise ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
              <span className="font-bold text-xs sm:text-sm">{stepPraise}</span>
            </>
          ) : (
            <span className="text-xs sm:text-sm font-medium">
              Tajribani bajaring — qiziqarli tabiat siri shu yerda ochiladi!
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      <StepConfettiBurst burstKey={confettiKey} />

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

      {/* Reserved Fact / Feedback Box (prevents modal shrinking after answering) */}
      <div
        className={`min-h-[84px] rounded-xl px-4 py-3 text-sm flex items-center gap-2.5 transition-colors ${
          !picked
            ? 'bg-slate-50 text-slate-500 border border-slate-200/80'
            : picked === current.correctAnswer
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : 'bg-amber-50 text-amber-950 border border-amber-200'
        }`}
      >
        {!picked ? (
          <span className="font-medium">
            Javobni tanlang — qiziqarli ilmiy fakt shu yerda ko&apos;rsatiladi.
          </span>
        ) : (
          <>
            {picked === current.correctAnswer ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div className="leading-snug">
              <div className="font-bold">
                {picked === current.correctAnswer
                  ? `To'g'ri! (+${POINTS_PER_CORRECT} ball)`
                  : `To'g'ri javob: ${current.correctAnswer}`}
              </div>
              <div className="text-xs mt-0.5">{current.fact}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 4B. PE (JISMONIY TARBIYA) MINI-GAME: 11 Interactive Sport & Gym Stages
// =========================================================================
const PeMiniGame: React.FC<{
  rounds: PeRound[];
  peGameType?: PeGameType;
  onFinish: (correctCount: number) => void;
}> = ({ rounds, peGameType, onFinish }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [interactiveSolved, setInteractiveSolved] = useState(false);
  const [teacherHint, setTeacherHint] = useState<string | null>(null);
  const [stepPraise, setStepPraise] = useState<string | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);

  const current = rounds[roundIdx];
  const resolvedKind: PeGameType =
    current.kind !== 'quiz' ? current.kind : peGameType ?? 'line_formation';

  useEffect(() => {
    setInteractiveSolved(false);
    setTeacherHint(null);
    setStepPraise(null);
  }, [roundIdx]);

  const handleInteractiveSolve = () => {
    if (interactiveSolved) return;
    const nextCorrect = correctCount + 1;
    setInteractiveSolved(true);
    setTeacherHint(null);
    setStepPraise(null);
    setCorrectCount(nextCorrect);
    setConfettiKey((k) => k + 1);
    soundEngine.playCorrect();

    window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1900);
  };

  const handleStepSuccess = (message?: string) => {
    setTeacherHint(null);
    setConfettiKey((k) => k + 1);
    if (message) {
      setStepPraise(message);
    }
  };

  const handleStepMistake = (hint: string) => {
    setStepPraise(null);
    setTeacherHint(hint);
  };

  const stageProps = {
    round: current,
    solved: interactiveSolved,
    onSolve: handleInteractiveSolve,
    onStepSuccess: handleStepSuccess,
    onStepMistake: handleStepMistake,
  };

  return (
    <div className="relative space-y-4">
      <StepConfettiBurst burstKey={confettiKey} />

      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-600">
        <span>
          Raund {roundIdx + 1} / {rounds.length} ·{' '}
          {PE_GAME_TITLES[resolvedKind] ?? 'Sport zali mashqi'}
        </span>
        <span className="font-mono-num text-emerald-700 font-bold">
          +{correctCount * POINTS_PER_CORRECT} ball
        </span>
      </div>

      <div className="rounded-2xl bg-sky-50/90 border border-sky-200 px-4 py-3 text-center">
        <p className="text-base sm:text-lg font-display font-extrabold text-slate-900 text-balance leading-snug">
          {current.prompt}
        </p>
      </div>

      <div key={`${resolvedKind}-${roundIdx}`}>
        {resolvedKind === 'line_formation' && <LineFormationStage {...stageProps} />}
        {resolvedKind === 'number_reaction' && <NumberReactionStage {...stageProps} />}
        {resolvedKind === 'train_route' && <TrainRouteStage {...stageProps} />}
        {resolvedKind === 'warmup_rhythm' && <WarmupRhythmStage {...stageProps} />}
        {resolvedKind === 'day_night_freeze' && <DayNightFreezeStage {...stageProps} />}
        {resolvedKind === 'tag_chase' && <TagChaseStage {...stageProps} />}
        {resolvedKind === 'relay_race' && <RelayRaceStage {...stageProps} />}
        {resolvedKind === 'gymnastics_balance' && <GymnasticsBalanceStage {...stageProps} />}
        {resolvedKind === 'jump_power' && <JumpPowerStage {...stageProps} />}
        {resolvedKind === 'ball_throw' && <BallThrowStage {...stageProps} />}
        {resolvedKind === 'checkers_intro' && <CheckersIntroStage {...stageProps} />}
      </div>

      <div
        className={`min-h-[78px] rounded-2xl px-4 py-3 text-sm flex items-center gap-2.5 transition-colors ${
          interactiveSolved
            ? 'bg-emerald-50 text-emerald-950 border-2 border-emerald-300'
            : teacherHint
            ? 'bg-amber-50 text-amber-950 border-2 border-amber-300'
            : stepPraise
            ? 'bg-sky-50 text-sky-950 border border-sky-200'
            : 'bg-slate-50 text-slate-600 border border-slate-200/80'
        }`}
      >
        {interactiveSolved ? (
          <>
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="leading-snug">
              <div className="font-display font-extrabold text-emerald-900">
                Barakalla! Ajoyib sport natijasi! (+{POINTS_PER_CORRECT} ball)
              </div>
              <div className="text-xs font-medium mt-0.5 text-emerald-800">{current.fact}</div>
            </div>
          </>
        ) : teacherHint ? (
          <>
            <span className="text-2xl leading-none shrink-0" aria-hidden="true">👨‍🏫</span>
            <div className="leading-snug">
              <div className="text-xs font-extrabold text-amber-800">Ustoz Rustam maslahati:</div>
              <div className="text-xs sm:text-sm font-semibold text-amber-950 mt-0.5">{teacherHint}</div>
            </div>
          </>
        ) : stepPraise ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
            <span className="font-bold text-xs sm:text-sm">{stepPraise}</span>
          </>
        ) : (
          <span className="text-xs sm:text-sm font-medium">
            Mashqni bajaring — har bir harakat sog‘liq va kuch bag‘ishlaydi!
          </span>
        )}
      </div>
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
  alifbeGameType?: AlifbeGameType;
  speech: SpeechState;
  onFinish: (correctCount: number) => void;
}> = ({ rounds, alifbeGameType, speech, onFinish }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const [solvedPraise, setSolvedPraise] = useState<string | null>(null);
  const [stepPraise, setStepPraise] = useState<string | null>(null);
  const [teacherHint, setTeacherHint] = useState<string | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [retryMsg, setRetryMsg] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState<string | null>(null);
  const advanceTimerRef = useRef<number | null>(null);

  // State for build_word (index-based so duplicate syllables like BO+BO or DA+DA both work!)
  const [usedPartIndices, setUsedPartIndices] = useState<number[]>([]);

  // State for letter_match
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [matchedLetters, setMatchedLetters] = useState<string[]>([]);

  const current = rounds[roundIdx];
  const isLegacyRound =
    current.kind === 'first_letter' ||
    current.kind === 'build_word' ||
    current.kind === 'letter_match';

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
    setSolvedPraise(null);
    setStepPraise(null);
    setTeacherHint(null);
    setRetryMsg(null);
    setShakeKey(null);
    setUsedPartIndices([]);
    setSelectedLetter(null);
    setMatchedLetters([]);

    const speakTimer = window.setTimeout(() => {
      if (isLegacyRound) {
        speakUzbek(current.spokenPrompt);
      } else {
        speakUzbek(current.speakUzbek ?? current.spokenPrompt, {
          subtitleText: current.spokenPrompt,
        });
      }
    }, 180);

    return () => {
      window.clearTimeout(speakTimer);
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
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
    setSolvedPraise(praiseText);
    setRetryMsg(null);
    setConfettiKey((k) => k + 1);
    soundEngine.playCorrect();
    speakUzbek(praiseText);

    advanceTimerRef.current = window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, 1350);
  };

  const completeInteractiveRound = (praiseText: string, delayMs: number) => {
    if (solved) return;
    const nextCorrect = correctCount + 1;
    setCorrectCount(nextCorrect);
    setSolved(true);
    setSolvedPraise(praiseText);
    setStepPraise(null);
    setTeacherHint(null);
    setRetryMsg(null);
    setConfettiKey((k) => k + 1);
    soundEngine.playCorrect();

    advanceTimerRef.current = window.setTimeout(() => {
      if (roundIdx + 1 < rounds.length) {
        setRoundIdx((i) => i + 1);
      } else {
        onFinish(nextCorrect);
      }
    }, delayMs);
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

  if (!isLegacyRound) {
    const resolvedKind = current.kind || alifbeGameType || 'balloon_pop';
    const gameTitle = ALIFBE_GAME_TITLES[resolvedKind] || 'Alifbe O‘yini';
    const isFinalMedal = Boolean(current.readerData?.isFinalMedalRound);

    const stageProps = {
      round: current,
      solved,
      onSolve: (praise: string) => completeInteractiveRound(praise, isFinalMedal ? 2700 : 1950),
      onStepSuccess: (msg?: string) => {
        setTeacherHint(null);
        if (msg) setStepPraise(msg);
      },
      onStepMistake: (hint: string) => {
        setStepPraise(null);
        setTeacherHint(hint);
      },
    };

    return (
      <div className="space-y-3.5 relative">
        <StepConfettiBurst burstKey={confettiKey} />

        {/* Top Progress + Phonetic Legend + Big Listen Button */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Raund {roundIdx + 1} / {rounds.length}
            </span>
            <span className="text-xs font-bold text-rose-700">· {gameTitle}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 ml-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Unli
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block ml-1" /> Undosh
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              speakUzbek(current.speakUzbek ?? current.spokenPrompt, {
                subtitleText: current.spokenPrompt,
              })
            }
            className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-display font-extrabold text-sm shadow-md border-b-4 border-amber-600 flex items-center gap-1.5 cursor-pointer transition-transform"
          >
            <Volume2 className="w-4 h-4" />
            <span>Eshitish</span>
          </button>
        </div>

        {/* Synchronized Karaoke Subtitle Box */}
        <div className="min-h-[50px] rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2 flex items-center justify-center text-center">
          <p className="text-sm sm:text-base font-bold leading-snug">
            {speech.isSpeaking && speech.fullText && speech.fullText !== current.spokenPrompt ? (
              <KaraokeSubtitleText
                text={speech.fullText}
                speech={speech}
                activeClassName="text-slate-900"
                pendingClassName="text-slate-400"
                cursorClassName="text-amber-600"
              />
            ) : (
              <KaraokeSubtitleText
                text={current.spokenPrompt}
                speech={speech}
                activeClassName="text-slate-800"
                pendingClassName="text-slate-400"
                cursorClassName="text-amber-600"
              />
            )}
          </p>
        </div>

        {/* Interactive Stage Switch */}
        <div key={`${resolvedKind}-${roundIdx}`}>
          {resolvedKind === 'balloon_pop' && <BalloonPopStage {...stageProps} />}
          {resolvedKind === 'basket_sort' && <BasketSortStage {...stageProps} />}
          {resolvedKind === 'syllable_wheel' && <SyllableWheelStage {...stageProps} />}
          {resolvedKind === 'train_builder' && <TrainBuilderStage {...stageProps} />}
          {resolvedKind === 'missing_letter' && <MissingLetterStage {...stageProps} />}
          {resolvedKind === 'flower_garden' && <FlowerGardenStage {...stageProps} />}
          {resolvedKind === 'twin_letters' && <TwinLettersStage {...stageProps} />}
          {resolvedKind === 'golden_reader' && <GoldenReaderStage {...stageProps} />}
        </div>

        {/* Reserved Feedback / Ustoz Dilnoza Hint Banner */}
        <div
          className={`min-h-[56px] rounded-2xl px-4 py-2.5 font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 text-center transition-colors ${
            solved
              ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-900'
              : teacherHint
              ? 'bg-amber-50 border-2 border-amber-300 text-amber-900'
              : stepPraise
              ? 'bg-sky-50 border-2 border-sky-200 text-sky-900'
              : 'bg-slate-50 border border-slate-200/80 text-slate-500 text-xs sm:text-sm font-semibold'
          }`}
        >
          {solved ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {solvedPraise || 'Barakalla!'} (+{POINTS_PER_CORRECT} ball)
              </span>
            </>
          ) : teacherHint ? (
            <span>Ustoz Dilnoza maslahati: {teacherHint}</span>
          ) : stepPraise ? (
            <span>{stepPraise}</span>
          ) : (
            <span>Qizil — unli harflar, ko&apos;k — undosh harflar. Diqqat bilan bajar!</span>
          )}
        </div>
      </div>
    );
  }

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

      {/* Synchronized Typewriter / Karaoke Subtitle Box (reserved min-height for zero layout jump) */}
      <div className="min-h-[54px] rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5 flex items-center justify-center text-center">
        <p className="text-sm sm:text-base font-bold leading-snug">
          {speech.isSpeaking && speech.fullText && speech.fullText !== current.spokenPrompt ? (
            <KaraokeSubtitleText
              text={speech.fullText}
              speech={speech}
              activeClassName="text-slate-900"
              pendingClassName="text-slate-400"
              cursorClassName="text-amber-600"
            />
          ) : (
            <KaraokeSubtitleText
              text={current.spokenPrompt}
              speech={speech}
              activeClassName="text-slate-800"
              pendingClassName="text-slate-400"
              cursorClassName="text-amber-600"
            />
          )}
        </p>
      </div>

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

      {/* Reserved Feedback Banner (prevents modal shrinking after tapping an answer) */}
      <div
        className={`min-h-[56px] rounded-2xl px-4 py-3 font-display font-bold text-base flex items-center justify-center gap-2 transition-colors ${
          solved
            ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-900'
            : retryMsg
            ? 'bg-rose-50 border-2 border-rose-300 text-rose-800'
            : 'bg-slate-50 border border-slate-200/80 text-slate-500 text-sm font-semibold'
        }`}
      >
        {solved ? (
          <>
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>Barakalla! +{POINTS_PER_CORRECT} ball</span>
          </>
        ) : retryMsg ? (
          <>
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{retryMsg}</span>
          </>
        ) : (
          <span>To&apos;g&apos;ri javobni bosing!</span>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// MAIN LESSON MODAL (3 Stages: Explanation -> Mini-Game -> Celebration Reward)
// =========================================================================
export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  grade,
  studentName,
  initialStage = 'explain',
  testMode = false,
  onComplete,
  onClose,
}) => {
  const [stage, setStage] = useState<'explain' | 'game' | 'reward'>(initialStage);
  const [correctCount, setCorrectCount] = useState(0);
  const [speech, setSpeech] = useState<SpeechState>(() => getSpeechState());
  const meta = SUBJECT_META[lesson.subject];

  // Subscribe to synchronized speech & typewriter subtitle updates
  useEffect(() => {
    return subscribeSpeechState(setSpeech);
  }, []);

  const lessonAudioId = resolveLessonAudioId(lesson.topicTitle, lesson.grade ?? grade);

  // Auto-speak Alifbe lesson explanation on Stage 1; always stop speech on stage/lesson change
  useEffect(() => {
    stopSpeaking();
    if (stage === 'explain' && lesson.subject === 'alifbe') {
      const timer = window.setTimeout(() => {
        playLessonAudio(lesson.subject, lessonAudioId, {
          fallbackText: lesson.speakUzbek ?? lesson.explanation,
          subtitleText: lesson.explanation,
          lang: 'uz',
        });
      }, 220);
      return () => {
        window.clearTimeout(timer);
        stopSpeaking();
      };
    }
    return () => {
      stopSpeaking();
    };
  }, [stage, lesson, lessonAudioId]);

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

  const handleToggleExplanationSpeech = () => {
    if (speech.isSpeaking && speech.fullText === lesson.explanation) {
      stopSpeaking();
    } else {
      playLessonAudio(lesson.subject, lessonAudioId, {
        fallbackText: lesson.speakUzbek ?? lesson.explanation,
        subtitleText: lesson.explanation,
        lang: 'uz',
      });
    }
  };

  const speechModeLabel =
    speech.mode === 'static-webm'
      ? 'Offline audio'
      : speech.mode === 'studio-uz'
      ? "Aniq o'zbekcha ovoz"
      : speech.mode === 'studio-en'
      ? 'Aniq inglizcha ovoz'
      : speech.mode === 'native-uz'
      ? "O'zbekcha ovoz"
      : speech.mode === 'phonetic-uz'
      ? "Aniq o'zbekcha talaffuz"
      : speech.mode === 'native-en'
      ? 'Inglizcha talaffuz'
      : speech.mode === 'audio-buffer'
      ? 'Jonli audio'
      : 'Ovozli subtitr';

  const totalRounds =
    lesson.alifbeRounds?.length ??
    lesson.mathRounds?.length ??
    lesson.englishRounds?.length ??
    lesson.csRounds?.length ??
    lesson.scienceRounds?.length ??
    lesson.peRounds?.length ??
    4;
  const isPerfectScore = correctCount >= totalRounds;
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
                  <div className="flex items-center gap-4 min-w-0">
                    <BlockyTeacherAvatar color={meta.color} speaking={speech.isSpeaking} />
                    <div className="min-w-0">
                      <div className="text-base font-display font-bold text-slate-900">
                        {meta.teacherName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {meta.teacherTitle}
                        {speech.isSpeaking && (
                          <>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span className="font-semibold text-amber-700">{speechModeLabel}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {lesson.subject === 'english' && lesson.speakText && (
                      <button
                        type="button"
                        onClick={() => speakEnglish(lesson.speakText!)}
                        className="px-3.5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-display font-extrabold text-sm shadow-md border-b-4 border-emerald-700 flex items-center gap-1.5 cursor-pointer transition-transform"
                        title="Inglizcha talaffuzni eshitish"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>English</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleToggleExplanationSpeech}
                      className={`px-4 py-2.5 rounded-2xl active:scale-95 font-display font-extrabold text-sm sm:text-base shadow-md border-b-4 flex items-center gap-2 cursor-pointer transition-transform ${
                        speech.isSpeaking && speech.fullText === lesson.explanation
                          ? 'bg-rose-500 hover:bg-rose-600 border-rose-700 text-white'
                          : 'bg-amber-400 hover:bg-amber-500 border-amber-600 text-slate-950'
                      }`}
                    >
                      {speech.isSpeaking && speech.fullText === lesson.explanation ? (
                        <>
                          <Square className="w-4 h-4 fill-current" />
                          <span>To&apos;xtatish</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-5 h-5" />
                          <span>Eshitish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Synchronized Live Teacher Subtitle Strip (fixed slot for Alifbe cards so modal never jumps) */}
                {lesson.subject === 'alifbe' && (
                  <div className="min-h-[44px] rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2 flex items-center gap-2.5">
                    <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <div className="text-sm font-bold leading-snug">
                      {speech.isSpeaking && speech.fullText && speech.fullText !== lesson.explanation ? (
                        <KaraokeSubtitleText
                          text={speech.fullText}
                          speech={speech}
                          activeClassName="text-slate-900"
                          pendingClassName="text-slate-400"
                          cursorClassName="text-amber-600"
                        />
                      ) : (
                        <span className="text-amber-900/75 font-semibold">
                          Eshitish uchun harf kartochkasini bosing
                        </span>
                      )}
                    </div>
                  </div>
                )}

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
                              if (single) {
                                playLessonAudio('alifbe', resolveLetterAudioId(card.letter), {
                                  fallbackText: card.speakUzbek ?? `${card.letter}, ${card.word}`,
                                  subtitleText: `${card.letter}, ${card.word}`,
                                  lang: 'uz',
                                  styleHint: 'letter',
                                });
                              } else if (card.speakUzbek) {
                                speakUzbek(card.speakUzbek, {
                                  subtitleText: `${card.letter}, ${card.word}`,
                                });
                              } else {
                                speakUzbekLetter(card.letter, card.word);
                              }
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
                    <p className="text-sm sm:text-base leading-relaxed">
                      <KaraokeSubtitleText
                        text={lesson.explanation}
                        speech={speech}
                        activeClassName="text-white"
                        pendingClassName="text-emerald-200/45"
                        cursorClassName="text-amber-300"
                      />
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
                  <AlifbeMiniGame
                    rounds={lesson.alifbeRounds}
                    alifbeGameType={lesson.alifbeGameType}
                    speech={speech}
                    onFinish={handleGameFinish}
                  />
                )}
                {lesson.subject === 'math' && lesson.mathRounds && (
                  <MathMiniGame
                    rounds={lesson.mathRounds}
                    grade={grade}
                    gameType={lesson.gameType}
                    onFinish={handleGameFinish}
                  />
                )}
                {lesson.subject === 'english' && lesson.englishRounds && (
                  <EnglishMiniGame
                    rounds={lesson.englishRounds}
                    englishGameType={lesson.englishGameType}
                    studentName={studentName}
                    onFinish={handleGameFinish}
                  />
                )}
                {lesson.subject === 'cs' && lesson.csRounds && (
                  <CsMiniGame
                    rounds={lesson.csRounds}
                    csGameType={lesson.csGameType}
                    onFinish={handleGameFinish}
                  />
                )}
                {lesson.subject === 'science' && lesson.scienceRounds && (
                  <ScienceMiniGame
                    rounds={lesson.scienceRounds}
                    scienceGameType={lesson.scienceGameType}
                    onFinish={handleGameFinish}
                  />
                )}
                {lesson.subject === 'pe' && lesson.peRounds && (
                  <PeMiniGame
                    rounds={lesson.peRounds}
                    peGameType={lesson.peGameType}
                    onFinish={handleGameFinish}
                  />
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
                    {isPerfectScore ? "A'lo baho! Barakalla!" : 'Dars muvaffaqiyatli yakunlandi!'}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {isPerfectScore
                      ? "Barcha savollarga to'g'ri javob berdingiz! Koridorga qaytib g'alabani nishonlang!"
                      : "Ajoyib harakat! Endi keyingi darsga o'tishingiz yoki do'kondan yangi 3D aksessuar olishingiz mumkin."}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">
                      To&apos;g&apos;ri javoblar ({correctCount} / {totalRounds})
                    </span>
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
                    onComplete(totalEarned, correctCount, totalRounds);
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
