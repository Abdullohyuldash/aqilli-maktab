import {
  EquippedAccessories,
  PlayerGender,
  PlayerProfile,
  PlayerStats,
  ShirtColorOption,
  ShopItem,
  ShopItemId,
  SubjectId,
} from '../types';
import { VALID_AWARD_IDS } from '../data/awards';

export const SUBJECT_ORDER: SubjectId[] = ['math', 'english', 'cs', 'science'];
export const ALL_SUBJECTS: SubjectId[] = ['alifbe', 'math', 'english', 'cs', 'science'];

export function getSubjectOrderForGrade(grade: number): SubjectId[] {
  return grade === 1 ? ALL_SUBJECTS : SUBJECT_ORDER;
}

export const SHIRT_COLORS: ShirtColorOption[] = [
  { id: 'cobalt', name: "Ko'k", hex: '#2563EB', accentHex: '#1D4ED8' },
  { id: 'crimson', name: 'Qizil', hex: '#E11D48', accentHex: '#BE123C' },
  { id: 'emerald', name: 'Yashil', hex: '#10B981', accentHex: '#047857' },
  { id: 'amber', name: "To'q sariq", hex: '#F97316', accentHex: '#C2410C' },
  { id: 'violet', name: 'Binafsha', hex: '#7C3AED', accentHex: '#5B21B6' },
  { id: 'teal', name: 'Moviy', hex: '#0891B2', accentHex: '#0E7490' },
];

