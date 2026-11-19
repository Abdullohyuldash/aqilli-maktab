import type { LessonPlan } from './curriculum';

export const MATH_GRADE_1_LESSONS: LessonPlan[] = [
  // 1-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: '1-dars: Predmetlar, joylashuv va vaqt',
    ruleTitle: 'Predmetlarni taqqoslash va joylashuv',
    explanation:
      "Atrofimizdagi narsalar rangi, shakli va kattaligi bilan bir-biridan farq qiladi. Ular chapda, o'ngda, tepada yoki pastda joylashadi. Kun esa ertalab, kunduzi, kechqurun va tunga bo'linadi.",
    formulaOrRule: 'Ertalab → Kunduzi → Kechqurun → Tun',
    exampleProblem: '🍎 🍌 🍐 🚗 — Qaysi biri meva emas (ortiqcha)?',
    exampleSolution: '🚗 Mashina — chunki qolganlari mevalar!',
    mathRounds: [
      {
        prompt: '🍎 🍌 🍐 🚗 — Qaysi biri ortiqcha?',
        options: ['🚗 Mashina', '🍎 Olma', '🍌 Banan', '🍐 Nok'],
        correctAnswer: '🚗 Mashina',
        hint: 'Uchtasi meva, bittasi transport!',
        timeLimitSec: 28,
      },
      {
        prompt: '🍎  ⭐  🎈 — Yulduzcha qayerda joylashgan?',
        options: ["O'rtada", 'Chapda', "O'ngda", 'Pastda'],
        correctAnswer: "O'rtada",
        hint: 'Olma chapda, shar o‘ngda turibdi.',
        timeLimitSec: 28,
      },
      {
        prompt: '☀️ Ertalabdan keyin kunning qaysi qismi keladi?',
        options: ['Kunduzi', 'Tun', 'Kecha', 'Yarim tun'],
        correctAnswer: 'Kunduzi',
        hint: 'Ertalab → Kunduzi → Kechqurun → Tun.',
        timeLimitSec: 28,
      },
      {
        prompt: "🍎🍎🍎🍎 ko'pmi yoki 🎈🎈 ko'pmi?",
        options: ["🍎 Olmalar ko'p", "🎈 Sharlar ko'p", 'Ikkalasi teng', "Bilish qiyin"],
        correctAnswer: "🍎 Olmalar ko'p",
        hint: 'Olmalar 4 ta, sharlar esa 2 ta.',
        timeLimitSec: 28,
      },
    ],
  },

  // 2-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: '2-dars: 0 dan 10 gacha sonlar, juft va toq',
    ruleTitle: 'Sonlarni sanash, juft va toq sonlar',
    explanation:
      "Juft sonlarni ikkitadan juftlab bo'ladi: 2, 4, 6, 8, 10. Toq sonlarda esa bitta ortib qoladi: 1, 3, 5, 7, 9. Sonlarni taqqoslashda katta son tomonga belgi ochiladi: 3 < 8.",
    formulaOrRule: 'Juft: 2, 4, 6, 8, 10  |  Toq: 1, 3, 5, 7, 9',
    exampleProblem: '🎈🎈🎈🎈 — Nechta shar bor va u juftmi?',
    exampleSolution: '4 ta shar bor. 4 — juft son!',
    mathRounds: [
      {
        prompt: '⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ — Nechta yulduzcha bor?',
        options: ['7', '6', '8', '5'],
        correctAnswer: '7',
        hint: 'Bittadan sanab chiqing: 1, 2, 3...',
        timeLimitSec: 28,
      },
      {
        prompt: "🍎 3 ___ 8  (Qaysi belgi qo'yiladi?)",
        options: ['<', '>', '=', '+'],
        correctAnswer: '<',
        hint: '8 soni 3 dan katta, belgi 8 ga qarab ochiladi.',
        timeLimitSec: 28,
      },
      {
        prompt: '🎈 Qaysi son JUFT son?',
        options: ['6', '3', '5', '9'],
        correctAnswer: '6',
        hint: 'Juft sonlar: 2, 4, 6, 8, 10.',
        timeLimitSec: 28,
      },
      {
        prompt: '🐦 Qaysi son TOQ son?',
        options: ['7', '2', '4', '8'],
        correctAnswer: '7',
        hint: 'Toq sonlar: 1, 3, 5, 7, 9.',
        timeLimitSec: 28,
      },
    ],
  },

  // 3-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: '3-dars: Shakllar va chiziqlar',
    ruleTitle: 'Yassi, hajmli shakllar va kesma',
    explanation:
      "Uchburchak, kvadrat va doira — yassi shakllar. Kub va shar (koptok) — hajmli shakllar. Ikki nuqtani birlashtiruvchi to'g'ri chiziq bo'lagi KESMA deyiladi.",
    formulaOrRule: '🔺 Uchburchak (3 burchak) | 🟦 Kvadrat (4 burchak) | ⭕ Doira (0 burchak)',
    exampleProblem: '⚽ Futbol koptogi qaysi hajmli shaklga o‘xshaydi?',
    exampleSolution: 'Shar shakliga o‘xshaydi!',
    mathRounds: [
      {
        prompt: '🔺 3 ta burchagi va 3 ta tomoni bor shakl qaysi?',
        options: ['Uchburchak', 'Kvadrat', 'Doira', 'Kub'],
        correctAnswer: 'Uchburchak',
        hint: 'Nomining o‘zida "uch" so‘zi bor!',
        timeLimitSec: 28,
      },
      {
        prompt: "⭕ Qaysi shaklning burchagi yo'q?",
        options: ['Doira', 'Kvadrat', 'Uchburchak', "To'rtburchak"],
        correctAnswer: 'Doira',
        hint: 'G‘ildirak va quyosh kabi yumaloq shakl.',
        timeLimitSec: 28,
      },
      {
        prompt: "⚽ Koptok qaysi hajmli shaklga o'xshaydi?",
        options: ['Shar', 'Uchburchak', 'Kesma', 'Chiziq'],
        correctAnswer: 'Shar',
        hint: 'Koptok dumaloq va hajmli bo‘ladi.',
        timeLimitSec: 28,
      },
      {
        prompt: "🟦 •————• Ikki nuqtani tutashtiruvchi to'g'ri chiziq nima?",
        options: ['Kesma', 'Egri chiziq', 'Doira', 'Shar'],
        correctAnswer: 'Kesma',
        hint: 'Boshi va oxiri nuqta bilan chegaralangan chiziq.',
        timeLimitSec: 28,
      },
    ],
  },

  // 4-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: "4-dars: 10 ichida qo'shish, ayirish va komponentlar",
    ruleTitle: "Qo'shish va ayirish nomlari",
    explanation:
      "Qo'shishda sonlar qo'shiluvchi, natija esa YIG'INDI deyiladi. Ayirishda birinchi son KAMAYUVCHI, ikkinchisi ayriluvchi, natija esa AYIRMA deyiladi.",
    formulaOrRule: "Qo'shiluvchi + Qo'shiluvchi = Yig'indi  |  Kamayuvchi − Ayriluvchi = Ayirma",
    exampleProblem: '🍎🍎 + 🍎🍎🍎 = ?',
    exampleSolution: "2 + 3 = 5 (5 — yig'indi)",
    mathRounds: [
      {
        prompt: '🍎🍎🍎 + 🍎🍎🍎🍎 = ?',
        options: ['7', '6', '8', '5'],
        correctAnswer: '7',
        hint: '3 ta olmaga 4 ta olma qo‘shing.',
        timeLimitSec: 26,
      },
      {
        prompt: '🎈 9 − 4 = ?',
        options: ['5', '4', '6', '3'],
        correctAnswer: '5',
        hint: '9 tadan 4 tasini olib tashlang.',
        timeLimitSec: 26,
      },
      {
        prompt: '⭐ 5 + 3 = 8 ifodasida 8 nima deyiladi?',
        options: ["Yig'indi", 'Ayirma', 'Kamayuvchi', 'Ayriluvchi'],
        correctAnswer: "Yig'indi",
        hint: 'Qo‘shish amalining natijasi.',
        timeLimitSec: 30,
      },
      {
        prompt: '🚗 9 − 4 = 5 ifodasida 9 nima deyiladi?',
        options: ['Kamayuvchi', 'Ayriluvchi', 'Ayirma', "Yig'indi"],
        correctAnswer: 'Kamayuvchi',
        hint: 'Ayirishda birinchi turgan eng katta son kamayadi.',
        timeLimitSec: 30,
      },
    ],
  },

  // 5-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: "5-dars: Noma'lum sonni topish",
    ruleTitle: "Bo'sh katakdagi sonni topish",
    explanation:
      "Noma'lum qo'shiluvchini topish uchun yig'indidan ma'lum qo'shiluvchini ayiramiz. Noma'lum kamayuvchini topish uchun esa ayirmaga ayriluvchini qo'shamiz.",
    formulaOrRule: '? + 3 = 7 ⇒ 7 − 3 = 4  |  ? − 2 = 5 ⇒ 5 + 2 = 7',
    exampleProblem: '⭐ ? + 3 = 8 bo‘lsa, ? nechaga teng?',
    exampleSolution: '8 − 3 = 5, demak 5 + 3 = 8!',
    mathRounds: [
      {
        prompt: '⭐ ? + 4 = 9  (Noma’lum son nechaga teng?)',
        options: ['5', '4', '6', '3'],
        correctAnswer: '5',
        hint: '9 dan 4 ni ayiring: 9 − 4.',
        timeLimitSec: 28,
      },
      {
        prompt: '🍎 6 + ? = 10',
        options: ['4', '3', '5', '6'],
        correctAnswer: '4',
        hint: '6 ga necha qo‘shsak 10 bo‘ladi?',
        timeLimitSec: 28,
      },
      {
        prompt: '🚗 ? − 3 = 4',
        options: ['7', '6', '8', '1'],
        correctAnswer: '7',
        hint: '4 ga 3 ni qo‘shing: 4 + 3.',
        timeLimitSec: 28,
      },
      {
        prompt: '🎈 9 − ? = 2',
        options: ['7', '6', '5', '8'],
        correctAnswer: '7',
        hint: '9 dan 2 ni ayiring: 9 − 2.',
        timeLimitSec: 28,
      },
    ],
  },

  // 6-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: "6-dars: Qo'shish xossalari va bog'liqlik",
    ruleTitle: "O'rin almashtirish xossasi",
    explanation:
      "Qo'shiluvchilarning o'rni almashgani bilan yig'indi o'zgarmaydi (3 + 6 = 6 + 3). Agar yig'indidan bitta qo'shiluvchini ayirsak, ikkinchi qo'shiluvchi chiqadi.",
    formulaOrRule: 'a + b = b + a  |  4 + 5 = 9  ⇒  9 − 4 = 5',
    exampleProblem: '2 + 7 = 9 bo‘lsa, 7 + 2 nechaga teng?',
    exampleSolution: 'O‘rni almashsa ham yig‘indi 9 bo‘lib qoladi!',
    mathRounds: [
      {
        prompt: '🍎 3 + 6 ifodasi qaysi ifodaga teng?',
        options: ['6 + 3', '6 − 3', '3 + 5', '9 + 3'],
        correctAnswer: '6 + 3',
        hint: 'Qo‘shiluvchilarning o‘rnini almashtiring.',
        timeLimitSec: 26,
      },
      {
        prompt: "⭐ 4 + 5 = 9 bo'lsa, 9 − 4 = ?",
        options: ['5', '4', '6', '3'],
        correctAnswer: '5',
        hint: 'Yig‘indidan 4 ni olsak, ikkinchi qo‘shiluvchi qoladi.',
        timeLimitSec: 26,
      },
      {
        prompt: '🎈 7 + 2 = ? (Tezkor qo‘shish)',
        options: ['9', '8', '10', '7'],
        correctAnswer: '9',
        hint: '7 dan keyin 2 ta sanang: 8, 9.',
        timeLimitSec: 25,
      },
      {
        prompt: "🐦 3 + 5 = 8 bo'lsa, 8 − 3 = ?",
        options: ['5', '3', '4', '6'],
        correctAnswer: '5',
        hint: '8 dan 3 ni ayirsak, 5 qoladi.',
        timeLimitSec: 26,
      },
    ],
  },

  // 7-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: "7-dars: 11 dan 20 gacha sonlar va o'nlik",
    ruleTitle: "O'nlik va birliklar",
    explanation:
      "11 dan 19 gacha bo'lgan sonlar 1 ta o'nlik (10) va bir nechta birlikdan tuziladi. Masalan, 14 = 1 o'nlik + 4 birlik. 20 da esa 2 ta o'nlik bor.",
    formulaOrRule: "14 = 1 o'nlik + 4 birlik  (10 + 4)",
    exampleProblem: "1 o'nlik va 3 birlik qaysi son?",
    exampleSolution: '10 + 3 = 13!',
    mathRounds: [
      {
        prompt: "🟦 1 o'nlik va 6 birlik qaysi son?",
        options: ['16', '61', '15', '17'],
        correctAnswer: '16',
        hint: '10 ga 6 ni qo‘shing: 10 + 6.',
        timeLimitSec: 28,
      },
      {
        prompt: "⭐ 19 sonida nechta o'nlik bor?",
        options: ['1', '9', '10', '2'],
        correctAnswer: '1',
        hint: '19 = 10 + 9, demak bitta 10 lik bor.',
        timeLimitSec: 28,
      },
      {
        prompt: "🍎 12 ___ 17  (To'g'ri belgini toping)",
        options: ['<', '>', '=', '+'],
        correctAnswer: '<',
        hint: '17 soni 12 dan katta.',
        timeLimitSec: 26,
      },
      {
        prompt: '🚗 15 dan keyin qaysi son keladi?',
        options: ['16', '14', '17', '13'],
        correctAnswer: '16',
        hint: '15 ga 1 qo‘shing.',
        timeLimitSec: 26,
      },
    ],
  },

  // 8-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: '8-dars: Qavslar qoidasi',
    ruleTitle: 'Avval qavs ichi bajariladi!',
    explanation:
      "Agar misolda qavs (...) bo'lsa, har doim birinchi bo'lib qavs ichidagi amalni hisoblaymiz, keyin qolgan amalni bajaramiz.",
    formulaOrRule: '10 − (4 + 1) = 10 − 5 = 5',
    exampleProblem: '(3 + 4) − 2 = ?',
    exampleSolution: 'Avval 3 + 4 = 7, keyin 7 − 2 = 5!',
    mathRounds: [
      {
        prompt: '⭐ 10 − (3 + 2) = ?',
        options: ['5', '9', '6', '4'],
        correctAnswer: '5',
        hint: 'Avval qavs ichi: 3 + 2 = 5, keyin 10 − 5.',
        timeLimitSec: 30,
      },
      {
        prompt: '🍎 (4 + 5) − 3 = ?',
        options: ['6', '7', '5', '8'],
        correctAnswer: '6',
        hint: 'Avval 4 + 5 = 9, keyin 9 − 3.',
        timeLimitSec: 30,
      },
      {
        prompt: '🎈 8 + (6 − 4) = ?',
        options: ['10', '9', '12', '8'],
        correctAnswer: '10',
        hint: 'Avval 6 − 4 = 2, keyin 8 + 2.',
        timeLimitSec: 30,
      },
      {
        prompt: '🟦 (9 − 5) + 6 = ?',
        options: ['10', '9', '11', '8'],
        correctAnswer: '10',
        hint: 'Avval 9 − 5 = 4, keyin 4 + 6.',
        timeLimitSec: 30,
      },
    ],
  },

  // 9-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: "9-dars: 20 gacha qo'shish va ayirish",
    ruleTitle: "O'nlikdan o'tib qo'shish va ayirish",
    explanation:
      "10 ga bir xonali sonni qo'shish juda oson: 10 + 5 = 15. O'nlikdan o'tib qo'shganda esa avval 10 gacha to'ldirib olamiz: 8 + 5 = 8 + 2 + 3 = 13.",
    formulaOrRule: '8 + 5 = (8 + 2) + 3 = 13  |  14 − 6 = (14 − 4) − 2 = 8',
    exampleProblem: '🍎 9 + 4 = ?',
    exampleSolution: '9 + 1 = 10, yana 3 ni qo‘shamiz: 10 + 3 = 13!',
    mathRounds: [
      {
        prompt: '🍎 10 + 7 = ?',
        options: ['17', '16', '18', '15'],
        correctAnswer: '17',
        hint: '1 o‘nlik va 7 birlik.',
        timeLimitSec: 26,
      },
      {
        prompt: '⭐ 8 + 6 = ?',
        options: ['14', '13', '15', '12'],
        correctAnswer: '14',
        hint: '8 + 2 = 10, yana 4 qo‘shing: 10 + 4.',
        timeLimitSec: 28,
      },
      {
        prompt: '🎈 15 − 5 = ?',
        options: ['10', '9', '11', '12'],
        correctAnswer: '10',
        hint: '15 dan 5 ta birlikni ayiring.',
        timeLimitSec: 26,
      },
      {
        prompt: '🐦 13 − 4 = ?',
        options: ['9', '8', '10', '7'],
        correctAnswer: '9',
        hint: 'Avval 13 − 3 = 10, keyin 10 − 1.',
        timeLimitSec: 28,
      },
    ],
  },

  // 10-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: '10-dars: Yaxlit sonlar va 100 gacha sonlar',
    ruleTitle: "Yaxlit o'nliklar (10, 20, 30... 100)",
    explanation:
      "Oxiri 0 bilan tugaydigan o'nliklar YAXLIT SONLAR deyiladi: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100. Ikki xonali sonlarni taqqoslaganda avval o'nliklariga qaraymiz.",
    formulaOrRule: "Yaxlit sonlar: 10, 20, 30, 40, ..., 100",
    exampleProblem: "3 o'nlik va 7 birlik qaysi son?",
    exampleSolution: '30 + 7 = 37!',
    mathRounds: [
      {
        prompt: '⭐ Qaysi biri YAXLIT son?',
        options: ['40', '25', '17', '33'],
        correctAnswer: '40',
        hint: 'Yaxlit sonlar 0 raqami bilan tugaydi.',
        timeLimitSec: 26,
      },
      {
        prompt: "🟦 5 o'nlik va 3 birlik qaysi son?",
        options: ['53', '35', '50', '54'],
        correctAnswer: '53',
        hint: '50 ga 3 ni qo‘shing.',
        timeLimitSec: 28,
      },
      {
        prompt: "🍎 64 ___ 46  (Qaysi belgi qo'yiladi?)",
        options: ['>', '<', '=', '+'],
        correctAnswer: '>',
        hint: '64 da 6 ta o‘nlik, 46 da 4 ta o‘nlik bor.',
        timeLimitSec: 28,
      },
      {
        prompt: '🚗 79 dan keyin qaysi son keladi?',
        options: ['80', '78', '81', '70'],
        correctAnswer: '80',
        hint: '79 + 1 = keyingi yaxlit o‘nlik!',
        timeLimitSec: 26,
      },
    ],
  },

  // 11-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: "11-dars: Ikki xonali sonlarni qo'shish va ayirish",
    ruleTitle: "O'nlikni o'nlikka, birlikni birlikka",
    explanation:
      "Ikki xonali sonlarni qo'shish yoki ayirishda o'nliklarni o'nliklar bilan, birliklarni esa birliklar bilan hisoblaymiz!",
    formulaOrRule: '24 + 12 = (20 + 10) + (4 + 2) = 36',
    exampleProblem: '🎈 45 − 20 = ?',
    exampleSolution: '40 − 20 = 20, yana 5 birlik bor: 25!',
    mathRounds: [
      {
        prompt: '🟦 30 + 40 = ?',
        options: ['70', '60', '80', '50'],
        correctAnswer: '70',
        hint: '3 o‘nlik + 4 o‘nlik = 7 o‘nlik.',
        timeLimitSec: 26,
      },
      {
        prompt: '🍎 23 + 14 = ?',
        options: ['37', '36', '38', '35'],
        correctAnswer: '37',
        hint: '20 + 10 = 30 va 3 + 4 = 7.',
        timeLimitSec: 30,
      },
      {
        prompt: '🎈 50 − 20 = ?',
        options: ['30', '20', '40', '25'],
        correctAnswer: '30',
        hint: '5 o‘nlik − 2 o‘nlik = 3 o‘nlik.',
        timeLimitSec: 26,
      },
      {
        prompt: '⭐ 48 − 15 = ?',
        options: ['33', '32', '34', '23'],
        correctAnswer: '33',
        hint: '40 − 10 = 30 va 8 − 5 = 3.',
        timeLimitSec: 30,
      },
    ],
  },

  // 12-dars
  {
    subject: 'math',
    tier: 'elementary',
    grade: 1,
    topicTitle: '12-dars: Guruhlash xossasi va qiziqarli masalalar',
    ruleTitle: 'Qulay guruhlab qo‘shish (avval 10 hosil qiling!)',
    explanation:
      "Uchta sonni qo'shganda avval yig'indisi 10 bo'ladigan juftlikni qo'shib olsak, hisoblash juda tez va oson bo'ladi.",
    formulaOrRule: '7 + 5 + 3 = (7 + 3) + 5 = 10 + 5 = 15',
    exampleProblem: '🍎 Savatda 8 ta olma, 3 ta nok va 2 ta banan bor. Jami nechta meva?',
    exampleSolution: '(8 + 2) + 3 = 10 + 3 = 13 ta meva!',
    mathRounds: [
      {
        prompt: '⭐ 6 + 5 + 4 = ?  (Qulay usulda hisoblang)',
        options: ['15', '14', '16', '13'],
        correctAnswer: '15',
        hint: 'Avval 6 + 4 = 10 qiling, keyin + 5!',
        timeLimitSec: 28,
      },
      {
        prompt: '🟦 8 + 7 + 2 = ?  (Avval 10 hosil qiling)',
        options: ['17', '16', '18', '15'],
        correctAnswer: '17',
        hint: '8 + 2 = 10, keyin 10 + 7.',
        timeLimitSec: 28,
      },
      {
        prompt: '🍎 Savatda 9 ta qizil va 6 ta yashil olma bor. Jami nechta?',
        options: ['15', '14', '16', '13'],
        correctAnswer: '15',
        hint: '9 + 6 = 9 + 1 + 5.',
        timeLimitSec: 30,
      },
      {
        prompt: '🐦 Daraxtda 14 ta qush bor edi, 5 tasi uchib ketdi. Nechtasi qoldi?',
        options: ['9', '8', '10', '11'],
        correctAnswer: '9',
        hint: '14 − 5 = (14 − 4) − 1.',
        timeLimitSec: 30,
      },
    ],
  },
];
