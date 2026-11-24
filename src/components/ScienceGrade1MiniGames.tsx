import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Delete, Flame, PhoneCall, ShieldAlert, ShieldCheck, Snowflake, Sparkles } from 'lucide-react';
import type { ScienceRound } from '../data/curriculum';
import { soundEngine } from '../utils/sound';

export interface ScienceGrade1StageProps {
  round: ScienceRound;
  solved: boolean;
  onSolve: () => void;
  onStepSuccess?: (message?: string) => void;
  onStepMistake?: (teacherHint: string) => void;
}

// =========================================================================
// 1-DARS: "VATANIMIZ RAMZLARI VA MAKTAB XARITASI" (flag_map)
// =========================================================================
const FLAG_STEPS = [
  { id: 'blue', label: 'Moviy', desc: 'Musaffo osmon', swatch: '#0099B5', border: '#0369A1', text: 'text-white' },
  { id: 'white', label: 'Oq', desc: 'Tinchlik va poklik', swatch: '#FFFFFF', border: '#CBD5E1', text: 'text-slate-900' },
  { id: 'red', label: 'Qizil chiziqlar', desc: 'Hayotiy kuch', swatch: '#CE1126', border: '#991B1B', text: 'text-white' },
  { id: 'green', label: 'Yashil', desc: 'Go‘zal tabiat', swatch: '#1EB53A', border: '#15803D', text: 'text-white' },
] as const;