export const SHOP_ITEMS: ShopItem[] = [
  // =========================================================================
  // A) KIYIMLAR (outfit) — O'g'il bolalar (3 ta) va Qiz bolalar (3 ta)
  // =========================================================================
  {
    id: 'white_shirt_tie',
    category: 'outfit',
    genderRestriction: 'boy',
    name: "Oq Ko'ylak va Galstuk",
    description: "Ozoda oq maktab ko'ylagi, galstuk va tartibli maktab shimi.",
    price: 60,
    slot: 'outfit',
    accentColor: '#1D4ED8',
  },
  {
    id: 'school_vest',
    category: 'outfit',
    genderRestriction: 'boy',
    name: 'Klassik Maktab Nimchasi',
    description: "Oq ko'ylak, to'q ko'k nimcha, galstuk va shim — odobli o'quvchi uslubi.",
    price: 110,
    slot: 'outfit',
    accentColor: '#1E3A8A',
  },
  {
    id: 'formal_blazer',
    category: 'outfit',
    genderRestriction: 'boy',
    name: 'Bayramona Maktab Kostyumi',
    description: "Rasmiy maktab pidjagi, oq ko'ylak, galstuk, oltin tugmachalar va shim.",
    price: 200,
    slot: 'outfit',
    accentColor: '#0F172A',
  },
  {
    id: 'girl_blouse_skirt',
    category: 'outfit',
    genderRestriction: 'girl',
    name: 'Oq Bluzka va Yubka',
    description: "Ozoda oq maktab bluzkasi, chiroyli yoqa va to'q ko'k maktab yubkasi.",
    price: 60,
    slot: 'outfit',
    accentColor: '#1D4ED8',
  },
  {
    id: 'girl_vest_skirt',
    category: 'outfit',
    genderRestriction: 'girl',
    name: 'Maktab Nimchasi va Yubka',
    description: "Oq bluzka ustidan to'q ko'k klassik maktab nimchasi va to'q ko'k yubka.",
    price: 110,
    slot: 'outfit',
    accentColor: '#1E3A8A',
  },
  {
    id: 'girl_apron_uniform',
    category: 'outfit',
    genderRestriction: 'girl',
    name: 'Bayramona Oq Fartukli Forma',
    description: "Bayramona maktab ko'ylagi ustidan zarif oq fartuk — bayram va tadbirlar uchun.",
    price: 200,
    slot: 'outfit',
    accentColor: '#0F172A',
  },

  // =========================================================================
  // B) BOSH KIYIMLAR (hat) — Chust (boy), Oq bantik & Iroqi (girl), Qalpoqcha (both)
  // =========================================================================
  {
    id: 'chust_doppi',
    category: 'hat',
    genderRestriction: 'boy',
    name: "Milliy Chust Do'ppisi",
    description: "Qora baxmal va 4 tomonida oq bodom naqshli o'zbek milliy Chust do'ppisi.",
    price: 80,
    slot: 'hat',
    accentColor: '#0F172A',
  },
  {
    id: 'girl_white_bows',
    category: 'hat',
    genderRestriction: 'girl',
    name: 'Oq Maktab Bantigi',
    description: "Qiz bola sochining ikki yonida chiroyli ko'rinadigan 3D oq maktab bantiklari.",
    price: 40,
    slot: 'hat',
    accentColor: '#EC4899',
  },
  {
    id: 'iroqi_doppi',
    category: 'hat',
    genderRestriction: 'girl',
    name: "Bayramona Iroqi Do'ppi",
    description: "Qizlarga mos naqshli, ko'k va tilla kashtalar bilan bezatilgan milliy do'ppi.",
    price: 140,
    slot: 'hat',
    accentColor: '#0284C7',
  },
  {
    id: 'scholar_cap',
    category: 'hat',
    genderRestriction: 'both',
    name: 'Bilimdon Qalpoqchasi',
    description: "A'lochi va yosh olimlar kiyadigan, oltin popukli 3D akademik qalpoq.",
    price: 220,
    slot: 'hat',
    accentColor: '#4338CA',
  },

  // =========================================================================
  // C) SUMKALAR (bag) — Ikkala jins uchun umumiy
  // =========================================================================
  {
    id: 'basic_backpack',
    category: 'bag',
    genderRestriction: 'both',
    name: 'Oddiy Maktab Sumkasi',
    description: "Darsliklar va daftarlarni tartibli olib yurish uchun qulay ko'k-qizil 3D ryukzak.",
    price: 50,
    slot: 'bag',
    accentColor: '#2563EB',
  },
  {
    id: 'classic_satchel',
    category: 'bag',
    genderRestriction: 'both',
    name: 'Zamonaviy Maktab Portfeli',
    description: "Klassik jigarrang-ko'k, oltin qulfchali mustahkam 3D maktab portfeli.",
    price: 120,
    slot: 'bag',
    accentColor: '#92400E',
  },
  {
    id: 'gold_backpack',
    category: 'bag',
    genderRestriction: 'both',
    name: 'Oltin Bilimdon Sumkasi',
    description: "Yaltiroq oltin korpusli va moviy bezakli eng faol bilimdonlar sumkasi.",
    price: 180,
    slot: 'bag',
    accentColor: '#D97706',
  },

  // =========================================================================
  // D) AKSESSUARLAR (watch, medal, book) — Ikkala jins uchun umumiy
  // =========================================================================
  {
    id: 'school_watch',
    category: 'accessory',
    genderRestriction: 'both',
    name: "Maktab Qo'l Soati",
    description: "Chap bilakda turadigan 3D qo'l soati — vaqtni qadrlash va darsga kechikmaslik ramzi.",
    price: 70,
    slot: 'watch',
    accentColor: '#0D9488',
  },
  {
    id: 'honor_medal',
    category: 'accessory',
    genderRestriction: 'both',
    name: "A'lochi Oltin Medali",
    description: "Ko'krakda qizil-ko'k lenta bilan porlab turadigan yaltiroq 3D a'lochi medali.",
    price: 160,
    slot: 'medal',
    accentColor: '#EAB308',
  },
  {
    id: 'scholar_book',
    category: 'accessory',
    genderRestriction: 'both',
    name: 'Yosh Olim Kitobi',
    description: "O'ng qo'lda olib yuriladigan zarhal muqovali 3D kitob — kitobxonlik va ilm ramzi.",
    price: 190,
    slot: 'book',
    accentColor: '#059669',
  },
];

