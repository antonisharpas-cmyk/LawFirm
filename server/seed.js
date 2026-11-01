// Starting content for H.A. Andreou & Co, taken from the firm's current website (ahllc.com.cy).
// Everything here can be edited or removed from the admin console.
// Photos and expertise images live in server/seed-images and are loaded into the database on first start.

const L = (title, el) => ({ title, el });
const T = {
  md: L('Managing Director', 'Διευθύνων Σύμβουλος'),
  partnerM: L('Partner', 'Εταίρος'),
  partnerF: L('Partner', 'Εταίρος'),
  assocM: L('Associate', 'Συνεργάτης Δικηγόρος'),
  assocF: L('Associate', 'Συνεργάτιδα Δικηγόρος'),
  traineeF: L('Trainee Lawyer', 'Ασκούμενη Δικηγόρος'),
  accounts: L('Head of Accounts', 'Προϊσταμένη Λογιστηρίου'),
  paralegal: L('Paralegal', 'Νομική Βοηθός'),
  pa: L('Legal PA', 'Γραμματέας Δικηγόρου')
};
const LANG = {
  ge: { en: 'Greek, English', el: 'Ελληνικά, Αγγλικά' },
  gef: { en: 'Greek, English, French', el: 'Ελληνικά, Αγγλικά, Γαλλικά' }
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
    }
  },
  {
    slug: 'property-and-conveyance',
    name: 'Property and Conveyance',
    summary: 'Purchases, sales and transfers of property, title checks and Land Registry procedures.',
    body: 'We act for buyers, sellers, developers and lenders in residential and commercial property transactions, from due diligence and contracts of sale to the transfer of title at the Land Registry.',
    i18n: {
      el: { name: 'Ακίνητη Περιουσία & Μεταβιβάσεις', summary: 'Αγορές, πωλήσεις και μεταβιβάσεις ακινήτων, έλεγχοι τίτλων και διαδικασίες Κτηματολογίου.', body: 'Εκπροσωπούμε αγοραστές, πωλητές, αναπτυξιακές εταιρείες και δανειστές σε συναλλαγές οικιστικών και εμπορικών ακινήτων, από τον νομικό έλεγχο και τα πωλητήρια έγγραφα έως τη μεταβίβαση του τίτλου στο Κτηματολόγιο.' },
    }
  },
  {
    slug: 'banking-finance',
    name: 'Banking & Finance',
    summary: 'Advice to banks, credit institutions and borrowers on lending, security and recovery.',
    body: 'We advise banking institutions and borrowers on loan and security documentation, mortgages and guarantees, regulatory matters and the enforcement of securities.',
    i18n: {
      el: { name: 'Τραπεζικό & Χρηματοοικονομικό Δίκαιο', summary: 'Συμβουλές σε τράπεζες, πιστωτικά ιδρύματα και δανειολήπτες για δανεισμό, εξασφαλίσεις και ανάκτηση.', body: 'Συμβουλεύουμε τραπεζικά ιδρύματα και δανειολήπτες σε δανειακά έγγραφα και εξασφαλίσεις, υποθήκες και εγγυήσεις, ρυθμιστικά θέματα και την εκτέλεση εξασφαλίσεων.' },
    }
  },
  {
    slug: 'insurance-law-personal-injury-claims',
    name: 'Insurance Law / Personal Injury Claims',
    summary: 'Advice and representation for individuals and insurers in all areas of personal injury and insurance law.',
    body: 'Our firm offers legal advice and representation to individuals and insurance companies in all areas of personal injury and insurance law, with great expertise in multi party and multi injury actions.\nWhere possible, our team concentrates its efforts on negotiating and settling cases before court proceedings, so that our clients can avoid the expense and the stress of litigation.\nWe deal with all types of personal injury claims, including:\n• Fatal accidents\n• Road traffic accidents\n• Professional negligence\n• Medical negligence\n• Public liability claims\n• Occupier’s liability\n• Employer’s liability\n• Product liability claims',
    i18n: {
      el: { name: 'Ασφαλιστικό Δίκαιο / Αγωγές Σωματικών Βλαβών', summary: 'Συμβουλές και εκπροσώπηση ιδιωτών και ασφαλιστικών εταιρειών σε όλους τους τομείς σωματικών βλαβών και ασφαλιστικού δικαίου.', body: 'Το γραφείο μας παρέχει νομικές συμβουλές και εκπροσώπηση σε ιδιώτες και ασφαλιστικές εταιρείες σε όλους τους τομείς των σωματικών βλαβών και του ασφαλιστικού δικαίου, με μεγάλη εμπειρία σε αγωγές με πολλούς διαδίκους και πολλαπλούς τραυματισμούς.\nΌπου είναι δυνατόν, η ομάδα μας επικεντρώνεται στη διαπραγμάτευση και τον εξωδικαστικό διακανονισμό, ώστε οι πελάτες μας να αποφεύγουν τα έξοδα και το άγχος της δικαστικής διαδικασίας.\nΧειριζόμαστε κάθε είδους αγωγή σωματικής βλάβης, όπως:\n• Θανατηφόρα ατυχήματα\n• Τροχαία ατυχήματα\n• Επαγγελματική αμέλεια\n• Ιατρική αμέλεια\n• Αστική ευθύνη έναντι τρίτων\n• Ευθύνη κατόχου ακινήτου\n• Ευθύνη εργοδότη\n• Ευθύνη για ελαττωματικά προϊόντα' },
    }
  },
  {
    slug: 'debt-collection-and-recovery',
    name: 'Debt Collection and Recovery',
    summary: 'Proactive advice and a full range of court and investigative procedures for effective debt recovery.',
    body: 'Our team has the knowledge and experience to understand the needs and requirements of each of our clients and to provide proactive advice and a full range of court and investigative procedures for an effective debt recovery service.\nWe can provide the following services:\n• Investigations into the financial status of the debtor\n• Designing and enforcing interim protective measures to secure or freeze assets before litigation\n• Proceedings for the execution of court judgments\n• Proceedings to set aside fraudulent dissipation of assets\n• Liquidation proceedings\n• Bankruptcy proceedings',
    i18n: {
      el: { name: 'Είσπραξη & Ανάκτηση Οφειλών', summary: 'Προληπτικές συμβουλές και πλήρες φάσμα δικαστικών και ερευνητικών διαδικασιών για αποτελεσματική ανάκτηση οφειλών.', body: 'Η ομάδα μας διαθέτει τη γνώση και την εμπειρία για να κατανοεί τις ανάγκες κάθε πελάτη και να παρέχει προληπτικές συμβουλές και πλήρες φάσμα δικαστικών και ερευνητικών διαδικασιών για αποτελεσματική ανάκτηση οφειλών.\nΠροσφέρουμε τις ακόλουθες υπηρεσίες:\n• Έρευνα για την οικονομική κατάσταση του οφειλέτη\n• Σχεδιασμό και εφαρμογή προσωρινών μέτρων εξασφάλισης ή δέσμευσης περιουσίας πριν από τη δίκη\n• Διαδικασίες εκτέλεσης δικαστικών αποφάσεων\n• Διαδικασίες ακύρωσης δόλιας αποξένωσης περιουσίας\n• Διαδικασίες εκκαθάρισης\n• Διαδικασίες πτώχευσης' },
    }
  },
  {
    slug: 'wills-probates',
    name: 'Wills & Probates',
    summary: 'Wills, estate administration and probate matters in Cyprus and abroad.',
    body: 'We prepare wills and guide executors and families through the administration of estates, the grant of probate and the resealing of foreign grants in Cyprus.',
    i18n: {
      el: { name: 'Διαθήκες & Διαχείριση Κληρονομιών', summary: 'Διαθήκες, διαχείριση περιουσίας θανόντων και επικυρώσεις διαθηκών στην Κύπρο και στο εξωτερικό.', body: 'Συντάσσουμε διαθήκες και καθοδηγούμε εκτελεστές και οικογένειες στη διαχείριση της περιουσίας, στην έκδοση γραμμάτων διαχείρισης και στην επανασφράγιση ξένων γραμμάτων στην Κύπρο.' },
    }
  },
  {
    slug: 'succession-law',
    name: 'Succession Law',
    summary: 'Inheritance rights, estates with assets in more than one country and disputes between heirs.',
    body: 'We advise heirs, beneficiaries and administrators on their rights under Cypriot succession law, including the statutory share of the estate, succession without a will and estates with assets or heirs abroad, applying the European Succession Regulation where relevant. We also represent clients in inheritance disputes before the Cyprus courts.',
    i18n: {
      el: { name: 'Κληρονομικό Δίκαιο', summary: 'Κληρονομικά δικαιώματα, περιουσίες σε περισσότερες από μία χώρες και διαφορές μεταξύ κληρονόμων.', body: 'Συμβουλεύουμε κληρονόμους, δικαιούχους και διαχειριστές για τα δικαιώματά τους βάσει του κυπριακού κληρονομικού δικαίου, συμπεριλαμβανομένης της νόμιμης μοίρας, της εξ αδιαθέτου διαδοχής και των περιουσιών με περιουσιακά στοιχεία ή κληρονόμους στο εξωτερικό, εφαρμόζοντας τον Ευρωπαϊκό Κανονισμό για τις Κληρονομίες όπου χρειάζεται. Εκπροσωπούμε επίσης πελάτες σε κληρονομικές διαφορές ενώπιον των κυπριακών δικαστηρίων.' }
    }
  },
  {
    slug: 'criminal-law',
    name: 'Criminal Law',
    summary: 'Defence and representation in criminal proceedings before the Cyprus courts.',
    body: 'We represent individuals and companies at every stage of criminal proceedings, from investigation and police questioning to trial and appeal, with discretion and determination.',
    i18n: {
      el: { name: 'Ποινικό Δίκαιο', summary: 'Υπεράσπιση και εκπροσώπηση σε ποινικές διαδικασίες ενώπιον των κυπριακών δικαστηρίων.', body: 'Εκπροσωπούμε ιδιώτες και εταιρείες σε κάθε στάδιο της ποινικής διαδικασίας, από τη διερεύνηση και την ανάκριση έως τη δίκη και την έφεση, με διακριτικότητα και αποφασιστικότητα.' },
    }
  },
  {
    slug: 'family-law',
    name: 'Family Law',
    summary: 'Divorce, child custody, maintenance and property disputes between spouses.',
    body: 'We handle family matters with sensitivity and discretion, including divorce, custody and access, maintenance and the division of property between spouses.',
    i18n: {
      el: { name: 'Οικογενειακό Δίκαιο', summary: 'Διαζύγια, επιμέλεια τέκνων, διατροφή και περιουσιακές διαφορές συζύγων.', body: 'Χειριζόμαστε οικογενειακές υποθέσεις με ευαισθησία και διακριτικότητα, όπως διαζύγια, επιμέλεια και επικοινωνία, διατροφή και διανομή περιουσίας μεταξύ συζύγων.' },
    }
  },
  {
    slug: 'employment-law',
    name: 'Employment Law',
    summary: 'Employment contracts, dismissals, redundancies and labour disputes.',
    body: 'We advise employers and employees on contracts, workplace policies, redundancies and dismissals, and represent them before the Labour Disputes Court.',
    i18n: {
      el: { name: 'Εργατικό Δίκαιο', summary: 'Συμβάσεις εργασίας, απολύσεις, πλεονασμοί και εργατικές διαφορές.', body: 'Συμβουλεύουμε εργοδότες και εργαζομένους σε θέματα συμβάσεων, πολιτικών, πλεονασμών και απολύσεων, και τους εκπροσωπούμε ενώπιον του Δικαστηρίου Εργατικών Διαφορών.' },
    }
  },
  {
    slug: 'insolvency-restructuring',
    name: 'Insolvency & Restructuring',
    summary: 'Liquidations, bankruptcies, examinership and corporate restructuring.',
    body: 'We advise creditors, debtors and directors on liquidations, bankruptcies, examinership and the restructuring of businesses in financial difficulty.',
    i18n: {
      el: { name: 'Αφερεγγυότητα & Αναδιάρθρωση', summary: 'Εκκαθαρίσεις, πτωχεύσεις, εξέταση και εταιρική αναδιάρθρωση.', body: 'Συμβουλεύουμε πιστωτές, οφειλέτες και διευθυντές σε εκκαθαρίσεις, πτωχεύσεις, διαδικασίες εξεταστή και αναδιάρθρωση επιχειρήσεων που αντιμετωπίζουν οικονομικές δυσκολίες.' },
    }
  },
  {
    slug: 'construction-law',
    name: 'Construction Law',
    summary: 'Construction contracts, disputes and claims for developers, contractors and owners.',
    body: 'We advise developers, contractors and property owners on construction contracts and represent them in disputes over defects, delays and payments.',
    i18n: {
      el: { name: 'Δίκαιο Κατασκευών', summary: 'Συμβάσεις κατασκευής, διαφορές και απαιτήσεις για αναπτυξιακές εταιρείες, εργολάβους και ιδιοκτήτες.', body: 'Συμβουλεύουμε αναπτυξιακές εταιρείες, εργολάβους και ιδιοκτήτες σε συμβάσεις κατασκευής και τους εκπροσωπούμε σε διαφορές για ελαττώματα, καθυστερήσεις και πληρωμές.' },
    }
  },
  {
    slug: 'intellectual-property',
    name: 'Intellectual Property',
    summary: 'Protection and enforcement of trademarks, copyright and other intellectual property rights.',
    body: 'We assist with the registration, licensing and protection of trademarks and other intellectual property rights, and act in infringement disputes.',
    i18n: {
      el: { name: 'Πνευματική Ιδιοκτησία', summary: 'Προστασία και επιβολή εμπορικών σημάτων, πνευματικών δικαιωμάτων και άλλων δικαιωμάτων πνευματικής ιδιοκτησίας.', body: 'Βοηθούμε στην εγγραφή, αδειοδότηση και προστασία εμπορικών σημάτων και άλλων δικαιωμάτων πνευματικής ιδιοκτησίας και εκπροσωπούμε πελάτες σε διαφορές παραβίασης.' },
    }
  },
  {
    slug: 'administrative-law',
    name: 'Administrative Law',
    summary: 'Recourses against decisions of public authorities before the Administrative Court.',
    body: 'We challenge decisions of public authorities and represent clients in administrative recourses, including matters of public procurement, licensing and the public service.',
    i18n: {
      el: { name: 'Διοικητικό Δίκαιο', summary: 'Προσφυγές κατά αποφάσεων δημόσιων αρχών ενώπιον του Διοικητικού Δικαστηρίου.', body: 'Αμφισβητούμε αποφάσεις δημόσιων αρχών και εκπροσωπούμε πελάτες σε διοικητικές προσφυγές, μεταξύ άλλων σε θέματα δημόσιων συμβάσεων, αδειοδοτήσεων και δημόσιας υπηρεσίας.' },
    }
  },
  {
    slug: 'international-trusts',
    name: 'International Trusts',
    summary: 'Establishment and administration of Cyprus international trusts.',
    body: 'We advise on the establishment, administration and restructuring of Cyprus international trusts, an effective framework for asset protection and succession planning.',
    i18n: {
      el: { name: 'Διεθνή Καταπιστεύματα', summary: 'Σύσταση και διαχείριση κυπριακών διεθνών καταπιστευμάτων.', body: 'Συμβουλεύουμε στη σύσταση, διαχείριση και αναδιάρθρωση κυπριακών διεθνών καταπιστευμάτων, ένα αποτελεσματικό πλαίσιο για την προστασία περιουσίας και τον σχεδιασμό διαδοχής.' },
    }
  },
  {
    slug: 'immigration-and-migration-law-european-citizenship-residency',
    name: 'Immigration and Migration Law (European Citizenship & Residency)',
    summary: 'Residency permits, work permits, European citizenship and relocation to Cyprus.',
    body: 'We guide individuals, families and businesses through applications for residency and work permits, naturalisation and European citizenship, and support relocation to Cyprus from start to finish.',
    i18n: {
      el: { name: 'Μεταναστευτικό Δίκαιο (Ευρωπαϊκή Υπηκοότητα & Διαμονή)', summary: 'Άδειες διαμονής, άδειες εργασίας, ευρωπαϊκή υπηκοότητα και μετεγκατάσταση στην Κύπρο.', body: 'Καθοδηγούμε ιδιώτες, οικογένειες και επιχειρήσεις σε αιτήσεις για άδειες διαμονής και εργασίας, πολιτογράφηση και ευρωπαϊκή υπηκοότητα, και υποστηρίζουμε τη μετεγκατάσταση στην Κύπρο από την αρχή έως το τέλος.' },
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
    }
  }
];
