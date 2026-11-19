import type { LessonPlan } from './curriculum';

export const ALIFBE_GRADE_1_LESSONS: LessonPlan[] = [
  // 1-dars
  {
    subject: 'alifbe',
    tier: 'elementary',
    grade: 1,
    topicTitle: '1-dars: Unli harflar — A, O, I',
    ruleTitle: 'Qizil harflar — Unli tovushlar (kuylab aytiladi!)',
    explanation:
      "A, O, I — bu unli harflar! Ularni baland va cho'zib kuylab aytish mumkin: A-a-a (Ari), O-o-o (Olma), I-i-i (It). Unli harflar doim QIZIL rangda yoziladi.",
    formulaOrRule: 'A (🐝 Ari) · O (🍎 Olma) · I (🐕 It)',
    exampleProblem: '🍎 Olma so‘zi qaysi qizil harfdan boshlanadi?',
    exampleSolution: 'O harfidan boshlanadi!',
    alifbeCards: [
      { letter: 'A', emoji: '🐝', word: 'Ari' },
      { letter: 'O', emoji: '🍎', word: 'Olma' },
      { letter: 'I', emoji: '🐕', word: 'It' },
    ],
    alifbeRounds: [
      {
        kind: 'first_letter',
        emoji: '🍎',
        word: 'Olma',
        spokenPrompt: 'Olma so‘zi qaysi harfdan boshlanadi?',
        options: ['O', 'A', 'I', 'U'],
        correctAnswer: 'O',
      },
      {
        kind: 'first_letter',
        emoji: '🐝',
        word: 'Ari',
        spokenPrompt: 'Ari so‘zi qaysi harfdan boshlanadi?',
        options: ['A', 'O', 'I', 'E'],
        correctAnswer: 'A',
      },
      {
        kind: 'letter_match',
        spokenPrompt: 'Harflarni ularga mos rasmlar bilan juftlang!',
        pairs: [
          { letter: 'A', emoji: '🐝', word: 'Ari' },
          { letter: 'O', emoji: '🍎', word: 'Olma' },
          { letter: 'I', emoji: '🐕', word: 'It' },
        ],
      },
      {
        kind: 'build_word',
        emoji: '👨‍👩‍👧‍👦',
        word: 'OILA',
        spokenPrompt: 'Oila so‘zini harflardan yig‘ing!',
        parts: ['O', 'I', 'LA'],
      },
    ],
  },

  // 2-dars
  {
    subject: 'alifbe',
    tier: 'elementary',
    grade: 1,
    topicTitle: "2-dars: Unli harflar — U, E, O'",
    ruleTitle: "Yana 3 ta qizil unli harf: U, E, O'",
    explanation:
      "Bugun qolgan unli harflarni o'rganamiz: U (Uzum), E (Eshik), O' (O'rdak). O'zbek alifbosida jami 6 ta unli harf bor: A, O, I, U, E, O'!",
    formulaOrRule: "U (🍇 Uzum) · E (🚪 Eshik) · O' (🦆 O'rdak)",
    exampleProblem: '🍇 Uzum so‘zi qaysi harfdan boshlanadi?',
    exampleSolution: 'U harfidan boshlanadi!',
    alifbeCards: [
      { letter: 'U', emoji: '🍇', word: 'Uzum' },
      { letter: 'E', emoji: '🚪', word: 'Eshik' },
      { letter: "O'", emoji: '🦆', word: "O'rdak" },
    ],
    alifbeRounds: [
      {
        kind: 'first_letter',
        emoji: '🍇',
        word: 'Uzum',
        spokenPrompt: 'Uzum so‘zi qaysi harfdan boshlanadi?',
        options: ['U', 'E', 'A', 'I'],
        correctAnswer: 'U',
      },
      {
        kind: 'first_letter',
        emoji: '🦆',
        word: "O'rdak",
        spokenPrompt: "O'rdak so‘zi qaysi harfdan boshlanadi?",
        options: ["O'", 'U', 'E', 'A'],
        correctAnswer: "O'",
      },
      {
        kind: 'letter_match',
        spokenPrompt: 'Unli harflarni mos rasmlarga juftlang!',
        pairs: [
          { letter: 'U', emoji: '🍇', word: 'Uzum' },
          { letter: 'E', emoji: '🚪', word: 'Eshik' },
          { letter: "O'", emoji: '🦆', word: "O'rdak" },
        ],
      },
      {
        kind: 'first_letter',
        emoji: '🚪',
        word: 'Eshik',
        spokenPrompt: 'Eshik so‘zi qaysi harfdan boshlanadi?',
        options: ['E', 'U', 'O', "O'"],
        correctAnswer: 'E',
      },
    ],
  },

  // 3-dars
  {
    subject: 'alifbe',
    tier: 'elementary',
    grade: 1,
    topicTitle: '3-dars: Ilk undoshlar — N, M, L',
    ruleTitle: "Ko'k harflar — Undosh tovushlar: N, M, L",
    explanation:
      "Endi ko'k rangli undosh harflar bilan tanishamiz: N (Nok), M (Mushuk), L (Lola). Unli va undosh harflar qo'shilib ilk so'zlarni hosil qiladi: O-NA, LO-LA!",
    formulaOrRule: 'N (🍐 Nok) · M (🐱 Mushuk) · L (🌷 Lola)',
    exampleProblem: '👩 O + NA birlashsa qaysi so‘z chiqadi?',
    exampleSolution: 'ONA so‘zi chiqadi!',
    alifbeCards: [
      { letter: 'N', emoji: '🍐', word: 'Nok' },
      { letter: 'M', emoji: '🐱', word: 'Mushuk' },
      { letter: 'L', emoji: '🌷', word: 'Lola' },
    ],
    alifbeRounds: [
      {
        kind: 'first_letter',
        emoji: '🐱',
        word: 'Mushuk',
        spokenPrompt: 'Mushuk so‘zi qaysi harfdan boshlanadi?',
        options: ['M', 'N', 'L', 'A'],
        correctAnswer: 'M',
      },
      {
        kind: 'first_letter',
        emoji: '🍐',
        word: 'Nok',
        spokenPrompt: 'Nok so‘zi qaysi harfdan boshlanadi?',
        options: ['N', 'M', 'L', 'O'],
        correctAnswer: 'N',
      },
      {
        kind: 'build_word',
        emoji: '👩',
        word: 'ONA',
        spokenPrompt: 'Ona so‘zini yig‘ing!',
        parts: ['O', 'NA'],
      },
      {
        kind: 'build_word',
        emoji: '🌷',
        word: 'LOLA',
        spokenPrompt: 'Lola so‘zini bo‘g‘inlardan yig‘ing!',
        parts: ['LO', 'LA'],
      },
    ],
  },

  // 4-dars
  {
    subject: 'alifbe',
    tier: 'elementary',
    grade: 1,
    topicTitle: '4-dars: Undoshlar — T, B, S',
    ruleTitle: 'Yangi undosh harflar: T, B, S',
    explanation:
      "Bugungi ko'k rangli undosh harflarimiz: T (Toshbaqa), B (Baliq), S (Sabzi). Ularni unli harflarga qo'shib BO-BO kabi chiroyli so'zlarni yig'amiz!",
    formulaOrRule: 'T (🐢 Toshbaqa) · B (🐟 Baliq) · S (🥕 Sabzi)',
    exampleProblem: '🐟 Baliq so‘zi qaysi harfdan boshlanadi?',
    exampleSolution: 'B harfidan boshlanadi!',
    alifbeCards: [
      { letter: 'T', emoji: '🐢', word: 'Toshbaqa' },
      { letter: 'B', emoji: '🐟', word: 'Baliq' },
      { letter: 'S', emoji: '🥕', word: 'Sabzi' },
    ],
    alifbeRounds: [
      {
        kind: 'first_letter',
        emoji: '🐟',
        word: 'Baliq',
        spokenPrompt: 'Baliq so‘zi qaysi harfdan boshlanadi?',
        options: ['B', 'T', 'S', 'M'],
        correctAnswer: 'B',
      },
      {
        kind: 'first_letter',
        emoji: '🐢',
        word: 'Toshbaqa',
        spokenPrompt: 'Toshbaqa so‘zi qaysi harfdan boshlanadi?',
        options: ['T', 'B', 'S', 'L'],
        correctAnswer: 'T',
      },
      {
        kind: 'letter_match',
        spokenPrompt: 'Harflarni mos rasmlar bilan juftlang!',
        pairs: [
          { letter: 'T', emoji: '🐢', word: 'Toshbaqa' },
          { letter: 'B', emoji: '🐟', word: 'Baliq' },
          { letter: 'S', emoji: '🥕', word: 'Sabzi' },
        ],
      },
      {
        kind: 'build_word',
        emoji: '👴',
        word: 'BOBO',
        spokenPrompt: 'Bobo so‘zini bo‘g‘inlardan yig‘ing!',
        parts: ['BO', 'BO'],
      },
    ],
  },

  // 5-dars
  {
    subject: 'alifbe',
    tier: 'elementary',
    grade: 1,
    topicTitle: '5-dars: Undoshlar — K, Q, R, D',
    ruleTitle: '4 ta kuchli undosh harf: K, Q, R, D',
    explanation:
      "K (Kapalak), Q (Quyosh), R (Raketa) va D (Daraxt) — ko'k rangli undosh harflar! D va A harflaridan eng aziz so'zlardan biri — DA-DA so'zi yasaladi!",
    formulaOrRule: 'K (🦋 Kapalak) · Q (☀️ Quyosh) · R (🚀 Raketa) · D (🌳 Daraxt)',
    exampleProblem: '☀️ Quyosh so‘zi qaysi harfdan boshlanadi?',
    exampleSolution: 'Q harfidan boshlanadi!',
    alifbeCards: [
      { letter: 'K', emoji: '🦋', word: 'Kapalak' },
      { letter: 'Q', emoji: '☀️', word: 'Quyosh' },
      { letter: 'R', emoji: '🚀', word: 'Raketa' },
      { letter: 'D', emoji: '🌳', word: 'Daraxt' },
    ],
    alifbeRounds: [
      {
        kind: 'first_letter',
        emoji: '☀️',
        word: 'Quyosh',
        spokenPrompt: 'Quyosh so‘zi qaysi harfdan boshlanadi?',
        options: ['Q', 'K', 'R', 'D'],
        correctAnswer: 'Q',
      },
      {
        kind: 'first_letter',
        emoji: '🌳',
        word: 'Daraxt',
        spokenPrompt: 'Daraxt so‘zi qaysi harfdan boshlanadi?',
        options: ['D', 'K', 'Q', 'R'],
        correctAnswer: 'D',
      },
      {
        kind: 'letter_match',
        spokenPrompt: 'To‘rtta harfni o‘z rasmi bilan juftlang!',
        pairs: [
          { letter: 'K', emoji: '🦋', word: 'Kapalak' },
          { letter: 'Q', emoji: '☀️', word: 'Quyosh' },
          { letter: 'R', emoji: '🚀', word: 'Raketa' },
          { letter: 'D', emoji: '🌳', word: 'Daraxt' },
        ],
      },
      {
        kind: 'build_word',
        emoji: '👨',
        word: 'DADA',
        spokenPrompt: 'Dada so‘zini bo‘g‘inlardan yig‘ing!',
        parts: ['DA', 'DA'],
      },
    ],
  },

  // 6-dars
  {
    subject: 'alifbe',
    tier: 'elementary',
    grade: 1,
    topicTitle: '6-dars: Undoshlar — P, Y, G, V',
    ruleTitle: 'Yana 4 ta undosh harf: P, Y, G, V',
    explanation:
      "P (Pomidor), Y (Yulduz), G (Gul) va V (Velosiped) harflarini o'rganamiz. G + U + L harflarini ketma-ket qo'ysak, GUL so'zi hosil bo'ladi!",
    formulaOrRule: 'P (🍅 Pomidor) · Y (⭐ Yulduz) · G (🌸 Gul) · V (🚲 Velosiped)',
    exampleProblem: '🌸 G + U + L qo‘shilsa qaysi so‘z chiqadi?',
    exampleSolution: 'GUL so‘zi chiqadi!',
    alifbeCards: [
      { letter: 'P', emoji: '🍅', word: 'Pomidor' },
      { letter: 'Y', emoji: '⭐', word: 'Yulduz' },
      { letter: 'G', emoji: '🌸', word: 'Gul' },
      { letter: 'V', emoji: '🚲', word: 'Velosiped' },
    ],
    alifbeRounds: [
      {
        kind: 'first_letter',
        emoji: '⭐',
        word: 'Yulduz',
        spokenPrompt: 'Yulduz so‘zi qaysi harfdan boshlanadi?',
        options: ['Y', 'P', 'G', 'V'],
        correctAnswer: 'Y',
      },
      {
        kind: 'first_letter',
        emoji: '🌸',
        word: 'Gul',
        spokenPrompt: 'Gul so‘zi qaysi harfdan boshlanadi?',
        options: ['G', 'P', 'Y', 'V'],
        correctAnswer: 'G',
      },
      {
        kind: 'letter_match',
        spokenPrompt: 'Harflarni mos rasmlari bilan juftlang!',
        pairs: [
          { letter: 'P', emoji: '🍅', word: 'Pomidor' },
          { letter: 'Y', emoji: '⭐', word: 'Yulduz' },
          { letter: 'G', emoji: '🌸', word: 'Gul' },
          { letter: 'V', emoji: '🚲', word: 'Velosiped' },
        ],
      },
      {
        kind: 'build_word',
        emoji: '🌸',
        word: 'GUL',
        spokenPrompt: 'Gul so‘zini harflardan yig‘ing!',
        parts: ['G', 'U', 'L'],
      },
    ],
  },

  // 7-dars
  {
    subject: 'alifbe',
    tier: 'elementary',
    grade: 1,
    topicTitle: '7-dars: Murakkabroq harflar — SH, CH, NG',
    ruleTitle: 'Ikki harf birlashib bitta tovush beradi!',
    explanation:
      "O'zbek alifbosida 3 ta harf birikmasi bor: SH (Sher), CH (Chumoli) va NG (Qo'ng'iroq). Ular ikki harfdan iborat bo'lsa ham, birga bitta tovush bo'lib o'qiladi!",
    formulaOrRule: "SH (🦁 Sher) · CH (🐜 Chumoli) · NG (🔔 Qo'ng'iroq)",
    exampleProblem: '🦁 Sher so‘zi qaysi harf birikmasidan boshlanadi?',
    exampleSolution: 'SH harfidan boshlanadi!',
    alifbeCards: [
      { letter: 'SH', emoji: '🦁', word: 'Sher' },
      { letter: 'CH', emoji: '🐜', word: 'Chumoli' },
      { letter: 'NG', emoji: '🔔', word: "Qo'ng'iroq" },
    ],
    alifbeRounds: [
      {
        kind: 'first_letter',
        emoji: '🦁',
        word: 'Sher',
        spokenPrompt: 'Sher so‘zi qaysi harfdan boshlanadi?',
        options: ['SH', 'CH', 'S', 'M'],
        correctAnswer: 'SH',
      },
      {
        kind: 'first_letter',
        emoji: '🐜',
        word: 'Chumoli',
        spokenPrompt: 'Chumoli so‘zi qaysi harfdan boshlanadi?',
        options: ['CH', 'SH', 'K', 'T'],
        correctAnswer: 'CH',
      },
      {
        kind: 'letter_match',
        spokenPrompt: 'Harf birikmalarini mos rasmlar bilan juftlang!',
        pairs: [
          { letter: 'SH', emoji: '🦁', word: 'Sher' },
          { letter: 'CH', emoji: '🐜', word: 'Chumoli' },
          { letter: "O'", emoji: '🦆', word: "O'rdak" },
        ],
      },
      {
        kind: 'build_word',
        emoji: '🦁',
        word: 'SHER',
        spokenPrompt: 'Sher so‘zini harflardan yig‘ing!',
        parts: ['SH', 'E', 'R'],
      },
    ],
  },

  // 8-dars
  {
    subject: 'alifbe',
    tier: 'elementary',
    grade: 1,
    topicTitle: "8-dars: So'z o'qiymiz! (Yakuniy Alifbe bayrami)",
    ruleTitle: 'Tabriklaymiz! Endi mustaqil so‘z o‘qiymiz!',
    explanation:
      "Barakalla! Sen barcha asosiy unli va undosh harflarni o'rganding. Endi bo'g'inlarni birlashtirib OL-MA, BA-LIQ, KI-TOB va MAK-TAB so'zlarini o'zing yig'ib o'qiysan!",
    formulaOrRule: 'OL + MA = OLMA 🍎  |  MAK + TAB = MAKTAB 🏫',
    exampleProblem: '📖 KI + TOB birlashsa qaysi so‘z hosil bo‘ladi?',
    exampleSolution: 'KITOB so‘zi hosil bo‘ladi!',
    alifbeCards: [
      { letter: 'OL', emoji: '🍎', word: 'OLMA' },
      { letter: 'BA', emoji: '🐟', word: 'BALIQ' },
      { letter: 'KI', emoji: '📖', word: 'KITOB' },
      { letter: 'MAK', emoji: '🏫', word: 'MAKTAB' },
    ],
    alifbeRounds: [
      {
        kind: 'build_word',
        emoji: '🍎',
        word: 'OLMA',
        spokenPrompt: 'Olma so‘zini bo‘g‘inlardan yig‘ing!',
        parts: ['OL', 'MA'],
      },
      {
        kind: 'build_word',
        emoji: '🐟',
        word: 'BALIQ',
        spokenPrompt: 'Baliq so‘zini bo‘g‘inlardan yig‘ing!',
        parts: ['BA', 'LIQ'],
      },
      {
        kind: 'build_word',
        emoji: '📖',
        word: 'KITOB',
        spokenPrompt: 'Kitob so‘zini bo‘g‘inlardan yig‘ing!',
        parts: ['KI', 'TOB'],
      },
      {
        kind: 'build_word',
        emoji: '🏫',
        word: 'MAKTAB',
        spokenPrompt: 'Maktab so‘zini bo‘g‘inlardan yig‘ing!',
        parts: ['MAK', 'TAB'],
      },
    ],
  },
];
