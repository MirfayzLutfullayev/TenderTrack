// TenderTrack — demo ma'lumotlar bazasi (MVP uchun)
// Real loyihada bu API'dan keladi: GET /api/organizations, /api/contracts, ...

export const ORG = {
  id: 'org-001',
  name: "O'zbekiston Respublikasi Sog'liqni saqlash vazirligi",
  short: 'Soliqshunoslik vazirligi',
  legal: 'Davlat tashkiloti',
  address: "Toshkent shahri, Mirobod tumani, A. Navoiy ko'chasi 12",
  phone: '+998 71 241 12 00',
  email: 'info@minzdrav.uz',
  website: 'minzdrav.uz',
  director: 'A. Saidov (vazir)',
  contact: { name: 'A. Karimov', position: 'Xaridlar bo\'limi boshlig\'i', phone: '+998 90 123 45 67' },
  stats: {
    totalContracts: 1247,
    totalSum: 8_240_000_000_000, // 8.24 trln so'm
    avgDuration: 142, // kun
    activeProjects: 38,
    completedYear: 184,
    savings: 312_000_000_000, // 312 mlrd so'm
  },
};

export const ACTIVE_PROJECTS = [
  {
    id:'p1', no:'GK-2026-0042',
    name:"Toshkent shahar 7-poliklinika ta'mirlash",
    description:"Poliklinika binosining tashqi va ichki ta'miri, sanitariya tizimini yangilash, ventilyatsiya va elektr tarmog'ini modernizatsiya qilish.",
    start:'2026-01-15', deadline:'2026-08-15',
    status:'in-progress', progress:68, stage:5,
    executor:{ name:"BuildPro MChJ", director:"R. Tursunov", phone:"+998 71 200 11 22", rating:4.6, completionRate:96 },
    sum: 4_200_000_000, startPrice: 4_500_000_000,
    budget:{ spent: 2_856_000_000, remaining: 1_344_000_000 },
    milestones:[
      { date:'2026-01-15', title:"Shartnoma imzolandi", done:true },
      { date:'2026-02-20', title:"Materiallar yetkazildi", done:true },
      { date:'2026-03-15', title:"Demontaj ishlari yakunlandi", done:true },
      { date:'2026-05-01', title:"Qurilish-montaj — joriy bosqich", done:false, current:true },
      { date:'2026-06-30', title:"Pardoz ishlari", done:false },
      { date:'2026-08-15', title:"Ob'ektni topshirish", done:false },
    ],
    docs:[
      { name:"Shartnoma matni.pdf", kb:412 },
      { name:"Texnik topshiriq.pdf", kb:156 },
      { name:"1-bosqich dalolatnoma.pdf", kb:88 },
      { name:"Smeta hisobi.xlsx", kb:240 },
    ],
    contact:{ name:"D. Karimov", role:"Loyiha menejeri", phone:"+998 90 555 12 34", email:"d.karimov@minzdrav.uz" },
  },
  {
    id:'p2', no:'GK-2026-0058',
    name:"MRT apparati yetkazib berish",
    description:"Magnit-rezonans tomografiya apparati (1.5 Tesla) yetkazib berish, o'rnatish va xodimlarni o'qitish.",
    start:'2026-02-10', deadline:'2026-06-10',
    status:'in-progress', progress:42, stage:4,
    executor:{ name:"MedTech UZ", director:"D. Ismoilova", phone:"+998 71 300 44 55", rating:4.8, completionRate:100 },
    sum: 12_800_000_000, startPrice: 13_200_000_000,
    budget:{ spent: 5_376_000_000, remaining: 7_424_000_000 },
    milestones:[
      { date:'2026-02-10', title:"Shartnoma imzolandi", done:true },
      { date:'2026-03-25', title:"Avans to'lovi (40%) amalga oshdi", done:true },
      { date:'2026-05-20', title:"Apparat yetkazib berilishi — joriy", done:false, current:true },
      { date:'2026-06-01', title:"O'rnatish va kalibrlash", done:false },
      { date:'2026-06-10', title:"Xodimlarni o'qitish va topshirish", done:false },
    ],
    docs:[
      { name:"Shartnoma matni.pdf", kb:502 },
      { name:"Texnik topshiriq.pdf", kb:220 },
      { name:"Sertifikatlar to'plami.pdf", kb:340 },
    ],
    contact:{ name:"M. Yuldasheva", role:"Texnik mas'ul", phone:"+998 90 712 33 44", email:"m.yuldasheva@minzdrav.uz" },
  },
  {
    id:'p3', no:'GK-2026-0114',
    name:"Dori vositalari to'plami (Q2)",
    description:"2-chorak uchun antibiotiklar, vaktsinalar va shoshilinch yordam dori vositalari to'plami.",
    start:'2026-03-05', deadline:'2026-04-30',
    status:'review', progress:95, stage:6,
    executor:{ name:"PharmaCenter", director:"K. Nazarov", phone:"+998 66 233 11 00", rating:4.7, completionRate:94 },
    sum: 2_650_000_000, startPrice: 2_700_000_000,
    budget:{ spent: 2_517_500_000, remaining: 132_500_000 },
    milestones:[
      { date:'2026-03-05', title:"Shartnoma imzolandi", done:true },
      { date:'2026-03-20', title:"Birinchi partiya yetkazildi", done:true },
      { date:'2026-04-10', title:"To'liq partiya yetkazildi", done:true },
      { date:'2026-04-25', title:"Sertifikat tekshiruvi — joriy", done:false, current:true },
      { date:'2026-05-02', title:"Yakuniy to'lov va arxiv", done:false },
    ],
    docs:[
      { name:"Shartnoma matni.pdf", kb:340 },
      { name:"Yetkazish dalolatnomasi.pdf", kb:95 },
      { name:"Sifat sertifikatlari.pdf", kb:512 },
      { name:"Yakuniy hisob faktura.pdf", kb:48 },
    ],
    contact:{ name:"S. Olimova", role:"Farmatsevt nazoratchi", phone:"+998 91 200 88 77", email:"s.olimova@minzdrav.uz" },
  },
  {
    id:'p4', no:'GK-2026-0127',
    name:"Tibbiy formali kiyim",
    description:"Tibbiyot xodimlari uchun professional kiyim-kechak (xirurgik kostyum, xalat, choyshab) ishlab chiqarish.",
    start:'2026-03-20', deadline:'2026-09-20',
    status:'planning', progress:15, stage:2,
    executor:{ name:"TextilePro", director:"S. Salimova", phone:"+998 73 244 11 88", rating:4.0, completionRate:87 },
    sum: 480_000_000, startPrice: 510_000_000,
    budget:{ spent: 72_000_000, remaining: 408_000_000 },
    milestones:[
      { date:'2026-03-20', title:"Tender e'lon qilindi", done:true },
      { date:'2026-04-05', title:"Takliflar qabul qilindi (9 ta)", done:true },
      { date:'2026-04-30', title:"G'olibni aniqlash — joriy", done:false, current:true },
      { date:'2026-05-15', title:"Shartnoma imzolash", done:false },
      { date:'2026-09-20', title:"Yakunlash", done:false },
    ],
    docs:[
      { name:"Tender e'loni.pdf", kb:78 },
      { name:"Texnik topshiriq.pdf", kb:132 },
      { name:"Takliflar jadvali.xlsx", kb:185 },
    ],
    contact:{ name:"N. Rashidov", role:"Xaridlar mutaxassisi", phone:"+998 90 333 22 11", email:"n.rashidov@minzdrav.uz" },
  },
  {
    id:'p5', no:'GK-2026-0091',
    name:"IT tizimi modernizatsiya",
    description:"Vazirlik elektron hujjat aylanishi platformasini yangilash, bulutli arxiv va xavfsizlik tizimini joriy etish.",
    start:'2026-02-01', deadline:'2026-07-01',
    status:'in-progress', progress:55, stage:5, delayed:true,
    executor:{ name:"DigitalUz", director:"O. Nurmuhammedov", phone:"+998 71 122 33 44", rating:4.4, completionRate:88 },
    sum: 3_100_000_000, startPrice: 3_300_000_000,
    budget:{ spent: 1_705_000_000, remaining: 1_395_000_000 },
    milestones:[
      { date:'2026-02-01', title:"Shartnoma imzolandi", done:true },
      { date:'2026-02-25', title:"Sprint #1 yakunlandi", done:true },
      { date:'2026-03-30', title:"Sprint #2 yakunlandi", done:true },
      { date:'2026-04-25', title:"Sprint #3 — 4 kun kechikmoqda", done:false, current:true, delayed:true },
      { date:'2026-05-30', title:"Beta versiya taqdimoti", done:false },
      { date:'2026-07-01', title:"Yakuniy joriy etish", done:false },
    ],
    docs:[
      { name:"Shartnoma matni.pdf", kb:380 },
      { name:"Texnik topshiriq.pdf", kb:145 },
      { name:"Sprint #1 hisoboti.pdf", kb:62 },
      { name:"Sprint #2 hisoboti.pdf", kb:71 },
      { name:"Arxitektura diagrammasi.pdf", kb:920 },
    ],
    contact:{ name:"J. Toshpulatov", role:"IT direktori", phone:"+998 90 444 55 66", email:"j.toshpulatov@minzdrav.uz" },
  },
];

