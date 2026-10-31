// Starting content for H.A. Andreou & Co, taken from the firm's current website (ahllc.com.cy).
// Everything here can be edited or removed from the admin console.
// Photos and expertise images live in server/seed-images and are loaded into the database on first start.

const L = (title, el, ru, he) => ({ title, el, ru, he });
const T = {
  md: L('Managing Director', 'Διευθύνων Σύμβουλος', 'Управляющий директор', 'מנהל כללי'),
  partnerM: L('Partner', 'Εταίρος', 'Партнёр', 'שותף'),
  partnerF: L('Partner', 'Εταίρος', 'Партнёр', 'שותפה'),
  assocM: L('Associate', 'Συνεργάτης Δικηγόρος', 'Юрист', 'עורך דין'),
  assocF: L('Associate', 'Συνεργάτιδα Δικηγόρος', 'Юрист', 'עורכת דין'),
  traineeF: L('Trainee Lawyer', 'Ασκούμενη Δικηγόρος', 'Стажёр', 'מתמחה'),
  accounts: L('Head of Accounts', 'Προϊσταμένη Λογιστηρίου', 'Главный бухгалтер', 'מנהלת חשבונות ראשית'),
  paralegal: L('Paralegal', 'Νομική Βοηθός', 'Помощник юриста', 'עוזרת משפטית'),
  pa: L('Legal PA', 'Γραμματέας Δικηγόρου', 'Ассистент юриста', 'עוזרת אישית משפטית')
};
const LANG = {
  ge: { en: 'Greek, English', el: 'Ελληνικά, Αγγλικά', ru: 'Греческий, Английский', he: 'יוונית, אנגלית' },
  gef: { en: 'Greek, English, French', el: 'Ελληνικά, Αγγλικά, Γαλλικά', ru: 'Греческий, Английский, Французский', he: 'יוונית, אנגלית, צרפתית' }
};

