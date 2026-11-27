export type SubjectId = 'math' | 'english' | 'cs' | 'science' | 'alifbe' | 'pe';

export type DifficultyTier = 'elementary' | 'middle' | 'high';

export type PlayerGender = 'boy' | 'girl';
export type GenderRestriction = 'boy' | 'girl' | 'both';

export type ShopCategory = 'outfit' | 'hat' | 'bag' | 'accessory';

export type ShopItemId =
  // Boy outfits
  | 'white_shirt_tie'
  | 'school_vest'
  | 'formal_blazer'
  // Girl outfits
  | 'girl_blouse_skirt'
  | 'girl_vest_skirt'
  | 'girl_apron_uniform'
  // Universal student outfits (both boy & girl)
  | 'sport_uniform'
  | 'ceremonial_uniform'
  // Hats / Headwear
  | 'chust_doppi'
  | 'girl_white_bows'
  | 'iroqi_doppi'
  | 'scholar_cap'
  // Bags
  | 'basic_backpack'
  | 'classic_satchel'
  | 'gold_backpack'
  // Accessories
  | 'school_watch'
  | 'honor_medal'
  | 'scholar_book';

export type AccessorySlot = 'outfit' | 'hat' | 'bag' | 'watch' | 'medal' | 'book';

export interface ShopItem {
  id: ShopItemId;
  category: ShopCategory;
  genderRestriction: GenderRestriction;
  name: string;
  description: string;
  price: number;
  slot: AccessorySlot;
  accentColor: string;
  perkLabel?: string;
}

export interface EquippedAccessories {
  outfit?:
    | 'white_shirt_tie'
    | 'school_vest'
    | 'formal_blazer'
    | 'girl_blouse_skirt'
    | 'girl_vest_skirt'
    | 'girl_apron_uniform'
    | 'sport_uniform'
    | 'ceremonial_uniform';
  hat?: 'chust_doppi' | 'girl_white_bows' | 'iroqi_doppi' | 'scholar_cap';
  bag?: 'basic_backpack' | 'classic_satchel' | 'gold_backpack';
  watch?: 'school_watch';
  medal?: 'honor_medal';
  book?: 'scholar_book';
}

export type AwardCategoryId = 'cleanliness' | 'greeting' | 'math' | 'language' | 'sport';
export type AwardTier = 'bronze' | 'silver' | 'gold';

export interface PlayerStats {
  trashCollected: number;
  greetingsGiven: number;
  mathCompleted: number;
  languageCompleted: number;
  sportCompleted: number;
}

export interface AwardDefinition {
  id: string;
  category: AwardCategoryId;
  tier: AwardTier;
  title: string;
  targetCount: number;
  rewardCoins: number;
  unitLabel: string;
}

export interface PlayerProfile {
  name: string;
  gender: PlayerGender;
  grade: number; // 1 to 11
  shirtColor: string;
  coins: number;
  ownedItems: ShopItemId[];
  equipped: EquippedAccessories;
  completedLessons: number;
  subjectCompletions: Record<SubjectId, number>;
  activeSubjectIndex: number; // 0..3 cycling through SUBJECT_ORDER
  stats: PlayerStats;
  unlockedAwards: string[];
}

export interface ShirtColorOption {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
}

export type FloorNumber = 1 | 2 | 3;

export type ComingSoonZoneId = 'ona_tili' | 'tarix' | 'fizika';

export type ZoneId = SubjectId | 'shop' | 'schedule' | 'elevator' | ComingSoonZoneId | 'exit_gym';

export interface WorldZone {
  id: ZoneId;
  floor: FloorNumber;
  title: string;
  shortTitle: string;
  color: string;
  x: number;
  z: number;
  triggerX: number;
  triggerZ: number;
  triggerRadius: number;
  facingAngle: number;
  comingSoon?: boolean;
}

export interface VirtualControlsState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

export type AvatarEmote =
  | 'salom'
  | 'qarsak'
  | 'quvonch'
  | 'milliy_raqs'
  | 'urm_warmup'
  | 'somersault'
  | 'bar_hang'
  | 'ladder_climb'
  | 'throw_ball';

export interface EmoteRequest {
  emote: AvatarEmote;
  durationSec?: number;
  token: number;
}

export interface TeacherGreetingPrompt {
  teacherId: string;
  teacherName: string;
  timeRemainingSec: number;
  totalTimeSec: number;
}

export type TrashKind = 'paper' | 'juice' | 'bottle';

export interface TrashPickupPrompt {
  mode: 'pickup' | 'carrying' | 'dropoff';
  trashId: string;
  trashKind: TrashKind;
  trashLabel: string;
  timeRemainingSec: number;
  totalTimeSec: number;
}

export interface EthicsFeedbackToast {
  id: number;
  kind: 'reward' | 'penalty';
  deltaCoins: number;
  title: string;
  subtitle: string;
}

export type GymModeKind =
  | 'saf_mashqlari'
  | 'number_reaction'
  | 'tag_chase'
  | 'urm_warmup'
  | 'relay_course'
  | 'kun_va_tun'
  | 'apparatus_acro'
  | 'jump_challenge'
  | 'ball_throw'
  | 'shashka_3d';

export interface GymGameSnapshot {
  lessonIndex: number; // 0..33
  mode: GymModeKind;
  step: number;
  totalSteps: number;
  score: number;
  completed: boolean;
  commandText: string;
  subHintText: string;
  timerSec: number | null;
  // Contextual 3D mechanic HUD indicators:
  actionPrompt: string | null; // e.g., "E — Turnikda mashq boshlash" or "E — Shashka stoliga o'tirish"
  dayNightPhase?: 'kun' | 'tun'; // Lesson 19
  timingActive?: boolean; // Apparatus / Jump power / Ball aim bar
  timingValue?: number; // 0..100
  timingSweetMin?: number; // 0..100
  timingSweetMax?: number; // 0..100
  timingLabel?: string; // e.g., "Space — Yashil zonada bosing!" or "Space bosib turing — Sakrash kuchi"
  aimAngleDeg?: number; // Ball throw aim angle (-35..35)
  shashkaActive?: boolean; // Seated at 3D Shashka board
  shashkaTurnHint?: string;
}

