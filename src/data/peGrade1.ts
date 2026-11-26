import type { LessonPlan } from './curriculum';

export const PE_GRADE_1_LESSONS: LessonPlan[] = [
  // =========================================================================
  // 1-YARIM YILLIK (1–16-DARSLAR)
  // =========================================================================

  // 1-DARS: Sport zali qoidalari va safga turish (line_formation)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'line_formation',
    topicTitle: '1-dars: Sport zali qoidalari va safga turish',
    ruleTitle: 'Sport zalida xavfsizlik va tartib',
    explanation:
      "Sport zaliga faqat toza sport kiyimi va qulay krossovkada kiriladi. Dars boshida ustoz hushtagi chalingach, hamma shovqin qilmay bir safga tiziladi!",
    formulaOrRule: '👟 Sport kiyimi · 🤫 Tartib · 📏 Safga turish',
    exampleProblem: 'Sport zaliga kirishdan oldin nima kiyishimiz kerak?',
    exampleSolution: 'Qulay sport formasi va tagi sirpanmaydigan krossovka kiyamiz!',
    peRounds: [
      {
        kind: 'line_formation',
        prompt: 'Sport zaliga tayyorlanish bosqichlarini to‘g‘ri tartibda joylashtir!',
        options: ['Tartib tayyor!'],
        correctAnswer: 'Tartib tayyor!',
        fact: "Sport kiyimi tanani erkin harakatlantirishga va mashqlarni xavfsiz bajarishga yordam beradi.",
        teacherHint: 'Avval kiyim kiyamiz, keyin zalga kiramiz, oxirida ustoz yonida safga turamiz.',
        lineData: {
          mode: 'order_steps',
          steps: [
            { id: 'dress', emoji: '👟', label: 'Sport formasi kiyish' },
            { id: 'enter', emoji: '🚪', label: 'Zalga tartibli kirish' },
            { id: 'lineup', emoji: '🧍', label: 'Bir safga turish' },
          ],
        },
      },
      {
        kind: 'line_formation',
        prompt: 'Ustoz hushtak chalib «Saflaning!» dedi. Qaysi harakat to‘g‘ri?',
        options: ['Tinchgina safga turish', 'Zal bo‘ylab yugurib ketish'],
        correctAnswer: 'Tinchgina safga turish',
        fact: 'Hushtak chalinganda darhol to‘xtab, ustozga qarash — haqiqiy sportchi odobidir!',
        teacherHint: 'Yugurish va baqirish xavfli; safga tez va jimgina turish kerak.',
        lineData: {
          mode: 'command_pick',
          commandBadge: '📣 Safga turing!',
          choices: [
            { id: 'ok', emoji: '🧍🧍🧍', label: 'Tinchgina bir safga turish', isCorrect: true },
            { id: 'run', emoji: '🏃💨', label: 'Har tomonga yugurib ketish', isCorrect: false },
            { id: 'sit', emoji: '🪑😴', label: 'O‘tirib dam olish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'line_formation',
        prompt: 'Safda bo‘y bo‘yicha qanday turiladi? Eng balandidan boshlab ter!',
        options: ['Saf terildi!'],
        correctAnswer: 'Saf terildi!',
        fact: 'Bo‘y bo‘yicha saflanishda eng baland o‘quvchi saf boshida (o‘ng tomonda) turadi.',
        teacherHint: '1-raqamdan 3-raqamgacha katta bo‘ydan kichik bo‘yga qarab joylashtir.',
        lineData: {
          mode: 'order_steps',
          steps: [
            { id: 'tall', emoji: '🦒', label: 'Eng baland (1-o‘rin)' },
            { id: 'mid', emoji: '🧑', label: 'O‘rtacha bo‘y (2-o‘rin)' },
            { id: 'small', emoji: '🧒', label: 'Kichikroq bo‘y (3-o‘rin)' },
          ],
        },
      },
    ],
  },

  // 2-DARS: Tekislan, rostlan va bir qatorga saflanish (line_formation)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'line_formation',
    topicTitle: '2-dars: Tekislan, rostlan va bir qatorga saflanish',
    ruleTitle: '«Tekislan!» va «Rostlan!» komandalari',
    explanation:
      "«Tekislan!» komandasida boshimizni o‘ngga burib, qo‘shnimizning ko‘kragiga qarab qatorni to‘g‘rilaymiz. «Rostlan!» deganda esa to‘g‘riga qarab qo‘llarimizni yonimizga tushiramiz!",
    formulaOrRule: '👀 «Tekislan!» = o‘ngga qara  |  🧍 «Rostlan!» = to‘g‘riga qotib tur',
    exampleProblem: '«Rostlan!» komandasida qanday turamiz?',
    exampleSolution: 'Gavdani tik tutib, qo‘llarni yonimizda ushlab to‘g‘riga qaraymiz!',
    peRounds: [
      {
        kind: 'line_formation',
        prompt: '«Tekislan!» komandasi berildi. Qaysi holatni tanlaysan?',
        options: ['O‘ngga qarab qatorni tekislash'],
        correctAnswer: 'O‘ngga qarab qatorni tekislash',
        fact: 'Tekislanish safning bir tekis chiziqda bo‘lishini ta’minlaydi.',
        teacherHint: 'Qo‘shning bilan bir chiziqda turish uchun o‘ng tomonga qara.',
        lineData: {
          mode: 'command_pick',
          commandBadge: '📣 Tekislan!',
          choices: [
            { id: 'right_look', emoji: '👀➡️', label: 'O‘ngga qarab qatorni tekislash', isCorrect: true },
            { id: 'jump', emoji: '🤸', label: 'Sakrab qo‘l silkitish', isCorrect: false },
            { id: 'back', emoji: '🙈', label: 'Orqaga qarab olish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'line_formation',
        prompt: '«Rostlan!» komandasi berildi! Qaysi rasm to‘g‘ri?',
        options: ['Tik turish, qo‘llar yonida'],
        correctAnswer: 'Tik turish, qo‘llar yonida',
        fact: '«Rostlan!» holatida qimirlamay, boshni baland ko‘tarib turiladi.',
        teacherHint: 'Tik qomat va yonboshdagi qo‘llarni tanla!',
        lineData: {
          mode: 'command_pick',
          commandBadge: '📣 Rostlan!',
          choices: [
            { id: 'straight', emoji: '🧍‍♂️✨', label: 'Tik turish, qo‘llar yonida', isCorrect: true },
            { id: 'wave', emoji: '🙋‍♂️', label: 'Qo‘lni baland ko‘tarish', isCorrect: false },
            { id: 'squat', emoji: '🧎', label: 'O‘tirib olish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'line_formation',
        prompt: 'Dars boshlanishidagi uchta saf komandasini tartib bilan ter!',
        options: ['Tartib tayyor!'],
        correctAnswer: 'Tartib tayyor!',
        fact: 'Har bir jismoniy tarbiya darsi «Saflan! — Tekislan! — Rostlan!» bilan boshlanadi.',
        teacherHint: 'Avval safga turiladi, keyin tekislanadi, oxirida rostlaniladi.',
        lineData: {
          mode: 'order_steps',
          steps: [
            { id: 's1', emoji: '📏', label: 'Saflan!' },
            { id: 's2', emoji: '👀', label: 'Tekislan!' },
            { id: 's3', emoji: '🧍', label: 'Rostlan!' },
          ],
        },
      },
    ],
  },

  // 3-DARS: Joyida burilish: o'ngga, chapga va ortga (line_formation)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'line_formation',
    topicTitle: "3-dars: Joyida burilish: o'ngga, chapga va ortga",
    ruleTitle: 'O‘ng, chap va ortga aniq burilish',
    explanation:
      "Joyida burilganda tovon va oyoq uchiga tayanib, gavdani tik tutgan holda burilamiz. O‘ng qo‘l tomon — o‘ngga, chap qo‘l tomon — chapga, orqaga to‘liq aylanish esa — ortga burilishdir!",
    formulaOrRule: '➡️ O‘ngga (90°) · ⬅️ Chapga (90°) · 🔄 Ortga (180°)',
    exampleProblem: '«Ortga buril!» deganda qaysi tomondan aylanamiz?',
    exampleSolution: 'Chap yelka orqali to‘liq orqa tomonga (180°) burilamiz!',
    peRounds: [
      {
        kind: 'line_formation',
        prompt: 'Ustoz «O‘ngga buril!» dedi. Qaysi yo‘nalishni tanlaysan?',
        options: ['O‘ng tomonga burilish'],
        correctAnswer: 'O‘ng tomonga burilish',
        fact: 'O‘ng qo‘ling joylashgan tomonga chorak aylanish — «O‘ngga!» burilishdir.',
        teacherHint: 'O‘ngga qaragan strelkani top!',
        lineData: {
          mode: 'command_pick',
          commandBadge: '📣 O‘ngga buril!',
          choices: [
            { id: 'right', emoji: '➡️', label: 'O‘ng tomonga (90°)', isCorrect: true },
            { id: 'left', emoji: '⬅️', label: 'Chap tomonga (90°)', isCorrect: false },
            { id: 'back', emoji: '⬇️', label: 'Ortga (180°)', isCorrect: false },
          ],
        },
      },
      {
        kind: 'line_formation',
        prompt: 'Endi «Chapga buril!» komandasini bajar!',
        options: ['Chap tomonga burilish'],
        correctAnswer: 'Chap tomonga burilish',
        fact: 'Chapga burilishda chap tovon va o‘ng oyoq uchidan foydalaniladi.',
        teacherHint: 'Chapga ko‘rsatayotgan belgini bos!',
        lineData: {
          mode: 'command_pick',
          commandBadge: '📣 Chapga buril!',
          choices: [
            { id: 'left', emoji: '⬅️', label: 'Chap tomonga (90°)', isCorrect: true },
            { id: 'right', emoji: '➡️', label: 'O‘ng tomonga (90°)', isCorrect: false },
            { id: 'up', emoji: '⬆️', label: 'Oldinga yurish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'line_formation',
        prompt: 'Ustoz «Ortga buril!» dedi. Qaysi burilish to‘g‘ri?',
        options: ['Orqaga burilish (180°)'],
        correctAnswer: 'Orqaga burilish (180°)',
        fact: 'Ortga burilishda chap yelka tomondan yarim doira bo‘ylab orqaga qaraladi.',
        teacherHint: '180 daraja orqaga qaratilgan aylanish belgisini tanla!',
        lineData: {
          mode: 'command_pick',
          commandBadge: '📣 Ortga buril!',
          choices: [
            { id: 'around', emoji: '🔄', label: 'Chap yelka orqali ortga (180°)', isCorrect: true },
            { id: 'right', emoji: '➡️', label: 'O‘ngga burilish', isCorrect: false },
            { id: 'left', emoji: '⬅️', label: 'Chapga burilish', isCorrect: false },
          ],
        },
      },
    ],
  },

  // 4-DARS: Safda yurish va ikki qatorga saflanish (line_formation)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'line_formation',
    topicTitle: '4-dars: Safda yurish va ikki qatorga saflanish',
    ruleTitle: '«Qadam bos!» va 1-2 sanab saflanish',
    explanation:
      "Safda yurish doim chap oyoqdan boshlanadi: «Chap-o‘ng, chap-o‘ng!». Ikki qatorga saflanish uchun esa navbatma-navbat «Bir, ikki!» deb sanab, ikkinchilar bir qadam oldinga yoki orqaga chiqadi.",
    formulaOrRule: '🥾 «Qadam bos!» = Chap oyoqdan  |  ✌️ 1-2 sanab ikki qator',
    exampleProblem: 'Safda yurish qaysi oyoqdan boshlanadi?',
    exampleSolution: 'Har doim chap oyoqdan boshlanadi!',
    peRounds: [
      {
        kind: 'line_formation',
        prompt: 'Safda yurish ritmini to‘g‘ri tartibda joylashtir!',
        options: ['Ritm tayyor!'],
        correctAnswer: 'Ritm tayyor!',
        fact: '«Chap-o‘ng» ritmi butun sinfning bir tekis va chiroyli yurishini ta’minlaydi.',
        teacherHint: 'Avval chap oyoq, keyin o‘ng oyoq, oxirida «To‘xta!» komandasi.',
        lineData: {
          mode: 'order_steps',
          steps: [
            { id: 'l', emoji: '🦶1️⃣', label: 'Chap oyoq bilan boshlash' },
            { id: 'r', emoji: '🦶2️⃣', label: 'O‘ng oyoq bilan davom etish' },
            { id: 'stop', emoji: '🛑', label: '«Guruh, to‘xta!» komandasi' },
          ],
        },
      },
      {
        kind: 'line_formation',
        prompt: '«Bir-ikkiga sanab ikki qatorga saflaning!» deganda nima qilinadi?',
        options: ['1 va 2-raqamlar alohida qator tuzadi'],
        correctAnswer: '1 va 2-raqamlar alohida qator tuzadi',
        fact: 'Ikki qatorga saflanish estafeta va mashqlarda joyni tejaydi.',
        teacherHint: 'Juft va toq raqamlar ikkita parallel qator hosil qiladi.',
        lineData: {
          mode: 'command_pick',
          commandBadge: '📣 Ikki qatorga saflan!',
          choices: [
            { id: 'two_rows', emoji: '👥👥', label: '1 va 2-raqamlar ikki qator bo‘ladi', isCorrect: true },
            { id: 'circle', emoji: '⭕', label: 'Bitta katta doira qurish', isCorrect: false },
            { id: 'sit', emoji: '🧘', label: 'Polga o‘tirish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'line_formation',
        prompt: 'Ustoz «Qadam bos!» dedi. Qaysi oyoqdan yurishni boshlaysan?',
        options: ['Chap oyoqdan'],
        correctAnswer: ['Chap oyoqdan'][0],
        fact: 'Barcha saf marshlari chap oyoq zarbi bilan boshlanadi.',
        teacherHint: 'Saf yurishi doim chapdan boshlanadi.',
        lineData: {
          mode: 'command_pick',
          commandBadge: '📣 Qadam bos!',
          choices: [
            { id: 'left_foot', emoji: '🦶⬅️', label: 'Chap oyoqdan boshlash', isCorrect: true },
            { id: 'both', emoji: '🦘', label: 'Ikki oyoqda sakrash', isCorrect: false },
            { id: 'right_foot', emoji: '🦶➡️', label: 'O‘ng oyoqdan boshlash', isCorrect: false },
          ],
        },
      },
    ],
  },

  // 5-DARS: Raqamlar bo'yicha saflanish va diqqat o'yini (number_reaction)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'number_reaction',
    topicTitle: "5-dars: Raqamlar bo'yicha saflanish va diqqat o'yini",
    ruleTitle: 'Raqam signaliga tezkor javob',
    explanation:
      "Bu o‘yinda har bir raqam bitta harakatni bildiradi: 1 — qo‘llar tepaga, 2 — cho‘qqayib o‘tirish, 3 — chapak chalish! Ustoz aytgan raqamni diqqat bilan eshitib, tezda bajaramiz.",
    formulaOrRule: '1️⃣ Qo‘l tepaga · 2️⃣ Cho‘qqayish · 3️⃣ Chapak chalish',
    exampleProblem: 'Ustoz «2!» desa qanday harakat qilamiz?',
    exampleSolution: '2-raqam harakati — tezda cho‘qqayib o‘tiramiz!',
    peRounds: [
      {
        kind: 'number_reaction',
        prompt: 'Ustoz aytgan raqamlarni ketma-ket tezda bos: 1 → 2 → 3!',
        options: ['Reaksiya a’lo!'],
        correctAnswer: 'Reaksiya a’lo!',
        fact: 'Raqamli mashqlar quloq solish diqqatini va tezkor harakatni rivojlantiradi.',
        teacherHint: 'Tepada ko‘rsatilgan navbatdagi raqam tugmasini bosing!',
        reactionData: {
          cues: [
            { targetNumber: 1, label: 'Qo‘l tepaga!', emoji: '🙌', actionText: '1-komanda' },
            { targetNumber: 2, label: 'Cho‘qqay!', emoji: '🧎', actionText: '2-komanda' },
            { targetNumber: 3, label: 'Chapak chal!', emoji: '👏', actionText: '3-komanda' },
          ],
          buttons: [
            { number: 1, label: 'Qo‘l tepaga', emoji: '🙌' },
            { number: 2, label: 'Cho‘qqay', emoji: '🧎' },
            { number: 3, label: 'Chapak', emoji: '👏' },
          ],
        },
      },
      {
        kind: 'number_reaction',
        prompt: 'Aralash komandalar! Navbatdagi signalga qarab tez bos: 3 → 1 → 2!',
        options: ['Reaksiya a’lo!'],
        correctAnswer: 'Reaksiya a’lo!',
        fact: 'Tez javob berish bolalarning fikrlash tezligini oshiradi.',
        teacherHint: 'Diqqat bilan qara: avval 3, keyin 1, keyin 2!',
        reactionData: {
          cues: [
            { targetNumber: 3, label: 'Chapak chal!', emoji: '👏', actionText: 'Signal: 3' },
            { targetNumber: 1, label: 'Qo‘l tepaga!', emoji: '🙌', actionText: 'Signal: 1' },
            { targetNumber: 2, label: 'Cho‘qqay!', emoji: '🧎', actionText: 'Signal: 2' },
          ],
          buttons: [
            { number: 1, label: 'Qo‘l tepaga', emoji: '🙌' },
            { number: 2, label: 'Cho‘qqay', emoji: '🧎' },
            { number: 3, label: 'Chapak', emoji: '👏' },
          ],
        },
      },
      {
        kind: 'number_reaction',
        prompt: '4 ta tezkor sport signali! Hammasi to‘g‘ri bajar: 2 → 4 → 1 → 3!',
        options: ['Reaksiya a’lo!'],
        correctAnswer: 'Reaksiya a’lo!',
        fact: '4 xil komandani adashmay bajarish zo‘r diqqat belgisidir.',
        teacherHint: 'Tepada yonib turgan raqamga mos tugmani bosing.',
        reactionData: {
          cues: [
            { targetNumber: 2, label: 'Cho‘qqay!', emoji: '🧎', actionText: 'Tez!' },
            { targetNumber: 4, label: 'Sakra!', emoji: '🦘', actionText: 'Balandroq!' },
            { targetNumber: 1, label: 'Qo‘l tepaga!', emoji: '🙌', actionText: 'Tik tur!' },
            { targetNumber: 3, label: 'Chapak chal!', emoji: '👏', actionText: 'Oxirgisi!' },
          ],
          buttons: [
            { number: 1, label: 'Qo‘l tepaga', emoji: '🙌' },
            { number: 2, label: 'Cho‘qqay', emoji: '🧎' },
            { number: 3, label: 'Chapak', emoji: '👏' },
            { number: 4, label: 'Sakra', emoji: '🦘' },
          ],
        },
      },
    ],
  },

  // 6-DARS: "Poyezd va tunnellardan o'tish" harakatli o'yini (train_route)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'train_route',
    topicTitle: '6-dars: "Poyezd va tunnellardan o\'tish" harakatli o\'yini',
    ruleTitle: 'Jamoaviy poyezd marshruti',
    explanation:
      "O‘quvchilar bir-birining yelkasidan ushlab «Poyezd» bo‘lib yurishadi! Oldinda yo‘l boshlovchi «Parovoz», orqasida vagonlar. Tunnelga kirganda engashamiz, ko‘prikda esa muvozanat saqlaymiz!",
    formulaOrRule: '🚂 Parovoz oldinda · 🚇 Tunnelda engash · 🏁 Marraga yet',
    exampleProblem: 'Poyezd tunnel ichidan o‘tayotganda qanday yuramiz?',
    exampleSolution: 'Boshimizni egib, cho‘qqayib sekin o‘tamiz!',
    peRounds: [
      {
        kind: 'train_route',
        prompt: 'Poyezdning bekatlarini Startdan Marragacha ketma-ket bosib o‘t!',
        options: ['Marshrut bajarildi!'],
        correctAnswer: 'Marshrut bajarildi!',
        fact: 'Poyezd o‘yinida oldingi do‘stingni turtmasdan masofa saqlash juda muhim.',
        teacherHint: 'Avval Start, keyin Tunnel, so‘ng Ko‘prik va oxiri Marra!',
        trainData: {
          mode: 'build_route',
          stations: [
            { id: 'start', emoji: '🚂', label: 'Start bekati' },
            { id: 'tunnel', emoji: '🚇', label: 'Past tunnel (engash!)' },
            { id: 'bridge', emoji: '🌉', label: 'Tor ko‘prik (muvozanat!)' },
            { id: 'finish', emoji: '🏁', label: 'Marra bekati' },
          ],
        },
      },
      {
        kind: 'train_route',
        prompt: 'Poyezd oldida pastak tunnel chiqdi! Qanday o‘tamiz?',
        options: ['Boshni egib cho‘qqayib o‘tish'],
        correctAnswer: 'Boshni egib cho‘qqayib o‘tish',
        fact: 'Past tunneldan egilib o‘tish bel va tizza mushaklarini chiniqtiradi.',
        teacherHint: 'Tunnel past — bosh urilmasligi uchun egilish kerak!',
        trainData: {
          mode: 'steer_obstacle',
          stations: [
            { id: 'train', emoji: '🚂', label: 'Poyezd' },
            { id: 'obs', emoji: '🚇', label: 'Past tunnel' },
          ],
          choices: [
            { id: 'duck', emoji: '🙇‍♂️🚇', label: 'Boshni egib cho‘qqayib o‘tish', isCorrect: true },
            { id: 'jump', emoji: '🦘', label: 'Yuqoriga baland sakrash', isCorrect: false },
            { id: 'stop', emoji: '🛑', label: 'Butunlay to‘xtab qolish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'train_route',
        prompt: 'Tepalik va daryo yo‘li! Poyezdni xavfsiz yo‘nalishda yurdir!',
        options: ['Marshrut bajarildi!'],
        correctAnswer: 'Marshrut bajarildi!',
        fact: 'Jamoa bo‘lib bir ritmda yurish do‘stlik va hamjihatlikni kuchaytiradi.',
        teacherHint: 'Bekatlarni boshidan oxirigacha tartib bilan bos.',
        trainData: {
          mode: 'build_route',
          stations: [
            { id: 's1', emoji: '🚉', label: 'Vokzal' },
            { id: 's2', emoji: '⛰️', label: 'Qiyalik yo‘l' },
            { id: 's3', emoji: '🚇', label: 'Tog‘ tunneli' },
            { id: 's4', emoji: '🏆', label: 'G‘alaba bekati' },
          ],
        },
      },
    ],
  },

  // 7-DARS: Ertalabki badantarbiya: bosh va yelka mashqlari (warmup_rhythm)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'warmup_rhythm',
    topicTitle: '7-dars: Ertalabki badantarbiya: bosh va yelka mashqlari',
    ruleTitle: 'Chigil yozdi mashqlar yuqoridan boshlanadi',
    explanation:
      "Ertalabki badantarbiya doimo tepadan — bosh va bo‘yinni sekin egishdan boshlanadi, so‘ng yelkalar aylantiriladi. Tez va keskin harakat qilmaslik kerak!",
    formulaOrRule: '1️⃣ Boshni egish · 2️⃣ Boshni burish · 3️⃣ Yelkani aylantirish',
    exampleProblem: 'Badantarbiyani qaysi tana qismidan boshlaymiz?',
    exampleSolution: 'Avval bosh va bo‘yinni sekin qizdirishdan boshlaymiz!',
    peRounds: [
      {
        kind: 'warmup_rhythm',
        prompt: 'Bosh va yelka mashqlarini tartib bilan bajar: 1 → 2 → 3!',
        options: ['Badantarbiya bajarildi!'],
        correctAnswer: 'Badantarbiya bajarildi!',
        fact: 'Bo‘yin va yelka mashqlari dars paytida bukchaymaslikka yordam beradi.',
        teacherHint: 'Avval boshni oldinga-orqaga, keyin o‘ng-chapga, oxirida yelkalarni aylantir.',
        warmupData: {
          mode: 'sequence',
          poses: [
            { id: 'head_nod', emoji: '🙇', label: 'Boshni oldinga-orqaga egish', countCue: '1-2' },
            { id: 'head_turn', emoji: '👀', label: 'Boshni o‘ng va chapga burish', countCue: '3-4' },
            { id: 'shoulder', emoji: '💪', label: 'Yelkalarni oldinga aylantirish', countCue: '5-6' },
          ],
        },
      },
      {
        kind: 'warmup_rhythm',
        prompt: 'Ritmli sanoq! Mashq tugmasini ritmga mos 4 marta bos: 1-2-3-4!',
        options: ['Ritm zo‘r!'],
        correctAnswer: 'Ritm zo‘r!',
        fact: 'Sanoq ostida bajarilgan badantarbiya nafasni bir maromga soladi.',
        teacherHint: '«Mashqni bajar!» tugmasini ritm bilan 4 marta bos.',
        warmupData: {
          mode: 'rhythm_tap',
          targetTaps: 4,
          poses: [
            { id: 'p1', emoji: '🙆', label: 'Yelkalarni ko‘tarish', countCue: 'Bir!' },
            { id: 'p2', emoji: '🤷', label: 'Yelkalarni tushirish', countCue: 'Ikki!' },
            { id: 'p3', emoji: '🙆', label: 'Oldinga aylantirish', countCue: 'Uch!' },
            { id: 'p4', emoji: '🧍', label: 'Tik turish', countCue: 'To‘rt!' },
          ],
        },
      },
      {
        kind: 'warmup_rhythm',
        prompt: 'Ertalabki quvnoq mashq zanjirini yakunla!',
        options: ['Badantarbiya bajarildi!'],
        correctAnswer: 'Badantarbiya bajarildi!',
        fact: 'Har kuni ertalab 10 daqiqa badantarbiya qilish kun bo‘yi tetiklik beradi.',
        teacherHint: 'Ketma-ket 3 ta mashq kartasini bos.',
        warmupData: {
          mode: 'sequence',
          poses: [
            { id: 'w1', emoji: '🦒', label: 'Bo‘yinni cho‘zish', countCue: '1-2' },
            { id: 'w2', emoji: '🦋', label: 'Yelka qanotchalari', countCue: '3-4' },
            { id: 'w3', emoji: '🌬️', label: 'Chuqur nafas olish', countCue: '5-6' },
          ],
        },
      },
    ],
  },

  // 8-DARS: Qo'l, gavda va egilish mashqlari (warmup_rhythm)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'warmup_rhythm',
    topicTitle: "8-dars: Qo'l, gavda va egilish mashqlari",
    ruleTitle: 'Gavdani egish va qo‘llarni chiniqtirish',
    explanation:
      "Qo‘llarni yon tomonga yoyib, belni o‘ngga-chapga va oldinga egamiz. Egilganda tizzalarni bukmaslikka harakat qilamiz — bu umurtqa pog‘onasini mustahkamlaydi!",
    formulaOrRule: '🙌 Qo‘l tepaga · 🤸 Yonboshga egilish · 🙇 Oldinga egilish',
    exampleProblem: 'Oldinga egilish mashqini qilayotganda tizzalar qanday turishi kerak?',
    exampleSolution: 'Tizzalar bukilmasdan tekis turishi kerak!',
    peRounds: [
      {
        kind: 'warmup_rhythm',
        prompt: 'Qo‘l va gavda mashqlarini ketma-ket bajar!',
        options: ['Mashq bajarildi!'],
        correctAnswer: 'Mashq bajarildi!',
        fact: 'Gavdani yonboshga egish bel mushaklarini egiluvchan qiladi.',
        teacherHint: 'Avval qo‘lni tepaga cho‘z, keyin yonboshga egil, oxirida oldinga egil.',
        warmupData: {
          mode: 'sequence',
          poses: [
            { id: 'arms', emoji: '🙌', label: 'Qo‘llarni tepaga cho‘zish', countCue: '1-2' },
            { id: 'side', emoji: '🤸', label: 'O‘ng va chapga egilish', countCue: '3-4' },
            { id: 'forward', emoji: '🙇', label: 'Oldinga egilish (tizza tekis)', countCue: '5-6' },
          ],
        },
      },
      {
        kind: 'warmup_rhythm',
        prompt: 'Qo‘llar tegirmoni! Ritm tugmasini 4 marta bosib mashqni bajar!',
        options: ['Ritm zo‘r!'],
        correctAnswer: 'Ritm zo‘r!',
        fact: '«Tegirmon» mashqi qo‘l va yelka bo‘g‘imlarini qizdiradi.',
        teacherHint: 'Har bir sanoqqa tugmani bosing!',
        warmupData: {
          mode: 'rhythm_tap',
          targetTaps: 4,
          poses: [
            { id: 'm1', emoji: '🔄', label: 'O‘ng qo‘l oldinga', countCue: 'Bir!' },
            { id: 'm2', emoji: '🔁', label: 'Chap qo‘l oldinga', countCue: 'Ikki!' },
            { id: 'm3', emoji: '🙆', label: 'Ikkala qo‘l tepaga', countCue: 'Uch!' },
            { id: 'm4', emoji: '🧍', label: 'Tinch nafas chiqarish', countCue: 'To‘rt!' },
          ],
        },
      },
      {
        kind: 'warmup_rhythm',
        prompt: 'Gavdani burish va cho‘zish mashqini yakunla!',
        options: ['Mashq bajarildi!'],
        correctAnswer: 'Mashq bajarildi!',
        fact: 'Qo‘llarni qulf qilib tepaga cho‘zish bo‘y o‘sishiga yordam beradi!',
        teacherHint: 'Uchta bosqichni tartib bilan bos.',
        warmupData: {
          mode: 'sequence',
          poses: [
            { id: 'g1', emoji: '👐', label: 'Qo‘llarni yonga yoyish', countCue: '1' },
            { id: 'g2', emoji: '↪️', label: 'Gavdani o‘ngga burish', countCue: '2' },
            { id: 'g3', emoji: '↩️', label: 'Gavdani chapga burish', countCue: '3' },
          ],
        },
      },
    ],
  },

  // 9-DARS: Umumrivojlantiruvchi mashqlar majmuasi (warmup_rhythm)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'warmup_rhythm',
    topicTitle: '9-dars: Umumrivojlantiruvchi mashqlar majmuasi',
    ruleTitle: 'Boshdan oyoqqacha to‘liq majmua',
    explanation:
      "Umumrivojlantiruvchi mashqlar majmuasi barcha mushaklarni uyg‘otadi: avval bosh va qo‘llar, so‘ng gavda, keyin esa o‘tirib-turish va yengil sakrashlar bilan yakunlanadi!",
    formulaOrRule: '🙆 Bosh/Qo‘l → 🤸 Gavda → 🦵 Oyoq/Sakrash',
    exampleProblem: 'Nima uchun oyoq va sakrash mashqlari oxirida qilinadi?',
    exampleSolution: 'Tana yuqoridan pastga qarab asta-sekin qizdirib boriladi!',
    peRounds: [
      {
        kind: 'warmup_rhythm',
        prompt: 'To‘liq badantarbiya majmuasini tepadan pastga qarab bajar!',
        options: ['Majmua tayyor!'],
        correctAnswer: 'Majmua tayyor!',
        fact: 'To‘g‘ri ketma-ketlik yurak va mushaklarni zo‘riqtirmasdan qizdiradi.',
        teacherHint: 'Bosh → Gavda → O‘tirib-turish tartibini bos.',
        warmupData: {
          mode: 'sequence',
          poses: [
            { id: 'top', emoji: '🙆', label: 'Bosh va qo‘llar', countCue: '1-bosqich' },
            { id: 'mid', emoji: '🤸', label: 'Gavda egilishi', countCue: '2-bosqich' },
            { id: 'leg', emoji: '🦵', label: 'O‘tirib-turish', countCue: '3-bosqich' },
          ],
        },
      },
      {
        kind: 'warmup_rhythm',
        prompt: 'O‘tirib-turish va sakrash ritmi! 4 ta sanoqni bos!',
        options: ['Ritm zo‘r!'],
        correctAnswer: 'Ritm zo‘r!',
        fact: 'O‘tirib-turish oyoq mushaklarini baquvvat qiladi.',
        teacherHint: 'Sanoq ritmiga mos 4 marta bos.',
        warmupData: {
          mode: 'rhythm_tap',
          targetTaps: 4,
          poses: [
            { id: 'q1', emoji: '🧎', label: 'Cho‘qqayish', countCue: 'Bir!' },
            { id: 'q2', emoji: '🧍', label: 'Turish', countCue: 'Ikki!' },
            { id: 'q3', emoji: '⭐', label: 'Yulduzcha sakrash', countCue: 'Uch!' },
            { id: 'q4', emoji: '🌬️', label: 'Nafas rostlash', countCue: 'To‘rt!' },
          ],
        },
      },
      {
        kind: 'warmup_rhythm',
        prompt: 'Sovutish mashqini yakunla — nafasni tinchlantir!',
        options: ['Majmua tayyor!'],
        correctAnswer: 'Majmua tayyor!',
        fact: 'Har qanday faol mashqdan so‘ng chuqur nafas olib yurish tanani dam oldiradi.',
        teacherHint: 'Yurish, qo‘l ko‘tarish va chuqur nafas chiqarishni tanla.',
        warmupData: {
          mode: 'sequence',
          poses: [
            { id: 'c1', emoji: '🚶', label: 'Joyida sekin yurish', countCue: '1' },
            { id: 'c2', emoji: '🌬️', label: 'Qo‘lni ko‘tarib nafas olish', countCue: '2' },
            { id: 'c3', emoji: '😌', label: 'Nafasni sekin chiqarish', countCue: '3' },
          ],
        },
      },
    ],
  },

  // 10-DARS: Yo'nalishlarni o'zgartirib poyezd bo'lib yurish (train_route)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'train_route',
    topicTitle: "10-dars: Yo'nalishlarni o'zgartirib poyezd bo'lib yurish",
    ruleTitle: 'Ilonizi va burilish marshrutlari',
    explanation:
      "Bu darsda poyezd to‘g‘ri yo‘ldan tashqari «ilonizi» (zigzag) bo‘lib, o‘ngga va chapga burilib yuradi! Har bir vagon oldingi do‘stining izidan borishi kerak.",
    formulaOrRule: '🐍 Ilonizi yurish · ➡️ O‘ngga burilish · ⬅️ Chapga burilish',
    exampleProblem: 'Poyezd oldida to‘siq chiqsa qanday aylanib o‘tamiz?',
    exampleSolution: 'Oldingi parovoz yo‘nalishni o‘zgartiradi, vagonlar uning izidan ilonizi bo‘lib o‘tadi!',
    peRounds: [
      {
        kind: 'train_route',
        prompt: 'Poyezdning zigzag yo‘lini boshidan oxirigacha bosib o‘t!',
        options: ['Marshrut bajarildi!'],
        correctAnswer: 'Marshrut bajarildi!',
        fact: 'Ilonizi yurish fazoda mo‘ljal olish qobiliyatini o‘stiradi.',
        teacherHint: 'Yo‘nalish bekatlarini 1-dan 4-gacha ketma-ket bos.',
        trainData: {
          mode: 'build_route',
          stations: [
            { id: 't1', emoji: '🚂', label: 'To‘g‘ri yo‘l' },
            { id: 't2', emoji: '↪️', label: 'O‘ngga burilish' },
            { id: 't3', emoji: '↩️', label: 'Chapga burilish' },
            { id: 't4', emoji: '🏁', label: 'Bekatga yetish' },
          ],
        },
      },
      {
        kind: 'train_route',
        prompt: 'Yo‘lda ustunchalar (konuslar) turibdi! Poyezdni qanday boshqaramiz?',
        options: ['Konuslar orasidan ilonizi o‘tish'],
        correctAnswer: 'Konuslar orasidan ilonizi o‘tish',
        fact: 'Konuslarni yiqitmay aylanib o‘tish epchillikni talab qiladi.',
        teacherHint: 'To‘siqqa urilmaslik uchun zigzag (ilonizi) harakatni tanla!',
        trainData: {
          mode: 'steer_obstacle',
          stations: [
            { id: 'p', emoji: '🚂', label: 'Poyezd' },
            { id: 'c', emoji: '🚧', label: 'Konus to‘siqlar' },
          ],
          choices: [
            { id: 'zig', emoji: '🐍🚂', label: 'Konuslar orasidan ilonizi o‘tish', isCorrect: true },
            { id: 'hit', emoji: '💥', label: 'Konuslarni turtib yiqitish', isCorrect: false },
            { id: 'back', emoji: '🔙', label: 'Orqaga qaytib ketish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'train_route',
        prompt: 'Katta doira va marra! Poyezd yo‘lini tugalla!',
        options: ['Marshrut bajarildi!'],
        correctAnswer: 'Marshrut bajarildi!',
        fact: 'Barcha vagonlar safni buzmay yetib kelsa, jamoa g‘olib bo‘ladi.',
        teacherHint: 'Bekatlarni ketma-ket bosib poyezdni marraga olib kel.',
        trainData: {
          mode: 'build_route',
          stations: [
            { id: 'z1', emoji: '🚂', label: 'Start' },
            { id: 'z2', emoji: '🔄', label: 'Aylana yo‘l' },
            { id: 'z3', emoji: '🌲', label: 'O‘rmon yo‘lagi' },
            { id: 'z4', emoji: '🏆', label: 'G‘alaba bekati' },
          ],
        },
      },
    ],
  },

  // 11-DARS: Signal va raqamga tezkor reaksiya (number_reaction)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'number_reaction',
    topicTitle: '11-dars: Signal va raqamga tezkor reaksiya',
    ruleTitle: 'Hushtak va raqamga chaqmoqdek javob',
    explanation:
      "Sportchida nafaqat kuch, balki tez reaksiya ham bo‘lishi kerak! Signal chalinganda darhol kerakli harakatni bajarish yugurish va o‘yinlarda g‘alaba keltiradi.",
    formulaOrRule: '⚡ Eshit → 🎯 Aniqlashtir → 🏃 Tez bajar!',
    exampleProblem: 'Yashil bayroqcha ko‘tarilsa nima qilamiz?',
    exampleSolution: 'Darhol yugurishni boshlaymiz!',
    peRounds: [
      {
        kind: 'number_reaction',
        prompt: 'Raqamli signallarga tez javob ber: 1 → 3 → 2!',
        options: ['Reaksiya a’lo!'],
        correctAnswer: 'Reaksiya a’lo!',
        fact: 'Tez reaksiya yo‘l harakati va sport o‘yinlarida juda foydali.',
        teacherHint: 'Yuqoridagi signal raqamini ko‘rib, mos tugmani bos.',
        reactionData: {
          cues: [
            { targetNumber: 1, label: 'Yugur!', emoji: '🏃', actionText: '1-signal' },
            { targetNumber: 3, label: 'Sakra!', emoji: '🦘', actionText: '3-signal' },
            { targetNumber: 2, label: 'To‘xta!', emoji: '🛑', actionText: '2-signal' },
          ],
          buttons: [
            { number: 1, label: 'Yugur', emoji: '🏃' },
            { number: 2, label: 'To‘xta', emoji: '🛑' },
            { number: 3, label: 'Sakra', emoji: '🦘' },
          ],
        },
      },
      {
        kind: 'number_reaction',
        prompt: 'Chalg‘ituvchi komandalar! Faqat raqamga qara: 2 → 1 → 3 → 2!',
        options: ['Reaksiya a’lo!'],
        correctAnswer: 'Reaksiya a’lo!',
        fact: 'Ko‘z va qo‘lning birgalikda tez ishlashi chaqqonlik belgisidir.',
        teacherHint: 'Ketma-ket 4 ta raqamni xato qilmay bos.',
        reactionData: {
          cues: [
            { targetNumber: 2, label: 'To‘xta!', emoji: '🛑', actionText: 'Signal: 2' },
            { targetNumber: 1, label: 'Yugur!', emoji: '🏃', actionText: 'Signal: 1' },
            { targetNumber: 3, label: 'Sakra!', emoji: '🦘', actionText: 'Signal: 3' },
            { targetNumber: 2, label: 'To‘xta!', emoji: '🛑', actionText: 'Oxirgi: 2' },
          ],
          buttons: [
            { number: 1, label: 'Yugur', emoji: '🏃' },
            { number: 2, label: 'To‘xta', emoji: '🛑' },
            { number: 3, label: 'Sakra', emoji: '🦘' },
          ],
        },
      },
      {
        kind: 'number_reaction',
        prompt: '4 ta sport harakati signali: 4 → 2 → 3 → 1!',
        options: ['Reaksiya a’lo!'],
        correctAnswer: 'Reaksiya a’lo!',
        fact: 'Sport zalida har bir signalga hushyor bo‘lish jamoaga g‘alaba olib keladi.',
        teacherHint: '4 ta tugma orasidan aynan so‘ralgan raqamni tanla.',
        reactionData: {
          cues: [
            { targetNumber: 4, label: 'Buril!', emoji: '🔄', actionText: '4-signal' },
            { targetNumber: 2, label: 'To‘xta!', emoji: '🛑', actionText: '2-signal' },
            { targetNumber: 3, label: 'Sakra!', emoji: '🦘', actionText: '3-signal' },
            { targetNumber: 1, label: 'Yugur!', emoji: '🏃', actionText: '1-signal' },
          ],
          buttons: [
            { number: 1, label: 'Yugur', emoji: '🏃' },
            { number: 2, label: 'To‘xta', emoji: '🛑' },
            { number: 3, label: 'Sakra', emoji: '🦘' },
            { number: 4, label: 'Buril', emoji: '🔄' },
          ],
        },
      },
    ],
  },

  // 12-DARS: Oddiy yugurish va estafeta tayoqchasini uzatish (relay_race)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'relay_race',
    topicTitle: '12-dars: Oddiy yugurish va estafeta tayoqchasini uzatish',
    ruleTitle: 'To‘g‘ri yugurish va estafeta uzatish',
    explanation:
      "Yugurayotganda qo‘llar tirsakdan bukilib oldinga-orqaga ishlaydi, oyoq uchiga yengil tushamiz. Estafeta tayoqchasini do‘stimizning ochiq kaftiga tushirmay uzatamiz!",
    formulaOrRule: '🏃 Oyoq uchida yengil yugur  |  🥢 Tayoqchani qo‘lga uzat',
    exampleProblem: 'Estafeta tayoqchasini do‘stimizga qanday beramiz?',
    exampleSolution: 'Tashlab yubormasdan, to‘g‘ri qo‘liga uzatib beramiz!',
    peRounds: [
      {
        kind: 'relay_race',
        prompt: 'Chap va o‘ng oyoq tugmalarini navbatma-navbat bosib marraga yugur!',
        options: ['Estafeta bajarildi!'],
        correctAnswer: 'Estafeta bajarildi!',
        fact: 'Yugurishda qo‘l va oyoqning navbatma-navbat ishlashi tezlikni oshiradi.',
        teacherHint: 'Tezroq yugurish uchun «Chap» va «O‘ng» tugmalarini galma-gal bosing!',
        relayData: {
          mode: 'baton_pass',
          runnerEmoji: '🏃',
          itemEmoji: '🥢',
          itemLabel: 'Estafeta tayoqchasi',
          targetSteps: 6,
        },
      },
      {
        kind: 'relay_race',
        prompt: 'Ikkinchi bosqich! Tayoqchani do‘stingga yetkazib ber!',
        options: ['Estafeta bajarildi!'],
        correctAnswer: 'Estafeta bajarildi!',
        fact: 'Estafetada har bir o‘quvchi jamoaning umumiy natijasi uchun harakat qiladi.',
        teacherHint: 'Qadamlarni tez-tez bosib, oxirida tayoqchani uzat!',
        relayData: {
          mode: 'baton_pass',
          runnerEmoji: '🏃‍♀️',
          itemEmoji: '🥢',
          itemLabel: 'Oltin tayoqcha',
          targetSteps: 7,
        },
      },
      {
        kind: 'relay_race',
        prompt: 'Hal qiluvchi finish! Marraga birinchi bo‘lib yetib bor!',
        options: ['Estafeta bajarildi!'],
        correctAnswer: 'Estafeta bajarildi!',
        fact: 'Finish chizig‘idan to‘xtamasdan, tezlikni saqlab o‘tish kerak.',
        teacherHint: 'Yugurish tugmalarini faol bosib chiziqni kesib o‘t!',
        relayData: {
          mode: 'baton_pass',
          runnerEmoji: '🏃‍♂️',
          itemEmoji: '🏁',
          itemLabel: 'Marra lentasi',
          targetSteps: 8,
        },
      },
    ],
  },

  // 13-DARS: Kichik to'pni nishonga uloqtirish (ball_throw)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'ball_throw',
    topicTitle: "13-dars: Kichik to'pni nishonga uloqtirish",
    ruleTitle: 'Mo‘ljal olish va aniq otish',
    explanation:
      "Kichik to‘pni uloqtirishda chap oyoqni bir qadam oldinga qo‘yib, o‘ng qo‘lni yelka tepasidan orqaga tortamiz va ko‘z bilan nishonni mo‘ljallab otamiz!",
    formulaOrRule: '👀 Nishonga qara → 🎯 Mo‘ljalga ol → ⚾ Aniq ot!',
    exampleProblem: 'To‘pni otishdan oldin qaysi oyoqni oldinga qo‘yamiz?',
    exampleSolution: 'O‘ng qo‘l bilan otganda chap oyoqni oldinga qo‘yamiz!',
    peRounds: [
      {
        kind: 'ball_throw',
        prompt: 'Harakatlanuvchi mo‘ljal nishon markaziga kelganda «OTISH!» tugmasini bos!',
        options: ['Nishonga tegdi!'],
        correctAnswer: 'Nishonga tegdi!',
        fact: 'Ko‘z va qo‘l uyg‘unligi nishonga aniq tegishning eng katta siridir.',
        teacherHint: 'Nishon chizig‘i yashil markazga kelgan lahzani kut va bos!',
        throwData: {
          mode: 'aim_timing',
          targetLabel: 'Sport nishoni',
          targetEmoji: '🎯',
          ballEmoji: '🎾',
        },
      },
      {
        kind: 'ball_throw',
        prompt: 'To‘pni kegli (shashka ustuncha)ga qanday balandlikda otish kerak?',
        options: ['To‘g‘ri ko‘krak balandligida'],
        correctAnswer: 'To‘g‘ri ko‘krak balandligida',
        fact: 'Juda balandga otilsa to‘p keglining ustidan o‘tib ketadi.',
        teacherHint: 'Keglilar yerda turibdi — to‘g‘ri o‘rta yo‘nalishni tanla!',
        throwData: {
          mode: 'angle_pick',
          targetLabel: 'Kegli ustunchalar',
          targetEmoji: '🎳',
          ballEmoji: '⚾',
          choices: [
            { id: 'mid', emoji: '➡️🎳', label: 'To‘g‘ri o‘rta yo‘nalishda', isCorrect: true },
            { id: 'sky', emoji: '🚀☁️', label: 'Shiftga qarab balandga', isCorrect: false },
            { id: 'back', emoji: '↩️', label: 'Orqa tomonga', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ball_throw',
        prompt: 'Endi halqaga to‘p tushir! Mo‘ljal markazga kelganda ot!',
        options: ['Nishonga tegdi!'],
        correctAnswer: 'Nishonga tegdi!',
        fact: 'Kichik to‘pni uloqtirish qo‘l va yelka kuchini oshiradi.',
        teacherHint: 'Markaziy yashil zonada «OTISH!» tugmasini bos!',
        throwData: {
          mode: 'aim_timing',
          targetLabel: 'Nishon doirasi',
          targetEmoji: '⭕',
          ballEmoji: '⚾',
        },
      },
    ],
  },

  // 14-DARS: "Quvlashmachoq" va chaqqonlik o'yini (tag_chase)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'tag_chase',
    topicTitle: '14-dars: "Quvlashmachoq" va chaqqonlik o\'yini',
    ruleTitle: 'Chaqqon qochish va xavfsiz zona',
    explanation:
      "Quvlashmachoq o‘yinida bir-birini turtmasdan, tezkor burilishlar bilan tutuvchidan qochish kerak. Xavfsiz uyga (finishga) yetib olgan o‘quvchi tutilmaydi!",
    formulaOrRule: '🏃 Tez buril · 🛡️ Turtmasdan qoch · 🏠 Xavfsiz uyga yet',
    exampleProblem: 'Quvlashmachoqda do‘stingni itarib yuborish mumkinmi?',
    exampleSolution: 'Yo‘q! Hech qachon itarish mumkin emas, faqat qo‘l bilan yengil tegiladi!',
    peRounds: [
      {
        kind: 'tag_chase',
        prompt: 'Tutuvchiga tutilmay yashil kataklarni bosib Xavfsiz uyga yetib ol!',
        options: ['Xavfsiz uyga yetdim!'],
        correctAnswer: 'Xavfsiz uyga yetdim!',
        fact: 'Keskin yo‘nalish o‘zgartirish quvlashmachoqda eng zo‘r usuldir.',
        teacherHint: 'Qizil tutuvchi katagidan uzoqroq yashil kataklarni bosib oldinga yur!',
        tagData: {
          mode: 'escape_grid',
          targetSteps: 4,
          chaserEmoji: '🦊',
          chaserLabel: 'Tutuvchi',
          goalEmoji: '🏠',
          goalLabel: 'Xavfsiz uy',
        },
      },
      {
        kind: 'tag_chase',
        prompt: '2-bosqich: «Bo‘ri va quyonlar»! Chaqmoqdek qochib bayroqchaga yet!',
        options: ['Xavfsiz uyga yetdim!'],
        correctAnswer: 'Xavfsiz uyga yetdim!',
        fact: 'Yugurish paytida atrofga qarab borish to‘qnashuvning oldini oladi.',
        teacherHint: 'Xavfsiz yashil yo‘lakchalarni tanlab oldinga silji.',
        tagData: {
          mode: 'escape_grid',
          targetSteps: 5,
          chaserEmoji: '🐺',
          chaserLabel: 'Bo‘ri',
          goalEmoji: '🚩',
          goalLabel: 'Quyonlar uyi',
        },
      },
      {
        kind: 'tag_chase',
        prompt: 'Chempion qochishi! Oxirgi bosqichda tutuvchidan chaqqonroq bo‘l!',
        options: ['Xavfsiz uyga yetdim!'],
        correctAnswer: 'Xavfsiz uyga yetdim!',
        fact: 'Chaqqonlik mashqlari barcha sport turlari uchun poydevordir.',
        teacherHint: 'Faqat xavfsiz yo‘l kataklarini bos!',
        tagData: {
          mode: 'escape_grid',
          targetSteps: 5,
          chaserEmoji: '🏃‍♂️',
          chaserLabel: 'Tutuvchi',
          goalEmoji: '🏆',
          goalLabel: 'G‘alaba uyi',
        },
      },
    ],
  },

  // 15-DARS: "To'pga tegma" chaqqon harakat o'yini (tag_chase)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'tag_chase',
    topicTitle: '15-dars: "To\'pga tegma" chaqqon harakat o\'yini',
    ruleTitle: 'To‘pdan chaqqonlik bilan chap berish',
    explanation:
      "«To‘pga tegma» o‘yinida o‘yinchilar maydon markazida turib, dumalab yoki uchib kelayotgan yumshoq to‘pdan sakrab yoki yon tomonga chaqqon siljib qochishadi!",
    formulaOrRule: '⚽ To‘pni kuzat · 💨 Yon tomonga silji · 🦘 Yoki sakrab o‘t',
    exampleProblem: 'Oyoq tomon yumshoq to‘p dumalab kelsa nima qilamiz?',
    exampleSolution: 'O‘z vaqtida yuqoriga sakraymiz yoki yon tomonga siljiymiz!',
    peRounds: [
      {
        kind: 'tag_chase',
        prompt: 'To‘plar uchib kelayotgan yo‘ldan xavfsiz qatorga sakrab o‘t!',
        options: ['To‘pga tegmadim!'],
        correctAnswer: 'To‘pga tegmadim!',
        fact: 'Diqqat bilan kuzatib chap berish ko‘z o‘tkirligini oshiradi.',
        teacherHint: 'To‘p turmagan bo‘sh yashil yo‘lakka bosib xavfsiz o‘t!',
        tagData: {
          mode: 'dodge_ball',
          targetSteps: 4,
          chaserEmoji: '⚽',
          chaserLabel: 'Uchayotgan to‘p',
          goalEmoji: '🛡️',
          goalLabel: 'Xavfsiz zona',
        },
      },
      {
        kind: 'tag_chase',
        prompt: 'Tezlik oshdi! To‘pdan chap berib 5 qadam xavfsiz yur!',
        options: ['To‘pga tegmadim!'],
        correctAnswer: 'To‘pga tegmadim!',
        fact: 'Yumshoq to‘p bilan o‘ynash ham qiziqarli, ham xavfsiz.',
        teacherHint: 'Qizil to‘p chizig‘iga bosma, yashil bo‘sh katakni tanla!',
        tagData: {
          mode: 'dodge_ball',
          targetSteps: 5,
          chaserEmoji: '🏀',
          chaserLabel: 'Katta to‘p',
          goalEmoji: '🏁',
          goalLabel: 'Marra',
        },
      },
      {
        kind: 'tag_chase',
        prompt: 'Super chaqqonlik sinovi! Oxirgi marta to‘plardan qoch!',
        options: ['To‘pga tegmadim!'],
        correctAnswer: 'To‘pga tegmadim!',
        fact: 'Bu o‘yin jamoaviy hushyorlik va chaqqonlikni tarbiyalaydi.',
        teacherHint: 'Yashil yo‘laklar orqali marra bayrog‘iga yet!',
        tagData: {
          mode: 'dodge_ball',
          targetSteps: 5,
          chaserEmoji: '⚽',
          chaserLabel: 'Tezkor to‘p',
          goalEmoji: '🏆',
          goalLabel: 'Chempion!',
        },
      },
    ],
  },

  // 16-DARS: 1-yarim yillik sinovi: raqamli komandalar (number_reaction)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'number_reaction',
    topicTitle: '16-dars: 1-yarim yillik sinovi: raqamli komandalar',
    ruleTitle: '1-yarim yillikda o‘rgangan barcha komandalar',
    explanation:
      "Tabriklaymiz, 1-yarim yillik yakuniga yetdik! Endi barcha saf komandalari, burilishlar va harakatli o‘yin signallarini adashmasdan tezda bajarib ko‘rsatamiz!",
    formulaOrRule: '1️⃣ Tekislan · 2️⃣ Rostlan · 3️⃣ O‘ngga · 4️⃣ Qadam bos!',
    exampleProblem: 'Yarim yillik sinovida g‘olib bo‘lish uchun nima kerak?',
    exampleSolution: 'Diqqatli bo‘lish va komandalarni xatosiz tez bajarish!',
    peRounds: [
      {
        kind: 'number_reaction',
        prompt: '1-sinov: Saf komandalarini tezda bajar: 1 → 2 → 3 → 4!',
        options: ['Sinovdan o‘tdim!'],
        correctAnswer: 'Sinovdan o‘tdim!',
        fact: 'Saf komandalarini bilish har bir sportchining asosiy ko‘nikmasidir.',
        teacherHint: 'Tepadagi komanda raqamiga qarab mos tugmani bos!',
        reactionData: {
          cues: [
            { targetNumber: 1, label: 'Tekislan!', emoji: '👀', actionText: '1-komanda' },
            { targetNumber: 2, label: 'Rostlan!', emoji: '🧍', actionText: '2-komanda' },
            { targetNumber: 3, label: 'O‘ngga!', emoji: '➡️', actionText: '3-komanda' },
            { targetNumber: 4, label: 'Qadam bos!', emoji: '🥾', actionText: '4-komanda' },
          ],
          buttons: [
            { number: 1, label: 'Tekislan', emoji: '👀' },
            { number: 2, label: 'Rostlan', emoji: '🧍' },
            { number: 3, label: 'O‘ngga', emoji: '➡️' },
            { number: 4, label: 'Qadam bos', emoji: '🥾' },
          ],
        },
      },
      {
        kind: 'number_reaction',
        prompt: '2-sinov: Teskari tartib va burilishlar: 4 → 2 → 1 → 3!',
        options: ['Sinovdan o‘tdim!'],
        correctAnswer: 'Sinovdan o‘tdim!',
        fact: 'Chalg‘itadigan tartibda ham to‘g‘ri ishlash a’lo bahoga loyiq!',
        teacherHint: 'Raqamlarni diqqat bilan o‘qi: 4, 2, 1, 3!',
        reactionData: {
          cues: [
            { targetNumber: 4, label: 'Qadam bos!', emoji: '🥾', actionText: 'Signal: 4' },
            { targetNumber: 2, label: 'Rostlan!', emoji: '🧍', actionText: 'Signal: 2' },
            { targetNumber: 1, label: 'Tekislan!', emoji: '👀', actionText: 'Signal: 1' },
            { targetNumber: 3, label: 'O‘ngga!', emoji: '➡️', actionText: 'Signal: 3' },
          ],
          buttons: [
            { number: 1, label: 'Tekislan', emoji: '👀' },
            { number: 2, label: 'Rostlan', emoji: '🧍' },
            { number: 3, label: 'O‘ngga', emoji: '➡️' },
            { number: 4, label: 'Qadam bos', emoji: '🥾' },
          ],
        },
      },
      {
        kind: 'number_reaction',
        prompt: 'Yakuniy chorak finallari: 3 → 1 → 4 → 2!',
        options: ['Sinovdan o‘tdim!'],
        correctAnswer: 'Sinovdan o‘tdim!',
        fact: 'Sen 1-yarim yillikning barcha jismoniy tarbiya ko‘nikmalarini egallading!',
        teacherHint: 'Oxirgi 4 ta signalni chaqqonlik bilan bajar!',
        reactionData: {
          cues: [
            { targetNumber: 3, label: 'Chapga!', emoji: '⬅️', actionText: 'Signal: 3' },
            { targetNumber: 1, label: 'Sakra!', emoji: '🦘', actionText: 'Signal: 1' },
            { targetNumber: 4, label: 'Yugur!', emoji: '🏃', actionText: 'Signal: 4' },
            { targetNumber: 2, label: 'Rostlan!', emoji: '🧍', actionText: 'Finish!' },
          ],
          buttons: [
            { number: 1, label: 'Sakra', emoji: '🦘' },
            { number: 2, label: 'Rostlan', emoji: '🧍' },
            { number: 3, label: 'Chapga', emoji: '⬅️' },
            { number: 4, label: 'Yugur', emoji: '🏃' },
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 2-YARIM YILLIK (17–34-DARSLAR)
  // =========================================================================

  // 17-DARS: Shashka taxtasi va donalarning yurishi (checkers_intro)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'checkers_intro',
    topicTitle: '17-dars: Shashka taxtasi va donalarning yurishi',
    ruleTitle: 'Shashka — aql va mantiq sporti',
    explanation:
      "Shashka o‘yinida barcha donalar faqat qora kataklarda va faqat diagonal bo‘ylab oldinga bitta katak yuradi! Oq kataklarga yurish mumkin emas.",
    formulaOrRule: '⬛ Faqat qora katak · ↗️ Diagonal oldinga · 1️⃣ Bitta katak',
    exampleProblem: 'Oddiy shashka donasi qaysi tomonga yuradi?',
    exampleSolution: 'Faqat qora kataklar bo‘ylab oldinga diagonal (qiyalab) yuradi!',
    peRounds: [
      {
        kind: 'checkers_intro',
        prompt: 'Shashka donasi qanday kataklarda va qanday yo‘nalishda yuradi?',
        options: ['Faqat qora katakda, diagonal oldinga'],
        correctAnswer: 'Faqat qora katakda, diagonal oldinga',
        fact: 'Shashka o‘yini diqqatni jamlash va oldindan o‘ylashni o‘rgatadi.',
        teacherHint: 'Qora katak va qiyalab (diagonal) yurishni tanla!',
        checkersData: {
          mode: 'rule_pick',
          choices: [
            { id: 'diag', emoji: '⬛↗️', label: 'Faqat qora katakda, diagonal oldinga', isCorrect: true },
            { id: 'straight', emoji: '⬜⬆️', label: 'Oq katakda to‘g‘riga', isCorrect: false },
            { id: 'side', emoji: '↔️', label: 'Yon tomonga to‘g‘ri', isCorrect: false },
          ],
        },
      },
      {
        kind: 'checkers_intro',
        prompt: 'Oq shashka donasini diagonal oldingi to‘g‘ri qora katakka yurdir!',
        options: ['To‘g‘ri yurish!'],
        correctAnswer: 'To‘g‘ri yurish!',
        fact: 'Har bir qora katakdan oldinga chap yoki o‘ng diagonal katakka o‘tish mumkin.',
        teacherHint: 'Oq donadan bir qator yuqoridagi diagonal yashil/qora katakni bos!',
        checkersData: {
          mode: 'move_diagonal',
          playerPos: { row: 2, col: 1 },
          targetSquares: [
            { row: 1, col: 0 },
            { row: 1, col: 2 },
          ],
        },
      },
      {
        kind: 'checkers_intro',
        prompt: 'Endi burchak yaqinidagi oq donani oldinga diagonal yurdir!',
        options: ['To‘g‘ri yurish!'],
        correctAnswer: 'To‘g‘ri yurish!',
        fact: 'Taxta chetidagi dona faqat bitta diagonal katakka yura oladi.',
        teacherHint: 'Yuqori o‘ngdagi qora katakni bos!',
        checkersData: {
          mode: 'move_diagonal',
          playerPos: { row: 3, col: 0 },
          targetSquares: [{ row: 2, col: 1 }],
        },
      },
    ],
  },

  // 18-DARS: Shashkada raqib donasini urib olish (checkers_intro)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'checkers_intro',
    topicTitle: '18-dars: Shashkada raqib donasini urib olish',
    ruleTitle: 'Raqib donasi ustidan sakrab urish',
    explanation:
      "Agar sening donang yonidagi diagonal qora katakda raqib donasi tursa va uning orqasidagi katak bo‘sh bo‘lsa, raqib donasi ustidan sakrab o‘tib uni urib olasan!",
    formulaOrRule: '⚪ Sening donang → ⚫ Raqib → ⬛ Bo‘sh katak = 💥 Urib olish!',
    exampleProblem: 'Raqib donasini urish uchun uning orqasidagi katak qanday bo‘lishi kerak?',
    exampleSolution: 'Albatta bo‘sh bo‘lishi kerak, shunda ustidan sakrab o‘tamiz!',
    peRounds: [
      {
        kind: 'checkers_intro',
        prompt: 'Oq dona bilan qora dona ustidan sakrab uni urib ol!',
        options: ['Dona urib olindi!'],
        correctAnswer: 'Dona urib olindi!',
        fact: 'Shashkada raqib donasini urish imkoni bo‘lsa, uni albatta urib olish shart!',
        teacherHint: 'Qora donaning narigi tomonidagi bo‘sh qora katakni bos!',
        checkersData: {
          mode: 'capture_jump',
          playerPos: { row: 2, col: 1 },
          enemyPos: { row: 1, col: 2 },
          targetSquares: [{ row: 0, col: 3 }],
        },
      },
      {
        kind: 'checkers_intro',
        prompt: 'Chap tomondan urib olish! Qora donadan sakrab o‘tib katakni bos!',
        options: ['Dona urib olindi!'],
        correctAnswer: 'Dona urib olindi!',
        fact: 'Oxirgi qatorga yetib borgan shashka donasi «Damka» (shoh) bo‘ladi!',
        teacherHint: 'Qora dona ustidan chap-yuqori burchakka sakra!',
        checkersData: {
          mode: 'capture_jump',
          playerPos: { row: 2, col: 3 },
          enemyPos: { row: 1, col: 2 },
          targetSquares: [{ row: 0, col: 1 }],
        },
      },
      {
        kind: 'checkers_intro',
        prompt: 'Markazdan hujum! Raqib donasini urib, Damka qatoriga chiq!',
        options: ['Dona urib olindi!'],
        correctAnswer: 'Dona urib olindi!',
        fact: 'Damka bo‘lgan dona diagonal bo‘ylab uzoq masofaga yura oladi!',
        teacherHint: 'Qora dona orqasidagi eng yuqori qora katakni tanla!',
        checkersData: {
          mode: 'capture_jump',
          playerPos: { row: 3, col: 0 },
          enemyPos: { row: 2, col: 1 },
          targetSquares: [{ row: 1, col: 2 }],
        },
      },
    ],
  },

  // 19-DARS: "Kun va tun" harakatli o'yini (day_night_freeze)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'day_night_freeze',
    topicTitle: '19-dars: "Kun va tun" harakatli o\'yini',
    ruleTitle: '«Kun!» deganda harakatlan, «Tun!» deganda qotib tur!',
    explanation:
      "«Kun!» komandasida qushchalar kabi zalda erkin yuguramiz va uchamiz. «Tun!» komandasi eshitilishi bilanoq joyimizda haykal kabi qimirlamay qotib qolamiz!",
    formulaOrRule: '☀️ KUN = Harakatlan va yugur  |  🌙 TUN = Haykaldek qotib tur!',
    exampleProblem: '«Tun!» komandasi berilganda qimirlasak nima bo‘ladi?',
    exampleSolution: 'Qimirlagan o‘yinchi o‘yindan chiqadi yoki jarima oladi, shuning uchun qotib turamiz!',
    peRounds: [
      {
        kind: 'day_night_freeze',
        prompt: 'Kunduzi «Yugur!» tugmasini bos, Tunda esa darhol «Qotib tur!»ni bos!',
        options: ['O‘yin g‘alaba bilan tugadi!'],
        correctAnswer: 'O‘yin g‘alaba bilan tugadi!',
        fact: '«Kun va tun» o‘yini o‘z harakatini tez to‘xtata olish (tormozlash) qobiliyatini o‘stiradi.',
        teacherHint: 'Quyosh ☀️ chiqganda yugur, Oy 🌙 chiqganda qotib tur tugmasini bos!',
        dayNightData: {
          requiredCycles: 2,
          dayCommand: '☀️ KUN — Yugur!',
          nightCommand: '🌙 TUN — Qotib tur!',
        },
      },
      {
        kind: 'day_night_freeze',
        prompt: 'Tezroq almashinuv! Kun va Tun signallariga hushyor bo‘l!',
        options: ['O‘yin g‘alaba bilan tugadi!'],
        correctAnswer: 'O‘yin g‘alaba bilan tugadi!',
        fact: 'Qotib turish muvozanat va iroda kuchini ham mustahkamlaydi.',
        teacherHint: 'Oy paydo bo‘lishi bilan harakatni to‘xtatib «Qotib tur!»ni bos!',
        dayNightData: {
          requiredCycles: 3,
          dayCommand: '☀️ KUN — Uchamiz!',
          nightCommand: '🌙 TUN — Haykal!',
        },
      },
      {
        kind: 'day_night_freeze',
        prompt: 'Oxirgi sinov: 3 marta Tun bo‘lganda ham adashma!',
        options: ['O‘yin g‘alaba bilan tugadi!'],
        correctAnswer: 'O‘yin g‘alaba bilan tugadi!',
        fact: 'Ajoyib! Sen haqiqiy diqqat va chaqqonlik ustasisan!',
        teacherHint: 'Kun payti oldinga silji, Tun payti esa qimirlamay qotib tur!',
        dayNightData: {
          requiredCycles: 3,
          dayCommand: '☀️ KUN — Olg‘a!',
          nightCommand: '🌙 TUN — Jim va tik!',
        },
      },
    ],
  },

  // 20-DARS: Mokisimon yugurish estafetasi (relay_race)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'relay_race',
    topicTitle: '20-dars: Mokisimon yugurish estafetasi',
    ruleTitle: 'Oldinga borib, tez burilib qaytish',
    explanation:
      "Mokisimon yugurishda birinchi chiziqdan ikkinchi chiziqqacha yugurib boramiz, yerdagi kubikni olib yoki chiziqqa tegib, darhol orqaga yugurib qaytamiz!",
    formulaOrRule: '🏃 Borish → 🔄 Tez burilish → 🏃 Qaytish',
    exampleProblem: 'Mokisimon yugurishda nima muhim?',
    exampleSolution: 'Finish chizig‘ida tez tormozlanib, chaqqon burilib qaytish!',
    peRounds: [
      {
        kind: 'relay_race',
        prompt: 'Kubikni olish uchun oxirigacha yugurib bor va tez qayt!',
        options: ['Estafeta bajarildi!'],
        correctAnswer: 'Estafeta bajarildi!',
        fact: 'Mokisimon yugurish tezkorlik va burilish chaqqonligini tekshiradigan asosiy mashqdir.',
        teacherHint: 'Chap va o‘ng oyoq tugmalarini tez-tez bos!',
        relayData: {
          mode: 'shuttle_run',
          runnerEmoji: '🏃',
          itemEmoji: '🧊',
          itemLabel: 'Sport kubigi',
          targetSteps: 6,
        },
      },
      {
        kind: 'relay_race',
        prompt: '2-urinish: Qizil bayroqchagacha mokisimon yugur!',
        options: ['Estafeta bajarildi!'],
        correctAnswer: 'Estafeta bajarildi!',
        fact: 'Burilish paytida tizzalarni biroz bukish muvozanatni saqlaydi.',
        teacherHint: 'Yugurish tugmalarini navbatma-navbat tez bos!',
        relayData: {
          mode: 'shuttle_run',
          runnerEmoji: '🏃‍♀️',
          itemEmoji: '🚩',
          itemLabel: 'Burilish bayrog‘i',
          targetSteps: 7,
        },
      },
      {
        kind: 'relay_race',
        prompt: 'Jamoaviy mokisimon estafeta! So‘nggi qadamlarni tezlashtir!',
        options: ['Estafeta bajarildi!'],
        correctAnswer: 'Estafeta bajarildi!',
        fact: 'Jamoa bo‘lib mokisimon yugurish barcha bolalarni faol harakatga keltiradi.',
        teacherHint: 'Marragacha to‘xtamasdan yugur!',
        relayData: {
          mode: 'shuttle_run',
          runnerEmoji: '🏃‍♂️',
          itemEmoji: '🏆',
          itemLabel: 'Jamoa kubogi',
          targetSteps: 8,
        },
      },
    ],
  },

  // 21-DARS: To'siqlardan oshib yugurish estafetasi (relay_race)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'relay_race',
    topicTitle: "21-dars: To'siqlardan oshib yugurish estafetasi",
    ruleTitle: 'Yugurish va to‘siq ustidan sakrash',
    explanation:
      "To‘siqli estafetada oddiy yugurish bilan birga pastak to‘siqlar (g‘ovlar) ustidan yengil sakrab o‘tish kerak. To‘siqqa urilmaslik uchun oldinga qarab yuguramiz!",
    formulaOrRule: '🏃 Yugur + 🚧 To‘siq ko‘rsang SAKRA! = 🏁 G‘alaba',
    exampleProblem: 'To‘siq ustidan sakraganda qaysi yerga tushamiz?',
    exampleSolution: 'Oyoq uchiga yumshoq va tizzalarni biroz bukib tushamiz!',
    peRounds: [
      {
        kind: 'relay_race',
        prompt: 'Yugur va yo‘lda to‘siq chiqganda «Sakra!» tugmasini bos!',
        options: ['To‘siqlardan o‘tdim!'],
        correctAnswer: 'To‘siqlardan o‘tdim!',
        fact: 'To‘siqlardan oshib yugurish dadillik va sakrash kuchini oshiradi.',
        teacherHint: 'Oldinda g‘ov (to‘siq) ko‘ringanda sariq «Sakra!» tugmasini bos!',
        relayData: {
          mode: 'hurdle_run',
          runnerEmoji: '🏃',
          itemEmoji: '🚧',
          itemLabel: 'Past to‘siq',
          targetSteps: 6,
        },
      },
      {
        kind: 'relay_race',
        prompt: '2-bosqich: Ikki to‘siqdan oshib jamoangga ochko keltir!',
        options: ['To‘siqlardan o‘tdim!'],
        correctAnswer: 'To‘siqlardan o‘tdim!',
        fact: 'Sakrashdan oldin tezlikni saqlab qolsang, to‘siqdan oson o‘tasan.',
        teacherHint: 'Yugurish va sakrash tugmalarini o‘z vaqtida ishlat!',
        relayData: {
          mode: 'hurdle_run',
          runnerEmoji: '🏃‍♀️',
          itemEmoji: '🪜',
          itemLabel: 'Sport g‘ovi',
          targetSteps: 7,
        },
      },
      {
        kind: 'relay_race',
        prompt: 'Katta to‘siqlar yo‘lagi! Barchasidan xatosiz o‘t!',
        options: ['To‘siqlardan o‘tdim!'],
        correctAnswer: 'To‘siqlardan o‘tdim!',
        fact: 'Ajoyib yengil atletika ko‘nikmasi hosil bo‘ldi!',
        teacherHint: 'To‘siq oldida «Sakra!», bo‘sh yo‘lda «Yugur!» tugmasini bos!',
        relayData: {
          mode: 'hurdle_run',
          runnerEmoji: '🏃‍♂️',
          itemEmoji: '🚧',
          itemLabel: 'Final to‘sig‘i',
          targetSteps: 8,
        },
      },
    ],
  },

  // 22-DARS: Gimnastika: to'g'ri qomat va muvozanat saqlash (gymnastics_balance)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'gymnastics_balance',
    topicTitle: "22-dars: Gimnastika: to'g'ri qomat va muvozanat saqlash",
    ruleTitle: 'Chiroyli va sog‘lom qomat siri',
    explanation:
      "To‘g‘ri qomat — bosh tik, yelkalar bir tekis, orqa to‘g‘ri bo‘lishidir! Partada ham, safda ham bukchaymasdan o‘tirsak va yursak, bo‘yimiz chiroyli o‘sadi.",
    formulaOrRule: '👑 Bosh tik · 💪 Yelkalar teng · 📏 Orqa to‘g‘ri',
    exampleProblem: 'To‘g‘ri qomatni tekshirish uchun qanday mashq qilamiz?',
    exampleSolution: 'Devor yoniga tayanib, ensa, yelka va tovonlarni tekis tutamiz!',
    peRounds: [
      {
        kind: 'gymnastics_balance',
        prompt: 'Qaysi rasm to‘g‘ri va chiroyli qomatni ko‘rsatmoqda?',
        options: ['Tik qomat, bosh baland'],
        correctAnswer: 'Tik qomat, bosh baland',
        fact: 'To‘g‘ri qomat nafas olishni yengillashtiradi va charchoqni kamaytiradi.',
        teacherHint: 'Bukchaymagan, tik turgan sportchini tanla!',
        gymData: {
          mode: 'posture_pick',
          choices: [
            { id: 'straight', emoji: '🧍‍♂️✨', label: 'Tik qomat, yelkalar teng', isCorrect: true },
            { id: 'slouch', emoji: '🙇‍♂️💤', label: 'Bukchayib, bosh pastga', isCorrect: false },
            { id: 'lean', emoji: '🥴', label: 'Bir yonga qiyshayib', isCorrect: false },
          ],
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: 'Boshdagi kitob tushib ketmasin! Muvozanat ko‘rsatkichini yashil markazda ushla!',
        options: ['Muvozanat saqlandi!'],
        correctAnswer: 'Muvozanat saqlandi!',
        fact: 'Boshga yengil xaltacha qo‘yib yurish qomatni juda chiroyli qiladi.',
        teacherHint: 'Chap/O‘ng tugmalar bilan strelkani o‘rtadagi yashil zonada ushlab tur!',
        gymData: {
          mode: 'beam_hold',
          targetBalanceTicks: 6,
          poseLabel: 'To‘g‘ri qomat muvozanati',
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: 'To‘g‘ri qomat qoidalarini tartib bilan ter!',
        options: ['Qomat qoidasi tayyor!'],
        correctAnswer: 'Qomat qoidasi tayyor!',
        fact: 'Sog‘lom umurtqa — sog‘lom va tetik tananing garovi.',
        teacherHint: 'Boshdan boshlab tovonlargacha tik holatni ter.',
        gymData: {
          mode: 'mat_sequence',
          steps: [
            { id: 'p1', emoji: '👑', label: 'Boshni tik tutish' },
            { id: 'p2', emoji: '📏', label: 'Yelka va orqani tekislash' },
            { id: 'p3', emoji: '🚶', label: 'Yengil va tik yurish' },
          ],
        },
      },
    ],
  },

  // 23-DARS: Gimnastika o'rindig'ida muvozanat bilan yurish (gymnastics_balance)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'gymnastics_balance',
    topicTitle: "23-dars: Gimnastika o'rindig'ida muvozanat bilan yurish",
    ruleTitle: 'Tor o‘rindiq ustida ishonchli yurish',
    explanation:
      "Gimnastika o‘rindig‘idan yiqilmay o‘tish uchun qo‘llarimizni qanotdek ikki yonga yoyamiz, pastga emas, oldinga qaraymiz va qadamlarni tekis tashlaymiz!",
    formulaOrRule: '👐 Qo‘llar yonda · 👀 Oldinga qara · ⚖️ Muvozanat',
    exampleProblem: 'O‘rindiq ustida yurayotganda qo‘llar qayerda bo‘ladi?',
    exampleSolution: 'Muvozanat saqlash uchun ikki yon tomonga yoyilgan bo‘ladi!',
    peRounds: [
      {
        kind: 'gymnastics_balance',
        prompt: 'Gimnastika o‘rindig‘ida muvozanatni yashil zonada ushlab o‘t!',
        options: ['Muvozanat saqlandi!'],
        correctAnswer: 'Muvozanat saqlandi!',
        fact: 'Qo‘llarni yonga yoyish xuddi samolyot qanoti kabi muvozanatni ushlaydi.',
        teacherHint: 'Chapga yoki o‘ngga og‘ib ketsang, qarama-qarshi tugmani bos!',
        gymData: {
          mode: 'beam_hold',
          targetBalanceTicks: 7,
          poseLabel: 'O‘rindiq ustida yurish',
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: 'O‘rindiqda yurish qoidasi: qayerga qarash va qo‘lni qanday tutish kerak?',
        options: ['Oldinga qarab, qo‘llarni yonga yoyish'],
        correctAnswer: 'Oldinga qarab, qo‘llarni yonga yoyish',
        fact: 'Oyoq ostiga tikilib qarasak, bosh aylanib muvozanat buzilishi mumkin.',
        teacherHint: 'Oldinga qarash va qanot kabi yoyilgan qo‘llarni tanla.',
        gymData: {
          mode: 'posture_pick',
          choices: [
            { id: 'wings', emoji: '🧍👐', label: 'Oldinga qarab, qo‘llarni yonga yoyish', isCorrect: true },
            { id: 'pocket', emoji: '👖', label: 'Qo‘llarni cho‘ntakka solish', isCorrect: false },
            { id: 'eyes_closed', emoji: '😌', label: 'Ko‘zni yumib yurish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: 'Qiyinroq sinov: o‘rindiq oxirigacha muvozanatni ushla!',
        options: ['Muvozanat saqlandi!'],
        correctAnswer: 'Muvozanat saqlandi!',
        fact: 'A’lo! Endi tor ko‘prik va o‘rindiqlardan qo‘rqmay yura olasan.',
        teacherHint: 'Belgilarni yashil markazda ushlab tur.',
        gymData: {
          mode: 'beam_hold',
          targetBalanceTicks: 8,
          poseLabel: 'O‘rindiqdan yumshoq tushish',
        },
      },
    ],
  },

  // 24-DARS: Oldinga umbaloq oshish (matda dumalash) (gymnastics_balance)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'gymnastics_balance',
    topicTitle: '24-dars: Oldinga umbaloq oshish (matda dumalash)',
    ruleTitle: 'Xavfsiz umbaloq oshish qoidasi',
    explanation:
      "Yumshoq gimnastika matida umbaloq oshganda eng muhimi — iyagimizni ko‘krakka bosib, boshning tepasini emas, ensani matga qo‘yish va tizzalarni quchoqlab dumalashdir!",
    formulaOrRule: '🧎 Cho‘qqay → 🙇 Iyakni ko‘krakka bos → 🔄 Yumaloq dumala!',
    exampleProblem: 'Umbaloq oshishda boshni nima uchun ko‘krakka egamiz?',
    exampleSolution: 'Bo‘yinni himoya qilish va koptokdek yumshoq dumalash uchun!',
    peRounds: [
      {
        kind: 'gymnastics_balance',
        prompt: 'Umbaloq oshish bosqichlarini to‘g‘ri tartibda ter!',
        options: ['Umbaloq bajarildi!'],
        correctAnswer: 'Umbaloq bajarildi!',
        fact: 'Umbaloq oshish faqat yumshoq matda va ustoz nazorati ostida bajariladi.',
        teacherHint: 'Cho‘qqayish → Iyakni egish → Koptokdek dumalash!',
        gymData: {
          mode: 'mat_sequence',
          steps: [
            { id: 'u1', emoji: '🧎', label: 'Mat chetiga cho‘qqayib qo‘l qo‘yish' },
            { id: 'u2', emoji: '🙇', label: 'Iyakni ko‘krakka bosish' },
            { id: 'u3', emoji: '🌀', label: 'Tizzani quchoqlab oldinga dumalash' },
          ],
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: 'Umbaloq oshishdan oldin bosh qanday holatda bo‘lishi xavfsiz?',
        options: ['Iyak ko‘krakka bosilgan'],
        correctAnswer: 'Iyak ko‘krakka bosilgan',
        fact: 'Bo‘yinni to‘g‘ri egish orqa umurtqa bilan yumshoq dumalash imkonini beradi.',
        teacherHint: 'Iyakni ko‘krakka tekkizish qoidasini tanla.',
        gymData: {
          mode: 'posture_pick',
          choices: [
            { id: 'chin', emoji: '🙇‍♂️✅', label: 'Iyak ko‘krakka bosilgan', isCorrect: true },
            { id: 'head_up', emoji: '🙄❌', label: 'Tepaga qarab boshni ko‘tarish', isCorrect: false },
            { id: 'one_arm', emoji: '💪❌', label: 'Bir qo‘lga tayanish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: 'Yana bir bor matda dumalash zanjirini tugalla!',
        options: ['Umbaloq bajarildi!'],
        correctAnswer: 'Umbaloq bajarildi!',
        fact: 'Chiniqish mashqlari yiqilganda ham o‘zni himoya qilishni o‘rgatadi.',
        teacherHint: 'Qadamlarni boshidan oxirigacha bos.',
        gymData: {
          mode: 'mat_sequence',
          steps: [
            { id: 'm1', emoji: '👐', label: 'Qo‘llarni matga tirash' },
            { id: 'm2', emoji: '🔄', label: 'Yelkalarda yumshoq aylanish' },
            { id: 'm3', emoji: '🧍', label: 'Cho‘qqayib tik turish' },
          ],
        },
      },
    ],
  },

  // 25-DARS: "Qaldirg'och" va bir oyoqda muvozanat (gymnastics_balance)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'gymnastics_balance',
    topicTitle: '25-dars: "Qaldirg\'och" va bir oyoqda muvozanat',
    ruleTitle: 'Bir oyoqda qaldirg‘ochdek uchish',
    explanation:
      "«Qaldirg‘och» mashqida bir oyoqda tik turib, ikkinchi oyoqni orqaga ko‘taramiz, gavdani biroz oldinga egamiz va qo‘llarni ikki tomonga qanot kabi ochamiz!",
    formulaOrRule: '🦢 Bir oyoqda tur · 👐 Qo‘llar qanot · ⏱️ 5 soniya qotib tur',
    exampleProblem: '«Qaldirg‘och» mashqida qaysi tana qismlari muvozanatga yordam beradi?',
    exampleSolution: 'Ikki tomonga yoyilgan qo‘llar va oldinga qaratilgan nigoh!',
    peRounds: [
      {
        kind: 'gymnastics_balance',
        prompt: '«Qaldirg‘och» holatini tut! Strelkani yashil markazda ushla!',
        options: ['Muvozanat saqlandi!'],
        correctAnswer: 'Muvozanat saqlandi!',
        fact: 'Bir oyoqda muvozanat saqlash tovon va boldir mushaklarini baquvvat qiladi.',
        teacherHint: 'Chap/O‘ng tugmalar bilan muvozanatni o‘rtada tut!',
        gymData: {
          mode: 'beam_hold',
          targetBalanceTicks: 7,
          poseLabel: '«Qaldirg‘och» muvozanati',
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: '«Qaldirg‘och» holatiga kirish bosqichlarini tartibga sol!',
        options: ['Holat bajarildi!'],
        correctAnswer: 'Holat bajarildi!',
        fact: 'Har bir mashqni avval o‘ng oyoqda, keyin chap oyoqda bajarish kerak.',
        teacherHint: 'Avval qo‘llarni yoy, keyin oyoqni ko‘tar, oxiri 5 soniya ushla!',
        gymData: {
          mode: 'mat_sequence',
          steps: [
            { id: 'q1', emoji: '👐', label: 'Qo‘llarni yonga yoyish' },
            { id: 'q2', emoji: '🦩', label: 'Bir oyoqni orqaga ko‘tarish' },
            { id: 'q3', emoji: '⏱️', label: 'Muvozanatni ushlab turish' },
          ],
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: 'Endi chap oyoqda «Qaldirg‘och»! Muvozanatni saqla!',
        options: ['Muvozanat saqlandi!'],
        correctAnswer: 'Muvozanat saqlandi!',
        fact: 'Ikkala oyoq ham birdek kuchli va epchil bo‘ldi!',
        teacherHint: 'Yashil zonadan chiqib ketma!',
        gymData: {
          mode: 'beam_hold',
          targetBalanceTicks: 8,
          poseLabel: 'Chap oyoqda «Qaldirg‘och»',
        },
      },
    ],
  },

  // 26-DARS: Egiluvchanlik va "Ko'prik" mashqi (gymnastics_balance)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'gymnastics_balance',
    topicTitle: '26-dars: Egiluvchanlik va "Ko\'prik" mashqi',
    ruleTitle: 'Egiluvchan bel va xavfsiz ko‘prik',
    explanation:
      "Egiluvchanlik mashqlari mushaklar va bo‘g‘imlarni yumshoq cho‘zadi. «Ko‘prik» mashqi avval chalqancha yotgan holatdan kaftlar va oyoqlarga tayanib ko‘tarilish orqali bajariladi!",
    formulaOrRule: '🧘 Avval isinish → 🛏️ Chalqancha yot → 🌉 Ko‘prik qilib ko‘taril',
    exampleProblem: '«Ko‘prik» mashqini qilishdan oldin nima qilish shart?',
    exampleSolution: 'Albatta orqa va qo‘llarni yaxshilab qizdirib (badantarbiya qilib) olish shart!',
    peRounds: [
      {
        kind: 'gymnastics_balance',
        prompt: 'Matda «Ko‘prik» mashqini bajarish bosqichlarini tartib bilan ter!',
        options: ['Mashq bajarildi!'],
        correctAnswer: 'Mashq bajarildi!',
        fact: 'Egiluvchanlik sportda jarohatlarning oldini oladi.',
        teacherHint: 'Avval yotamiz, keyin qo‘l-oyoqni qo‘yamiz, oxiri belni ko‘taramiz.',
        gymData: {
          mode: 'mat_sequence',
          steps: [
            { id: 'k1', emoji: '🛏️', label: 'Matga chalqancha yotish' },
            { id: 'k2', emoji: '🙌', label: 'Qo‘llarni yelka yoniga tirash' },
            { id: 'k3', emoji: '🌉', label: 'Belni ko‘prikdek ko‘tarish' },
          ],
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: '«Mushukcha» mashqi: egiluvchanlik uchun qaysi harakat to‘g‘ri?',
        options: ['Belni yumshoq egib ko‘tarish'],
        correctAnswer: 'Belni yumshoq egib ko‘tarish',
        fact: '«Mushukcha» mashqi bel umurtqalarini yumshoq va sog‘lom saqlaydi.',
        teacherHint: 'Sokin va yumshoq cho‘zilish mashqini tanla.',
        gymData: {
          mode: 'posture_pick',
          choices: [
            { id: 'cat', emoji: '🐈✨', label: 'To‘rt oyoqda belni yumshoq bukib-yozish', isCorrect: true },
            { id: 'fast', emoji: '⚡💥', label: 'Keskin va tez siltash', isCorrect: false },
            { id: 'breath_hold', emoji: '😤', label: 'Nafasni qisib turish', isCorrect: false },
          ],
        },
      },
      {
        kind: 'gymnastics_balance',
        prompt: '«Qaldirg‘och»dan so‘ng «Tarozi» muvozanatini ushla!',
        options: ['Muvozanat saqlandi!'],
        correctAnswer: 'Muvozanat saqlandi!',
        fact: 'Gimnastika mashqlari tana go‘zalligi va kuchini birlashtiradi!',
        teacherHint: 'Tugmalar yordamida ko‘rsatkichni yashil markazda ushla!',
        gymData: {
          mode: 'beam_hold',
          targetBalanceTicks: 7,
          poseLabel: 'Egiluvchanlik va muvozanat',
        },
      },
    ],
  },

  // 27-DARS: To'p bilan yugurish estafetasi (relay_race)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'relay_race',
    topicTitle: "27-dars: To'p bilan yugurish estafetasi",
    ruleTitle: 'To‘pni tushirmay yugurish va olib yurish',
    explanation:
      "To‘p bilan estafetada katta to‘pni ikki qo‘llab mahkam ushlab yuguramiz yoki qo‘l bilan yerga urib olib yuramiz. Do‘stimizga to‘pni uloqtirmasdan, qo‘liga beramiz!",
    formulaOrRule: '🏀 To‘pni mahkam ushla · 🏃 Tez yugur · 🤝 Qo‘lga uzat',
    exampleProblem: 'Estafetada to‘p qo‘ldan tushib ketsa nima qilamiz?',
    exampleSolution: 'Uni olib, joyiga qaytib yugurishni davom ettiramiz!',
    peRounds: [
      {
        kind: 'relay_race',
        prompt: 'Basketbol to‘pini ikki qo‘llab ushlab, marragacha tez yugur!',
        options: ['Estafeta bajarildi!'],
        correctAnswer: 'Estafeta bajarildi!',
        fact: 'To‘pni ushlab yugurishda qadamlar muvozanatini saqlash muhim.',
        teacherHint: 'Chap va o‘ng oyoq tugmalarini tez-tez bosing!',
        relayData: {
          mode: 'baton_pass',
          runnerEmoji: '🏃',
          itemEmoji: '🏀',
          itemLabel: 'Basketbol to‘pi',
          targetSteps: 6,
        },
      },
      {
        kind: 'relay_race',
        prompt: '2-bosqich: Futbol to‘pini olib borib do‘stingga topshir!',
        options: ['Estafeta bajarildi!'],
        correctAnswer: 'Estafeta bajarildi!',
        fact: 'O‘z jamoangni qo‘llab-quvvatlash estafetani yanada quvnoq qiladi!',
        teacherHint: 'Marragacha to‘xtamay qadam tashla!',
        relayData: {
          mode: 'baton_pass',
          runnerEmoji: '🏃‍♀️',
          itemEmoji: '⚽',
          itemLabel: 'Futbol to‘pi',
          targetSteps: 7,
        },
      },
      {
        kind: 'relay_race',
        prompt: 'Final bosqichi! Voleybol to‘pi bilan g‘alaba marrasiga yet!',
        options: ['Estafeta bajarildi!'],
        correctAnswer: 'Estafeta bajarildi!',
        fact: 'Barakalla! To‘p bilan ham juda tez va epchil yugurding!',
        teacherHint: 'Yugurish tugmalarini faol bos!',
        relayData: {
          mode: 'baton_pass',
          runnerEmoji: '🏃‍♂️',
          itemEmoji: '🏐',
          itemLabel: 'Voleybol to‘pi',
          targetSteps: 8,
        },
      },
    ],
  },

  // 28-DARS: Jamoaviy halqa uzatish estafetasi (relay_race)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'relay_race',
    topicTitle: '28-dars: Jamoaviy halqa uzatish estafetasi',
    ruleTitle: 'Halqa (obruch) bilan jamoaviy harakat',
    explanation:
      "Bu qiziqarli estafetada o‘yinchilar gimnastika halqasini boshidan o‘tkazib yoki oldinga yugurib borib halqa ichidan o‘tib keyingi do‘stiga uzatishadi!",
    formulaOrRule: '⭕ Halqani uzat · 🏃 Tez yugur · 🤝 Jamoa g‘olib!',
    exampleProblem: 'Halqa uzatish estafetasida g‘alaba nimaga bog‘liq?',
    exampleSolution: 'Butun jamoaning bir-biriga chaqqon va ahil yordam berishiga!',
    peRounds: [
      {
        kind: 'relay_race',
        prompt: 'Gimnastika halqasini olib marraga yugur va do‘stingga uzat!',
        options: ['Halqa uzatildi!'],
        correctAnswer: 'Halqa uzatildi!',
        fact: 'Halqa bilan o‘yinlar yelka, bel va qo‘l harakatchanligini oshiradi.',
        teacherHint: 'Yugurish tugmalarini navbatma-navbat tez bos!',
        relayData: {
          mode: 'ring_relay',
          runnerEmoji: '🏃',
          itemEmoji: '⭕',
          itemLabel: 'Gimnastika halqasi',
          targetSteps: 6,
        },
      },
      {
        kind: 'relay_race',
        prompt: 'Halqalar ko‘prikchasi! Tezlikni oshirib 7 qadamda yetkaz!',
        options: ['Halqa uzatildi!'],
        correctAnswer: 'Halqa uzatildi!',
        fact: 'Jamoa bo‘lib g‘alaba qozonish barchaga quvonch ulashadi.',
        teacherHint: 'Chap-o‘ng qadamlarni ritm bilan bos!',
        relayData: {
          mode: 'ring_relay',
          runnerEmoji: '🏃‍♀️',
          itemEmoji: '⭕',
          itemLabel: 'Rangli halqa',
          targetSteps: 7,
        },
      },
      {
        kind: 'relay_race',
        prompt: 'Yakuniy estafeta! Jamoang bilan oltin kubokni qo‘lga kirit!',
        options: ['Halqa uzatildi!'],
        correctAnswer: 'Halqa uzatildi!',
        fact: 'Ahil jamoa har qanday to‘siqni yengib o‘tadi!',
        teacherHint: 'Finish chizig‘igacha faol harakatlan!',
        relayData: {
          mode: 'ring_relay',
          runnerEmoji: '🏃‍♂️',
          itemEmoji: '🏅',
          itemLabel: 'Oltin halqa',
          targetSteps: 8,
        },
      },
    ],
  },

  // 29-DARS: Tezkor start va marraga yugurish (relay_race)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'relay_race',
    topicTitle: '29-dars: Tezkor start va marraga yugurish',
    ruleTitle: '«Diqqat! Marsh!» — qisqa masofaga yugurish',
    explanation:
      "Tez yugurish uchun startda bir oyoq oldinda, gavda biroz oldinga egilgan bo‘ladi. «Marsh!» degan zahoti kuch bilan oldinga otilib, marragacha tezlikni tushirmay yuguramiz!",
    formulaOrRule: '🏁 Tayyorlan! → ⚡ Diqqat! → 🚀 Marsh va Finish!',
    exampleProblem: 'Start chizig‘ida qaysi komandadan keyin yugurish boshlanadi?',
    exampleSolution: 'Faqat «Marsh!» (yoki hushtak) komandasidan keyin!',
    peRounds: [
      {
        kind: 'relay_race',
        prompt: '«Marsh!» signali berildi! Tezkor qadamlar bilan marraga uch!',
        options: ['Marraga yetdim!'],
        correctAnswer: 'Marraga yetdim!',
        fact: 'Qisqa masofaga (30 m) yugurishda dastlabki qadamlar juda tez bo‘lishi kerak.',
        teacherHint: 'Chap va o‘ng oyoq tugmalarini maksimal tezlikda galma-gal bos!',
        relayData: {
          mode: 'baton_pass',
          runnerEmoji: '⚡🏃',
          itemEmoji: '🏁',
          itemLabel: '30 metr marrasi',
          targetSteps: 7,
        },
      },
      {
        kind: 'relay_race',
        prompt: '2-poyga! Qo‘llarni faol ishlatib shamoldek yugur!',
        options: ['Marraga yetdim!'],
        correctAnswer: 'Marraga yetdim!',
        fact: 'Tirsakdan bukilgan qo‘llar harakati yugurish tezligini ancha oshiradi.',
        teacherHint: 'To‘xtamasdan marragacha bos!',
        relayData: {
          mode: 'baton_pass',
          runnerEmoji: '🏃‍♀️💨',
          itemEmoji: '🏁',
          itemLabel: 'Finish chizig‘i',
          targetSteps: 8,
        },
      },
      {
        kind: 'relay_race',
        prompt: 'Chempionlar poygasi! Rekord o‘rnat!',
        options: ['Marraga yetdim!'],
        correctAnswer: 'Marraga yetdim!',
        fact: 'Har darsda yugurish yurak va o‘pkani juda baquvvat qiladi!',
        teacherHint: 'Oxirgi metrlar — yanada tezroq!',
        relayData: {
          mode: 'baton_pass',
          runnerEmoji: '🏃‍♂️🔥',
          itemEmoji: '🏆',
          itemLabel: 'Rekord marrasi',
          targetSteps: 9,
        },
      },
    ],
  },

  // 30-DARS: Joyidan uzunlikka sakrash (jump_power)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'jump_power',
    topicTitle: '30-dars: Joyidan uzunlikka sakrash',
    ruleTitle: 'Qo‘l siltab uzoqqa sakrash texnikasi',
    explanation:
      "Joyidan uzunlikka sakrashda oyoqlar yelka kengligida turadi, tizzalar bukilib qo‘llar orqaga tortiladi. So‘ng qo‘llarni oldinga kuchli siltab, ikki oyoqda oldinga sakraymiz va yumshoq tushamiz!",
    formulaOrRule: '🦵 Tizzani buk → 💪 Qo‘lni silta → 🦘 Uzoqqa sakra!',
    exampleProblem: 'Joyidan uzunlikka sakraganda necha oyoqda itarilamiz?',
    exampleSolution: 'Ikkala oyoqda bir vaqtda kuch bilan itarilamiz!',
    peRounds: [
      {
        kind: 'jump_power',
        prompt: 'Kuch shkalasi yashil zonaga kelganda «SAKRA!» tugmasini bosib qum maydonchasiga sakra!',
        options: ['Uzoqqa sakradim!'],
        correctAnswer: 'Uzoqqa sakradim!',
        fact: 'Qo‘llarni oldinga-yuqoriga siltab berish sakrash masofasini ancha uzaytiradi.',
        teacherHint: 'Yugurayotgan indikator yashil qismga kirganda «SAKRA!» tugmasini bos!',
        jumpData: {
          mode: 'power_meter',
          sweetMin: 40,
          sweetMax: 78,
          goalLabel: 'Qum maydonchasi (120 sm)',
          athleteEmoji: '🦘',
        },
      },
      {
        kind: 'jump_power',
        prompt: 'Endi 140 sm chizig‘idan oshib tush! Aniq kuch bilan sakra!',
        options: ['Uzoqqa sakradim!'],
        correctAnswer: 'Uzoqqa sakradim!',
        fact: 'Yerga tushganda tizzalarni bukish oyoqlarni zarbadan saqlaydi.',
        teacherHint: 'Yashil markazni nishonga olib sakra!',
        jumpData: {
          mode: 'power_meter',
          sweetMin: 45,
          sweetMax: 76,
          goalLabel: 'Oltin belgi (140 sm)',
          athleteEmoji: '🏃‍♂️',
        },
      },
      {
        kind: 'jump_power',
        prompt: 'Rekord sakrash! 150 sm marrasini zabt et!',
        options: ['Uzoqqa sakradim!'],
        correctAnswer: 'Uzoqqa sakradim!',
        fact: 'Ajoyib natija! Oyoqlaring haqiqiy sportchidek kuchli!',
        teacherHint: 'To‘liq diqqat bilan yashil zonada bos!',
        jumpData: {
          mode: 'power_meter',
          sweetMin: 48,
          sweetMax: 75,
          goalLabel: 'Rekord chizig‘i (150 sm)',
          athleteEmoji: '🏆',
        },
      },
    ],
  },

  // 31-DARS: To'pni ikki qo'llab savatga tashlash (ball_throw)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'ball_throw',
    topicTitle: "31-dars: To'pni ikki qo'llab savatga tashlash",
    ruleTitle: 'Mini-basketbol savatiga aniq tashlash',
    explanation:
      "Katta to‘pni savatga tashlashda to‘pni ko‘krak oldida ikki qo‘llab tutamiz, tizzalarni yengil bukamiz va yuqoriga yoy shaklida savatga qaratib tashlaymiz!",
    formulaOrRule: '🏀 Ikki qo‘llab tut → 🌈 Yoy shaklida ot → 🧺 Savatga tushir!',
    exampleProblem: 'To‘p savatga oson tushishi uchun qanday yo‘nalishda otamiz?',
    exampleSolution: 'Yuqoriga chiroyli yoy (kamalak) shaklida otamiz!',
    peRounds: [
      {
        kind: 'ball_throw',
        prompt: 'Mo‘ljal markazga kelganda to‘pni savatga tashla!',
        options: ['Savatga tushdi!'],
        correctAnswer: 'Savatga tushdi!',
        fact: 'Basketbol savatiga tashlash balandlikni his qilish va aniqlikni o‘rgatadi.',
        teacherHint: 'Nishon indikator yashil zonaga kirganda «OTISH!» tugmasini bos!',
        throwData: {
          mode: 'aim_timing',
          targetLabel: 'Sport savati',
          targetEmoji: '🏀',
          ballEmoji: '🏀',
        },
      },
      {
        kind: 'ball_throw',
        prompt: 'To‘pni savatga qanday trayektoriya (yo‘l) bilan otish eng to‘g‘ri?',
        options: ['Yuqoriga chiroyli yoy shaklida'],
        correctAnswer: 'Yuqoriga chiroyli yoy shaklida',
        fact: 'Yoy shaklida otilgan to‘p savat halqasining tepasidan oson tushadi.',
        teacherHint: 'Kamalak kabi yoy trayektoriyani tanla!',
        throwData: {
          mode: 'angle_pick',
          targetLabel: 'Basketbol savati',
          targetEmoji: '🧺',
          ballEmoji: '🏀',
          choices: [
            { id: 'arc', emoji: '🌈🏀', label: 'Yuqoriga chiroyli yoy shaklida', isCorrect: true },
            { id: 'floor', emoji: '⬇️', label: 'Yerga qaratib dumalatish', isCorrect: false },
            { id: 'flat', emoji: '⬅️', label: 'Yon devorga qaratib', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ball_throw',
        prompt: 'Hal qiluvchi 2 ochko! To‘pni yana savatga joyla!',
        options: ['Savatga tushdi!'],
        correctAnswer: 'Savatga tushdi!',
        fact: 'Super zarba! To‘g‘ri yoy va ikki qo‘l kuchi doimo g‘alaba keltiradi!',
        teacherHint: 'Yashil markazda bos!',
        throwData: {
          mode: 'aim_timing',
          targetLabel: 'Chempion savati',
          targetEmoji: '🏆',
          ballEmoji: '🏀',
        },
      },
    ],
  },

  // 32-DARS: Arg'amchida ritmli sakrash (jump_power)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'jump_power',
    topicTitle: "32-dars: Arg'amchida ritmli sakrash",
    ruleTitle: 'Arg‘amchini aylantirish va oyoq uchida sakrash',
    explanation:
      "Arg‘amchida sakraganda bilaklarimiz bilan arqonni aylantiramiz, tizzalarni ozgina bukib faqat oyoq uchida past va yengil sakraymiz. Arg‘amchi yerga yaqinlashganda sakraladi!",
    formulaOrRule: '➰ Bilak bilan aylantir · 🦶 Oyoq uchida · 🎵 Bir maromda sakra!',
    exampleProblem: 'Arg‘amchida qanday balandlikda sakrash qulay?',
    exampleSolution: 'Juda balandga emas, arg‘amchi o‘tishi uchun yetarli past balandlikda yengil sakraymiz!',
    peRounds: [
      {
        kind: 'jump_power',
        prompt: 'Aylanayotgan arg‘amchi yashil chiziqqa yetganda «SAKRA!» tugmasini 3 marta bos!',
        options: ['Arg‘amchida sakradim!'],
        correctAnswer: 'Arg‘amchida sakradim!',
        fact: 'Arg‘amchida sakrash yurakni chiniqtiradi va ritm hissini kuchaytiradi.',
        teacherHint: 'Arg‘amchi pastga tushgan paytni kuzatib «SAKRA!» tugmasini bos!',
        jumpData: {
          mode: 'rope_timing',
          targetJumps: 3,
          goalLabel: '3 marta ritmli sakrash',
          athleteEmoji: '🤸',
        },
      },
      {
        kind: 'jump_power',
        prompt: 'Endi tezroq ritm! Arg‘amchi ustidan 4 marta xatosiz sakra!',
        options: ['Arg‘amchida sakradim!'],
        correctAnswer: 'Arg‘amchida sakradim!',
        fact: 'Har kuni 2 daqiqa arg‘amchida sakrash juda foydali!',
        teacherHint: 'Arqon oyoqqa yetishidan oldinroq sakra!',
        jumpData: {
          mode: 'rope_timing',
          targetJumps: 4,
          goalLabel: '4 marta tez sakrash',
          athleteEmoji: '🏃‍♀️',
        },
      },
      {
        kind: 'jump_power',
        prompt: 'Chempion seriyasi: 5 marta ritmni buzmay sakra!',
        options: ['Arg‘amchida sakradim!'],
        correctAnswer: 'Arg‘amchida sakradim!',
        fact: 'Zo‘r! Sen arg‘amchi bilan do‘stlashib olding!',
        teacherHint: 'Bir maromda 5 ta sakrashni bajar!',
        jumpData: {
          mode: 'rope_timing',
          targetJumps: 5,
          goalLabel: '5 marta super sakrash',
          athleteEmoji: '🏅',
        },
      },
    ],
  },

  // 33-DARS: "Quyonchalar sakrashi" va balandlikka sakrash (jump_power)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'jump_power',
    topicTitle: '33-dars: "Quyonchalar sakrashi" va balandlikka sakrash',
    ruleTitle: 'Ikki oyoqda yuqoriga va g‘ov ustidan sakrash',
    explanation:
      "«Quyonchalar» o‘yinida oyoq uchida ketma-ket yengil sakrab oldinga boramiz. Balandlikka sakrashda esa tizzalarni ko‘krakka tortib, yuqoridagi lentacha yoki nishonga tegamiz!",
    formulaOrRule: '🐇 Oyoq uchida sakrash · ⬆️ Yuqoriga itarilish · 🪶 Yumshoq tushish',
    exampleProblem: 'Quyonchalarga o‘xshab qanday sakraladi?',
    exampleSolution: 'Tovonga emas, oyoq uchiga tushib yengil va shovqinsiz sakraladi!',
    peRounds: [
      {
        kind: 'jump_power',
        prompt: 'Quyoncha to‘siq ustidan sakrashi uchun kuchni yashil zonada to‘xtat!',
        options: ['Baland sakradim!'],
        correctAnswer: 'Baland sakradim!',
        fact: 'Quyonchalar sakrashi boldir mushaklarini mustahkamlaydi.',
        teacherHint: 'Kuch chizig‘i yashil zonaga kelganda «SAKRA!» tugmasini bos!',
        jumpData: {
          mode: 'power_meter',
          sweetMin: 42,
          sweetMax: 78,
          goalLabel: 'Baland to‘siq (50 sm)',
          athleteEmoji: '🐇',
        },
      },
      {
        kind: 'jump_power',
        prompt: 'Halqa ustidan quyonchalar sakrashi: 4 marta ritm bilan sakra!',
        options: ['Baland sakradim!'],
        correctAnswer: 'Baland sakradim!',
        fact: 'Yengil sakrash tizza va umurtqaga zarba tushmasligini ta’minlaydi.',
        teacherHint: 'Yashil zonaga kelganda bosib 4 ta to‘siqdan o‘t!',
        jumpData: {
          mode: 'rope_timing',
          targetJumps: 4,
          goalLabel: '4 ta quyoncha sakrashi',
          athleteEmoji: '🐰',
        },
      },
      {
        kind: 'jump_power',
        prompt: 'Eng baland sharcha! Yuqoriga sakrab yulduzchani tut!',
        options: ['Baland sakradim!'],
        correctAnswer: 'Baland sakradim!',
        fact: 'Qoyil! Haqiqiy chaqqon va baland sakrovchi bo‘lding!',
        teacherHint: 'Yashil zonada sakrash tugmasini bos!',
        jumpData: {
          mode: 'power_meter',
          sweetMin: 46,
          sweetMax: 74,
          goalLabel: 'Osilgan yulduzcha ⭐',
          athleteEmoji: '⭐',
        },
      },
    ],
  },

  // 34-DARS: Yil yakuni: Sport bayrami va quvnoq startlar (jump_power)
  {
    subject: 'pe',
    tier: 'elementary',
    grade: 1,
    peGameType: 'jump_power',
    topicTitle: '34-dars: Yil yakuni: Sport bayrami va quvnoq startlar',
    ruleTitle: '1-sinf Sport bayrami — Quvnoq startlar!',
    explanation:
      "Barakalla! Bir yil davomida safda turishni, yugurishni, sakrashni, to‘p otishni, gimnastika va shashkani o‘rganding! Sport bayramida hamma jamoalar do‘stlik va quvonch bilan bellashadi!",
    formulaOrRule: '🏅 Sport — sog‘liq garovi · 🤝 Do‘stlik · 🎉 Quvnoq startlar!',
    exampleProblem: 'Sport bayramida eng muhim narsa nima?',
    exampleSolution: 'Halol o‘ynash, do‘stlarni qo‘llab-quvvatlash va sog‘lom bo‘lish!',
    peRounds: [
      {
        kind: 'jump_power',
        prompt: 'Quvnoq startlar 1-bosqichi: G‘alaba sakrashini yashil zonada bajar!',
        options: ['Bayram g‘alabasi!'],
        correctAnswer: 'Bayram g‘alabasi!',
        fact: 'Muntazam sport bilan shug‘ullanadigan bola kasal bo‘lmaydi va yaxshi o‘qiydi!',
        teacherHint: 'Kuch shkalasini yashil markazda ushlab «SAKRA!» tugmasini bos!',
        jumpData: {
          mode: 'power_meter',
          sweetMin: 40,
          sweetMax: 80,
          goalLabel: 'Bayram marrasi 🎉',
          athleteEmoji: '🏆',
        },
      },
      {
        kind: 'jump_power',
        prompt: 'Bayram arg‘amchisi! Do‘stlaring bilan 4 marta quvnoq sakra!',
        options: ['Bayram g‘alabasi!'],
        correctAnswer: 'Bayram g‘alabasi!',
        fact: 'Yozgi ta’tilda ham ertalab badantarbiya va harakatli o‘yinlarni davom ettir!',
        teacherHint: 'Arg‘amchi pastga kelganda 4 marta sakra!',
        jumpData: {
          mode: 'rope_timing',
          targetJumps: 4,
          goalLabel: 'Quvnoq bayram sakrashi',
          athleteEmoji: '🎉',
        },
      },
      {
        kind: 'jump_power',
        prompt: '1-sinf chempioni shohsupasiga sakra! Barakalla!',
        options: ['Bayram g‘alabasi!'],
        correctAnswer: 'Bayram g‘alabasi!',
        fact: 'Tabriklaymiz! Sen 1-sinf Jismoniy tarbiya kursining barcha 34 darsini a’lo tamomlading!',
        teacherHint: 'Oxirgi chempionlik sakrashini bajar!',
        jumpData: {
          mode: 'power_meter',
          sweetMin: 42,
          sweetMax: 78,
          goalLabel: '1-o‘rin shohsupasi 🥇',
          athleteEmoji: '🥇',
        },
      },
    ],
  },
];
