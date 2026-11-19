import type { LessonPlan } from './curriculum';

export const ENGLISH_GRADE_1_LESSONS: LessonPlan[] = [
  // 1-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: '1-dars: Names & Greetings (Tanishish va salomlashish)',
    ruleTitle: 'Salomlashish va do‘stlashish',
    explanation:
      "Ingliz tilida ko'rishganda 'Hello!' (Salom!), xayrlashganda 'Goodbye!' (Xayr!) deymiz. Ismimizni aytish uchun 'My name is ...' iborasidan, rahmat aytish uchun esa 'Thank you!' so'zidan foydalanamiz.",
    formulaOrRule: 'Hello! My name is Ali.  |  Thank you! (Rahmat!)',
    exampleProblem: '👋 "___! My name is Madina."',
    exampleSolution: 'Hello! My name is Madina. (Salom! Mening ismim Madina.)',
    englishRounds: [
      {
        kind: 'match',
        instruction: "Salomlashish va tanishish so'zlarini juftlang:",
        pairs: [
          { uz: '👋 Salom', en: 'Hello' },
          { uz: '🙋 Xayr', en: 'Goodbye' },
          { uz: '📛 Ism', en: 'Name' },
          { uz: "🤝 Do'st", en: 'Friend' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Bo'sh joyga mos so'zni tanlang:",
        sentence: '___! My name is Ali.',
        translation: 'Salom! Mening ismim Ali.',
        options: ['Hello', 'Goodbye', 'Friend', 'Please'],
        correctAnswer: 'Hello',
      },
      {
        kind: 'match',
        instruction: "Xushmuomala so'zlarni tarjimasi bilan juftlang:",
        pairs: [
          { uz: '🙏 Rahmat', en: 'Thank you' },
          { uz: '😊 Iltimos', en: 'Please' },
          { uz: "👦 O'g'il bola", en: 'Boy' },
          { uz: '👧 Qiz bola', en: 'Girl' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Rahmat aytish iborasini to'ldiring:",
        sentence: '___ you!',
        translation: 'Rahmat senga!',
        options: ['Thank', 'Name', 'Hello', 'Friend'],
        correctAnswer: 'Thank',
      },
    ],
  },

  // 2-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: '2-dars: Numbers & Colors (Sonlar, ranglar va kamalak)',
    ruleTitle: 'Ranglar va sonlar',
    explanation:
      "Atrofimizdagi ranglar ingliz tilida juda chiroyli aytiladi: Red (qizil), Blue (ko'k), Green (yashil), Yellow (sariq). Sonlarni ham qo'shishimiz mumkin: Two plus one is three (2 + 1 = 3).",
    formulaOrRule: '🔴 Red · 🔵 Blue · 🟢 Green · 🟡 Yellow  |  1 One, 2 Two, 3 Three',
    exampleProblem: '🌈 "The sky is ___." (Osmon ko‘k.)',
    exampleSolution: 'The sky is blue.',
    englishRounds: [
      {
        kind: 'match',
        instruction: "Ranglarni inglizcha nomi bilan juftlang:",
        pairs: [
          { uz: '🔴 Qizil', en: 'Red' },
          { uz: "🔵 Ko'k", en: 'Blue' },
          { uz: '🟢 Yashil', en: 'Green' },
          { uz: '🟡 Sariq', en: 'Yellow' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Quyosh qaysi rangda? Bo'sh joyni to'ldiring:",
        sentence: 'The sun is ___.',
        translation: 'Quyosh sariq rangda.',
        options: ['yellow', 'blue', 'green', 'two'],
        correctAnswer: 'yellow',
      },
      {
        kind: 'match',
        instruction: "Sonlar va kamalak so'zini juftlang:",
        pairs: [
          { uz: '1️⃣ Bir', en: 'One' },
          { uz: '2️⃣ Ikki', en: 'Two' },
          { uz: '5️⃣ Besh', en: 'Five' },
          { uz: '🌈 Kamalak', en: 'Rainbow' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Ingliz tilida qo'shishni bajaring:",
        sentence: 'Two plus one is ___.',
        translation: "Ikki qo'shuv bir uch bo'ladi.",
        options: ['three', 'one', 'five', 'red'],
        correctAnswer: 'three',
      },
    ],
  },

  // 3-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: '3-dars: School & Classroom (Maktab va sinfxona)',
    ruleTitle: 'Maktab buyumlari va "How many?"',
    explanation:
      "Narsalar sonini so'rash uchun 'How many?' (Nechta?) savolini beramiz. O'z buyumimizni ko'rsatish uchun esa 'This is my ...' (Bu mening ...) deb aytamiz.",
    formulaOrRule: 'How many books? (Nechta kitob?)  |  This is my pen.',
    exampleProblem: '📖 "This is my ___." (Bu mening kitobim.)',
    exampleSolution: 'This is my book.',
    englishRounds: [
      {
        kind: 'match',
        instruction: "O'quv qurollarini inglizcha nomi bilan juftlang:",
        pairs: [
          { uz: '📖 Kitob', en: 'Book' },
          { uz: '🖊️ Ruchka', en: 'Pen' },
          { uz: '✏️ Qalam', en: 'Pencil' },
          { uz: '🎒 Sumka', en: 'Bag' },
        ],
      },
      {
        kind: 'fill',
        instruction: '"Nechta?" savolini to\'ldiring:',
        sentence: 'How ___ books?',
        translation: 'Nechta kitob?',
        options: ['many', 'pen', 'desk', 'red'],
        correctAnswer: 'many',
      },
      {
        kind: 'match',
        instruction: "Maktab va sinfxona so'zlarini juftlang:",
        pairs: [
          { uz: '🏫 Maktab', en: 'School' },
          { uz: '🪑 Parta', en: 'Desk' },
          { uz: "👩‍🏫 O'qituvchi", en: 'Teacher' },
          { uz: "📏 Chizg'ich", en: 'Ruler' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Gapni mos maktab buyumi bilan to'ldiring:",
        sentence: 'This is my ___.',
        translation: 'Bu mening kitobim.',
        options: ['book', 'hello', 'yellow', 'three'],
        correctAnswer: 'book',
      },
    ],
  },

  // 4-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: "4-dars: Toys & What is it? (O'yinchoqlar)",
    ruleTitle: '"What is it?" — Bu nima?',
    explanation:
      "Biror narsaning nomini so'rash uchun 'What is it?' (Bu nima?) deymiz. Javob berishda esa 'It is a ...' (Bu ...) deb aytamiz.",
    formulaOrRule: 'What is it? → It is a ball. (Bu koptok.)',
    exampleProblem: '🤖 "What is it? — It is a ___."',
    exampleSolution: 'It is a robot. (Bu robot.)',
    englishRounds: [
      {
        kind: 'match',
        instruction: "O'yinchoqlarni inglizcha nomi bilan juftlang:",
        pairs: [
          { uz: '⚽ Koptok', en: 'Ball' },
          { uz: "🪆 Qo'g'irchoq", en: 'Doll' },
          { uz: '🚗 Mashina', en: 'Car' },
          { uz: '🪁 Varrak', en: 'Kite' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Savol so'zini toping:",
        sentence: '___ is it? — It is a ball.',
        translation: 'Bu nima? — Bu koptok.',
        options: ['What', 'Hello', 'Many', 'Red'],
        correctAnswer: 'What',
      },
      {
        kind: 'match',
        instruction: "Yana sevimli o'yinchoqlarni juftlang:",
        pairs: [
          { uz: '🧸 Ayiqcha', en: 'Teddy bear' },
          { uz: '🤖 Robot', en: 'Robot' },
          { uz: '🚲 Velosiped', en: 'Bike' },
          { uz: '🚂 Poyezd', en: 'Train' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Gapni to'g'ri o'yinchoq nomi bilan to'ldiring:",
        sentence: 'It is a red ___.',
        translation: 'Bu qizil mashina.',
        options: ['car', 'thank', 'blue', 'many'],
        correctAnswer: 'car',
      },
    ],
  },

  // 5-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: '5-dars: My Family (Mening oilam)',
    ruleTitle: '"Who is this?" — Bu kim?',
    explanation:
      "Odamlar haqida so'raganda 'Who is this?' (Bu kim?) deymiz. Oilamizga mehrimizni bildirish uchun esa 'I love my family!' (Men oilamni yaxshi ko'raman!) deymiz.",
    formulaOrRule: "Who is this? → This is my mom.  |  I love my family ❤️",
    exampleProblem: '👨 "This is my ___." (Bu mening otam.)',
    exampleSolution: 'This is my dad.',
    englishRounds: [
      {
        kind: 'match',
        instruction: "Oila a'zolarini inglizcha nomi bilan juftlang:",
        pairs: [
          { uz: '👩 Ona', en: 'Mom' },
          { uz: '👨 Ota', en: 'Dad' },
          { uz: '👧 Opa / Singil', en: 'Sister' },
          { uz: '👦 Aka / Uka', en: 'Brother' },
        ],
      },
      {
        kind: 'fill',
        instruction: '"Bu kim?" savolini to\'ldiring:',
        sentence: '___ is this? — This is my mom.',
        translation: 'Bu kim? — Bu mening onam.',
        options: ['Who', 'What', 'How', 'Red'],
        correctAnswer: 'Who',
      },
      {
        kind: 'match',
        instruction: "Buvi, bobo va oila so'zlarini juftlang:",
        pairs: [
          { uz: '👵 Buvi', en: 'Grandma' },
          { uz: '👴 Bobo', en: 'Grandpa' },
          { uz: '👶 Chaqaloq', en: 'Baby' },
          { uz: '👨‍👩‍👧‍👦 Oila', en: 'Family' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Oilamizga bo'lgan mehrni ifodalang:",
        sentence: 'I ___ my family.',
        translation: "Men oilamni yaxshi ko'raman.",
        options: ['love', 'car', 'blue', 'desk'],
        correctAnswer: 'love',
      },
    ],
  },

  // 6-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: '6-dars: At Home & Shapes (Uyda va shakllar)',
    ruleTitle: '"Where are you?" va shakllar',
    explanation:
      "Biror kishi qayerda ekanini so'rash uchun 'Where are you?' (Qayerdasan?) deymiz. Uy buyumlari turli shakllarda bo'ladi: Circle (doira), Square (kvadrat), Triangle (uchburchak), Star (yulduz).",
    formulaOrRule: 'Where are you? → I am at home.  |  ⭕ Circle · 🟦 Square · 🔺 Triangle',
    exampleProblem: '🏠 "I am at ___." (Men uydaman.)',
    exampleSolution: 'I am at home.',
    englishRounds: [
      {
        kind: 'match',
        instruction: "Uy va xona so'zlarini juftlang:",
        pairs: [
          { uz: '🏠 Uy', en: 'House' },
          { uz: '🚪 Xona', en: 'Room' },
          { uz: '🛏️ Karavot', en: 'Bed' },
          { uz: '🪑 Stul', en: 'Chair' },
        ],
      },
      {
        kind: 'fill',
        instruction: '"Qayerdasan?" savolini to\'ldiring:',
        sentence: '___ are you? — I am at home.',
        translation: 'Qayerdasan? — Men uydaman.',
        options: ['Where', 'Who', 'What', 'Many'],
        correctAnswer: 'Where',
      },
      {
        kind: 'match',
        instruction: "Shakllarni inglizcha nomi bilan juftlang:",
        pairs: [
          { uz: '⭕ Doira', en: 'Circle' },
          { uz: '🟦 Kvadrat', en: 'Square' },
          { uz: '🔺 Uchburchak', en: 'Triangle' },
          { uz: '⭐ Yulduz', en: 'Star' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Koptok qaysi shaklda? Bo'sh joyni to'ldiring:",
        sentence: 'A ball is a ___.',
        translation: 'Koptok doira shaklida.',
        options: ['circle', 'bed', 'house', 'mom'],
        correctAnswer: 'circle',
      },
    ],
  },

  // 7-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: "7-dars: My Body & 5 Senses (Tana a'zolari va 5 sezgi)",
    ruleTitle: '"I have..." va tozalik qoidasi',
    explanation:
      "O'zimizda bor narsani aytish uchun 'I have ...' (Menda ... bor) deymiz. Ko'zlarimiz bilan ko'ramiz (see), quloqlarimiz bilan eshitamiz (hear). Doimo ozoda bo'ling: 'Wash your hands!'",
    formulaOrRule: 'I have two eyes. (Mening ikkita ko‘zim bor.)  |  Wash your hands! 🧼',
    exampleProblem: '👃 "I ___ one nose."',
    exampleSolution: 'I have one nose. (Mening bitta burnim bor.)',
    englishRounds: [
      {
        kind: 'match',
        instruction: "Tana a'zolarini inglizcha nomi bilan juftlang:",
        pairs: [
          { uz: '👤 Bosh', en: 'Head' },
          { uz: "✋ Qo'l", en: 'Hand' },
          { uz: "👁️ Ko'z", en: 'Eye' },
          { uz: '👂 Quloq', en: 'Ear' },
        ],
      },
      {
        kind: 'fill',
        instruction: '"Menda ... bor" gapini to\'ldiring:',
        sentence: 'I ___ two eyes.',
        translation: "Mening ikkita ko'zim bor.",
        options: ['have', 'am', 'where', 'red'],
        correctAnswer: 'have',
      },
      {
        kind: 'match',
        instruction: "Yuz a'zolari va sezgilarni juftlang:",
        pairs: [
          { uz: '👃 Burun', en: 'Nose' },
          { uz: "👄 Og'iz", en: 'Mouth' },
          { uz: "👀 Ko'rmoq", en: 'See' },
          { uz: '🎧 Eshitmoq', en: 'Hear' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Tozalik qoidasini to'ldiring:",
        sentence: 'Wash your ___!',
        translation: "Qo'llaringni yuv!",
        options: ['hands', 'books', 'bikes', 'stars'],
        correctAnswer: 'hands',
      },
    ],
  },

  // 8-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: '8-dars: Food & Drink (Ovqatlar va ichimliklar)',
    ruleTitle: '"I like..." — Menga yoqadi',
    explanation:
      "Yaxshi ko'rgan ovqatimizni aytish uchun 'I like ...' (Men ...ni yaxshi ko'raman) deymiz. Ichimliklar uchun esa 'I drink ...' (Men ... ichaman) iborasini ishlatamiz.",
    formulaOrRule: 'I like apples 🍎  |  I drink milk 🥛',
    exampleProblem: '🍌 "I ___ bananas."',
    exampleSolution: "I like bananas. (Men bananlarni yaxshi ko'raman.)",
    englishRounds: [
      {
        kind: 'match',
        instruction: "Ovqat va mevalarni inglizcha nomi bilan juftlang:",
        pairs: [
          { uz: '🍎 Olma', en: 'Apple' },
          { uz: '🍌 Banan', en: 'Banana' },
          { uz: '🍞 Non', en: 'Bread' },
          { uz: '🎂 Tort', en: 'Cake' },
        ],
      },
      {
        kind: 'fill',
        instruction: '"Men olmalarni yaxshi ko\'raman" gapini to\'ldiring:',
        sentence: 'I ___ apples.',
        translation: "Men olmalarni yaxshi ko'raman.",
        options: ['like', 'chair', 'ear', 'where'],
        correctAnswer: 'like',
      },
      {
        kind: 'match',
        instruction: "Ichimliklarni tarjimasi bilan juftlang:",
        pairs: [
          { uz: '🥛 Sut', en: 'Milk' },
          { uz: '💧 Suv', en: 'Water' },
          { uz: '🧃 Sharbat', en: 'Juice' },
          { uz: '🍵 Choy', en: 'Tea' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Ichimlik nomini topib gapni to'ldiring:",
        sentence: 'I drink ___.',
        translation: 'Men suv ichaman.',
        options: ['water', 'bread', 'chair', 'pencil'],
        correctAnswer: 'water',
      },
    ],
  },

  // 9-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: '9-dars: Actions & I can (Harakatlar va "Men qila olaman")',
    ruleTitle: '"I can..." — Men qila olaman!',
    explanation:
      "O'zimiz qila oladigan harakatlarni aytish uchun 'I can ...' (Men ... olaman) deymiz: I can run, I can jump, I can sing! Do'stlarga yordam berish esa: 'Help your friends!'",
    formulaOrRule: 'I can run! 🏃  |  I can jump! 🦘  |  Help your friends! 🤝',
    exampleProblem: '🎤 "I ___ sing." (Men kuylay olaman.)',
    exampleSolution: 'I can sing.',
    englishRounds: [
      {
        kind: 'match',
        instruction: "Harakatlarni inglizcha nomi bilan juftlang:",
        pairs: [
          { uz: '🏃 Yugurmoq', en: 'Run' },
          { uz: '🦘 Sakramoq', en: 'Jump' },
          { uz: '🏊 Suzmoq', en: 'Swim' },
          { uz: '🎤 Kuylamoq', en: 'Sing' },
        ],
      },
      {
        kind: 'fill',
        instruction: '"Men sakray olaman!" gapini to\'ldiring:',
        sentence: 'I ___ jump!',
        translation: 'Men sakray olaman!',
        options: ['can', 'milk', 'who', 'bed'],
        correctAnswer: 'can',
      },
      {
        kind: 'match',
        instruction: "Yana qiziqarli harakatlarni juftlang:",
        pairs: [
          { uz: '💃 Raqsga tushmoq', en: 'Dance' },
          { uz: "📖 O'qimoq", en: 'Read' },
          { uz: "⚽ O'ynamoq", en: 'Play' },
          { uz: '🤝 Yordam bermoq', en: 'Help' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Yaxshi odat haqidagi gapni to'ldiring:",
        sentence: '___ your friends!',
        translation: "Do'stlaringga yordam ber!",
        options: ['Help', 'Apple', 'Nose', 'Circle'],
        correctAnswer: 'Help',
      },
    ],
  },

  // 10-dars
  {
    subject: 'english',
    tier: 'elementary',
    grade: 1,
    topicTitle: '10-dars: Animals & Adjectives (Hayvonlar va sifatlar)',
    ruleTitle: 'Hayvonlar va ularni tasvirlash',
    explanation:
      "Hayvonlarni sifatlar bilan tasvirlaymiz: Big (katta), Small (kichik), Fast (tez), Happy (xursand). Masalan: The elephant is big! Barcha hayvonlarni asrash va hurmat qilish kerak.",
    formulaOrRule: '🐘 Big (Katta) · 🐭 Small (Kichik) · 🐆 Fast (Tez) · 😊 Happy (Xursand)',
    exampleProblem: '🐟 "The ___ can swim."',
    exampleSolution: 'The fish can swim. (Baliq suza oladi.)',
    englishRounds: [
      {
        kind: 'match',
        instruction: "Hayvonlarni inglizcha nomi bilan juftlang:",
        pairs: [
          { uz: '🐱 Mushuk', en: 'Cat' },
          { uz: '🐶 Kuchuk', en: 'Dog' },
          { uz: '🐦 Qush', en: 'Bird' },
          { uz: '🐟 Baliq', en: 'Fish' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Fil qanday hayvon? Mos sifatni tanlang:",
        sentence: 'The elephant is ___.',
        translation: 'Fil katta.',
        options: ['big', 'small', 'swim', 'tea'],
        correctAnswer: 'big',
      },
      {
        kind: 'match',
        instruction: "Sher va sifatlarni tarjimasi bilan juftlang:",
        pairs: [
          { uz: '🦁 Sher', en: 'Lion' },
          { uz: '🐘 Katta', en: 'Big' },
          { uz: '🐭 Kichik', en: 'Small' },
          { uz: '😊 Xursand', en: 'Happy' },
        ],
      },
      {
        kind: 'fill',
        instruction: "Qaysi hayvon ucha oladi?",
        sentence: 'The ___ can fly.',
        translation: 'Qush ucha oladi.',
        options: ['bird', 'fish', 'lion', 'desk'],
        correctAnswer: 'bird',
      },
    ],
  },
];
