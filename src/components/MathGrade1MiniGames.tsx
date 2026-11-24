import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftRight, Check, Lock, Minus, Plus, RotateCcw, ShoppingBag, Unlock } from 'lucide-react';
import type { MathRound, TangramShapeId } from '../data/curriculum';
import { soundEngine } from '../utils/sound';

export interface Grade1StageProps {
  round: MathRound;
  feedback: { status: 'correct' | 'wrong' | 'timeout'; picked?: string } | null;
  onSelect: (answer: string) => void;
  onStepSuccess?: (message?: string) => void;
  onStepMistake?: (teacherHint: string) => void;
}

// =========================================================================
// LIGHTWEIGHT CELEBRATION CONFETTI BURST (Fires on every right step!)
// =========================================================================
const CONFETTI_PARTICLES = [
  { id: 0, dx: -86, dy: -62, color: '#FACC15', rot: -110, shape: 'star' },
  { id: 1, dx: -52, dy: -84, color: '#38BDF8', rot: 95, shape: 'dot' },
  { id: 2, dx: -16, dy: -92, color: '#4ADE80', rot: -65, shape: 'rect' },
  { id: 3, dx: 22, dy: -88, color: '#FB7185', rot: 130, shape: 'star' },
  { id: 4, dx: 58, dy: -78, color: '#A78BFA', rot: -85, shape: 'dot' },
  { id: 5, dx: 88, dy: -56, color: '#F97316', rot: 120, shape: 'rect' },
  { id: 6, dx: -72, dy: -26, color: '#22C55E', rot: 70, shape: 'dot' },
  { id: 7, dx: 74, dy: -22, color: '#F43F5E', rot: -120, shape: 'star' },
  { id: 8, dx: -36, dy: -54, color: '#FDE047', rot: 45, shape: 'rect' },
  { id: 9, dx: 38, dy: -50, color: '#0EA5E9', rot: -45, shape: 'dot' },
];

export const StepConfettiBurst: React.FC<{ burstKey: number }> = ({ burstKey }) => {
  if (burstKey <= 0) return null;
  return (
    <div
      key={burstKey}
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {CONFETTI_PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 12, scale: 0.2, opacity: 1, rotate: 0 }}
          animate={{ x: p.dx, y: p.dy, scale: [0.4, 1.25, 0.8], opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: 0.72, ease: 'easeOut' }}
          className="absolute"
        >
          {p.shape === 'star' ? (
            <span style={{ color: p.color }} className="text-lg font-black leading-none">
              ★
            </span>
          ) : p.shape === 'rect' ? (
            <span
              className="block w-2.5 h-3.5 rounded-xs"
              style={{ backgroundColor: p.color }}
            />
          ) : (
            <span
              className="block w-3 h-3 rounded-full"
              style={{ backgroundColor: p.color }}
            />
          )}
        </motion.span>
      ))}
    </div>
  );
};

