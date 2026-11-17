// Starting content for H.A. Andreou & Co, taken from the firm's current website (ahllc.com.cy).
// Everything here can be edited or removed from the admin console.
// Photos and expertise images live in server/seed-images and are loaded into the database on first start.

const L = (title, el) => ({ title, el });
const T = {
  managingPartnerF: L('Managing Partner', 'Διευθύνουσα Εταίρος'),
  partnerM: L('Partner', 'Εταίρος'),
  seniorAssocM: L('Senior Associate', 'Ανώτερος Συνεργάτης Δικηγόρος'),
  seniorAssocF: L('Senior Associate', 'Ανώτερη Συνεργάτιδα Δικηγόρος'),
  assocM: L('Associate', 'Συνεργάτης Δικηγόρος'),
  assocF: L('Associate', 'Συνεργάτιδα Δικηγόρος'),
  traineeM: L('Trainee Lawyer', 'Ασκούμενος Δικηγόρος'),
  none: L('', '') // role to be confirmed by the firm
};
const LANG = {
  ge: { en: 'Greek, English', el: 'Ελληνικά, Αγγλικά' }
};

// The firm's team as confirmed by the firm. No profile photos for now (initials are shown instead);
// photos can be uploaded later from the admin console.
// published: false = in the admin console but hidden on the website.
const people = [
  ['helena-andreou', 'Helena Andreou', T.managingPartnerF, 'h.andreou@ahllc.com.cy', '+357 24 433070', LANG.ge,
    'LL.M., International and Commercial Law, University of Sheffield, 1993\nLL.B. (Hons.), University of Leicester, 1992',
    'Member of the Cyprus Bar, 1995', true],
  ['giorgos-neofytidis', 'Giorgos Neofytidis', T.partnerM, '', '+357 24 433070', LANG.ge, '', '', true],
  ['kyriakos-georgiou', 'Kyriakos Georgiou', T.seniorAssocM, 'k.georgiou@ahllc.com.cy', '+357 24 433070', LANG.ge,
    'Law Degree, Democritus University of Thrace, 2021',
    'Member of the Cyprus Bar, 2022', true],
  ['maria-hadjisavva', 'Maria Hadjisavva', T.seniorAssocF, 'm.hadjisavva@ahllc.com.cy', '+357 24 433070', LANG.ge,
    'LL.B. (Hons), University of Central Lancashire Cyprus (UCLan), 2020',
    'Member of the Cyprus Bar, 2022', true],
  ['anastasis-mytidis', 'Anastasis Mytidis', T.assocM, 'am@ahllc.com.cy', '+357 24 433070', LANG.ge,
    'LL.B., National and Kapodistrian University of Athens, 2022',
    'Member of the Cyprus Bar Association, 2023', true],
  ['antonis-neofytou', 'Antonis Neofytou', T.traineeM, '', '+357 24 433070', LANG.ge, '', '', true],
  // hidden, roles to be confirmed
  ['alexia-ioannou', 'Alexia Ioannou', T.none, '', '+357 24 433070', LANG.ge,
    'LL.B. (Hons), Newcastle University, 2022\nLL.M. International Commercial Law, Newcastle University, 2023', '', false],
  ['kyriaki-vasileiadou', 'Kyriaki Vasileiadou', T.none, '', '+357 24 433070', LANG.ge,
    'LL.B. (Hons), SOAS University of London, 2015\nLPC MSc Law, Business and Management, University of Law, Bloomsbury, 2017', '', false],
  ['maria-charalambous', 'Maria Charalambous', T.none, 'm.charalambous@ahllc.com.cy', '+357 24 433070', LANG.ge, '', '', false],
  ['anna-andreou', 'Anna Andreou', T.none, 'anna.andreou@ahllc.com.cy', '+357 24 433070', LANG.ge, '', '', false]
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
  photo: null,
  i18n: {
    el: { ...(t.el ? { title: t.el } : {}), languages: langs.el },
  }
}));

