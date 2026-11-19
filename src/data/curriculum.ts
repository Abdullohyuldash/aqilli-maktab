import { DifficultyTier, FloorNumber, SubjectId, WorldZone } from '../types';
import { getDifficultyTier } from '../utils/storage';
import { MATH_GRADE_1_LESSONS } from './mathGrade1';
import { ENGLISH_GRADE_1_LESSONS } from './englishGrade1';
import { CS_GRADE_1_LESSONS } from './csGrade1';
import { SCIENCE_GRADE_1_LESSONS } from './scienceGrade1';
import { ALIFBE_GRADE_1_LESSONS } from './alifbeGrade1';

export interface FloorMeta {
  floor: FloorNumber;
  title: string;
  subtitle: string;
  roomsSummary: string;
  accentColor: string;
  accentHexNum: number;
  wallColorNum: number;
  wainscotColorNum: number;
  lockerColorNum: number;
  lockerVentColorNum: number;
  floorLightHex: string;
  floorDarkHex: string;
  medallionBgHex: string;
  medallionRingHex: string;
  medallionSubLabel: string;
}

export const FLOOR_META: Record<FloorNumber, FloorMeta> = {
  1: {
    floor: 1,
    title: '1-qavat',
    subtitle: 'Asosiy qavat',
    roomsSummary: "Alifbe, Matematika, Do'kon, Jadval",
    accentColor: '#2563EB',
    accentHexNum: 0x3b82f6,
    wallColorNum: 0xf8fafc,
    wainscotColorNum: 0xe2e8f0,
    lockerColorNum: 0x3b82f6,
    lockerVentColorNum: 0x1e3a8a,
    floorLightHex: '#F8FAFC',
    floorDarkHex: '#CBD5E1',
    medallionBgHex: '#EFF6FF',
    medallionRingHex: '#3B82F6',
    medallionSubLabel: '1-QAVAT • ASOSIY',
  },
  2: {
    floor: 2,
    title: '2-qavat',
    subtitle: 'Tillar va Ijtimoiy fanlar',
    roomsSummary: 'Ingliz tili, Ona tili, Tarix',
    accentColor: '#059669',
    accentHexNum: 0x10b981,
    wallColorNum: 0xf6fbf8,
    wainscotColorNum: 0xd1fae5,
    lockerColorNum: 0x10b981,
    lockerVentColorNum: 0x065f46,
    floorLightHex: '#F7FEF9',
    floorDarkHex: '#D1FAE5',
    medallionBgHex: '#ECFDF5',
    medallionRingHex: '#10B981',
    medallionSubLabel: '2-QAVAT • TILLAR',
  },
  3: {
    floor: 3,
    title: '3-qavat',
    subtitle: 'Aniq va Tabiiy fanlar',
    roomsSummary: 'Informatika, Tabiiy fanlar, Fizika',
    accentColor: '#7C3AED',
    accentHexNum: 0x7c3aed,
    wallColorNum: 0xf5f7ff,
    wainscotColorNum: 0xe0e7ff,
    lockerColorNum: 0x6366f1,
    lockerVentColorNum: 0x312e81,
    floorLightHex: '#F8F7FF',
    floorDarkHex: '#E0E7FF',
    medallionBgHex: '#F5F3FF',
    medallionRingHex: '#7C3AED',
    medallionSubLabel: '3-QAVAT • FANLAR',
  },
};

export interface SubjectMeta {
  id: SubjectId;
  floor: FloorNumber;
  name: string;
  roomName: string;
  teacherName: string;
  teacherTitle: string;
  color: string;
  bgTint: string;
  borderTint: string;
  notificationText: string;
}

export const SUBJECT_META: Record<SubjectId, SubjectMeta> = {
  alifbe: {
    id: 'alifbe',
    floor: 1,
    name: 'Alifbe',
    roomName: 'Alifbe xonasi',
    teacherName: 'Ustoz Dilnoza',
    teacherTitle: 'Alifbe o‘qituvchisi',
    color: '#E11D48',
    bgTint: '#FFF1F2',
    borderTint: '#FECDD3',
    notificationText: 'Hozir Alifbe darsi! Alifbe xonasiga kiring!',
  },
  math: {
    id: 'math',
    floor: 1,
    name: 'Matematika',
    roomName: 'Matematika xonasi',
    teacherName: 'Ustoz Aziza',
    teacherTitle: 'Matematika o‘qituvchisi',
    color: '#2563EB',
    bgTint: '#EFF6FF',
    borderTint: '#BFDBFE',
    notificationText: 'Hozir Matematika darsi! Matematika xonasiga kiring!',
  },
  english: {
    id: 'english',
    floor: 2,
    name: 'Ingliz tili',
    roomName: 'Ingliz tili xonasi',
    teacherName: 'Teacher Malika',
    teacherTitle: 'Ingliz tili o‘qituvchisi',
    color: '#16A34A',
    bgTint: '#F0FDF4',
    borderTint: '#BBF7D0',
    notificationText: 'Hozir Ingliz tili darsi! Ingliz tili xonasiga kiring!',
  },
  cs: {
    id: 'cs',
    floor: 3,
    name: 'Informatika',
    roomName: 'Informatika xonasi',
    teacherName: 'Ustoz Sardor',
    teacherTitle: 'Informatika o‘qituvchisi',
    color: '#7C3AED',
    bgTint: '#F5F3FF',
    borderTint: '#DDD6FE',
    notificationText: 'Hozir Informatika darsi! Informatika xonasiga kiring!',
  },
  science: {
    id: 'science',
    floor: 3,
    name: 'Tabiiy fanlar',
    roomName: 'Tabiiy fanlar xonasi',
    teacherName: 'Ustoz Nodir',
    teacherTitle: 'Tabiiy fanlar o‘qituvchisi',
    color: '#EA580C',
    bgTint: '#FFF7ED',
    borderTint: '#FED7AA',
    notificationText: 'Hozir Tabiiy fanlar darsi! Tabiiy fanlar xonasiga kiring!',
  },
};

