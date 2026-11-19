export type SubjectId = 'math' | 'english' | 'cs' | 'science' | 'alifbe';

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
    | 'girl_apron_uniform';
  hat?: 'chust_doppi' | 'girl_white_bows' | 'iroqi_doppi' | 'scholar_cap';
  bag?: 'basic_backpack' | 'classic_satchel' | 'gold_backpack';
  watch?: 'school_watch';
  medal?: 'honor_medal';
  book?: 'scholar_book';
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
}

export interface ShirtColorOption {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
}

export type FloorNumber = 1 | 2 | 3;

export type ComingSoonZoneId = 'ona_tili' | 'tarix' | 'fizika';

export type ZoneId = SubjectId | 'shop' | 'schedule' | 'elevator' | ComingSoonZoneId;

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
