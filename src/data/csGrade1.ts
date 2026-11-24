import type { LessonPlan } from './curriculum';

export const CS_GRADE_1_LESSONS: LessonPlan[] = [
  // =========================================================================
  // 1-DARS: Sezgi a'zolari — Ko'rish va eshitish (Axborot qabul qilish)
  // O'yin: "Sehrli Durbin va Quloqchin" (senses_sorter)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'senses_sorter',
    topicTitle: "1-dars: Sezgi a'zolari — Ko'rish va eshitish",
    ruleTitle: 'Sehrli durbin va quloqchin siri!',
    explanation:
      "Atrofimizdagi rangli olamni ko‘zimiz bilan ko‘rib, qushlar sayrashi va musiqani quloqlarimiz bilan eshitib bilib olamiz! Bularning hammasi biz oladigan qiziqarli axborotdir.",
    formulaOrRule: '👁️ Rang va shakl = Ko‘rish  |  👂 Tovush va musiqa = Eshitish',
    exampleProblem: '🔔 Maktab qo‘ng‘irog‘i jiringlaganini qaysi a’zo bilan bilamiz?',
    exampleSolution: '👂 Quloqimiz bilan eshitib bilamiz!',
    csRounds: [
      {
        kind: 'senses_sorter',
        prompt: 'Quloqchinni bosib tingla! Bu qanday axborot — uni to‘g‘ri a’zoga ula!',
        explanation: 'Qushlarning chiroyli sayrashini quloqlarimiz bilan eshitamiz — bu tovush axboroti!',
        teacherHint: 'Quloqchin tugmasini bosib ovozni eshitib ko‘r! Tovushni 👂 Quloq qabul qiladi.',
        sensesData: {
          mode: 'audio',
          clueEmoji: '🐦🎵',
          clueTitle: 'Qushcha sayrashi',
          clueSubtitle: 'Tovushni eshitish uchun quloqchinni bos!',
          soundKind: 'bird',
          targetSense: 'ear',
        },
      },
      {
        kind: 'senses_sorter',
        prompt: 'Sehrli durbindan qara! Rang-barang kamalakni qaysi a’zomiz bilan qabul qilamiz?',
        explanation: 'Kamalakning 7 ta yorqin rangini ko‘zlarimiz bilan ko‘ramiz — bu ko‘rish axboroti!',
        teacherHint: 'Ranglarni va rasmlarni biz 👁️ Ko‘zimiz bilan ko‘ramiz!',
        sensesData: {
          mode: 'visual',
          clueEmoji: '🌈',
          clueTitle: 'Rang-barang kamalak',
          clueSubtitle: 'Durbinda yorqin ranglar porlayapti!',
          visualKind: 'rainbow',
          targetSense: 'eye',
        },
      },
      {
        kind: 'senses_sorter',
        prompt: 'Jiring-jiring! Maktab qo‘ng‘irog‘i chalinyapti — uni qaysi a’zoga ulaymiz?',
        explanation: 'Qo‘ng‘iroq ovozi — tovush axboroti! Uni 👂 quloqimiz darhol eshitadi.',
        teacherHint: 'Jiringlagan ovozni quloqchin orqali eshitdik — demak 👂 Quloq!',
        sensesData: {
          mode: 'audio',
          clueEmoji: '🔔✨',
          clueTitle: 'Maktab qo‘ng‘irog‘i',
          clueSubtitle: 'Qo‘ng‘iroq ovozini tinglash uchun bos!',
          soundKind: 'bell',
          targetSense: 'ear',
        },
      },
      {
        kind: 'senses_sorter',
        prompt: 'Durbindagi rangli shakllarga qara! Shakl va rangni qaysi a’zo aniqlaydi?',
        explanation: 'Uchburchak, kvadrat va doira shakllarini 👁️ ko‘zimiz yordamida ajratamiz!',
        teacherHint: 'Shakllar va ranglarni ko‘rish uchun bizga 👁️ Ko‘z yordam beradi.',
        sensesData: {
          mode: 'visual',
          clueEmoji: '🔺🟨🔵',
          clueTitle: 'Rangli shakllar',
          clueSubtitle: 'Qizil, sariq va ko‘k shakllarni ko‘ryapmiz!',
          visualKind: 'shapes',
          targetSense: 'eye',
        },
      },
    ],
  },

  // =========================================================================
  // 2-DARS: Hid, ta'm, his-tuyg'u va tavsiflash
  // O'yin: "Sehrli Konveyer (Belgilari bo'yicha top)" (taste_conveyor)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'taste_conveyor',
    topicTitle: "2-dars: Hid, ta'm, his-tuyg'u va tavsiflash",
    ruleTitle: 'Ta’m, hid va ushlab sezish!',
    explanation:
      "Shirin muzqaymoqni tilimiz bilan, xushbo‘y atirgulni burnimiz bilan, tikanli kirpini esa qo‘limiz (terimiz) bilan sezamiz! Har bir buyumni o‘z belgisidan tanib olamiz.",
    formulaOrRule: '👅 Ta’m (shirin) · 👃 Hid (xushbo‘y) · ✋ Teri (tikanli/yumshoq)',
    exampleProblem: '🌸 Atirgulning xushbo‘y hidini qaysi a’zo biladi?',
    exampleSolution: '👃 Burnimiz bilan hidlab bilamiz!',
    csRounds: [
      {
        kind: 'taste_conveyor',
        prompt: 'Konveyerda muzdek va shirin muzqaymoq kelyapti! Uni to‘g‘ri sezgi a’zosiga joylashtir!',
        explanation: 'Muzqaymoqning shirin ta’mini 👅 tilimiz yordamida mazza qilib sezamiz!',
        teacherHint: 'Shirin va nordon ta’mlarni qaysi a’zomiz biladi? Albatta 👅 Til!',
        conveyorData: {
          itemEmoji: '🍦',
          itemLabel: 'Muzqaymoq',
          traitBadge: 'Muzdek va shirin',
          targetSense: 'tongue',
        },
      },
      {
        kind: 'taste_conveyor',
        prompt: 'Xushbo‘y atirgulni o‘z sezgi a’zosiga sudra yoki bos!',
        explanation: 'Gullar va mazali taomlarning xushbo‘y hidini 👃 burnimiz bilan sezamiz!',
        teacherHint: 'Xushbo‘y hidni sezish uchun 👃 Burun stansiyasini tanla!',
        conveyorData: {
          itemEmoji: '🌸',
          itemLabel: 'Atirgul',
          traitBadge: 'Xushbo‘y hidli',
          targetSense: 'nose',
        },
      },
      {
        kind: 'taste_conveyor',
        prompt: 'Tikanli kirpichani qaysi sezgi a’zomiz bilan (qattiq-tikanli deb) sezamiz?',
        explanation: 'Buyumning yumshoq, qattiq yoki tikanli ekanini ✋ terimiz va qo‘limiz bilan sezamiz!',
        teacherHint: 'Tikanli yoki yumshoq ekanini ushlab sezish uchun ✋ Teri / Qo‘l kerak!',
        conveyorData: {
          itemEmoji: '🦔',
          itemLabel: 'Kirpi',
          traitBadge: 'Tikanli va qattiq',
          targetSense: 'hand',
        },
      },
      {
        kind: 'taste_conveyor',
        prompt: 'Sariq limonning nordon ta’mini qaysi a’zomiz darhol sezadi?',
        explanation: 'Limonning nordon ta’mini 👅 tilimiz bir zumda ajratib oladi!',
        teacherHint: 'Nordon — bu ta’m! Ta’mni 👅 Til biladi.',
        conveyorData: {
          itemEmoji: '🍋',
          itemLabel: 'Limon',
          traitBadge: 'Nordon ta’mli',
          targetSense: 'tongue',
        },
      },
    ],
  },

  // =========================================================================
  // 3-DARS: Oldin–keyin va Edi–bo'ldi (Sabab va oqibat)
  // O'yin: "Vaqt Mashinasi (Edi ➔ Bo'ldi)" (time_machine)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'time_machine',
    topicTitle: "3-dars: Oldin–keyin va Edi–bo'ldi",
    ruleTitle: 'Vaqt mashinasi: avval nima EDI, keyin nima BO‘LDI?',
    explanation:
      "Tabiatda har bir narsa o‘zgaradi: tuxumdan jo‘ja chiqadi, kichik urug‘dan katta daraxt o‘sadi! Oldin qanday EDI va keyin nima BO‘LDI — buni bilish mantiqiy fikrlashni kuchaytiradi.",
    formulaOrRule: '🥚 Tuxum ➔ 🐣 Jo‘ja  |  🌾 Bug‘doy ➔ 🥖 Non  |  🌱 Urug‘ ➔ 🌳 Daraxt',
    exampleProblem: '🧊 Muz bo‘lagi issiq quyoshda qolsa nima bo‘ladi?',
    exampleSolution: '💧 Tiniq suvga aylanadi!',
    csRounds: [
      {
        kind: 'time_machine',
        prompt: 'Tuxumcha Vaqt Mashinasiga kirdi! Keyin undan nima BO‘LIB chiqadi?',
        explanation: 'Ajoyib! Avval 🥚 tuxum EDI, vaqt o‘tib shirintoy 🐣 jo‘ja BO‘LDI!',
        teacherHint: 'Tuxum ichidan qaysi kichkina qushcha chiqadi? Albatta 🐣 Jo‘ja!',
        timeData: {
          beforeEmoji: '🥚',
          beforeLabel: 'Tuxum',
          machineEmoji: '⏳',
          machineLabel: 'Vaqt mashinasi',
          afterChoices: [
            { id: 'chick', emoji: '🐣', label: 'Jo‘ja', isCorrect: true },
            { id: 'fish', emoji: '🐟', label: 'Baliq', isCorrect: false },
            { id: 'apple', emoji: '🍎', label: 'Olma', isCorrect: false },
          ],
        },
      },
      {
        kind: 'time_machine',
        prompt: 'Oltin bug‘doy tegirmon va tandirdan o‘tdi! Natijada nima BO‘LDI?',
        explanation: 'Barakalla! Bug‘doy unga aylanib, tandirda mazali 🥖 non bo‘lib pishadi!',
        teacherHint: 'Tegirmon va novvoyxona bug‘doydan dasturxonimizdagi 🥖 Nonni tayyorlaydi!',
        timeData: {
          beforeEmoji: '🌾',
          beforeLabel: 'Bug‘doy',
          machineEmoji: '⚙️',
          machineLabel: 'Tegirmon va tandir',
          afterChoices: [
            { id: 'ice', emoji: '🧊', label: 'Muz', isCorrect: false },
            { id: 'bread', emoji: '🥖', label: 'Non', isCorrect: true },
            { id: 'book', emoji: '📘', label: 'Kitob', isCorrect: false },
          ],
        },
      },
      {
        kind: 'time_machine',
        prompt: 'Kichkina urug‘ga suv va quyosh nuri berdik! Vaqt o‘tib u nima BO‘LDI?',
        explanation: 'Zo‘r! Suv va quyosh nuri kichkina urug‘ni katta 🌳 olma daraxtiga aylantiradi!',
        teacherHint: 'Urug‘ tuproqda ildiz otib, katta yashil 🌳 Olma daraxtiga aylanadi!',
        timeData: {
          beforeEmoji: '🌱',
          beforeLabel: 'Urug‘',
          machineEmoji: '💧☀️',
          machineLabel: 'Suv va quyosh',
          afterChoices: [
            { id: 'tree', emoji: '🌳', label: 'Olma daraxti', isCorrect: true },
            { id: 'car', emoji: '🚗', label: 'Mashina', isCorrect: false },
            { id: 'snow', emoji: '⛄', label: 'Qorbobo', isCorrect: false },
          ],
        },
      },
      {
        kind: 'time_machine',
        prompt: 'Qattiq muz bo‘lagini issiq quyoshga qo‘ydik! U erib nima BO‘LDI?',
        explanation: 'Topding! Muz issiqda erib, shaffof 💧 suvga aylanadi!',
        teacherHint: 'Muz isiganda erib 💧 Suvga aylanadi!',
        timeData: {
          beforeEmoji: '🧊',
          beforeLabel: 'Muz',
          machineEmoji: '☀️',
          machineLabel: 'Issiq quyosh',
          afterChoices: [
            { id: 'rock', emoji: '🪨', label: 'Tosh', isCorrect: false },
            { id: 'leaf', emoji: '🍂', label: 'Barg', isCorrect: false },
            { id: 'water', emoji: '💧', label: 'Suv', isCorrect: true },
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 4-DARS: O'sish–kamayish va Harakatlar ketma-ketligi (Algoritm)
  // O'yin: "Kichik Oshpaz (Birinchi Algoritmim)" (chef_algo)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'chef_algo',
    topicTitle: "4-dars: O'sish–kamayish va Harakatlar ketma-ketligi",
    ruleTitle: 'Algoritm — ishlarni to‘g‘ri tartibda bajarish!',
    explanation:
      "Choy damlash ham, qo‘l yuvish ham aniq qadamlar bilan qilinadi — kompyuter tilida bu ALGORITM deyiladi! Kichikdan kattaga terish o‘sish, kattadan kichikka terish esa kamayishdir.",
    formulaOrRule: '1-qadam ➔ 2-qadam ➔ 3-qadam = ✨ Tayyor natija!',
    exampleProblem: '🫖 Choy damlashda avval suv solamizmi yoki piyolaga quyamizmi?',
    exampleSolution: 'Avval choynakka suv solib qaynatamiz, keyin piyolaga quyamiz!',
    csRounds: [
      {
        kind: 'chef_algo',
        prompt: 'Kichik Oshpaz! Mazali choy damlash algoritmini 1 → 2 → 3 tartibida ter!',
        explanation: 'Barakalla! Avval suv solib, olovda qaynatib, so‘ng piyolaga quysak — xushbo‘y choy tayyor!',
        teacherHint: 'Avval 🫖 Choynakka suv sol, keyin 🔥 Olovda qaynat, oxirida 🍵 Piyolaga quy!',
        chefData: {
          recipeTitle: 'Choy damlash algoritmi',
          resultEmoji: '🍵✨',
          resultLabel: 'Mazali issiq choy tayyor!',
          steps: [
            { id: 'water', emoji: '🫖', label: 'Choynakka suv solish' },
            { id: 'boil', emoji: '🔥', label: 'Olovda qaynatish' },
            { id: 'pour', emoji: '🍵', label: 'Piyolaga quyish' },
          ],
        },
      },
      {
        kind: 'chef_algo',
        prompt: 'Ovqatdan oldin qo‘l yuvish algoritmini to‘g‘ri tartibda ter!',
        explanation: 'Zo‘r! Har bir harakatni tartib bilan bajarsak, qo‘llarimiz doim top-toza bo‘ladi!',
        teacherHint: 'Avval 🚰 Suvni och, keyin 🧼 Sovunla, oxirida 🧻 Sochiqqa art!',
        chefData: {
          recipeTitle: 'Qo‘l yuvish algoritmi',
          resultEmoji: '🙌✨',
          resultLabel: 'Qo‘llar top-toza bo‘ldi!',
          steps: [
            { id: 'tap', emoji: '🚰', label: 'Suvni ochish' },
            { id: 'soap', emoji: '🧼', label: 'Sovunlab yuvish' },
            { id: 'towel', emoji: '🧻', label: 'Sochiqqa artish' },
          ],
        },
      },
      {
        kind: 'chef_algo',
        prompt: 'O‘SISH tartibi! Hayvonlarni eng kichigidan eng kattasigacha ketma-ket ter!',
        explanation: 'Ajoyib! Chumoli eng kichik, mushuk o‘rtacha, fil esa eng katta — bu O‘SISH tartibi!',
        teacherHint: 'Eng kichigidan boshla: 🐜 Chumoli ➔ 🐱 Mushuk ➔ 🐘 Fil!',
        chefData: {
          recipeTitle: 'O‘sish tartibi (kichik → katta)',
          resultEmoji: '📈🌟',
          resultLabel: 'O‘sish tartibi a’lo!',
          steps: [
            { id: 'ant', emoji: '🐜', label: 'Chumoli (kichik)' },
            { id: 'cat', emoji: '🐱', label: 'Mushuk (o‘rtacha)' },
            { id: 'elephant', emoji: '🐘', label: 'Fil (katta)' },
          ],
        },
      },
      {
        kind: 'chef_algo',
        prompt: 'KAMAYISH tartibi! Olmalarni eng ko‘pidan eng ozigacha ter!',
        explanation: 'Barakalla! 3 → 2 → 1 qilib kattadan kichikka sanash KAMAYISH tartibi deyiladi!',
        teacherHint: 'Eng ko‘pidan boshla: 3 ta olma ➔ 2 ta olma ➔ 1 ta olma!',
        chefData: {
          recipeTitle: 'Kamayish tartibi (katta → kichik)',
          resultEmoji: '📉🍎',
          resultLabel: 'Kamayish tartibi to‘g‘ri!',
          steps: [
            { id: 'three', emoji: '🍎🍎🍎', label: '3 ta olma' },
            { id: 'two', emoji: '🍎🍎', label: '2 ta olma' },
            { id: 'one', emoji: '🍎', label: '1 ta olma' },
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 5-DARS: Tabiatdagi takrorlanish va Sog'lom turmush tarzi (Tsikl / Loop)
  // O'yin: "Sehrli Karusel (Doimiy Takrorlanish)" (cycle_carousel)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'cycle_carousel',
    topicTitle: "5-dars: Tabiatdagi takrorlanish va Sog'lom turmush tarzi",
    ruleTitle: 'Sehrli Karusel — Tsikl (Takrorlanish)!',
    explanation:
      "Tabiatda tong, kun, kech va tun xuddi karuseldek to‘xtovsiz aylanib takrorlanadi! Dasturlashda qayta-qayta bajariladigan bunday doira TSIKL (Loop) deyiladi.",
    formulaOrRule: '🔁 ☀️ Tong ➔ 🏫 O‘qish ➔ 🌙 Tun ➔ 🛏️ Uyqu ➔ ☀️ Yana tong!',
    exampleProblem: '🌙 Tundan keyin har doim nima keladi?',
    exampleSolution: '☀️ Yana yangi yorug‘ tong otadi — tsikl davom etadi!',
    csRounds: [
      {
        kind: 'cycle_carousel',
        prompt: 'Kun va Tun karuselini 1 → 2 → 3 → 4 tartibida yig‘ib, tsiklni aylantir!',
        explanation: 'Ura! Quyosh chiqadi, kunduzi o‘qiymiz, oy chiqadi, uxlaymiz — va yana yangi tong otadi!',
        teacherHint: 'Tongdan boshla: ☀️ Quyosh chiqadi ➔ 🏫 O‘qiymiz ➔ 🌙 Oy chiqadi ➔ 🛏️ Uxlaymiz!',
        carouselData: {
          cycleTitle: 'Kun va Tun Tsikli',
          steps: [
            { id: 'sun', emoji: '☀️', label: 'Quyosh chiqadi' },
            { id: 'school', emoji: '🏫', label: 'Kunduzi o‘qiymiz' },
            { id: 'moon', emoji: '🌙', label: 'Oy chiqadi' },
            { id: 'sleep', emoji: '🛏️', label: 'Uxlaymiz' },
          ],
        },
      },
      {
        kind: 'cycle_carousel',
        prompt: 'Yil fasllari karuselini bahordan boshlab doira qilib ter!',
        explanation: 'Ajoyib! Bahor, Yoz, Kuz, Qish — har yili xuddi karuseldek takrorlanib kelaveradi!',
        teacherHint: 'Bahordan boshla: 🌸 Bahor ➔ ☀️ Yoz ➔ 🍂 Kuz ➔ ❄️ Qish!',
        carouselData: {
          cycleTitle: '4 Fasl Tsikli',
          steps: [
            { id: 'spring', emoji: '🌸', label: 'Bahor' },
            { id: 'summer', emoji: '☀️', label: 'Yoz' },
            { id: 'autumn', emoji: '🍂', label: 'Kuz' },
            { id: 'winter', emoji: '❄️', label: 'Qish' },
          ],
        },
      },
      {
        kind: 'cycle_carousel',
        prompt: 'Sog‘lom bolaning har kungi tonggi odatlar karuselini yig‘!',
        explanation: 'Barakalla! Har kuni ertalab badantarbiya va tish yuvishni takrorlasak, juda sog‘lom bo‘lamiz!',
        teacherHint: 'Avval 🌅 Uyg‘onish ➔ 🤸 Badantarbiya ➔ 🪥 Tish yuvish ➔ 🥣 Nonushta!',
        carouselData: {
          cycleTitle: 'Sog‘lom Tong Tsikli',
          steps: [
            { id: 'wake', emoji: '🌅', label: 'Uyg‘onish' },
            { id: 'sport', emoji: '🤸', label: 'Badantarbiya' },
            { id: 'brush', emoji: '🪥', label: 'Tish yuvish' },
            { id: 'eat', emoji: '🥣', label: 'Nonushta' },
          ],
        },
      },
      {
        kind: 'cycle_carousel',
        prompt: 'Tabiatdagi suv aylanishi karuselini to‘g‘ri tartibda ter!',
        explanation: 'Tabiatda suv ham doimiy tsiklda: dengizdan bug‘lanib bulut bo‘ladi va yomg‘ir bo‘lib qaytadi!',
        teacherHint: 'Avval 🌊 Dengiz suvi ➔ ☀️ Quyosh isitadi ➔ ☁️ Bulut ➔ 🌧️ Yomg‘ir!',
        carouselData: {
          cycleTitle: 'Suv Aylanishi Tsikli',
          steps: [
            { id: 'sea', emoji: '🌊', label: 'Dengiz suvi' },
            { id: 'heat', emoji: '☀️', label: 'Bug‘lanadi' },
            { id: 'cloud', emoji: '☁️', label: 'Bulut bo‘ladi' },
            { id: 'rain', emoji: '🌧️', label: 'Yomg‘ir yog‘adi' },
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 6-DARS: Tepada–pastda, Oldinda–orqada, Chapda–o'ngda (Koordinatalar)
  // O'yin: "Aqlli Dron Parvozi" (drone_flight)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'drone_flight',
    topicTitle: "6-dars: Tepada–pastda, Oldinda–orqada, Chapda–o'ngda",
    ruleTitle: 'Aqlli Dronni strelkalar bilan boshqar!',
    explanation:
      "Dron va robotlar «tepa, past, chap, o‘ng» degan aniq yo‘nalish buyruqlarini tushunadi! Strelka tugmalarini bosib, dronni to‘g‘ri nishonga qo‘ndirib ko‘r.",
    formulaOrRule: '⬆️ Tepaga · ⬇️ Pastga · ⬅️ Chapga · ➡️ O‘ngga',
    exampleProblem: '🚁 Dron 1 katak o‘ngga yurishi uchun qaysi tugmani bosamiz?',
    exampleSolution: '➡️ O‘ngga strelkasini bosamiz!',
    csRounds: [
      {
        kind: 'drone_flight',
        prompt: 'Dronni 2 qadam TEPAGA [↑] va 1 qadam O‘NGGA [→] uchirib nishonga qo‘ndir!',
        explanation: 'A’lo parvoz! 2 qadam tepaga va 1 qadam o‘ngga uchib, nishonga aniq qo‘nding!',
        teacherHint: 'Avval [⬆️ Tepaga] tugmasini 2 marta, keyin [➡️ O‘ngga] tugmasini 1 marta bos!',
        droneData: {
          gridSize: 4,
          start: { x: 1, y: 3 },
          target: { x: 2, y: 1 },
          missionText: '2 qadam ⬆️ TEPAGA va 1 qadam ➡️ O‘NGGA uchir!',
        },
      },
      {
        kind: 'drone_flight',
        prompt: 'Endi dronni 2 qadam CHAPGA [←] uchirib yulduzchani ol!',
        explanation: 'Zo‘r! Chap tomonga to‘g‘ri uchib yulduzchaga yetib kelding!',
        teacherHint: '[⬅️ Chapga] tugmasini 2 marta ketma-ket bos!',
        droneData: {
          gridSize: 4,
          start: { x: 3, y: 2 },
          target: { x: 1, y: 2 },
          missionText: '2 qadam ⬅️ CHAPGA uchir!',
        },
      },
      {
        kind: 'drone_flight',
        prompt: 'Dronni 2 qadam O‘NGGA [→] va 2 qadam PASTGA [↓] uchir!',
        explanation: 'Barakalla! Sen haqiqiy dron uchuvchisisan — koordinatalarni a’lo bajarding!',
        teacherHint: '[➡️ O‘ngga] ni 2 marta, [⬇️ Pastga] ni 2 marta bos!',
        droneData: {
          gridSize: 4,
          start: { x: 0, y: 0 },
          target: { x: 2, y: 2 },
          missionText: '2 qadam ➡️ O‘NGGA va 2 qadam ⬇️ PASTGA uchir!',
        },
      },
      {
        kind: 'drone_flight',
        prompt: 'Yakuniy parvoz: dronni 2 qadam TEPAGA [↑] va 2 qadam CHAPGA [←] uchir!',
        explanation: 'Ajoyib! Tepaga va chapga yo‘nalishlarni bexato boshqarding!',
        teacherHint: '[⬆️ Tepaga] ni 2 marta, keyin [⬅️ Chapga] ni 2 marta bos!',
        droneData: {
          gridSize: 4,
          start: { x: 2, y: 3 },
          target: { x: 0, y: 1 },
          missionText: '2 qadam ⬆️ TEPAGA va 2 qadam ⬅️ CHAPGA uchir!',
        },
      },
    ],
  },

  // =========================================================================
  // 7-DARS: Uzoq–yaqin va Uzun–qisqa (Qisqa yo'l algoritmi)
  // O'yin: "Quyonchaning Eng Qisqa Yo'li" (short_path)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'short_path',
    topicTitle: '7-dars: Uzoq–yaqin va Uzun–qisqa',
    ruleTitle: 'Eng qisqa yo‘lni topish algoritmi!',
    explanation:
      "Kompyuter ham, aqlli quyoncha ham manzilga tezroq yetish uchun eng QISQA (kam katakli) yo‘lni qidiradi! Kataklarni sanab, eng qulay yo‘lni tanla.",
    formulaOrRule: '🐰 Kam katak = Qisqa yo‘l (tez!)  |  Ko‘p katak = Uzun yo‘l',
    exampleProblem: '🥕 4 ta katakli yo‘l qisqami yoki 8 ta katakli yo‘lmi?',
    exampleSolution: '4 ta katakli yo‘l 2 barobar qisqa va tez!',
    csRounds: [
      {
        kind: 'short_path',
        prompt: 'Quyoncha sabziga shoshilyapti! Kataklarni sana va ENG QISQA yo‘lni tanla!',
        explanation: 'Barakalla! B yo‘li bor-yo‘g‘i 4 ta katak, A yo‘li esa 8 ta katak — quyoncha tez yetib bordi!',
        teacherHint: 'Qaysi yo‘lda kataklar soni kamroq? 4 soni 8 dan kichik — B yo‘lini tanla!',
        shortPathData: {
          pathASteps: [
            { x: 0, y: 2 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 },
            { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 },
          ],
          pathBSteps: [
            { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
          ],
          correctPath: 'B',
        },
      },
      {
        kind: 'short_path',
        prompt: 'Endi qaysi yo‘l qisqaroq: 3 katakli A yo‘limi yoki 7 katakli B yo‘limi?',
        explanation: 'Zo‘r! 3 katakli to‘g‘ri A yo‘li eng qisqa va qulay yo‘l!',
        teacherHint: 'A yo‘lida atigi 3 ta qadam bor — quyoncha sakrab bir zumda yetadi!',
        shortPathData: {
          pathASteps: [
            { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
          ],
          pathBSteps: [
            { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 },
            { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 1 },
          ],
          correctPath: 'A',
        },
      },
      {
        kind: 'short_path',
        prompt: 'Kataklarni diqqat bilan sana! Quyoncha uchun eng yaqin yo‘l qaysi?',
        explanation: 'Ajoyib hisoblash! B yo‘li 5 qadam, A yo‘li esa 9 qadam — B yo‘li ancha qisqaroq!',
        teacherHint: '5 ta qadam 9 ta qadamdan kamroq — demak B yo‘li yaqinroq!',
        shortPathData: {
          pathASteps: [
            { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 1 }, { x: 0, y: 0 },
            { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
            { x: 4, y: 1 }, { x: 3, y: 1 },
          ],
          pathBSteps: [
            { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 },
            { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 1 },
          ],
          correctPath: 'B',
        },
      },
      {
        kind: 'short_path',
        prompt: 'Oxirgi poyga! Qaysi yo‘l quyonchani sabziga eng tez olib boradi?',
        explanation: 'Barakalla! Eng qisqa yo‘l algoritmini zo‘r o‘rganding!',
        teacherHint: 'To‘g‘ridan-to‘g‘ri yuradigan 4 katakli A yo‘lini tanla!',
        shortPathData: {
          pathASteps: [
            { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
          ],
          pathBSteps: [
            { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 },
            { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 4, y: 2 }, { x: 4, y: 1 },
          ],
          correctPath: 'A',
        },
      },
    ],
  },

  // =========================================================================
  // 8-DARS: Yo'l, yo'nalish, labirint va xavfsiz hudud (Blokli Dasturlash!)
  // O'yin: "Robotcha Labirinti (Mini-Scratch)" (robot_maze)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'robot_maze',
    topicTitle: "8-dars: Yo'l, yo'nalish, labirint va xavfsiz hudud",
    ruleTitle: 'Robotcha Labirinti — Blokli Dasturlash!',
    explanation:
      "Haqiqiy dasturchidek robotchaga buyruq bloklarini terib ber: «Oldinga», «O‘ngga buril», «Chapga buril»! Keyin «Boshlash ▶️» tugmasini bossang, robotcha o‘zi yurib bayroqchani oladi.",
    formulaOrRule: '[⬆️ Oldinga] ➔ [↪️ O‘ngga buril] ➔ [↩️ Chapga buril] ➔ ▶️ Boshlash!',
    exampleProblem: '🤖 Robotcha devor oldida turibdi, bayroq o‘ngda. Nima buyuramiz?',
    exampleSolution: 'Avval [↪️ O‘ngga buril], keyin [⬆️ Oldinga] buyrug‘ini beramiz!',
    csRounds: [
      {
        kind: 'robot_maze',
        prompt: '1-daraja: Robotchani 2 qadam oldinga yurgizib bayroqchani ol! Bloklarni terib «▶️ Boshlash» ni bos!',
        explanation: 'Barakalla! Birinchi robot dasturing a’lo ishladi!',
        teacherHint: '[⬆️ Oldinga] blokini 2 marta qo‘sh va «▶️ Boshlash» tugmasini bos!',
        mazeData: {
          gridSize: 4,
          start: { x: 1, y: 3, dir: 'up' },
          flag: { x: 1, y: 1 },
          walls: [
            { x: 0, y: 2 },
            { x: 2, y: 2 },
            { x: 0, y: 1 },
            { x: 2, y: 1 },
          ],
          hintFormula: '⬆️ Oldinga ➔ ⬆️ Oldinga',
        },
      },
      {
        kind: 'robot_maze',
        prompt: '2-daraja: Oldinga yur, keyin O‘NGGA BURILIB bayroqchani ol!',
        explanation: 'Zo‘r dasturlash! Robotcha aynan sen tuzgan bloklar bo‘yicha burilib bayroqni oldi!',
        teacherHint: 'Tering: [⬆️ Oldinga] ➔ [⬆️ Oldinga] ➔ [↪️ O‘ngga buril] ➔ [⬆️ Oldinga]!',
        mazeData: {
          gridSize: 4,
          start: { x: 1, y: 3, dir: 'up' },
          flag: { x: 2, y: 1 },
          walls: [
            { x: 2, y: 3 },
            { x: 2, y: 2 },
            { x: 1, y: 0 },
          ],
          hintFormula: '⬆️ ➔ ⬆️ ➔ ↪️ O‘ngga ➔ ⬆️',
        },
      },
      {
        kind: 'robot_maze',
        prompt: '3-daraja: Endi robotchani oldinga yurgizib, CHAPGA BURILIB bayroqqa olib bor!',
        explanation: 'Ajoyib! Chapga burilish buyrug‘ini ham mukammal o‘zlashtirding!',
        teacherHint: 'Tering: [⬆️ Oldinga] ➔ [⬆️ Oldinga] ➔ [↩️ Chapga buril] ➔ [⬆️ Oldinga]!',
        mazeData: {
          gridSize: 4,
          start: { x: 2, y: 3, dir: 'up' },
          flag: { x: 1, y: 1 },
          walls: [
            { x: 1, y: 3 },
            { x: 1, y: 2 },
            { x: 2, y: 0 },
          ],
          hintFormula: '⬆️ ➔ ⬆️ ➔ ↩️ Chapga ➔ ⬆️',
        },
      },
      {
        kind: 'robot_maze',
        prompt: '4-daraja: Oldinda devor 🧱 bor! Aylanib o‘tib bayroqchaga yetib bor!',
        explanation: 'Super dasturchi! To‘siqni aylanib o‘tuvchi haqiqiy algoritm yozding!',
        teacherHint: 'Robot o‘ngga qarab turibdi: [↩️ Chapga] ➔ [⬆️] ➔ [↪️ O‘ngga] ➔ [⬆️] ➔ [⬆️]!',
        mazeData: {
          gridSize: 4,
          start: { x: 0, y: 2, dir: 'right' },
          flag: { x: 2, y: 1 },
          walls: [
            { x: 1, y: 2 },
            { x: 2, y: 2 },
          ],
          hintFormula: '↩️ Chapga ➔ ⬆️ ➔ ↪️ O‘ngga ➔ ⬆️ ➔ ⬆️',
        },
      },
    ],
  },

  // =========================================================================
  // 9-DARS: Qismlarga ajratish, yig'ish va taqqoslash (Dekompozitsiya)
  // O'yin: "Kompyuter Qismlari Konstruktori" (pc_builder)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'pc_builder',
    topicTitle: "9-dars: Qismlarga ajratish, yig'ish va taqqoslash",
    ruleTitle: 'Kompyuter qaysi qismlardan yig‘iladi?',
    explanation:
      "Katta kompyuter 4 ta asosiy qismdan iborat: Monitor ko‘rsatadi, Tizim bloki «miya» bo‘lib o‘ylaydi, Klaviatura yozadi, Sichqoncha esa tanlaydi! Keling, stol ustida kompyuter yig‘amiz.",
    formulaOrRule: '🖥️ Monitor · 🗄️ Tizim bloki · ⌨️ Klaviatura · 🖱️ Sichqoncha',
    exampleProblem: '⌨️ Kompyuterga harf va so‘z yozish uchun qaysi qism kerak?',
    exampleSolution: 'Klaviatura kerak!',
    csRounds: [
      {
        kind: 'pc_builder',
        prompt: 'Konstruktor! Kompyuterning barcha 4 ta qismini stol ustidagi o‘z joyiga qo‘yib yoq!',
        explanation: 'Ura! Monitor, Tizim bloki, Klaviatura va Sichqoncha ulandi — kompyuter ishga tushdi!',
        teacherHint: 'Pastdagi har bir kompyuter qismini bosib stol ustidagi o‘z joyiga o‘rnat!',
        pcData: {
          mode: 'assemble_all',
        },
      },
      {
        kind: 'pc_builder',
        prompt: 'Yig‘ilgan kompyuterda HARF VA SONLAR YOZISH uchun qaysi qismni bosamiz?',
        explanation: 'To‘g‘ri! ⌨️ Klaviatura tugmalari yordamida matn va sonlarni yozamiz!',
        teacherHint: 'Harf tugmalari bor qismni — ⌨️ Klaviaturani bos!',
        pcData: {
          mode: 'find_part',
          targetPart: 'keyboard',
        },
      },
      {
        kind: 'pc_builder',
        prompt: 'Kompyuterning «MIYASI» — barcha hisoblarni bajaruvchi qism qaysi? Uni bos!',
        explanation: 'Barakalla! 🗄️ Tizim bloki ichida protsessor — kompyuterning aqlli miyasi joylashgan!',
        teacherHint: 'O‘ng tomonda tik turgan quti — 🗄️ Tizim blokini bos!',
        pcData: {
          mode: 'find_part',
          targetPart: 'cpu',
        },
      },
      {
        kind: 'pc_builder',
        prompt: 'Ekrandagi tugmalarni ko‘rsatish va tanlash uchun qaysi qismni suramiz?',
        explanation: 'Topding! 🖱️ Sichqoncha ekrandagi strelkani harakatlantirib, kerakli narsani tanlaydi!',
        teacherHint: 'Kichkina qulay qurilma — 🖱️ Sichqonchani bos!',
        pcData: {
          mode: 'find_part',
          targetPart: 'mouse',
        },
      },
    ],
  },

  // =========================================================================
  // 10-DARS: To'g'ri–noto'g'ri va Rost–yolg'on (Mantiq / Boolean)
  // O'yin: "Rost yoki Yolg'on Chiroqlari (Mantiqiy Detektiv)" (logic_detective)
  // =========================================================================
  {
    subject: 'cs',
    tier: 'elementary',
    grade: 1,
    csGameType: 'logic_detective',
    topicTitle: "10-dars: To'g'ri–noto'g'ri va Rost–yolg'on (Mantiq)",
    ruleTitle: 'Mantiqiy Detektiv: ROST yoki YOLG‘ON!',
    explanation:
      "Kompyuterlar juda aqlli detektivga o‘xshaydi — ular har bir gapni «ROST ✅» yoki «YOLG‘ON ❌» deb tekshiradi! Haqiqatga mos gapda yashil, xato gapda qizil chiroqni yoq!",
    formulaOrRule: '✅ ROST (Haqiqat)   |   ❌ YOLG‘ON (Xato fikr)',
    exampleProblem: '«Mushuklar miyovlaydi» — Rostmi yoki Yolg‘on?',
    exampleSolution: '✅ ROST! Haqiqatan ham mushuklar miyovlaydi!',
    csRounds: [
      {
        kind: 'logic_detective',
        prompt: 'Detektiv! Quyidagi gapni tekshir va to‘g‘ri chiroqni yoq!',
        explanation: 'Topding! Quyosh kunduzi porlaydi, kechasi esa oy va yulduzlar chiqadi — demak bu YOLG‘ON!',
        teacherHint: 'Kechasi osmonda quyosh bo‘ladimi? Yo‘q! Demak [❌ YOLG‘ON] chirog‘ini bos!',
        logicData: {
          illustrationEmoji: '🌙☀️',
          statement: '«Quyosh kechasi osmonda porlaydi.»',
          isTrue: false,
        },
      },
      {
        kind: 'logic_detective',
        prompt: 'Keyingi dalilni tekshir: bu gap ROSTMI yoki YOLG‘ONMI?',
        explanation: 'Barakalla! Qushlarning chiroyli qanotlari bor va ular osmonda erkin uchadi — bu ROST!',
        teacherHint: 'Qushlar chindan ham qanot qoqib uchadi — [✅ ROST] chirog‘ini yoq!',
        logicData: {
          illustrationEmoji: '🐦☁️',
          statement: '«Qushlar qanoti bilan osmonda uchadi.»',
          isTrue: true,
        },
      },
      {
        kind: 'logic_detective',
        prompt: 'Mantiqiy detektiv, diqqat qil! Bu gap haqiqatmi?',
        explanation: 'A’lo! Baliqlar faqat suvda suzib yashaydi, daraxtda emas — demak bu YOLG‘ON!',
        teacherHint: 'Baliqcha daraxtda yashay oladimi? Aslo! [❌ YOLG‘ON] tugmasini bos!',
        logicData: {
          illustrationEmoji: '🐟🌳',
          statement: '«Baliqlar baland daraxt ustida yashaydi.»',
          isTrue: false,
        },
      },
      {
        kind: 'logic_detective',
        prompt: 'Oxirgi detektiv sinovi! Bu gap ROSTMI yoki YOLG‘ONMI?',
        explanation: 'Detektiv yulduzchasi seniki! Qishda haqiqatan ham sovuq bo‘lib qor yog‘adi — ROST!',
        teacherHint: 'Qish faslida oppoq qor yog‘adi — [✅ ROST] chirog‘ini yoq!',
        logicData: {
          illustrationEmoji: '❄️⛄',
          statement: '«Qish faslida havo sovib, qor yog‘adi.»',
          isTrue: true,
        },
      },
    ],
  },
];