export const ELEVATOR_TRIGGER = {
  x: 0,
  z: -13.0,
  triggerX: 0,
  triggerZ: -9.85,
  triggerRadius: 2.35,
  spawnX: 0,
  spawnZ: -6.4,
};

export const WORLD_ZONES: WorldZone[] = [
  // ==================== 1-QAVAT (Asosiy qavat) ====================
  {
    id: 'elevator',
    floor: 1,
    title: 'Lift (1-qavat)',
    shortTitle: 'Lift',
    color: '#0284C7',
    x: ELEVATOR_TRIGGER.x,
    z: ELEVATOR_TRIGGER.z,
    triggerX: ELEVATOR_TRIGGER.triggerX,
    triggerZ: ELEVATOR_TRIGGER.triggerZ,
    triggerRadius: ELEVATOR_TRIGGER.triggerRadius,
    facingAngle: 0,
  },
  {
    id: 'alifbe',
    floor: 1,
    title: 'Alifbe xonasi',
    shortTitle: 'Alifbe',
    color: '#E11D48',
    x: -14.8,
    z: -2.2,
    triggerX: -12.0,
    triggerZ: -2.2,
    triggerRadius: 2.75,
    facingAngle: Math.PI / 2,
  },
  {
    id: 'math',
    floor: 1,
    title: 'Matematika xonasi',
    shortTitle: 'Matematika',
    color: '#2563EB',
    x: 14.8,
    z: -2.2,
    triggerX: 12.0,
    triggerZ: -2.2,
    triggerRadius: 2.75,
    facingAngle: -Math.PI / 2,
  },
  {
    id: 'schedule',
    floor: 1,
    title: 'Dars jadvali',
    shortTitle: 'Jadval',
    color: '#0D9488',
    x: -8.0,
    z: -12.88,
    triggerX: -8.0,
    triggerZ: -10.1,
    triggerRadius: 2.35,
    facingAngle: 0,
  },
  {
    id: 'shop',
    floor: 1,
    title: "Maktab Do'koni",
    shortTitle: "Do'kon",
    color: '#F59E0B',
    x: 8.0,
    z: -11.4,
    triggerX: 8.0,
    triggerZ: -8.3,
    triggerRadius: 2.75,
    facingAngle: 0,
  },

  // ==================== 2-QAVAT (Tillar va Ijtimoiy fanlar) ====================
  {
    id: 'elevator',
    floor: 2,
    title: 'Lift (2-qavat)',
    shortTitle: 'Lift',
    color: '#059669',
    x: ELEVATOR_TRIGGER.x,
    z: ELEVATOR_TRIGGER.z,
    triggerX: ELEVATOR_TRIGGER.triggerX,
    triggerZ: ELEVATOR_TRIGGER.triggerZ,
    triggerRadius: ELEVATOR_TRIGGER.triggerRadius,
    facingAngle: 0,
  },
  {
    id: 'english',
    floor: 2,
    title: 'Ingliz tili xonasi',
    shortTitle: 'Ingliz tili',
    color: '#16A34A',
    x: -14.8,
    z: -2.2,
    triggerX: -12.0,
    triggerZ: -2.2,
    triggerRadius: 2.75,
    facingAngle: Math.PI / 2,
  },
  {
    id: 'ona_tili',
    floor: 2,
    title: 'Ona tili xonasi',
    shortTitle: 'Ona tili',
    color: '#0891B2',
    x: 14.8,
    z: -5.4,
    triggerX: 12.0,
    triggerZ: -5.4,
    triggerRadius: 2.55,
    facingAngle: -Math.PI / 2,
    comingSoon: true,
  },
  {
    id: 'tarix',
    floor: 2,
    title: 'Tarix xonasi',
    shortTitle: 'Tarix',
    color: '#B45309',
    x: 14.8,
    z: 5.4,
    triggerX: 12.0,
    triggerZ: 5.4,
    triggerRadius: 2.55,
    facingAngle: -Math.PI / 2,
    comingSoon: true,
  },

  // ==================== 3-QAVAT (Aniq va Tabiiy fanlar) ====================
  {
    id: 'elevator',
    floor: 3,
    title: 'Lift (3-qavat)',
    shortTitle: 'Lift',
    color: '#7C3AED',
    x: ELEVATOR_TRIGGER.x,
    z: ELEVATOR_TRIGGER.z,
    triggerX: ELEVATOR_TRIGGER.triggerX,
    triggerZ: ELEVATOR_TRIGGER.triggerZ,
    triggerRadius: ELEVATOR_TRIGGER.triggerRadius,
    facingAngle: 0,
  },
  {
    id: 'cs',
    floor: 3,
    title: 'Informatika xonasi',
    shortTitle: 'Informatika',
    color: '#7C3AED',
    x: -14.8,
    z: -5.4,
    triggerX: -12.0,
    triggerZ: -5.4,
    triggerRadius: 2.75,
    facingAngle: Math.PI / 2,
  },
  {
    id: 'science',
    floor: 3,
    title: 'Tabiiy fanlar xonasi',
    shortTitle: 'Tabiiy fanlar',
    color: '#EA580C',
    x: 14.8,
    z: -5.4,
    triggerX: 12.0,
    triggerZ: -5.4,
    triggerRadius: 2.75,
    facingAngle: -Math.PI / 2,
  },
  {
    id: 'fizika',
    floor: 3,
    title: 'Fizika laboratoriyasi',
    shortTitle: 'Fizika',
    color: '#0284C7',
    x: -14.8,
    z: 5.4,
    triggerX: -12.0,
    triggerZ: 5.4,
    triggerRadius: 2.55,
    facingAngle: Math.PI / 2,
    comingSoon: true,
  },
];