// published: false = imported but hidden on the website (support staff), can be shown from the admin console
const people = [
  ['antonis-andreou', 'Antonis Andreou', T.md, 'a.andreou@ahllc.com.cy', '+357 24 828392', LANG.ge,
    'Barrister at Law, Lincoln’s Inn School of Law, 1970',
    'Member of the Cyprus Bar, 1973\nPresident of the Committee responsible for the recognition by the Cyprus Bar Council of law degrees\nMember of the House of Representatives, 1985 to 1991\nFormer Vice President of the Legal Affairs Committee of the House of Representatives\nMember of an ad hoc Committee for the investigation of complaints against the police for ill treatment of detainees, 1994', true],
  ['helena-andreou', 'Helena Andreou', T.partnerF, 'h.andreou@ahllc.com.cy', '+357 24 828393', LANG.ge,
    'LL.M., International and Commercial Law, University of Sheffield, 1993\nLL.B. (Hons.), University of Leicester, 1992',
    'Member of the Cyprus Bar, 1995', true],
  ['antonis-pastos', 'Antonis Pastos', T.partnerM, 'a.pastos@ahllc.com.cy', '+357 24 656705', LANG.ge,
    'LL.M., European Law and Policy, University of Manchester, 2001\nLaw Degree, Aristotle University of Thessaloniki, 1999',
    'Member of the Cyprus Bar, 2000\nInsolvency Practitioner, 2016', true],
  ['panayiotis-hji-christofis', 'Panayiotis Hji Christofis', T.partnerM, 'p.hjichristofis@ahllc.com.cy', '+357 24 656717', LANG.ge,
    'LL.B. (Hons.), University of Sussex, 2004',
    'Member of the Cyprus Bar, 2005\nInsolvency Practitioner, 2016', true],
  ['demetris-kallenos', 'Demetris Kallenos', T.partnerM, 'd.kallenos@ahllc.com.cy', '+357 24 656770', LANG.ge,
    'Law Degree, Democritus University of Thrace, 2005',
    'Member of the Cyprus Bar, 2006\nMediator, 2014\nInsolvency Practitioner, 2016', true],
  ['christos-tsangaros', 'Christos Tsangaros', T.partnerM, 'c.tsangaros@ahllc.com.cy', '+357 24 400459', LANG.ge,
    'LL.B. (Hons.), Coventry University, 2007',
    'Member of the Cyprus Bar, 2008', true],
  ['demetra-tofari', 'Demetra Tofari', T.assocF, 'd.tofari@ahllc.com.cy', '+357 24 828374', LANG.ge,
    'Law Degree, National and Kapodistrian University of Athens, 1995',
    'Member of the Cyprus Bar, 1996\nMember of the Kilkis Bar, 1999', true],
  ['kristie-chrysaphi', 'Kristie Chrysaphi', T.assocF, 'k.chrysaphi@ahllc.com.cy', '+357 24 656772', LANG.ge,
    'LL.B. (Hons.), University of Derby, 2016',
    'Member of the Cyprus Bar, 2019', true],
  ['raffaella-sordini', 'Raffaella Sordini', T.assocF, 'r.sordini@ahllc.com.cy', '+357 24 824425', LANG.ge,
    'L.P.C., BPP University, Manchester, 2015\nLL.B. (Hons.), University of Leicester, 2013',
    'Member of the Cyprus Bar, 2016', true],
  ['antroulla-lambrou', 'Antroulla Lambrou', T.assocF, 'al@ahllc.com.cy', '+357 24 656765', LANG.ge,
    'LL.M. European Business Law, University of Cyprus, 2023\nLL.B., University of Cyprus, 2019',
    'Member of the Cyprus Bar, 2020', true],
  ['kyriakos-georgiou', 'Kyriakos Georgiou', T.assocM, 'k.georgiou@ahllc.com.cy', '+357 24 656765', LANG.ge,
    'Law Degree, Democritus University of Thrace, 2021',
    'Member of the Cyprus Bar, 2022', true],
  ['maria-hadjisavva', 'Maria Hadjisavva', T.assocF, 'm.hadjisavva@ahllc.com.cy', '+357 24 656765', LANG.ge,
    'LL.B. (Hons), University of Central Lancashire Cyprus (UCLan), 2020',
    'Member of the Cyprus Bar, 2022', true],
  ['anastasis-mytidis', 'Anastasis Mytidis', T.assocM, 'am@ahllc.com.cy', '+357 24 656765', LANG.ge,
    'LL.B., National and Kapodistrian University of Athens, 2022',
    'Member of the Cyprus Bar Association, 2023', true],
  ['nagia-demetriou', 'Nagia Demetriou', T.traineeF, 'nd@ahllc.com.cy', '+357 24 656765', LANG.ge,
    'LL.B. Law (Hons), University of Leeds, 2022', '', true],
  ['kyriaki-vasileiadou', 'Kyriaki Vasileiadou', T.traineeF, '', '+357 24 656765', LANG.ge,
    'LL.B. (Hons), SOAS University of London, 2015\nLPC MSc Law, Business and Management, University of Law, Bloomsbury, 2017', '', true],
  ['alexia-ioannou', 'Alexia Ioannou', T.traineeF, '', '+357 24 656765', LANG.ge,
    'LL.B. (Hons), Newcastle University, 2022\nLL.M. International Commercial Law, Newcastle University, 2023', '', true],
  ['anna-andreou', 'Anna Andreou', T.accounts, 'anna.andreou@ahllc.com.cy', '+357 24 656765', LANG.ge, '', '', false],
  ['kakia-petrou', 'Kakia Petrou', T.paralegal, 'k.petrou@ahllc.com.cy', '+357 24 656717', LANG.gef,
    'Level 3 Diploma in Paralegal Practice, National Association of Licensed Paralegals (UK), 2022\nDegree in French Language and Literature, University of Cyprus, 2010', '', false],
  ['katerina-karvela', 'Katerina Karvela', T.pa, 'k.karvela@ahllc.com.cy', '+357 24 656705', LANG.ge, '', '', false],
  ['maria-charalambous', 'Maria Charalambous', T.pa, 'm.charalambous@ahllc.com.cy', '+357 24 828393', LANG.ge, '', '', false],
  ['irini-vladimirou', 'Irini Vladimirou', T.pa, 'iv@ahllc.com.cy', '+357 24 656765', LANG.ge,
    'Degree in Primary Education, University of Cyprus, 2012\nMSc in Environmental Education and Sustainable Development, Frederick University, 2014', '', false],
  ['vasiliki-papamichael', 'Vasiliki Papamichael', T.pa, 'vp@ahllc.com.cy', '+357 24 656765', LANG.ge,
    'BSc Speech and Language Therapy, European University Cyprus, 2023', '', false],
  ['georgia-georgiou', 'Georgia Georgiou', T.pa, 'reception@ahllc.com.cy', '+357 24 656765', LANG.ge,
    'Degree in Communication and Journalism, University of Indianapolis, Athens Campus, 2013', '', false]
];

export const seedLawyers = people.map(([slug, name, t, email, phone, langs, education, admissions, published]) => ({
  slug,
  name,
  title: t.title,
  email,
  phone,
  languages: langs.en,
  education,
  admissions,
  practice_areas: '',
  summary: '',
  bio: '',
  published,
  photo: `team/${slug}.jpg`,
  i18n: {
    el: { title: t.el, languages: langs.el },
    ru: { title: t.ru, languages: langs.ru },
    he: { title: t.he, languages: langs.he }
  }
}));