// =========================================================================
// 1-DARS: "TARTIBLI XONA" (SEHRLI JAVON) — Drag-and-Drop & Tap-to-Place
// =========================================================================
export const RoomSortStage: React.FC<Grade1StageProps> = ({
  round,
  feedback,
  onSelect,
  onStepMistake,
}) => {
  const data = round.roomData ?? {
    itemEmoji: '⚽',
    itemLabel: 'Koptok',
    targetZoneId: 'under_desk',
    zones: [
      { id: 'sky', label: 'Osmon', x: 34, y: 20, w: 120, h: 74 },
      { id: 'top_shelf', label: 'Javon tepasi', x: 320, y: 20, w: 146, h: 60 },
      { id: 'under_desk', label: 'Stol tagi', x: 184, y: 150, w: 132, h: 66 },
    ],
  };

  const stageRef = React.useRef<HTMLDivElement>(null);
  const [placedZoneId, setPlacedZoneId] = useState<string | null>(null);
  const [wrongZoneId, setWrongZoneId] = useState<string | null>(null);
  const isSolved = feedback?.status === 'correct';

  const handleZonePick = (zoneId: string) => {
    if (feedback) return;
    if (zoneId === data.targetZoneId) {
      setPlacedZoneId(zoneId);
      setWrongZoneId(null);
      onSelect(round.correctAnswer);
    } else {
      setWrongZoneId(zoneId);
      soundEngine.playWrong();
      onStepMistake?.(round.hint);
      window.setTimeout(() => setWrongZoneId((prev) => (prev === zoneId ? null : prev)), 650);
    }
  };

  const handleItemDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    if (feedback || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    // Convert viewport pointer drop coordinates into 500x232 SVG coordinates
    const svgX = ((info.point.x - rect.left) / rect.width) * 500;
    const svgY = ((info.point.y - rect.top) / rect.height) * 232;

    const hit = data.zones.find(
      (z) => svgX >= z.x - 16 && svgX <= z.x + z.w + 16 && svgY >= z.y - 16 && svgY <= z.y + z.h + 16
    );
    if (hit) {
      handleZonePick(hit.id);
    }
  };

  const placedZone = data.zones.find((z) => z.id === placedZoneId);

  return (
    <div className="space-y-3.5">
      {/* Illustrated Cozy Room SVG + Draggable Item Overlay */}
      <div
        ref={stageRef}
        className="relative rounded-2xl bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100/70 border-2 border-amber-200 overflow-hidden select-none touch-none"
      >
        <svg viewBox="0 0 500 232" className="w-full h-[215px] sm:h-[234px]" aria-label="Tartibli xona">
          {/* Wall & Warm Floor */}
          <rect x="0" y="0" width="500" height="184" fill="#FEF9C3" opacity="0.55" />
          <rect x="0" y="184" width="500" height="48" fill="#FDBA74" opacity="0.55" />
          <line x1="0" y1="184" x2="500" y2="184" stroke="#D97706" strokeWidth="2.5" opacity="0.5" />

          {/* Left Window showing Blue Sky */}
          <rect x="28" y="18" width="132" height="82" rx="10" fill="#BAE6FD" stroke="#0284C7" strokeWidth="3.5" />
          <ellipse cx="64" cy="48" rx="16" ry="8" fill="#FFFFFF" opacity="0.85" />
          <ellipse cx="122" cy="38" rx="14" ry="7" fill="#FFFFFF" opacity="0.75" />
          <line x1="94" y1="18" x2="94" y2="100" stroke="#0284C7" strokeWidth="2.5" opacity="0.45" />
          <line x1="28" y1="59" x2="160" y2="59" stroke="#0284C7" strokeWidth="2.5" opacity="0.45" />

          {/* Right Wooden Wall Shelf */}
          <rect x="316" y="80" width="156" height="12" rx="4" fill="#92400E" stroke="#78350F" strokeWidth="2" />
          <polygon points="330,92 342,92 330,108" fill="#78350F" />
          <polygon points="458,92 446,92 458,108" fill="#78350F" />

          {/* Center Study Desk */}
          <rect x="166" y="132" width="168" height="14" rx="5" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <rect x="176" y="146" width="12" height="68" rx="3" fill="#92400E" stroke="#78350F" strokeWidth="2" />
          <rect x="312" y="146" width="12" height="68" rx="3" fill="#92400E" stroke="#78350F" strokeWidth="2" />

          {/* Interactive Drop Zones */}
          {data.zones.map((z) => {
            const isTargetPlaced = placedZoneId === z.id;
            const isWrong = wrongZoneId === z.id;
            return (
              <g
                key={z.id}
                onClick={() => handleZonePick(z.id)}
                style={{ cursor: feedback ? 'default' : 'pointer' }}
              >
                <rect
                  x={z.x}
                  y={z.y}
                  width={z.w}
                  height={z.h}
                  rx="12"
                  fill={
                    isTargetPlaced
                      ? '#DCFCE7'
                      : isWrong
                      ? '#FFE4E6'
                      : 'rgba(255,255,255,0.68)'
                  }
                  stroke={
                    isTargetPlaced
                      ? '#16A34A'
                      : isWrong
                      ? '#E11D48'
                      : '#2563EB'
                  }
                  strokeWidth={isTargetPlaced || isWrong ? 3 : 2.2}
                  strokeDasharray={isTargetPlaced ? undefined : '6 4'}
                />
                <text
                  x={z.x + z.w / 2}
                  y={z.y + z.h - 9}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="800"
                  fill={isTargetPlaced ? '#15803D' : isWrong ? '#BE123C' : '#1E3A8A'}
                >
                  {z.label}
                </text>
              </g>
            );
          })}

          {/* Placed item inside SVG once solved */}
          {placedZone && (
            <motion.g
              initial={{ x: 250, y: 108, scale: 0.7 }}
              animate={{
                x: placedZone.x + placedZone.w / 2,
                y: placedZone.y + placedZone.h / 2 - 4,
                scale: [1.18, 1],
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            >
              <circle cx="0" cy="0" r="24" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2.8" />
              <text x="0" y="10" textAnchor="middle" fontSize="28" className="select-none">
                {data.itemEmoji}
              </text>
            </motion.g>
          )}
        </svg>

        {/* Draggable floating item handle (drag onto any zone OR tap a zone!) */}
        {!placedZone && (
          <motion.div
            drag={!feedback}
            dragSnapToOrigin
            dragElastic={0.18}
            onDragEnd={handleItemDragEnd}
            whileHover={!feedback ? { scale: 1.08 } : undefined}
            whileDrag={{ scale: 1.18, zIndex: 30 }}
            style={{ left: '50%', top: '44%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white border-3 border-amber-500 shadow-lg flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing z-10"
            title={`${data.itemLabel}ni sudrang yoki kerakli joyni bosing`}
          >
            {data.itemEmoji}
          </motion.div>
        )}

        {!isSolved && (
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[11px] font-bold text-amber-950/75 bg-white/80 px-2.5 py-0.5 rounded-lg">
            {data.itemLabel}ni sudrab olib boring yoki joyini bosing!
          </div>
        )}
      </div>

      {/* Big Accessible Zone Buttons (matches drag/tap targets) */}
      <div className="grid grid-cols-3 gap-2.5">
        {data.zones.map((z) => {
          const isPickedRight = placedZoneId === z.id;
          const isWrong = wrongZoneId === z.id;
          return (
            <button
              key={z.id}
              type="button"
              disabled={Boolean(feedback)}
              onClick={() => handleZonePick(z.id)}
              className={`min-h-[56px] rounded-2xl border-2 border-b-4 px-3 py-2 font-display font-extrabold text-sm sm:text-base shadow-sm active:scale-95 transition-all cursor-pointer ${
                isPickedRight
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 border-b-rose-800 text-white animate-alifbe-shake'
                  : 'bg-white hover:bg-blue-50 border-blue-200 border-b-blue-400 text-slate-900'
              }`}
            >
              {z.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 3-DARS: "SHAKLLAR KONSTRUKTORI" (TANGRAM) — Complete House / Car / Boat
// =========================================================================
const TANGRAM_PIECES: { id: TangramShapeId; label: string; color: string; stroke: string }[] = [
  { id: 'triangle', label: 'Uchburchak', color: '#EF4444', stroke: '#991B1B' },
  { id: 'square', label: 'Kvadrat', color: '#3B82F6', stroke: '#1E40AF' },
  { id: 'circle', label: 'Doira', color: '#F59E0B', stroke: '#B45309' },
  { id: 'rectangle', label: "To'rtburchak", color: '#10B981', stroke: '#065F46' },
];

const ShapeIconSvg: React.FC<{ id: TangramShapeId; color: string; stroke: string }> = ({
  id,
  color,
  stroke,
}) => (
  <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0" aria-hidden="true">
    {id === 'triangle' && (
      <polygon points="24,6 42,40 6,40" fill={color} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
    )}
    {id === 'square' && (
      <rect x="9" y="9" width="30" height="30" rx="3" fill={color} stroke={stroke} strokeWidth="3" />
    )}
    {id === 'circle' && (
      <circle cx="24" cy="24" r="16" fill={color} stroke={stroke} strokeWidth="3" />
    )}
    {id === 'rectangle' && (
      <rect x="5" y="13" width="38" height="22" rx="3" fill={color} stroke={stroke} strokeWidth="3" />
    )}
  </svg>
);

export const TangramStage: React.FC<Grade1StageProps> = ({
  round,
  feedback,
  onSelect,
  onStepMistake,
}) => {
  const data = round.tangramData ?? {
    scene: 'house_roof',
    targetShape: 'triangle',
    targetLabel: 'Uchburchak',
  };
  const [wrongShape, setWrongShape] = useState<TangramShapeId | null>(null);
  const isSolved = feedback?.status === 'correct';

  const handlePieceClick = (shapeId: TangramShapeId) => {
    if (feedback) return;
    if (shapeId === data.targetShape) {
      setWrongShape(null);
      onSelect(data.targetLabel);
    } else {
      setWrongShape(shapeId);
      soundEngine.playWrong();
      onStepMistake?.(round.hint);
      window.setTimeout(() => setWrongShape((p) => (p === shapeId ? null : p)), 600);
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="relative rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 border-2 border-sky-200 overflow-hidden select-none">
        <svg viewBox="0 0 500 220" className="w-full h-[205px] sm:h-[222px]" aria-label="Shakllar konstruktori">
          {/* Ground grass / sea */}
          {data.scene === 'boat_sail' ? (
            <path d="M0,168 Q62,154 125,168 T250,168 T375,168 T500,168 L500,220 L0,220 Z" fill="#38BDF8" />
          ) : (
            <rect x="0" y="176" width="500" height="44" fill="#4ADE80" />
          )}

          {/* SCENE 1: House missing Triangle Roof */}
          {data.scene === 'house_roof' && (
            <g>
              {/* Walls */}
              <rect x="175" y="102" width="150" height="84" rx="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="3" />
              {/* Door */}
              <rect x="234" y="138" width="32" height="48" rx="4" fill="#92400E" />
              {/* Windows */}
              <rect x="192" y="120" width="28" height="28" rx="3" fill="#93C5FD" stroke="#1E40AF" strokeWidth="2.5" />
              <rect x="280" y="120" width="28" height="28" rx="3" fill="#93C5FD" stroke="#1E40AF" strokeWidth="2.5" />
              {/* Missing Roof Slot */}
              <motion.polygon
                points="250,24 342,102 158,102"
                fill={isSolved ? '#EF4444' : 'rgba(255,255,255,0.65)'}
                stroke={isSolved ? '#991B1B' : '#2563EB'}
                strokeWidth="3.5"
                strokeDasharray={isSolved ? undefined : '8 6'}
                strokeLinejoin="round"
                initial={false}
                animate={isSolved ? { scale: [0.85, 1.06, 1] } : { opacity: [0.65, 1, 0.65] }}
                transition={isSolved ? { duration: 0.4 } : { duration: 1.6, repeat: Infinity }}
              />
              {!isSolved && (
                <text x="250" y="78" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1E40AF">
                  Tom qismi (?)
                </text>
              )}
            </g>
          )}

          {/* SCENE 2: House missing Square Window */}
          {data.scene === 'house_window' && (
            <g>
              <polygon points="250,26 342,102 158,102" fill="#EF4444" stroke="#991B1B" strokeWidth="3" strokeLinejoin="round" />
              <rect x="175" y="102" width="150" height="84" rx="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="3" />
              <rect x="192" y="138" width="34" height="48" rx="4" fill="#92400E" />
              {/* Missing Square Window */}
              <motion.rect
                x="252"
                y="120"
                width="48"
                height="48"
                rx="4"
                fill={isSolved ? '#3B82F6' : 'rgba(255,255,255,0.75)'}
                stroke={isSolved ? '#1E40AF' : '#2563EB'}
                strokeWidth="3.5"
                strokeDasharray={isSolved ? undefined : '7 5'}
                animate={isSolved ? { scale: [0.82, 1.1, 1] } : { opacity: [0.65, 1, 0.65] }}
                transition={isSolved ? { duration: 0.4 } : { duration: 1.6, repeat: Infinity }}
              />
              {isSolved ? (
                <>
                  <line x1="276" y1="120" x2="276" y2="168" stroke="#FFFFFF" strokeWidth="2.5" />
                  <line x1="252" y1="144" x2="300" y2="144" stroke="#FFFFFF" strokeWidth="2.5" />
                </>
              ) : (
                <text x="276" y="149" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1E40AF">
                  ?
                </text>
              )}
            </g>
          )}

          {/* SCENE 3: Car missing Circle Wheels */}
          {data.scene === 'car_wheel' && (
            <g>
              {/* Road */}
              <rect x="0" y="176" width="500" height="44" fill="#64748B" />
              <line x1="20" y1="198" x2="480" y2="198" stroke="#FDE047" strokeWidth="4" strokeDasharray="24 18" />
              {/* Car Body */}
              <path
                d="M126,158 L126,118 C126,108 136,102 150,102 L182,102 L206,68 L302,68 L334,102 L364,106 C378,108 384,118 384,132 L384,158 Z"
                fill="#EF4444"
                stroke="#991B1B"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <polygon points="212,78 252,78 252,102 194,102" fill="#BAE6FD" stroke="#991B1B" strokeWidth="2" />
              <polygon points="262,78 296,78 320,102 262,102" fill="#BAE6FD" stroke="#991B1B" strokeWidth="2" />
              {/* Missing Front & Rear Wheels */}
              {[184, 326].map((cx) => (
                <g key={cx}>
                  <motion.circle
                    cx={cx}
                    cy="162"
                    r="26"
                    fill={isSolved ? '#1E293B' : 'rgba(255,255,255,0.82)'}
                    stroke={isSolved ? '#F59E0B' : '#2563EB'}
                    strokeWidth="4"
                    strokeDasharray={isSolved ? undefined : '7 5'}
                    animate={isSolved ? { scale: [0.8, 1.12, 1] } : { opacity: [0.65, 1, 0.65] }}
                    transition={isSolved ? { duration: 0.4 } : { duration: 1.6, repeat: Infinity }}
                  />
                  {isSolved ? (
                    <circle cx={cx} cy="162" r="10" fill="#FDE047" />
                  ) : (
                    <text x={cx} y="168" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1E40AF">
                      ?
                    </text>
                  )}
                </g>
              ))}
            </g>
          )}

          {/* SCENE 4: Boat missing Rectangle Cabin */}
          {data.scene === 'boat_sail' && (
            <g>
              {/* Mast & Sail */}
              <line x1="210" y1="42" x2="210" y2="146" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
              <polygon points="214,46 214,128 144,128" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" strokeLinejoin="round" />
              {/* Hull */}
              <path d="M124,146 L376,146 L346,184 L154,184 Z" fill="#B45309" stroke="#78350F" strokeWidth="3" strokeLinejoin="round" />
              {/* Missing Rectangular Cabin */}
              <motion.rect
                x="228"
                y="96"
                width="108"
                height="50"
                rx="5"
                fill={isSolved ? '#10B981' : 'rgba(255,255,255,0.78)'}
                stroke={isSolved ? '#065F46' : '#2563EB'}
                strokeWidth="3.5"
                strokeDasharray={isSolved ? undefined : '7 5'}
                animate={isSolved ? { scale: [0.85, 1.08, 1] } : { opacity: [0.65, 1, 0.65] }}
                transition={isSolved ? { duration: 0.4 } : { duration: 1.6, repeat: Infinity }}
              />
              {isSolved ? (
                <>
                  <circle cx="256" cy="121" r="9" fill="#BAE6FD" stroke="#065F46" strokeWidth="2" />
                  <circle cx="308" cy="121" r="9" fill="#BAE6FD" stroke="#065F46" strokeWidth="2" />
                </>
              ) : (
                <text x="282" y="126" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1E40AF">
                  Kayuta (?)
                </text>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* 4 Tactile Geometric Shape Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {TANGRAM_PIECES.map((piece) => {
          const isRight = isSolved && piece.id === data.targetShape;
          const isWrong = wrongShape === piece.id;
          return (
            <button
              key={piece.id}
              type="button"
              disabled={Boolean(feedback)}
              onClick={() => handlePieceClick(piece.id)}
              className={`min-h-[76px] rounded-2xl border-2 border-b-4 px-2 py-2 flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer ${
                isRight
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white scale-[1.03]'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 border-b-rose-800 text-white animate-alifbe-shake'
                  : 'bg-white hover:bg-sky-50 border-slate-300 border-b-slate-400 text-slate-900'
              }`}
            >
              <ShapeIconSvg
                id={piece.id}
                color={isRight || isWrong ? '#FFFFFF' : piece.color}
                stroke={isRight ? '#065F46' : isWrong ? '#881337' : piece.stroke}
              />
              <span className="text-xs sm:text-sm font-display font-extrabold whitespace-nowrap">
                {piece.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 6-DARS: "IKKITA CHO'NTAK" — Commutative Property (a + b = b + a)
// =========================================================================
export const TwoPocketsStage: React.FC<Grade1StageProps> = ({
  round,
  feedback,
  onSelect,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.pocketsData ?? {
    leftCount: 2,
    rightCount: 4,
    itemEmoji: '🌰',
    itemLabel: "yong'oq",
  };
  const emoji = data.itemEmoji ?? '🌰';
  const total = data.leftCount + data.rightCount;

  const [swapped, setSwapped] = useState(false);
  const [poured, setPoured] = useState(false);
  const [wrongOpt, setWrongOpt] = useState<string | null>(null);
  const isSolved = feedback?.status === 'correct';

  const currentLeft = swapped ? data.rightCount : data.leftCount;
  const currentRight = swapped ? data.leftCount : data.rightCount;

  const handleSwap = () => {
    if (feedback) return;
    soundEngine.playEquip();
    setSwapped((s) => !s);
    if (!swapped) {
      onStepSuccess?.("Qara! Cho'ntaklar almashdi — endi savatga to'kib jami nechta bo'lishini top!");
    }
  };

  const handlePour = () => {
    if (feedback || poured) return;
    soundEngine.playFruitPluck(total);
    setPoured(true);
  };

  const handleAnswer = (opt: string) => {
    if (feedback) return;
    if (opt === round.correctAnswer) {
      setPoured(true);
      onSelect(opt);
    } else {
      setWrongOpt(opt);
      soundEngine.playWrong();
      onStepMistake?.(round.hint);
      window.setTimeout(() => setWrongOpt(null), 650);
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="rounded-2xl bg-gradient-to-b from-indigo-50 via-sky-50 to-amber-50 border-2 border-indigo-200 p-4 select-none space-y-3">
        {/* Two Animated Stitched Pockets */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
          {/* Left Pocket */}
          <motion.div
            key={`L-${currentLeft}`}
            initial={{ y: -8, scale: 0.94 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="rounded-b-3xl rounded-t-xl bg-blue-600 border-2 border-blue-800 p-3 text-center shadow-md relative"
          >
            <div className="border-t-2 border-dashed border-blue-300/70 pt-1.5 text-[11px] font-bold text-blue-100">
              Chap cho&apos;ntak
            </div>
            <div className="min-h-[48px] flex flex-wrap items-center justify-center gap-1 my-1">
              {!poured ? (
                Array.from({ length: currentLeft }).map((_, i) => (
                  <span key={i} className="text-xl sm:text-2xl leading-none">
                    {emoji}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-blue-200">Savatga to&apos;kildi!</span>
              )}
            </div>
            <div className="font-mono-num text-xl font-black text-white">{currentLeft}</div>
          </motion.div>

          {/* Interactive Swap Button */}
          <button
            type="button"
            disabled={Boolean(feedback)}
            onClick={handleSwap}
            className="px-3 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 border-2 border-b-4 border-amber-600 text-slate-950 font-display font-extrabold text-xs sm:text-sm flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span>Almashtir</span>
          </button>

          {/* Right Pocket */}
          <motion.div
            key={`R-${currentRight}`}
            initial={{ y: -8, scale: 0.94 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="rounded-b-3xl rounded-t-xl bg-indigo-600 border-2 border-indigo-800 p-3 text-center shadow-md relative"
          >
            <div className="border-t-2 border-dashed border-indigo-300/70 pt-1.5 text-[11px] font-bold text-indigo-100">
              O&apos;ng cho&apos;ntak
            </div>
            <div className="min-h-[48px] flex flex-wrap items-center justify-center gap-1 my-1">
              {!poured ? (
                Array.from({ length: currentRight }).map((_, i) => (
                  <span key={i} className="text-xl sm:text-2xl leading-none">
                    {emoji}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-indigo-200">Savatga to&apos;kildi!</span>
              )}
            </div>
            <div className="font-mono-num text-xl font-black text-white">{currentRight}</div>
          </motion.div>
        </div>

        {/* Basket & Equation Comparison Strip */}
        <div className="rounded-2xl bg-white/90 border-2 border-amber-300 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="font-mono-num text-base sm:text-lg font-black text-slate-900">
            {currentLeft} + {currentRight} ={' '}
            <span className={isSolved ? 'text-emerald-600' : 'text-amber-600'}>
              {isSolved ? `${total} ✓` : '?'}
            </span>
          </div>

          {!poured ? (
            <button
              type="button"
              onClick={handlePour}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-xs sm:text-sm cursor-pointer transition-colors"
            >
              🧺 Savatga to&apos;kib sanaymiz!
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-1">
              {Array.from({ length: total }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ y: -18, scale: 0.4, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 320, damping: 16 }}
                  className="text-xl leading-none"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4 Big Answer Options */}
      <div className="grid grid-cols-4 gap-3">
        {round.options.map((opt) => {
          const isRight = isSolved && opt === round.correctAnswer;
          const isWrong = wrongOpt === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={Boolean(feedback)}
              onClick={() => handleAnswer(opt)}
              className={`min-h-[58px] rounded-2xl border-2 border-b-4 font-mono-num text-2xl sm:text-3xl font-black shadow-sm active:scale-95 transition-all cursor-pointer ${
                isRight
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white scale-[1.03]'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 border-b-rose-800 text-white animate-alifbe-shake'
                  : 'bg-white hover:bg-indigo-50 border-indigo-200 border-b-indigo-400 text-slate-900'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 7-DARS: "AQLLI POYEZD" — 10-seat Big Carriage + 1-seat Mini Carts (11..20)
// =========================================================================
export const TrainTensStage: React.FC<Grade1StageProps> = ({
  round,
  feedback,
  onSelect,
  onStepMistake,
}) => {
  const target = round.trainData?.targetNumber ?? 14;
  const [tensCars, setTensCars] = useState(0);
  const [onesCars, setOnesCars] = useState(0);
  const isSolved = feedback?.status === 'correct';
  const currentTotal = tensCars * 10 + onesCars;

  const handleAddTen = () => {
    if (feedback || tensCars >= 2) return;
    soundEngine.playFruitPluck(tensCars + 1);
    setTensCars((t) => t + 1);
  };

  const handleAddOne = () => {
    if (feedback || onesCars >= 9) return;
    soundEngine.playFruitPluck(onesCars + 2);
    setOnesCars((o) => o + 1);
  };

  const handleReset = () => {
    if (feedback) return;
    setTensCars(0);
    setOnesCars(0);
  };

  const handleCheck = () => {
    if (feedback) return;
    if (currentTotal === target) {
      onSelect(String(target));
    } else {
      soundEngine.playWrong();
      const neededTens = Math.floor(target / 10);
      const neededOnes = target % 10;
      onStepMistake?.(
        `Hozir poyezdda ${currentTotal} ta o'rindiq bor. ${target} soni uchun ${neededTens} ta katta vagon (10) va ${neededOnes} ta kichik o'rindiq (1) ulang!`
      );
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Railway Track Stage */}
      <div className="relative rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 border-2 border-sky-200 px-3 pt-3 pb-4 overflow-hidden select-none">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <span className="text-xs font-bold text-slate-700">
            Poyezd maqsadi:{' '}
            <span className="font-mono-num text-base font-black text-blue-700">{target}</span>
          </span>
          <span
            className={`font-mono-num text-sm sm:text-base font-black px-3 py-0.5 rounded-xl border ${
              isSolved
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white text-slate-900 border-sky-300'
            }`}
          >
            Hozir: {tensCars * 10} + {onesCars} = {currentTotal}
          </span>
        </div>

        {/* Animated Train Row */}
        <motion.div
          animate={isSolved ? { x: [0, 14, 180] } : { x: 0 }}
          transition={isSolved ? { duration: 1.15, ease: 'easeIn' } : { duration: 0.3 }}
          className="min-h-[118px] flex items-end gap-1.5 overflow-x-auto pb-3 px-1"
        >
          {/* Red Steam Locomotive */}
          <div className="shrink-0 relative flex flex-col items-center">
            <div className="w-20 h-16 rounded-t-2xl rounded-br-xl bg-rose-600 border-2 border-rose-900 relative flex items-center justify-center shadow-md">
              {/* Chimney */}
              <div className="absolute -top-4 left-3 w-4 h-5 bg-slate-800 rounded-t-md" />
              {/* Cabin Window */}
              <div className="w-8 h-6 rounded-md bg-sky-200 border-2 border-rose-900" />
              {/* Headlight */}
              <div className="absolute -right-1.5 bottom-3 w-3 h-3 rounded-full bg-amber-300 border border-amber-600" />
            </div>
            <div className="flex items-center gap-3 -mt-1.5">
              <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-amber-400" />
              <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-amber-400" />
            </div>
          </div>

          {/* Big 10-Seat Carriages */}
          <AnimatePresence>
            {Array.from({ length: tensCars }).map((_, idx) => (
              <motion.div
                key={`ten-${idx}`}
                initial={{ scale: 0.4, y: -24, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                className="shrink-0 flex flex-col items-center"
              >
                <div className="w-28 h-14 rounded-xl bg-blue-600 border-2 border-blue-900 p-1.5 shadow-md flex flex-col justify-between">
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 10 }).map((__, w) => (
                      <div key={w} className="h-2 rounded-xs bg-amber-200" />
                    ))}
                  </div>
                  <div className="text-center font-mono-num text-xs font-black text-white leading-none">
                    10
                  </div>
                </div>
                <div className="flex items-center gap-10 -mt-1.5">
                  <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-400" />
                  <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-400" />
                </div>
              </motion.div>
            ))}

            {/* Small 1-Seat Mini Carts */}
            {Array.from({ length: onesCars }).map((_, idx) => (
              <motion.div
                key={`one-${idx}`}
                initial={{ scale: 0.4, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                className="shrink-0 flex flex-col items-center"
              >
                <div className="w-9 h-10 rounded-lg bg-amber-400 border-2 border-amber-700 flex items-center justify-center font-mono-num text-sm font-black text-slate-950 shadow-sm">
                  1
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-400 -mt-1" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Railway Ties */}
        <div className="h-2.5 w-full rounded-full bg-amber-900/75 border-t-2 border-slate-400" />
      </div>

      {/* Controls: +10 Carriage, +1 Seat, Reset, Go! */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          disabled={Boolean(feedback) || tensCars >= 2}
          onClick={handleAddTen}
          className="min-h-[56px] rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 border-b-4 border-blue-800 disabled:border-slate-300 text-white font-display font-extrabold text-xs sm:text-sm px-2.5 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Vagon (10)</span>
        </button>

        <button
          type="button"
          disabled={Boolean(feedback) || onesCars >= 9}
          onClick={handleAddOne}
          className="min-h-[56px] rounded-2xl bg-amber-400 hover:bg-amber-500 disabled:bg-slate-200 disabled:text-slate-400 border-b-4 border-amber-600 disabled:border-slate-300 text-slate-950 font-display font-extrabold text-xs sm:text-sm px-2.5 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>O&apos;rindiq (1)</span>
        </button>

        <button
          type="button"
          disabled={Boolean(feedback) || currentTotal === 0}
          onClick={handleReset}
          className="min-h-[56px] rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-50 border-2 border-b-4 border-slate-300 text-slate-700 font-display font-bold text-xs sm:text-sm px-2.5 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span>Tozalash</span>
        </button>

        <button
          type="button"
          disabled={Boolean(feedback) || currentTotal === 0}
          onClick={handleCheck}
          className="min-h-[56px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 border-b-4 border-emerald-800 disabled:border-slate-300 text-white font-display font-extrabold text-xs sm:text-sm px-2.5 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4 shrink-0" />
          <span>Yurgizish!</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 8-DARS: "SEHRLI QULF" — 2-Step Locked Parentheses Chest Unlock
// =========================================================================
export const MagicLockStage: React.FC<Grade1StageProps> = ({
  round,
  feedback,
  onSelect,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.lockData ?? {
    outerNum: 10,
    outerOp: '-',
    bracketFirst: false,
    innerA: 3,
    innerB: 2,
    innerOp: '+',
    innerResult: 5,
    innerOptions: ['4', '5', '6', '7'],
    finalResult: 5,
  };

  const [unlocked, setUnlocked] = useState(false);
  const [wrongOpt, setWrongOpt] = useState<string | null>(null);
  const isSolved = feedback?.status === 'correct';

  const opSymbol = (op: '+' | '-') => (op === '+' ? '+' : '−');

  const handleStep1Pick = (opt: string) => {
    if (feedback || unlocked) return;
    if (opt === String(data.innerResult)) {
      soundEngine.playCoin();
      setUnlocked(true);
      setWrongOpt(null);
      onStepSuccess?.(`Ajoyib! Qulf ochildi: (${data.innerA} ${opSymbol(data.innerOp)} ${data.innerB}) = ${data.innerResult}! Endi tashqarisini hisobla!`);
    } else {
      setWrongOpt(opt);
      soundEngine.playWrong();
      onStepMistake?.(`Avval sandiq ichini hisobla: ${data.innerA} ${opSymbol(data.innerOp)} ${data.innerB} nechaga teng?`);
      window.setTimeout(() => setWrongOpt(null), 600);
    }
  };

  const handleStep2Pick = (opt: string) => {
    if (feedback || !unlocked) return;
    if (opt === String(data.finalResult)) {
      onSelect(opt);
    } else {
      setWrongOpt(opt);
      soundEngine.playWrong();
      onStepMistake?.(round.hint);
      window.setTimeout(() => setWrongOpt(null), 600);
    }
  };

  const chestBox = (
    <motion.div
      animate={unlocked ? { scale: [1, 1.14, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-2xl border-2 px-4 py-2.5 flex items-center gap-2 shadow-md ${
        unlocked
          ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
          : 'bg-amber-100 border-amber-500 text-amber-950'
      }`}
    >
      {unlocked ? (
        <Unlock className="w-5 h-5 text-emerald-600 shrink-0" />
      ) : (
        <Lock className="w-5 h-5 text-amber-700 shrink-0" />
      )}
      <span className="font-mono-num text-2xl sm:text-3xl font-black">
        {unlocked
          ? data.innerResult
          : `(${data.innerA} ${opSymbol(data.innerOp)} ${data.innerB})`}
      </span>
    </motion.div>
  );

  const outerPart = (
    <div
      className={`rounded-2xl border-2 px-4 py-2.5 font-mono-num text-2xl sm:text-3xl font-black transition-all ${
        unlocked
          ? 'bg-white border-blue-400 text-slate-900 shadow-sm'
          : 'bg-slate-200/70 border-slate-300 text-slate-400'
      }`}
    >
      {data.outerNum}
    </div>
  );

  const activeOptions = unlocked ? round.options : data.innerOptions;

  return (
    <div className="space-y-3.5">
      <div className="rounded-2xl bg-gradient-to-b from-amber-50 via-yellow-50/50 to-indigo-50 border-2 border-amber-200 p-5 select-none space-y-4">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-extrabold">
          <span className={unlocked ? 'text-emerald-700' : 'text-amber-800'}>
            {unlocked ? '1-qadam: Sandiq ochildi ✓' : '1-qadam: Qulflangan sandiq ichini och!'}
          </span>
          <span className="text-slate-300">·</span>
          <span className={isSolved ? 'text-emerald-700' : unlocked ? 'text-blue-700' : 'text-slate-400'}>
            2-qadam: Yakuniy javob
          </span>
        </div>

        {/* Equation Stage with Padlocked Chest */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
          {data.bracketFirst ? (
            <>
              {chestBox}
              <span className={`font-mono-num text-3xl font-black ${unlocked ? 'text-blue-700' : 'text-slate-400'}`}>
                {opSymbol(data.outerOp)}
              </span>
              {outerPart}
            </>
          ) : (
            <>
              {outerPart}
              <span className={`font-mono-num text-3xl font-black ${unlocked ? 'text-blue-700' : 'text-slate-400'}`}>
                {opSymbol(data.outerOp)}
              </span>
              {chestBox}
            </>
          )}
          <span className="font-mono-num text-3xl font-black text-slate-500">=</span>
          <div
            className={`min-w-[58px] h-14 rounded-2xl border-2 flex items-center justify-center font-mono-num text-2xl sm:text-3xl font-black ${
              isSolved
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'bg-white border-dashed border-blue-400 text-blue-600'
            }`}
          >
            {isSolved ? data.finalResult : '?'}
          </div>
        </div>

        {/* Helpful step caption */}
        <div className="text-center text-xs sm:text-sm font-bold text-slate-700">
          {!unlocked ? (
            <span>
              🔑 Kalitni top: <span className="font-mono-num text-amber-800">{data.innerA} {opSymbol(data.innerOp)} {data.innerB} = ?</span>
            </span>
          ) : (
            <span>
              ✨ Endi tashqarisini yech:{' '}
              <span className="font-mono-num text-blue-800">
                {data.bracketFirst
                  ? `${data.innerResult} ${opSymbol(data.outerOp)} ${data.outerNum} = ?`
                  : `${data.outerNum} ${opSymbol(data.outerOp)} ${data.innerResult} = ?`}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* 4 Key Option Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {activeOptions.map((opt) => {
          const isRight = isSolved && opt === String(data.finalResult);
          const isWrong = wrongOpt === opt;
          return (
            <button
              key={`${unlocked ? 's2' : 's1'}-${opt}`}
              type="button"
              disabled={Boolean(feedback)}
              onClick={() => (unlocked ? handleStep2Pick(opt) : handleStep1Pick(opt))}
              className={`min-h-[60px] rounded-2xl border-2 border-b-4 font-mono-num text-2xl sm:text-3xl font-black shadow-sm active:scale-95 transition-all cursor-pointer ${
                isRight
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white scale-[1.03]'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 border-b-rose-800 text-white animate-alifbe-shake'
                  : unlocked
                  ? 'bg-white hover:bg-blue-50 border-blue-300 border-b-blue-500 text-slate-900'
                  : 'bg-white hover:bg-amber-50 border-amber-300 border-b-amber-500 text-slate-900'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 9-DARS: "KO'PRIK QURISH" — Make-10 Bridge Builder (8 + 5 -> 8+2=10 -> +3=13)
// =========================================================================
export const BridgeTensStage: React.FC<Grade1StageProps> = ({
  round,
  feedback,
  onSelect,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.bridgeData ?? {
    mode: 'add',
    startNum: 8,
    deltaNum: 5,
    step1Target: 2,
    step1Options: ['1', '2', '3', '4'],
    step2Remainder: 3,
    finalResult: 13,
  };

  const [step1Done, setStep1Done] = useState(false);
  const [wrongOpt, setWrongOpt] = useState<string | null>(null);
  const isSolved = feedback?.status === 'correct';

  const handleStep1 = (opt: string) => {
    if (feedback || step1Done) return;
    if (opt === String(data.step1Target)) {
      soundEngine.playScaleBalance();
      setStep1Done(true);
      setWrongOpt(null);
      const msg =
        data.mode === 'add'
          ? `Barakalla! ${data.startNum} + ${data.step1Target} = 10 ta tayanch tayyor! Endi qolgan ${data.step2Remainder} ta taxtani qo'sh!`
          : `Barakalla! ${data.startNum} − ${data.step1Target} = 10 bo'ldi! Endi qolgan ${data.step2Remainder} tani ayir!`;
      onStepSuccess?.(msg);
    } else {
      setWrongOpt(opt);
      soundEngine.playWrong();
      onStepMistake?.(
        data.mode === 'add'
          ? `${data.startNum} ga nechta taxta qo'shsak, roppa-rosa 10 ta bo'ladi?`
          : `${data.startNum} dan nechta olsak, roppa-rosa 10 ta qoladi?`
      );
      window.setTimeout(() => setWrongOpt(null), 600);
    }
  };

  const handleStep2 = (opt: string) => {
    if (feedback || !step1Done) return;
    if (opt === String(data.finalResult)) {
      onSelect(opt);
    } else {
      setWrongOpt(opt);
      soundEngine.playWrong();
      onStepMistake?.(round.hint);
      window.setTimeout(() => setWrongOpt(null), 600);
    }
  };

  // Visual plank count for bridge display
  const totalPlanks = data.mode === 'add' ? data.finalResult : data.startNum;
  const filledPlanks =
    data.mode === 'add'
      ? isSolved
        ? data.finalResult
        : step1Done
        ? 10
        : data.startNum
      : isSolved
      ? data.finalResult
      : step1Done
      ? 10
      : data.startNum;

  const activeOptions = step1Done ? round.options : data.step1Options;

  return (
    <div className="space-y-3.5">
      {/* River & Wooden Bridge SVG */}
      <div className="relative rounded-2xl bg-gradient-to-b from-sky-100 via-cyan-50 to-sky-200 border-2 border-sky-200 px-3 pt-3 pb-2 overflow-hidden select-none">
        {/* Step prompt strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 mb-1">
          <span className="text-xs font-extrabold text-sky-950">
            {!step1Done
              ? data.mode === 'add'
                ? `1-qadam: Avval 10 qilib to'ldir (${data.startNum} + ? = 10)`
                : `1-qadam: Avval 10 gacha tushir (${data.startNum} − ? = 10)`
              : data.mode === 'add'
              ? `2-qadam: Qolgan ${data.step2Remainder} tani qo'sh (10 + ${data.step2Remainder} = ?)`
              : `2-qadam: Qolgan ${data.step2Remainder} tani ayir (10 − ${data.step2Remainder} = ?)`}
          </span>
          <span className="font-mono-num text-sm font-black text-blue-800 bg-white px-2.5 py-0.5 rounded-lg border border-sky-300">
            {data.startNum} {data.mode === 'add' ? '+' : '−'} {data.deltaNum} ={' '}
            {isSolved ? data.finalResult : '?'}
          </span>
        </div>

        <svg viewBox="0 0 520 185" className="w-full h-[170px] sm:h-[185px]" aria-label="Ko'prik qurish">
          {/* Sparkling River */}
          <rect x="70" y="138" width="380" height="47" fill="#0EA5E9" />
          <path d="M90,158 Q120,150 150,158 T210,158 T270,158 T330,158 T390,158" fill="none" stroke="#BAE6FD" strokeWidth="3" strokeLinecap="round" />

          {/* Left & Right Green Banks */}
          <path d="M0,108 L82,108 L96,185 L0,185 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
          <path d="M438,108 L520,108 L520,185 L424,185 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />

          {/* Victory Flag on Right Bank */}
          <line x1="478" y1="54" x2="478" y2="108" stroke="#78350F" strokeWidth="3.5" />
          <polygon points="478,56 508,67 478,78" fill="#FACC15" stroke="#B45309" strokeWidth="2" />

          {/* Bridge Rope Guide */}
          <line x1="80" y1="114" x2="440" y2="114" stroke="#92400E" strokeWidth="3" strokeDasharray="6 4" />

          {/* Planks */}
          {Array.from({ length: totalPlanks }).map((_, i) => {
            const plankSpan = 352 / totalPlanks;
            const px = 84 + i * plankSpan;
            const isTenMilestone = i === 9;
            const isFilled = i < filledPlanks;

            return (
              <g key={i}>
                <motion.rect
                  x={px + 1}
                  y={104}
                  width={Math.max(12, plankSpan - 4)}
                  height="18"
                  rx="4"
                  fill={
                    isFilled
                      ? isTenMilestone
                        ? '#16A34A'
                        : i < 10
                        ? '#D97706'
                        : '#2563EB'
                      : 'rgba(255,255,255,0.65)'
                  }
                  stroke={isFilled ? '#78350F' : '#0284C7'}
                  strokeWidth="1.8"
                  strokeDasharray={isFilled ? undefined : '3 2'}
                  initial={false}
                  animate={{ y: isFilled ? 104 : 107, opacity: isFilled ? 1 : 0.7 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                />
                {isTenMilestone && (
                  <g>
                    <rect
                      x={px + plankSpan / 2 - 14}
                      y="126"
                      width="28"
                      height="20"
                      rx="6"
                      fill={step1Done || data.mode === 'subtract' ? '#16A34A' : '#F59E0B'}
                    />
                    <text
                      x={px + plankSpan / 2}
                      y="140"
                      textAnchor="middle"
                      className="font-mono-num"
                      fontSize="12"
                      fontWeight="900"
                      fill="#FFFFFF"
                    >
                      10
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Cheerful Runner Character crossing bridge! */}
          <motion.g
            initial={{ x: 42, y: 84 }}
            animate={
              isSolved
                ? { x: 458, y: [84, 72, 84, 72, 84] }
                : step1Done
                ? { x: 84 + (352 / totalPlanks) * 9.5, y: 84 }
                : { x: 42, y: 84 }
            }
            transition={{ duration: isSolved ? 1.05 : 0.55, ease: 'easeInOut' }}
          >
            {/* Head */}
            <circle cx="0" cy="-14" r="12" fill="#FCD2A2" stroke="#78350F" strokeWidth="2" />
            <circle cx="-3.5" cy="-15" r="1.8" fill="#0F172A" />
            <circle cx="3.5" cy="-15" r="1.8" fill="#0F172A" />
            <path d="M-4,-10 Q0,-6 4,-10" fill="none" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
            {/* Body */}
            <rect x="-9" y="-2" width="18" height="20" rx="5" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2" />
          </motion.g>
        </svg>
      </div>

      {/* 4 Big Options for Step 1 or Step 2 */}
      <div className="grid grid-cols-4 gap-3">
        {activeOptions.map((opt) => {
          const isRight = isSolved && opt === String(data.finalResult);
          const isWrong = wrongOpt === opt;
          return (
            <button
              key={`${step1Done ? 'b2' : 'b1'}-${opt}`}
              type="button"
              disabled={Boolean(feedback)}
              onClick={() => (step1Done ? handleStep2(opt) : handleStep1(opt))}
              className={`min-h-[58px] rounded-2xl border-2 border-b-4 font-mono-num text-2xl sm:text-3xl font-black shadow-sm active:scale-95 transition-all cursor-pointer ${
                isRight
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white scale-[1.03]'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 border-b-rose-800 text-white animate-alifbe-shake'
                  : 'bg-white hover:bg-sky-50 border-sky-300 border-b-sky-500 text-slate-900'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 10-DARS: "MAKTAB BANKI" — Counting by 10s (10, 20, 30... 100)
// =========================================================================
export const BankTensStage: React.FC<Grade1StageProps> = ({
  round,
  feedback,
  onSelect,
  onStepMistake,
}) => {
  const data = round.bankData ?? {
    itemEmoji: '📖',
    itemName: 'Ertak kitobi',
    targetPrice: 50,
  };
  const [coinCount, setCoinCount] = useState(0);
  const currentAmount = coinCount * 10;
  const isSolved = feedback?.status === 'correct';

  const handleAddCoin = () => {
    if (feedback || coinCount >= 10) return;
    const next = coinCount + 1;
    setCoinCount(next);
    soundEngine.playFruitPluck(next);
  };

  const handleRemoveCoin = () => {
    if (feedback || coinCount <= 0) return;
    setCoinCount((c) => c - 1);
    soundEngine.playEquip();
  };

  const handleBuy = () => {
    if (feedback) return;
    if (currentAmount === data.targetPrice) {
      soundEngine.playPurchase();
      onSelect(String(data.targetPrice));
    } else {
      soundEngine.playWrong();
      const needed = data.targetPrice / 10;
      onStepMistake?.(
        currentAmount < data.targetPrice
          ? `Hozir ${currentAmount} tanga qo'ydingiz. ${data.targetPrice} tanga uchun jami ${needed} ta 10 talik tanga kerak!`
          : `Hozir ${currentAmount} tanga bo'lib ketdi! ${data.targetPrice} tanga bo'lishi uchun ortiqchasini oling!`
      );
    }
  };

  return (
    <div className="space-y-3.5">
      {/* School Shop Counter */}
      <div className="rounded-2xl bg-gradient-to-b from-amber-50 via-yellow-50/40 to-emerald-50 border-2 border-amber-200 p-4 select-none space-y-3">
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          {/* Shop Item Pedestal */}
          <div className="relative rounded-2xl bg-white border-2 border-amber-300 px-4 py-3 flex flex-col items-center justify-center min-w-[132px] shadow-xs">
            <span className="text-5xl leading-none mb-1">{data.itemEmoji}</span>
            <span className="text-xs font-extrabold text-slate-800 text-center">{data.itemName}</span>
            <span className="mt-1 font-mono-num text-base font-black text-amber-700">
              🪙 {data.targetPrice} tanga
            </span>
            {isSolved && (
              <motion.div
                initial={{ scale: 0.4, rotate: -14, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                className="absolute -top-2.5 -right-2.5 rounded-xl bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-black shadow-md"
              >
                OLINDI ✓
              </motion.div>
            )}
          </div>

          {/* Teller Counter Coin Tray */}
          <div className="rounded-2xl bg-amber-100/75 border-2 border-amber-300 p-3 min-h-[126px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-amber-950">
              <span>Peshtaxtadagi 10 talik tangalar:</span>
              <span className="font-mono-num text-base font-black text-emerald-800">
                {currentAmount} tanga
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 my-2 min-h-[48px]">
              <AnimatePresence>
                {Array.from({ length: coinCount }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: -26, scale: 0.4, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className="w-11 h-11 rounded-full bg-amber-400 border-2 border-amber-700 shadow-sm flex flex-col items-center justify-center"
                  >
                    <span className="font-mono-num text-xs font-black text-amber-950 leading-none">
                      10
                    </span>
                    <span className="font-mono-num text-[9px] font-bold text-amber-900 leading-none mt-0.5">
                      {(idx + 1) * 10}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {coinCount === 0 && (
                <span className="text-xs font-semibold text-amber-800/70">
                  Pastdagi &quot;+ 10 tanga&quot; tugmasini bosib sanab qo&apos;ying!
                </span>
              )}
            </div>

            {/* Skip-counting chant strip */}
            {coinCount > 0 && (
              <div className="font-mono-num text-xs font-bold text-amber-900">
                {Array.from({ length: coinCount })
                  .map((_, i) => (i + 1) * 10)
                  .join(' → ')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls: +10, -10, Buy */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          disabled={Boolean(feedback) || coinCount >= 10}
          onClick={handleAddCoin}
          className="min-h-[58px] rounded-2xl bg-amber-400 hover:bg-amber-500 disabled:bg-slate-200 disabled:text-slate-400 border-b-4 border-amber-600 disabled:border-slate-300 text-slate-950 font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>10 tanga</span>
        </button>

        <button
          type="button"
          disabled={Boolean(feedback) || coinCount <= 0}
          onClick={handleRemoveCoin}
          className="min-h-[58px] rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-50 border-2 border-b-4 border-slate-300 text-slate-700 font-display font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Minus className="w-5 h-5" />
          <span>Olish</span>
        </button>

        <button
          type="button"
          disabled={Boolean(feedback) || coinCount === 0}
          onClick={handleBuy}
          className="min-h-[58px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 border-b-4 border-emerald-800 disabled:border-slate-300 text-white font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Sotib olish!</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 11-DARS: "RANGLI MINORA" — Tens (Blue) & Ones (Green) Tower Builder
// =========================================================================
export const TowerBlocksStage: React.FC<Grade1StageProps> = ({
  round,
  feedback,
  onSelect,
  onStepMistake,
}) => {
  const data = round.towerData ?? {
    mode: 'add',
    startNum: 24,
    deltaNum: 12,
    targetNum: 36,
  };

  const [tens, setTens] = useState(Math.floor(data.startNum / 10));
  const [ones, setOnes] = useState(data.startNum % 10);
  const isSolved = feedback?.status === 'correct';
  const currentNum = tens * 10 + ones;

  const startTens = Math.floor(data.startNum / 10);
  const startOnes = data.startNum % 10;
  const deltaTens = Math.floor(data.deltaNum / 10);
  const deltaOnes = data.deltaNum % 10;

  const handleCheck = () => {
    if (feedback) return;
    if (currentNum === data.targetNum) {
      onSelect(String(data.targetNum));
    } else {
      soundEngine.playWrong();
      const targetT = Math.floor(data.targetNum / 10);
      const targetO = data.targetNum % 10;
      onStepMistake?.(
        `O'nliklar ustunini ${targetT} ga, birliklar ustunini ${targetO} ga keltiring! (${data.startNum} ${
          data.mode === 'add' ? '+' : '−'
        } ${data.deltaNum} = ${data.targetNum})`
      );
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="rounded-2xl bg-gradient-to-b from-slate-50 via-blue-50/40 to-emerald-50/50 border-2 border-blue-200 p-4 select-none space-y-3">
        {/* Equation Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-mono-num text-lg sm:text-xl font-black text-slate-900">
            <span className="text-blue-600">{startTens}</span>
            <span className="text-emerald-600">{startOnes}</span>{' '}
            <span>{data.mode === 'add' ? '+' : '−'}</span>{' '}
            <span className="text-blue-600">{deltaTens}</span>
            <span className="text-emerald-600">{deltaOnes}</span> ={' '}
            <span className={isSolved ? 'text-emerald-600' : 'text-amber-600'}>
              {isSolved ? data.targetNum : '?'}
            </span>
          </div>
          <div className="font-mono-num text-xl sm:text-2xl font-black bg-white border-2 border-slate-200 rounded-xl px-3 py-0.5">
            <span className="text-blue-600">{tens}</span>
            <span className="text-emerald-600">{ones}</span>
          </div>
        </div>

        {/* Two Side-by-Side Color-Coded Towers */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* LEFT: Blue Tens Tower */}
          <div className="rounded-2xl bg-blue-50/80 border-2 border-blue-200 p-3 flex flex-col items-center">
            <div className="text-xs font-extrabold text-blue-900 mb-2">
              Moviy O&apos;nliklar ({tens * 10})
            </div>

            <div className="h-[112px] w-full flex flex-col-reverse items-center justify-start gap-1 overflow-hidden">
              {Array.from({ length: tens }).map((_, idx) => (
                <motion.div
                  key={`t-${idx}`}
                  initial={{ scale: 0.5, y: -12 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-24 h-3.5 rounded-md bg-blue-600 border border-blue-800 shadow-xs flex items-center justify-center text-[9px] font-mono-num font-black text-white"
                >
                  10
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2.5 w-full">
              <button
                type="button"
                disabled={Boolean(feedback) || tens <= 0}
                onClick={() => {
                  soundEngine.playEquip();
                  setTens((v) => Math.max(0, v - 1));
                }}
                className="flex-1 h-10 rounded-xl bg-white hover:bg-blue-100 disabled:opacity-40 border-2 border-blue-300 text-blue-800 font-black flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono-num text-lg font-black text-blue-700 w-7 text-center">
                {tens}
              </span>
              <button
                type="button"
                disabled={Boolean(feedback) || tens >= 9}
                onClick={() => {
                  soundEngine.playFruitPluck(tens + 1);
                  setTens((v) => Math.min(9, v + 1));
                }}
                className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-black flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: Green Ones Tower */}
          <div className="rounded-2xl bg-emerald-50/80 border-2 border-emerald-200 p-3 flex flex-col items-center">
            <div className="text-xs font-extrabold text-emerald-900 mb-2">
              Yashil Birliklar ({ones})
            </div>

            <div className="h-[112px] w-full flex flex-col-reverse items-center justify-start gap-1 overflow-hidden">
              {Array.from({ length: ones }).map((_, idx) => (
                <motion.div
                  key={`o-${idx}`}
                  initial={{ scale: 0.5, y: -12 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-12 h-3.5 rounded-md bg-emerald-500 border border-emerald-700 shadow-xs flex items-center justify-center text-[9px] font-mono-num font-black text-white"
                >
                  1
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2.5 w-full">
              <button
                type="button"
                disabled={Boolean(feedback) || ones <= 0}
                onClick={() => {
                  soundEngine.playEquip();
                  setOnes((v) => Math.max(0, v - 1));
                }}
                className="flex-1 h-10 rounded-xl bg-white hover:bg-emerald-100 disabled:opacity-40 border-2 border-emerald-300 text-emerald-800 font-black flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono-num text-lg font-black text-emerald-700 w-7 text-center">
                {ones}
              </span>
              <button
                type="button"
                disabled={Boolean(feedback) || ones >= 9}
                onClick={() => {
                  soundEngine.playFruitPluck(ones + 1);
                  setOnes((v) => Math.min(9, v + 1));
                }}
                className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={Boolean(feedback)}
        onClick={handleCheck}
        className="w-full min-h-[56px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 border-b-4 border-emerald-800 text-white font-display font-extrabold text-base shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Check className="w-5 h-5" />
        <span>Minorani tekshirish ({currentNum})</span>
      </button>
    </div>
  );
};

// =========================================================================
// 12-DARS: "SEHRLI ZANJIR" — Pair the two 10-friends first, then add 3rd!
// =========================================================================
export const MagicChainStage: React.FC<Grade1StageProps> = ({
  round,
  feedback,
  onSelect,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.chainData ?? {
    nums: [7, 5, 3] as [number, number, number],
    pairIndices: [0, 2] as [number, number],
    remainingIndex: 1,
    finalResult: 15,
  };

  const [selectedOrbs, setSelectedOrbs] = useState<number[]>([]);
  const [linkedTen, setLinkedTen] = useState(false);
  const [wrongOpt, setWrongOpt] = useState<string | null>(null);
  const isSolved = feedback?.status === 'correct';

  const orbX = [100, 250, 400];
  const remainingVal = data.nums[data.remainingIndex];
  const pairA = data.nums[data.pairIndices[0]];
  const pairB = data.nums[data.pairIndices[1]];

  const handleOrbTap = (idx: number) => {
    if (feedback || linkedTen) return;
    if (selectedOrbs.includes(idx)) {
      setSelectedOrbs(selectedOrbs.filter((i) => i !== idx));
      return;
    }

    soundEngine.playEquip();
    const next = [...selectedOrbs, idx];
    if (next.length < 2) {
      setSelectedOrbs(next);
      return;
    }

    const sum = data.nums[next[0]] + data.nums[next[1]];
    if (sum === 10) {
      soundEngine.playScaleBalance();
      setSelectedOrbs(next);
      setLinkedTen(true);
      onStepSuccess?.(
        `Ajoyib! ${data.nums[next[0]]} va ${data.nums[next[1]]} — 10 lik do'stlar! Endi 10 + ${remainingVal} ni top!`
      );
    } else {
      soundEngine.playWrong();
      onStepMistake?.(
        `${data.nums[next[0]]} + ${data.nums[next[1]]} = ${sum} bo'ladi. Qo'shilganda roppa-rosa 10 bo'ladigan ikkita do'st sonni bosing!`
      );
      setSelectedOrbs([]);
    }
  };

  const handleFinalPick = (opt: string) => {
    if (feedback || !linkedTen) return;
    if (opt === String(data.finalResult)) {
      onSelect(opt);
    } else {
      setWrongOpt(opt);
      soundEngine.playWrong();
      onStepMistake?.(`10 ga ${remainingVal} ni qo'shish juda oson: 10 + ${remainingVal}!`);
      window.setTimeout(() => setWrongOpt(null), 600);
    }
  };

  const [p0, p1] = data.pairIndices;
  const arcX0 = orbX[p0];
  const arcX1 = orbX[p1];
  const arcMid = (arcX0 + arcX1) / 2;

  return (
    <div className="space-y-3.5">
      <div className="rounded-2xl bg-gradient-to-b from-indigo-950 via-violet-950 to-slate-900 border-2 border-violet-500/50 px-3 pt-3 pb-4 overflow-hidden select-none text-white">
        <div className="text-center text-xs sm:text-sm font-bold text-amber-300 mb-1">
          {!linkedTen
            ? "1-qadam: Qo'shilsa 10 bo'ladigan 2 ta do'st sonni bosib bog'la!"
            : `2-qadam: Zanjir porladi! Endi 10 + ${remainingVal} = ?`}
        </div>

        <svg viewBox="0 0 500 164" className="w-full h-[155px] sm:h-[170px]" aria-label="Sehrli zanjir">
          {/* Glowing Golden Link Arc when 10-friends are paired */}
          {linkedTen && (
            <motion.path
              d={`M ${arcX0},92 Q ${arcMid},14 ${arcX1},92`}
              fill="none"
              stroke="#FACC15"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
            />
          )}

          {/* Golden "10!" Medallion above arc */}
          {linkedTen && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.4, 1.2, 1], opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <circle cx={arcMid} cy="40" r="22" fill="#FACC15" stroke="#FEF08A" strokeWidth="3" />
              <text
                x={arcMid}
                y="47"
                textAnchor="middle"
                className="font-mono-num"
                fontSize="20"
                fontWeight="900"
                fill="#0F172A"
              >
                10
              </text>
            </motion.g>
          )}

          {/* Plus signs between orbs */}
          <text x="175" y="102" textAnchor="middle" className="font-mono-num" fontSize="28" fontWeight="900" fill="#A78BFA">
            +
          </text>
          <text x="325" y="102" textAnchor="middle" className="font-mono-num" fontSize="28" fontWeight="900" fill="#A78BFA">
            +
          </text>

          {/* 3 Interactive Magic Orbs */}
          {data.nums.map((num, idx) => {
            const isSelected = selectedOrbs.includes(idx);
            const isFriend = linkedTen && data.pairIndices.includes(idx);
            const isThirdLit = isSolved && idx === data.remainingIndex;

            return (
              <g
                key={idx}
                transform={`translate(${orbX[idx]}, 94)`}
                onClick={() => handleOrbTap(idx)}
                style={{ cursor: linkedTen || feedback ? 'default' : 'pointer' }}
              >
                <motion.g
                  whileHover={!linkedTen && !feedback ? { scale: 1.12 } : undefined}
                  whileTap={!linkedTen && !feedback ? { scale: 0.92 } : undefined}
                  animate={
                    isFriend || isThirdLit
                      ? { scale: [1, 1.12, 1] }
                      : isSelected
                      ? { scale: 1.1 }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.35 }}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="34"
                    fill={
                      isFriend
                        ? '#F59E0B'
                        : isThirdLit
                        ? '#10B981'
                        : isSelected
                        ? '#38BDF8'
                        : '#4C1D95'
                    }
                    stroke={
                      isFriend
                        ? '#FEF08A'
                        : isSelected
                        ? '#BAE6FD'
                        : '#A78BFA'
                    }
                    strokeWidth="4"
                  />
                  <text
                    x="0"
                    y="11"
                    textAnchor="middle"
                    className="font-mono-num"
                    fontSize="30"
                    fontWeight="900"
                    fill="#FFFFFF"
                  >
                    {num}
                  </text>
                </motion.g>
              </g>
            );
          })}
        </svg>

        {linkedTen && (
          <div className="text-center font-mono-num text-base sm:text-lg font-black text-emerald-300">
            ({pairA} + {pairB}) + {remainingVal} = 10 + {remainingVal} ={' '}
            {isSolved ? `${data.finalResult} ✨` : '?'}
          </div>
        )}
      </div>

      {/* Step 2 Options appear active once the 10-pair is linked */}
      <div className="grid grid-cols-4 gap-3">
        {round.options.map((opt) => {
          const isRight = isSolved && opt === String(data.finalResult);
          const isWrong = wrongOpt === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={Boolean(feedback) || !linkedTen}
              onClick={() => handleFinalPick(opt)}
              className={`min-h-[58px] rounded-2xl border-2 border-b-4 font-mono-num text-2xl sm:text-3xl font-black shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                isRight
                  ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white scale-[1.03]'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 border-b-rose-800 text-white animate-alifbe-shake'
                  : 'bg-white hover:bg-violet-50 border-violet-300 border-b-violet-500 text-slate-900'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