// Expertise. Lines starting with "• " are shown as a bulleted list.
// The firm's areas of expertise. Each uses one of the photos in server/seed-images/areas.
export const seedPracticeAreas = [
  {
    slug: "litigation-dispute-resolution",
    name: "Litigation & Dispute Resolution",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Representation before all Cyprus courts, at first instance and on appeal, in civil, commercial and land disputes, tort claims, debt recovery and insolvency proceedings.",
    body: "We represent businesses and individuals before all Cyprus courts, from interim applications and freezing orders to trial, appeal and the enforcement of judgments, including the recognition of foreign judgments in Cyprus.\nWe aim to resolve disputes efficiently, through negotiation or mediation where that serves the client, and to pursue them firmly in court where it does not.\nOur litigation work includes:\n• Commercial and contractual disputes\n• Shareholder and corporate disputes\n• Land and property disputes\n• Tort claims, including professional negligence\n• Debt recovery, including investigations into the financial status of debtors\n• Interim injunctions, freezing and disclosure orders\n• Proceedings to set aside fraudulent transfers of assets\n• Liquidation and bankruptcy proceedings\n• Appeals before the Court of Appeal and the Supreme Court\n• Enforcement of judgments, including the recognition of foreign judgments",
    image: "areas/criminal-law.jpg",
    i18n: {
      el: { name: "Επίλυση Διαφορών & Δικαστική Εκπροσώπηση", summary: "Εκπροσώπηση ενώπιον όλων των δικαστηρίων της Κύπρου, σε πρώτο βαθμό και σε έφεση, σε αστικές, εμπορικές και κτηματικές διαφορές, αγωγές αστικών αδικημάτων, είσπραξη οφειλών και διαδικασίες αφερεγγυότητας.", body: "Εκπροσωπούμε επιχειρήσεις και ιδιώτες ενώπιον όλων των δικαστηρίων της Κύπρου, από ενδιάμεσες αιτήσεις και διατάγματα δέσμευσης περιουσιακών στοιχείων έως την ακρόαση, την έφεση και την εκτέλεση αποφάσεων, συμπεριλαμβανομένης της αναγνώρισης αλλοδαπών αποφάσεων στην Κύπρο.\nΣτόχος μας είναι η αποτελεσματική επίλυση των διαφορών, μέσω διαπραγμάτευσης ή διαμεσολάβησης όπου αυτό εξυπηρετεί τον πελάτη, και η αποφασιστική προώθησή τους στο δικαστήριο όπου δεν τον εξυπηρετεί.\nΗ δικαστική μας εργασία περιλαμβάνει:\n• Εμπορικές και συμβατικές διαφορές\n• Διαφορές μετόχων και εταιρικές διαφορές\n• Διαφορές γης και ακινήτων\n• Αγωγές αστικών αδικημάτων, συμπεριλαμβανομένης της επαγγελματικής αμέλειας\n• Είσπραξη οφειλών, συμπεριλαμβανομένης της διερεύνησης της οικονομικής κατάστασης των οφειλετών\n• Προσωρινά διατάγματα, διατάγματα δέσμευσης και αποκάλυψης\n• Διαδικασίες ακύρωσης δόλιων μεταβιβάσεων περιουσιακών στοιχείων\n• Διαδικασίες εκκαθάρισης και πτώχευσης\n• Εφέσεις ενώπιον του Εφετείου και του Ανωτάτου Δικαστηρίου\n• Εκτέλεση αποφάσεων, συμπεριλαμβανομένης της αναγνώρισης αλλοδαπών αποφάσεων" }
    }
  },
  {
    slug: "corporate-commercial",
    name: "Corporate & Commercial",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Company formation, governance, transactions, family business succession, commercial agreements and intellectual property for local and international businesses.",
    body: "We advise companies, shareholders and directors on incorporation, governance, due diligence, mergers and acquisitions, restructurings and family business succession, and draft the commercial agreements that support their business.\nWe regularly assist with:\n• Company incorporation and corporate housekeeping\n• Corporate governance and shareholder agreements\n• Due diligence, mergers, acquisitions and share transfers\n• Restructurings, reorganisations and examinership\n• Family business succession, including family agreements and the transfer of shares to the next generation\n• Supply, distribution, agency, franchise and service agreements\n• Trademark registration and intellectual property protection",
    image: "areas/corporate-commercial-law.jpg",
    i18n: {
      el: { name: "Εταιρικό & Εμπορικό Δίκαιο", summary: "Σύσταση εταιρειών, εταιρική διακυβέρνηση, συναλλαγές, διαδοχή οικογενειακών επιχειρήσεων, εμπορικές συμβάσεις και πνευματική ιδιοκτησία για τοπικές και διεθνείς επιχειρήσεις.", body: "Συμβουλεύουμε εταιρείες, μετόχους και διευθυντές για τη σύσταση, τη διακυβέρνηση, τον νομικό έλεγχο, τις συγχωνεύσεις και εξαγορές, τις αναδιαρθρώσεις και τη διαδοχή οικογενειακών επιχειρήσεων, και συντάσσουμε τις εμπορικές συμβάσεις που στηρίζουν τη δραστηριότητά τους.\nΣυνδράμουμε τακτικά σε:\n• Σύσταση εταιρειών και τήρηση εταιρικών υποχρεώσεων\n• Εταιρική διακυβέρνηση και συμφωνίες μετόχων\n• Νομικό έλεγχο, συγχωνεύσεις, εξαγορές και μεταβιβάσεις μετοχών\n• Αναδιαρθρώσεις, αναδιοργανώσεις και εξεταστεία\n• Διαδοχή οικογενειακών επιχειρήσεων, συμπεριλαμβανομένων οικογενειακών συμφωνιών και της μεταβίβασης μετοχών στην επόμενη γενιά\n• Συμβάσεις προμήθειας, διανομής, αντιπροσωπείας, δικαιόχρησης και παροχής υπηρεσιών\n• Εγγραφή εμπορικών σημάτων και προστασία πνευματικής ιδιοκτησίας" }
    }
  },
  {
    slug: "start-ups-entrepreneurs",
    name: "Start-ups & Entrepreneurs",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Legal packages at an agreed fee, taking new businesses from incorporation to investment.",
    body: "Drawing on our corporate, commercial and employment practice, we offer founders and start-ups clear legal packages at a fee agreed in advance, so they can plan their legal costs from day one.\nEach package can be tailored, and clients can move from one to the next as the business grows.\nOur packages include:\n• Launch: company incorporation, shareholders’ agreement, beneficial ownership filings, and website terms and privacy policy\n• Build: employment and consultant contracts, assignment of intellectual property to the company, trademark registration and key commercial contracts\n• Raise: investment and convertible loan agreements, investor rights, and employee share and incentive schemes\n• Ongoing support: corporate housekeeping, annual filings and day-to-day legal advice under a monthly retainer",
    image: "areas/intellectual-property.jpg",
    i18n: {
      el: { name: "Νεοφυείς Επιχειρήσεις & Επιχειρηματίες", summary: "Νομικά πακέτα με προσυμφωνημένη αμοιβή, από τη σύσταση μιας νέας επιχείρησης έως την προσέλκυση επενδύσεων.", body: "Αξιοποιώντας την εμπειρία μας στο εταιρικό, εμπορικό και εργατικό δίκαιο, προσφέρουμε σε ιδρυτές και νεοφυείς επιχειρήσεις σαφή νομικά πακέτα με αμοιβή που συμφωνείται εκ των προτέρων, ώστε να μπορούν να προγραμματίζουν το νομικό τους κόστος από την πρώτη μέρα.\nΚάθε πακέτο προσαρμόζεται στις ανάγκες του πελάτη, και οι πελάτες μπορούν να περνούν από το ένα πακέτο στο επόμενο καθώς η επιχείρηση αναπτύσσεται.\nΤα πακέτα μας περιλαμβάνουν:\n• Launch: σύσταση εταιρείας, συμφωνία μετόχων, δηλώσεις πραγματικών δικαιούχων, καθώς και όρους χρήσης και πολιτική απορρήτου ιστοσελίδας\n• Build: συμβάσεις εργασίας και συμβούλων, εκχώρηση πνευματικής ιδιοκτησίας στην εταιρεία, εγγραφή εμπορικών σημάτων και βασικές εμπορικές συμβάσεις\n• Raise: συμφωνίες επένδυσης και μετατρέψιμου δανείου, δικαιώματα επενδυτών, καθώς και σχέδια μετοχών και κινήτρων για εργαζομένους\n• Ongoing support: τήρηση εταιρικών υποχρεώσεων, ετήσιες καταθέσεις και καθημερινή νομική υποστήριξη με μηνιαία αμοιβή" }
    }
  },
  {
    slug: "employment-incentives",
    name: "Employment & Incentives",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Employment contracts, workplace policies, dismissals, labour disputes and employee incentive schemes.",
    body: "We advise employers and employees on contracts, workplace policies, equality, pay transparency, dismissals and redundancies, and represent them before the Labour Disputes Court.\nWe also advise employers on employee incentives, from employee benefit trusts to profit-sharing and other bonus schemes.\nOur work includes:\n• Employment contracts and workplace policies\n• Equality, inclusion and anti-harassment policies\n• Preparing for the EU Pay Transparency Directive\n• Dismissals, redundancies and disciplinary procedures\n• Representation before the Labour Disputes Court\n• Employee benefit trusts, profit-sharing and bonus schemes",
    image: "areas/employment-law.jpg",
    i18n: {
      el: { name: "Εργατικό Δίκαιο & Κίνητρα Εργαζομένων", summary: "Συμβάσεις εργασίας, πολιτικές χώρου εργασίας, απολύσεις, εργατικές διαφορές και σχέδια κινήτρων για εργαζομένους.", body: "Συμβουλεύουμε εργοδότες και εργαζομένους για συμβάσεις, πολιτικές χώρου εργασίας, ισότητα, διαφάνεια αμοιβών, απολύσεις και πλεονασμούς, και τους εκπροσωπούμε ενώπιον του Δικαστηρίου Εργατικών Διαφορών.\nΣυμβουλεύουμε επίσης εργοδότες για κίνητρα εργαζομένων, από καταπιστεύματα παροχών προς εργαζομένους έως σχέδια συμμετοχής στα κέρδη και άλλα σχέδια μπόνους.\nΗ εργασία μας περιλαμβάνει:\n• Συμβάσεις εργασίας και πολιτικές χώρου εργασίας\n• Πολιτικές ισότητας, συμπερίληψης και πρόληψης παρενόχλησης\n• Προετοιμασία για την Ευρωπαϊκή Οδηγία για τη Διαφάνεια των Αμοιβών\n• Απολύσεις, πλεονασμούς και πειθαρχικές διαδικασίες\n• Εκπροσώπηση ενώπιον του Δικαστηρίου Εργατικών Διαφορών\n• Καταπιστεύματα παροχών προς εργαζομένους, σχέδια συμμετοχής στα κέρδη και σχέδια μπόνους" }
    }
  },
  {
    slug: "real-estate-construction",
    name: "Real Estate & Construction",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Property transactions, Land Registry procedures, and construction contracts and disputes.",
    body: "We act for buyers, sellers, developers and lenders in residential and commercial property transactions, from due diligence and contracts of sale to the transfer of title at the Land Registry.\nWe also advise developers, contractors and property owners on construction contracts and represent them in disputes over defects, delays and payments.\nOur services include:\n• Title searches and due diligence\n• Drafting and negotiating contracts of sale\n• Deposit of contracts of sale at the Land Registry\n• Transfer of title\n• Mortgages and other charges over property\n• Construction contracts for developers, contractors and owners\n• Construction disputes over defects, delays and payments",
    image: "areas/construction-law.jpg",
    i18n: {
      el: { name: "Ακίνητα & Κατασκευές", summary: "Συναλλαγές ακινήτων, διαδικασίες στο Κτηματολόγιο, καθώς και κατασκευαστικές συμβάσεις και διαφορές.", body: "Ενεργούμε για αγοραστές, πωλητές, επιχειρηματίες ανάπτυξης γης και δανειστές σε συναλλαγές οικιστικών και εμπορικών ακινήτων, από τον νομικό έλεγχο και τα πωλητήρια έγγραφα έως τη μεταβίβαση του τίτλου στο Κτηματολόγιο.\nΣυμβουλεύουμε επίσης επιχειρηματίες ανάπτυξης γης, εργολάβους και ιδιοκτήτες ακινήτων για κατασκευαστικές συμβάσεις και τους εκπροσωπούμε σε διαφορές για ελαττώματα, καθυστερήσεις και πληρωμές.\nΟι υπηρεσίες μας περιλαμβάνουν:\n• Έρευνες τίτλων και νομικό έλεγχο\n• Σύνταξη και διαπραγμάτευση πωλητηρίων εγγράφων\n• Κατάθεση πωλητηρίων εγγράφων στο Κτηματολόγιο\n• Μεταβίβαση τίτλου\n• Υποθήκες και άλλες επιβαρύνσεις επί ακινήτων\n• Κατασκευαστικές συμβάσεις για επιχειρηματίες ανάπτυξης γης, εργολάβους και ιδιοκτήτες\n• Κατασκευαστικές διαφορές για ελαττώματα, καθυστερήσεις και πληρωμές" }
    }
  },
  {
    slug: "landlord-tenant",
    name: "Landlord & Tenant",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Commercial and residential leases, rent control, property management and landlord and tenant disputes.",
    body: "We advise landlords and tenants on commercial and residential leases, from negotiation and drafting to renewal and termination, and represent them in eviction and rent recovery claims before the Rent Control Courts and the District Courts.\nOur work includes:\n• Drafting and negotiating commercial and residential leases\n• Lease renewals, rent reviews and rent increase applications\n• Statutory tenancies under the Rent Control Law\n• Legal support for property management, including tenancy documentation and notices\n• Recovery of possession and eviction proceedings, acting for landlords or tenants\n• Claims for unpaid rent and damage to property",
    image: "areas/property-and-conveyance.jpg",
    i18n: {
      el: { name: "Ιδιοκτήτες & Ενοικιαστές", summary: "Εμπορικές και οικιστικές μισθώσεις, έλεγχος ενοικιάσεων, διαχείριση ακινήτων και διαφορές μεταξύ ιδιοκτητών και ενοικιαστών.", body: "Συμβουλεύουμε ιδιοκτήτες και ενοικιαστές για εμπορικές και οικιστικές μισθώσεις, από τη διαπραγμάτευση και τη σύνταξη έως την ανανέωση και τον τερματισμό, και τους εκπροσωπούμε σε αγωγές έξωσης και ανάκτησης ενοικίων ενώπιον των Δικαστηρίων Ελέγχου Ενοικιάσεων και των Επαρχιακών Δικαστηρίων.\nΗ εργασία μας περιλαμβάνει:\n• Σύνταξη και διαπραγμάτευση εμπορικών και οικιστικών μισθώσεων\n• Ανανεώσεις μισθώσεων, αναθεωρήσεις ενοικίου και αιτήσεις αύξησης ενοικίου\n• Θέσμιες ενοικιάσεις βάσει του περί Ενοικιοστασίου Νόμου\n• Νομική υποστήριξη στη διαχείριση ακινήτων, συμπεριλαμβανομένων εγγράφων μίσθωσης και ειδοποιήσεων\n• Ανάκτηση κατοχής και διαδικασίες έξωσης, για ιδιοκτήτες ή ενοικιαστές\n• Απαιτήσεις για απλήρωτα ενοίκια και ζημιές σε ακίνητα" }
    }
  },
  {
    slug: "private-client-succession",
    name: "Private Client & Succession",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Wills, estates, succession, trusts and elder law, in Cyprus and across borders.",
    body: "For over fifty years we have advised families on protecting and passing on what they have built. We plan ahead with our clients and their other advisers, guide them through the administration of estates, and represent them when disputes arise.\nOur work includes:\n• Wills and succession planning\n• Gifts and transfers of property within the family\n• Estate administration, probate and the resealing of foreign grants\n• Cross-border estates and the European Succession Regulation\n• Cyprus trusts, both domestic and international\n• Elder law, including planning for incapacity and applications for the appointment of an administrator of the property of a person unable to manage their own affairs\n• Inheritance and estate disputes before the Cyprus courts",
    image: "areas/succession-law.jpg",
    i18n: {
      el: { name: "Ιδιωτικοί Πελάτες & Κληρονομικό Δίκαιο", summary: "Διαθήκες, περιουσίες, κληρονομικό δίκαιο, καταπιστεύματα και θέματα ηλικιωμένων, στην Κύπρο και διασυνοριακά.", body: "Για περισσότερα από πενήντα χρόνια συμβουλεύουμε οικογένειες για την προστασία και τη μεταβίβαση όσων έχουν δημιουργήσει. Σχεδιάζουμε το μέλλον μαζί με τους πελάτες μας και τους άλλους συμβούλους τους, τους καθοδηγούμε στη διαχείριση περιουσιών και τους εκπροσωπούμε όταν προκύπτουν διαφορές.\nΗ εργασία μας περιλαμβάνει:\n• Διαθήκες και σχεδιασμό διαδοχής\n• Δωρεές και μεταβιβάσεις ακινήτων εντός της οικογένειας\n• Διαχείριση περιουσιών, επικύρωση διαθηκών και επανασφράγιση αλλοδαπών γραμμάτων διαχείρισης\n• Διασυνοριακές περιουσίες και τον Ευρωπαϊκό Κανονισμό για τις Κληρονομίες\n• Κυπριακά καταπιστεύματα, εγχώρια και διεθνή\n• Θέματα ηλικιωμένων, συμπεριλαμβανομένου του σχεδιασμού για περίπτωση ανικανότητας και των αιτήσεων για διορισμό διαχειριστή της περιουσίας προσώπου που αδυνατεί να διαχειριστεί τις υποθέσεις του\n• Κληρονομικές διαφορές ενώπιον των κυπριακών δικαστηρίων" }
    }
  },
  {
    slug: "insurance-personal-injury",
    name: "Insurance & Personal Injury",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Advice and representation for individuals and insurers in personal injury and insurance matters.",
    body: "We advise and represent individuals and insurance companies in personal injury and insurance matters, with extensive experience in multi-party and multi-injury actions.\nWhere possible, we concentrate on negotiating and settling cases before court proceedings, so that our clients can avoid the expense and stress of litigation.\nWe deal with all types of personal injury claims, including:\n• Fatal accidents\n• Road traffic accidents\n• Medical negligence\n• Public and occupiers’ liability\n• Employer’s liability\n• Product liability",
    image: "areas/insurance-law-personal-injury-claims.jpg",
    i18n: {
      el: { name: "Ασφαλιστικό Δίκαιο & Σωματικές Βλάβες", summary: "Συμβουλές και εκπροσώπηση για ιδιώτες και ασφαλιστικές εταιρείες σε υποθέσεις σωματικών βλαβών και ασφαλιστικές υποθέσεις.", body: "Συμβουλεύουμε και εκπροσωπούμε ιδιώτες και ασφαλιστικές εταιρείες σε υποθέσεις σωματικών βλαβών και ασφαλιστικές υποθέσεις, με εκτεταμένη εμπειρία σε αγωγές με πολλούς διαδίκους και πολλαπλούς τραυματισμούς.\nΌπου είναι δυνατόν, επικεντρωνόμαστε στη διαπραγμάτευση και τον διακανονισμό των υποθέσεων πριν από τη δικαστική διαδικασία, ώστε οι πελάτες μας να αποφεύγουν το κόστος και το άγχος της αντιδικίας.\nΧειριζόμαστε κάθε είδους απαιτήσεις για σωματικές βλάβες, όπως:\n• Θανατηφόρα ατυχήματα\n• Τροχαία ατυχήματα\n• Ιατρική αμέλεια\n• Ευθύνη έναντι τρίτων και ευθύνη κατόχου ακινήτου\n• Ευθύνη εργοδότη\n• Ευθύνη προϊόντος" }
    }
  },
  {
    slug: "family-law",
    name: "Family Law",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Divorce, child custody, maintenance and property disputes between spouses.",
    body: "We handle family matters with sensitivity and discretion, including divorce, custody and access, maintenance and the division of property between spouses.",
    image: "areas/family-law.jpg",
    i18n: {
      el: { name: "Οικογενειακό Δίκαιο", summary: "Διαζύγια, επιμέλεια τέκνων, διατροφή και περιουσιακές διαφορές μεταξύ συζύγων.", body: "Χειριζόμαστε οικογενειακές υποθέσεις με ευαισθησία και διακριτικότητα, συμπεριλαμβανομένων διαζυγίων, επιμέλειας και επικοινωνίας με τα τέκνα, διατροφής και διανομής περιουσίας μεταξύ συζύγων." }
    }
  },
  {
    slug: "immigration-relocation",
    name: "Immigration & Relocation",
    // short text for the Expertise list; body is the detail page (lines starting with • become a list)
    summary: "Residency and work permits, with every service needed to relocate employees and their families to Cyprus.",
    body: "We guide businesses, their employees and their families through every step of relocating to Cyprus, so that new arrivals can start work and settle in without delay.\nOur services include:\n• Residency permits for employees and their families\n• Work permits for non-EU nationals\n• Registration of EU citizens and their family members\n• Family reunification applications\n• Renewals and changes of status",
    image: "areas/immigration-and-migration-law-european-citizenship-residency.jpg",
    i18n: {
      el: { name: "Μετανάστευση & Μετεγκατάσταση", summary: "Άδειες διαμονής και εργασίας, με κάθε υπηρεσία που απαιτείται για τη μετεγκατάσταση εργαζομένων και των οικογενειών τους στην Κύπρο.", body: "Καθοδηγούμε επιχειρήσεις, τους εργαζομένους τους και τις οικογένειές τους σε κάθε βήμα της μετεγκατάστασης στην Κύπρο, ώστε οι νεοαφιχθέντες να ξεκινήσουν την εργασία τους και να εγκατασταθούν χωρίς καθυστέρηση.\nΟι υπηρεσίες μας περιλαμβάνουν:\n• Άδειες διαμονής για εργαζομένους και τις οικογένειές τους\n• Άδειες εργασίας για υπηκόους τρίτων χωρών\n• Εγγραφή πολιτών της ΕΕ και των μελών των οικογενειών τους\n• Αιτήσεις οικογενειακής επανένωσης\n• Ανανεώσεις και αλλαγές καθεστώτος" }
    }
  }
];


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