// Expertise. Lines starting with "• " are shown as a bulleted list.
export const seedPracticeAreas = [
  {
    slug: 'corporate-commercial-law',
    name: 'Corporate & Commercial Law',
    summary: 'Company formation, corporate governance, commercial contracts and transactions for local and international businesses.',
    body: 'We advise companies, shareholders and directors on incorporation, shareholder agreements, mergers and acquisitions, restructurings and the commercial contracts that support their everyday business.',
    i18n: {
      el: { name: 'Εταιρικό & Εμπορικό Δίκαιο', summary: 'Σύσταση εταιρειών, εταιρική διακυβέρνηση, εμπορικές συμβάσεις και συναλλαγές για τοπικές και διεθνείς επιχειρήσεις.', body: 'Συμβουλεύουμε εταιρείες, μετόχους και διευθυντές σε θέματα σύστασης, συμφωνιών μετόχων, συγχωνεύσεων και εξαγορών, αναδιαρθρώσεων και των εμπορικών συμβάσεων που στηρίζουν την καθημερινή τους δραστηριότητα.' },
      ru: { name: 'Корпоративное и коммерческое право', summary: 'Регистрация компаний, корпоративное управление, коммерческие договоры и сделки для местного и международного бизнеса.', body: 'Мы консультируем компании, акционеров и директоров по вопросам регистрации, соглашений акционеров, слияний и поглощений, реструктуризации и коммерческих договоров, на которых строится их повседневная деятельность.' },
      he: { name: 'דיני חברות ומסחר', summary: 'הקמת חברות, ממשל תאגידי, חוזים ועסקאות מסחריות לעסקים מקומיים ובינלאומיים.', body: 'אנו מייעצים לחברות, לבעלי מניות ולדירקטורים בהתאגדות, בהסכמי בעלי מניות, במיזוגים ורכישות, בארגון מחדש ובחוזים המסחריים שעליהם נשענת הפעילות השוטפת שלהם.' }
    }
  },
  {
    slug: 'property-and-conveyance',
    name: 'Property and Conveyance',
    summary: 'Purchases, sales and transfers of property, title checks and Land Registry procedures.',
    body: 'We act for buyers, sellers, developers and lenders in residential and commercial property transactions, from due diligence and contracts of sale to the transfer of title at the Land Registry.',
    i18n: {
      el: { name: 'Ακίνητη Περιουσία & Μεταβιβάσεις', summary: 'Αγορές, πωλήσεις και μεταβιβάσεις ακινήτων, έλεγχοι τίτλων και διαδικασίες Κτηματολογίου.', body: 'Εκπροσωπούμε αγοραστές, πωλητές, αναπτυξιακές εταιρείες και δανειστές σε συναλλαγές οικιστικών και εμπορικών ακινήτων, από τον νομικό έλεγχο και τα πωλητήρια έγγραφα έως τη μεταβίβαση του τίτλου στο Κτηματολόγιο.' },
      ru: { name: 'Недвижимость и передача прав', summary: 'Покупка, продажа и передача недвижимости, проверка титулов и процедуры в Земельном кадастре.', body: 'Мы представляем покупателей, продавцов, застройщиков и кредиторов в сделках с жилой и коммерческой недвижимостью: от юридической проверки и договоров до переоформления права собственности в Земельном кадастре.' },
      he: { name: 'מקרקעין והעברת נכסים', summary: 'רכישה, מכירה והעברה של נכסים, בדיקות בעלות והליכים מול רשם המקרקעין.', body: 'אנו מייצגים קונים, מוכרים, יזמים ומלווים בעסקאות נדל״ן למגורים ולמסחר, מבדיקת הנאותות והסכמי המכר ועד העברת הבעלות ברשם המקרקעין.' }
    }
  },
  {
    slug: 'banking-finance',
    name: 'Banking & Finance',
    summary: 'Advice to banks, credit institutions and borrowers on lending, security and recovery.',
    body: 'We advise banking institutions and borrowers on loan and security documentation, mortgages and guarantees, regulatory matters and the enforcement of securities.',
    i18n: {
      el: { name: 'Τραπεζικό & Χρηματοοικονομικό Δίκαιο', summary: 'Συμβουλές σε τράπεζες, πιστωτικά ιδρύματα και δανειολήπτες για δανεισμό, εξασφαλίσεις και ανάκτηση.', body: 'Συμβουλεύουμε τραπεζικά ιδρύματα και δανειολήπτες σε δανειακά έγγραφα και εξασφαλίσεις, υποθήκες και εγγυήσεις, ρυθμιστικά θέματα και την εκτέλεση εξασφαλίσεων.' },
      ru: { name: 'Банковское и финансовое право', summary: 'Консультации банков, кредитных организаций и заёмщиков по кредитованию, обеспечению и взысканию.', body: 'Мы консультируем банки и заёмщиков по кредитной и обеспечительной документации, ипотеке и гарантиям, регуляторным вопросам и обращению взыскания на обеспечение.' },
      he: { name: 'בנקאות ומימון', summary: 'ייעוץ לבנקים, למוסדות אשראי וללווים בנושאי הלוואות, בטוחות וגבייה.', body: 'אנו מייעצים למוסדות בנקאיים וללווים במסמכי הלוואה ובטוחה, משכנתאות וערבויות, נושאי רגולציה ומימוש בטוחות.' }
    }
  },
  {
    slug: 'insurance-law-personal-injury-claims',
    name: 'Insurance Law / Personal Injury Claims',
    summary: 'Advice and representation for individuals and insurers in all areas of personal injury and insurance law.',
    body: 'Our firm offers legal advice and representation to individuals and insurance companies in all areas of personal injury and insurance law, with great expertise in multi party and multi injury actions.\nWhere possible, our team concentrates its efforts on negotiating and settling cases before court proceedings, so that our clients can avoid the expense and the stress of litigation.\nWe deal with all types of personal injury claims, including:\n• Fatal accidents\n• Road traffic accidents\n• Professional negligence\n• Medical negligence\n• Public liability claims\n• Occupier’s liability\n• Employer’s liability\n• Product liability claims',
    i18n: {
      el: { name: 'Ασφαλιστικό Δίκαιο / Αγωγές Σωματικών Βλαβών', summary: 'Συμβουλές και εκπροσώπηση ιδιωτών και ασφαλιστικών εταιρειών σε όλους τους τομείς σωματικών βλαβών και ασφαλιστικού δικαίου.', body: 'Το γραφείο μας παρέχει νομικές συμβουλές και εκπροσώπηση σε ιδιώτες και ασφαλιστικές εταιρείες σε όλους τους τομείς των σωματικών βλαβών και του ασφαλιστικού δικαίου, με μεγάλη εμπειρία σε αγωγές με πολλούς διαδίκους και πολλαπλούς τραυματισμούς.\nΌπου είναι δυνατόν, η ομάδα μας επικεντρώνεται στη διαπραγμάτευση και τον εξωδικαστικό διακανονισμό, ώστε οι πελάτες μας να αποφεύγουν τα έξοδα και το άγχος της δικαστικής διαδικασίας.\nΧειριζόμαστε κάθε είδους αγωγή σωματικής βλάβης, όπως:\n• Θανατηφόρα ατυχήματα\n• Τροχαία ατυχήματα\n• Επαγγελματική αμέλεια\n• Ιατρική αμέλεια\n• Αστική ευθύνη έναντι τρίτων\n• Ευθύνη κατόχου ακινήτου\n• Ευθύνη εργοδότη\n• Ευθύνη για ελαττωματικά προϊόντα' },
      ru: { name: 'Страховое право / Иски о телесных повреждениях', summary: 'Консультации и представительство частных лиц и страховых компаний по всем вопросам телесных повреждений и страхового права.', body: 'Наша фирма консультирует и представляет частных лиц и страховые компании по всем вопросам, связанным с телесными повреждениями и страховым правом, и обладает большим опытом в делах с участием многих сторон и пострадавших.\nПо возможности наша команда стремится урегулировать спор путём переговоров до обращения в суд, чтобы клиенты избежали расходов и стресса судебного процесса.\nМы ведём все виды исков о телесных повреждениях, в том числе:\n• Несчастные случаи со смертельным исходом\n• Дорожные аварии\n• Профессиональная небрежность\n• Врачебная небрежность\n• Гражданская ответственность перед третьими лицами\n• Ответственность владельца помещения\n• Ответственность работодателя\n• Ответственность за качество продукции' },
      he: { name: 'דיני ביטוח / תביעות נזקי גוף', summary: 'ייעוץ וייצוג לאנשים פרטיים ולחברות ביטוח בכל תחומי נזקי הגוף ודיני הביטוח.', body: 'משרדנו מעניק ייעוץ משפטי וייצוג לאנשים פרטיים ולחברות ביטוח בכל תחומי נזקי הגוף ודיני הביטוח, עם ניסיון רב בתביעות מרובות צדדים ונפגעים.\nככל שניתן, הצוות שלנו מתמקד במשא ומתן ובהסדר לפני פתיחת הליכים, כדי שלקוחותינו יחסכו את העלויות ואת הלחץ שבהתדיינות.\nאנו מטפלים בכל סוגי תביעות נזקי הגוף, לרבות:\n• תאונות קטלניות\n• תאונות דרכים\n• רשלנות מקצועית\n• רשלנות רפואית\n• אחריות כלפי הציבור\n• אחריות מחזיק המקרקעין\n• אחריות מעביד\n• אחריות למוצר' }
    }
  },
  {
    slug: 'debt-collection-and-recovery',
    name: 'Debt Collection and Recovery',
    summary: 'Proactive advice and a full range of court and investigative procedures for effective debt recovery.',
    body: 'Our team has the knowledge and experience to understand the needs and requirements of each of our clients and to provide proactive advice and a full range of court and investigative procedures for an effective debt recovery service.\nWe can provide the following services:\n• Investigations into the financial status of the debtor\n• Designing and enforcing interim protective measures to secure or freeze assets before litigation\n• Proceedings for the execution of court judgments\n• Proceedings to set aside fraudulent dissipation of assets\n• Liquidation proceedings\n• Bankruptcy proceedings',
    i18n: {
      el: { name: 'Είσπραξη & Ανάκτηση Οφειλών', summary: 'Προληπτικές συμβουλές και πλήρες φάσμα δικαστικών και ερευνητικών διαδικασιών για αποτελεσματική ανάκτηση οφειλών.', body: 'Η ομάδα μας διαθέτει τη γνώση και την εμπειρία για να κατανοεί τις ανάγκες κάθε πελάτη και να παρέχει προληπτικές συμβουλές και πλήρες φάσμα δικαστικών και ερευνητικών διαδικασιών για αποτελεσματική ανάκτηση οφειλών.\nΠροσφέρουμε τις ακόλουθες υπηρεσίες:\n• Έρευνα για την οικονομική κατάσταση του οφειλέτη\n• Σχεδιασμό και εφαρμογή προσωρινών μέτρων εξασφάλισης ή δέσμευσης περιουσίας πριν από τη δίκη\n• Διαδικασίες εκτέλεσης δικαστικών αποφάσεων\n• Διαδικασίες ακύρωσης δόλιας αποξένωσης περιουσίας\n• Διαδικασίες εκκαθάρισης\n• Διαδικασίες πτώχευσης' },
      ru: { name: 'Взыскание долгов', summary: 'Проактивные консультации и полный спектр судебных и розыскных процедур для эффективного взыскания долгов.', body: 'Наша команда обладает знаниями и опытом, чтобы понять потребности каждого клиента и предложить проактивные консультации и полный спектр судебных и розыскных процедур для эффективного взыскания долгов.\nМы предлагаем следующие услуги:\n• Проверка финансового положения должника\n• Разработка и применение обеспечительных мер по аресту или заморозке активов до начала судебного процесса\n• Исполнение судебных решений\n• Оспаривание мошеннического вывода активов\n• Процедуры ликвидации\n• Процедуры банкротства' },
      he: { name: 'גביית חובות', summary: 'ייעוץ יזום ומגוון מלא של הליכים משפטיים וחקירתיים לגבייה יעילה של חובות.', body: 'לצוות שלנו הידע והניסיון להבין את הצרכים של כל לקוח ולהעניק ייעוץ יזום ומגוון מלא של הליכים משפטיים וחקירתיים לשירות גבייה יעיל.\nאנו מציעים את השירותים הבאים:\n• בירור מצבו הכלכלי של החייב\n• תכנון ואכיפה של סעדים זמניים לעיקול או להקפאת נכסים לפני ההליך\n• הליכים לביצוע פסקי דין\n• הליכים לביטול הברחת נכסים במרמה\n• הליכי פירוק\n• הליכי פשיטת רגל' }
    }
  },
  {
    slug: 'wills-probates',
    name: 'Wills & Probates',
    summary: 'Wills, estate administration and probate matters in Cyprus and abroad.',
    body: 'We prepare wills and guide executors and families through the administration of estates, the grant of probate and the resealing of foreign grants in Cyprus.',
    i18n: {
      el: { name: 'Διαθήκες & Διαχείριση Κληρονομιών', summary: 'Διαθήκες, διαχείριση περιουσίας θανόντων και επικυρώσεις διαθηκών στην Κύπρο και στο εξωτερικό.', body: 'Συντάσσουμε διαθήκες και καθοδηγούμε εκτελεστές και οικογένειες στη διαχείριση της περιουσίας, στην έκδοση γραμμάτων διαχείρισης και στην επανασφράγιση ξένων γραμμάτων στην Κύπρο.' },
      ru: { name: 'Завещания и наследование', summary: 'Завещания, управление наследством и утверждение завещаний на Кипре и за рубежом.', body: 'Мы составляем завещания и сопровождаем исполнителей и семьи в управлении наследством, получении свидетельства о праве управления наследством и признании иностранных документов на Кипре.' },
      he: { name: 'צוואות וקיום צוואות', summary: 'צוואות, ניהול עיזבונות וקיום צוואות בקפריסין ובחו״ל.', body: 'אנו עורכים צוואות ומלווים מנהלי עיזבון ומשפחות בניהול העיזבון, בקבלת צו קיום צוואה ובאישור צווים זרים בקפריסין.' }
    }
  },
  {
    slug: 'criminal-law',
    name: 'Criminal Law',
    summary: 'Defence and representation in criminal proceedings before the Cyprus courts.',
    body: 'We represent individuals and companies at every stage of criminal proceedings, from investigation and police questioning to trial and appeal, with discretion and determination.',
    i18n: {
      el: { name: 'Ποινικό Δίκαιο', summary: 'Υπεράσπιση και εκπροσώπηση σε ποινικές διαδικασίες ενώπιον των κυπριακών δικαστηρίων.', body: 'Εκπροσωπούμε ιδιώτες και εταιρείες σε κάθε στάδιο της ποινικής διαδικασίας, από τη διερεύνηση και την ανάκριση έως τη δίκη και την έφεση, με διακριτικότητα και αποφασιστικότητα.' },
      ru: { name: 'Уголовное право', summary: 'Защита и представительство в уголовных делах в судах Кипра.', body: 'Мы представляем частных лиц и компании на всех этапах уголовного процесса, от расследования и допроса в полиции до судебного разбирательства и апелляции, конфиденциально и решительно.' },
      he: { name: 'משפט פלילי', summary: 'הגנה וייצוג בהליכים פליליים בבתי המשפט בקפריסין.', body: 'אנו מייצגים אנשים פרטיים וחברות בכל שלבי ההליך הפלילי, מהחקירה והתשאול במשטרה ועד המשפט והערעור, בדיסקרטיות ובנחישות.' }
    }
  },
  {
    slug: 'family-law',
    name: 'Family Law',
    summary: 'Divorce, child custody, maintenance and property disputes between spouses.',
    body: 'We handle family matters with sensitivity and discretion, including divorce, custody and access, maintenance and the division of property between spouses.',
    i18n: {
      el: { name: 'Οικογενειακό Δίκαιο', summary: 'Διαζύγια, επιμέλεια τέκνων, διατροφή και περιουσιακές διαφορές συζύγων.', body: 'Χειριζόμαστε οικογενειακές υποθέσεις με ευαισθησία και διακριτικότητα, όπως διαζύγια, επιμέλεια και επικοινωνία, διατροφή και διανομή περιουσίας μεταξύ συζύγων.' },
      ru: { name: 'Семейное право', summary: 'Развод, опека над детьми, алименты и имущественные споры супругов.', body: 'Мы ведём семейные дела деликатно и конфиденциально: развод, опека и порядок общения с детьми, алименты и раздел имущества супругов.' },
      he: { name: 'דיני משפחה', summary: 'גירושין, משמורת ילדים, מזונות וסכסוכי רכוש בין בני זוג.', body: 'אנו מטפלים בענייני משפחה ברגישות ובדיסקרטיות, לרבות גירושין, משמורת והסדרי שהות, מזונות וחלוקת רכוש בין בני זוג.' }
    }
  },
  {
    slug: 'employment-law',
    name: 'Employment Law',
    summary: 'Employment contracts, dismissals, redundancies and labour disputes.',
    body: 'We advise employers and employees on contracts, workplace policies, redundancies and dismissals, and represent them before the Labour Disputes Court.',
    i18n: {
      el: { name: 'Εργατικό Δίκαιο', summary: 'Συμβάσεις εργασίας, απολύσεις, πλεονασμοί και εργατικές διαφορές.', body: 'Συμβουλεύουμε εργοδότες και εργαζομένους σε θέματα συμβάσεων, πολιτικών, πλεονασμών και απολύσεων, και τους εκπροσωπούμε ενώπιον του Δικαστηρίου Εργατικών Διαφορών.' },
      ru: { name: 'Трудовое право', summary: 'Трудовые договоры, увольнения, сокращения и трудовые споры.', body: 'Мы консультируем работодателей и работников по договорам, внутренним правилам, сокращениям и увольнениям и представляем их в Суде по трудовым спорам.' },
      he: { name: 'דיני עבודה', summary: 'חוזי עבודה, פיטורים, צמצומים וסכסוכי עבודה.', body: 'אנו מייעצים למעסיקים ולעובדים בנושאי חוזים, נהלים, צמצומים ופיטורים, ומייצגים אותם בבית הדין לסכסוכי עבודה.' }
    }
  },
  {
    slug: 'insolvency-restructuring',
    name: 'Insolvency & Restructuring',
    summary: 'Liquidations, bankruptcies, examinership and corporate restructuring.',
    body: 'We advise creditors, debtors and directors on liquidations, bankruptcies, examinership and the restructuring of businesses in financial difficulty.',
    i18n: {
      el: { name: 'Αφερεγγυότητα & Αναδιάρθρωση', summary: 'Εκκαθαρίσεις, πτωχεύσεις, εξέταση και εταιρική αναδιάρθρωση.', body: 'Συμβουλεύουμε πιστωτές, οφειλέτες και διευθυντές σε εκκαθαρίσεις, πτωχεύσεις, διαδικασίες εξεταστή και αναδιάρθρωση επιχειρήσεων που αντιμετωπίζουν οικονομικές δυσκολίες.' },
      ru: { name: 'Несостоятельность и реструктуризация', summary: 'Ликвидация, банкротство, процедура управления и реструктуризация компаний.', body: 'Мы консультируем кредиторов, должников и директоров по вопросам ликвидации, банкротства, процедуры управления и реструктуризации компаний, испытывающих финансовые трудности.' },
      he: { name: 'חדלות פירעון והבראה', summary: 'פירוקים, פשיטות רגל, הליכי הבראה וארגון מחדש של חברות.', body: 'אנו מייעצים לנושים, לחייבים ולדירקטורים בפירוקים, בפשיטות רגל, בהליכי הבראה ובארגון מחדש של עסקים בקשיים כלכליים.' }
    }
  },
  {
    slug: 'construction-law',
    name: 'Construction Law',
    summary: 'Construction contracts, disputes and claims for developers, contractors and owners.',
    body: 'We advise developers, contractors and property owners on construction contracts and represent them in disputes over defects, delays and payments.',
    i18n: {
      el: { name: 'Δίκαιο Κατασκευών', summary: 'Συμβάσεις κατασκευής, διαφορές και απαιτήσεις για αναπτυξιακές εταιρείες, εργολάβους και ιδιοκτήτες.', body: 'Συμβουλεύουμε αναπτυξιακές εταιρείες, εργολάβους και ιδιοκτήτες σε συμβάσεις κατασκευής και τους εκπροσωπούμε σε διαφορές για ελαττώματα, καθυστερήσεις και πληρωμές.' },
      ru: { name: 'Строительное право', summary: 'Строительные договоры, споры и претензии для застройщиков, подрядчиков и владельцев.', body: 'Мы консультируем застройщиков, подрядчиков и владельцев недвижимости по строительным договорам и представляем их в спорах о дефектах, задержках и оплате.' },
      he: { name: 'דיני בנייה', summary: 'חוזי בנייה, סכסוכים ותביעות ליזמים, לקבלנים ולבעלי נכסים.', body: 'אנו מייעצים ליזמים, לקבלנים ולבעלי נכסים בחוזי בנייה ומייצגים אותם בסכסוכים בנושא ליקויים, עיכובים ותשלומים.' }
    }
  },
  {
    slug: 'intellectual-property',
    name: 'Intellectual Property',
    summary: 'Protection and enforcement of trademarks, copyright and other intellectual property rights.',
    body: 'We assist with the registration, licensing and protection of trademarks and other intellectual property rights, and act in infringement disputes.',
    i18n: {
      el: { name: 'Πνευματική Ιδιοκτησία', summary: 'Προστασία και επιβολή εμπορικών σημάτων, πνευματικών δικαιωμάτων και άλλων δικαιωμάτων πνευματικής ιδιοκτησίας.', body: 'Βοηθούμε στην εγγραφή, αδειοδότηση και προστασία εμπορικών σημάτων και άλλων δικαιωμάτων πνευματικής ιδιοκτησίας και εκπροσωπούμε πελάτες σε διαφορές παραβίασης.' },
      ru: { name: 'Интеллектуальная собственность', summary: 'Защита товарных знаков, авторских и других прав интеллектуальной собственности.', body: 'Мы помогаем с регистрацией, лицензированием и защитой товарных знаков и других прав интеллектуальной собственности и ведём споры о нарушении прав.' },
      he: { name: 'קניין רוחני', summary: 'הגנה ואכיפה של סימני מסחר, זכויות יוצרים וזכויות קניין רוחני נוספות.', body: 'אנו מסייעים ברישום, ברישוי ובהגנה על סימני מסחר וזכויות קניין רוחני נוספות, ומייצגים בסכסוכי הפרה.' }
    }
  },
  {
    slug: 'administrative-law',
    name: 'Administrative Law',
    summary: 'Recourses against decisions of public authorities before the Administrative Court.',
    body: 'We challenge decisions of public authorities and represent clients in administrative recourses, including matters of public procurement, licensing and the public service.',
    i18n: {
      el: { name: 'Διοικητικό Δίκαιο', summary: 'Προσφυγές κατά αποφάσεων δημόσιων αρχών ενώπιον του Διοικητικού Δικαστηρίου.', body: 'Αμφισβητούμε αποφάσεις δημόσιων αρχών και εκπροσωπούμε πελάτες σε διοικητικές προσφυγές, μεταξύ άλλων σε θέματα δημόσιων συμβάσεων, αδειοδοτήσεων και δημόσιας υπηρεσίας.' },
      ru: { name: 'Административное право', summary: 'Обжалование решений государственных органов в Административном суде.', body: 'Мы оспариваем решения государственных органов и представляем клиентов по административным жалобам, в том числе в вопросах госзакупок, лицензирования и государственной службы.' },
      he: { name: 'משפט מנהלי', summary: 'עתירות נגד החלטות של רשויות ציבוריות בבית המשפט המנהלי.', body: 'אנו תוקפים החלטות של רשויות ציבוריות ומייצגים לקוחות בעתירות מנהליות, לרבות בנושאי מכרזים ציבוריים, רישוי ושירות ציבורי.' }
    }
  },
  {
    slug: 'international-trusts',
    name: 'International Trusts',
    summary: 'Establishment and administration of Cyprus international trusts.',
    body: 'We advise on the establishment, administration and restructuring of Cyprus international trusts, an effective framework for asset protection and succession planning.',
    i18n: {
      el: { name: 'Διεθνή Καταπιστεύματα', summary: 'Σύσταση και διαχείριση κυπριακών διεθνών καταπιστευμάτων.', body: 'Συμβουλεύουμε στη σύσταση, διαχείριση και αναδιάρθρωση κυπριακών διεθνών καταπιστευμάτων, ένα αποτελεσματικό πλαίσιο για την προστασία περιουσίας και τον σχεδιασμό διαδοχής.' },
      ru: { name: 'Международные трасты', summary: 'Учреждение и администрирование кипрских международных трастов.', body: 'Мы консультируем по учреждению, администрированию и реструктуризации кипрских международных трастов, эффективного инструмента защиты активов и планирования наследования.' },
      he: { name: 'נאמנויות בינלאומיות', summary: 'הקמה וניהול של נאמנויות בינלאומיות קפריסאיות.', body: 'אנו מייעצים בהקמה, בניהול ובארגון מחדש של נאמנויות בינלאומיות קפריסאיות, מסגרת יעילה להגנה על נכסים ולתכנון העברה בין דורית.' }
    }
  },
  {
    slug: 'immigration-and-migration-law-european-citizenship-residency',
    name: 'Immigration and Migration Law (European Citizenship & Residency)',
    summary: 'Residency permits, work permits, European citizenship and relocation to Cyprus.',
    body: 'We guide individuals, families and businesses through applications for residency and work permits, naturalisation and European citizenship, and support relocation to Cyprus from start to finish.',
    i18n: {
      el: { name: 'Μεταναστευτικό Δίκαιο (Ευρωπαϊκή Υπηκοότητα & Διαμονή)', summary: 'Άδειες διαμονής, άδειες εργασίας, ευρωπαϊκή υπηκοότητα και μετεγκατάσταση στην Κύπρο.', body: 'Καθοδηγούμε ιδιώτες, οικογένειες και επιχειρήσεις σε αιτήσεις για άδειες διαμονής και εργασίας, πολιτογράφηση και ευρωπαϊκή υπηκοότητα, και υποστηρίζουμε τη μετεγκατάσταση στην Κύπρο από την αρχή έως το τέλος.' },
      ru: { name: 'Иммиграционное право (гражданство ЕС и вид на жительство)', summary: 'Вид на жительство, разрешения на работу, гражданство ЕС и переезд на Кипр.', body: 'Мы сопровождаем частных лиц, семьи и компании при подаче заявлений на вид на жительство и разрешение на работу, натурализацию и гражданство ЕС и помогаем с переездом на Кипр от начала до конца.' },
      he: { name: 'דיני הגירה (אזרחות אירופית ותושבות)', summary: 'היתרי שהייה, היתרי עבודה, אזרחות אירופית ורילוקיישן לקפריסין.', body: 'אנו מלווים אנשים פרטיים, משפחות ועסקים בבקשות להיתרי שהייה ועבודה, התאזרחות ואזרחות אירופית, ותומכים במעבר לקפריסין מתחילתו ועד סופו.' }
    }
  }
].map((a) => ({ ...a, image: `areas/${a.slug}.jpg` }));