export const FlagMapStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.flagData ?? { mode: 'flag_builder' };
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);

  const shuffledSwatches = useMemo(() => {
    return [FLAG_STEPS[3], FLAG_STEPS[0], FLAG_STEPS[2], FLAG_STEPS[1]];
  }, []);

  // Mode 1: Interactive Uzbekistan Flag Builder
  if (data.mode === 'flag_builder') {
    const nextExpected = FLAG_STEPS[placed.length];
    const hasBlue = placed.includes('blue') || solved;
    const hasWhite = placed.includes('white') || solved;
    const hasRed = placed.includes('red') || solved;
    const hasGreen = placed.includes('green') || solved;

    const handlePickColor = (id: string) => {
      if (solved || placed.includes(id)) return;
      if (nextExpected && id === nextExpected.id) {
        const nextPlaced = [...placed, id];
        setPlaced(nextPlaced);
        setWrongId(null);
        soundEngine.playFruitPluck(nextPlaced.length);
        if (nextPlaced.length === FLAG_STEPS.length) {
          onSolve();
        } else {
          onStepSuccess?.(`Barakalla! ${nextExpected.label} rang joyiga tushdi!`);
        }
      } else {
        setWrongId(id);
        soundEngine.playWrong();
        onStepMistake?.(
          nextExpected
            ? `Hozir ${placed.length + 1}-bo‘lib «${nextExpected.label}» rangini qo‘yish kerak!`
            : round.teacherHint || 'Ranglarni tepadan pastga qarab tartib bilan joylashtir!'
        );
        window.setTimeout(() => setWrongId(null), 550);
      }
    };

    return (
      <div className="space-y-3.5">
        <div className="relative rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 border-2 border-sky-200 px-4 pt-3 pb-3 overflow-hidden select-none">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-1">
            <span>🇺🇿 O‘zbekiston bayrog‘i ({placed.length} / 4)</span>
            <span>{solved ? 'Bayrog‘imiz hilpiradi!' : `Keyingi rang: ${nextExpected?.label ?? ''}`}</span>
          </div>

          <svg viewBox="0 0 460 195" className="w-full h-[182px] sm:h-[195px] overflow-visible" aria-label="O'zbekiston bayrog'i">
            {/* Soft clouds */}
            <g fill="#FFFFFF" opacity="0.85">
              <ellipse cx="385" cy="34" rx="26" ry="12" />
              <ellipse cx="404" cy="38" rx="18" ry="10" />
              <ellipse cx="366" cy="38" rx="16" ry="9" />
            </g>

            {/* Flagpole */}
            <rect x="64" y="20" width="9" height="162" rx="4.5" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <circle cx="68.5" cy="18" r="8" fill="#FACC15" stroke="#B45309" strokeWidth="2" />
            <rect x="46" y="176" width="45" height="10" rx="5" fill="#64748B" />

            {/* Flag Canvas */}
            <g transform="translate(73, 28)">
              <motion.g
                animate={solved ? { skewY: [0, 1.5, -1.5, 0] } : {}}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Outline placeholder */}
                <rect x="0" y="0" width="286" height="126" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" />

                {/* 1. Moviy (Top Stripe) */}
                {hasBlue ? (
                  <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.35 }} style={{ transformOrigin: '0px 20px' }}>
                    <rect x="0" y="0" width="286" height="40" rx="4" fill="#0099B5" />
                    {/* Crescent Moon */}
                    <circle cx="28" cy="20" r="11" fill="#FFFFFF" />
                    <circle cx="32.5" cy="20" r="9.2" fill="#0099B5" />
                    {/* 12 Stars in 3-4-5 pattern */}
                    {[
                      [54, 11], [65, 11], [76, 11],
                      [43, 20], [54, 20], [65, 20], [76, 20],
                      [32, 29], [43, 29], [54, 29], [65, 29], [76, 29],
                    ].map(([sx, sy], i) => (
                      <circle key={i} cx={sx} cy={sy} r="2.2" fill="#FFFFFF" />
                    ))}
                  </motion.g>
                ) : (
                  <text x="143" y="25" textAnchor="middle" fontSize="13" fontWeight="700" fill="#64748B">
                    1. Tepasi — qaysi rang?
                  </text>
                )}

                {/* 2. Oq (Middle Stripe) */}
                {hasWhite ? (
                  <motion.rect
                    x="0"
                    y="44"
                    width="286"
                    height="38"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.35 }}
                    style={{ transformOrigin: '0px 63px' }}
                  />
                ) : (
                  <text x="143" y="67" textAnchor="middle" fontSize="13" fontWeight="700" fill="#64748B">
                    2. O‘rtasi — qaysi rang?
                  </text>
                )}

                {/* 3. Qizil chiziqlar (2 thin red fimbriations bordering white) */}
                {hasRed && (
                  <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.3 }} style={{ transformOrigin: '0px 63px' }}>
                    <rect x="0" y="39.5" width="286" height="5" fill="#CE1126" />
                    <rect x="0" y="81.5" width="286" height="5" fill="#CE1126" />
                  </motion.g>
                )}

                {/* 4. Yashil (Bottom Stripe) */}
                {hasGreen ? (
                  <motion.rect
                    x="0"
                    y="86"
                    width="286"
                    height="40"
                    rx="4"
                    fill="#1EB53A"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.35 }}
                    style={{ transformOrigin: '0px 106px' }}
                  />
                ) : (
                  <text x="143" y="111" textAnchor="middle" fontSize="13" fontWeight="700" fill="#64748B">
                    4. Pasti — qaysi rang?
                  </text>
                )}

                {/* Crisp outer frame */}
                <rect x="0" y="0" width="286" height="126" rx="6" fill="none" stroke="#334155" strokeWidth="2" opacity="0.35" />
              </motion.g>
            </g>
          </svg>
        </div>

        {/* 4 Color Swatch Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {shuffledSwatches.map((sw) => {
            const isUsed = placed.includes(sw.id) || solved;
            const isWrong = wrongId === sw.id;
            return (
              <motion.button
                key={sw.id}
                type="button"
                disabled={isUsed}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.35 }}
                onClick={() => handlePickColor(sw.id)}
                className={`min-h-[60px] rounded-2xl border-2 border-b-4 px-3 py-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isUsed
                    ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-default'
                    : 'bg-white hover:bg-sky-50 border-slate-300 border-b-slate-400 text-slate-900 active:scale-95'
                }`}
              >
                <span
                  className="w-8 h-4 rounded-md border shrink-0"
                  style={{ backgroundColor: sw.swatch, borderColor: sw.border }}
                />
                <span className="text-xs sm:text-sm font-extrabold leading-tight whitespace-nowrap">
                  {sw.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mode 2 & 3: Interactive Neighborhood-to-School Map or Uzbekistan Landmark Map
  const choices = data.choices ?? [];
  const handleChoice = (choice: { id: string; isCorrect: boolean }) => {
    if (solved) return;
    if (choice.isCorrect) {
      setPickedChoice(choice.id);
      onSolve();
    } else {
      setWrongId(choice.id);
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || 'O‘ylab ko‘r, odobli va ziyrak bola qaysi birini tanlaydi?');
      window.setTimeout(() => setWrongId(null), 550);
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="relative rounded-2xl bg-gradient-to-b from-emerald-50 via-sky-50 to-amber-50 border-2 border-emerald-200 px-3 py-3 overflow-hidden select-none">
        {data.mapScene === 'uzbekistan_map' ? (
          <svg viewBox="0 0 460 175" className="w-full h-[165px] sm:h-[175px]" aria-label="O'zbekiston xaritasi">
            {/* Stylized warm illustrated map silhouette of Uzbekistan */}
            <path
              d="M48,74 C76,42 135,34 198,52 C245,65 292,50 344,58 C392,66 420,94 398,118 C362,148 296,144 238,136 C175,128 118,144 74,126 C42,114 30,96 48,74 Z"
              fill="#DCFCE7"
              stroke="#16A34A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Rivers */}
            <path d="M90,114 Q165,86 245,92 T365,80" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
            {/* Capital Star Marker */}
            <g transform="translate(332, 76)">
              <motion.g
                animate={solved ? { scale: [1, 1.35, 1.1] } : { scale: [1, 1.12, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <circle cx="0" cy="0" r="18" fill="#FEF08A" stroke="#D97706" strokeWidth="2.5" />
                <text x="0" y="6" textAnchor="middle" fontSize="18">⭐</text>
              </motion.g>
              <text x="0" y="34" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0F172A">
                {solved ? 'TOSHKENT!' : 'Poytaxt ?'}
              </text>
            </g>
            {/* Friendly compass & flag */}
            <text x="84" y="96" fontSize="22">🇺🇿</text>
            <text x="200" y="114" fontSize="18">🕌</text>
          </svg>
        ) : (
          <svg viewBox="0 0 460 175" className="w-full h-[165px] sm:h-[175px]" aria-label="Maktabga borish xaritasi">
            {/* Winding neighborhood path from home to school */}
            <path
              d="M42,135 Q145,148 228,108 T410,94"
              fill="none"
              stroke="#FDE68A"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <path
              d="M42,135 Q145,148 228,108 T410,94"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeDasharray="8 8"
            />
            {/* Home (left) */}
            <text x="36" y="108" textAnchor="middle" fontSize="34">🏡</text>
            <text x="36" y="156" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">Uy</text>

            {/* School (right) */}
            <text x="412" y="72" textAnchor="middle" fontSize="38">🏫</text>
            <text x="412" y="124" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">Maktab</text>

            {/* Walking Student */}
            <motion.g
              initial={{ x: 118, y: 120 }}
              animate={solved ? { x: 265, y: 92 } : { x: 155, y: 115 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            >
              <circle cx="0" cy="0" r="22" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
              <text x="0" y="8" textAnchor="middle" fontSize="24">🎒</text>
              {solved && (
                <g transform="translate(0, -34)">
                  <rect x="-56" y="-15" width="112" height="24" rx="8" fill="#16A34A" />
                  <text x="0" y="1" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#FFFFFF">
                    Assalomu alaykum!
                  </text>
                </g>
              )}
            </motion.g>

            {/* Elder Neighbor / Teacher Stop */}
            <g transform="translate(248, 56)">
              <circle cx="0" cy="0" r="24" fill="#FFFBEB" stroke="#D97706" strokeWidth="2.5" />
              <text x="0" y="8" textAnchor="middle" fontSize="26">{data.npcEmoji ?? '👴'}</text>
              <text x="0" y="38" textAnchor="middle" fontSize="11" fontWeight="800" fill="#92400E">
                {data.npcLabel ?? 'Mahalladosh'}
              </text>
            </g>
          </svg>
        )}
      </div>

      <div className={`grid gap-3 ${choices.length === 3 ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {choices.map((ch) => {
          const isPicked = pickedChoice === ch.id;
          const isWrong = wrongId === ch.id;
          let cls = 'bg-white hover:bg-emerald-50 border-slate-300 border-b-slate-400 text-slate-900';
          if (solved && ch.isCorrect) {
            cls = 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white';
          } else if (isWrong) {
            cls = 'bg-rose-600 border-rose-700 border-b-rose-800 text-white';
          } else if (solved) {
            cls = 'bg-slate-100 border-slate-200 text-slate-400';
          }
          return (
            <motion.button
              key={ch.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : isPicked ? { scale: [1, 1.03, 1] } : {}}
              onClick={() => handleChoice(ch)}
              className={`min-h-[62px] rounded-2xl border-2 border-b-4 px-4 py-3 flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold transition-colors cursor-pointer ${cls}`}
            >
              <span className="text-2xl leading-none shrink-0">{ch.emoji}</span>
              <span className="text-left leading-snug">{ch.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 2-DARS: "SEHRLI BOG'BON (TIRIK O'SIMLIK)" (plant_lab)
// =========================================================================
export const PlantLabStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.plantData ?? { mode: 'grow_seed', initialStage: 'seed', requiredTools: ['water', 'sun'] };
  const [usedWater, setUsedWater] = useState(false);
  const [usedSun, setUsedSun] = useState(false);
  const [cloudBlocking, setCloudBlocking] = useState(data.initialStage === 'wilted');
  const [pouringWater, setPouringWater] = useState(false);
  const [wrongSpotId, setWrongSpotId] = useState<string | null>(null);

  useEffect(() => {
    setUsedWater(false);
    setUsedSun(false);
    setCloudBlocking(data.initialStage === 'wilted');
    setPouringWater(false);
    setWrongSpotId(null);
  }, [round, data.initialStage]);

  // Mode 4: Forest vs Meadow visual card selector
  if (data.mode === 'nature_spot' && data.spotOptions) {
    return (
      <div className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3.5">
          {data.spotOptions.map((opt) => {
            const isWrong = wrongSpotId === opt.id;
            const isRight = solved && opt.isCorrect;
            return (
              <motion.button
                key={opt.id}
                type="button"
                disabled={solved}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : isRight ? { scale: [1, 1.04, 1] } : {}}
                onClick={() => {
                  if (opt.isCorrect) {
                    onSolve();
                  } else {
                    setWrongSpotId(opt.id);
                    soundEngine.playWrong();
                    onStepMistake?.(round.teacherHint || 'Qayerda baland daraxtlar ko‘p o‘sadi?');
                    window.setTimeout(() => setWrongSpotId(null), 550);
                  }
                }}
                className={`rounded-2xl border-2 border-b-4 p-5 flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                  isRight
                    ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white'
                    : isWrong
                    ? 'bg-rose-600 border-rose-700 text-white'
                    : 'bg-gradient-to-b from-emerald-50 to-white hover:from-emerald-100 border-emerald-300 border-b-emerald-500 text-slate-900'
                }`}
              >
                <span className="text-4xl sm:text-5xl leading-none">{opt.emoji}</span>
                <span className="text-lg font-display font-extrabold">{opt.label}</span>
                <span className={`text-xs font-medium ${isRight || isWrong ? 'text-white/90' : 'text-slate-600'}`}>
                  {opt.subtitle}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  const required = data.requiredTools ?? ['water', 'sun'];
  const needsWater = required.includes('water');
  const needsSun = required.includes('sun');

  const checkCompletion = (nextWater: boolean, nextSun: boolean, nextCloud: boolean) => {
    if (nextCloud) return;
    const waterOk = !needsWater || nextWater;
    const sunOk = !needsSun || nextSun;
    if (waterOk && sunOk) {
      onSolve();
    }
  };

  const handleWater = () => {
    if (solved) return;
    soundEngine.playWaterSplash();
    setPouringWater(true);
    window.setTimeout(() => setPouringWater(false), 780);
    const nextWater = true;
    setUsedWater(nextWater);

    if (data.mode === 'save_wilted' && cloudBlocking) {
      onStepMistake?.('Suv yaxshi, lekin quyosh hali bulut orqasida! ☀️ Quyosh nurini bosing!');
      return;
    }

    if (needsSun && !usedSun) {
      onStepSuccess?.('💧 Zo‘r! Endi urug‘ o‘sishi uchun ☀️ Quyosh nurini ham ber!');
    }
    checkCompletion(nextWater, usedSun, cloudBlocking);
  };

  const handleSun = () => {
    if (solved) return;
    soundEngine.playFruitPluck(5);
    const nextSun = true;
    setUsedSun(nextSun);
    setCloudBlocking(false);

    if (needsWater && !usedWater) {
      onStepSuccess?.('☀️ Iliq quyosh keldi! Endi 💧 Suv idishini bosib suv ham quy!');
    }
    checkCompletion(usedWater, nextSun, false);
  };

  const handleToggleCloudTest = () => {
    if (solved) return;
    const nextCloud = !cloudBlocking;
    setCloudBlocking(nextCloud);
    if (nextCloud) {
      soundEngine.playWrong();
      setUsedSun(false);
      onStepMistake?.('Qara! Quyosh yetishmasa o‘simlik so‘lib qoladi. Qaytadan ☀️ Quyosh nurini chaqir!');
    } else {
      handleSun();
    }
  };

  // Visual growth calculation
  const isWilted = cloudBlocking && !solved;
  const hasRoots = usedWater || data.initialStage !== 'seed' || solved;
  const hasSprout = (usedWater && usedSun) || data.initialStage === 'sprout' || data.initialStage === 'wilted' || solved;
  const hasFlower =
    (data.mode === 'bloom_flower' && ((usedWater && usedSun) || solved)) ||
    (data.mode === 'save_wilted' && (usedSun || solved));

  return (
    <div className="space-y-3.5">
      <div
        className={`relative rounded-2xl border-2 overflow-hidden select-none transition-colors duration-500 ${
          isWilted
            ? 'bg-gradient-to-b from-slate-300 via-slate-200 to-amber-100 border-slate-400'
            : 'bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between px-3.5 pt-2.5 text-xs font-bold text-slate-700">
          <span>
            {isWilted
              ? '☁️ Quyosh yetishmayapti — gul so‘lib qoldi!'
              : solved
              ? '🌺 Ajoyib! Tirik o‘simlik yashnab o‘sdi!'
              : '🌱 Asboblarni bosib o‘simlikni parvarishla'}
          </span>
          <span className="font-mono-num">
            {needsWater ? (usedWater ? '💧✓' : '💧○') : ''} {needsSun ? (usedSun ? '☀️✓' : '☀️○') : ''}
          </span>
        </div>

        <svg viewBox="0 0 460 220" className="w-full h-[205px] sm:h-[220px] overflow-visible" aria-label="Gultuvakda tirik o'simlik">
          {/* Radiant Sun (top right) */}
          <g transform="translate(384, 46)">
            <motion.g
              animate={
                isWilted
                  ? { scale: 0.4, opacity: 0.25 }
                  : usedSun || solved
                  ? { scale: [1, 1.12, 1], opacity: 1, rotate: [0, 20, 0] }
                  : { scale: 0.8, opacity: 0.55 }
              }
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              {(usedSun || solved) && !isWilted && (
                <g stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <line key={deg} x1="0" y1="-32" x2="0" y2="-25" transform={`rotate(${deg})`} />
                  ))}
                </g>
              )}
              <circle cx="0" cy="0" r="20" fill="#FDE047" stroke="#F59E0B" strokeWidth="2.5" />
              <circle cx="-6" cy="-3" r="2.2" fill="#92400E" />
              <circle cx="6" cy="-3" r="2.2" fill="#92400E" />
              <path d="M-6,5 Q0,10 6,5" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
          </g>

          {/* Sunbeams reaching the plant */}
          {(usedSun || solved) && !isWilted && (
            <motion.polygon
              points="360,58 384,74 265,152 205,152"
              fill="#FEF08A"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.35, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Dark Cloud when wilted */}
          {isWilted && (
            <motion.g initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <ellipse cx="230" cy="42" rx="52" ry="22" fill="#64748B" />
              <ellipse cx="200" cy="48" rx="34" ry="18" fill="#475569" />
              <ellipse cx="262" cy="48" rx="36" ry="18" fill="#475569" />
            </motion.g>
          )}

          {/* Watering Droplets Animation */}
          {pouringWater && (
            <g>
              {[198, 218, 238, 256].map((dx, i) => (
                <motion.ellipse
                  key={dx}
                  cx={dx}
                  cy={74}
                  rx="4"
                  ry="7"
                  fill="#0EA5E9"
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: 78, opacity: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                />
              ))}
            </g>
          )}

          {/* Wooden Windowsill */}
          <rect x="20" y="200" width="420" height="14" rx="7" fill="#D97706" opacity="0.25" />

          {/* Terracotta Pot with Soil Cutaway Window */}
          <path d="M168,144 L292,144 L276,204 L184,204 Z" fill="#C2410C" stroke="#7C2D12" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="160" y="132" width="140" height="16" rx="6" fill="#EA580C" stroke="#7C2D12" strokeWidth="2.5" />
          {/* Soil cross-section inside pot so kids see roots! */}
          <path d="M180,148 L280,148 L269,195 L191,195 Z" fill={usedWater ? '#451A03' : '#78350F'} />

          {/* Underground Seed */}
          <ellipse cx="230" cy="166" rx="10" ry="7" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />

          {/* Growing Roots underground */}
          {hasRoots && (
            <motion.g
              stroke="#FDE68A"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.6 }}
            >
              <path d="M230,172 Q222,184 206,190" />
              <path d="M230,172 Q232,186 230,194" />
              <path d="M230,172 Q242,183 255,190" />
            </motion.g>
          )}

          {/* Living Stem, Leaves & Blooming Flower */}
          {hasSprout && (
            <g transform="translate(230, 148)">
              <motion.g
                animate={isWilted ? { rotate: 24 } : { rotate: [0, -2, 2, 0] }}
                transition={isWilted ? { duration: 0.5 } : { duration: 3, repeat: Infinity }}
              >
                {/* Green Stem */}
                <motion.path
                  d={hasFlower ? 'M0,0 Q-5,-44 0,-84' : 'M0,0 Q-3,-26 0,-46'}
                  fill="none"
                  stroke={isWilted ? '#65A30D' : '#16A34A'}
                  strokeWidth="7"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55 }}
                />

                {/* Left & Right Leaves */}
                <motion.path
                  d="M-2,-28 C-34,-42 -42,-18 -14,-14 C-6,-14 -2,-20 -2,-28 Z"
                  fill={isWilted ? '#84CC16' : '#22C55E'}
                  stroke="#15803D"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                />
                <motion.path
                  d="M2,-36 C34,-50 42,-26 14,-22 C6,-22 2,-28 2,-36 Z"
                  fill={isWilted ? '#84CC16' : '#22C55E'}
                  stroke="#15803D"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                />

                {/* Blooming Flower (or drooping bud if wilted) */}
                {(hasFlower || data.initialStage === 'wilted') && (
                  <g transform="translate(0, -86)">
                    <motion.g
                      initial={{ scale: 0 }}
                      animate={{ scale: isWilted ? 0.78 : 1 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                    >
                      {[0, 60, 120, 180, 240, 300].map((deg) => (
                        <ellipse
                          key={deg}
                          cx="0"
                          cy="-18"
                          rx="11"
                          ry="16"
                          transform={`rotate(${deg})`}
                          fill={isWilted ? '#FDA4AF' : '#FB7185'}
                          stroke="#BE123C"
                          strokeWidth="1.8"
                        />
                      ))}
                      <circle cx="0" cy="0" r="13" fill="#FACC15" stroke="#B45309" strokeWidth="2" />
                      {/* Cute face on flower */}
                      <circle cx="-4" cy="-2" r="1.8" fill="#78350F" />
                      <circle cx="4" cy="-2" r="1.8" fill="#78350F" />
                      {isWilted ? (
                        <path d="M-4,6 Q0,2 4,6" fill="none" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
                      ) : (
                        <path d="M-4,3 Q0,8 4,3" fill="none" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
                      )}
                    </motion.g>
                  </g>
                )}
              </motion.g>
            </g>
          )}
        </svg>
      </div>

      {/* Gardener Tool Tray */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          disabled={solved}
          onClick={handleWater}
          className={`min-h-[60px] rounded-2xl border-2 border-b-4 px-3 py-2 flex flex-col items-center justify-center gap-0.5 font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 ${
            usedWater
              ? 'bg-sky-600 border-sky-700 border-b-sky-800 text-white'
              : 'bg-sky-50 hover:bg-sky-100 border-sky-300 border-b-sky-500 text-sky-900'
          }`}
        >
          <span className="text-2xl leading-none">💧</span>
          <span>Suv quyish</span>
        </button>

        <button
          type="button"
          disabled={solved}
          onClick={handleSun}
          className={`min-h-[60px] rounded-2xl border-2 border-b-4 px-3 py-2 flex flex-col items-center justify-center gap-0.5 font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 ${
            usedSun && !isWilted
              ? 'bg-amber-500 border-amber-600 border-b-amber-700 text-white'
              : 'bg-amber-50 hover:bg-amber-100 border-amber-300 border-b-amber-500 text-amber-950'
          }`}
        >
          <span className="text-2xl leading-none">☀️</span>
          <span>Quyosh nuri</span>
        </button>

        <button
          type="button"
          disabled={solved}
          onClick={handleToggleCloudTest}
          className={`min-h-[60px] rounded-2xl border-2 border-b-4 px-3 py-2 flex flex-col items-center justify-center gap-0.5 font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 ${
            isWilted
              ? 'bg-slate-600 border-slate-700 border-b-slate-800 text-white'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-300 border-b-slate-400 text-slate-700'
          }`}
        >
          <span className="text-2xl leading-none">☁️</span>
          <span>{isWilted ? 'Quyoshsiz' : 'Bulut sinovi'}</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 3-DARS: "HAYVONLAR VA ULARNING UYI" (animal_homes) — Drag & Tap
// =========================================================================
const ANIMAL_HABITATS = [
  { id: 'nest', label: 'Daraxtdagi in', emoji: '🌳🪹', bg: 'from-lime-100 to-emerald-100', border: 'border-emerald-300', x: 0, y: 0 },
  { id: 'pond', label: 'Hovuzcha', emoji: '💧🪷', bg: 'from-sky-100 to-cyan-100', border: 'border-sky-300', x: 1, y: 0 },
  { id: 'forest', label: "Qalin o'rmon", emoji: '🌲🐻‍❄️🌲', bg: 'from-emerald-100 to-teal-100', border: 'border-teal-300', x: 0, y: 1 },
  { id: 'house', label: 'Issiq uy', emoji: '🏠🛋️', bg: 'from-amber-100 to-orange-100', border: 'border-amber-300', x: 1, y: 1 },
] as const;

export const AnimalHomesStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.animalData ?? { animalEmoji: '🐦', animalName: 'Qushcha', targetHabitatId: 'nest' };
  const [wrongHab, setWrongHab] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleHabitatPick = (habId: string) => {
    if (solved) return;
    if (habId === data.targetHabitatId) {
      setWrongHab(null);
      onSolve();
    } else {
      setWrongHab(habId);
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || `${data.animalName} bu yerda yashamaydi — uning sevimli uyini top!`);
      window.setTimeout(() => setWrongHab(null), 550);
    }
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    if (solved || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    if (
      info.point.x < rect.left - 12 ||
      info.point.x > rect.right + 12 ||
      info.point.y < rect.top - 12 ||
      info.point.y > rect.bottom + 12
    ) {
      return;
    }
    const col = info.point.x < rect.left + rect.width / 2 ? 0 : 1;
    const row = info.point.y < rect.top + rect.height / 2 ? 0 : 1;
    const matched = ANIMAL_HABITATS.find((h) => h.x === col && h.y === row);
    if (matched) {
      handleHabitatPick(matched.id);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Draggable Animal Card */}
      <div className="flex items-center justify-center">
        {!solved ? (
          <motion.div
            drag
            dragSnapToOrigin
            whileDrag={{ scale: 1.15, zIndex: 30 }}
            onDragEnd={handleDragEnd}
            className="px-6 py-3 rounded-2xl bg-white border-2 border-b-4 border-orange-400 shadow-md flex items-center gap-3 cursor-grab active:cursor-grabbing select-none touch-none"
          >
            <span className="text-4xl sm:text-5xl leading-none">{data.animalEmoji}</span>
            <div className="text-left">
              <div className="text-base font-display font-extrabold text-slate-900">{data.animalName}</div>
              <div className="text-xs font-semibold text-orange-700">Uyiga sudra yoki uyni bos!</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-5 py-2.5 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-display font-extrabold text-sm flex items-center gap-2"
          >
            <Check className="w-5 h-5 text-emerald-600" />
            <span>{data.animalName} o‘z uyiga xursand bo‘lib joylashdi!</span>
          </motion.div>
        )}
      </div>

      {/* 4 Illustrated Habitat Drop Zones */}
      <div ref={gridRef} className="grid grid-cols-2 gap-3">
        {ANIMAL_HABITATS.map((hab) => {
          const isTargetSolved = solved && hab.id === data.targetHabitatId;
          const isWrong = wrongHab === hab.id;
          return (
            <motion.button
              key={hab.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : isTargetSolved ? { scale: [1, 1.04, 1] } : {}}
              onClick={() => handleHabitatPick(hab.id)}
              className={`relative rounded-2xl border-2 border-b-4 p-4 flex flex-col items-center justify-center gap-1.5 min-h-[108px] transition-all cursor-pointer bg-gradient-to-b ${
                isTargetSolved
                  ? 'from-emerald-500 to-emerald-600 border-emerald-700 text-white shadow-md'
                  : isWrong
                  ? 'from-rose-500 to-rose-600 border-rose-700 text-white'
                  : `${hab.bg} ${hab.border} hover:brightness-95 text-slate-900`
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-3xl sm:text-4xl leading-none">
                  {hab.id === 'forest' ? '🌲🌲' : hab.emoji}
                </span>
                {isTargetSolved && (
                  <motion.span
                    initial={{ scale: 0, y: -12 }}
                    animate={{ scale: 1.15, y: 0 }}
                    className="text-4xl leading-none"
                  >
                    {data.animalEmoji}
                  </motion.span>
                )}
              </div>
              <span className="text-sm sm:text-base font-display font-extrabold">{hab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 4-DARS: "FASLLAR CHARXPALAGI" (seasons_wheel)
// =========================================================================
const SEASONS_META = [
  { id: 'spring', label: 'Bahor', emoji: '🌸', treeColor: '#F472B6', leafAccent: '#4ADE80', bg: 'from-pink-50 to-emerald-50', border: 'border-pink-300', angle: -45 },
  { id: 'summer', label: 'Yoz', emoji: '🍏', treeColor: '#16A34A', leafAccent: '#FACC15', bg: 'from-amber-50 to-lime-50', border: 'border-amber-300', angle: 45 },
  { id: 'autumn', label: 'Kuz', emoji: '🍂', treeColor: '#EA580C', leafAccent: '#F59E0B', bg: 'from-orange-50 to-amber-100', border: 'border-orange-300', angle: 135 },
  { id: 'winter', label: 'Qish', emoji: '❄️', treeColor: '#93C5FD', leafAccent: '#FFFFFF', bg: 'from-sky-50 to-blue-100', border: 'border-sky-300', angle: -135 },
] as const;

export const SeasonsWheelStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.seasonData ?? { itemEmoji: '⛄', itemLabel: 'Qorbobo', targetSeason: 'winter' };
  const [wrongSeason, setWrongSeason] = useState<string | null>(null);

  const handleSeasonClick = (seasonId: string) => {
    if (solved) return;
    if (seasonId === data.targetSeason) {
      setWrongSeason(null);
      onSolve();
    } else {
      setWrongSeason(seasonId);
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || `${data.itemLabel} qaysi faslda bo‘ladi? Daraxtlarga yaxshilab qara!`);
      window.setTimeout(() => setWrongSeason(null), 550);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Prompt Token Banner */}
      <div className="flex items-center justify-center">
        <motion.div
          animate={solved ? { scale: [1, 1.08, 1] } : { y: [0, -3, 0] }}
          transition={solved ? { duration: 0.4 } : { duration: 2, repeat: Infinity }}
          className={`px-5 py-2.5 rounded-2xl border-2 flex items-center gap-3 shadow-xs ${
            solved
              ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
              : 'bg-white border-amber-300 text-slate-900'
          }`}
        >
          <span className="text-4xl leading-none">{data.itemEmoji}</span>
          <div className="text-left">
            <div className="text-base font-display font-extrabold">{data.itemLabel}</div>
            <div className="text-xs font-semibold text-slate-600">
              {solved ? 'To‘g‘ri fasl topildi!' : 'Qaysi fasl daraxtiga mos?'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4-Season Interactive Tree Quadrants */}
      <div className="grid grid-cols-2 gap-3">
        {SEASONS_META.map((s) => {
          const isSolvedHere = solved && s.id === data.targetSeason;
          const isWrong = wrongSeason === s.id;
          return (
            <motion.button
              key={s.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : isSolvedHere ? { scale: [1, 1.04, 1] } : {}}
              onClick={() => handleSeasonClick(s.id)}
              className={`relative rounded-2xl border-2 border-b-4 p-3.5 flex items-center gap-3 text-left transition-all cursor-pointer bg-gradient-to-br ${
                isSolvedHere
                  ? 'from-emerald-500 to-emerald-600 border-emerald-700 text-white shadow-md'
                  : isWrong
                  ? 'from-rose-500 to-rose-600 border-rose-700 text-white'
                  : `${s.bg} ${s.border} hover:brightness-95 text-slate-900`
              }`}
            >
              {/* Custom Mini Seasonal Tree SVG */}
              <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0" aria-hidden="true">
                <rect x="27" y="38" width="10" height="22" rx="3" fill="#78350F" />
                <circle cx="32" cy="26" r="18" fill={s.treeColor} />
                <circle cx="21" cy="30" r="12" fill={s.treeColor} />
                <circle cx="43" cy="30" r="12" fill={s.treeColor} />
                {/* Seasonal Accents (Blossoms / Apples / Falling Leaves / Snow) */}
                <circle cx="24" cy="22" r="3.5" fill={s.leafAccent} />
                <circle cx="38" cy="20" r="3.5" fill={s.leafAccent} />
                <circle cx="32" cy="32" r="3.5" fill={s.leafAccent} />
                {s.id === 'winter' && (
                  <path d="M16,22 Q32,12 48,22" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                )}
              </svg>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl leading-none">{s.emoji}</span>
                  <span className="text-base sm:text-lg font-display font-extrabold">{s.label}</span>
                </div>
                {isSolvedHere && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-white"
                  >
                    <span>{data.itemEmoji}</span>
                    <span>Mos keldi!</span>
                  </motion.div>
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
// 5-DARS: "SUVNING 3 SEHRLI HOLATI (MUZ, SUV, BUG')" (water_states)
// =========================================================================
function getWaterStateFromTemp(temp: number): 'ice' | 'liquid' | 'steam' {
  if (temp <= 0) return 'ice';
  if (temp >= 90) return 'steam';
  return 'liquid';
}

export const WaterStatesStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.waterData ?? {
    startTemp: -10,
    targetState: 'liquid',
    taskHint: 'Muzni eritib suvga aylantir!',
  };

  const [temp, setTemp] = useState<number>(data.startTemp);

  useEffect(() => {
    setTemp(data.startTemp);
  }, [round, data.startTemp]);

  const currentState = getWaterStateFromTemp(temp);
  const stateLabel =
    currentState === 'ice'
      ? '🧊 Qattiq MUZ'
      : currentState === 'steam'
      ? '☁️ BUG‘ va BULUT'
      : '💧 Suyuq SUV';

  const applyTemp = (nextTemp: number) => {
    if (solved) return;
    setTemp(nextTemp);
    const nextState = getWaterStateFromTemp(nextTemp);
    if (nextState === 'liquid') {
      soundEngine.playWaterSplash();
    } else if (nextState === 'steam') {
      soundEngine.playWindWhoosh();
    } else {
      soundEngine.playEquip();
    }

    if (nextState === data.targetState) {
      onSolve();
    }
  };

  const handleCheckSlider = () => {
    if (solved) return;
    if (currentState === data.targetState) {
      onSolve();
    } else {
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || data.taskHint);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Live Interactive Laboratory Stage */}
      <div
        className={`relative rounded-2xl border-2 px-4 pt-3 pb-2 overflow-hidden select-none transition-colors duration-500 ${
          currentState === 'ice'
            ? 'bg-gradient-to-b from-sky-100 via-blue-50 to-cyan-100 border-sky-300'
            : currentState === 'steam'
            ? 'bg-gradient-to-b from-slate-100 via-orange-50 to-rose-100 border-orange-300'
            : 'bg-gradient-to-b from-sky-50 via-cyan-50 to-blue-100 border-cyan-300'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
          <span>Holat: {stateLabel}</span>
          <span className="font-mono-num text-sm font-black px-2 py-0.5 rounded-lg bg-white/90 border border-slate-200">
            🌡️ {temp > 0 ? `+${temp}°C` : `${temp}°C`}
          </span>
        </div>

        <svg viewBox="0 0 460 198" className="w-full h-[185px] sm:h-[198px] overflow-visible" aria-label="Suv holatlari laboratoriyasi">
          {/* Cloud forming at top when STEAM */}
          {currentState === 'steam' && (
            <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ellipse cx="230" cy="28" rx="58" ry="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <ellipse cx="195" cy="34" rx="34" ry="15" fill="#FFFFFF" />
              <ellipse cx="265" cy="34" rx="34" ry="15" fill="#FFFFFF" />
              <text x="230" y="34" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">
                ☁️ Bulut!
              </text>
              {/* Rising steam curls */}
              {[204, 230, 256].map((sx, idx) => (
                <motion.path
                  key={sx}
                  d={`M${sx},108 Q${sx - 8},88 ${sx},68 T${sx},46`}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0.1, 0.8, 0.1], y: [-2, -14, -2] }}
                  transition={{ duration: 1.4, delay: idx * 0.25, repeat: Infinity }}
                />
              ))}
            </motion.g>
          )}

          {/* Falling Snowflakes when ICE */}
          {currentState === 'ice' && (
            <g fill="#38BDF8" fontSize="16">
              {[135, 175, 290, 330].map((fx, i) => (
                <motion.text
                  key={fx}
                  x={fx}
                  y={32}
                  animate={{ y: [24, 145], opacity: [0.9, 0.2] }}
                  transition={{ duration: 2.2, delay: i * 0.4, repeat: Infinity }}
                >
                  ❄️
                </motion.text>
              ))}
            </g>
          )}

          {/* Glass Laboratory Beaker */}
          <g transform="translate(170, 74)">
            {/* Beaker Contents */}
            {currentState === 'ice' && (
              <motion.g initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                {/* Translucent Blue Ice Cubes */}
                <rect x="18" y="42" width="38" height="36" rx="7" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2.5" />
                <rect x="52" y="32" width="38" height="36" rx="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" />
                <rect x="64" y="48" width="34" height="32" rx="7" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.5" />
                <line x1="25" y1="50" x2="36" y2="50" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="60" y1="40" x2="72" y2="40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </motion.g>
            )}

            {currentState === 'liquid' && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <path
                  d="M10,44 Q35,38 60,44 T110,44 L110,82 C110,88 104,92 98,92 L22,92 C16,92 10,88 10,82 Z"
                  fill="#38BDF8"
                  opacity="0.82"
                />
                <motion.path
                  d="M14,50 Q40,44 65,50 T106,50"
                  fill="none"
                  stroke="#E0F2FE"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={{ x: [-2, 2, -2] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </motion.g>
            )}

            {currentState === 'steam' && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <path
                  d="M10,64 Q35,58 60,64 T110,64 L110,82 C110,88 104,92 98,92 L22,92 C16,92 10,88 10,82 Z"
                  fill="#0EA5E9"
                  opacity="0.72"
                />
                {/* Boiling bubbles */}
                {[30, 56, 82].map((bx, i) => (
                  <motion.circle
                    key={bx}
                    cx={bx}
                    cy={82}
                    r="5"
                    fill="#E0F2FE"
                    animate={{ cy: [82, 56], opacity: [1, 0] }}
                    transition={{ duration: 0.75, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </motion.g>
            )}

            {/* Glass Beaker Walls */}
            <path
              d="M4,8 L10,8 L10,82 C10,90 16,94 24,94 L96,94 C104,94 110,90 110,82 L110,8 L116,8"
              fill="none"
              stroke="#334155"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Measurement ticks */}
            <line x1="18" y1="30" x2="28" y2="30" stroke="#64748B" strokeWidth="2" />
            <line x1="18" y1="50" x2="32" y2="50" stroke="#64748B" strokeWidth="2" />
            <line x1="18" y1="70" x2="28" y2="70" stroke="#64748B" strokeWidth="2" />
          </g>

          {/* Lab Burner / Freezer Base */}
          <rect x="158" y="170" width="144" height="16" rx="6" fill="#475569" stroke="#1E293B" strokeWidth="2" />
          {currentState === 'steam' && (
            <g>
              {[198, 230, 262].map((fx, i) => (
                <motion.path
                  key={fx}
                  d={`M${fx},170 C${fx - 10},155 ${fx - 4},146 ${fx},140 C${fx + 4},146 ${fx + 10},155 ${fx},170 Z`}
                  fill="#F97316"
                  stroke="#EA580C"
                  strokeWidth="1.5"
                  animate={{ scaleY: [0.9, 1.18, 0.9] }}
                  transition={{ duration: 0.45, delay: i * 0.1, repeat: Infinity }}
                  style={{ transformOrigin: `${fx}px 170px` }}
                />
              ))}
            </g>
          )}
          {currentState === 'ice' && (
            <rect x="166" y="164" width="128" height="8" rx="4" fill="#38BDF8" />
          )}

          {/* Side Thermometer Gauge */}
          <g transform="translate(358, 44)">
            <rect x="0" y="0" width="16" height="114" rx="8" fill="#FFFFFF" stroke="#475569" strokeWidth="2.5" />
            <circle cx="8" cy="116" r="14" fill={temp <= 0 ? '#0284C7' : temp >= 90 ? '#EF4444' : '#F59E0B'} stroke="#475569" strokeWidth="2.5" />
            <rect
              x="4"
              y={Math.max(8, Math.min(104, 100 - ((temp + 20) / 130) * 90))}
              width="8"
              height={Math.max(10, ((temp + 20) / 130) * 90 + 12)}
              rx="4"
              fill={temp <= 0 ? '#0284C7' : temp >= 90 ? '#EF4444' : '#F59E0B'}
            />
          </g>
        </svg>
      </div>

      {/* Labeled Temperature Control Slider + 3 Instant Preset Buttons */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-700">
          <span className="inline-flex items-center gap-1 text-sky-700">
            <Snowflake className="w-3.5 h-3.5" /> Muzlatgich (−20°C)
          </span>
          <span className="font-mono-num text-slate-900">Harorat: {temp}°C</span>
          <span className="inline-flex items-center gap-1 text-rose-600">
            Qaynoq olov (110°C) <Flame className="w-3.5 h-3.5" />
          </span>
        </div>

        <input
          type="range"
          min={-20}
          max={110}
          step={5}
          disabled={solved}
          value={temp}
          onChange={(e) => applyTemp(Number(e.target.value))}
          onMouseUp={handleCheckSlider}
          onTouchEnd={handleCheckSlider}
          aria-label="Harorat boshqaruvi"
          className="w-full h-3 rounded-lg accent-orange-500 cursor-pointer"
        />

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={solved}
            onClick={() => applyTemp(-10)}
            className={`min-h-[46px] rounded-xl border-2 border-b-4 px-2 py-1.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ${
              currentState === 'ice'
                ? 'bg-sky-600 border-sky-700 text-white'
                : 'bg-white hover:bg-sky-50 border-sky-300 text-sky-900'
            }`}
          >
            <span>❄️</span>
            <span>Muzlatgich</span>
          </button>

          <button
            type="button"
            disabled={solved}
            onClick={() => applyTemp(24)}
            className={`min-h-[46px] rounded-xl border-2 border-b-4 px-2 py-1.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ${
              currentState === 'liquid'
                ? 'bg-cyan-600 border-cyan-700 text-white'
                : 'bg-white hover:bg-cyan-50 border-cyan-300 text-cyan-900'
            }`}
          >
            <span>💧</span>
            <span>Iliq xona</span>
          </button>

          <button
            type="button"
            disabled={solved}
            onClick={() => applyTemp(100)}
            className={`min-h-[46px] rounded-xl border-2 border-b-4 px-2 py-1.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ${
              currentState === 'steam'
                ? 'bg-orange-600 border-orange-700 text-white'
                : 'bg-white hover:bg-orange-50 border-orange-300 text-orange-900'
            }`}
          >
            <span>🔥</span>
            <span>Qaynoq olov</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 6-DARS: "BUG'DOYDAN DASTURXONGACHA (NON ZANJIRI)" (bread_chain)
// =========================================================================
export const BreadChainStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.breadData ?? { mode: 'order_chain', steps: [] };
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    setPlacedIds([]);
    setWrongId(null);
  }, [round]);

  // Mode 2: Etiquette choice
  if (data.mode === 'etiquette_pick' && data.etiquetteChoices) {
    return (
      <div className="space-y-3.5">
        <div className="rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-200 p-4 flex flex-col items-center text-center gap-2">
          <div className="text-5xl leading-none">🥖✨📖</div>
          <div className="text-sm font-bold text-amber-950">
            Non — aziz ne&apos;mat, daftar qog‘ozi esa daraxtlardan keladi!
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.etiquetteChoices.map((ch) => {
            const isRight = solved && ch.isCorrect;
            const isWrong = wrongId === ch.id;
            return (
              <motion.button
                key={ch.id}
                type="button"
                disabled={solved}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                onClick={() => {
                  if (ch.isCorrect) {
                    onSolve();
                  } else {
                    setWrongId(ch.id);
                    soundEngine.playWrong();
                    onStepMistake?.(round.teacherHint || 'Nonni e’zozlab, qog‘ozni tejash kerak!');
                    window.setTimeout(() => setWrongId(null), 550);
                  }
                }}
                className={`min-h-[68px] rounded-2xl border-2 border-b-4 px-4 py-3 flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold transition-colors cursor-pointer ${
                  isRight
                    ? 'bg-emerald-600 border-emerald-700 text-white'
                    : isWrong
                    ? 'bg-rose-600 border-rose-700 text-white'
                    : 'bg-white hover:bg-amber-50 border-amber-300 border-b-amber-500 text-slate-900'
                }`}
              >
                <span className="text-2xl leading-none">{ch.emoji}</span>
                <span>{ch.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mode 1: Order Chain (1 -> 2 -> 3)
  const steps = data.steps ?? [];
  const shuffledSteps = useMemo(() => {
    if (steps.length === 3) {
      return [steps[2], steps[0], steps[1]];
    }
    return [...steps].reverse();
  }, [steps]);

  const handleTapStep = (step: { id: string; emoji: string; label: string }) => {
    if (solved || placedIds.includes(step.id)) return;
    const expected = steps[placedIds.length];
    if (expected && step.id === expected.id) {
      const next = [...placedIds, step.id];
      setPlacedIds(next);
      setWrongId(null);
      soundEngine.playFruitPluck(next.length);
      if (next.length === steps.length) {
        onSolve();
      } else {
        onStepSuccess?.(`${next.length}-qadam to‘g‘ri! Endi ${next.length + 1}-qadamni tanla!`);
      }
    } else {
      setWrongId(step.id);
      soundEngine.playWrong();
      onStepMistake?.(
        expected
          ? `Avval ${placedIds.length + 1}-bosqichni tanla: «${expected.label}» (${expected.emoji})!`
          : round.teacherHint || 'Bosqichlarni boshidan oxirigacha ketma-ket ter!'
      );
      window.setTimeout(() => setWrongId(null), 550);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1 -> 2 -> 3 Visual Storyboard Chain */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-200 p-4">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-2.5">
          {steps.map((step, idx) => {
            const isFilled = idx < placedIds.length || solved;
            const isActiveSlot = idx === placedIds.length && !solved;
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  animate={isFilled ? { scale: [0.9, 1.06, 1] } : {}}
                  className={`rounded-2xl border-2 p-2.5 sm:p-3 min-h-[104px] flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    isFilled
                      ? 'bg-white border-emerald-500 shadow-sm'
                      : isActiveSlot
                      ? 'bg-amber-100/80 border-dashed border-amber-500'
                      : 'bg-white/60 border-dashed border-amber-300'
                  }`}
                >
                  <span className="font-mono-num text-[11px] font-black text-amber-800">
                    {idx + 1}-qadam
                  </span>
                  {isFilled ? (
                    <>
                      <span className="text-3xl sm:text-4xl leading-none">{step.emoji}</span>
                      <span className="text-xs font-extrabold text-slate-900 leading-tight">
                        {step.label}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-display font-black text-amber-400">?</span>
                  )}
                </motion.div>
                {idx < steps.length - 1 && (
                  <span className="text-lg sm:text-xl font-black text-amber-500 select-none" aria-hidden="true">
                    ➔
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Shuffled Tappable Step Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {shuffledSteps.map((step) => {
          const isUsed = placedIds.includes(step.id) || solved;
          const isWrong = wrongId === step.id;
          return (
            <motion.button
              key={step.id}
              type="button"
              disabled={isUsed}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              onClick={() => handleTapStep(step)}
              className={`min-h-[82px] rounded-2xl border-2 border-b-4 px-2.5 py-2.5 flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
                isUsed
                  ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-45 cursor-default'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 text-white'
                  : 'bg-white hover:bg-amber-50 border-amber-300 border-b-amber-500 text-slate-900 active:scale-95'
              }`}
            >
              <span className="text-3xl leading-none">{step.emoji}</span>
              <span className="text-xs sm:text-sm font-extrabold leading-tight">{step.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 7-DARS: "XAVFSIZ UY POSBONI VA TEZKOR RAQAMLAR" (safety_home)
// =========================================================================
export const SafetyHomeStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.safetyData ?? { mode: 'sort_hazard', itemEmoji: '🔥', itemLabel: 'Gugurt', isDangerous: true };
  const [dialed, setDialed] = useState('');
  const [wrongAction, setWrongAction] = useState<string | null>(null);

  useEffect(() => {
    setDialed('');
    setWrongAction(null);
  }, [round]);

  // Mode 2: Interactive Emergency Smartphone Keypad (101 / 103)
  if (data.mode === 'dial_phone') {
    const target = data.targetNumber ?? '101';

    const handleDigit = (d: string) => {
      if (solved || dialed.length >= 3) return;
      soundEngine.playPhoneTone(Number(d));
      const next = dialed + d;
      setDialed(next);
      if (next.length === target.length && next === target) {
        onSolve();
      }
    };

    const handleCall = () => {
      if (solved) return;
      if (dialed === target) {
        onSolve();
      } else {
        setWrongAction('call');
        soundEngine.playWrong();
        onStepMistake?.(round.teacherHint || `Tezkor raqam — ${target}! O‘chirib qaytadan ${target} ni ter!`);
        window.setTimeout(() => {
          setWrongAction(null);
          setDialed('');
        }, 650);
      }
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_210px] gap-4 items-center">
        {/* Left: Emergency Scene Banner */}
        <div className="rounded-2xl bg-gradient-to-b from-rose-50 via-amber-50 to-white border-2 border-amber-200 p-5 flex flex-col items-center text-center gap-3">
          <motion.div
            animate={solved ? { x: [40, 0], scale: [0.9, 1.15, 1] } : { scale: [1, 1.06, 1] }}
            transition={solved ? { duration: 0.5 } : { duration: 1.8, repeat: Infinity }}
            className="text-6xl leading-none"
          >
            {data.emergencyEmoji ?? '🚑'}
          </motion.div>
          <div className="text-base font-display font-extrabold text-slate-900">
            {data.emergencyLabel ?? 'Tezkor yordam'}
          </div>
          <div className="text-xs font-semibold text-slate-600">
            {solved
              ? `Ura! ${target} raqamiga qo‘ng‘iroq qilindi — yordam yetib keldi!`
              : 'Telefonda to‘g‘ri 3 xonali raqamni tering!'}
          </div>
          <div className="grid grid-cols-2 gap-2 w-full text-xs font-bold pt-1">
            <div className="rounded-xl bg-white border border-rose-200 py-1.5 px-2 text-rose-800">
              🚒 101 — Yong‘in
            </div>
            <div className="rounded-xl bg-white border border-sky-200 py-1.5 px-2 text-sky-800">
              🚑 103 — Tez yordam
            </div>
          </div>
        </div>

        {/* Right: Kid-Friendly Smartphone Keypad */}
        <motion.div
          animate={wrongAction ? { x: [0, -6, 6, -4, 4, 0] } : {}}
          className="mx-auto w-full max-w-[215px] rounded-3xl bg-slate-900 p-3 shadow-lg border-2 border-slate-700 space-y-2.5"
        >
          {/* Phone Screen */}
          <div
            className={`rounded-2xl px-3 py-2.5 text-center font-mono-num text-2xl font-black tracking-widest border ${
              solved
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-slate-800 text-amber-300 border-slate-700'
            }`}
          >
            {dialed || '---'}
          </div>

          {/* Numeric Keys */}
          <div className="grid grid-cols-3 gap-1.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={solved}
                onClick={() => handleDigit(digit)}
                className="h-10 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-mono-num text-lg font-extrabold cursor-pointer transition-transform"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              disabled={solved}
              onClick={() => setDialed((prev) => prev.slice(0, -1))}
              className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              aria-label="O'chirish"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={solved}
              onClick={() => handleDigit('0')}
              className="h-10 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-mono-num text-lg font-extrabold cursor-pointer transition-transform"
            >
              0
            </button>
            <button
              type="button"
              disabled={solved}
              onClick={handleCall}
              className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center cursor-pointer transition-transform"
              aria-label="Qo'ng'iroq qilish"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Mode 1: Sort Dangerous vs Safe Home Object
  const handleSafetyPick = (pickedDanger: boolean) => {
    if (solved) return;
    if (pickedDanger === Boolean(data.isDangerous)) {
      onSolve();
    } else {
      setWrongAction(pickedDanger ? 'danger' : 'safe');
      soundEngine.playWrong();
      onStepMistake?.(
        round.teacherHint ||
          (data.isDangerous
            ? 'Ehtiyot bo‘l! Bu narsa juda xavfli, unga tegish taqiqlangan!'
            : 'Bu narsa xavfsiz — u bilan bemalol o‘ynash mumkin!')
      );
      window.setTimeout(() => setWrongAction(null), 550);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Cozy Room Showcase with Highlighted Item */}
      <div className="relative rounded-2xl bg-gradient-to-b from-amber-50 via-orange-50/50 to-slate-100 border-2 border-amber-200 p-5 flex flex-col items-center text-center gap-2 overflow-hidden">
        <div className="relative">
          <motion.div
            animate={solved ? { scale: [1, 1.12, 1] } : { y: [0, -4, 0] }}
            transition={solved ? { duration: 0.45 } : { duration: 2.2, repeat: Infinity }}
            className="w-24 h-24 rounded-3xl bg-white border-2 border-amber-300 shadow-sm flex items-center justify-center text-5xl"
          >
            {data.itemEmoji}
          </motion.div>
          {solved && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md ${
                data.isDangerous ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
            >
              {data.isDangerous ? '🚫' : '✅'}
            </motion.div>
          )}
        </div>
        <div className="text-lg font-display font-extrabold text-slate-900">{data.itemLabel}</div>
        <div className="text-xs font-semibold text-slate-600">
          Uy posboni! Bu narsaga tegish mumkinmi?
        </div>
      </div>

      {/* 2 Big Dual-Coded Shield Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          disabled={solved}
          animate={wrongAction === 'danger' ? { x: [0, -6, 6, -4, 4, 0] } : {}}
          onClick={() => handleSafetyPick(true)}
          className={`min-h-[68px] rounded-2xl border-2 border-b-4 px-4 py-3 flex flex-col items-center justify-center gap-1 font-display font-extrabold text-sm sm:text-base transition-all cursor-pointer active:scale-95 ${
            solved && data.isDangerous
              ? 'bg-rose-600 border-rose-700 border-b-rose-800 text-white'
              : solved
              ? 'bg-slate-100 border-slate-200 text-slate-400'
              : 'bg-rose-50 hover:bg-rose-100 border-rose-300 border-b-rose-500 text-rose-900'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5" /> 🚫 XAVFLI
          </span>
          <span className="text-[11px] font-sans font-semibold opacity-85">Tegish taqiqlangan!</span>
        </motion.button>

        <motion.button
          type="button"
          disabled={solved}
          animate={wrongAction === 'safe' ? { x: [0, -6, 6, -4, 4, 0] } : {}}
          onClick={() => handleSafetyPick(false)}
          className={`min-h-[68px] rounded-2xl border-2 border-b-4 px-4 py-3 flex flex-col items-center justify-center gap-1 font-display font-extrabold text-sm sm:text-base transition-all cursor-pointer active:scale-95 ${
            solved && !data.isDangerous
              ? 'bg-emerald-600 border-emerald-700 border-b-emerald-800 text-white'
              : solved
              ? 'bg-slate-100 border-slate-200 text-slate-400'
              : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 border-b-emerald-500 text-emerald-900'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5" /> ✅ XAVFSIZ
          </span>
          <span className="text-[11px] font-sans font-semibold opacity-85">O‘ynash mumkin</span>
        </motion.button>
      </div>
    </div>
  );
};

// =========================================================================
// 8-DARS: "AQLLI SVETOFOR VA PIYODALAR YO'LAGI" (traffic_light)
// =========================================================================
const TRANSPORT_LANES = [
  { id: 'air', label: 'Havo transporti', emoji: '☁️🌤️', bg: 'from-sky-100 to-blue-50', border: 'border-sky-300' },
  { id: 'water', label: 'Suv transporti', emoji: '🌊⚓', bg: 'from-cyan-100 to-teal-50', border: 'border-cyan-300' },
  { id: 'land', label: 'Quruqlik transporti', emoji: '🛣️🚦', bg: 'from-slate-100 to-amber-50', border: 'border-slate-300' },
] as const;

export const TrafficLightStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.trafficData ?? { mode: 'signal_pick', targetLight: 'green', scenarioLabel: 'Yashil chiroqni yoq!' };
  const [activeLight, setActiveLight] = useState<'red' | 'yellow' | 'green' | null>(null);
  const [wrongLane, setWrongLane] = useState<string | null>(null);

  useEffect(() => {
    setActiveLight(null);
    setWrongLane(null);
  }, [round]);

  // Mode 2: Transport Lane Matcher (Air / Water / Land)
  if (data.mode === 'transport_lane') {
    return (
      <div className="space-y-3.5">
        <div className="flex items-center justify-center">
          <div className="px-6 py-3 rounded-2xl bg-white border-2 border-sky-300 shadow-xs flex items-center gap-3">
            <span className="text-5xl leading-none">{data.vehicleEmoji ?? '✈️'}</span>
            <div>
              <div className="text-base font-display font-extrabold text-slate-900">{data.vehicleLabel ?? 'Samolyot'}</div>
              <div className="text-xs font-semibold text-sky-700">Qaysi yo‘lda harakatlanadi?</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {TRANSPORT_LANES.map((lane) => {
            const isSolvedHere = solved && lane.id === data.targetLane;
            const isWrong = wrongLane === lane.id;
            return (
              <motion.button
                key={lane.id}
                type="button"
                disabled={solved}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                onClick={() => {
                  if (lane.id === data.targetLane) {
                    onSolve();
                  } else {
                    setWrongLane(lane.id);
                    soundEngine.playWrong();
                    onStepMistake?.(round.teacherHint || 'Bu transport qayerda yurishini o‘ylab ko‘r!');
                    window.setTimeout(() => setWrongLane(null), 550);
                  }
                }}
                className={`min-h-[96px] rounded-2xl border-2 border-b-4 p-3 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer bg-gradient-to-b ${
                  isSolvedHere
                    ? 'from-emerald-500 to-emerald-600 border-emerald-700 text-white'
                    : isWrong
                    ? 'from-rose-500 to-rose-600 border-rose-700 text-white'
                    : `${lane.bg} ${lane.border} text-slate-900`
                }`}
              >
                <span className="text-3xl leading-none">
                  {isSolvedHere ? `${data.vehicleEmoji}` : lane.emoji}
                </span>
                <span className="text-xs sm:text-sm font-extrabold leading-tight">{lane.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mode 1: Interactive Crosswalk + Clickable Traffic Light
  const shownLight = solved ? data.targetLight : activeLight;
  const carsStopped = shownLight === 'green';
  const studentCrossing = solved && data.targetLight === 'green';

  const handleLightClick = (color: 'red' | 'yellow' | 'green') => {
    if (solved) return;
    setActiveLight(color);
    if (color === data.targetLight) {
      onSolve();
    } else {
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || 'Qizil — to‘xta, Sariq — kut, Yashil — piyodalar yo‘lagidan o‘t!');
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Animated Road & Zebra Crosswalk SVG */}
      <div className="relative rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-slate-200 border-2 border-slate-300 px-3 pt-2.5 pb-2 overflow-hidden select-none">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1 px-1">
          <span>🚦 {data.scenarioLabel}</span>
          <span>
            {shownLight === 'red'
              ? '🛑 TO‘XTA!'
              : shownLight === 'yellow'
              ? '⚠️ KUTIB TUR!'
              : shownLight === 'green'
              ? '🟢 XAVFSIZ O‘T!'
              : 'Chiroqni bos!'}
          </span>
        </div>

        <svg viewBox="0 0 460 184" className="w-full h-[175px] sm:h-[184px] overflow-visible" aria-label="Svetofor va piyodalar yo'lagi">
          {/* Top Sidewalk */}
          <rect x="0" y="34" width="460" height="24" fill="#CBD5E1" />
          {/* Asphalt Road */}
          <rect x="0" y="58" width="460" height="92" fill="#334155" />
          {/* Bottom Sidewalk */}
          <rect x="0" y="150" width="460" height="34" fill="#CBD5E1" />

          {/* Road Dashed Center Line */}
          <line x1="0" y1="104" x2="176" y2="104" stroke="#F8FAFC" strokeWidth="3" strokeDasharray="14 10" opacity="0.7" />
          <line x1="284" y1="104" x2="460" y2="104" stroke="#F8FAFC" strokeWidth="3" strokeDasharray="14 10" opacity="0.7" />

          {/* White Zebra Crosswalk Stripes */}
          {[66, 84, 102, 120, 136].map((zy) => (
            <rect key={zy} x="192" y={zy} width="76" height="10" rx="2" fill="#FFFFFF" />
          ))}

          {/* Moving / Stopping Car */}
          <motion.g
            animate={
              carsStopped
                ? { x: 108 }
                : { x: [18, 390] }
            }
            transition={
              carsStopped
                ? { duration: 0.5, ease: 'easeOut' }
                : { duration: 2.8, repeat: Infinity, ease: 'linear' }
            }
          >
            {/* Cartoon Red Car */}
            <g transform="translate(0, 68)">
              <rect x="0" y="10" width="58" height="20" rx="6" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
              <path d="M12,10 L20,0 L42,0 L48,10 Z" fill="#FCA5A5" stroke="#991B1B" strokeWidth="2" />
              <circle cx="14" cy="30" r="6" fill="#0F172A" />
              <circle cx="44" cy="30" r="6" fill="#0F172A" />
            </g>
          </motion.g>

          {/* Cute Student Waiting or Crossing Zebra */}
          <motion.g
            initial={{ x: 230, y: 158 }}
            animate={studentCrossing ? { x: 230, y: 40 } : { x: 230, y: 158 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            <circle cx="0" cy="0" r="17" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" />
            <text x="0" y="7" textAnchor="middle" fontSize="20">
              {studentCrossing ? '🚶' : '🧍'}
            </text>
          </motion.g>

          {/* Interactive 3-Lamp Traffic Light Post (Right side) */}
          <g transform="translate(362, 10)">
            <rect x="23" y="110" width="10" height="54" fill="#475569" />
            <rect x="4" y="0" width="48" height="114" rx="14" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />

            {/* Red Lamp */}
            <circle
              cx="28"
              cy="24"
              r="14"
              fill={shownLight === 'red' ? '#EF4444' : '#450A0A'}
              stroke={shownLight === 'red' ? '#FCA5A5' : '#334155'}
              strokeWidth="2.5"
              className="cursor-pointer"
              onClick={() => handleLightClick('red')}
            />
            {/* Yellow Lamp */}
            <circle
              cx="28"
              cy="57"
              r="14"
              fill={shownLight === 'yellow' ? '#FACC15' : '#422006'}
              stroke={shownLight === 'yellow' ? '#FEF08A' : '#334155'}
              strokeWidth="2.5"
              className="cursor-pointer"
              onClick={() => handleLightClick('yellow')}
            />
            {/* Green Lamp */}
            <circle
              cx="28"
              cy="90"
              r="14"
              fill={shownLight === 'green' ? '#22C55E' : '#052E16'}
              stroke={shownLight === 'green' ? '#86EFAC' : '#334155'}
              strokeWidth="2.5"
              className="cursor-pointer"
              onClick={() => handleLightClick('green')}
            />
          </g>
        </svg>
      </div>

      {/* 3 Big Tactile Traffic Light Buttons */}
      <div className="grid grid-cols-3 gap-2.5">
        {(
          [
            { id: 'red', emoji: '🔴', title: 'Qizil', sub: 'To‘xta!', activeCls: 'bg-red-600 border-red-700 text-white', idleCls: 'bg-red-50 hover:bg-red-100 border-red-300 text-red-900' },
            { id: 'yellow', emoji: '🟡', title: 'Sariq', sub: 'Kutib tur!', activeCls: 'bg-amber-500 border-amber-600 text-white', idleCls: 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950' },
            { id: 'green', emoji: '🟢', title: 'Yashil', sub: 'O‘t!', activeCls: 'bg-emerald-600 border-emerald-700 text-white', idleCls: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900' },
          ] as const
        ).map((btn) => {
          const isLit = shownLight === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              disabled={solved}
              onClick={() => handleLightClick(btn.id)}
              className={`min-h-[64px] rounded-2xl border-2 border-b-4 px-2 py-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all active:scale-95 ${
                isLit ? btn.activeCls : btn.idleCls
              }`}
            >
              <span className="text-xl leading-none">{btn.emoji}</span>
              <span className="text-sm font-display font-extrabold leading-none">{btn.title}</span>
              <span className="text-[11px] font-semibold opacity-85">{btn.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 9-DARS: "TOZA QO'LLAR VA VITAMINLAR QAHRAMONI" (clean_hands)
// =========================================================================
const HAND_GERMS = [
  { id: 'g1', cx: 156, cy: 84, color: '#84CC16' },
  { id: 'g2', cx: 210, cy: 64, color: '#A855F7' },
  { id: 'g3', cx: 266, cy: 76, color: '#22C55E' },
  { id: 'g4', cx: 196, cy: 132, color: '#84CC16' },
  { id: 'g5', cx: 254, cy: 126, color: '#A855F7' },
];

const TOOTH_SPOTS = [
  { id: 't1', cx: 196, cy: 88 },
  { id: 't2', cx: 256, cy: 84 },
  { id: 't3', cx: 224, cy: 120 },
  { id: 't4', cx: 258, cy: 126 },
];

export const CleanHandsStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.cleanData ?? { mode: 'wash_hands' };
  const [cleanedIds, setCleanedIds] = useState<string[]>([]);
  const [pickedFoodIds, setPickedFoodIds] = useState<string[]>([]);
  const [wrongFoodId, setWrongFoodId] = useState<string | null>(null);

  useEffect(() => {
    setCleanedIds([]);
    setPickedFoodIds([]);
    setWrongFoodId(null);
  }, [round]);

  // Mode 1: Scrub Germs Off Hands with Soap 🧼
  if (data.mode === 'wash_hands') {
    const remaining = HAND_GERMS.length - cleanedIds.length;
    const handleScrub = (germId: string) => {
      if (solved || cleanedIds.includes(germId)) return;
      const next = [...cleanedIds, germId];
      setCleanedIds(next);
      soundEngine.playWaterSplash();
      if (next.length === HAND_GERMS.length) {
        onSolve();
      } else {
        onStepSuccess?.(`🫧 Yuvildi! Yana ${HAND_GERMS.length - next.length} ta mikrob qoldi!`);
      }
    };

    return (
      <div className="space-y-3">
        <div className="relative rounded-2xl bg-gradient-to-b from-sky-50 via-cyan-50 to-white border-2 border-cyan-200 px-3 pt-2.5 pb-3 overflow-hidden select-none">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-900 mb-1 px-1">
            <span>🧼 Sovun bilan mikroblarni bosib tozala!</span>
            <span className="font-mono-num">
              {solved ? '✨ Toza qo‘llar!' : `Qoldi: ${remaining} ta`}
            </span>
          </div>

          <svg viewBox="0 0 460 198" className="w-full h-[188px] sm:h-[198px]" aria-label="Qo'l yuvish o'yini">
            {/* Cute Friendly Hand SVG */}
            <g fill="#FDBA74" stroke="#C2410C" strokeWidth="3" strokeLinejoin="round">
              {/* Fingers */}
              <rect x="142" y="54" width="24" height="68" rx="12" />
              <rect x="172" y="34" width="26" height="84" rx="13" />
              <rect x="204" y="28" width="26" height="90" rx="13" />
              <rect x="236" y="38" width="26" height="82" rx="13" />
              {/* Thumb */}
              <rect x="264" y="84" width="44" height="24" rx="12" transform="rotate(-18 264 84)" />
              {/* Palm */}
              <rect x="144" y="92" width="128" height="84" rx="34" />
              <rect x="176" y="164" width="64" height="30" rx="10" />
            </g>

            {/* Soap Bar Floating Badge */}
            <g transform="translate(362, 54)">
              <rect x="-34" y="-20" width="68" height="40" rx="16" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
              <text x="0" y="6" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFFFFF">
                🧼 SOVUN
              </text>
            </g>

            {/* Interactive Wiggly Germs */}
            {HAND_GERMS.map((g) => {
              const isCleaned = cleanedIds.includes(g.id) || solved;
              if (isCleaned) {
                return (
                  <motion.g
                    key={`b-${g.id}`}
                    initial={{ scale: 0.4, opacity: 1 }}
                    animate={{ scale: [0.6, 1.35, 0], opacity: [1, 0.9, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <circle cx={g.cx} cy={g.cy} r="14" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
                  </motion.g>
                );
              }
              return (
                <g key={g.id} transform={`translate(${g.cx}, ${g.cy})`} className="cursor-pointer" onClick={() => handleScrub(g.id)}>
                  <motion.g
                    animate={{ scale: [1, 1.12, 1], rotate: [-6, 6, -6] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    <circle cx="0" cy="0" r="18" fill={g.color} stroke="#14532D" strokeWidth="2.2" />
                    <circle cx="-5" cy="-3" r="3" fill="#FFFFFF" />
                    <circle cx="5" cy="-3" r="3" fill="#FFFFFF" />
                    <circle cx="-5" cy="-3" r="1.4" fill="#0F172A" />
                    <circle cx="5" cy="-3" r="1.4" fill="#0F172A" />
                    <path d="M-5,6 Q0,2 5,6" fill="none" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
                  </motion.g>
                </g>
              );
            })}

            {/* Sparkling Clean Stars once all germs are gone */}
            {solved && (
              <g fontSize="24">
                <motion.text x="112" y="64" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}>✨</motion.text>
                <motion.text x="300" y="62" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}>✨</motion.text>
                <motion.text x="208" y="138" textAnchor="middle" fontSize="16" fontWeight="900" fill="#047857">
                  YARAQLADI!
                </motion.text>
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  // Mode 2: Brush Smiling Tooth Clean 🪥
  if (data.mode === 'brush_teeth') {
    const remaining = TOOTH_SPOTS.length - cleanedIds.length;
    const handleBrush = (spotId: string) => {
      if (solved || cleanedIds.includes(spotId)) return;
      const next = [...cleanedIds, spotId];
      setCleanedIds(next);
      soundEngine.playWaterSplash();
      if (next.length === TOOTH_SPOTS.length) {
        onSolve();
      } else {
        onStepSuccess?.(`🪥 Ajoyib! Yana ${TOOTH_SPOTS.length - next.length} ta dog‘ qoldi!`);
      }
    };

    return (
      <div className="space-y-3">
        <div className="relative rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50 border-2 border-sky-200 px-3 pt-2.5 pb-3 select-none">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-1 px-1">
            <span>🪥 Dog‘chalarni bosib tishni oppoq qil!</span>
            <span className="font-mono-num">{solved ? '✨ Oppoq tish!' : `Qoldi: ${remaining} ta`}</span>
          </div>

          <svg viewBox="0 0 460 190" className="w-full h-[180px] sm:h-[190px]" aria-label="Tish yuvish o'yini">
            {/* Big Cute Cartoon Tooth */}
            <path
              d="M174,56 C174,30 212,26 230,44 C248,26 286,30 286,56 C286,88 274,162 256,168 C242,172 238,136 230,136 C222,136 218,172 204,168 C186,162 174,88 174,56 Z"
              fill="#FFFFFF"
              stroke="#0284C7"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Happy Tooth Eyes & Smile */}
            <circle cx="212" cy="74" r="4" fill="#0F172A" />
            <circle cx="248" cy="74" r="4" fill="#0F172A" />
            <path d="M214,96 Q230,110 246,96" fill="none" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />

            {/* Interactive Sugar Spots */}
            {TOOTH_SPOTS.map((spot) => {
              const isClean = cleanedIds.includes(spot.id) || solved;
              if (isClean) return null;
              return (
                <g key={spot.id} transform={`translate(${spot.cx}, ${spot.cy})`} className="cursor-pointer" onClick={() => handleBrush(spot.id)}>
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="16"
                    fill="#F59E0B"
                    opacity="0.88"
                    stroke="#B45309"
                    strokeWidth="2"
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 1.3, repeat: Infinity }}
                  />
                  <text x="0" y="5" textAnchor="middle" fontSize="13">🦠</text>
                </g>
              );
            })}

            {solved && (
              <>
                <motion.text x="136" y="66" fontSize="26" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}>✨</motion.text>
                <motion.text x="304" y="66" fontSize="26" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}>✨</motion.text>
              </>
            )}
          </svg>
        </div>
      </div>
    );
  }

  // Mode 3: Healthy Vitamin Lunch Plate
  const foods = data.foods ?? [];
  const totalHealthy = foods.filter((f) => f.healthy).length;

  const handleFoodTap = (food: { id: string; emoji: string; label: string; healthy: boolean }) => {
    if (solved || pickedFoodIds.includes(food.id)) return;
    if (food.healthy) {
      const next = [...pickedFoodIds, food.id];
      setPickedFoodIds(next);
      setWrongFoodId(null);
      soundEngine.playFruitPluck(next.length);
      if (next.length === totalHealthy) {
        onSolve();
      } else {
        onStepSuccess?.(`${food.emoji} ${food.label} juda foydali! Yana ${totalHealthy - next.length} tasini tanla!`);
      }
    } else {
      setWrongFoodId(food.id);
      soundEngine.playWrong();
      onStepMistake?.(`${food.emoji} ${food.label} sog‘liq uchun zararli! Yaxshisi vitaminli taomlarni tanla!`);
      window.setTimeout(() => setWrongFoodId(null), 550);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Illustrated Ceramic Lunch Plate */}
      <div className="rounded-2xl bg-gradient-to-b from-amber-50 to-emerald-50 border-2 border-emerald-200 p-4 flex flex-col items-center gap-2">
        <div className="text-xs font-bold text-emerald-900">
          🍽️ Vitaminli lagan ({pickedFoodIds.length} / {totalHealthy})
        </div>
        <div className="w-full max-w-[340px] min-h-[82px] rounded-full bg-white border-4 border-emerald-300 shadow-inner px-6 py-3 flex items-center justify-center gap-4">
          {pickedFoodIds.length === 0 ? (
            <span className="text-xs font-semibold text-slate-400">
              Foydali taomlarni bosib laganga sol!
            </span>
          ) : (
            pickedFoodIds.map((id) => {
              const item = foods.find((f) => f.id === id);
              return (
                <motion.span
                  key={id}
                  initial={{ scale: 0, y: -16 }}
                  animate={{ scale: 1, y: 0 }}
                  className="text-4xl leading-none"
                >
                  {item?.emoji}
                </motion.span>
              );
            })
          )}
        </div>
      </div>

      {/* Food Choices */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {foods.map((food) => {
          const isPicked = pickedFoodIds.includes(food.id);
          const isWrong = wrongFoodId === food.id;
          return (
            <motion.button
              key={food.id}
              type="button"
              disabled={isPicked || solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              onClick={() => handleFoodTap(food)}
              className={`min-h-[84px] rounded-2xl border-2 border-b-4 px-2 py-2 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-all ${
                isPicked
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-65 cursor-default'
                  : isWrong
                  ? 'bg-rose-600 border-rose-700 text-white'
                  : 'bg-white hover:bg-emerald-50 border-slate-300 border-b-slate-400 text-slate-900 active:scale-95'
              }`}
            >
              <span className="text-3xl leading-none">{food.emoji}</span>
              <span className="text-[11px] font-extrabold leading-tight">{food.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 10-DARS: "YASHIL SAYYORA (EKO-PATRUL)" (eco_patrol)
// =========================================================================
const RECYCLE_BINS = [
  { id: 'paper', label: 'Qog‘oz', emoji: '📄', bg: 'from-blue-500 to-blue-600', border: 'border-blue-800', lightBg: 'bg-blue-50 border-blue-300 text-blue-950' },
  { id: 'plastic', label: 'Plastik', emoji: '🧴', bg: 'from-amber-400 to-amber-500', border: 'border-amber-700', lightBg: 'bg-amber-50 border-amber-300 text-amber-950' },
  { id: 'glass', label: 'Shisha', emoji: '🍾', bg: 'from-emerald-500 to-emerald-600', border: 'border-emerald-800', lightBg: 'bg-emerald-50 border-emerald-300 text-emerald-950' },
] as const;

export const EcoPatrolStage: React.FC<ScienceGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.ecoData ?? { mode: 'recycle_sort', trashEmoji: '📄', trashLabel: 'Qog‘oz', targetBin: 'paper' };
  const [wrongBin, setWrongBin] = useState<string | null>(null);
  const [saplingStep, setSaplingStep] = useState<number>(0); // 0=hole, 1=planted, 2=watered, 3=grown tree
  const binsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWrongBin(null);
    setSaplingStep(0);
  }, [round]);

  // Mode 2: Plant Sapling & Grow Park Tree!
  if (data.mode === 'plant_sapling') {
    const stepNow = solved ? 3 : saplingStep;

    const handleSaplingAction = (expectedStep: number) => {
      if (solved) return;
      if (stepNow === expectedStep) {
        const next = stepNow + 1;
        setSaplingStep(next);
        if (next === 1) {
          soundEngine.playFruitPluck(2);
          onStepSuccess?.('🌱 Ko‘chat yerga ekildi! Endi unga 💧 Suv quy!');
        } else if (next === 2) {
          soundEngine.playWaterSplash();
          onStepSuccess?.('💧 Suv ichdi! Endi ☀️ Quyosh nurini berib daraxtni o‘stir!');
        } else if (next >= 3) {
          onSolve();
        }
      } else {
        soundEngine.playWrong();
        const hintMap = [
          'Avval 1-qadam: 🌱 Ko‘chatni ekish tugmasini bos!',
          'Endi 2-qadam: 💧 Ko‘chatga suv quy!',
          'Oxirgi 3-qadam: ☀️ Quyosh nurini ber!',
        ];
        onStepMistake?.(hintMap[stepNow] ?? 'Ketma-ket 1 → 2 → 3 tugmalarni bos!');
      }
    };

    return (
      <div className="space-y-3.5">
        <div className="relative rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 border-2 border-emerald-200 px-3 pt-2.5 pb-2 overflow-hidden select-none">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-1">
            <span>🌍 Yashil Sayyora bog‘i</span>
            <span className="font-mono-num">{stepNow} / 3 qadam</span>
          </div>

          <svg viewBox="0 0 460 190" className="w-full h-[180px] sm:h-[190px]" aria-label="Ko'chat ekish va o'stirish">
            {/* Sun */}
            <circle cx="395" cy="40" r="22" fill="#FDE047" stroke="#F59E0B" strokeWidth="2.5" opacity={stepNow >= 3 ? 1 : 0.45} />

            {/* Park Grass */}
            <path d="M0,148 Q160,132 320,146 T460,144 L460,190 L0,190 Z" fill="#4ADE80" />
            <ellipse cx="230" cy="158" rx="46" ry="12" fill="#78350F" />

            {/* Step 1: Sapling planted */}
            {stepNow === 1 && (
              <motion.g initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <line x1="230" y1="158" x2="230" y2="122" stroke="#15803D" strokeWidth="5" strokeLinecap="round" />
                <ellipse cx="218" cy="126" rx="12" ry="6" transform="rotate(-24 218 126)" fill="#22C55E" />
                <ellipse cx="242" cy="126" rx="12" ry="6" transform="rotate(24 242 126)" fill="#22C55E" />
              </motion.g>
            )}

            {/* Step 2: Watered taller young tree */}
            {stepNow === 2 && (
              <motion.g initial={{ scaleY: 0.7 }} animate={{ scaleY: 1 }} style={{ transformOrigin: '230px 158px' }}>
                <line x1="230" y1="158" x2="230" y2="96" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
                <circle cx="230" cy="88" r="26" fill="#22C55E" />
                <circle cx="210" cy="100" r="18" fill="#16A34A" />
                <circle cx="250" cy="100" r="18" fill="#16A34A" />
              </motion.g>
            )}

            {/* Step 3: Full Majestic Park Tree! */}
            {stepNow >= 3 && (
              <motion.g initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformOrigin: '230px 158px' }}>
                <rect x="216" y="88" width="28" height="72" rx="8" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
                <circle cx="230" cy="64" r="46" fill="#16A34A" />
                <circle cx="188" cy="84" r="34" fill="#22C55E" />
                <circle cx="272" cy="84" r="34" fill="#22C55E" />
                <circle cx="230" cy="54" r="32" fill="#4ADE80" opacity="0.45" />
                {/* Happy Apples & Singing Bird */}
                <text x="194" y="88" fontSize="18">🍎</text>
                <text x="252" y="76" fontSize="18">🍎</text>
                <text x="278" y="54" fontSize="22">🐦</text>
              </motion.g>
            )}
          </svg>
        </div>

        {/* 3 Guided Park Hero Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { idx: 0, emoji: '🌱', label: '1. Ko‘chat ek' },
            { idx: 1, emoji: '💧', label: '2. Suv quy' },
            { idx: 2, emoji: '☀️', label: '3. O‘stir!' },
          ].map((btn) => {
            const done = stepNow > btn.idx;
            const active = stepNow === btn.idx && !solved;
            return (
              <button
                key={btn.idx}
                type="button"
                disabled={done || solved}
                onClick={() => handleSaplingAction(btn.idx)}
                className={`min-h-[60px] rounded-2xl border-2 border-b-4 px-2 py-2 flex flex-col items-center justify-center gap-0.5 font-extrabold text-xs sm:text-sm cursor-pointer transition-all active:scale-95 ${
                  done
                    ? 'bg-emerald-600 border-emerald-700 text-white'
                    : active
                    ? 'bg-amber-100 hover:bg-amber-200 border-amber-400 border-b-amber-600 text-amber-950'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <span className="text-2xl leading-none">{done ? '✅' : btn.emoji}</span>
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mode 1: Recycle Sorting Bins (Drag or Tap)
  const handleBinPick = (binId: string) => {
    if (solved) return;
    if (binId === data.targetBin) {
      soundEngine.playTrashCollect();
      onSolve();
    } else {
      setWrongBin(binId);
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || `${data.trashLabel} uchun mos saralash qutisini tanla!`);
      window.setTimeout(() => setWrongBin(null), 550);
    }
  };

  const handleTrashDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    if (solved || !binsRef.current) return;
    const rect = binsRef.current.getBoundingClientRect();
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
    const bin = RECYCLE_BINS[idx];
    if (bin) handleBinPick(bin.id);
  };

  return (
    <div className="space-y-4">
      {/* Draggable Trash Item */}
      <div className="flex items-center justify-center">
        {!solved ? (
          <motion.div
            drag
            dragSnapToOrigin
            whileDrag={{ scale: 1.15, zIndex: 30 }}
            onDragEnd={handleTrashDragEnd}
            className="px-6 py-3 rounded-2xl bg-white border-2 border-b-4 border-emerald-400 shadow-md flex items-center gap-3 cursor-grab active:cursor-grabbing select-none touch-none"
          >
            <span className="text-4xl sm:text-5xl leading-none">{data.trashEmoji}</span>
            <div className="text-left">
              <div className="text-base font-display font-extrabold text-slate-900">{data.trashLabel}</div>
              <div className="text-xs font-semibold text-emerald-700">To‘g‘ri qutiga sudra yoki bos!</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-5 py-2.5 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-display font-extrabold text-sm flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Barakalla! Chiqindi to‘g‘ri saralandi!</span>
          </motion.div>
        )}
      </div>

      {/* 3 Colorful Recycling Bins */}
      <div ref={binsRef} className="grid grid-cols-3 gap-3">
        {RECYCLE_BINS.map((bin) => {
          const isSolvedHere = solved && bin.id === data.targetBin;
          const isWrong = wrongBin === bin.id;
          return (
            <motion.button
              key={bin.id}
              type="button"
              disabled={solved}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : isSolvedHere ? { scale: [1, 1.06, 1] } : {}}
              onClick={() => handleBinPick(bin.id)}
              className={`rounded-2xl border-2 border-b-4 p-3.5 min-h-[118px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSolvedHere
                  ? `bg-gradient-to-b ${bin.bg} ${bin.border} text-white shadow-md`
                  : isWrong
                  ? 'bg-rose-600 border-rose-800 text-white'
                  : `${bin.lightBg} hover:brightness-95`
              }`}
            >
              {/* Bin Lid + Body Icon */}
              <div className="w-12 h-2 rounded-full bg-current opacity-30 mb-0.5" />
              <span className="text-3xl sm:text-4xl leading-none">{bin.emoji}</span>
              <span className="text-sm sm:text-base font-display font-extrabold">{bin.label}</span>
              <span className="text-[10px] font-bold opacity-80">♻️ Saralash</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Re-export unused icon helpers cleanly kept out — check imports above!
export const SCIENCE_GAME_TITLES: Record<string, string> = {
  flag_map: 'Vatanimiz Ramzlari va Maktab Xaritasi',
  plant_lab: "Sehrli Bog'bon (Tirik O'simlik)",
  animal_homes: 'Hayvonlar va Ularning Uyi',
  seasons_wheel: 'Fasllar Charxpalagi',
  water_states: "Suvning 3 Sehrli Holati (Muz, Suv, Bug')",
  bread_chain: "Bug'doydan Dasturxongacha (Non Zanjiri)",
  safety_home: 'Xavfsiz Uy Posboni va Tezkor Raqamlar',
  traffic_light: "Aqlli Svetofor va Piyodalar Yo'lagi",
  clean_hands: "Toza Qo'llar va Vitaminlar Qahramoni",
  eco_patrol: 'Yashil Sayyora (Eko-Patrul)',
};