export const ARCHIVE = [
  { id:'a1', no:'GK-2025-0842', date:'2025-11-12', sum:1_240_000_000, executor:"BuildPro MChJ", subject:"Bino tashqi ta'mir",  rating:4.5 },
  { id:'a2', no:'GK-2025-0731', date:'2025-09-03', sum:8_900_000_000, executor:"MedTech UZ",    subject:"Ultrastun apparati",  rating:4.8 },
  { id:'a3', no:'GK-2025-0612', date:'2025-07-21', sum:  640_000_000, executor:"OfficePlus",     subject:"Ofis mebeli",         rating:3.7 },
  { id:'a4', no:'GK-2025-0501', date:'2025-06-08', sum:2_180_000_000, executor:"PharmaCenter",   subject:"Vaktsinalar",         rating:4.6 },
  { id:'a5', no:'GK-2025-0388', date:'2025-04-15', sum:  395_000_000, executor:"FoodSupply",     subject:"Kasalxona oziq-ovqati",rating:4.0 },
];

/* ── SOTUVCHI TASHKILOTLAR REESTRI ───────────────────────── */
export const SECTORS = [
  { id:'all',    name:"Barchasi",  icon:'🗂️', count:0 },
  { id:'build',  name:"Qurilish",  icon:'🏗️' },
  { id:'it',     name:"IT",        icon:'💻' },
  { id:'med',    name:"Tibbiyot",  icon:'⚕️' },
  { id:'edu',    name:"Ta'lim",    icon:'🎓' },
  { id:'food',   name:"Oziq-ovqat",icon:'🍞' },
  { id:'trans',  name:"Transport", icon:'🚚' },
  { id:'office', name:"Ofis",      icon:'🪑' },
];