const SHOP_ITEM_BY_ID = new Map<string, ShopItem>(SHOP_ITEMS.map((item) => [item.id, item]));
const VALID_ITEM_IDS = new Set<string>(SHOP_ITEMS.map((i) => i.id));
const VALID_OUTFITS = new Set<string>([
  'white_shirt_tie',
  'school_vest',
  'formal_blazer',
  'girl_blouse_skirt',
  'girl_vest_skirt',
  'girl_apron_uniform',
]);
const VALID_HATS = new Set<string>(['chust_doppi', 'girl_white_bows', 'iroqi_doppi', 'scholar_cap']);
const VALID_BAGS = new Set<string>(['basic_backpack', 'classic_satchel', 'gold_backpack']);

export function isItemAllowedForGender(itemId: string, gender: PlayerGender): boolean {
  const item = SHOP_ITEM_BY_ID.get(itemId);
  if (!item) return false;
  return item.genderRestriction === 'both' || item.genderRestriction === gender;
}

/**
 * Removes any equipped items that do not match the given gender without touching ownedItems.
 */
export function filterEquippedForGender(
  equipped: EquippedAccessories,
  gender: PlayerGender
): EquippedAccessories {
  const next: EquippedAccessories = {};

  if (equipped.outfit && isItemAllowedForGender(equipped.outfit, gender)) {
    next.outfit = equipped.outfit;
  }
  if (equipped.hat && isItemAllowedForGender(equipped.hat, gender)) {
    next.hat = equipped.hat;
  }
  if (equipped.bag && isItemAllowedForGender(equipped.bag, gender)) {
    next.bag = equipped.bag;
  }
  if (equipped.watch && isItemAllowedForGender(equipped.watch, gender)) {
    next.watch = equipped.watch;
  }
  if (equipped.medal && isItemAllowedForGender(equipped.medal, gender)) {
    next.medal = equipped.medal;
  }
  if (equipped.book && isItemAllowedForGender(equipped.book, gender)) {
    next.book = equipped.book;
  }

  return next;
}

function sanitizeEquipped(raw: unknown, gender: PlayerGender): EquippedAccessories {
  if (!raw || typeof raw !== 'object') return {};
  const obj = raw as Record<string, unknown>;
  const clean: EquippedAccessories = {};

  if (typeof obj.outfit === 'string' && VALID_OUTFITS.has(obj.outfit)) {
    clean.outfit = obj.outfit as EquippedAccessories['outfit'];
  }
  if (typeof obj.hat === 'string' && VALID_HATS.has(obj.hat)) {
    clean.hat = obj.hat as EquippedAccessories['hat'];
  }

  // Gracefully migrate legacy `back` bag slot to `bag`, dropping removed items silently
  const bagCandidate =
    typeof obj.bag === 'string' ? obj.bag : typeof obj.back === 'string' ? obj.back : undefined;
  if (bagCandidate && VALID_BAGS.has(bagCandidate)) {
    clean.bag = bagCandidate as EquippedAccessories['bag'];
  }

  if (obj.watch === 'school_watch') {
    clean.watch = 'school_watch';
  }
  if (obj.medal === 'honor_medal') {
    clean.medal = 'honor_medal';
  }
  if (obj.book === 'scholar_book') {
    clean.book = 'scholar_book';
  }

  return filterEquippedForGender(clean, gender);
}

const STORAGE_KEY = 'bilimlar_maktabi_3d_profile_v1';

export const DEFAULT_STATS: PlayerStats = {
  trashCollected: 0,
  greetingsGiven: 0,
  mathCompleted: 0,
  languageCompleted: 0,
};

