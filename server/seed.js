// Starting content. Everything here is sample text that can be edited or
// deleted from the admin console. The lawyers are placeholders only.

export const seedLawyers = [
  {
    slug: 'maria-constantinou',
    name: 'Maria Constantinou',
    title: 'Managing Partner',
    email: 'info@athanasiadoulaw.com',
    phone: '+357 24 044835',
    languages: 'Greek, English',
    education: 'LLB Law, University of Athens\nLLM Commercial Law, University of London',
    admissions: 'Cyprus Bar Association',
    practice_areas: 'Corporate and Commercial, Real Estate and Property, Wills and Succession',
    summary: 'Leads the firm with a focus on corporate, property and private client matters, advising individuals and businesses across Cyprus.',
    bio: 'Maria advises local and international clients on company formation, shareholder arrangements, commercial contracts and property transactions in Cyprus.\n\nShe is known for clear, practical advice and for staying closely involved in every matter from the first meeting to completion. Before founding the practice, she gained extensive experience in commercial and property law in Larnaca and Nicosia.\n\nThis biography is sample text and can be replaced from the admin console.'
  },
  {
    slug: 'andreas-petrou',
    name: 'Andreas Petrou',
    title: 'Senior Associate',
    email: 'info@athanasiadoulaw.com',
    phone: '+357 24 044835',
    languages: 'Greek, English',
    education: 'LLB Law, University of Cyprus',
    admissions: 'Cyprus Bar Association',
    practice_areas: 'Litigation and Dispute Resolution, Employment Law, Debt Recovery',
    summary: 'Represents clients before the Cyprus courts in civil, commercial and employment disputes.',
    bio: 'Andreas handles civil and commercial litigation, employment claims and debt recovery before all levels of the Cyprus courts.\n\nHe prepares every case with care and keeps clients informed at each stage, aiming for efficient outcomes whether through negotiation, mediation or trial.\n\nThis biography is sample text and can be replaced from the admin console.'
  },
  {
    slug: 'eleni-georgiou',
    name: 'Eleni Georgiou',
    title: 'Associate',
    email: 'info@athanasiadoulaw.com',
    phone: '+357 24 044835',
    languages: 'Greek, English, Russian',
    education: 'LLB Law, University of Leicester',
    admissions: 'Cyprus Bar Association',
    practice_areas: 'Immigration and Residency, Family Law, Real Estate and Property',
    summary: 'Supports private clients with residency permits, family matters and property purchases in Cyprus.',
    bio: 'Eleni assists individuals and families relocating to Cyprus, with applications for residency and work permits, property purchases and family law matters.\n\nShe works closely with clients who are new to the Cypriot legal system and guides them through each step with patience and clarity.\n\nThis biography is sample text and can be replaced from the admin console.'
  }
];

export const seedPracticeAreas = [
  {
    slug: 'corporate-and-commercial',
    name: 'Corporate and Commercial',
    summary: 'Company formation, shareholder agreements, commercial contracts and ongoing corporate support.',
    body: 'We advise businesses at every stage, from incorporating a Cyprus company and drafting shareholder agreements to negotiating commercial contracts, restructuring and day to day corporate compliance.'
  },
  {
    slug: 'real-estate-and-property',
    name: 'Real Estate and Property',
    summary: 'Property purchases and sales, title checks, contracts and Land Registry matters.',
    body: 'We act for buyers, sellers and developers in residential and commercial property transactions, carrying out due diligence, drafting and reviewing sale agreements and handling Land Registry procedures.'
  },
  {
    slug: 'litigation-and-dispute-resolution',
    name: 'Litigation and Dispute Resolution',
    summary: 'Representation before the Cyprus courts and in mediation and arbitration.',
    body: 'We represent clients in civil and commercial disputes before the Cyprus courts, and in mediation and arbitration, always looking for the most effective route to resolve the matter.'
  },
  {
    slug: 'family-law',
    name: 'Family Law',
    summary: 'Divorce, child custody, maintenance and property relations between spouses.',
    body: 'We handle family matters with sensitivity and discretion, including divorce, custody and access, maintenance and the division of property between spouses.'
  },
  {
    slug: 'employment-law',
    name: 'Employment Law',
    summary: 'Employment contracts, workplace policies, dismissals and employment disputes.',
    body: 'We advise employers and employees on contracts, policies, redundancies and dismissals, and represent them before the Labour Disputes Court.'
  },
  {
    slug: 'immigration-and-residency',
    name: 'Immigration and Residency',
    summary: 'Residency permits, work permits and relocation to Cyprus.',
    body: 'We guide individuals, families and companies through Cyprus residency and work permit applications, and support relocation from start to finish.'
  },
  {
    slug: 'wills-and-succession',
    name: 'Wills and Succession',
    summary: 'Wills, estate administration and inheritance matters.',
    body: 'We prepare wills and assist families with the administration of estates and inheritance matters in Cyprus, including estates with assets abroad.'
  },
  {
    slug: 'debt-recovery',
    name: 'Debt Recovery',
    summary: 'Recovery of unpaid debts through negotiation and court proceedings.',
    body: 'We help businesses and individuals recover unpaid amounts efficiently, from formal demand letters to court proceedings and enforcement of judgments.'
  }
];

