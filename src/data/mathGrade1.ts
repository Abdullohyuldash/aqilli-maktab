import type { LessonPlan } from './curriculum';

const ROOM_ZONES_DEFAULT = [
  { id: 'sky', label: 'Osmon', x: 34, y: 22, w: 120, h: 72 },
  { id: 'top_shelf', label: 'Javon tepasi', x: 322, y: 18, w: 144, h: 58 },
  { id: 'under_desk', label: 'Stol tagi', x: 184, y: 150, w: 132, h: 66 },
];

const ROOM_ZONES_LEFTRIGHT = [
  { id: 'left_side', label: 'Chap tomon', x: 26, y: 112, w: 124, h: 68 },
  { id: 'on_desk', label: 'Stol usti', x: 184, y: 74, w: 132, h: 56 },
  { id: 'right_side', label: "O'ng tomon", x: 350, y: 112, w: 124, h: 68 },
];

export const MATH_GRADE_1_LESSONS: LessonPlan[] = [
  // =========================================================================
  // 1-DARS: "TARTIBLI XONA" (Sehrli Javon) — room_sort
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'room_sort',
    topicTitle: '1-dars: Predmetlar, joylashuv va vaqt',
    ruleTitle: 'Tartibli xonada hamma narsaning o‘z joyi bor!',
    explanation:
      'Quyosh osmonning tepasida porlaydi, koptok esa stol tagida dumalab yotadi! Chap va o‘ng, tepa va pastni bilsang, xonang hamisha chiroyli va tartibli bo‘ladi.',
    formulaOrRule: '⬆️ Tepada  |  ⬇️ Pastda  |  ⬅️ Chapda  |  ➡️ O‘ngda',
    exampleProblem: '⚽ Koptokni qayerda saqlaymiz: osmondami yoki stol tagidami?',
    exampleSolution: 'Stol tagida! Osmon esa quyosh va bulutlarning joyi.',
    mathRounds: [
      {
        kind: 'room_sort',
        prompt: '⚽ Koptokni stol tagiga qo‘y!',
        options: ['Osmon', 'Javon tepasi', 'Stol tagi'],
        correctAnswer: 'Stol tagi',
        hint: 'Stolning pastki qismiga qara — "Stol tagi" shu yerda!',
        timeLimitSec: 40,
        roomData: {
          itemEmoji: '⚽',
          itemLabel: 'Koptok',
          targetZoneId: 'under_desk',
          zones: ROOM_ZONES_DEFAULT,
        },
      },
      {
        kind: 'room_sort',
        prompt: '📚 Kitobni javon tepasiga qo‘y!',
        options: ['Osmon', 'Javon tepasi', 'Stol tagi'],
        correctAnswer: 'Javon tepasi',
        hint: "O'ng tomondagi yog'och javonning ustiga qara!",
        timeLimitSec: 40,
        roomData: {
          itemEmoji: '📚',
          itemLabel: 'Kitob',
          targetZoneId: 'top_shelf',
          zones: ROOM_ZONES_DEFAULT,
        },
      },
      {
        kind: 'room_sort',
        prompt: '☀️ Ertalabki quyoshni osmonga olib chiq!',
        options: ['Osmon', 'Javon tepasi', 'Stol tagi'],
        correctAnswer: 'Osmon',
        hint: 'Moviy derazadan ko‘rinib turgan osmonga olib chiq!',
        timeLimitSec: 40,
        roomData: {
          itemEmoji: '☀️',
          itemLabel: 'Quyosh',
          targetZoneId: 'sky',
          zones: ROOM_ZONES_DEFAULT,
        },
      },
      {
        kind: 'room_sort',
        prompt: '🧸 Ayiqchani o‘ng tomonga o‘tqazib qo‘y!',
        options: ['Chap tomon', 'Stol usti', "O'ng tomon"],
        correctAnswer: "O'ng tomon",
        hint: "O'ng qo'ling qaysi tomonda? Ayiqchani o'sha tomonga qo'y!",
        timeLimitSec: 40,
        roomData: {
          itemEmoji: '🧸',
          itemLabel: 'Ayiqcha',
          targetZoneId: 'right_side',
          zones: ROOM_ZONES_LEFTRIGHT,
        },
      },
    ],
  },

  // =========================================================================
  // 2-DARS: "OCHKO'Z TIMSOHCHA" (Sonlarni taqqoslash) — croc_compare
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'croc_compare',
    topicTitle: '2-dars: 0 dan 10 gacha sonlar, juft-toq va taqqoslash',
    ruleTitle: "Ochko'z Timsohcha doim ko'pini tanlaydi!",
    explanation:
      'Quvnoq timsohcha og‘zini har doim baliqchalar ko‘proq bo‘lgan tomonga katta ochadi! Agar ikki tomonda mevalar bir xil bo‘lsa, u jilmayib teng (=) deydi.',
    formulaOrRule: '🐟 4 < 7 (o‘ngda ko‘p)  |  🍓 8 > 3 (chapda ko‘p)  |  🍎 5 = 5 (teng)',
    exampleProblem: '🐟 Chapda 4 ta, o‘ngda 7 ta baliqcha bor. Timsohcha qayerga og‘iz ochadi?',
    exampleSolution: 'O‘ng tomonga (4 < 7)! Chunki 7 ta baliqcha 4 tadan ko‘p!',
    mathRounds: [
      {
        kind: 'croc_compare',
        prompt: "Timsohcha ko'proq baliqchani yemoqchi! 4 va 7 ni taqqosla!",
        options: ['<', '=', '>'],
        correctAnswer: '<',
        hint: "O'ng tomonda 7 ta baliqcha bor, bu 4 tadan ko'p — og'zi o'ngga ochiladi!",
        timeLimitSec: 36,
        crocData: { leftCount: 4, rightCount: 7, itemEmoji: '🐟', itemLabel: 'baliqcha' },
      },
      {
        kind: 'croc_compare',
        prompt: "Qaysi savatda qulupnay ko'proq? 8 va 3 ni taqqosla!",
        options: ['<', '=', '>'],
        correctAnswer: '>',
        hint: "Chap tomonda 8 ta qulupnay bor, o'ngda esa atigi 3 ta!",
        timeLimitSec: 36,
        crocData: { leftCount: 8, rightCount: 3, itemEmoji: '🍓', itemLabel: 'qulupnay' },
      },
      {
        kind: 'croc_compare',
        prompt: 'Ikkala tomondagi olmalarni sana! 5 va 5 qanday?',
        options: ['<', '=', '>'],
        correctAnswer: '=',
        hint: "Chapda ham 5 ta, o'ngda ham 5 ta — ikkalasi bir-biriga TENG!",
        timeLimitSec: 36,
        crocData: { leftCount: 5, rightCount: 5, itemEmoji: '🍎', itemLabel: 'olma' },
      },
      {
        kind: 'croc_compare',
        prompt: 'Juft 6 ta va toq 9 ta nokni solishtir! Qaysi tomon ko‘p?',
        options: ['<', '=', '>'],
        correctAnswer: '<',
        hint: "9 ta nok 6 tadan ko'proq! Timsohcha o'ng tomonga qaraydi!",
        timeLimitSec: 36,
        crocData: { leftCount: 6, rightCount: 9, itemEmoji: '🍐', itemLabel: 'nok' },
      },
    ],
  },

  // =========================================================================
  // 3-DARS: "SHAKLLAR KONSTRUKTORI" (Tangram) — tangram
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'tangram',
    topicTitle: '3-dars: Geometrik shakllar va chiziqlar',
    ruleTitle: 'Uy tomi, deraza va g‘ildirak shakllari!',
    explanation:
      'Uchburchak — 3 ta uchi bor uy tomi, kvadrat — to‘rtta tomoni teng chiroyli deraza! Doira esa g‘ildirak va quyoshdek yumaloq bo‘ladi.',
    formulaOrRule: '🔺 Uchburchak (3 uch)  |  🟦 Kvadrat (4 teng tomon)  |  🟡 Doira (yumaloq)',
    exampleProblem: '🚗 Quvnoq mashinamiz yurishi uchun qaysi shakldagi g‘ildirak kerak?',
    exampleSolution: 'Doira! Chunki burchaksiz yumaloq doira oson dumalaydi.',
    mathRounds: [
      {
        kind: 'tangram',
        prompt: '🏠 Chala qolgan uychamizning tomini qaysi shakl bilan yopamiz?',
        options: ['Uchburchak', 'Kvadrat', 'Doira', "To'rtburchak"],
        correctAnswer: 'Uchburchak',
        hint: 'Uyning tomi 3 ta uchli bo‘ladi — Uchburchakni tanla!',
        timeLimitSec: 36,
        tangramData: { scene: 'house_roof', targetShape: 'triangle', targetLabel: 'Uchburchak' },
      },
      {
        kind: 'tangram',
        prompt: '🪟 Uychaga yorug‘lik kirishi uchun deraza o‘rniga qaysi shaklni qo‘yamiz?',
        options: ['Uchburchak', 'Kvadrat', 'Doira', "To'rtburchak"],
        correctAnswer: 'Kvadrat',
        hint: 'Hamma to‘rt tomoni bir xil teng shakl — Kvadrat!',
        timeLimitSec: 36,
        tangramData: { scene: 'house_window', targetShape: 'square', targetLabel: 'Kvadrat' },
      },
      {
        kind: 'tangram',
        prompt: '🚗 Qizil mashinamiz yurishi uchun g‘ildirak o‘rniga qaysi shaklni o‘rnatamiz?',
        options: ['Uchburchak', 'Kvadrat', 'Doira', "To'rtburchak"],
        correctAnswer: 'Doira',
        hint: 'Dumalab ketadigan burchaksiz yumaloq shakl — Doira!',
        timeLimitSec: 36,
        tangramData: { scene: 'car_wheel', targetShape: 'circle', targetLabel: 'Doira' },
      },
      {
        kind: 'tangram',
        prompt: '⛵ Kemachamizning uzunchoq kayutasini qaysi shakl bilan quramiz?',
        options: ['Uchburchak', 'Kvadrat', 'Doira', "To'rtburchak"],
        correctAnswer: "To'rtburchak",
        hint: "Uzunchoq to'rt burchakli shakl — To'rtburchak!",
        timeLimitSec: 36,
        tangramData: { scene: 'boat_sail', targetShape: 'rectangle', targetLabel: "To'rtburchak" },
      },
    ],
  },

  // =========================================================================
  // 4-DARS: "BOG'BON — MEVA TERISH" (10 ichida qo'shish va ayirish) — fruit_basket
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'fruit_basket',
    topicTitle: "4-dars: 10 ichida quvnoq qo'shish va ayirish",
    ruleTitle: "Do'stlar jamlanadi (+), qushlar uchib ketadi (−)",
    explanation:
      "Qo'shish — daraxtdagi mevalarni bitta savatga yig'ib ko'paytirish (+)! Ayirish esa qushcha mevalarning bir qismini olib ketgach, qolganini sanash (−).",
    formulaOrRule: "🍎 3 + 2 = 5 (ko'paydi)   |   🐦 6 − 2 = 4 (kamaydi)",
    exampleProblem: '🍎 Daraxtda 3 ta qizil va 2 ta sariq olma bor. Savatga tersak nechta bo‘ladi?',
    exampleSolution: '1, 2, 3, 4, 5 — jami 5 ta mazali olma!',
    mathRounds: [
      {
        kind: 'fruit_basket',
        prompt: '3 + 2 = ?  Daraxtdagi 3 ta qizil va 2 ta sariq olmani savatga bosib uz!',
        options: ['5', '4', '6', '3'],
        correctAnswer: '5',
        hint: 'Har bir olmani bittadan bosib savatga sol: 1, 2, 3, 4, 5!',
        timeLimitSec: 38,
        fruitData: { mode: 'add', a: 3, b: 2 },
      },
      {
        kind: 'fruit_basket',
        prompt: '6 − 2 = ?  Daraxtda 6 ta olma bor edi, 2 tasini qushcha olib ketdi. Nechtasi qoldi?',
        options: ['4', '3', '5', '2'],
        correctAnswer: '4',
        hint: 'Shoxda qolgan olmalarni bosib bittadan sanab chiq!',
        timeLimitSec: 38,
        fruitData: { mode: 'subtract', a: 6, b: 2, subtractEffect: 'bird' },
      },
      {
        kind: 'fruit_basket',
        prompt: '4 + 3 = ?  Daraxtdagi 4 ta qizil va 3 ta sariq olmani savatga ter!',
        options: ['7', '6', '8', '5'],
        correctAnswer: '7',
        hint: 'Hamma olmalarni bittadan bosib savatga tushir!',
        timeLimitSec: 40,
        fruitData: { mode: 'add', a: 4, b: 3 },
      },
      {
        kind: 'fruit_basket',
        prompt: '8 − 3 = ?  Daraxtda 8 ta olma bor edi, shamol 3 tasini uchirib ketdi. Nechtasi qoldi?',
        options: ['5', '4', '6', '3'],
        correctAnswer: '5',
        hint: 'Shamol o‘tgach, daraxtda nechta olma qolganini bosib sana!',
        timeLimitSec: 38,
        fruitData: { mode: 'subtract', a: 8, b: 3, subtractEffect: 'wind' },
      },
    ],
  },

  // =========================================================================
  // 5-DARS: "SEHRLI TAROZI" (Noma'lum sonni topish) — scale_balance
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'scale_balance',
    topicTitle: "5-dars: Sehrli tarozi — noma'lum sonni top!",
    ruleTitle: 'Ikki palla tenglashganda tarozi tekislanadi!',
    explanation:
      'Chap pallada og‘ir oltin tangalar turibdi, o‘ng pallada esa tangalar va sirli "?" sandiqcha! Sandiqchaga yana nechta tanga solsang, ikki palla bab-baravar tekislanadi?',
    formulaOrRule: '⚖️ 7 = 4 + ?  →  3 ta tanga!   |   ? + 3 = 8  →  5 ta tanga!',
    exampleProblem: '⚖️ Chapda 7 ta tanga, o‘ngda 4 ta tanga va "?" sandiqcha bor. Nechta tanga yetishmayapti?',
    exampleSolution: '4 dan 7 gacha sanaymiz: 5, 6, 7 — demak 3 ta tanga kerak!',
    mathRounds: [
      {
        kind: 'scale_balance',
        prompt: "Chapda 7 ta tanga, o'ngda 4 ta tanga va '?' quticha bor. Tarozini tekisla!",
        options: ['2', '3', '4', '5'],
        correctAnswer: '3',
        hint: '4 ga yana 3 ta tanga qo‘shsang, 7 ta bo‘lib tarozi tekislanadi!',
        timeLimitSec: 38,
        scaleData: { leftTotal: 7, rightKnown: 4, unknownValue: 3, equationLabel: '7 = 4 + ?' },
      },
      {
        kind: 'scale_balance',
        prompt: "Sirli sandiqcha va 3 ta tanga jami 8 ta tangaga teng (? + 3 = 8)!",
        options: ['4', '5', '6', '3'],
        correctAnswer: '5',
        hint: '8 tadan 3 tasini olib qo‘y — 5 ta tanga yetishmayapti!',
        timeLimitSec: 38,
        scaleData: { leftTotal: 8, rightKnown: 3, unknownValue: 5, equationLabel: '? + 3 = 8' },
      },
      {
        kind: 'scale_balance',
        prompt: "Chapda 9 ta tanga, o'ngda 5 ta tanga va '?' sandiqcha. Muvozanatni top!",
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        hint: '5 dan 9 gacha barmoqda sana: 6, 7, 8, 9!',
        timeLimitSec: 38,
        scaleData: { leftTotal: 9, rightKnown: 5, unknownValue: 4, equationLabel: '9 = 5 + ?' },
      },
      {
        kind: 'scale_balance',
        prompt: "O'ng pallada 6 ta tanga bor, 10 ta bo'lishi uchun yana nechta tanga solamiz?",
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        hint: '6 bilan 4 birlashsa, roppa-rosa 10 ta tanga bo‘ladi!',
        timeLimitSec: 38,
        scaleData: { leftTotal: 10, rightKnown: 6, unknownValue: 4, equationLabel: '6 + ? = 10' },
      },
    ],
  },

  // =========================================================================
  // 6-DARS: "IKKITA CHO'NTAK" (Qo'shishning o'rin almashtirish xossasi) — two_pockets
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'two_pockets',
    topicTitle: "6-dars: Qo'shishning o'rin almashtirish siri",
    ruleTitle: "Cho'ntaklar almashsa ham yong'oqlar soni o'zgarmaydi!",
    explanation:
      'Chap cho‘ntakdagi yong‘oqlarni o‘ng cho‘ntakka, o‘ngdagilarni chapga almashtirsang ham, savatga to‘kkaningda ularning soni bir xil qoladi!',
    formulaOrRule: '🌰 2 + 4 = 4 + 2 = 6   |   🍎 3 + 5 = 5 + 3 = 8',
    exampleProblem: '🌰 Chap cho‘ntakda 2 ta, o‘ngda 4 ta yong‘oq bor. O‘rnini almashtirsak nechta bo‘ladi?',
    exampleSolution: '4 + 2 = 6! Baribir 6 ta mazali yong‘oq qoladi!',
    mathRounds: [
      {
        kind: 'two_pockets',
        prompt: "Chap cho'ntakda 2 ta, o'ngda 4 ta yong'oq bor! Almashtirib ko'r va jami sonini top!",
        options: ['5', '6', '7', '4'],
        correctAnswer: '6',
        hint: 'Avval "Almashtir" tugmasini bos, keyin savatga to‘kib sana: 4 + 2 = 6!',
        timeLimitSec: 40,
        pocketsData: { leftCount: 2, rightCount: 4, itemEmoji: '🌰', itemLabel: "yong'oq" },
      },
      {
        kind: 'two_pockets',
        prompt: "3 ta va 5 ta olmani cho'ntaklarda almashtirib ko'r! Jami nechta olma?",
        options: ['7', '8', '9', '6'],
        correctAnswer: '8',
        hint: 'Katta son 5 dan boshlab 3 qadam sana: 6, 7, 8!',
        timeLimitSec: 40,
        pocketsData: { leftCount: 3, rightCount: 5, itemEmoji: '🍎', itemLabel: 'olma' },
      },
      {
        kind: 'two_pockets',
        prompt: "Cho'ntaklarda 2 ta va 7 ta konfet bor! O'rnini almashtirsak jami nechta?",
        options: ['8', '9', '10', '7'],
        correctAnswer: '9',
        hint: '7 + 2 ni sanash 2 + 7 dan osonroq: 8, 9!',
        timeLimitSec: 40,
        pocketsData: { leftCount: 2, rightCount: 7, itemEmoji: '🍬', itemLabel: 'konfet' },
      },
      {
        kind: 'two_pockets',
        prompt: "4 ta va 6 ta yulduzcha! Cho'ntaklar almashsa ham jami nechta yulduzcha?",
        options: ['9', '10', '8', '11'],
        correctAnswer: '10',
        hint: '6 ga 4 ni qo‘shsak, chiroyli 10 ta yulduzcha bo‘ladi!',
        timeLimitSec: 40,
        pocketsData: { leftCount: 4, rightCount: 6, itemEmoji: '⭐', itemLabel: 'yulduzcha' },
      },
    ],
  },

  // =========================================================================
  // 7-DARS: "AQLLI POYEZD" (11 dan 20 gacha sonlar va O'nliklar) — train_tens
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'train_tens',
    topicTitle: "7-dars: 11 dan 20 gacha sonlar va O'nliklar",
    ruleTitle: "Katta vagon — 10 ta o'rindiq, kichik vagoncha — 1 ta!",
    explanation:
      'Aqlli poyezdimizning bitta katta vagoniga roppa-rosa 10 ta yo‘lovchi sig‘adi! Yoniga nechta kichik 1 talik o‘rindiq ulasang, 11 dan 20 gacha sonlar tayyor bo‘ladi.',
    formulaOrRule: '🚂 1 ta katta vagon (10) + 4 ta o‘rindiq (1) = 14',
    exampleProblem: '🚂 "14" sonini yasash uchun poyezdga nimalarni ulaymiz?',
    exampleSolution: '1 ta katta vagon (10) va 4 ta kichik o‘rindiq (1)!',
    mathRounds: [
      {
        kind: 'train_tens',
        prompt: '🚂 Poyezdda "14" sonini yasa! Katta vagon (10) va kichik o‘rindiqlarni (1) ula!',
        options: ['14'],
        correctAnswer: '14',
        hint: '14 = 1 ta katta vagon (10) va 4 ta kichik o‘rindiq (1)!',
        timeLimitSec: 45,
        trainData: { targetNumber: 14 },
      },
      {
        kind: 'train_tens',
        prompt: '🚂 Endi "12" sonini yasa va aqlli poyezdni yurgiz!',
        options: ['12'],
        correctAnswer: '12',
        hint: '1 ta katta vagon (10) va 2 ta kichik o‘rindiq (1) ula!',
        timeLimitSec: 45,
        trainData: { targetNumber: 12 },
      },
      {
        kind: 'train_tens',
        prompt: '🚂 Navbat "17" soniga! 10 talik vagon va kerakli o‘rindiqlarni ula!',
        options: ['17'],
        correctAnswer: '17',
        hint: '10 ga 7 ta kichik o‘rindiq qo‘shsang, 17 bo‘ladi!',
        timeLimitSec: 45,
        trainData: { targetNumber: 17 },
      },
      {
        kind: 'train_tens',
        prompt: '🚂 Katta bekat: "20" sonini yasash uchun nechta katta vagon (10) kerak?',
        options: ['20'],
        correctAnswer: '20',
        hint: '10 + 10 = 20! Roppa-rosa 2 ta katta vagon ula!',
        timeLimitSec: 45,
        trainData: { targetNumber: 20 },
      },
    ],
  },

  // =========================================================================
  // 8-DARS: "SEHRLI QULF" (Qavslar qoidasi va amallar tartibi) — magic_lock
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'magic_lock',
    topicTitle: '8-dars: Qavslar qoidasi va amallar tartibi',
    ruleTitle: 'Avval qulflangan sandiq ichini ochamiz!',
    explanation:
      'Qavs (...) — bu oltin qulf bilan yopilgan sehrli sandiqcha! Avval sandiq ichidagi misolni yechib qulfni ochmasang, tashqaridagi amalni bajarib bo‘lmaydi.',
    formulaOrRule: '🔒 10 − (3 + 2)  →  avval 3 + 2 = 5  →  🔓 10 − 5 = 5',
    exampleProblem: '🔒 10 − (3 + 2) = ? Birinchi qaysi amalni bajaramiz?',
    exampleSolution: 'Avval qulflangan sandiq ichini: 3 + 2 = 5, keyin 10 − 5 = 5!',
    mathRounds: [
      {
        kind: 'magic_lock',
        prompt: '🔒 10 − (3 + 2) = ? Avval sandiq qulfini och, keyin javobni top!',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        hint: 'Sandiq ichi 3 + 2 = 5 bo‘ldi, endi 10 dan 5 ni ayir!',
        timeLimitSec: 45,
        lockData: {
          outerNum: 10,
          outerOp: '-',
          bracketFirst: false,
          innerA: 3,
          innerB: 2,
          innerOp: '+',
          innerResult: 5,
          innerOptions: ['4', '5', '6', '7'],
          finalResult: 5,
        },
      },
      {
        kind: 'magic_lock',
        prompt: '🔒 (4 + 5) − 3 = ? Avval qavs ichidagi sandiqchani och!',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        hint: 'Sandiq ichi 4 + 5 = 9, endi 9 dan 3 ni ayir!',
        timeLimitSec: 45,
        lockData: {
          outerNum: 3,
          outerOp: '-',
          bracketFirst: true,
          innerA: 4,
          innerB: 5,
          innerOp: '+',
          innerResult: 9,
          innerOptions: ['8', '9', '10', '7'],
          finalResult: 6,
        },
      },
      {
        kind: 'magic_lock',
        prompt: '🔒 8 + (6 − 4) = ? Birinchi qulflangan (6 − 4) ni ochamiz!',
        options: ['9', '10', '11', '8'],
        correctAnswer: '10',
        hint: 'Sandiq ichi 6 − 4 = 2 bo‘ldi, endi 8 + 2 = 10!',
        timeLimitSec: 45,
        lockData: {
          outerNum: 8,
          outerOp: '+',
          bracketFirst: false,
          innerA: 6,
          innerB: 4,
          innerOp: '-',
          innerResult: 2,
          innerOptions: ['1', '2', '3', '4'],
          finalResult: 10,
        },
      },
      {
        kind: 'magic_lock',
        prompt: '🔒 (9 − 5) + 4 = ? Avval sandiq qulfini ochib kalitni top!',
        options: ['7', '8', '9', '6'],
        correctAnswer: '8',
        hint: '9 − 5 = 4 chiqdi, endi 4 ga 4 ni qo‘sh!',
        timeLimitSec: 45,
        lockData: {
          outerNum: 4,
          outerOp: '+',
          bracketFirst: true,
          innerA: 9,
          innerB: 5,
          innerOp: '-',
          innerResult: 4,
          innerOptions: ['3', '4', '5', '6'],
          finalResult: 8,
        },
      },
    ],
  },

  // =========================================================================
  // 9-DARS: "KO'PRIK QURISH" (20 gacha o'nlikdan o'tib qo'shish/ayirish) — bridge_tens
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'bridge_tens',
    topicTitle: "9-dars: 20 gacha o'nlikdan o'tib qo'shish va ayirish",
    ruleTitle: "Daryodan o'tish uchun avval 10 ta taxta ter!",
    explanation:
      'Katta sonlarni qo‘shganda avval ko‘prikni 10 ta taxta qilib mustahkamlab ol, keyin qolgan taxtalarni ulab qo‘y! Shunda qahramonimiz daryodan bir zumda yugurib o‘tadi.',
    formulaOrRule: '🌉 8 + 5  →  avval 8 + 2 = 10  →  keyin 10 + 3 = 13!',
    exampleProblem: '🌉 Ko‘prikda 8 ta taxta bor, yana 5 ta qo‘shish kerak (8 + 5). Qanday quramiz?',
    exampleSolution: 'Avval 2 ta qo‘yib 10 qilamiz, qolgan 3 ta taxtani ulasak — 13!',
    mathRounds: [
      {
        kind: 'bridge_tens',
        prompt: '🌉 8 + 5 = ? Avval 10 ta taxtalik tayanch qur, keyin qolgan 3 tasini ula!',
        options: ['12', '13', '14', '11'],
        correctAnswer: '13',
        hint: '8 + 2 = 10 bo‘ldi, qolgan 3 ta taxta bilan 10 + 3 = 13!',
        timeLimitSec: 45,
        bridgeData: {
          mode: 'add',
          startNum: 8,
          deltaNum: 5,
          step1Target: 2,
          step1Options: ['1', '2', '3', '4'],
          step2Remainder: 3,
          finalResult: 13,
        },
      },
      {
        kind: 'bridge_tens',
        prompt: '🌉 9 + 4 = ? Ko‘prikni avval 10 qilib to‘ldir, keyin qolganini qo‘sh!',
        options: ['12', '13', '14', '15'],
        correctAnswer: '13',
        hint: '9 ga 1 ta qo‘shsak 10, yana 3 ta qoldi: 10 + 3 = 13!',
        timeLimitSec: 45,
        bridgeData: {
          mode: 'add',
          startNum: 9,
          deltaNum: 4,
          step1Target: 1,
          step1Options: ['1', '2', '3', '4'],
          step2Remainder: 3,
          finalResult: 13,
        },
      },
      {
        kind: 'bridge_tens',
        prompt: '🌉 7 + 5 = ? Avval 7 ni 10 ga yetkaz, keyin qolgan taxtalarni ulab o‘t!',
        options: ['11', '12', '13', '14'],
        correctAnswer: '12',
        hint: '7 + 3 = 10, yana 2 ta taxta qoldi: 10 + 2 = 12!',
        timeLimitSec: 45,
        bridgeData: {
          mode: 'add',
          startNum: 7,
          deltaNum: 5,
          step1Target: 3,
          step1Options: ['2', '3', '4', '5'],
          step2Remainder: 2,
          finalResult: 12,
        },
      },
      {
        kind: 'bridge_tens',
        prompt: '🌉 13 − 5 = ? Avval 10 gacha tushir, keyin qolgan 2 tasini ayir!',
        options: ['7', '8', '9', '10'],
        correctAnswer: '8',
        hint: 'Avval 13 − 3 = 10 qilib ol, keyin 10 − 2 = 8!',
        timeLimitSec: 45,
        bridgeData: {
          mode: 'subtract',
          startNum: 13,
          deltaNum: 5,
          step1Target: 3,
          step1Options: ['2', '3', '4', '5'],
          step2Remainder: 2,
          finalResult: 8,
        },
      },
    ],
  },

  // =========================================================================
  // 10-DARS: "MAKTAB BANKI" (Yaxlit o'nliklar 10..100) — bank_tens
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'bank_tens',
    topicTitle: "10-dars: Yaxlit o'nliklar va 100 gacha sonlar",
    ruleTitle: "10 talik tangalar bilan oson sanaymiz!",
    explanation:
      'Maktab bankida sehrli 10 talik tangalar bor: 10, 20, 30, 40, 50... Har bitta tanga qo‘yganingda o‘ntadan sakrab sanaysan va xohlagan kitobingni sotib olasan!',
    formulaOrRule: '🪙 10 → 20 → 30 → 40 → 50 → ... → 100',
    exampleProblem: '📖 50 tangalik ertak kitobini olish uchun nechta 10 talik tanga qo‘yamiz?',
    exampleSolution: '5 ta! 10, 20, 30, 40, 50 — kitob sizniki!',
    mathRounds: [
      {
        kind: 'bank_tens',
        prompt: '📖 50 tangalik ertak kitobini sotib ol! Peshtaxtaga 10 talik tangalarni sanab qo‘y!',
        options: ['50'],
        correctAnswer: '50',
        hint: '10 tadan sanab 5 ta tanga qo‘y: 10, 20, 30, 40, 50!',
        timeLimitSec: 45,
        bankData: { itemEmoji: '📖', itemName: 'Ertak kitobi', targetPrice: 50 },
      },
      {
        kind: 'bank_tens',
        prompt: '🎨 30 tangalik rangli bo‘yoqlar to‘plamini sotib ol!',
        options: ['30'],
        correctAnswer: '30',
        hint: '10, 20, 30 — roppa-rosa 3 ta 10 talik tanga qo‘y!',
        timeLimitSec: 45,
        bankData: { itemEmoji: '🎨', itemName: "Rangli bo'yoqlar", targetPrice: 30 },
      },
      {
        kind: 'bank_tens',
        prompt: '⚽ 70 tangalik futbol koptogini olish uchun nechta 10 talik tanga kerak?',
        options: ['70'],
        correctAnswer: '70',
        hint: '10 tadan 7 marta sana: 10, 20, 30, 40, 50, 60, 70!',
        timeLimitSec: 45,
        bankData: { itemEmoji: '⚽', itemName: 'Futbol koptogi', targetPrice: 70 },
      },
      {
        kind: 'bank_tens',
        prompt: '🎒 80 tangalik chiroyli maktab sumkasini sotib ol!',
        options: ['80'],
        correctAnswer: '80',
        hint: '8 ta 10 talik tanga roppa-rosa 80 tanga bo‘ladi!',
        timeLimitSec: 45,
        bankData: { itemEmoji: '🎒', itemName: 'Maktab sumkasi', targetPrice: 80 },
      },
    ],
  },

  // =========================================================================
  // 11-DARS: "RANGLI MINORA" (Ikki xonali sonlarni qo'shish/ayirish) — tower_blocks
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'tower_blocks',
    topicTitle: "11-dars: Ikki xonali sonlarni qo'shish va ayirish",
    ruleTitle: "Moviy o'nlikni o'nlikka, yashil birlikni birlikka qo'sh!",
    explanation:
      'Katta sonlarni qo‘shish va ayirishda minora quramiz: chapdagi moviy ustunga faqat o‘nliklarni, o‘ngdagi yashil ustunga esa faqat birliklarni qo‘shamiz yoki olamiz!',
    formulaOrRule: '🏙️ 24 + 12  →  Moviy (2+1=3) va Yashil (4+2=6)  →  36!',
    exampleProblem: '🏙️ 24 qavatli minoraga yana 12 qavat qo‘shsak, nechta bo‘ladi?',
    exampleSolution: 'Moviy ustun 2 + 1 = 3, yashil ustun 4 + 2 = 6 — javobi 36!',
    mathRounds: [
      {
        kind: 'tower_blocks',
        prompt: '🏙️ 24 + 12 = ? Moviy o‘nliklarga 1 ta, yashil birliklarga 2 ta qo‘shib minorani ko‘tar!',
        options: ['36'],
        correctAnswer: '36',
        hint: '2 + 1 = 3 ta moviy o‘nlik va 4 + 2 = 6 ta yashil birlik → 36!',
        timeLimitSec: 45,
        towerData: { mode: 'add', startNum: 24, deltaNum: 12, targetNum: 36 },
      },
      {
        kind: 'tower_blocks',
        prompt: '🏙️ 31 + 24 = ? O‘nliklarni o‘nlikka, birliklarni birlikka qo‘sh!',
        options: ['55'],
        correctAnswer: '55',
        hint: 'Moviy: 3 + 2 = 5, Yashil: 1 + 4 = 5 → 55!',
        timeLimitSec: 45,
        towerData: { mode: 'add', startNum: 31, deltaNum: 24, targetNum: 55 },
      },
      {
        kind: 'tower_blocks',
        prompt: '🏙️ 45 − 20 = ? Moviy o‘nliklar ustunidan 2 ta blokni olib tashla!',
        options: ['25'],
        correctAnswer: '25',
        hint: '4 ta o‘nlikdan 2 tasini olsang 2 ta qoladi, 5 ta birlik o‘zgarmaydi → 25!',
        timeLimitSec: 45,
        towerData: { mode: 'subtract', startNum: 45, deltaNum: 20, targetNum: 25 },
      },
      {
        kind: 'tower_blocks',
        prompt: '🏙️ 48 − 15 = ? Moviydan 1 ta, yashildan 5 ta blokni olib tashla!',
        options: ['33'],
        correctAnswer: '33',
        hint: '4 − 1 = 3 ta o‘nlik va 8 − 5 = 3 ta birlik → 33!',
        timeLimitSec: 45,
        towerData: { mode: 'subtract', startNum: 48, deltaNum: 15, targetNum: 33 },
      },
    ],
  },

  // =========================================================================
  // 12-DARS: "SEHRLI ZANJIR" (Guruhlash xossasi — 10 lik do'stlar) — magic_chain
  // =========================================================================
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    gameType: 'magic_chain',
    topicTitle: "12-dars: Guruhlash xossasi va qiziqarli masalalar",
    ruleTitle: "Avval qo'shilsa 10 bo'ladigan do'stlarni bog'la!",
    explanation:
      'Uchta sonni qo‘shayotganda qo‘shilsa 10 bo‘ladigan ikkita do‘st sonni (masalan, 7 va 3 ni) birinchi bog‘lab ol! Shunda sehrli zanjir porlaydi va javob bir zumda chiqadi.',
    formulaOrRule: '✨ 7 + 5 + 3  →  (7 + 3 = 10)  →  10 + 5 = 15!',
    exampleProblem: '✨ 7 + 5 + 3 misolida qaysi ikkita son 10 lik do‘st?',
    exampleSolution: '7 va 3! Ular birlashib 10 bo‘ladi, 10 + 5 = 15!',
    mathRounds: [
      {
        kind: 'magic_chain',
        prompt: '✨ 7 + 5 + 3 = ? Avval 10 bo‘ladigan do‘st juftlikni bog‘la, keyin 5 ni qo‘sh!',
        options: ['14', '15', '16', '13'],
        correctAnswer: '15',
        hint: '7 bilan 3 birlashib 10 bo‘ladi, keyin 10 + 5 = 15!',
        timeLimitSec: 45,
        chainData: { nums: [7, 5, 3], pairIndices: [0, 2], remainingIndex: 1, finalResult: 15 },
      },
      {
        kind: 'magic_chain',
        prompt: '✨ 6 + 4 + 8 = ? 10 lik do‘stlarni topib bog‘la va zanjirni nurlantir!',
        options: ['17', '18', '19', '16'],
        correctAnswer: '18',
        hint: '6 bilan 4 birlashib 10 bo‘ladi, 10 + 8 = 18!',
        timeLimitSec: 45,
        chainData: { nums: [6, 4, 8], pairIndices: [0, 1], remainingIndex: 2, finalResult: 18 },
      },
      {
        kind: 'magic_chain',
        prompt: '✨ 9 + 6 + 1 = ? Qaysi ikki son qo‘shilsa 10 bo‘ladi?',
        options: ['15', '16', '17', '14'],
        correctAnswer: '16',
        hint: '9 va 1 — eng yaqin 10 lik do‘stlar! 10 + 6 = 16!',
        timeLimitSec: 45,
        chainData: { nums: [9, 6, 1], pairIndices: [0, 2], remainingIndex: 1, finalResult: 16 },
      },
      {
        kind: 'magic_chain',
        prompt: '✨ 4 + 8 + 2 = ? Avval 10 lik do‘stlarni bog‘la, so‘ngra 4 ni qo‘sh!',
        options: ['13', '14', '15', '12'],
        correctAnswer: '14',
        hint: '8 bilan 2 birlashsa 10 bo‘ladi, keyin 10 + 4 = 14!',
        timeLimitSec: 45,
        chainData: { nums: [4, 8, 2], pairIndices: [1, 2], remainingIndex: 0, finalResult: 14 },
      },
    ],
  },
];
