import React from 'react';
import { Check, Coins, Lock, Trophy, X } from 'lucide-react';
import { AwardDefinition, AwardTier, PlayerProfile } from '../types';
import {
  ALL_AWARDS,
  AWARD_CATEGORIES,
  AWARD_TIER_META,
  getAwardsByCategory,
  getCategoryMeta,
  getStatForCategory,
} from '../data/awards';
import { AutoFitModal } from './AutoFitModal';
import { ConfettiCanvas } from './ConfettiCanvas';

interface AwardsModalProps {
  profile: PlayerProfile;
  onClose: () => void;
}

const TIER_STYLES: Record<
  AwardTier,
  {
    unlockedCard: string;
    medalBg: string;
    tierText: string;
    rewardText: string;
    celebrationRing: string;
    celebrationBg: string;
  }
> = {
  bronze: {
    unlockedCard: 'bg-amber-50 border-amber-400 shadow-sm',
    medalBg: 'bg-gradient-to-br from-amber-300 via-orange-400 to-amber-700 text-white shadow-md',
    tierText: 'text-amber-800',
    rewardText: 'text-amber-700',
    celebrationRing: 'ring-amber-300',
    celebrationBg: 'from-amber-500 via-orange-500 to-amber-600',
  },
  silver: {
    unlockedCard: 'bg-slate-50 border-slate-400 shadow-sm',
    medalBg: 'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 text-white shadow-md',
    tierText: 'text-slate-700',
    rewardText: 'text-slate-700',
    celebrationRing: 'ring-slate-300',
    celebrationBg: 'from-slate-500 via-slate-600 to-slate-700',
  },
  gold: {
    unlockedCard: 'bg-yellow-50 border-yellow-400 shadow-md',
    medalBg: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-white shadow-md',
    tierText: 'text-yellow-800',
    rewardText: 'text-amber-800',
    celebrationRing: 'ring-yellow-300',
    celebrationBg: 'from-amber-400 via-yellow-500 to-amber-600',
  },
};

