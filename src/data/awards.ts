import { AwardCategoryId, AwardDefinition, AwardTier, PlayerStats } from '../types';

export interface AwardCategoryMeta {
  id: AwardCategoryId;
  title: string;
  subtitle: string;
  emoji: string;
  statKey: keyof PlayerStats;
  unitLabel: string;
  accentColor: string;
  softBg: string;
  borderColor: string;
  progressColor: string;
}

export const AWARD_CATEGORIES: AwardCategoryMeta[] = [
  {
    id: 'cleanliness',
    title: 'Ozodalik va Poklik',
    subtitle: "Maktab yo'laklarini ozoda saqlash",
    emoji: '♻️',
    statKey: 'trashCollected',
    unitLabel: 'ta chiqindi',
    accentColor: '#059669',
    softBg: '#ECFDF5',
    borderColor: '#A7F3D0',
    progressColor: '#10B981',
  },
  {
    id: 'greeting',
    title: 'Odob va Salomlashish',
    subtitle: 'Ustozlarga hurmat va shirin salom',
    emoji: '✋',
    statKey: 'greetingsGiven',
    unitLabel: 'marta salom',
    accentColor: '#D97706',
    softBg: '#FFFBEB',
    borderColor: '#FDE68A',
    progressColor: '#F59E0B',
  },
  {
    id: 'math',
    title: 'Matematika va Mantiq',
    subtitle: "Matematika va informatika a'lo darslari",
    emoji: '🔢',
    statKey: 'mathCompleted',
    unitLabel: "ta a'lo dars",
    accentColor: '#2563EB',
    softBg: '#EFF6FF',
    borderColor: '#BFDBFE',
    progressColor: '#3B82F6',
  },
  {
    id: 'language',
    title: 'Til va Kitobxonlik',
    subtitle: "Alifbe va ingliz tili a'lo darslari",
    emoji: '📚',
    statKey: 'languageCompleted',
    unitLabel: "ta a'lo dars",
    accentColor: '#7C3AED',
    softBg: '#F5F3FF',
    borderColor: '#DDD6FE',
    progressColor: '#8B5CF6',
  },
  {
    id: 'sport',
    title: 'Sport va Chaqqonlik',
    subtitle: "Jismoniy tarbiya va sport zali a'lo darslari",
    emoji: '🏅',
    statKey: 'sportCompleted',
    unitLabel: "ta a'lo dars",
    accentColor: '#0284C7',
    softBg: '#F0F9FF',
    borderColor: '#BAE6FD',
    progressColor: '#0EA5E9',
  },
];

export const AWARD_TIER_META: Record<
  AwardTier,
  { label: string; emoji: string; rewardCoins: number }
> = {
  bronze: { label: 'Bronza', emoji: '🥉', rewardCoins: 20 },
  silver: { label: 'Kumush', emoji: '🥈', rewardCoins: 50 },
  gold: { label: 'Oltin', emoji: '🥇', rewardCoins: 100 },
};