export const seedJobs = [
  {
    slug: 'trainee-lawyer',
    title: 'Trainee Lawyer',
    location: 'Larnaca',
    employment_type: 'Full time',
    summary: 'An opportunity for a law graduate to complete their training with an established Larnaca law firm.',
    description: 'You will work closely with our lawyers on corporate, property and litigation matters, preparing documents, carrying out legal research and attending court and client meetings.\n\nThis listing is sample text and can be edited or removed from the admin console.',
    requirements: 'Law degree (LLB or equivalent)\nEligible to train with the Cyprus Bar Association\nExcellent Greek and English, written and spoken\nOrganised, reliable and eager to learn',
    i18n: {
      el: { title: 'Ασκούμενος Δικηγόρος', location: 'Λάρνακα', employment_type: 'Πλήρης απασχόληση', summary: 'Ευκαιρία για απόφοιτο Νομικής να ολοκληρώσει την άσκησή του σε καθιερωμένο δικηγορικό γραφείο στη Λάρνακα.', description: 'Θα συνεργάζεστε στενά με τους δικηγόρους μας σε εταιρικά θέματα, ακίνητα και δικαστικές υποθέσεις, ετοιμάζοντας έγγραφα, κάνοντας νομική έρευνα και παρευρισκόμενοι σε δικαστήρια και συναντήσεις με πελάτες.', requirements: 'Πτυχίο Νομικής (LLB ή ισοδύναμο)\nΔικαίωμα άσκησης στον Παγκύπριο Δικηγορικό Σύλλογο\nΆριστα Ελληνικά και Αγγλικά, γραπτά και προφορικά\nΟργανωτικότητα, συνέπεια και διάθεση για μάθηση' },
      ru: { title: 'Стажёр', location: 'Ларнака', employment_type: 'Полная занятость', summary: 'Возможность для выпускника юридического факультета пройти стажировку в известной юридической фирме в Ларнаке.', description: 'Вы будете работать вместе с нашими юристами по корпоративным делам, недвижимости и судебным спорам: готовить документы, проводить правовые исследования, участвовать в судебных заседаниях и встречах с клиентами.', requirements: 'Юридическое образование (LLB или эквивалент)\nПраво проходить стажировку при Коллегии адвокатов Кипра\nОтличный греческий и английский, устно и письменно\nОрганизованность, ответственность и желание учиться' },
      he: { title: 'מתמחה במשפטים', location: 'לרנקה', employment_type: 'משרה מלאה', summary: 'הזדמנות לבוגר משפטים להשלים את ההתמחות במשרד ותיק בלרנקה.', description: 'תעבדו לצד עורכי הדין שלנו בתיקי חברות, נדל״ן וליטיגציה, תכינו מסמכים, תערכו מחקר משפטי ותשתתפו בדיונים ובפגישות עם לקוחות.', requirements: 'תואר במשפטים (LLB או מקביל)\nזכאות להתמחות בלשכת עורכי הדין של קפריסין\nיוונית ואנגלית ברמה גבוהה, בכתב ובעל פה\nסדר, אמינות ורצון ללמוד' }
    }
  },
  {
    slug: 'legal-secretary',
    title: 'Legal Secretary',
    location: 'Larnaca',
    employment_type: 'Full time',
    summary: 'Support our lawyers and clients with the day to day running of the office.',
    description: 'You will manage diaries and correspondence, prepare and format legal documents, handle client calls and keep files in order.\n\nThis listing is sample text and can be edited or removed from the admin console.',
    requirements: 'Previous experience in a law firm or professional office\nExcellent Greek and English\nConfident with Microsoft Office\nDiscreet, friendly and well organised',
    i18n: {
      el: { title: 'Νομική Γραμματέας', location: 'Λάρνακα', employment_type: 'Πλήρης απασχόληση', summary: 'Υποστήριξη των δικηγόρων και των πελατών μας στην καθημερινή λειτουργία του γραφείου.', description: 'Θα διαχειρίζεστε ημερολόγια και αλληλογραφία, θα ετοιμάζετε και θα μορφοποιείτε νομικά έγγραφα, θα εξυπηρετείτε τηλεφωνικά τους πελάτες και θα τηρείτε τους φακέλους οργανωμένους.', requirements: 'Προηγούμενη εμπειρία σε δικηγορικό ή επαγγελματικό γραφείο\nΆριστα Ελληνικά και Αγγλικά\nΆνεση με το Microsoft Office\nΕχεμύθεια, ευγένεια και οργανωτικότητα' },
      ru: { title: 'Секретарь юриста', location: 'Ларнака', employment_type: 'Полная занятость', summary: 'Поддержка наших юристов и клиентов в повседневной работе офиса.', description: 'Вы будете вести календари и переписку, готовить и оформлять юридические документы, отвечать на звонки клиентов и поддерживать порядок в делах.', requirements: 'Опыт работы в юридической фирме или профессиональном офисе\nОтличный греческий и английский\nУверенное владение Microsoft Office\nКонфиденциальность, доброжелательность и организованность' },
      he: { title: 'מזכירה משפטית', location: 'לרנקה', employment_type: 'משרה מלאה', summary: 'תמיכה בעורכי הדין ובלקוחות שלנו בניהול השוטף של המשרד.', description: 'תנהלו יומנים ותכתובות, תכינו ותעצבו מסמכים משפטיים, תענו לשיחות לקוחות ותשמרו על סדר בתיקים.', requirements: 'ניסיון קודם במשרד עורכי דין או במשרד מקצועי\nיוונית ואנגלית ברמה גבוהה\nשליטה ב Microsoft Office\nדיסקרטיות, אדיבות וסדר' }
    }
  }
];