export const DEFAULT_PROFILE: PlayerProfile = {
  name: '',
  gender: 'boy',
  grade: 5,
  shirtColor: SHIRT_COLORS[0].hex,
  coins: 0,
  ownedItems: [],
  equipped: {},
  completedLessons: 0,
  subjectCompletions: {
    alifbe: 0,
    math: 0,
    english: 0,
    cs: 0,
    science: 0,
  },
  activeSubjectIndex: 0,
  stats: { ...DEFAULT_STATS },
  unlockedAwards: [],
};

function sanitizeNonNegInt(val: unknown): number {
  return typeof val === 'number' && Number.isFinite(val) && val > 0 ? Math.floor(val) : 0;
}

export function loadProfile(): PlayerProfile | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    if (!parsed || typeof parsed !== 'object') return null;

    const cleanGender: PlayerGender = parsed.gender === 'girl' ? 'girl' : 'boy';

    const cleanOwned: ShopItemId[] = Array.isArray(parsed.ownedItems)
      ? parsed.ownedItems.filter(
          (id): id is ShopItemId => typeof id === 'string' && VALID_ITEM_IDS.has(id)
        )
      : [];

    const cleanEquipped = sanitizeEquipped(parsed.equipped, cleanGender);

    const rawStats = parsed.stats as Partial<PlayerStats> | undefined;
    const cleanStats: PlayerStats = {
      trashCollected: sanitizeNonNegInt(rawStats?.trashCollected),
      greetingsGiven: sanitizeNonNegInt(rawStats?.greetingsGiven),
      mathCompleted: sanitizeNonNegInt(rawStats?.mathCompleted),
      languageCompleted: sanitizeNonNegInt(rawStats?.languageCompleted),
    };

    const cleanUnlockedAwards: string[] = Array.isArray(parsed.unlockedAwards)
      ? Array.from(
          new Set(
            parsed.unlockedAwards.filter(
              (id): id is string => typeof id === 'string' && VALID_AWARD_IDS.has(id)
            )
          )
        )
      : [];

    return {
      name: typeof parsed.name === 'string' ? parsed.name : '',
      gender: cleanGender,
      grade:
        typeof parsed.grade === 'number' && parsed.grade >= 1 && parsed.grade <= 11
          ? Math.round(parsed.grade)
          : 5,
      shirtColor:
        typeof parsed.shirtColor === 'string' && parsed.shirtColor.startsWith('#')
          ? parsed.shirtColor
          : SHIRT_COLORS[0].hex,
      coins: typeof parsed.coins === 'number' && parsed.coins >= 0 ? Math.floor(parsed.coins) : 0,
      ownedItems: cleanOwned,
      equipped: cleanEquipped,
      completedLessons:
        typeof parsed.completedLessons === 'number' ? Math.max(0, parsed.completedLessons) : 0,
      subjectCompletions: {
        alifbe: parsed.subjectCompletions?.alifbe ?? 0,
        math: parsed.subjectCompletions?.math ?? 0,
        english: parsed.subjectCompletions?.english ?? 0,
        cs: parsed.subjectCompletions?.cs ?? 0,
        science: parsed.subjectCompletions?.science ?? 0,
      },
      activeSubjectIndex:
        typeof parsed.activeSubjectIndex === 'number'
          ? Math.max(0, Math.floor(parsed.activeSubjectIndex))
          : 0,
      stats: cleanStats,
      unlockedAwards: cleanUnlockedAwards,
    };
  } catch {
    return null;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore quota/private mode errors silently
  }
}

export function getDifficultyTier(grade: number): 'elementary' | 'middle' | 'high' {
  if (grade <= 4) return 'elementary';
  if (grade <= 8) return 'middle';
  return 'high';
}

export function getTierLabel(grade: number): string {
  if (grade === 1) return "1-sinf · Boshlang'ich (12 ta dars)";
  if (grade <= 4) return "Boshlang'ich daraja (1–4-sinf)";
  if (grade <= 8) return "O'rta daraja (5–8-sinf)";
  return 'Yuqori daraja (9–11-sinf)';
}