export const seedJobs = [
  {
    slug: 'trainee-lawyer',
    title: 'Trainee Lawyer',
    location: 'Larnaca',
    employment_type: 'Full time',
    summary: 'An opportunity for a law graduate to complete their training with a growing Larnaca practice.',
    description: 'You will work closely with our lawyers on corporate, property and litigation matters, preparing documents, carrying out legal research and attending court and client meetings.\n\nThis listing is sample text and can be edited or removed from the admin console.',
    requirements: 'Law degree (LLB or equivalent)\nEligible to train with the Cyprus Bar Association\nExcellent Greek and English, written and spoken\nOrganised, reliable and eager to learn'
  },
  {
    slug: 'legal-secretary',
    title: 'Legal Secretary',
    location: 'Larnaca',
    employment_type: 'Full time',
    summary: 'Support our lawyers and clients with the day to day running of the office.',
    description: 'You will manage diaries and correspondence, prepare and format legal documents, handle client calls and keep files in order.\n\nThis listing is sample text and can be edited or removed from the admin console.',
    requirements: 'Previous experience in a law firm or professional office\nExcellent Greek and English\nConfident with Microsoft Office\nDiscreet, friendly and well organised'
  }
];

// Translations of the starter content (Greek, Russian, Hebrew). English is the main text above.
export const seedI18n = {
  lawyers: {
    'maria-constantinou': {
      el: { title: 'Διευθύνουσα Εταίρος', summary: 'Ηγείται του γραφείου με έμφαση σε εταιρικά θέματα, ακίνητα και ιδιωτικούς πελάτες, συμβουλεύοντας ιδιώτες και επιχειρήσεις σε όλη την Κύπρο.' },
      ru: { title: 'Управляющий партнёр', summary: 'Руководит фирмой и специализируется на корпоративных вопросах, недвижимости и частных клиентах по всему Кипру.' },
      he: { title: 'שותפה מנהלת', summary: 'עומדת בראש המשרד ומתמחה בדיני חברות, נדל״ן ולקוחות פרטיים, ומייעצת לאנשים פרטיים ולעסקים בכל רחבי קפריסין.' }
    },
    'andreas-petrou': {
      el: { title: 'Ανώτερος Συνεργάτης', summary: 'Εκπροσωπεί πελάτες ενώπιον των κυπριακών δικαστηρίων σε αστικές, εμπορικές και εργατικές διαφορές.' },
      ru: { title: 'Старший юрист', summary: 'Представляет клиентов в судах Кипра по гражданским, коммерческим и трудовым спорам.' },
      he: { title: 'עמית בכיר', summary: 'מייצג לקוחות בבתי המשפט בקפריסין בסכסוכים אזרחיים, מסחריים ובדיני עבודה.' }
    },
    'eleni-georgiou': {
      el: { title: 'Συνεργάτιδα', summary: 'Υποστηρίζει ιδιώτες σε άδειες διαμονής, οικογενειακά θέματα και αγορές ακινήτων στην Κύπρο.' },
      ru: { title: 'Юрист', summary: 'Помогает частным клиентам с видом на жительство, семейными вопросами и покупкой недвижимости на Кипре.' },
      he: { title: 'עמיתה', summary: 'מסייעת ללקוחות פרטיים בהיתרי שהייה, בענייני משפחה וברכישת נכסים בקפריסין.' }
    }
  },
  areas: {
    'corporate-and-commercial': {
      el: { name: 'Εταιρικό και Εμπορικό Δίκαιο', summary: 'Σύσταση εταιρειών, συμφωνίες μετόχων, εμπορικές συμβάσεις και συνεχής εταιρική υποστήριξη.', body: 'Συμβουλεύουμε επιχειρήσεις σε κάθε στάδιο, από τη σύσταση κυπριακής εταιρείας και τη σύνταξη συμφωνιών μετόχων έως τη διαπραγμάτευση εμπορικών συμβάσεων, την αναδιάρθρωση και την καθημερινή εταιρική συμμόρφωση.' },
      ru: { name: 'Корпоративное и коммерческое право', summary: 'Регистрация компаний, соглашения акционеров, коммерческие договоры и постоянное корпоративное сопровождение.', body: 'Мы консультируем бизнес на каждом этапе: от регистрации кипрской компании и подготовки соглашений акционеров до переговоров по коммерческим договорам, реструктуризации и текущего корпоративного соответствия.' },
      he: { name: 'דיני חברות ומסחר', summary: 'הקמת חברות, הסכמי בעלי מניות, חוזים מסחריים וליווי תאגידי שוטף.', body: 'אנו מייעצים לעסקים בכל שלב, מהקמת חברה קפריסאית וניסוח הסכמי בעלי מניות ועד משא ומתן על חוזים מסחריים, ארגון מחדש ועמידה שוטפת בדרישות התאגידיות.' }
    },
    'real-estate-and-property': {
      el: { name: 'Ακίνητη Περιουσία', summary: 'Αγοραπωλησίες ακινήτων, έλεγχοι τίτλων, συμβόλαια και θέματα Κτηματολογίου.', body: 'Εκπροσωπούμε αγοραστές, πωλητές και αναπτυξιακές εταιρείες σε συναλλαγές οικιστικών και εμπορικών ακινήτων, διενεργώντας νομικό έλεγχο, συντάσσοντας και ελέγχοντας πωλητήρια έγγραφα και χειριζόμενοι διαδικασίες στο Κτηματολόγιο.' },
      ru: { name: 'Недвижимость', summary: 'Покупка и продажа недвижимости, проверка титулов, договоры и вопросы Земельного кадастра.', body: 'Мы представляем покупателей, продавцов и застройщиков в сделках с жилой и коммерческой недвижимостью: проводим юридическую проверку, составляем и проверяем договоры о покупке и продаже и ведём процедуры в Земельном кадастре.' },
      he: { name: 'נדל״ן ומקרקעין', summary: 'רכישה ומכירה של נכסים, בדיקות בעלות, חוזים וטיפול מול רשם המקרקעין.', body: 'אנו מייצגים קונים, מוכרים ויזמים בעסקאות נדל״ן למגורים ולמסחר, עורכים בדיקת נאותות, מנסחים ובודקים הסכמי מכר ומטפלים בהליכים מול רשם המקרקעין.' }
    },
    'litigation-and-dispute-resolution': {
      el: { name: 'Δικαστικές Διαφορές και Επίλυση Διαφορών', summary: 'Εκπροσώπηση ενώπιον των κυπριακών δικαστηρίων, σε διαμεσολάβηση και διαιτησία.', body: 'Εκπροσωπούμε πελάτες σε αστικές και εμπορικές διαφορές ενώπιον των κυπριακών δικαστηρίων, καθώς και σε διαμεσολάβηση και διαιτησία, αναζητώντας πάντα τον πιο αποτελεσματικό τρόπο επίλυσης.' },
      ru: { name: 'Судебные споры и разрешение споров', summary: 'Представительство в судах Кипра, в медиации и арбитраже.', body: 'Мы представляем клиентов в гражданских и коммерческих спорах в судах Кипра, а также в медиации и арбитраже, всегда выбирая наиболее эффективный путь к решению.' },
      he: { name: 'ליטיגציה ויישוב סכסוכים', summary: 'ייצוג בבתי המשפט בקפריסין, בגישור ובבוררות.', body: 'אנו מייצגים לקוחות בסכסוכים אזרחיים ומסחריים בבתי המשפט בקפריסין וכן בגישור ובבוררות, ותמיד מחפשים את הדרך היעילה ביותר לסיום העניין.' }
    },
    'family-law': {
      el: { name: 'Οικογενειακό Δίκαιο', summary: 'Διαζύγια, επιμέλεια τέκνων, διατροφή και περιουσιακές σχέσεις συζύγων.', body: 'Χειριζόμαστε οικογενειακές υποθέσεις με ευαισθησία και διακριτικότητα, όπως διαζύγια, επιμέλεια και επικοινωνία, διατροφή και διανομή περιουσίας μεταξύ συζύγων.' },
      ru: { name: 'Семейное право', summary: 'Развод, опека над детьми, алименты и имущественные отношения супругов.', body: 'Мы ведём семейные дела деликатно и конфиденциально: развод, опека и порядок общения с детьми, алименты и раздел имущества супругов.' },
      he: { name: 'דיני משפחה', summary: 'גירושין, משמורת ילדים, מזונות ויחסי ממון בין בני זוג.', body: 'אנו מטפלים בענייני משפחה ברגישות ובדיסקרטיות, לרבות גירושין, משמורת והסדרי שהות, מזונות וחלוקת רכוש בין בני זוג.' }
    },
    'employment-law': {
      el: { name: 'Εργατικό Δίκαιο', summary: 'Συμβάσεις εργασίας, πολιτικές χώρου εργασίας, απολύσεις και εργατικές διαφορές.', body: 'Συμβουλεύουμε εργοδότες και εργαζομένους σε θέματα συμβάσεων, πολιτικών, πλεονασμών και απολύσεων, και τους εκπροσωπούμε ενώπιον του Δικαστηρίου Εργατικών Διαφορών.' },
      ru: { name: 'Трудовое право', summary: 'Трудовые договоры, внутренние правила, увольнения и трудовые споры.', body: 'Мы консультируем работодателей и работников по договорам, внутренним правилам, сокращениям и увольнениям, а также представляем их в Суде по трудовым спорам.' },
      he: { name: 'דיני עבודה', summary: 'חוזי עבודה, נהלים במקום העבודה, פיטורים וסכסוכי עבודה.', body: 'אנו מייעצים למעסיקים ולעובדים בנושאי חוזים, נהלים, צמצומים ופיטורים, ומייצגים אותם בבית הדין לסכסוכי עבודה.' }
    },
    'immigration-and-residency': {
      el: { name: 'Μετανάστευση και Άδειες Διαμονής', summary: 'Άδειες διαμονής, άδειες εργασίας και μετεγκατάσταση στην Κύπρο.', body: 'Καθοδηγούμε ιδιώτες, οικογένειες και εταιρείες στις αιτήσεις για άδειες διαμονής και εργασίας στην Κύπρο και υποστηρίζουμε τη μετεγκατάσταση από την αρχή μέχρι το τέλος.' },
      ru: { name: 'Иммиграция и вид на жительство', summary: 'Вид на жительство, разрешения на работу и переезд на Кипр.', body: 'Мы сопровождаем частных лиц, семьи и компании при подаче заявлений на вид на жительство и разрешение на работу на Кипре и помогаем с переездом от начала до конца.' },
      he: { name: 'הגירה ותושבות', summary: 'היתרי שהייה, היתרי עבודה ורילוקיישן לקפריסין.', body: 'אנו מלווים אנשים פרטיים, משפחות וחברות בבקשות להיתרי שהייה ועבודה בקפריסין, ותומכים בתהליך המעבר מתחילתו ועד סופו.' }
    },
    'wills-and-succession': {
      el: { name: 'Διαθήκες και Κληρονομικό Δίκαιο', summary: 'Διαθήκες, διαχείριση περιουσίας και κληρονομικά θέματα.', body: 'Συντάσσουμε διαθήκες και βοηθούμε οικογένειες στη διαχείριση περιουσίας θανόντων και σε κληρονομικά θέματα στην Κύπρο, ακόμη και όταν υπάρχουν περιουσιακά στοιχεία στο εξωτερικό.' },
      ru: { name: 'Завещания и наследование', summary: 'Завещания, управление наследственным имуществом и наследственные вопросы.', body: 'Мы составляем завещания и помогаем семьям с управлением наследственным имуществом и наследственными вопросами на Кипре, в том числе когда часть активов находится за рубежом.' },
      he: { name: 'צוואות וירושות', summary: 'צוואות, ניהול עיזבונות וענייני ירושה.', body: 'אנו עורכים צוואות ומסייעים למשפחות בניהול עיזבונות ובענייני ירושה בקפריסין, גם כאשר חלק מהנכסים נמצאים בחו״ל.' }
    },
    'debt-recovery': {
      el: { name: 'Είσπραξη Οφειλών', summary: 'Είσπραξη απλήρωτων οφειλών μέσω διαπραγμάτευσης και δικαστικών διαδικασιών.', body: 'Βοηθούμε επιχειρήσεις και ιδιώτες να εισπράξουν απλήρωτα ποσά αποτελεσματικά, από επίσημες επιστολές απαίτησης έως δικαστικές διαδικασίες και εκτέλεση αποφάσεων.' },
      ru: { name: 'Взыскание долгов', summary: 'Взыскание задолженности путём переговоров и через суд.', body: 'Мы помогаем компаниям и частным лицам эффективно взыскивать долги: от официальных претензий до судебного разбирательства и исполнения решений.' },
      he: { name: 'גביית חובות', summary: 'גביית חובות שלא שולמו באמצעות משא ומתן והליכים משפטיים.', body: 'אנו מסייעים לעסקים ולאנשים פרטיים לגבות סכומים שלא שולמו ביעילות, ממכתבי דרישה רשמיים ועד הליכים משפטיים ואכיפת פסקי דין.' }
    }
  },
  jobs: {
    'trainee-lawyer': {
      el: { title: 'Ασκούμενος Δικηγόρος', location: 'Λάρνακα', employment_type: 'Πλήρης απασχόληση', summary: 'Ευκαιρία για απόφοιτο Νομικής να ολοκληρώσει την άσκησή του σε ένα αναπτυσσόμενο δικηγορικό γραφείο στη Λάρνακα.', description: 'Θα συνεργάζεστε στενά με τους δικηγόρους μας σε εταιρικά θέματα, ακίνητα και δικαστικές υποθέσεις, ετοιμάζοντας έγγραφα, κάνοντας νομική έρευνα και παρευρισκόμενοι σε δικαστήρια και συναντήσεις με πελάτες.', requirements: 'Πτυχίο Νομικής (LLB ή ισοδύναμο)\nΔικαίωμα άσκησης στον Παγκύπριο Δικηγορικό Σύλλογο\nΆριστα Ελληνικά και Αγγλικά, γραπτά και προφορικά\nΟργανωτικότητα, συνέπεια και διάθεση για μάθηση' },
      ru: { title: 'Стажёр', location: 'Ларнака', employment_type: 'Полная занятость', summary: 'Возможность для выпускника юридического факультета пройти стажировку в растущей фирме в Ларнаке.', description: 'Вы будете работать вместе с нашими юристами по корпоративным делам, недвижимости и судебным спорам: готовить документы, проводить правовые исследования, участвовать в судебных заседаниях и встречах с клиентами.', requirements: 'Юридическое образование (LLB или эквивалент)\nПраво проходить стажировку при Коллегии адвокатов Кипра\nОтличный греческий и английский, устно и письменно\nОрганизованность, ответственность и желание учиться' },
      he: { title: 'מתמחה במשפטים', location: 'לרנקה', employment_type: 'משרה מלאה', summary: 'הזדמנות לבוגר משפטים להשלים את ההתמחות במשרד צומח בלרנקה.', description: 'תעבדו לצד עורכי הדין שלנו בתיקי חברות, נדל״ן וליטיגציה, תכינו מסמכים, תערכו מחקר משפטי ותשתתפו בדיונים ובפגישות עם לקוחות.', requirements: 'תואר במשפטים (LLB או מקביל)\nזכאות להתמחות בלשכת עורכי הדין של קפריסין\nיוונית ואנגלית ברמה גבוהה, בכתב ובעל פה\nסדר, אמינות ורצון ללמוד' }
    },
    'legal-secretary': {
      el: { title: 'Νομική Γραμματέας', location: 'Λάρνακα', employment_type: 'Πλήρης απασχόληση', summary: 'Υποστήριξη των δικηγόρων και των πελατών μας στην καθημερινή λειτουργία του γραφείου.', description: 'Θα διαχειρίζεστε ημερολόγια και αλληλογραφία, θα ετοιμάζετε και θα μορφοποιείτε νομικά έγγραφα, θα εξυπηρετείτε τηλεφωνικά τους πελάτες και θα τηρείτε τους φακέλους οργανωμένους.', requirements: 'Προηγούμενη εμπειρία σε δικηγορικό ή επαγγελματικό γραφείο\nΆριστα Ελληνικά και Αγγλικά\nΆνεση με το Microsoft Office\nΕχεμύθεια, ευγένεια και οργανωτικότητα' },
      ru: { title: 'Секретарь юриста', location: 'Ларнака', employment_type: 'Полная занятость', summary: 'Поддержка наших юристов и клиентов в повседневной работе офиса.', description: 'Вы будете вести календари и переписку, готовить и оформлять юридические документы, отвечать на звонки клиентов и поддерживать порядок в делах.', requirements: 'Опыт работы в юридической фирме или профессиональном офисе\nОтличный греческий и английский\nУверенное владение Microsoft Office\nКонфиденциальность, доброжелательность и организованность' },
      he: { title: 'מזכירה משפטית', location: 'לרנקה', employment_type: 'משרה מלאה', summary: 'תמיכה בעורכי הדין ובלקוחות שלנו בניהול השוטף של המשרד.', description: 'תנהלו יומנים ותכתובות, תכינו ותעצבו מסמכים משפטיים, תענו לשיחות לקוחות ותשמרו על סדר בתיקים.', requirements: 'ניסיון קודם במשרד עורכי דין או במשרד מקצועי\nיוונית ואנגלית ברמה גבוהה\nשליטה ב Microsoft Office\nדיסקרטיות, אדיבות וסדר' }
    }
  }
};