export const AwardsModal: React.FC<AwardsModalProps> = ({ profile, onClose }) => {
  const unlockedSet = new Set(profile.unlockedAwards);
  const totalUnlocked = ALL_AWARDS.filter((a) => unlockedSet.has(a.id)).length;
  const totalAwards = ALL_AWARDS.length;

  return (
    <AutoFitModal overlayClassName="bg-slate-900/60 z-50">
      <div className="w-[1080px] max-w-[96vw] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight truncate">
                🏆 Yutuqlar va Medallar Vitrinasi
              </h2>
              <p className="text-amber-50 text-xs sm:text-sm font-medium mt-0.5">
                {profile.name} ·{' '}
                <strong className="text-white font-mono-num">
                  Yutuqlar: {totalUnlocked} / {totalAwards}
                </strong>{' '}
                · Bronza +20 · Kumush +50 · Oltin +100 ball
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Category Showcase Grid (Zero scroll via AutoFitModal) */}
        <div className="p-4 sm:p-5 bg-slate-50/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {AWARD_CATEGORIES.map((cat) => {
            const awards = getAwardsByCategory(cat.id);
            const currentVal = getStatForCategory(profile.stats, cat.id);
            const nextLocked = awards.find((a) => !unlockedSet.has(a.id)) ?? null;
            const catUnlockedCount = awards.filter((a) => unlockedSet.has(a.id)).length;

            const targetVal = nextLocked ? nextLocked.targetCount : awards[awards.length - 1].targetCount;
            const clampedCurrent = Math.min(currentVal, targetVal);
            const pct = targetVal > 0 ? Math.min(100, Math.round((clampedCurrent / targetVal) * 100)) : 100;
            const remaining = nextLocked ? Math.max(0, nextLocked.targetCount - currentVal) : 0;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between gap-3"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border"
                      style={{
                        backgroundColor: cat.softBg,
                        borderColor: cat.borderColor,
                      }}
                    >
                      <span aria-hidden="true">{cat.emoji}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-extrabold text-base text-slate-900 leading-tight truncate">
                        {cat.title}
                      </h3>
                      <div className="text-xs text-slate-500 font-medium truncate">
                        {cat.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className="font-mono-num font-extrabold text-sm"
                      style={{ color: cat.accentColor }}
                    >
                      {catUnlockedCount} / 3
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 font-mono-num">
                      {currentVal} {cat.unitLabel}
                    </div>
                  </div>
                </div>

                {/* 3 Tiered Medals: Bronze / Silver / Gold */}
                <div className="grid grid-cols-3 gap-2">
                  {awards.map((award) => {
                    const isUnlocked = unlockedSet.has(award.id);
                    const tierMeta = AWARD_TIER_META[award.tier];
                    const style = TIER_STYLES[award.tier];

                    return (
                      <div
                        key={award.id}
                        className={`rounded-xl border p-2.5 text-center flex flex-col items-center justify-between gap-1.5 transition-colors ${
                          isUnlocked
                            ? style.unlockedCard
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="relative">
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${
                              isUnlocked
                                ? style.medalBg
                                : 'bg-slate-200 text-slate-400 grayscale opacity-70'
                            }`}
                          >
                            <span aria-hidden="true">{tierMeta.emoji}</span>
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${
                              isUnlocked
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-400 text-white'
                            }`}
                          >
                            {isUnlocked ? (
                              <Check className="w-3 h-3" strokeWidth={3} />
                            ) : (
                              <Lock className="w-2.5 h-2.5" />
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 w-full">
                          <div
                            className={`text-[11px] font-extrabold leading-tight line-clamp-2 ${
                              isUnlocked ? 'text-slate-900' : 'text-slate-500'
                            }`}
                          >
                            {award.title}
                          </div>
                          <div
                            className={`text-[10px] font-bold mt-0.5 font-mono-num ${
                              isUnlocked ? style.rewardText : 'text-slate-400'
                            }`}
                          >
                            {isUnlocked
                              ? `+${award.rewardCoins} ball ✓`
                              : `${award.targetCount} · +${award.rewardCoins}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Next-Medal Progress Bar */}
                <div className="pt-1 border-t border-slate-100">
                  {nextLocked ? (
                    <>
                      <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                        <span className="font-semibold text-slate-700 truncate">
                          Keyingi: <strong>{nextLocked.title}</strong>
                        </span>
                        <span className="font-mono-num font-bold text-slate-600 whitespace-nowrap">
                          {currentVal} / {nextLocked.targetCount} {cat.unitLabel} · yana {remaining}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: cat.progressColor,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-emerald-700 py-0.5">
                      <span>🌟 Barcha 3 ta medal qo&apos;lga kiritildi!</span>
                      <span className="font-mono-num">
                        {currentVal} {cat.unitLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Joriy balans:{' '}
              <strong className="text-slate-900 font-mono-num">{profile.coins} ball</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-7 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-display font-bold text-sm sm:text-base shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Yopish
          </button>
        </div>
      </div>
    </AutoFitModal>
  );
};

interface AwardCelebrationPopupProps {
  award: AwardDefinition;
  remainingInQueue: number;
  onClose: () => void;
}

export const AwardCelebrationPopup: React.FC<AwardCelebrationPopupProps> = ({
  award,
  remainingInQueue,
  onClose,
}) => {
  const tierMeta = AWARD_TIER_META[award.tier];
  const catMeta = getCategoryMeta(award.category);
  const style = TIER_STYLES[award.tier];

  return (
    <>
      <ConfettiCanvas active={true} zIndexClass="z-[75]" />
      <AutoFitModal overlayClassName="bg-slate-900/70 z-[70]">
        <div className="w-[460px] max-w-[92vw] bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden text-center">
          <div className={`bg-gradient-to-r ${style.celebrationBg} px-6 py-5 text-white`}>
            <div className="text-xs font-bold uppercase tracking-wider text-white/90">
              {catMeta.title} · {tierMeta.label} darajasi
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl mt-1">
              Tabriklaymiz! Yangi medal!
            </h2>
          </div>

          <div className="px-6 py-6 flex flex-col items-center gap-4">
            {/* Spinning Celebratory Medal Emblem */}
            <div
              className={`w-24 h-24 rounded-full ${style.medalBg} ring-8 ${style.celebrationRing} flex items-center justify-center text-5xl animate-[spin_0.95s_ease-out_1]`}
              aria-hidden="true"
            >
              {tierMeta.emoji}
            </div>

            <div>
              <div className="font-display font-extrabold text-2xl text-slate-900">
                {award.title}
              </div>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Siz {award.targetCount} {award.unitLabel} natijasiga yetib, {tierMeta.label.toLowerCase()}{' '}
                medalini qo&apos;lga kiritdingiz!
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-300 rounded-2xl px-5 py-3 flex items-center gap-2.5">
              <Coins className="w-6 h-6 text-amber-500 shrink-0" />
              <span className="font-display font-extrabold text-lg text-amber-950 font-mono-num">
                +{award.rewardCoins} ball mukofot qo&apos;shildi!
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-display font-extrabold text-base shadow-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {remainingInQueue > 0
                ? `Keyingi medalni ko'rish (${remainingInQueue})`
                : 'Ajoyib! Davom etish'}
            </button>
          </div>
        </div>
      </AutoFitModal>
    </>
  );
};