export const VENDORS = [
  {
    id:'v1', name:"BuildPro MChJ", sector:'build', stir:'301245678', region:'Toshkent sh.',
    director:"R. Tursunov", phone:'+998 71 200 11 22', address:"Yunusobod tumani, Amir Temur 45",
    rating:4.6, contractsDone:42, completionRate:96, qualityScore:4.5, communicationScore:4.7,
    products:[
      { name:"Ko'p qavatli bino qurilishi", price:'10–500 mlrd so\'m' },
      { name:"Ichki ta'mirlash ishlari",     price:'200 mln–2 mlrd so\'m' },
      { name:"Sanitariya tizimi",            price:'50–800 mln so\'m' },
    ],
    history:[
      { no:'GK-25-0842', date:'2025-11-12', sum:1_240_000_000, customer:"Sog'liqni saqlash vazirligi", status:"Bajarilgan", rating:4.5 },
      { no:'GK-25-0301', date:'2025-04-08', sum:3_840_000_000, customer:"Toshkent hokimligi",          status:"Bajarilgan", rating:4.7 },
      { no:'GK-24-1156', date:'2024-12-22', sum:  720_000_000, customer:"Xalq ta'limi vazirligi",       status:"Bajarilgan", rating:4.5 },
    ],
    reviews:[
      { author:"Sog'liqni saqlash vazirligi", date:'2025-12-15', stars:5, text:"O'z vaqtida va sifatli bajardi. Hujjatlar tartibli." },
      { author:"Toshkent hokimligi",           date:'2025-04-20', stars:4, text:"Ozgina kechikish bo'ldi, ammo sifat yaxshi." },
    ],
  },
  {
    id:'v2', name:"MedTech UZ", sector:'med', stir:'304012456', region:'Toshkent sh.',
    director:"D. Ismoilova", phone:'+998 71 300 44 55', address:"Mirzo Ulug'bek tumani, Mustaqillik 80",
    rating:4.8, contractsDone:28, completionRate:100, qualityScore:4.9, communicationScore:4.6,
    products:[
      { name:"MRT apparatlari",         price:'8–25 mlrd so\'m' },
      { name:"Ultrasonografiya jihozi",  price:'200 mln–3 mlrd so\'m' },
      { name:"Reanimatsiya jihozlari",   price:'100–800 mln so\'m' },
    ],
    history:[
      { no:'GK-25-0731', date:'2025-09-03', sum:8_900_000_000, customer:"Sog'liqni saqlash vazirligi", status:"Bajarilgan", rating:4.8 },
      { no:'GK-25-0102', date:'2025-02-14', sum:1_650_000_000, customer:"Andijon viloyat sog'liqni s.", status:"Bajarilgan", rating:5.0 },
    ],
    reviews:[
      { author:"Andijon viloyati", date:'2025-03-01', stars:5, text:"Mukammal xizmat. O'rnatish va trening tezda yakunlandi." },
    ],
  },
  {
    id:'v3', name:"DigitalUz", sector:'it', stir:'305789012', region:'Toshkent sh.',
    director:"O. Nurmuhammedov", phone:'+998 71 122 33 44', address:"Mirobod tumani, IT Park",
    rating:4.4, contractsDone:35, completionRate:88, qualityScore:4.5, communicationScore:4.8,
    products:[
      { name:"E-government tizimlari",  price:'500 mln–5 mlrd so\'m' },
      { name:"Mobil ilovalar",          price:'80–600 mln so\'m' },
      { name:"Bulutli infratuzilma",     price:'300 mln–2 mlrd so\'m' },
    ],
    history:[
      { no:'GK-25-0288', date:'2025-03-22', sum:3_100_000_000, customer:"Sog'liqni saqlash vazirligi", status:"Jarayonda", rating:null },
      { no:'GK-24-0934', date:'2024-10-18', sum: 920_000_000, customer:"Adliya vazirligi",            status:"Bajarilgan", rating:4.3 },
    ],
    reviews:[
      { author:"Adliya vazirligi", date:'2024-11-05', stars:4, text:"Texnik darajasi yuqori, lekin muddat 3 hafta kechikdi." },
    ],
  },
  {
    id:'v4', name:"PharmaCenter", sector:'med', stir:'302456789', region:'Samarqand v.',
    director:"K. Nazarov", phone:'+998 66 233 11 00', address:"Samarqand sh., Registon ko'ch. 5",
    rating:4.7, contractsDone:51, completionRate:94, qualityScore:4.7, communicationScore:4.6,
    products:[
      { name:"Vaktsinalar yetkazib berish", price:'500 mln–5 mlrd so\'m' },
      { name:"Antibiotiklar to'plami",      price:'80–800 mln so\'m' },
      { name:"Ambulatoriya dorilari",       price:'50–300 mln so\'m' },
    ],
    history:[
      { no:'GK-25-0501', date:'2025-06-08', sum:2_180_000_000, customer:"Sog'liqni saqlash vazirligi", status:"Bajarilgan", rating:4.6 },
    ],
    reviews:[
      { author:"Sog'liqni saqlash vazirligi", date:'2025-07-12', stars:5, text:"Sertifikatlar to'liq, qadoqlash mukammal." },
    ],
  },
  {
    id:'v5', name:"OfficePlus", sector:'office', stir:'303345678', region:'Toshkent sh.',
    director:"L. Mahmudova", phone:'+998 71 144 22 11', address:"Chilonzor tumani, Bunyodkor 14",
    rating:3.9, contractsDone:67, completionRate:82, qualityScore:3.8, communicationScore:4.1,
    products:[
      { name:"Ofis mebeli",          price:'30–500 mln so\'m' },
      { name:"Konferents-zal jihozi", price:'100–800 mln so\'m' },
    ],
    history:[
      { no:'GK-25-0612', date:'2025-07-21', sum:640_000_000, customer:"Sog'liqni saqlash vazirligi", status:"Bajarilgan", rating:3.7 },
    ],
    reviews:[
      { author:"Sog'liqni saqlash vazirligi", date:'2025-08-05', stars:4, text:"Sifatli, lekin yetkazib berish 2 hafta kechikdi." },
      { author:"Maktab №201",                  date:'2025-05-18', stars:3, text:"Ba'zi mebellarda nuqsonlar topildi." },
    ],
  },
  {
    id:'v6', name:"FoodSupply", sector:'food', stir:'306123456', region:'Toshkent v.',
    director:"X. Tojiev", phone:'+998 70 555 12 12', address:"Qibray tumani, Sanoat 22",
    rating:4.2, contractsDone:39, completionRate:90, qualityScore:4.0, communicationScore:4.3,
    products:[
      { name:"Kasalxona oziq-ovqati", price:'200–800 mln so\'m' },
      { name:"Sut mahsulotlari",       price:'50–300 mln so\'m' },
    ],
    history:[
      { no:'GK-25-0388', date:'2025-04-15', sum:395_000_000, customer:"Sog'liqni saqlash vazirligi", status:"Bajarilgan", rating:4.0 },
    ],
    reviews:[
      { author:"Sog'liqni saqlash vazirligi", date:'2025-05-20', stars:4, text:"Yaxshi sifat, ammo bir necha kun kechikish kuzatildi." },
    ],
  },
  {
    id:'v7', name:"TextilePro", sector:'office', stir:'307891234', region:"Farg'ona v.",
    director:"S. Salimova", phone:'+998 73 244 11 88', address:"Farg'ona sh., Mustaqillik 1",
    rating:4.0, contractsDone:23, completionRate:87, qualityScore:4.1, communicationScore:3.9,
    products:[
      { name:"Tibbiy formali kiyim",   price:'100–500 mln so\'m' },
      { name:"Choyshab-yostiq jildlari", price:'30–150 mln so\'m' },
    ],
    history:[
      { no:'GK-25-0198', date:'2025-03-12', sum:480_000_000, customer:"Sog'liqni saqlash vazirligi", status:"Jarayonda", rating:null },
    ],
    reviews:[],
  },
  {
    id:'v8', name:"EduSoft", sector:'edu', stir:'308456712', region:'Toshkent sh.',
    director:"N. Yo'ldoshev", phone:'+998 71 199 00 11', address:"Yashnobod tumani, IT-Park",
    rating:4.5, contractsDone:18, completionRate:94, qualityScore:4.6, communicationScore:4.4,
    products:[
      { name:"O'quv platformalari",     price:'200 mln–1.5 mlrd so\'m' },
      { name:"Onlayn imtihon tizimi",   price:'100–600 mln so\'m' },
    ],
    history:[
      { no:'GK-25-0276', date:'2025-04-04', sum:1_120_000_000, customer:"Xalq ta'limi vazirligi", status:"Bajarilgan", rating:4.5 },
    ],
    reviews:[
      { author:"Xalq ta'limi vazirligi", date:'2025-05-15', stars:5, text:"Texnik qo'llab-quvvatlash a'lo darajada." },
    ],
  },
];