export function getZonesForFloor(floor: FloorNumber): WorldZone[] {
  return WORLD_ZONES.filter((z) => z.floor === floor);
}

// --- Mini-game Round Schemas ---

export interface MathRound {
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  timeLimitSec: number;
}

export interface EnglishMatchRound {
  kind: 'match';
  instruction: string;
  pairs: { uz: string; en: string }[];
}

export interface EnglishFillRound {
  kind: 'fill';
  instruction: string;
  sentence: string; // includes "___"
  translation: string;
  options: string[];
  correctAnswer: string;
}

export type EnglishRound = EnglishMatchRound | EnglishFillRound;

export interface CsOrderRound {
  kind: 'order';
  prompt: string;
  correctSteps: string[];
  explanation: string;
}

export interface CsChoiceRound {
  kind: 'choice';
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type CsRound = CsOrderRound | CsChoiceRound;

export interface ScienceRound {
  kind: 'true_false' | 'quiz';
  icon: 'sun' | 'leaf' | 'atom' | 'droplet' | 'globe' | 'zap' | 'flame' | 'heart';
  statement: string;
  options: string[]; // For true_false: ["To'g'ri", "Noto'g'ri"]
  correctAnswer: string;
  fact: string;
}

export interface AlifbeCard {
  letter: string;
  emoji: string;
  word: string;
}

export interface AlifbeFirstLetterRound {
  kind: 'first_letter';
  emoji: string;
  word: string;
  spokenPrompt: string;
  options: string[];
  correctAnswer: string;
}

export interface AlifbeBuildWordRound {
  kind: 'build_word';
  emoji: string;
  word: string;
  spokenPrompt: string;
  parts: string[];
}

export interface AlifbeLetterMatchRound {
  kind: 'letter_match';
  spokenPrompt: string;
  pairs: { letter: string; emoji: string; word: string }[];
}

export type AlifbeRound =
  | AlifbeFirstLetterRound
  | AlifbeBuildWordRound
  | AlifbeLetterMatchRound;

export interface LessonPlan {
  subject: SubjectId;
  tier: DifficultyTier;
  grade?: number;
  topicTitle: string;
  ruleTitle: string;
  explanation: string;
  formulaOrRule: string;
  exampleProblem: string;
  exampleSolution: string;
  alifbeCards?: AlifbeCard[];
  alifbeRounds?: AlifbeRound[];
  mathRounds?: MathRound[];
  englishRounds?: EnglishRound[];
  csRounds?: CsRound[];
  scienceRounds?: ScienceRound[];
}

const LESSONS: Record<SubjectId, Record<DifficultyTier, LessonPlan[]>> = {
  alifbe: {
    elementary: [...ALIFBE_GRADE_1_LESSONS],
    middle: [],
    high: [],
  },
  math: {
    elementary: [
      {
        subject: 'math',
        tier: 'elementary',
        topicTitle: "Tezkor Qo'shish va Ko'paytirish",
        ruleTitle: 'Qoida',
        explanation:
          "Ko'paytirish — bir xil sonlarni tez qo'shish usulidir. Avval qavs ichidagi yoki ko'paytirish amalini bajarish hisobni osonlashtiradi.",
        formulaOrRule: 'a × b = a ni b marta qo‘shish',
        exampleProblem: '4 × 5 + 6 = ?',
        exampleSolution: '4 × 5 = 20, keyin 20 + 6 = 26',
        mathRounds: [
          { prompt: '14 + 19 = ?', options: ['31', '33', '35', '29'], correctAnswer: '33', hint: '14 + 20 - 1', timeLimitSec: 16 },
          { prompt: '6 × 4 = ?', options: ['20', '24', '28', '18'], correctAnswer: '24', hint: '6 + 6 + 6 + 6', timeLimitSec: 16 },
          { prompt: '45 − 18 = ?', options: ['27', '25', '33', '29'], correctAnswer: '27', hint: '45 - 20 + 2', timeLimitSec: 16 },
          { prompt: '3 × 7 + 5 = ?', options: ['26', '24', '36', '21'], correctAnswer: '26', hint: 'Avval 3 × 7 = 21', timeLimitSec: 16 },
        ],
      },
      {
        subject: 'math',
        tier: 'elementary',
        topicTitle: "Bo'lish va Perimetr",
        ruleTitle: 'Kvadrat perimetri',
        explanation:
          "Kvadratning barcha 4 tomoni teng. Perimetrni topish uchun bitta tomon uzunligini 4 ga ko'paytiramiz.",
        formulaOrRule: 'P = 4 × a',
        exampleProblem: 'Tomoni 6 sm bo‘lgan kvadrat perimetri?',
        exampleSolution: 'P = 4 × 6 = 24 sm',
        mathRounds: [
          { prompt: '36 ÷ 4 = ?', options: ['8', '9', '7', '12'], correctAnswer: '9', hint: '4 × 9 = 36', timeLimitSec: 16 },
          { prompt: 'Tomoni 5 sm kvadrat perimetri?', options: ['20 sm', '25 sm', '15 sm', '10 sm'], correctAnswer: '20 sm', hint: '4 × 5', timeLimitSec: 16 },
          { prompt: '8 × 6 = ?', options: ['42', '48', '54', '46'], correctAnswer: '48', hint: '8 × 5 + 8', timeLimitSec: 16 },
          { prompt: '56 ÷ 7 = ?', options: ['6', '7', '8', '9'], correctAnswer: '8', hint: '7 × 8 = 56', timeLimitSec: 16 },
        ],
      },
    ],
    middle: [
      {
        subject: 'math',
        tier: 'middle',
        topicTitle: 'Chiziqli Tenglamalar va Foizlar',
        ruleTitle: 'Tenglama yechish',
        explanation:
          "Tenglamada noma'lum x ni topish uchun qo'shilgan sonni tenglikning narigi tomoniga qarama-qarshi ishora bilan o'tkazamiz.",
        formulaOrRule: 'a·x + b = c  ⇒  x = (c − b) / a',
        exampleProblem: '3x + 7 = 22 bo‘lsa, x = ?',
        exampleSolution: '3x = 22 − 7 = 15, demak x = 15 ÷ 3 = 5',
        mathRounds: [
          { prompt: '2x + 6 = 18  ⇒  x = ?', options: ['5', '6', '7', '4'], correctAnswer: '6', hint: '2x = 12', timeLimitSec: 16 },
          { prompt: '200 ning 15% i nechaga teng?', options: ['25', '30', '35', '40'], correctAnswer: '30', hint: '200 × 0.15', timeLimitSec: 16 },
          { prompt: '4x − 5 = 19  ⇒  x = ?', options: ['6', '5', '7', '8'], correctAnswer: '6', hint: '4x = 24', timeLimitSec: 16 },
          { prompt: '3² + 4² = ?', options: ['25', '14', '49', '21'], correctAnswer: '25', hint: '9 + 16', timeLimitSec: 16 },
        ],
      },
      {
        subject: 'math',
        tier: 'middle',
        topicTitle: 'Kasrlar va Yuza Formulalari',
        ruleTitle: 'Uchburchak yuzi',
        explanation:
          "Uchburchakning yuzini topish uchun asosini balandligiga ko'paytirib, natijani 2 ga bo'lamiz.",
        formulaOrRule: 'S = (a × h) / 2',
        exampleProblem: 'Asosi 10 sm, balandligi 6 sm uchburchak yuzi?',
        exampleSolution: 'S = (10 × 6) / 2 = 30 sm²',
        mathRounds: [
          { prompt: 'Asosi 8 sm, balandligi 5 sm uchburchak yuzi?', options: ['20 sm²', '40 sm²', '13 sm²', '25 sm²'], correctAnswer: '20 sm²', hint: '(8 × 5) ÷ 2', timeLimitSec: 16 },
          { prompt: '3/4 + 5/4 = ?', options: ['2', '1.5', '8/8', '2.5'], correctAnswer: '2', hint: '8/4 = 2', timeLimitSec: 16 },
          { prompt: '√81 + √16 = ?', options: ['13', '15', '12', '14'], correctAnswer: '13', hint: '9 + 4', timeLimitSec: 16 },
          { prompt: '5(x − 2) = 25  ⇒  x = ?', options: ['7', '5', '3', '9'], correctAnswer: '7', hint: 'x - 2 = 5', timeLimitSec: 16 },
        ],
      },
    ],
    high: [
      {
        subject: 'math',
        tier: 'high',
        topicTitle: 'Kvadrat Tenglama va Logarifmlar',
        ruleTitle: 'Viyet teoremasi va logarifm',
        explanation:
          "x² + px + q = 0 kvadrat tenglama ildizlari yig'indisi −p ga, ko'paytmasi esa q ga teng. Logarifm esa daraja ko'rsatkichini topadi.",
        formulaOrRule: 'x₁ + x₂ = −p,  x₁·x₂ = q  |  logₐ(aⁿ) = n',
        exampleProblem: 'log₂(32) = ?',
        exampleSolution: '2⁵ = 32 bo‘lgani uchun log₂(32) = 5',
        mathRounds: [
          { prompt: 'log₂(16) = ?', options: ['4', '3', '5', '8'], correctAnswer: '4', hint: '2⁴ = 16', timeLimitSec: 16 },
          { prompt: 'x² − 7x + 12 = 0 ildizlari yig‘indisi?', options: ['7', '-7', '12', '5'], correctAnswer: '7', hint: 'Viyet: −p = 7', timeLimitSec: 16 },
          { prompt: 'sin(30°) + cos(60°) = ?', options: ['1', '0.5', '√3', '1.5'], correctAnswer: '1', hint: '0.5 + 0.5', timeLimitSec: 16 },
          { prompt: '(x³)′ ning x = 2 dagi hosilasi?', options: ['12', '8', '6', '16'], correctAnswer: '12', hint: '3x² = 3 × 4', timeLimitSec: 16 },
        ],
      },
      {
        subject: 'math',
        tier: 'high',
        topicTitle: 'Progressiyalar va Trigonometriya',
        ruleTitle: 'Arifmetik progressiya',
        explanation:
          "Arifmetik progressiyaning n-hadi birinchi hadga (n−1) ta ayirmani qo'shish orqali topiladi.",
        formulaOrRule: 'aₙ = a₁ + (n − 1)·d',
        exampleProblem: 'a₁ = 3, d = 4 bo‘lsa, a₅ = ?',
        exampleSolution: 'a₅ = 3 + 4×4 = 19',
        mathRounds: [
          { prompt: 'a₁ = 2, d = 5 bo‘lsa, a₄ = ?', options: ['17', '15', '22', '12'], correctAnswer: '17', hint: '2 + 3×5', timeLimitSec: 16 },
          { prompt: 'log₃(27) = ?', options: ['3', '9', '2', '4'], correctAnswer: '3', hint: '3³ = 27', timeLimitSec: 16 },
          { prompt: 'cos(0°) + sin(90°) = ?', options: ['2', '1', '0', '√2'], correctAnswer: '2', hint: '1 + 1', timeLimitSec: 16 },
          { prompt: '2ˣ = 64  ⇒  x = ?', options: ['6', '5', '7', '8'], correctAnswer: '6', hint: '2⁶ = 64', timeLimitSec: 16 },
        ],
      },
    ],
  },

  english: {
    elementary: [
      {
        subject: 'english',
        tier: 'elementary',
        topicTitle: "Maktab va Kundalik So'zlar",
        ruleTitle: 'Asosiy lug‘at va "is / are"',
        explanation:
          "Ingliz tilida bitta narsa haqida gapirganda 'is', ko'p narsalar haqida gapirganda esa 'are' ishlatiladi.",
        formulaOrRule: 'It is a book (1 ta)  |  They are books (ko‘p)',
        exampleProblem: 'This ___ my red pen.',
        exampleSolution: 'This is my red pen. (Bu mening qizil ruchkam.)',
        englishRounds: [
          {
            kind: 'match',
            instruction: "O'zbekcha so'zlarni inglizcha tarjimasi bilan juftlang:",
            pairs: [
              { uz: 'Kitob', en: 'Book' },
              { uz: 'Qalam', en: 'Pencil' },
              { uz: 'Maktab', en: 'School' },
              { uz: 'Sumka', en: 'Bag' },
            ],
          },
          {
            kind: 'fill',
            instruction: "Bo'sh joyga mos so'zni tanlang:",
            sentence: 'The sun ___ bright today.',
            translation: 'Bugun quyosh yorqin.',
            options: ['is', 'are', 'am', 'be'],
            correctAnswer: 'is',
          },
          {
            kind: 'match',
            instruction: "Hayvonlar va ranglarni juftlang:",
            pairs: [
              { uz: 'Mushuk', en: 'Cat' },
              { uz: 'Olma', en: 'Apple' },
              { uz: "Ko'k", en: 'Blue' },
              { uz: 'Yashil', en: 'Green' },
            ],
          },
          {
            kind: 'fill',
            instruction: "Bo'sh joyni to'ldiring:",
            sentence: 'I ___ a student.',
            translation: 'Men o‘quvchiman.',
            options: ['am', 'is', 'are', 'has'],
            correctAnswer: 'am',
          },
        ],
      },
      ...ENGLISH_GRADE_1_LESSONS,
    ],
    middle: [
      {
        subject: 'english',
        tier: 'middle',
        topicTitle: 'Present Simple va O‘tgan Zamon',
        ruleTitle: 'He / She / It qoidasi',
        explanation:
          "Present Simple zamonida 'he, she, it' olmoshlari bilan fe'l oxiriga -s yoki -es qo'shiladi. O'tgan zamonda esa noto'g'ri fe'llar shakli o'zgaradi.",
        formulaOrRule: 'She reads every day  |  go → went, see → saw',
        exampleProblem: 'Aziz ___ football after school.',
        exampleSolution: 'Aziz plays football after school.',
        englishRounds: [
          {
            kind: 'match',
            instruction: "Fe'llarni tarjimasi bilan juftlang:",
            pairs: [
              { uz: 'O‘rganmoq', en: 'Learn' },
              { uz: 'Yozmoq', en: 'Write' },
              { uz: 'Yugurmoq', en: 'Run' },
              { uz: 'O‘ylamoq', en: 'Think' },
            ],
          },
          {
            kind: 'fill',
            instruction: "To'g'ri fe'l shaklini tanlang:",
            sentence: 'My sister ___ English very well.',
            translation: 'Mening opam ingliz tilini juda yaxshi biladi.',
            options: ['speaks', 'speak', 'speaking', 'spoke to'],
            correctAnswer: 'speaks',
          },
          {
            kind: 'match',
            instruction: "Maktab fanlarini juftlang:",
            pairs: [
              { uz: 'Tarix', en: 'History' },
              { uz: 'Fan', en: 'Science' },
              { uz: 'Kutubxona', en: 'Library' },
              { uz: 'Sinfxona', en: 'Classroom' },
            ],
          },
          {
            kind: 'fill',
            instruction: "O'tgan zamon (Past Simple) shaklini tanlang:",
            sentence: 'Yesterday we ___ to the museum.',
            translation: 'Kecha biz muzeyga bordik.',
            options: ['went', 'go', 'goes', 'going'],
            correctAnswer: 'went',
          },
        ],
      },
    ],
    high: [
      {
        subject: 'english',
        tier: 'high',
        topicTitle: 'Conditionals va Akademik Lug‘at',
        ruleTitle: 'First & Second Conditional',
        explanation:
          "Birinchi shart gapda (real kelajak) 'If + Present Simple, will + V1' ishlatiladi. Ikkinchi shart gapda (tasavvuriy holat) 'If + Past Simple, would + V1' ishlatiladi.",
        formulaOrRule: 'If you study hard, you will succeed.',
        exampleProblem: 'If it rains, we ___ stay at home.',
        exampleSolution: 'If it rains, we will stay at home.',
        englishRounds: [
          {
            kind: 'match',
            instruction: "Akademik atamalarni juftlang:",
            pairs: [
              { uz: 'Tadqiqot', en: 'Research' },
              { uz: 'Yechim', en: 'Solution' },
              { uz: 'Yutuq', en: 'Achievement' },
              { uz: 'Bilim', en: 'Knowledge' },
            ],
          },
          {
            kind: 'fill',
            instruction: "Shart gapni (Conditional) to'ldiring:",
            sentence: 'If she ___ earlier, she would catch the train.',
            translation: 'Agar u ertaroq chiqqanida, poyezdga ulgurar edi.',
            options: ['left', 'leaves', 'will leave', 'leaving'],
            correctAnswer: 'left',
          },
          {
            kind: 'match',
            instruction: "Sifatlar va ularning ma'nosini juftlang:",
            pairs: [
              { uz: 'Ishonchli', en: 'Reliable' },
              { uz: 'Samarali', en: 'Efficient' },
              { uz: 'Aniq', en: 'Accurate' },
              { uz: 'Ijodkor', en: 'Creative' },
            ],
          },
          {
            kind: 'fill',
            instruction: "Present Perfect zamonini tanlang:",
            sentence: 'They ___ already finished the robotics project.',
            translation: 'Ular robototexnika loyihasini allaqachon tugatishgan.',
            options: ['have', 'has', 'did', 'were'],
            correctAnswer: 'have',
          },
        ],
      },
    ],
  },

  cs: {
    elementary: [
      {
        subject: 'cs',
        tier: 'elementary',
        topicTitle: 'Algoritm — Qadamlar Ketma-ketligi',
        ruleTitle: 'Algoritm nima?',
        explanation:
          "Algoritm — biror vazifani bajarish uchun aniq tartibda berilgan buyruqlar ro'yxati. Kompyuter buyruqlarni ketma-ket bajaradi.",
        formulaOrRule: 'Boshlash → 1-qadam → 2-qadam → Tugatish',
        exampleProblem: 'Choy damlash algoritmi tartibi?',
        exampleSolution: 'Suv qaynatish → Choynakka choy solish → Qaynoq suv quyish → Damlash',
        csRounds: [
          {
            kind: 'order',
            prompt: "Robotni eshikdan chiqarish uchun buyruqlarni to'g'ri tartibda bosing:",
            correctSteps: ['Boshlash', 'Eshik oldiga borish', 'Eshikni ochish', 'Tashqariga chiqish'],
            explanation: 'Avval eshik oldiga borib, uni ochgachgina tashqariga chiqish mumkin.',
          },
          {
            kind: 'choice',
            prompt: "Qaysi qurilma kompyuterga matn kiritish uchun ishlatiladi?",
            options: ['Klaviatura', 'Monitor', 'Karnay (Kolonka)', 'Printer'],
            correctAnswer: 'Klaviatura',
            explanation: 'Klaviatura — asosiy kiritish (input) qurilmasi.',
          },
          {
            kind: 'order',
            prompt: "Maktabga tayyorlanish algoritmini to'g'ri tartibda tering:",
            correctSteps: ['Uyg‘onish', 'Yuz-qo‘lni yuvish', 'Kitoblarni sumkaga solish', 'Maktabga chiqish'],
            explanation: 'Har bir hayotiy ish ham aniq algoritm asosida bajariladi!',
          },
          {
            kind: 'choice',
            prompt: "Mantiqiy ketma-ketlikni davom ettiring: 2, 4, 6, 8, ...",
            codeSnippet: '2 → 4 → 6 → 8 → ?',
            options: ['10', '9', '12', '11'],
            correctAnswer: '10',
            explanation: 'Har bir keyingi son oldingisidan 2 taga katta (+2).',
          },
        ],
      },
      ...CS_GRADE_1_LESSONS,
    ],
    middle: [
      {
        subject: 'cs',
        tier: 'middle',
        topicTitle: 'Ikkilik Sanoq Sistemasi va Sikllar',
        ruleTitle: '0 va 1 — Kompyuter tili',
        explanation:
          "Kompyuter barcha ma'lumotlarni faqat 0 va 1 raqamlari (bitlar) yordamida saqlaydi. O'ngdan chapga har bir xona 1, 2, 4, 8 qiymatga ega.",
        formulaOrRule: '101₂ = 1×4 + 0×2 + 1×1 = 5₁₀',
        exampleProblem: '110₂ ikkilik soni o‘nlikda nechaga teng?',
        exampleSolution: '1×4 + 1×2 + 0×1 = 6',
        csRounds: [
          {
            kind: 'choice',
            prompt: "1010₂ ikkilik soni o'nlik sanoq sistemasida nechaga teng?",
            codeSnippet: '8  4  2  1\n1  0  1  0',
            options: ['10', '12', '8', '6'],
            correctAnswer: '10',
            explanation: '8 + 0 + 2 + 0 = 10.',
          },
          {
            kind: 'order',
            prompt: "Ikki sonning yig'indisini chiqaruvchi dastur bloklarini tartiblang:",
            correctSteps: ['a va b ni kiritish', 's = a + b ni hisoblash', 'Natija s ni ekranga chiqarish', 'Dasturni yakunlash'],
            explanation: 'Kiritish → Qayta ishlash → Chiqarish (IPO modeli).',
          },
          {
            kind: 'choice',
            prompt: "Quyidagi sikl necha marta 'Salom' so'zini chiqaradi?",
            codeSnippet: 'for i in range(4):\n    print("Salom")',
            options: ['4 marta', '3 marta', '5 marta', '1 marta'],
            correctAnswer: '4 marta',
            explanation: 'range(4) qiymatlari: 0, 1, 2, 3 — jami 4 marta takrorlanadi.',
          },
          {
            kind: 'order',
            prompt: "Shart tekshirish (if) algoritmini mantiqiy tartibda tering:",
            correctSteps: ['Ballni o‘qish', 'Agar ball >= 60 bo‘lsa', '"O‘tdi" deb chiqarish', 'Aks holda "Qayta urining"'],
            explanation: 'Avval qiymat olinadi, so‘ng shart tekshirilib tarmoq tanlanadi.',
          },
        ],
      },
    ],
    high: [
      {
        subject: 'cs',
        tier: 'high',
        topicTitle: 'Mantiqiy Darvozalar va Saralash Algoritmlari',
        ruleTitle: 'Boolean Mantiq & Murakkablik',
        explanation:
          "AND (VA) amali faqat ikkala qiymat True bo'lganda True qaytaradi. OR (YOKI) esa kamida bittasi True bo'lsa yetarli. Binary Search saralangan massivda O(log n) tezlikda qidiradi.",
        formulaOrRule: '(True AND False) = False  |  (True OR False) = True',
        exampleProblem: 'NOT(False) AND (True OR False) = ?',
        exampleSolution: 'True AND True = True',
        csRounds: [
          {
            kind: 'choice',
            prompt: "Quyidagi mantiqiy ifoda natijasi nima?",
            codeSnippet: '(True and False) or (not False)',
            options: ['True', 'False', 'None', 'Error'],
            correctAnswer: 'True',
            explanation: 'False or True = True.',
          },
          {
            kind: 'order',
            prompt: "Binary Search (Ikkilik qidiruv) bosqichlarini to'g'ri tartibda tering:",
            correctSteps: [
              'Massiv saralanganini tekshirish',
              'O‘rta element (mid) ni topish',
              'Qiymatni mid bilan taqqoslash',
              'Keraksiz yarmini tashlab davom etish',
            ],
            explanation: 'Har qadamda qidiruv sohasi 2 barobar qisqaradi — O(log n).',
          },
          {
            kind: 'choice',
            prompt: "1111₂ ikkilik soni o'nlikda nechaga teng?",
            codeSnippet: '8 + 4 + 2 + 1 = ?',
            options: ['15', '16', '14', '13'],
            correctAnswer: '15',
            explanation: '2⁴ − 1 = 15.',
          },
          {
            kind: 'choice',
            prompt: "Saralangan 1024 ta element ichidan Binary Search maksimal nechta qadamda topadi?",
            codeSnippet: 'log₂(1024) = ?',
            options: ['10 ta', '512 ta', '100 ta', '20 ta'],
            correctAnswer: '10 ta',
            explanation: '2¹⁰ = 1024, demak ko‘pi bilan 10 ta taqqoslash yetarli!',
          },
        ],
      },
    ],
  },

  science: {
    elementary: [
      {
        subject: 'science',
        tier: 'elementary',
        topicTitle: "Tabiat, Quyosh va O'simliklar",
        ruleTitle: "O'simliklar qanday oziqlanadi?",
        explanation:
          "O'simliklar quyosh nuri, suv va havo yordamida o'ziga ozuqa tayyorlaydi va biz nafas oladigan kislorodni chiqaradi.",
        formulaOrRule: 'Quyosh nuri + Suv + Havo → Kislorod (O₂)',
        exampleProblem: "Yer sayyorasi qaysi yulduz atrofida aylanadi?",
        exampleSolution: 'Quyosh atrofida aylanadi!',
        scienceRounds: [
          {
            kind: 'true_false',
            icon: 'sun',
            statement: "Quyosh — Yer sayyorasiga eng yaqin yulduzdir.",
            options: ["To'g'ri", "Noto'g'ri"],
            correctAnswer: "To'g'ri",
            fact: "Quyosh ulkan yulduz bo'lib, Yerga issiqlik va yorug'lik beradi.",
          },
          {
            kind: 'quiz',
            icon: 'droplet',
            statement: "Suv qattiq holatga o'tganda nima deb ataladi?",
            options: ['Muz', 'Bug‘', 'Bulut', 'Shudring'],
            correctAnswer: 'Muz',
            fact: '0°C haroratda suyuq suv muzlab qattiq holatga o‘tadi.',
          },
          {
            kind: 'true_false',
            icon: 'leaf',
            statement: "O'simliklar yorug'likda havoga kislorod chiqaradi.",
            options: ["To'g'ri", "Noto'g'ri"],
            correctAnswer: "To'g'ri",
            fact: 'Fotosintez jarayonida yashil barglar kislorod ishlab chiqaradi.',
          },
          {
            kind: 'quiz',
            icon: 'globe',
            statement: "Yer o'z o'qi atrofida bir marta to'liq aylanishi qancha vaqt oladi?",
            options: ['24 soat (1 sutka)', '7 kun', '30 kun', '365 kun'],
            correctAnswer: '24 soat (1 sutka)',
            fact: 'Yerning o‘z o‘qi atrofida aylanishi kun va tun almashishiga sabab bo‘ladi.',
          },
        ],
      },
      ...SCIENCE_GRADE_1_LESSONS,
    ],
    middle: [
      {
        subject: 'science',
        tier: 'middle',
        topicTitle: 'Fizika, Kimyo va Biologiya Asoslari',
        ruleTitle: 'Moddalar va Energiya',
        explanation:
          "Suv molekulasi 2 ta vodorod va 1 ta kislorod atomidan (H₂O) tashkil topgan. Ovoz vakuumda tarqalmaydi, lekin yorug'lik tarqaladi.",
        formulaOrRule: 'Suv = H₂O  |  Tezlik: v = s / t',
        exampleProblem: 'Odam yuragi qanday vazifani bajaradi?',
        exampleSolution: 'Qonni butun organizm bo‘ylab haydab turadi.',
        scienceRounds: [
          {
            kind: 'quiz',
            icon: 'droplet',
            statement: 'Suvning kimyoviy formulasi qaysi?',
            options: ['H₂O', 'CO₂', 'O₂', 'NaCl'],
            correctAnswer: 'H₂O',
            fact: 'Har bir suv molekulasi 2 ta vodorod (H) va 1 ta kislorod (O) atomidan iborat.',
          },
          {
            kind: 'true_false',
            icon: 'zap',
            statement: "Yorug'lik tezligi tovush tezligidan ancha katta.",
            options: ["To'g'ri", "Noto'g'ri"],
            correctAnswer: "To'g'ri",
            fact: 'Shuning uchun chaqmoqni avval ko‘ramiz, momaqaldiroq ovozini esa keyinroq eshitamiz!',
          },
          {
            kind: 'quiz',
            icon: 'globe',
            statement: 'Quyosh tizimidagi eng katta sayyora qaysi?',
            options: ['Yupiter', 'Mars', 'Saturn', 'Yer'],
            correctAnswer: 'Yupiter',
            fact: 'Yupiter gaz giganti bo‘lib, uning ichiga 1300 dan ortiq Yer sig‘ishi mumkin.',
          },
          {
            kind: 'true_false',
            icon: 'heart',
            statement: "Odam tanasidagi eng katta a'zo — bu teri.",
            options: ["To'g'ri", "Noto'g'ri"],
            correctAnswer: "To'g'ri",
            fact: 'Teri organizmni tashqi ta’sirlardan himoya qiladi va haroratni me’yorida ushlaydi.',
          },
        ],
      },
    ],
    high: [
      {
        subject: 'science',
        tier: 'high',
        topicTitle: 'Nyuton Qonunlari, Atom va Genetika',
        ruleTitle: 'Kuch, DNK va Elementlar',
        explanation:
          "Nyutonning 2-qonuniga ko'ra kuch massa va tezlanish ko'paytmasiga teng (F = m·a). Tirik organizmlarning irsiy axboroti DNK molekulasida saqlanadi.",
        formulaOrRule: 'F = m · a  |  Oltin = Au  |  Temir = Fe',
        exampleProblem: 'Massasi 4 kg jismga 3 m/s² tezlanish berish uchun qancha kuch kerak?',
        exampleSolution: 'F = 4 × 3 = 12 N (Nyuton)',
        scienceRounds: [
          {
            kind: 'quiz',
            icon: 'atom',
            statement: 'Mendeleyev jadvalida Oltin (Gold) elementining kimyoviy belgisi nima?',
            options: ['Au', 'Ag', 'Fe', 'Cu'],
            correctAnswer: 'Au',
            fact: 'Au lotincha "Aurum" (oltin) so‘zidan olingan. Ag esa kumush (Argentum).',
          },
          {
            kind: 'true_false',
            icon: 'zap',
            statement: "Elektr tokining Xalqaro birliklar tizimidagi (SI) o'lchov birligi — Amper (A).",
            options: ["To'g'ri", "Noto'g'ri"],
            correctAnswer: "To'g'ri",
            fact: 'Tok kuchi Amperda (A), kuchlanish esa Voltda (V) o‘lchanadi.',
          },
          {
            kind: 'quiz',
            icon: 'leaf',
            statement: "Hujayraning 'energiya stansiyasi' deb ataladigan organoid qaysi?",
            options: ['Mitoxondriya', 'Ribosoma', 'Vakuola', 'Yadro'],
            correctAnswer: 'Mitoxondriya',
            fact: 'Mitoxondriya hujayra uchun zarur bo‘lgan ATF energiya molekulalarini sintezlaydi.',
          },
          {
            kind: 'true_false',
            icon: 'flame',
            statement: "Atmosfera havosining eng katta qismini (taxminan 78%) kislorod tashkil qiladi.",
            options: ["To'g'ri", "Noto'g'ri"],
            correctAnswer: "Noto'g'ri",
            fact: 'Havoning 78% ini azot (N₂), taxminan 21% ini esa kislorod (O₂) tashkil qiladi!',
          },
        ],
      },
    ],
  },
};

const GRADE_SPECIFIC_LESSONS: Partial<Record<SubjectId, LessonPlan[]>> = {
  math: [...MATH_GRADE_1_LESSONS],
};

export function getLessonForPlayer(
  subject: SubjectId,
  playerGrade: number,
  completionCount: number
): LessonPlan {
  // 1. Collect all exact grade-specific lessons for this subject (from LESSONS tiers + GRADE_SPECIFIC_LESSONS)
  const subjectTiers = LESSONS[subject];
  const allSubjectLessons: LessonPlan[] = [
    ...(GRADE_SPECIFIC_LESSONS[subject] || []),
    ...subjectTiers.elementary,
    ...subjectTiers.middle,
    ...subjectTiers.high,
  ];
  const gradePool = allSubjectLessons.filter((lesson) => lesson.grade === playerGrade);
  if (gradePool.length > 0) {
    const index = completionCount % gradePool.length;
    return gradePool[index];
  }

  // 2. Fallback to difficulty tier (elementary / middle / high) for grades without grade-specific lessons
  const tier = getDifficultyTier(playerGrade);
  const tierList = subjectTiers[tier];
  const generalTierList = tierList.filter((lesson) => lesson.grade === undefined);
  const pool =
    generalTierList.length > 0
      ? generalTierList
      : tierList.length > 0
      ? tierList
      : subjectTiers.elementary;
  const index = completionCount % pool.length;
  return pool[index];
}

export function getAllLessonsBySubject(subject: SubjectId): LessonPlan[] {
  const subjectTiers = LESSONS[subject];
  const combined: LessonPlan[] = [
    ...(GRADE_SPECIFIC_LESSONS[subject] || []),
    ...subjectTiers.elementary,
    ...subjectTiers.middle,
    ...subjectTiers.high,
  ];

  // Sort: exact grade-specific lessons (e.g., grade 1) first in curriculum order,
  // then general elementary (2-4), middle (5-8), high (9-11)
  const tierWeight: Record<DifficultyTier, number> = {
    elementary: 1,
    middle: 2,
    high: 3,
  };

  return combined.sort((a, b) => {
    const aHasGrade = a.grade !== undefined;
    const bHasGrade = b.grade !== undefined;
    if (aHasGrade && !bHasGrade) return -1;
    if (!aHasGrade && bHasGrade) return 1;
    if (aHasGrade && bHasGrade && a.grade !== b.grade) {
      return (a.grade || 0) - (b.grade || 0);
    }
    return tierWeight[a.tier] - tierWeight[b.tier];
  });
}

