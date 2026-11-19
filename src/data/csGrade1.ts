import type { LessonPlan } from './curriculum';

export const CS_GRADE_1_LESSONS: LessonPlan[] = [
  // 1-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: "1-dars: Sezgi a'zolari — Ko'rish va eshitish",
    ruleTitle: "Bizning 5 ta sezgi a'zomiz",
    explanation:
      "Odam atrofdagi axborotni 5 ta sezgi a'zosi orqali qabul qiladi: ko'z bilan ko'ramiz (rang, shakl), quloq bilan eshitamiz (ovoz, musiqa), burun bilan hidlaymiz, til bilan ta'm bilamiz, teri bilan ushlab sezamiz.",
    formulaOrRule: "👁️ Ko'rish · 👂 Eshitish · 👃 Hidlash · 👅 Ta'm · ✋ Sezish",
    exampleProblem: "🎵 Sevimli qo'shig'imizni qaysi a'zo yordamida eshitamiz?",
    exampleSolution: "👂 Quloq yordamida eshitamiz!",
    csRounds: [
      {
        kind: 'choice',
        prompt: "Qaysi sezgi a'zomiz bilan rang va shakllarni ko'ramiz?",
        options: ["👁️ Ko'z", '👂 Quloq', '👃 Burun', '✋ Terimiz'],
        correctAnswer: "👁️ Ko'z",
        explanation: "Ko'zlarimiz ranglarni, shakllarni va atrofimizdagi narsalarni ko'rishga yordam beradi.",
      },
      {
        kind: 'choice',
        prompt: "Musiqa va qushlarning sayrashini nima bilan eshitamiz?",
        options: ['👂 Quloq', "👁️ Ko'z", '👃 Burun', '👅 Til'],
        correctAnswer: '👂 Quloq',
        explanation: 'Quloq barcha tovushlar va musiqalarni eshitadi.',
      },
      {
        kind: 'choice',
        prompt: 'Qaysi narsa QIZIL va DUMALOQ shaklga ega?',
        options: ['🍎 Olma', '🍌 Banan', '🥒 Bodring', '📘 Kitob'],
        correctAnswer: '🍎 Olma',
        explanation: 'Olma qizil rangli va yumaloq shaklda bo‘ladi.',
      },
      {
        kind: 'choice',
        prompt: "Odamda nechta asosiy sezgi a'zosi bor?",
        codeSnippet: '👁️  👂  👃  👅  ✋',
        options: ['5 ta', '2 ta', '3 ta', '8 ta'],
        correctAnswer: '5 ta',
        explanation: "Odamda 5 ta sezgi a'zosi bor: ko'z, quloq, burun, til va teri.",
      },
    ],
  },

  // 2-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: "2-dars: Hid, ta'm, his-tuyg'u va tavsiflash",
    ruleTitle: 'Hid, ta’m va predmetni belgilaridan topish',
    explanation:
      "Burun bilan gullar va ovqat hidini sezamiz, til bilan shirin, nordon yoki sho'r ta'mni ajratamiz. Predmetning rangi, shakli va ta'mini aytib uni tavsiflash mumkin.",
    formulaOrRule: "👃 Hid  |  👅 Shirin · Nordon · Sho'r  |  😊 Xursand · 😢 Xafa",
    exampleProblem: "🍯 Asalning ta'mi qanday bo'ladi?",
    exampleSolution: "Shirin bo'ladi!",
    csRounds: [
      {
        kind: 'choice',
        prompt: '🌸 Gulning yoqimli hidini qaysi a’zomiz bilan sezamiz?',
        options: ['👃 Burun', '👂 Quloq', "👁️ Ko'z", '✋ Qo‘l'],
        correctAnswer: '👃 Burun',
        explanation: 'Burun orqali turli hidlarni — gul, meva va ovqat hidini sezamiz.',
      },
      {
        kind: 'choice',
        prompt: "🍋 Limonning ta'mi qanday?",
        options: ['Nordon 🍋', 'Shirin 🍬', "Sho'r 🧂", 'Achchiq 🌶️'],
        correctAnswer: 'Nordon 🍋',
        explanation: 'Limon nordon ta’mga ega va vitaminlarga boy meva.',
      },
      {
        kind: 'choice',
        prompt: "Xursandchilik his-tuyg'usini qaysi belgi ko'rsatadi?",
        options: ['😊 Xursand', '😢 Xafa', '😠 Jahldor', '😴 Uyqusiragan'],
        correctAnswer: '😊 Xursand',
        explanation: 'Tabassum qilib turgan chehra xursandchilikni bildiradi.',
      },
      {
        kind: 'choice',
        prompt: '"Usti yashil, yumaloq, ichi qizil va juda shirin" — bu nima?',
        codeSnippet: '🟢 Tashqarisi yashil  ➔  🔴 Ichi qizil va shirin',
        options: ['🍉 Tarvuz', '🍋 Limon', '🍌 Banan', '🥕 Sabzi'],
        correctAnswer: '🍉 Tarvuz',
        explanation: 'Belgilariga qarab predmetni osongina topdik — bu tarvuz!',
      },
    ],
  },

  // 3-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: "3-dars: Oldin–keyin va Edi–bo'ldi",
    ruleTitle: 'Hodisalar ketma-ketligi (Oldin → Keyin)',
    explanation:
      "Tabiatdagi va hayotdagi har bir voqea o'z tartibida sodir bo'ladi: avval urug' ekiladi, keyin nihol, keyin daraxt o'sadi. Nimadir avval qanday EDI va keyin nima BO'LDI — buni bilish juda muhim!",
    formulaOrRule: "🌰 Urug' ➔ 🌱 Nihol ➔ 🌿 Ko'chat ➔ 🌳 Daraxt",
    exampleProblem: "❄️ Muz issiq xonada turib erisa, u nima bo'ladi?",
    exampleSolution: "💧 Suvga aylanadi!",
    csRounds: [
      {
        kind: 'order',
        prompt: "Tuxumdan tovuq bo'lguncha bo'lgan bosqichlarni tartiblang:",
        correctSteps: ['🥚 Tuxum', '🐣 Yoriq tuxum', "🐤 Jo'ja", '🐔 Tovuq'],
        explanation: "Avval tuxum bo'ladi, yorilib jo'ja chiqadi va ulg'ayib tovuq bo'ladi!",
      },
      {
        kind: 'order',
        prompt: "Daraxt o'sish ketma-ketligini to'g'ri tartibda tering:",
        correctSteps: ["🌰 Urug'", '🌱 Nihol', "🌿 Ko'chat", '🌳 Daraxt'],
        explanation: "Kichkina urug'dan asta-sekin katta daraxt o'sib chiqadi.",
      },
      {
        kind: 'choice',
        prompt: "Yomg'ir yog'ishidan OLDIN osmonda nima paydo bo'ladi?",
        codeSnippet: '❓ (Oldin)  ➔  🌧️ Yomg‘ir (Keyin)',
        options: ['☁️ Qora bulut', '🌈 Kamalak', '❄️ Qorbobo', '⭐ Yulduzlar'],
        correctAnswer: '☁️ Qora bulut',
        explanation: "Yomg'irdan oldin osmonni qora bulutlar qoplaydi.",
      },
      {
        kind: 'choice',
        prompt: "🧊 Muz quyoshda erigandan KEYIN nima bo'ladi?",
        codeSnippet: '🧊 Muz edi  ➔  ❓ bo‘ldi',
        options: ['💧 Suv', '🪨 Tosh', '🔥 Olov', '🍂 Barg'],
        correctAnswer: '💧 Suv',
        explanation: "Muz erib suyuq suvga aylanadi.",
      },
    ],
  },

  // 4-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: "4-dars: O'sish–kamayish va Harakatlar ketma-ketligi",
    ruleTitle: "O'sish, kamayish va algoritm qadamlari",
    explanation:
      "Kichikdan kattaga qarab tartiblash O'SISH, kattadan kichikka tartiblash KAMAYISH deyiladi. Ishlarni to'g'ri tartibda bajarish esa HARAKATLAR KETMA-KETLIGI (algoritm) bo'ladi.",
    formulaOrRule: "O'sish: 1 → 2 → 3 → 4  |  Kamayish: 4 → 3 → 2 → 1",
    exampleProblem: '🐜 🐱 🐘 — Bu hayvonlar qaysi tartibda turibdi?',
    exampleSolution: "Kichikdan kattaga, ya'ni O'SISH tartibida!",
    csRounds: [
      {
        kind: 'order',
        prompt: "Hayvonlarni kichikdan kattaga (O'SISH tartibida) tering:",
        correctSteps: ['🐜 Chumoli', '🐱 Mushuk', '🐴 Ot', '🐘 Fil'],
        explanation: 'Eng kichigi chumoli, eng kattasi esa fil!',
      },
      {
        kind: 'order',
        prompt: "Qo'l yuvish harakatlarini to'g'ri ketma-ketlikda tering:",
        correctSteps: ['🚰 Kranni ochish', '🧼 Sovun surtish', '💧 Suv bilan chayish', '🧻 Sochiqqa artish'],
        explanation: "To'g'ri ketma-ketlikda yuvilgan qo'llar doim toza bo'ladi!",
      },
      {
        kind: 'choice',
        prompt: 'Qaysi qator KAMAYISH tartibida (kattadan kichikka) yozilgan?',
        options: ['5, 4, 3, 2, 1', '1, 2, 3, 4, 5', '2, 4, 6, 8, 10', '1, 3, 2, 5, 4'],
        correctAnswer: '5, 4, 3, 2, 1',
        explanation: '5 dan 1 gacha har bir son kichrayib boryapti.',
      },
      {
        kind: 'choice',
        prompt: "O'sish tartibida keyingi son qaysi?",
        codeSnippet: '2  ➔  4  ➔  6  ➔  ❓',
        options: ['8', '7', '5', '3'],
        correctAnswer: '8',
        explanation: 'Har safar 2 taga oshib boryapti: 6 + 2 = 8.',
      },
    ],
  },

  // 5-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: "5-dars: Tabiatdagi takrorlanish va Sog'lom turmush tarzi",
    ruleTitle: 'Takrorlanuvchi hodisalar va foydali odatlar',
    explanation:
      "Tabiatda fasllar (bahor, yoz, kuz, qish) va kun qismlari (ertalab, kunduzi, kechqurun, tun) doimo takrorlanadi. Sog'lom bo'lish uchun biz ham har kuni badantarbiya qilib, tishimizni yuvishimiz kerak.",
    formulaOrRule: '🌸 Bahor ➔ ☀️ Yoz ➔ 🍂 Kuz ➔ ❄️ Qish ➔ 🌸 Bahor',
    exampleProblem: '🌙 Tundan keyin har doim nima boshlanadi?',
    exampleSolution: '🌅 Ertalab (tong) boshlanadi!',
    csRounds: [
      {
        kind: 'order',
        prompt: "Yil fasllarini to'g'ri ketma-ketlikda tering:",
        correctSteps: ['🌸 Bahor', '☀️ Yoz', '🍂 Kuz', '❄️ Qish'],
        explanation: 'Fasllar har yili xuddi shu tartibda takrorlanadi!',
      },
      {
        kind: 'order',
        prompt: "Bir kunning qismlarini ertalabdan boshlab tartiblang:",
        correctSteps: ['🌅 Ertalab', '☀️ Kunduzi', '🌇 Kechqurun', '🌙 Tun'],
        explanation: 'Kun ertalab boshlanib, tun bilan tugaydi va yana takrorlanadi.',
      },
      {
        kind: 'choice',
        prompt: "Sog'lom bo'lish uchun ertalab nima qilish kerak?",
        options: [
          '🪥 Badantarbiya va tish yuvish',
          '🍬 Faqat shirinlik yeyish',
          '📱 Kun bo‘yi telefon o‘ynash',
          '🛌 Kechgacha uxlash',
        ],
        correctAnswer: '🪥 Badantarbiya va tish yuvish',
        explanation: "Badantarbiya va tozalik sog'lom turmush tarzining asosidir!",
      },
      {
        kind: 'choice',
        prompt: '❄️ Qish faslidan keyin doim qaysi fasl keladi?',
        codeSnippet: '🌸 ➔ ☀️ ➔ 🍂 ➔ ❄️ ➔ ❓',
        options: ['🌸 Bahor', '🍂 Kuz', '☀️ Yoz', '❄️ Yana qish'],
        correctAnswer: '🌸 Bahor',
        explanation: 'Qish tugab, gullarga boy bahor fasli keladi!',
      },
    ],
  },

  // 6-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: "6-dars: Tepada–pastda, Oldinda–orqada, Chapda–o'ngda",
    ruleTitle: "Fazo va yo'nalishlarni aniqlash",
    explanation:
      "Narsalarning qayerda turganini aytish uchun tepada–pastda, oldinda–orqada, chapda–o'ngda so'zlaridan foydalanamiz. Bu bizga kompyuterda va hayotda to'g'ri yo'l topishga yordam beradi.",
    formulaOrRule: "⬆️ Tepada · ⬇️ Pastda · ⬅️ Chapda · ➡️ O'ngda",
    exampleProblem: '🐦 Qush daraxtning qayerida uchadi?',
    exampleSolution: '⬆️ Tepada uchadi!',
    csRounds: [
      {
        kind: 'choice',
        prompt: '☀️ Quyosh va bulutlar bizga nisbatan qayerda joylashgan?',
        options: ['⬆️ Tepada', '⬇️ Pastda', '⬅️ Chapda', '🛏️ Tagida'],
        correctAnswer: '⬆️ Tepada',
        explanation: 'Quyosh va bulutlar osmonda — tepada bo‘ladi.',
      },
      {
        kind: 'choice',
        prompt: '👟 Oyoq kiyimimizni qayerga kiyamiz (qayerda turadi)?',
        options: ['⬇️ Pastda', '⬆️ Tepada', '☁️ Osmonda', '🌳 Daraxtda'],
        correctAnswer: '⬇️ Pastda',
        explanation: 'Oyoqlarimiz va poyabzalimiz pastda — yerda turadi.',
      },
      {
        kind: 'choice',
        prompt: 'Mashinalar chapga qarab ketyapti: avtobusdan OLDINDA nima turibdi?',
        codeSnippet: '⬅️  🚗  🚌  🚲',
        options: ['🚗 Yengil mashina', '🚲 Velosiped', '🚌 Avtobus', '🌳 Daraxt'],
        correctAnswer: '🚗 Yengil mashina',
        explanation: "Qator boshida — avtobusdan oldinda 🚗 yengil mashina ketmoqda.",
      },
      {
        kind: 'choice',
        prompt: "➡️ Ushbu strelka qaysi tomonni ko'rsatmoqda?",
        options: ["O'ng tomonni", 'Chap tomonni', 'Tepani', 'Pastni'],
        correctAnswer: "O'ng tomonni",
        explanation: "➡️ belgisi o'ng yo'nalishni bildiradi.",
      },
    ],
  },

  // 7-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: '7-dars: Uzoq–yaqin va Uzun–qisqa',
    ruleTitle: 'Masofa va uzunlikni taqqoslash',
    explanation:
      "Bizga tegib turgan yoki yonimizdagi narsalar YAQIN, osmondagi quyosh va yulduzlar esa juda UZOQ. Narsalar uzunligi bo'yicha UZUN yoki QISQA bo'ladi.",
    formulaOrRule: '☀️ Uzoq — 📓 Yaqin  |  🦒 Uzun — ✏️ Qisqa',
    exampleProblem: '🚆 Poyezd uzunmi yoki 🚗 mashinami?',
    exampleSolution: '🚆 Poyezd ancha uzun!',
    csRounds: [
      {
        kind: 'choice',
        prompt: 'Qaysi biri bizdan eng UZOQDA joylashgan?',
        options: ['☀️ Quyosh', '🏫 Maktab', '📓 Daftar', '🪑 Parta'],
        correctAnswer: '☀️ Quyosh',
        explanation: 'Quyosh koinotda, Yerdan juda-juda uzoqda joylashgan.',
      },
      {
        kind: 'choice',
        prompt: "Qaysi hayvonning bo'yni eng UZUN?",
        options: ['🦒 Jirafa', '🐱 Mushuk', '🐢 Toshbaqa', '🐭 Sichqon'],
        correctAnswer: '🦒 Jirafa',
        explanation: "Jirafa — dunyodagi eng uzun bo'yinli hayvon!",
      },
      {
        kind: 'choice',
        prompt: 'Qaysi buyum QISQAroq?',
        options: ['✏️ Qalam', '🚆 Poyezd', '🚌 Avtobus', '🛣️ Katta ko‘cha'],
        correctAnswer: '✏️ Qalam',
        explanation: 'Qalam qo‘limizga sig‘adi, poyezd esa juda uzun.',
      },
      {
        kind: 'order',
        prompt: 'Buyumlarni eng QISQAdan eng UZUNga qarab tartiblang:',
        correctSteps: ['📎 Skrepka', '✏️ Qalam', "📏 Chizg'ich", '🚌 Avtobus'],
        explanation: 'Skrepka eng qisqa, avtobus esa eng uzun!',
      },
    ],
  },

  // 8-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: "8-dars: Yo'l, yo'nalish, labirint va xavfsiz hudud",
    ruleTitle: "Xavfsiz yo'l rejasi va labirint",
    explanation:
      "Maktabga borishda har doim xavfsiz yo'lni tanlaymiz: faqat piyodalar yo'lagidan va svetoforning yashil chirog'ida o'tamiz. Labirintda esa to'siq chiqsa, ochiq yo'lga burilamiz.",
    formulaOrRule: "🔴 To'xta · 🟡 Tayyorlan · 🟢 O't!  |  🏠 ➔ 🚦 ➔ 🏫",
    exampleProblem: "🚦 Svetoforda qizil chiroq yonsa nima qilamiz?",
    exampleSolution: "To'xtab kutib turamiz!",
    csRounds: [
      {
        kind: 'order',
        prompt: "Uydan maktabga xavfsiz borish rejasini to'g'ri tartiblang:",
        correctSteps: [
          '🏠 Uydan chiqish',
          '🚦 Svetoforda yashil chiroqni kutish',
          "🚶 Piyodalar yo'lagidan o'tish",
          '🏫 Maktabga kirish',
        ],
        explanation: "Reja bo'yicha yurish ham xavfsiz, ham vaqtni tejaydi!",
      },
      {
        kind: 'choice',
        prompt: "Svetoforning qaysi chirog'i yonganda yo'ldan o'tish xavfsiz?",
        codeSnippet: '🔴 Qizil   🟡 Sariq   🟢 Yashil',
        options: ['🟢 Yashil', '🔴 Qizil', '🟡 Sariq', '⚫ Chiroq o‘chiq bo‘lsa'],
        correctAnswer: '🟢 Yashil',
        explanation: "Faqat yashil chiroq yonganda va mashinalar to'xtaganda o'tiladi.",
      },
      {
        kind: 'choice',
        prompt: "Bolalar uchun koptok o'ynashga eng XAVFSIZ hudud qaysi?",
        options: [
          '🛝 Bolalar maydonchasi',
          "🛣️ Katta mashina yo'li",
          '🚧 Qurilish maydoni',
          '🚆 Temir yo‘l usti',
        ],
        correctAnswer: '🛝 Bolalar maydonchasi',
        explanation: "O'yin maydonchasi bolalar xavfsiz o'ynashi uchun maxsus qurilgan.",
      },
      {
        kind: 'choice',
        prompt: "Labirintda oldingizdan devor (to'siq) chiqib qolsa, nima qilish kerak?",
        codeSnippet: '🚶 ➔ 🧱 (To‘siq!)',
        options: [
          "↩️ Boshqa ochiq yo'lga burilish",
          '🧱 Devorga urilib turaverish',
          "🙈 Ko'zni yumib yurish",
          "🛑 O'yinni tashlab ketish",
        ],
        correctAnswer: "↩️ Boshqa ochiq yo'lga burilish",
        explanation: "Labirintda to'siq uchrasa, orqaga qaytib boshqa ochiq yo'lni sinab ko'ramiz.",
      },
    ],
  },

  // 9-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: "9-dars: Qismlarga ajratish, yig'ish va taqqoslash",
    ruleTitle: 'Butun va qismlar, qarama-qarshi alomatlar',
    explanation:
      "Har bir buyum bir nechta qismlardan yig'iladi (masalan, uy — devor, tom, eshik va derazadan). Narsalarni taqqoslab o'xshash va qarama-qarshi (issiq–sovuq, katta–kichik) belgilarini topamiz.",
    formulaOrRule: "🏠 Uy = Tom + Devor + Eshik + Deraza  |  🔥 Issiq ↔ ❄️ Sovuq",
    exampleProblem: '🌙 "Tun" so‘zining qarama-qarshisi nima?',
    exampleSolution: '☀️ "Kun"!',
    csRounds: [
      {
        kind: 'choice',
        prompt: "🚲 Velosiped qanday asosiy qismlardan yig'iladi?",
        options: [
          "Rul, g'ildirak va pedal",
          'Barg, ildiz va shox',
          'Qanot, tumshuq va pat',
          'Qopqoq, varaq va muqova',
        ],
        correctAnswer: "Rul, g'ildirak va pedal",
        explanation: "Har bir qism o'z vazifasini bajarib butun velosipedni hosil qiladi.",
      },
      {
        kind: 'choice',
        prompt: '🔥 "Issiq" so\'zining qarama-qarshi alomati qaysi?',
        options: ['❄️ Sovuq', '☀️ Iliq', '🌶️ Achchiq', '🔴 Qizil'],
        correctAnswer: '❄️ Sovuq',
        explanation: 'Issiq va sovuq — bir-biriga qarama-qarshi belgilar!',
      },
      {
        kind: 'choice',
        prompt: '🐘 "Katta" so\'zining qarama-qarshisi nima?',
        options: ['🐭 Kichik', '🦒 Baland', '⚡ Tez', '🎈 Yengil'],
        correctAnswer: '🐭 Kichik',
        explanation: 'Fil katta, sichqoncha esa kichik!',
      },
      {
        kind: 'choice',
        prompt: "🍎 Olma va 🍐 nokning o'xshash tomoni nima?",
        options: [
          'Ikkalasi ham meva 🍎🍐',
          'Ikkalasi ham hayvon',
          'Ikkalasi ham mashina',
          'Ikkalasi ham kiyim',
        ],
        correctAnswer: 'Ikkalasi ham meva 🍎🍐',
        explanation: 'Shakli turlicha bo‘lsa ham, ikkalasi mevalar guruhiga kiradi.',
      },
    ],
  },

  // 10-dars
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    topicTitle: "10-dars: To'g'ri–noto'g'ri va Rost–yolg'on (Mantiq)",
    ruleTitle: 'Mantiqiy fikr: Rostmi yoki Yolg‘on?',
    explanation:
      "Kompyuter ham, inson ham fikrlarni tekshiradi: haqiqatga mos gaplar ROST (To'g'ri), haqiqatga mos kelmaydigan gaplar esa YOLG'ON (Noto'g'ri) deyiladi.",
    formulaOrRule: "Haqiqat = ✅ Rost (To'g'ri)  |  Xato = ❌ Yolg'on (Noto'g'ri)",
    exampleProblem: '"Mushuk miyovlaydi." — Rostmi yoki Yolg‘on?',
    exampleSolution: '✅ Rost!',
    csRounds: [
      {
        kind: 'choice',
        prompt: '"❄️ Qishda qor yog\'adi." — Bu gap Rostmi yoki Yolg\'on?',
        options: ['✅ Rost', "❌ Yolg'on"],
        correctAnswer: '✅ Rost',
        explanation: 'Haqiqatan ham qish faslida havo sovib, qor yog‘adi!',
      },
      {
        kind: 'choice',
        prompt: '"🐟 Baliqlar osmonda uchadi." — Bu gap Rostmi yoki Yolg\'on?',
        options: ["❌ Yolg'on", '✅ Rost'],
        correctAnswer: "❌ Yolg'on",
        explanation: "Baliqlar suvda suzadi, osmonda esa qushlar uchadi.",
      },
      {
        kind: 'choice',
        prompt: '"🟦 Kvadratning 4 ta tomoni bor." — To\'g\'rimi yoki Noto\'g\'ri?',
        options: ["✅ To'g'ri", "❌ Noto'g'ri"],
        correctAnswer: "✅ To'g'ri",
        explanation: "Kvadratning 4 ta teng tomoni va 4 ta burchagi bor.",
      },
      {
        kind: 'choice',
        prompt: '"☀️ Quyosh kechasi porlaydi." — Rostmi yoki Yolg\'on?',
        options: ["❌ Yolg'on", '✅ Rost'],
        correctAnswer: "❌ Yolg'on",
        explanation: "Quyosh kunduzi porlaydi, kechasi esa oy va yulduzlar ko'rinadi.",
      },
    ],
  },
];