/* ── SHARTNOMALAR (4-bosqichli kuzatuv) ─────────────────── */
export const STAGES = [
  { id:1, t:"Tender e'loni",        d:"Sana, tavsif, narx" },
  { id:2, t:"Takliflar qabuli",     d:"Ishtirokchilar"      },
  { id:3, t:"G'olibni aniqlash",    d:"Baholash, asoslash"  },
  { id:4, t:"Shartnoma imzolash",   d:"Sana, summa, muddat" },
  { id:5, t:"Ijro nazorati",        d:"% va dalolatnoma"    },
  { id:6, t:"Yakunlash",            d:"To'lov va arxiv"     },
];

export const CONTRACTS = [
  {
    id:'c1', no:'GK-2026-0042', subject:"Toshkent 7-poliklinika ta'mirlash",
    customer: "Sog'liqni saqlash vazirligi", executor: "BuildPro MChJ",
    sum: 4_200_000_000, startPrice: 4_500_000_000, signedAt:'2026-01-15', deadline:'2026-08-15',
    stage: 5, progress: 68, delayed: false,
    participants: 6, winner: { score: 92, reason: "Eng past narx + tajriba" },
    nextStep: "Oraliq dalolatnoma — 2026-05-01",
    docs: [
      { name:"Shartnoma matni",      kb: 412 },
      { name:"Texnik topshiriq",     kb: 156 },
      { name:"1-bosqich dalolatnoma", kb: 88 },
    ],
  },
  {
    id:'c2', no:'GK-2026-0058', subject:"MRT apparati yetkazib berish",
    customer: "Sog'liqni saqlash vazirligi", executor: "MedTech UZ",
    sum: 12_800_000_000, startPrice: 13_200_000_000, signedAt:'2026-02-10', deadline:'2026-06-10',
    stage: 4, progress: 42, delayed: false,
    participants: 4, winner: { score: 95, reason: "Texnik xususiyatlar bo'yicha eng yuqori" },
    nextStep: "Yetkazib berish — 2026-05-20",
    docs: [
      { name:"Shartnoma matni",  kb: 502 },
      { name:"Texnik topshiriq", kb: 220 },
    ],
  },
  {
    id:'c3', no:'GK-2026-0091', subject:"IT tizimi modernizatsiya",
    customer: "Sog'liqni saqlash vazirligi", executor: "DigitalUz",
    sum: 3_100_000_000, startPrice: 3_300_000_000, signedAt:'2026-02-01', deadline:'2026-07-01',
    stage: 5, progress: 55, delayed: true,
    participants: 7, winner: { score: 88, reason: "Eng tezkor yetkazish + qo'llab-quvvatlash" },
    nextStep: "Beta versiya taqdimoti — 2026-05-05 (kechikmoqda)",
    docs: [
      { name:"Shartnoma matni",    kb: 380 },
      { name:"Texnik topshiriq",   kb: 145 },
      { name:"Sprint hisoboti #3",  kb: 62 },
    ],
  },
  {
    id:'c4', no:'GK-2026-0114', subject:"Dori vositalari to'plami (Q2)",
    customer: "Sog'liqni saqlash vazirligi", executor: "PharmaCenter",
    sum: 2_650_000_000, startPrice: 2_700_000_000, signedAt:'2026-03-05', deadline:'2026-04-30',
    stage: 6, progress: 95, delayed: false,
    participants: 5, winner: { score: 90, reason: "Sertifikatlar va narx" },
    nextStep: "Yakuniy to'lov — 2026-05-02",
    docs: [
      { name:"Shartnoma matni",      kb: 340 },
      { name:"Yetkazish dalolatnomasi", kb: 95 },
      { name:"Yakuniy hisob faktura",   kb: 48 },
    ],
  },
  {
    id:'c5', no:'GK-2026-0127', subject:"Tibbiy formali kiyim",
    customer: "Sog'liqni saqlash vazirligi", executor: "TextilePro",
    sum: 480_000_000, startPrice: 510_000_000, signedAt:'2026-03-20', deadline:'2026-09-20',
    stage: 2, progress: 15, delayed: false,
    participants: 9, winner: null,
    nextStep: "Takliflar yopilishi — 2026-04-30",
    docs: [
      { name:"Tender e'loni",   kb: 78 },
      { name:"Texnik topshiriq", kb: 132 },
    ],
  },
];

