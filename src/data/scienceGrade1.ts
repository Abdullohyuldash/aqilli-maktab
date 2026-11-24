import type { LessonPlan } from './curriculum';

export const SCIENCE_GRADE_1_LESSONS: LessonPlan[] = [
  // =========================================================================
  // 1-DARS: Mening Vatanim, mahallam va maktabim
  // O'yin: "Vatanimiz Ramzlari va Maktab Xaritasi" (flag_map)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'flag_map',
    topicTitle: '1-dars: Mening Vatanim, mahallam va maktabim',
    ruleTitle: 'Vatanimiz bayrog‘i va go‘zal odob',
    explanation:
      "Bizning jonajon Vatanimiz — go‘zal O‘zbekiston, poytaxtimiz esa Toshkent! Har tong maktabga borayotib kattalarga jilmayib «Assalomu alaykum!» desak, hammamizning kunimiz nurga to‘ladi.",
    formulaOrRule: '🇺🇿 Moviy · Oq · Qizil chiziqlar · Yashil  |  ✋ Kattalarga salom!',
    exampleProblem: '🇺🇿 Bayrog‘imizning eng tepasida qaysi rang turadi?',
    exampleSolution: 'Musaffo osmon kabi moviy (ko‘k) rang turadi!',
    scienceRounds: [
      {
        kind: 'flag_map',
        icon: 'globe',
        statement: 'O‘zbekiston bayrog‘ining ranglarini tartib bilan yig‘ib chiq!',
        options: ["Bayroq tayyor!"],
        correctAnswer: "Bayroq tayyor!",
        fact: "Bayrog‘imizda moviy — musaffo osmon, oq — tinchlik, qizil chiziqlar — hayotiy kuch, yashil esa go‘zal tabiat ramzidir!",
        teacherHint: "Tepadan pastga qara: avval osmon (Moviy), keyin tinchlik (Oq), oqning chetiga Qizil chiziqlar, pastga esa Yashil!",
        flagData: {
          mode: 'flag_builder',
        },
      },
      {
        kind: 'flag_map',
        icon: 'heart',
        statement: 'Maktabga ketayotib mahalladagi bobojonni ko‘rib qolding. Nima qilasan?',
        options: ['"Assalomu alaykum!" deb salom beraman', 'Indamay yugurib ketaman'],
        correctAnswer: '"Assalomu alaykum!" deb salom beraman',
        fact: "Kattalarga tabassum bilan salom berish — o‘zbek bolalarining eng chiroyli odobidir!",
        teacherHint: "Odobli bola har doim kattalarni ko‘rganda qo‘lini ko‘ksiga qo‘yib salom beradi.",
        flagData: {
          mode: 'school_map',
          mapScene: 'neighbor',
          npcEmoji: '👴',
          npcLabel: 'Mahalladagi bobojon',
          choices: [
            {
              id: 'greet',
              emoji: '✋😊',
              label: '"Assalomu alaykum!" deb salom beraman',
              isCorrect: true,
            },
            {
              id: 'ignore',
              emoji: '🏃💨',
              label: 'Indamay yugurib ketaman',
              isCorrect: false,
            },
          ],
        },
      },
      {
        kind: 'flag_map',
        icon: 'heart',
        statement: 'Maktab eshigiga yetib keldik! Sinfxonamizni qanday saqlaymiz?',
        options: ['Toza va tartibli saqlaymiz', 'Partaga rasm chizamiz'],
        correctAnswer: 'Toza va tartibli saqlaymiz',
        fact: "Maktab — bizning ikkinchi uyimiz, uni ozoda tutsak dars o‘tish yanada maroqli bo‘ladi!",
        teacherHint: "Sinfxona chiroyli va ozoda bo‘lsa, ustoz ham, do‘stlarimiz ham xursand bo‘ladi!",
        flagData: {
          mode: 'school_map',
          mapScene: 'school_gate',
          npcEmoji: '👩‍🏫',
          npcLabel: 'Ustoz va maktabimiz',
          choices: [
            {
              id: 'clean',
              emoji: '✨🏫',
              label: 'Toza va tartibli saqlaymiz',
              isCorrect: true,
            },
            {
              id: 'mess',
              emoji: '🖍️🪑',
              label: 'Partaga rasm chizamiz',
              isCorrect: false,
            },
          ],
        },
      },
      {
        kind: 'flag_map',
        icon: 'globe',
        statement: 'Vatanimiz xaritasida poytaxtimiz — eng katta bosh shaharni top!',
        options: ['Toshkent', 'Buxoro', 'Xiva'],
        correctAnswer: 'Toshkent',
        fact: "Toshkent — O‘zbekistonning go‘zal poytaxti! 1-sentabr esa Mustaqillik bayramimizdir.",
        teacherHint: "O‘zbekistonning bosh shahri «T» harfidan boshlanadi — Toshkent!",
        flagData: {
          mode: 'symbol_pick',
          mapScene: 'uzbekistan_map',
          choices: [
            { id: 'toshkent', emoji: '🏙️🌟', label: 'Toshkent', isCorrect: true },
            { id: 'tog', emoji: '🏔️', label: 'Baland tog‘', isCorrect: false },
            { id: 'chol', emoji: '🏜️', label: 'Qumli cho‘l', isCorrect: false },
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 2-DARS: O'simliklar, o'rmon va o'tloq
  // O'yin: "Sehrli Bog'bon (Tirik O'simlik)" (plant_lab)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'plant_lab',
    topicTitle: "2-dars: O'simliklar, o'rmon va o'tloq",
    ruleTitle: 'Sehrli urug‘ qanday unib chiqadi?',
    explanation:
      "Kichkina urug‘ tuproq ichida uxlab yotadi. Unga tiniq suv quyib, iliq quyosh nuri bersak — ildiz otib, yam-yashil barglar va chiroyli gul ochadi!",
    formulaOrRule: '🌱 Urug‘ + 💧 Suv + ☀️ Quyosh = 🌺 Go‘zal gul!',
    exampleProblem: '🌱 O‘simlik suvni qaysi qismi bilan ichadi?',
    exampleSolution: 'Yer ostidagi ildizi bilan naychadek shimib ichadi!',
    scienceRounds: [
      {
        kind: 'plant_lab',
        icon: 'leaf',
        statement: 'Gultuvakda urug‘cha uxlab yotibdi! Uni uyg‘otish uchun suv quy va quyosh nurini ber!',
        options: ['Urug‘ unib chiqdi!'],
        correctAnswer: 'Urug‘ unib chiqdi!',
        fact: "Suv va quyosh nuri birlashganda urug‘ ildiz otib, yashil niholga aylanadi!",
        teacherHint: "Avval 💧 Suv idishini bosib suv quy, keyin ☀️ Quyosh nurini chaqir!",
        plantData: {
          mode: 'grow_seed',
          initialStage: 'seed',
          requiredTools: ['water', 'sun'],
        },
      },
      {
        kind: 'plant_lab',
        icon: 'sun',
        statement: 'Niholchamiz katta bo‘lib gul ochmoqchi! Unga suv va quyosh nuri ber!',
        options: ['Gul ochildi!'],
        correctAnswer: 'Gul ochildi!',
        fact: "O‘simliklar quyosh nuridan kuch olib, chiroyli gullar ochadi va havoni tozalaydi.",
        teacherHint: "Niholga ham 💧 Suv, ham ☀️ Quyosh kerak — ikkalasini ham bosib ko‘r!",
        plantData: {
          mode: 'bloom_flower',
          initialStage: 'sprout',
          requiredTools: ['water', 'sun'],
        },
      },
      {
        kind: 'plant_lab',
        icon: 'sun',
        statement: 'Voy! Bulut quyoshni to‘sib qo‘ydi va gulcha so‘lib qoldi! Uni qutqar!',
        options: ['Gul jonlandi!'],
        correctAnswer: 'Gul jonlandi!',
        fact: "Quyosh nuri yetishmasa o‘simliklar tez so‘lib qoladi. Yorug‘lik — ularning eng sevimli taomi!",
        teacherHint: "Qorong‘i bulutni haydash uchun ☀️ Quyosh nuri tugmasini bos!",
        plantData: {
          mode: 'save_wilted',
          initialStage: 'wilted',
          requiredTools: ['sun'],
        },
      },
      {
        kind: 'plant_lab',
        icon: 'leaf',
        statement: 'Baland daraxtlar ko‘p o‘sadigan joy qaysi? To‘g‘ri rasmni tanla!',
        options: ["O'rmon", "O'tloq"],
        correctAnswer: "O'rmon",
        fact: "O‘rmonda baland daraxtlar, o‘tloqda esa mayin maysalar va dala gullari o‘sadi.",
        teacherHint: "Daraxtlar qalin va baland bo‘lib o‘sadigan joy — O‘rmon!",
        plantData: {
          mode: 'nature_spot',
          initialStage: 'sprout',
          spotOptions: [
            {
              id: 'forest',
              emoji: '🌲🌳🌲',
              label: "O'rmon",
              subtitle: 'Baland daraxtlar makoni',
              isCorrect: true,
            },
            {
              id: 'meadow',
              emoji: '🌼🌿🌷',
              label: "O'tloq",
              subtitle: 'Mayin o‘tlar va gullar',
              isCorrect: false,
            },
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 3-DARS: Hayvonlar, qushlar va baliqlar
  // O'yin: "Hayvonlar va Ularning Uyi" (animal_homes)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'animal_homes',
    topicTitle: '3-dars: Hayvonlar, qushlar va baliqlar',
    ruleTitle: 'Har bir jonivorning o‘z uyi bor!',
    explanation:
      "Qushchalar daraxtda in quradi, baliqchalar esa faqat tiniq suvda suzadi. Ayiq kabi yovvoyi hayvonlar o‘rmonda, mushukcha kabi uy hayvonlari esa bizning yonimizda yashaydi!",
    formulaOrRule: '🐦 In · 🐟 Hovuzcha · 🐻 O‘rmon · 🐱 Issiq uy',
    exampleProblem: '🐟 Baliqcha quruqlikda yashay oladimi?',
    exampleSolution: 'Yo‘q, baliqcha faqat suvda suzib, jabralari bilan nafas oladi!',
    scienceRounds: [
      {
        kind: 'animal_homes',
        icon: 'leaf',
        statement: 'Qushchani o‘z uyiga sudrab yoki bosib joylashtir!',
        options: ['Daraxtdagi in'],
        correctAnswer: 'Daraxtdagi in',
        fact: "Qushchalarning pat va qanotlari bor — ular baland daraxt shoxlarida shinam in quradi!",
        teacherHint: "Qushcha uchib daraxt shoxidagi iliq inga qo‘nadi! 🌳",
        animalData: {
          animalEmoji: '🐦',
          animalName: 'Qushcha',
          targetHabitatId: 'nest',
        },
      },
      {
        kind: 'animal_homes',
        icon: 'droplet',
        statement: 'Baliqcha uyini izlayapti! Uni o‘z uyiga olib bor!',
        options: ['Hovuzcha'],
        correctAnswer: 'Hovuzcha',
        fact: "Baliqlar suvda suzishni yaxshi ko‘radi va suv ichida nafas oladi!",
        teacherHint: "Baliqcha faqat moviy suvda — hovuzchada yashay oladi! 💧",
        animalData: {
          animalEmoji: '🐟',
          animalName: 'Baliqcha',
          targetHabitatId: 'pond',
        },
      },
      {
        kind: 'animal_homes',
        icon: 'leaf',
        statement: 'Polvon ayiqcha qayerda yashaydi? Uni uyiga joylashtir!',
        options: ["Qalin o'rmon"],
        correctAnswer: "Qalin o'rmon",
        fact: "Ayiq — yovvoyi hayvon. U qalin o‘rmonda yashab, rezavor meva va asal yeydi!",
        teacherHint: "Ayiq yovvoyi hayvon — uning uyi qalin yashil o‘rmon! 🌲",
        animalData: {
          animalEmoji: '🐻',
          animalName: 'Ayiq',
          targetHabitatId: 'forest',
        },
      },
      {
        kind: 'animal_homes',
        icon: 'heart',
        statement: 'Miyovlab turgan mushukchani issiq uyiga olib bor!',
        options: ['Issiq uy'],
        correctAnswer: 'Issiq uy',
        fact: "Mushuk, kuchuk va sigir — uy hayvonlari. Odamlar ularga g‘amxo‘rlik qiladi!",
        teacherHint: "Mushukcha odamlar bilan birga issiq va shinam uyda yashaydi! 🏠",
        animalData: {
          animalEmoji: '🐱',
          animalName: 'Mushukcha',
          targetHabitatId: 'house',
        },
      },
    ],
  },

  // =========================================================================
  // 4-DARS: Taqvim, yil fasllari va qish
  // O'yin: "Fasllar Charxpalagi" (seasons_wheel)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'seasons_wheel',
    topicTitle: '4-dars: Taqvim, yil fasllari va qish',
    ruleTitle: 'Bir yilda 4 go‘zal fasl bor!',
    explanation:
      "Tabiat bir yilda 4 marta libosini almashtiradi: bahorda gullar ochiladi, yozda quyosh charaqlaydi, kuzda barglar oltin rangga kiradi, qishda esa oppoq qor yog‘adi!",
    formulaOrRule: '🌸 Bahor · 🍏 Yoz · 🍂 Kuz · ❄️ Qish  (1 yil = 12 oy)',
    exampleProblem: '❄️ Qorboboni qaysi faslda yasaymiz?',
    exampleSolution: 'Oppoq qor yog‘adigan qish faslida!',
    scienceRounds: [
      {
        kind: 'seasons_wheel',
        icon: 'droplet',
        statement: 'Qorboboni qaysi faslga qo‘yamiz? To‘g‘ri fasl daraxtini tanla!',
        options: ['Qish'],
        correctAnswer: 'Qish',
        fact: "Qishda havo sovuq bo‘ladi, qor yog‘adi va biz issiq sharf-qo‘lqop kiyamiz!",
        teacherHint: "Qorbobo qordan yasaladi — oppoq qorli ❄️ Qish faslini tanla!",
        seasonData: {
          itemEmoji: '⛄',
          itemLabel: 'Qorbobo',
          targetSeason: 'winter',
        },
      },
      {
        kind: 'seasons_wheel',
        icon: 'leaf',
        statement: 'Sariq xazon barglarni qaysi faslga joylashtiramiz?',
        options: ['Kuz'],
        correctAnswer: 'Kuz',
        fact: "Kuzda daraxt barglari sariq va to‘q sariq rangga kirib, yerga sekin to‘kiladi.",
        teacherHint: "Barglar oltin rangga bo‘yaladigan fasl — 🍂 Kuz!",
        seasonData: {
          itemEmoji: '🍂',
          itemLabel: 'Sariq xazonlar',
          targetSeason: 'autumn',
        },
      },
      {
        kind: 'seasons_wheel',
        icon: 'sun',
        statement: 'Cho‘milish kiyimi va quyosh ko‘zoynagini qaysi faslga qo‘yamiz?',
        options: ['Yoz'],
        correctAnswer: 'Yoz',
        fact: "Yoz — yilning eng issiq va quyoshli fasli! Bu paytda mevalar pishib, bolalar ta'til qiladi.",
        teacherHint: "Eng issiq va quyoshli fasl qaysi? Albatta 🍏 Yoz!",
        seasonData: {
          itemEmoji: '🩳',
          itemLabel: 'Cho‘milish kiyimi',
          targetSeason: 'summer',
        },
      },
      {
        kind: 'seasons_wheel',
        icon: 'leaf',
        statement: 'Ilk gullagan lola va boychechaklarni qaysi faslga qo‘yamiz?',
        options: ['Bahor'],
        correctAnswer: 'Bahor',
        fact: "Bahorda tabiat uyg‘onadi, daraxtlar pushti gullarga burkanib, qushlar uchib keladi!",
        teacherHint: "Gullar ochilib, tabiat uyg‘onadigan fasl — 🌸 Bahor!",
        seasonData: {
          itemEmoji: '🌷',
          itemLabel: 'Bahor gullari',
          targetSeason: 'spring',
        },
      },
    ],
  },

  // =========================================================================
  // 5-DARS: Suvning holatlari va tabiat hodisalari
  // O'yin: "Suvning 3 Sehrli Holati (Muz, Suv, Bug')" (water_states)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'water_states',
    topicTitle: '5-dars: Suvning holatlari va tabiat hodisalari',
    ruleTitle: 'Sehrgar suvning 3 ko‘rinishi!',
    explanation:
      "Suv xuddi sehrgarga o‘xshaydi: sovuqda qattiq muzga aylanadi, iliqda shaffof suyuq suv bo‘ladi, qattiq qizisa esa yengil bug‘ bo‘lib osmonga bulut yaratish uchun uchadi!",
    formulaOrRule: '🧊 Sovuq → Muz  |  💧 Iliq → Suv  |  🔥 Issiq → Bug‘ ☁️',
    exampleProblem: '🧊 Muz bo‘lagini issiq olov yoniga qo‘ysak nima bo‘ladi?',
    exampleSolution: 'U erib, shaffof suyuq suvga aylanadi!',
    scienceRounds: [
      {
        kind: 'water_states',
        icon: 'droplet',
        statement: 'Muz bo‘lagini iliq haroratda eritib, shaffof suyuq suvga aylantir!',
        options: ['Suyuq suv'],
        correctAnswer: 'Suyuq suv',
        fact: "Muz isiganda erib, biz ichadigan tiniq suyuq suvga aylanadi!",
        teacherHint: "Haroratni «💧 Iliq xona» tomoniga surib, muzni eritib ko‘r!",
        waterData: {
          startTemp: -10,
          targetState: 'liquid',
          taskHint: 'Muzni eritib suyuq suvga aylantir!',
        },
      },
      {
        kind: 'water_states',
        icon: 'flame',
        statement: 'Suvni yanada qizdirib, bug‘ va oppoq bulut hosil qil!',
        options: ["Bug' va bulut"],
        correctAnswer: "Bug' va bulut",
        fact: "Suv qaynaganda bug‘ga aylanib yuqoriga ko‘tariladi va osmonda bulutlar hosil qiladi!",
        teacherHint: "Olovni yoqish uchun haroratni «🔥 Qaynoq olov» (100°C) ga ko‘tar!",
        waterData: {
          startTemp: 22,
          targetState: 'steam',
          taskHint: 'Olovni yoqib suvni bug‘ga aylantir!',
        },
      },
      {
        kind: 'water_states',
        icon: 'droplet',
        statement: 'Endi suyuq suvni muzlatgichga solib, qattiq muzga aylantir!',
        options: ['Qattiq muz'],
        correctAnswer: 'Qattiq muz',
        fact: "Harorat 0°C dan pastga tushganda suv qotib, yaltiroq qattiq muzga aylanadi!",
        teacherHint: "Haroratni chapga — «❄️ Muzlatgich» (-10°C) tomoniga tushir!",
        waterData: {
          startTemp: 24,
          targetState: 'ice',
          taskHint: 'Suvni sovutib muzlat!',
        },
      },
      {
        kind: 'water_states',
        icon: 'sun',
        statement: 'Osmondagi issiq bug‘ni salqinlatib, yana toza suv tomchilariga aylantir!',
        options: ['Suyuq suv'],
        correctAnswer: 'Suyuq suv',
        fact: "Tabiatda bulutlar sovuganda yomg‘ir bo‘lib yerga yog‘adi — bu suvning sehrli aylanishidir!",
        teacherHint: "Issiq bug‘ni «💧 Iliq xona» haroratiga tushirsang, u yana suvga aylanadi!",
        waterData: {
          startTemp: 100,
          targetState: 'liquid',
          taskHint: 'Bug‘ni sovutib tiniq suvga aylantir!',
        },
      },
    ],
  },

  // =========================================================================
  // 6-DARS: Qog'oz, idishlar va non
  // O'yin: "Bug'doydan Dasturxongacha (Non Zanjiri)" (bread_chain)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'bread_chain',
    topicTitle: "6-dars: Qog'oz, idishlar va non",
    ruleTitle: 'Aziz nonimiz va qog‘oz qanday tayyorlanadi?',
    explanation:
      "Dasturxonimizdagi issiq non avval dalada bug‘doy bo‘lib o‘sadi, tegirmonda un bo‘ladi va tandirda pishadi! Daftar qog‘ozi esa daraxtlardan tayyorlanadi, shuning uchun nonni ham, qog‘ozni ham asraymiz.",
    formulaOrRule: '🌾 Bug‘doy ➔ 🥡 Un ➔ 🥖 Tandir non  |  🌳 Daraxt ➔ 📄 Qog‘oz',
    exampleProblem: '🥖 Non ushog‘ini yerga tushirsak nima qilamiz?',
    exampleSolution: 'Uni darhol e’zozlab olib, qushchalarga beramiz — nonni aslo isrof qilmaymiz!',
    scienceRounds: [
      {
        kind: 'bread_chain',
        icon: 'sun',
        statement: 'Non qanday paydo bo‘ladi? Bosqichlarni 1 → 2 → 3 tartibida terib chiq!',
        options: ['Non zanjiri tayyor!'],
        correctAnswer: 'Non zanjiri tayyor!',
        fact: "Bitta issiq non dasturxonimizga kelgunicha dehqon, tegirmonchi va novvoy ko‘p mehnat qiladi!",
        teacherHint: "Avval daladagi 🌾 Bug‘doyni, keyin 🥡 Unni, oxirida 🥖 Tandir nonini bos!",
        breadData: {
          mode: 'order_chain',
          steps: [
            { id: 'wheat', emoji: '🌾', label: 'Dala bug‘doyi' },
            { id: 'flour', emoji: '🥡', label: 'Tegirmonda un' },
            { id: 'bread', emoji: '🥖', label: 'Tandirda non' },
          ],
        },
      },
      {
        kind: 'bread_chain',
        icon: 'heart',
        statement: 'Issiq nonni dasturxonga qo‘yish odobini to‘g‘ri tartibda joylashtir!',
        options: ['Odob zanjiri tayyor!'],
        correctAnswer: 'Odob zanjiri tayyor!',
        fact: "O‘zbek xalqida non — eng aziz ne'mat! Nonni doimo e'zozlab ikki qo‘l bilan ushlaymiz.",
        teacherHint: "Avval 🧼 Qo‘l yuvamiz, keyin 🥖 Nonni dasturxonga qo‘yamiz, oxirida 🐦 Ushog‘ini qushlarga beramiz!",
        breadData: {
          mode: 'order_chain',
          steps: [
            { id: 'wash', emoji: '🧼', label: 'Qo‘lni yuvish' },
            { id: 'serve', emoji: '🥖', label: 'E’zozlab qo‘yish' },
            { id: 'respect', emoji: '🐦', label: 'Ushog‘ini asrash' },
          ],
        },
      },
      {
        kind: 'bread_chain',
        icon: 'leaf',
        statement: 'Daftarimizdagi qog‘oz qanday tayyorlanadi? Zanjirni to‘g‘ri ter!',
        options: ['Qog‘oz zanjiri tayyor!'],
        correctAnswer: 'Qog‘oz zanjiri tayyor!',
        fact: "Qog‘oz daraxt yog‘ochidan qilinadi — daftarimizni toza tutsak, o‘rmonlarni saqlab qolamiz!",
        teacherHint: "Avval 🌳 Yashil daraxt, keyin 🏭 Qog‘oz zavodi, oxirida 📖 Daftar va kitob!",
        breadData: {
          mode: 'order_chain',
          steps: [
            { id: 'tree', emoji: '🌳', label: 'Yashil daraxt' },
            { id: 'factory', emoji: '🏭', label: 'Qog‘oz zavodi' },
            { id: 'book', emoji: '📖', label: 'Daftar va kitob' },
          ],
        },
      },
      {
        kind: 'bread_chain',
        icon: 'heart',
        statement: 'Dasturxonda va darsda qaysi odat eng to‘g‘ri?',
        options: ['Nonni e’zozlaymiz, qog‘ozni tejaymiz', 'Daftar varaqlarini yirtib o‘ynaymiz'],
        correctAnswer: 'Nonni e’zozlaymiz, qog‘ozni tejaymiz',
        fact: "Barakalla! Nonni e'zozlagan va qog‘ozni tejagan bola ham tabiatga, ham insonlar mehnatiga hurmat ko‘rsatadi.",
        teacherHint: "Qog‘ozni bekorga yirtsak daraxtlar xafa bo‘ladi. To‘g‘ri odobni tanla!",
        breadData: {
          mode: 'etiquette_pick',
          etiquetteChoices: [
            {
              id: 'good',
              emoji: '🥖📖✨',
              label: 'Nonni e’zozlaymiz, qog‘ozni tejaymiz',
              isCorrect: true,
            },
            {
              id: 'bad',
              emoji: '📄✂️🗑️',
              label: 'Daftar varaqlarini yirtib o‘ynaymiz',
              isCorrect: false,
            },
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 7-DARS: Mening xavfsiz uyim va telefon
  // O'yin: "Xavfsiz Uy Posboni va Tezkor Raqamlar" (safety_home)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'safety_home',
    topicTitle: '7-dars: Mening xavfsiz uyim va telefon',
    ruleTitle: 'Uydagi xavfsizlik va sehrli 101 / 103 raqamlari',
    explanation:
      "Uyda kitob va o‘yinchoqlar bilan bemalol o‘ynash mumkin, ammo gugurt va elektr rozetkasiga aslo tegib bo‘lmaydi! Xavf tug‘ilsa darhol kattalarga aytamiz yoki 101 va 103 tezkor raqamlarini teramiz.",
    formulaOrRule: '🚫 Gugurt 🔥 · Rozetka ⚡  |  🚒 101 — Yong‘in  ·  🚑 103 — Tez yordam',
    exampleProblem: '🚑 Kimdir mazasi qochib qolsa, qaysi tezkor raqamni teramiz?',
    exampleSolution: 'Tez yordam raqami — 103 ni teramiz!',
    scienceRounds: [
      {
        kind: 'safety_home',
        icon: 'flame',
        statement: 'Stol ustida gugurt turibdi! Bu narsa bilan o‘ynash xavflimi yoki xavfsizmi?',
        options: ['Xavfli 🚫', 'Xavfsiz ✅'],
        correctAnswer: 'Xavfli 🚫',
        fact: "Gugurt va olov bilan aslo o‘ynab bo‘lmaydi — kichik uchqundan katta yong‘in chiqishi mumkin!",
        teacherHint: "Olov kuydiradi va yong‘in chiqaradi — demak gugurt juda XAVFLI! 🚫",
        safetyData: {
          mode: 'sort_hazard',
          itemEmoji: '🔥',
          itemLabel: 'Gugurt va olov',
          isDangerous: true,
        },
      },
      {
        kind: 'safety_home',
        icon: 'zap',
        statement: 'Devordagi elektr rozetkasiga qo‘l yoki temir narsa tiqish mumkinmi?',
        options: ['Xavfli 🚫', 'Xavfsiz ✅'],
        correctAnswer: 'Xavfli 🚫',
        fact: "Rozetka ichida kuchli elektr toki bor! Ayniqsa ho‘l qo‘l bilan unga aslo yaqinlashmang.",
        teacherHint: "Elektr toki juda xavfli — rozetkaga tegish qat’iyan TAQIQLANGAN! 🚫",
        safetyData: {
          mode: 'sort_hazard',
          itemEmoji: '⚡',
          itemLabel: 'Elektr rozetkasi',
          isDangerous: true,
        },
      },
      {
        kind: 'safety_home',
        icon: 'heart',
        statement: 'Rangli ertak kitobi va yumshoq ayiqcha xavflimi yoki xavfsizmi?',
        options: ['Xavfli 🚫', 'Xavfsiz ✅'],
        correctAnswer: 'Xavfsiz ✅',
        fact: "Kitob o‘qish va o‘yinchoqlar bilan o‘ynash — eng foydali va xavfsiz mashg‘ulotdir!",
        teacherHint: "Kitob va o‘yinchoqlar sening do‘stlaring — ular butunlay XAVFSIZ! ✅",
        safetyData: {
          mode: 'sort_hazard',
          itemEmoji: '📚🧸',
          itemLabel: 'Kitob va o‘yinchoqlar',
          isDangerous: false,
        },
      },
      {
        kind: 'safety_home',
        icon: 'flame',
        statement: 'Telefonda Tez yordam (103) raqamini terib, shifokorni chaqir!',
        options: ['103'],
        correctAnswer: '103',
        fact: "Esda tut: 101 — O‘t o‘chiruvchi 🚒, 102 — Militsiya 🚓, 103 — Tez yordam 🚑!",
        teacherHint: "Klaviatura tugmalaridan ketma-ket 1, 0, 3 raqamlarini bosib 📞 qo‘ng‘iroq qil!",
        safetyData: {
          mode: 'dial_phone',
          emergencyEmoji: '🚑',
          emergencyLabel: 'Tez yordam (103) — Shifokor chaqirish',
          targetNumber: '103',
        },
      },
      {
        kind: 'safety_home',
        icon: 'flame',
        statement: 'Endi O‘t o‘chiruvchini chaqirish uchun telefonda 101 raqamini ter!',
        options: ['101'],
        correctAnswer: '101',
        fact: "Barakalla! Yong‘in xavfi bo‘lsa darhol kattalarga aytamiz va 101 raqamiga qo‘ng‘iroq qilamiz!",
        teacherHint: "O‘t o‘chiruvchi raqami — 1, 0, 1! Shu raqamlarni terib 📞 tugmasini bos!",
        safetyData: {
          mode: 'dial_phone',
          emergencyEmoji: '🚒',
          emergencyLabel: 'O‘t o‘chiruvchi (101)',
          targetNumber: '101',
        },
      },
    ],
  },

  // =========================================================================
  // 8-DARS: Transport turlari va yo'lda xavfsizlik
  // O'yin: "Aqlli Svetofor va Piyodalar Yo'lagi" (traffic_light)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'traffic_light',
    topicTitle: "8-dars: Transport turlari va yo'lda xavfsizlik",
    ruleTitle: 'Svetoforning 3 aqlli ko‘zi va transportlar',
    explanation:
      "Ko‘chadagi aqlli svetofor bizni himoya qiladi: qizilda to‘xtaymiz, sariqda kutamiz, yashil yonganda esa piyodalar yo‘lagidan o‘tamiz! Mashina yo‘lda, kema suvda, samolyot esa osmonda yuradi.",
    formulaOrRule: '🔴 To‘xta! · 🟡 Kutib tur! · 🟢 O‘t!  |  ✈️ Havo · 🚢 Suv · 🚌 Yo‘l',
    exampleProblem: '🟢 Qaysi chiroq yonganda piyodalar yo‘lagidan xavfsiz o‘tamiz?',
    exampleSolution: 'Yashil chiroq yonganda, avval chap va o‘ngga qarab o‘tamiz!',
    scienceRounds: [
      {
        kind: 'traffic_light',
        icon: 'zap',
        statement: 'Yo‘lda mashinalar tez yurmoqda! O‘quvchini to‘xtatish uchun svetoforning qaysi chirog‘ini yoqamiz?',
        options: ['Qizil'],
        correctAnswer: 'Qizil',
        fact: "Qizil chiroq — «To‘xta!» degani. Bu paytda yo‘lga chiqish qat’iyan mumkin emas!",
        teacherHint: "«To‘xta!» degan belgi har doim eng tepadagi 🔴 Qizil chiroqdir!",
        trafficData: {
          mode: 'signal_pick',
          targetLight: 'red',
          scenarioLabel: 'Mashinalar tez yurmoqda — TO‘XTA!',
        },
      },
      {
        kind: 'traffic_light',
        icon: 'zap',
        statement: 'Chiroq almashishiga oz qoldi! Tayyorlanib kutib turish uchun qaysi chiroq yonadi?',
        options: ['Sariq'],
        correctAnswer: 'Sariq',
        fact: "Sariq chiroq — «Diqqat, kutib tur!» degani. Mashinalar sekinlashadi, biz esa tayyor turamiz.",
        teacherHint: "O‘rtadagi 🟡 Sariq chiroq «Kutib tur va diqqat qil!» deb ogohlantiradi.",
        trafficData: {
          mode: 'signal_pick',
          targetLight: 'yellow',
          scenarioLabel: 'Diqqat — tayyorlanib KUTIB TUR!',
        },
      },
      {
        kind: 'traffic_light',
        icon: 'zap',
        statement: 'Mashinalar to‘xtadi! O‘quvchi piyodalar yo‘lagidan xavfsiz o‘tishi uchun qaysi chiroqni bosamiz?',
        options: ['Yashil'],
        correctAnswer: 'Yashil',
        fact: "Yashil chiroq yonganda oq chiziqli «zebra» piyodalar yo‘lagidan xotirjam va xavfsiz o‘tamiz!",
        teacherHint: "Yo‘l ochiq! Eng pastdagi 🟢 Yashil chiroqni bos!",
        trafficData: {
          mode: 'signal_pick',
          targetLight: 'green',
          scenarioLabel: 'Piyodalar yo‘lagidan XAVFSIZ O‘T!',
        },
      },
      {
        kind: 'traffic_light',
        icon: 'globe',
        statement: 'Samolyot qaysi transport turiga kiradi? Uni o‘z yo‘liga joylashtir!',
        options: ['Havo transporti'],
        correctAnswer: 'Havo transporti',
        fact: "Samolyot va vertolyot bulutlar orasida uchuvchi havo transportidir!",
        teacherHint: "Samolyot qanotlari bilan osmonda — ☁️ Havo yo‘lida uchadi!",
        trafficData: {
          mode: 'transport_lane',
          vehicleEmoji: '✈️',
          vehicleLabel: 'Samolyot',
          targetLane: 'air',
        },
      },
    ],
  },

  // =========================================================================
  // 9-DARS: Gigiyena, foydali taomlar va uyqu
  // O'yin: "Toza Qo'llar va Vitaminlar Qahramoni" (clean_hands)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'clean_hands',
    topicTitle: '9-dars: Gigiyena, foydali taomlar va uyqu',
    ruleTitle: 'Toza qo‘llar, vitaminli taom va shirin uyqu',
    explanation:
      "Sovun ko‘pigi yomon mikroblarni quvib soladi, kuniga 2 marta tish yuvish esa tabassumimizni yarqiratadi! Meva-sabzavotlar va tiniq uyqu bizni polvondek baquvvat qiladi.",
    formulaOrRule: '🧼 Sovun = Tozalik  ·  🍎🥕🥛 Vitaminlar  ·  😴 Tiniq uyqu',
    exampleProblem: '🧼 Ovqatdan oldin nima uchun qo‘limizni sovunlab yuvamiz?',
    exampleSolution: 'Ko‘zga ko‘rinmas mikroblarni butunlay yo‘qotish uchun!',
    scienceRounds: [
      {
        kind: 'clean_hands',
        icon: 'droplet',
        statement: 'Ovqatdan oldin qo‘ldagi barcha mikroblarni 🧼 sovun bilan bosib tozalab tashla!',
        options: ['Qo‘llar yaraqladi!'],
        correctAnswer: 'Qo‘llar yaraqladi!',
        fact: "Sovun ko‘pigi ko‘rinmas mikroblarni bir zumda yuvib ketadi — toza qo‘l sog‘liq garovidir!",
        teacherHint: "Qo‘l ustidagi har bir yashil mikrobchani bosib, sovun ko‘pigi bilan yo‘q qil! 🫧",
        cleanData: {
          mode: 'wash_hands',
        },
      },
      {
        kind: 'clean_hands',
        icon: 'leaf',
        statement: 'Tushlik laganiga faqat foydali vitaminli taomlarni yig‘! Zararlilarini chetda qoldir!',
        options: ['Vitaminli lagan tayyor!'],
        correctAnswer: 'Vitaminli lagan tayyor!',
        fact: "Olma, sabzi va sutda o‘sishimiz uchun juda kerakli vitaminlar bor. Gazli ichimlik va chips esa zararli!",
        teacherHint: "🍎 Olma, 🥕 Sabzi va 🥛 Sutni bosib laganga sol — gazli ichimlik va chipsga tegma!",
        cleanData: {
          mode: 'healthy_plate',
          foods: [
            { id: 'apple', emoji: '🍎', label: 'Olma', healthy: true },
            { id: 'soda', emoji: '🥤', label: 'Gazli ichimlik', healthy: false },
            { id: 'carrot', emoji: '🥕', label: 'Sabzi', healthy: true },
            { id: 'chips', emoji: '🍟', label: 'Chips', healthy: false },
            { id: 'milk', emoji: '🥛', label: 'Sut', healthy: true },
          ],
        },
      },
      {
        kind: 'clean_hands',
        icon: 'heart',
        statement: 'Tishchamizni 🪥 cho‘tka bilan kuniga 2 marta tozalab, yaltiroq oq qilaylik!',
        options: ['Tishlar yarqiradi!'],
        correctAnswer: 'Tishlar yarqiradi!',
        fact: "Ertalab nonushtadan so‘ng va kechqurun uxlashdan oldin tish yuvsak, tishlarimiz hech qachon og‘rimaydi!",
        teacherHint: "Tishdagi barcha dog‘chalarni 🪥 cho‘tka bilan bosib tozalab chiq!",
        cleanData: {
          mode: 'brush_teeth',
        },
      },
      {
        kind: 'clean_hands',
        icon: 'heart',
        statement: 'Kechki sog‘lom odatlarni laganga tanla: foydali mevalar va shirin uyqu!',
        options: ['Sog‘lom odatlar tayyor!'],
        correctAnswer: 'Sog‘lom odatlar tayyor!',
        fact: "Bolalar aynan kechasi vaqtida va tinch uxlaganda eng tez o‘sadi va kuch yig‘adi!",
        teacherHint: "🍌 Banan, 🥦 Brokkoli va 😴 Vaqtida uxlashni tanla — kechasi ko‘p konfet zararli!",
        cleanData: {
          mode: 'healthy_plate',
          foods: [
            { id: 'banana', emoji: '🍌', label: 'Banan', healthy: true },
            { id: 'candy', emoji: '🍬', label: 'Ko‘p konfet', healthy: false },
            { id: 'broccoli', emoji: '🥦', label: 'Brokkoli', healthy: true },
            { id: 'sleep', emoji: '😴', label: 'Tiniq uyqu', healthy: true },
            { id: 'cola', emoji: '🧋', label: 'Shirin gazli suv', healthy: false },
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 10-DARS: Sport, sog'liq va tabiatni asrash
  // O'yin: "Yashil Sayyora (Eko-Patrul)" (eco_patrol)
  // =========================================================================
  {
    subject: 'science',
    tier: 'elementary',
    grade: 1,
    scienceGameType: 'eco_patrol',
    topicTitle: "10-dars: Sport, sog'liq va tabiatni asrash",
    ruleTitle: 'Eko-Patrul: chiqindini sarala va ko‘chat ek!',
    explanation:
      "Ertalabki badantarbiya tanamizni chiniqtiradi, toza tabiat esa bizga musaffo havo beradi. Chiqindilarni o‘z qutisiga tashlab, ko‘chat eksak — sayyoramiz yam-yashil bog‘ga aylanadi!",
    formulaOrRule: '📄 Qog‘oz · 🧴 Plastik · 🍾 Shisha  |  🌱 Ko‘chat ek + 💧 Suv quy!',
    exampleProblem: '🌳 Tabiatga yordam berish uchun nima qilamiz?',
    exampleSolution: 'Chiqindini saralab qutiga tashlaymiz va yosh ko‘chat ekib parvarishlaymiz!',
    scienceRounds: [
      {
        kind: 'eco_patrol',
        icon: 'leaf',
        statement: 'Eko-Patrul! G‘ijimlangan qog‘ozni to‘g‘ri saralash qutisiga tashla!',
        options: ['Qog‘oz qutisi'],
        correctAnswer: 'Qog‘oz qutisi',
        fact: "Saralangan qog‘oz qayta ishlanib yangi daftarlarga aylanadi — shunda daraxtlar kesilmaydi!",
        teacherHint: "G‘ijimlangan qog‘ozni ko‘k rangli «📄 Qog‘oz» qutisiga tashla!",
        ecoData: {
          mode: 'recycle_sort',
          trashEmoji: '📄',
          trashLabel: 'G‘ijimlangan qog‘oz',
          targetBin: 'paper',
        },
      },
      {
        kind: 'eco_patrol',
        icon: 'leaf',
        statement: 'Bo‘sh plastik suv idishini qaysi qutiga tashlaymiz?',
        options: ['Plastik qutisi'],
        correctAnswer: 'Plastik qutisi',
        fact: "Plastik idishlar tabiatda yuzlab yil chirimaydi, uni maxsus qutiga tashlasak qayta ishlanadi!",
        teacherHint: "Plastik butilkani sariq rangli «🧴 Plastik» qutisiga tashla!",
        ecoData: {
          mode: 'recycle_sort',
          trashEmoji: '🧴',
          trashLabel: 'Bo‘sh plastik idish',
          targetBin: 'plastic',
        },
      },
      {
        kind: 'eco_patrol',
        icon: 'leaf',
        statement: 'Bo‘sh shisha idishni ehtiyotkorlik bilan o‘z qutisiga joylashtir!',
        options: ['Shisha qutisi'],
        correctAnswer: 'Shisha qutisi',
        fact: "Shisha idishlarni qayta eritib yangi idishlar yasash mumkin — tabiatimiz doim pokiza qoladi!",
        teacherHint: "Shisha idishni yashil rangli «🍾 Shisha» qutisiga tashla!",
        ecoData: {
          mode: 'recycle_sort',
          trashEmoji: '🍾',
          trashLabel: 'Bo‘sh shisha idish',
          targetBin: 'glass',
        },
      },
      {
        kind: 'eco_patrol',
        icon: 'sun',
        statement: 'Yakuniy missiya! Bog‘imizga yangi ko‘chat ekib, unga suv quy va katta daraxt o‘stir!',
        options: ['Daraxt o‘sdi!'],
        correctAnswer: 'Daraxt o‘sdi!',
        fact: "Har bir ekilgan nihol kelajakda soya, meva va toza havo beradigan ulkan daraxtga aylanadi! Barakalla, Eko-Qahramon!",
        teacherHint: "Ketma-ket 3 tugmani bos: 🌱 Ko‘chat ek ➔ 💧 Suv quy ➔ ☀️ Quyosh ber!",
        ecoData: {
          mode: 'plant_sapling',
        },
      },
    ],
  },
];