export const ALL_AWARDS: AwardDefinition[] = [
  // A) Ozodalik va Poklik
  {
    id: 'cleanliness_bronze',
    category: 'cleanliness',
    tier: 'bronze',
    title: "Toza qo'llar",
    targetCount: 5,
    rewardCoins: 20,
    unitLabel: 'ta chiqindi',
  },
  {
    id: 'cleanliness_silver',
    category: 'cleanliness',
    tier: 'silver',
    title: 'Ozodalik posboni',
    targetCount: 25,
    rewardCoins: 50,
    unitLabel: 'ta chiqindi',
  },
  {
    id: 'cleanliness_gold',
    category: 'cleanliness',
    tier: 'gold',
    title: 'Ozoda bola',
    targetCount: 50,
    rewardCoins: 100,
    unitLabel: 'ta chiqindi',
  },

  // B) Odob va Salomlashish
  {
    id: 'greeting_bronze',
    category: 'greeting',
    tier: 'bronze',
    title: 'Salom — odob boshi',
    targetCount: 5,
    rewardCoins: 20,
    unitLabel: 'marta salom',
  },
  {
    id: 'greeting_silver',
    category: 'greeting',
    tier: 'silver',
    title: "Xushmuomala o'quvchi",
    targetCount: 25,
    rewardCoins: 50,
    unitLabel: 'marta salom',
  },
  {
    id: 'greeting_gold',
    category: 'greeting',
    tier: 'gold',
    title: 'Maktab faxri',
    targetCount: 50,
    rewardCoins: 100,
    unitLabel: 'marta salom',
  },

  // C) Matematika va Mantiq
  {
    id: 'math_bronze',
    category: 'math',
    tier: 'bronze',
    title: 'Hisobchi bolakay',
    targetCount: 5,
    rewardCoins: 20,
    unitLabel: "ta a'lo dars",
  },
  {
    id: 'math_silver',
    category: 'math',
    tier: 'silver',
    title: 'Zukko matematik',
    targetCount: 15,
    rewardCoins: 50,
    unitLabel: "ta a'lo dars",
  },
  {
    id: 'math_gold',
    category: 'math',
    tier: 'gold',
    title: 'Kichik Al-Xorazmiy',
    targetCount: 30,
    rewardCoins: 100,
    unitLabel: "ta a'lo dars",
  },

  // D) Til va Kitobxonlik
  {
    id: 'language_bronze',
    category: 'language',
    tier: 'bronze',
    title: 'Kichik kitobxon',
    targetCount: 5,
    rewardCoins: 20,
    unitLabel: "ta a'lo dars",
  },
  {
    id: 'language_silver',
    category: 'language',
    tier: 'silver',
    title: "So'z ustasi",
    targetCount: 15,
    rewardCoins: 50,
    unitLabel: "ta a'lo dars",
  },
  {
    id: 'language_gold',
    category: 'language',
    tier: 'gold',
    title: 'Yosh Notiq',
    targetCount: 30,
    rewardCoins: 100,
    unitLabel: "ta a'lo dars",
  },

  // E) Sport va Chaqqonlik
  {
    id: 'sport_bronze',
    category: 'sport',
    tier: 'bronze',
    title: 'Chaqqon bola',
    targetCount: 5,
    rewardCoins: 20,
    unitLabel: "ta a'lo dars",
  },
  {
    id: 'sport_silver',
    category: 'sport',
    tier: 'silver',
    title: 'Yosh sportchi',
    targetCount: 15,
    rewardCoins: 50,
    unitLabel: "ta a'lo dars",
  },
  {
    id: 'sport_gold',
    category: 'sport',
    tier: 'gold',
    title: 'Maktab chempioni',
    targetCount: 30,
    rewardCoins: 100,
    unitLabel: "ta a'lo dars",
  },
];

export const VALID_AWARD_IDS = new Set<string>(ALL_AWARDS.map((a) => a.id));

export function getAwardsByCategory(category: AwardCategoryId): AwardDefinition[] {
  return ALL_AWARDS.filter((a) => a.category === category);
}

export function getCategoryMeta(category: AwardCategoryId): AwardCategoryMeta {
  return AWARD_CATEGORIES.find((c) => c.id === category) ?? AWARD_CATEGORIES[0];
}

export function getStatForCategory(stats: PlayerStats, category: AwardCategoryId): number {
  const meta = getCategoryMeta(category);
  return stats[meta.statKey] ?? 0;
}

/**
 * Evaluates player stats against all 12 tiered awards and returns newly unlocked awards.
 */
export function evaluateNewlyUnlockedAwards(
  stats: PlayerStats,
  alreadyUnlocked: readonly string[]
): AwardDefinition[] {
  const unlockedSet = new Set(alreadyUnlocked);
  const newlyEarned: AwardDefinition[] = [];

  for (const award of ALL_AWARDS) {
    if (unlockedSet.has(award.id)) continue;
    const currentVal = getStatForCategory(stats, award.category);
    if (currentVal >= award.targetCount) {
      newlyEarned.push(award);
    }
  }

  return newlyEarned;
}