/* ── AI TAHLIL — ogohlantirishlar ─────────────────────── */
export const AI_ALERTS = [
  { id:'a1', level:'high',   type:"Narx anomaliyasi", contract:'GK-2026-0058', text:"Bozor o'rtacha narxidan 23% yuqori taklif", date:'2026-04-22' },
  { id:'a2', level:'medium', type:"Cheklovchi shart", contract:'GK-2026-0127', text:"Tender shartlari faqat 2 tashkilot mos kelishini ko'rsatmoqda", date:'2026-04-20' },
  { id:'a3', level:'high',   type:"Manfaatlar to'qnashuvi", contract:'GK-2026-0091', text:"Buyurtmachi va ijrochi rahbarlari orasidagi mumkin bo'lgan bog'liqlik", date:'2026-04-18' },
  { id:'a4', level:'low',    type:"Kechikish",       contract:'GK-2026-0091', text:"Sprint #3 4 kun kechikkan", date:'2026-04-15' },
  { id:'a5', level:'medium', type:"Takroriy ishtirokchilar", contract:'GK-2026-0042', text:"So'nggi 5 tenderda ishtirokchilar doim bir xil", date:'2026-04-10' },
];

export const AI_PRICE_TREND = [
  { period:'Q4 2024', avg: 100, sample: 98  },
  { period:'Q1 2025', avg: 104, sample: 102 },
  { period:'Q2 2025', avg: 109, sample: 116 },
  { period:'Q3 2025', avg: 112, sample: 110 },
  { period:'Q4 2025', avg: 115, sample: 119 },
  { period:'Q1 2026', avg: 118, sample: 145 }, // anomaliya
];

export const AI_RANK_FORMULA = [
  { k:'O\'z vaqtida bajarish', w:40, color:'#2563eb' },
  { k:'Sifat ko\'rsatkichi',    w:30, color:'#06b6d4' },
  { k:'Xaridorlar bahosi',      w:20, color:'#8b5cf6' },
  { k:'Shikoyatlar soni',       w:10, color:'#f59e0b' },
];

/* ── helpers ─────────────────────────────────────────── */
export function fmtSum(n) {
  if (n >= 1e12) return (n/1e12).toFixed(2) + ' trln so\'m';
  if (n >= 1e9)  return (n/1e9).toFixed(2)  + ' mlrd so\'m';
  if (n >= 1e6)  return (n/1e6).toFixed(0)  + ' mln so\'m';
  return n.toLocaleString('uz-UZ') + ' so\'m';
}
export function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('uz-UZ', { year:'numeric', month:'short', day:'numeric' });
}
