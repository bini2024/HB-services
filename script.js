// --- FIREBASE SETUP ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Your Config
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123...",
    appId: "1:123..."
};

// Initialize Firebase safely
let db, storage;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
} catch (e) {
    console.log("Firebase keys missing - UI Mode only");
}

// --- STATE MANAGEMENT ---
let currentLang = 'en';
let currentService = '';

// --- DATA CONFIGURATION ---
const services = [
    { id: 'travel_doc', icon: '🌍', labels: { en: 'Refugee Travel Doc', am: 'የስደተኛ የመጓጓዣ ሰነድ', ti: 'ናይ ትራቨል ዶኩመንት' } },
    { id: 'passport', icon: '🛂', labels: { en: 'Passport', am: 'ፓስፖርት', ti: 'ፓስፖርት' } },
    { id: 'citizenship', icon: '🇨🇦', labels: { en: 'Citizenship', am: 'ዜግነት', ti: 'ዜግነት' } },
    { id: 'health_card', icon: '🏥', labels: { en: 'Health Card', am: 'የጤና ካርድ', ti: 'ናይ ጥዕና ካርድ' } },
    { id: 'single_status', icon: '💍', labels: { en: 'Single Status', am: 'ያላገባ ማስረጃ', ti: 'ናይ ሲንግል ወረቀት' } },
    { id: 'marriage_cert', icon: '💑', labels: { en: 'Marriage Cert', am: 'የጋብቻ የምስክር ወረቀት', ti: 'ናይ መርዓ ወረቐት' } },
    { id: 'death_cert', icon: '⚰️', labels: { en: 'Death Cert', am: 'የሞት የምስክር ወረቀት', ti: 'ናይ ሞት ምስክር ወረቐት' } },
    { id: 'sin_card', icon: '🔢', labels: { en: 'SIN Number', am: 'የSIN ቁጥር', ti: 'ናይ SIN ቁጽሪ' } },
    { id: 'ei_benefit', icon: '💼', labels: { en: 'Employment Insurance', am: 'የስራ አጥነት', ti: 'ናይ ስራሕ ኢንሹራንስ(EI)' } },
    { id: 'oas', icon: '👵', labels: { en: 'Old Age Security', am: 'የጡረታ', ti: 'ናይ እርጋን ጡረታ' } },
    { id: 'lost_passport', icon: '❌', labels: { en: 'Lost/Stolen Passport', am: 'የጠፋ ፓስፖርት', ti: 'ዝጠፍአ ፓስፖርት' } }
];

const commonFields = [
    { name: 'full_name', type: 'text', label: { en: 'Full Legal Name', am: 'ሙሉ ስም (እንደ መታወቂያ)', ti: 'ሙሉእ ስም (ከም መታወቒ)' } },
    { name: 'phone', type: 'tel', label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } },
    { name: 'address', type: 'text', label: { en: 'Current Address', am: 'አድራሻ', ti: 'አድራሻ' } },
    { name: 'dob', type: 'date', label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዝተወለድካሉ/ክሉ ዕለት' } }
];

// Specific Inputs per Service (AUDITED & CORRECTED)
const specificFields = {
   'travel_doc': [

    // ===============================
    // SECTION 1: PERSONAL INFORMATION
    // ===============================
    { name: 'uci_number', type: 'text', required: true, label: { en: 'UCI / Client ID', am: 'UCI ቁጥር', ti: 'ቁጽሪ UCI' } },

    { name: 'surname', type: 'text', required: true, label: { en: 'Last Name', am: 'የቤተሰብ ስም', ti: 'ስም ኣባሓጎ' } },

    { name: 'given_names', type: 'text', required: true, label: { en: 'Given Name(s)', am: 'ስም', ti: 'ሽም' } },

    { name: 'parent_birth_surname', type: 'text', label: { en: 'Parent’s Surname at Birth', am: 'የእናት የኣጎት ስም', ti: 'ናይ ኣደ ስም ኣባሓጎ(lastname)' } },

    { name: 'dob', type: 'date', required: true, label: { en: 'Date of Birth (YYYY-MM-DD)', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } },

    { name: 'birth_city', type: 'text', required: true, label: { en: 'City of Birth', am: 'የትውልድ ከተማ', ti: 'ዝተወለድካሉ/ክሉ ከተማ' } },

    { name: 'birth_country', type: 'text', required: true, label: { en: 'Country of Birth', am: 'የትውልድ አገር', ti: 'ዝተወለድካሉ/ክሉ ሃገር' } },
       { 
    name: 'maritalStatus', 
    type: 'select', 
    options: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'], 
    label: { 
        en: 'Marital Status', 
        am: 'የጋብቻ ሁኔታ', 
        ti: 'የጋብቻ ሁኔታ' 
    } 
},


    { name: 'sex', type: 'select', required: true, options: ['F', 'M', 'X'], label: { en: 'Sex / Gender', am: 'ፆታ', ti: 'ጾታ' } },

    { name: 'eye_color', type: 'text', required: true, label: { en: 'Eye Colour', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } },

    { name: 'height', type: 'text', required: true, label: { en: 'Height (cm or inches)', am: 'ቁመት', ti: 'ቁመት' } },

    // ===============================
    // SECTION 2: CONTACT INFORMATION
    // ===============================
    { name: 'home_address', type: 'textarea', required: true, label: { en: 'Current Home Address', am: 'የአሁን መኖሪያ አድራሻ', ti: 'ትቅመጠሉ ኣድራሻ' } },

    { name: 'mailing_address', type: 'textarea', label: { en: 'Mailing Address (if different)', am: 'የፖስታ አድራሻ', ti: 'ኣድራሻ ፖስታ' } },

    { name: 'email', type: 'email', required: true, label: { en: 'Email Address', am: 'ኢሜይል', ti: 'ኢሜይል' } },

    { name: 'phone_primary', type: 'tel', required: true, label: { en: 'Primary Phone Number', am: 'ዋና ስልክ', ti: 'ቁጽሪ ቴሌ.' } },

    // ===============================
    // SECTION 3: IMMIGRATION STATUS
    // ===============================
    { name: 'immigration_doc_type', type: 'select', required: true, options: ['Permanent Resident Card', 'Temporary Resident Permit', 'Verification of Status', 'IRB Decision', 'Other'], label: { en: 'Immigration Status Document Type', am: 'የኢሚግሬሽን ሰነድ አይነት', ti: 'ዓይነት ሰነድ ኢሚግሬሽን ሒዝካዮ ዘለካ/ኪ' } },

    { name: 'immigration_doc_number', type: 'text', required: true, label: { en: 'Immigration Document Number', am: 'የሰነድ ቁጥር', ti: 'ቁጽሪ ሰነድ' } },

    { name: 'immigration_issue_date', type: 'date', required: true, label: { en: 'Date of Issue', am: 'የተሰጠበት ቀን', ti: 'ዝተዋህበሉ ዕለት(Date of Issue)' } },

    { name: 'immigration_expiry_date', type: 'date', label: { en: 'Expiry Date (if applicable)', am: 'የሚያበቃበት ቀን', ti: 'ዘብቀዓሉ ዕለት(Expiry Date)' } },

    // ===============================
    // SECTION 4: TRAVEL & CITIZENSHIP
    // ===============================
    { name: 'original_citizenship', type: 'text', required: true, label: { en: 'Original Citizenship', am: 'የመጀመሪያ ዜግነት', ti: 'መበቆል ሃገር' } },

    { name: 'other_citizenship', type: 'text', label: { en: 'Other Citizenship(s), if any', am: 'ሌላ ዜግነት', ti: 'ካልእ ዜግነት እንተለካ/ኪ' } },

    { name: 'foreign_passport', type: 'select', required: true, options: ['Yes', 'No'], label: { en: 'Do you have a passport or travel document from another country?', am: 'ሌላ ፓስፖርት አለ?', ti: 'ካልእ ፓስፖርት ወይ ትራቨል ዶክመንት እንተለካ/ኪ?' } },

    { name: 'foreign_passport_explanation', type: 'textarea', label: { en: 'If yes or no longer in your possession, explain', am: 'ካለ ወይም ካጠፋ አስረዱ', ti: 'እንተ ነይርካ ናይ ምንታይ ሃገር ነይሩ ኣበይ ኣሎ ግለጽ። ' } },

    { name: 'travel_history', type: 'textarea', label: { en: 'Travel History since entering Canada (dates, country, reason)', am: 'የጉዞ ታሪክ', ti: 'ካናዳ ካብ ትኣቱ ዝገሽካዮም መገሻታት እንተለዉ ግለጽ (ዕለት ካብ.. ናብ፣ ሃገር ዝገሽካዮ፣ ምክንያት)' } },

    // ===============================
    // SECTION 5: ADDRESS & WORK HISTORY
    // ===============================
    { name: 'address_history', type: 'textarea', required: true, label: { en: 'Address History – Last 2 Years (No gaps)', am: 'የአድራሻ ታሪክ (2 ዓመት)', ti: 'ናይ 2 ዓመት ዝተቀመጥካሉ ኣድራሻ ብዝርዝር ጥቀስ ' } },

    { name: 'occupation_history', type: 'textarea', required: true, label: { en: 'Employment / School History – Last 2 Years', am: 'የሥራ/ትምህርት ታሪክ', ti: 'ናይ ስራሕ ወይ ትምህርቲ ዝከድካዮ ኣብዚ 2 ዓመት ብዝርዝር ጥቀስ(ኣድራሻ፣ ዝሰራሕካሉ ትካል ወይ ትምህርቲ) ' } },

    // ===============================
    // SECTION 6: GUARANTOR
    // ===============================
    { name: 'guarantor_full_name', type: 'text', required: true, label: { en: 'Guarantor Full Name', am: 'የዋስ ሙሉ ስም', ti: 'ሙሉእ ስም ዋሕስ' } },

    { name: 'guarantor_occupation', type: 'text', required: true, label: { en: 'Guarantor Occupation', am: 'የዋስ ስራ', ti: 'ሞያ ዋሕስን ዝሰርሓሉ ኣድራሻን' } },

    { name: 'guarantor_contact', type: 'tel', required: true, label: { en: 'Guarantor Phone Number', am: 'የዋስ ስልክ', ti: 'ቁጽሪ ቴሌ. ዋሕስ' } },

    { name: 'guarantor_known_months', type: 'number', required: true, label: { en: 'How many months has the guarantor known you?', am: 'ዋሱ ስንት ወር ያውቅዎታል?', ti: 'ንክንደይ ግዜ ትፋለጡ?' } },

    // ===============================
    // SECTION 7: REFERENCES (2)
    // ===============================
    { name: 'reference_1', type: 'textarea', required: true, label: { en: 'Reference 1 (Name, Phone, Address, Relationship)', am: 'መወከሲ 1', ti: 'ምስክር 1 (ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } },

    { name: 'reference_2', type: 'textarea', required: true, label: { en: 'Reference 2 (Name, Phone, Address, Relationship)', am: 'መወከሲ 2', ti: 'ምስክር 2 (ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } },

    // ===============================
    // SECTION 8: EMERGENCY CONTACT
    // ===============================
    { name: 'emergency_contact', type: 'textarea', label: { en: 'Emergency Contact (Optional)', am: 'የአደጋ ጊዜ ግንኙነት', ti: 'ናይ ህጹጽ እዋን ተጸዋዒ(ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } }

]
,
   'passport': [
        // ===============================
        // SECTION 1: PASSPORT TYPE
        // ===============================
        { name: 'passport_validity', type: 'select', required: true, options: ['5 Years', '10 Years'], label: { en: 'Passport Validity Period', am: 'የፓስፖርት አገልግሎት ዘመን', ti: 'ናይ ክንደይ ግዜ ፓስፖርት ትደሊ' } },

        // ===============================
        // SECTION 2: PERSONAL INFORMATION
        // ===============================
        { name: 'surname', type: 'text', required: true, label: { en: 'Last Name', am: 'የቤተሰብ ስም', ti: 'ሽም ኣባሓጎ' } },
        { name: 'given_names', type: 'text', required: true, label: { en: 'Given Name(s)', am: 'የክርስትና ስም', ti: 'ስም' } },
        { name: 'parent_surname_birth', type: 'text', required: true, label: { en: 'Mother\'s Maiden Name (Surname at Birth)', am: 'የእናት ስም (ከጋብቻ በፊት)', ti: 'ናይ ኣደ ስም ኣባሓጎ(lastname)' } },
        { name: 'dob', type: 'date', required: true, label: { en: 'Date of Birth (YYYY-MM-DD)', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } },
        { name: 'birth_city', type: 'text', required: true, label: { en: 'City of Birth', am: 'የትውልድ ከተማ', ti: 'ዝተወለድካሉ/ክሉ ከተማ' } },
        { name: 'birth_country', type: 'text', required: true, label: { en: 'Country of Birth', am: 'የትውልድ አገር', ti: 'ዝተወለድካሉ/ክሉ ሃገር' } },
        { name: 'sex', type: 'select', required: true, options: ['F', 'M', 'X'], label: { en: 'Sex / Gender', am: 'ፆታ', ti: 'ጾታ' } },
       { 
    name: 'maritalStatus', 
    type: 'select', 
    options: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'], 
    label: { 
        en: 'Marital Status', 
        am: 'የጋብቻ ሁኔታ', 
        ti: 'የጋብቻ ሁኔታ' 
    } 
},

        { name: 'eye_color', type: 'text', required: true, label: { en: 'Eye Colour', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } },
        { name: 'height', type: 'text', required: true, label: { en: 'Height (cm or inches)', am: 'ቁመት', ti: 'ቁመት' } },

        // ===============================
        // SECTION 3: PROOF OF CITIZENSHIP (CRITICAL)
        // ===============================
        { name: 'citizenship_doc_type', type: 'select', required: true, options: ['Birth Certificate (Canada)', 'Citizenship Certificate'], label: { en: 'Citizenship Document Type', am: 'የዜግነት ማረጋገጫ አይነት', ti: 'ዓይነት ሰነድ ዜግነት' } },
        { name: 'citizenship_doc_number', type: 'text', required: true, label: { en: 'Certificate / Registration Number', am: 'የሰርተፍኬት ቁጥር', ti: 'ቁጽሪ ሰርተፍኬት' } },
        { name: 'citizenship_issue_date', type: 'date', required: true, label: { en: 'Date of Issue', am: 'የተሰጠበት ቀን', ti: 'ዝተዋህበሉ ዕለት' } },

        // ===============================
        // SECTION 4: SUPPORTING ID (CRITICAL)
        // ===============================
        { name: 'id_type', type: 'text', required: true, label: { en: 'ID Document Type (e.g. Driver\'s License)', am: 'የመታወቂያ አይነት (መንጃ ፈቃድ)', ti: 'ዓይነት መንነት እተቅርቦ ' } },
        { name: 'id_number', type: 'text', required: true, label: { en: 'ID Document Number', am: 'የመታወቂያ ቁጥር', ti: 'ቁጽሪ ID ' } },
        { name: 'id_expiry_date', type: 'date', required: true, label: { en: 'ID Expiry Date', am: 'መታወቂያው የሚያበቃበት ቀን', ti: 'ID ዘብቅዓሉ ዕለት' } },

        // ===============================
        // SECTION 5: CONTACT & ADDRESSES
        // ===============================
        { name: 'home_address', type: 'textarea', required: true, label: { en: 'Current Home Address', am: 'የአሁን መኖሪያ አድራሻ', ti: 'ሕጂ ዘለካ ኣድራሻ' } },
        { name: 'mailing_address', type: 'textarea', label: { en: 'Mailing Address (if different)', am: 'የፖስታ አድራሻ', ti: 'ኣድራሻ ፖስታ' } },
        { name: 'phone_primary', type: 'tel', required: true, label: { en: 'Primary Phone Number', am: 'ዋና ስልክ', ti: 'ቁጽሪ ቴሌ.' } },
        { name: 'email', type: 'email', required: true, label: { en: 'Email Address', am: 'ኢሜይል', ti: 'ኢሜይል' } },
        { name: 'address_history', type: 'textarea', required: true, label: { en: 'Address History – Last 2 Years (No gaps)', am: 'የአድራሻ ታሪክ (2 ዓመት)', ti: 'ናይ 2 ዓመት ዝተቀመጥካሉ ኣድራሻ ብዝርዝር ጥቀስ' } },
        { name: 'occupation_history', type: 'textarea', required: true, label: { en: 'Employment / School History – Last 2 Years', am: 'የሥራ/ትምህርት ታሪክ', ti: 'ናይ ስራሕ ወይ ትምህርቲ ዝከድካዮ ኣብዚ 2 ዓመት ብዝርዝር ጥቀስ(ኣድራሻ፣ ዝሰራሕካሉ ትካል ወይ ትምህርቲ) ' } },

        // ===============================
        // SECTION 6: GUARANTOR (Enhanced)
        // ===============================
        { name: 'guarantor_full_name', type: 'text', required: true, label: { en: 'Guarantor Full Name', am: 'የዋስ ሙሉ ስም', ti: 'ሙሉእ ስም ዋሕስ' } },
        { name: 'guarantor_ppt_number', type: 'text', required: true, label: { en: 'Guarantor Passport Number', am: 'የዋስ ፓስፖርት ቁጥር', ti: 'ቁጽሪ ፓስፖርት ዋሕስ' } },
        { name: 'guarantor_issue_date', type: 'date', required: true, label: { en: 'Guarantor Passport Issue Date', am: 'ፓስፖርቱ የተሰጠበት ቀን', ti: 'ፓስፖርት ዝተወሃበሉ ዕለት' } },
        { name: 'guarantor_expiry_date', type: 'date', required: true, label: { en: 'Guarantor Passport Expiry Date', am: 'ፓስፖርቱ የሚያበቃበት ቀን', ti: 'ፓስፖርት ዘብቅዓሉ ዕለት' } },
        { name: 'guarantor_phone', type: 'tel', required: true, label: { en: 'Guarantor Phone Number', am: 'የዋስ ስልክ', ti: 'ቁጽሪ ቴሌ. ዋሕስ' } },
        { name: 'guarantor_known_years', type: 'number', required: true, label: { en: 'Years Known Guarantor', am: 'ዋሱ ስንት ዓመት ያውቅዎታል?', ti: 'ንክንደይ ግዜ ትፋለጡ ምስ ዋሕስ?' } },

        // ===============================
        // SECTION 7: REFERENCES
        // ===============================
        { name: 'reference_1', type: 'textarea', required: true, label: { en: 'Reference 1 (Name, Phone, Address, Relationship, Years Known)', am: 'መወከሲ 1', ti: 'ምስክር 1 (ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } },
        { name: 'reference_2', type: 'textarea', required: true, label: { en: 'Reference 2 (Name, Phone, Address, Relationship, Years Known)', am: 'መወከሲ 2', ti: 'ምስክር 2 (ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } },

        // ===============================
        // SECTION 8: EMERGENCY CONTACT (Optional)
        // ===============================
        { name: 'emergency_contact', type: 'textarea', label: { en: 'Emergency Contact (Name, Phone, Address)', am: 'የአደጋ ጊዜ ተጠሪ', ti: 'ናይ ህጹጽ እዋን ተጸዋዒ(ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } }
    ],

    'citizenship': [
    // ===============================
    // SECTION 1: IDENTITY & STATUS
    // ===============================
    { 
        name: 'service_language', 
        type: 'select', 
        required: true, 
        options: ['English', 'French'], 
        label: { en: 'Language you prefer for service', am: 'ለአገልግሎት የሚመርጡት ቋንቋ', ti: 'ንአገልግሎት እትመርጽዎ ቋንቋ' } 
    },
    { 
        name: 'uci_number', 
        type: 'text', 
        required: true, 
        label: { en: 'Unique Client Identifier (UCI) as shown on PR Card', am: 'በ PR ካርድዎ ላይ የሚገኝ መለያ ቁጥር (UCI)', ti: 'UCI number' } 
    },
    { 
        name: 'full_name_pr', 
        type: 'text', 
        required: true, 
        label: { en: 'Full Name (Exactly as it appears on your PR Card)', am: 'ሙሉ ስም (ልክ በ PR ካርድዎ ላይ እንዳለው)', ti: 'ሙሉእ ስም (ልክዕ ከምቲ ኣብ PR ካርድ ዘሎ)' } 
    },
    { 
        name: 'name_change', 
        type: 'select', 
        options: ['No', 'Yes'], 
        label: { en: 'Have you legally changed your name since becoming a PR?', am: 'PR ካገኙ በኋላ በህግ ስምዎን ቀይረዋል?', ti: 'PR ካብ እትረክብ ስምካ ብሕጊ ቀይርካ ዶ?' } 
    },
    { 
        name: 'gender', 
        type: 'select', 
        options: ['Male', 'Female', 'X', 'Another Gender'], 
        label: { en: 'Gender', am: 'ጾታ', ti: 'ጾታ' } 
    },
        { 
    name: 'maritalStatus', 
    type: 'select', 
    options: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'], 
    label: { 
        en: 'Marital Status', 
        am: 'የጋብቻ ሁኔታ', 
        ti: 'የጋብቻ ሁኔታ' 
    } 
},

    { 
        name: 'height', 
        type: 'text', 
        required: true, 
        label: { en: 'Height (cm or ft/in)', am: 'ቁመት (cm)', ti: 'ቁመት (cm) ' } 
    },
    { 
        name: 'eye_colour', 
        type: 'select', 
        options: ['Brown', 'Blue', 'Green', 'Hazel', 'Black', 'Other'], 
        label: { en: 'Eye Colour', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } 
    },
    { 
        name: 'date_of_birth', 
        type: 'date', 
        required: true, 
        label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለት ልደት' } 
    },
    { 
        name: 'place_of_birth_city', 
        type: 'text', 
        required: true, 
        label: { en: 'City/Town of Birth', am: 'የተወለዱበት ከተማ', ti: 'ዝተወለድኩምሉ ከተማ' } 
    },
    { 
        name: 'place_of_birth_country', 
        type: 'text', 
        required: true, 
        label: { en: 'Country of Birth', am: 'የተወለዱበት ሀገር', ti: 'ዝተወለድኩምሉ ሃገር' } 
    },

    // ===============================
    // SECTION 2: CONTACT INFORMATION
    // ===============================
    { 
        name: 'home_address', 
        type: 'textarea', 
        required: true, 
        label: { en: 'Current Home Address', am: 'የአሁን የመኖሪያ አድራሻ', ti: 'ናይ ሕጂ ዘለኩምዎ አድራሻ' } 
    },
    { 
        name: 'phone_number', 
        type: 'text', 
        required: true, 
        label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ቴሌ' } 
    },
    { 
        name: 'email_address', 
        type: 'text', 
        required: true, 
        label: { en: 'Email Address', am: 'ኢሜይል አድራሻ', ti: 'ኢሜይል አድራሻ' } 
    },

    // ===============================
    // SECTION 4: ADDRESS HISTORY (LAST 5 YEARS)
    // ===============================
    // CRITICAL LOGIC: NO GAPS ALLOWED
    { 
      name: 'address_history', 
      type: 'repeater', 
      label: { en: 'List ALL addresses inside and outside Canada for the last 5 years (No Gaps)', am: 'ባለፉት 5 ዓመታት ውስጥ የነበሩበትን አድራሻዎች በሙሉ ይዘርዝሩ (ክፍተት መኖር የለበትም)', ti: 'ኣብ ዝሓለፈ 5 ዓመታት ዝነበርኩምሎም ኣድራሻታት ብሙሉኡ ዘርዝሩ (ክፍተት ክህልዎ የብሉን)' },
      fields: [
         { name: 'address', type: 'text', label: { en: 'Street Address & City', am: 'መንገድ እና ከተማ', ti: ' ኣድራሻ' } },
         { name: 'country', type: 'text', label: { en: 'Country', am: 'ሀገር', ti: 'ሃገር' } },
         { name: 'from_date', type: 'date', label: { en: 'From Date', am: 'ከቀን', ti: 'ካብ ዕለት' } },
         { name: 'to_date', type: 'date', label: { en: 'To Date', am: 'እስከ ቀን', ti: 'ክሳብ ዕለት' } }
      ]
    },

    // ===============================
    // SECTION 5: WORK & EDUCATION HISTORY (LAST 5 YEARS)
    // ===============================
    // CRITICAL LOGIC: If unemployed, must list "Unemployed"
    { 
      name: 'activity_history', 
      type: 'repeater', 
      label: { en: 'Work and Education history for the last 5 years (If you were not working, write "Unemployed")', am: 'የስራ እና ትምህርት ታሪክ - ባለፉት 5 ዓመታት (ስራ ላይ ካልነበሩ "ስራ አጥ" ብለው ይጻፉ)', ti: 'ናይ ስራሕን ትምህርትን ታሪክ - ኣብ ዝሓለፈ 5 ዓመታት (ስራሕ እንተዘይነይርኩም "ኣይሰራሕኩን " ኢልኩም ጸሓፉ)' },
      fields: [
         { name: 'activity_type', type: 'select', options: ['Work', 'Education', 'Unemployed', 'Homemaker', 'Retired', 'Volunteer'], label: { en: 'Activity Type', am: 'የስራው ዓይነት', ti: 'ዓይነት ስራሕ' } },
         { name: 'employer_school_name', type: 'text', label: { en: 'Name of Employer or School', am: 'የአሰሪ ወይም የትምህርት ቤቱ ስም', ti: 'ስም አስራሒ ወይ ትምህርቲ ቤት' } },
         { name: 'city_country', type: 'text', label: { en: 'City and Country', am: 'ከተማ እና ሀገር', ti: 'ከተማን ሃገርን' } },
         { name: 'from_date', type: 'date', label: { en: 'From Date', am: 'ከቀን', ti: 'ካብ ዕለት' } },
         { name: 'to_date', type: 'date', label: { en: 'To Date', am: 'እስከ ቀን', ti: 'ክሳብ ዕለት' } }
      ]
    },

    // ===============================
    // SECTION 6: INCOME TAX (REQUIRED)
    // ===============================
    { 
        name: 'sin_number', 
        type: 'text', 
        required: true, 
        label: { en: 'Social Insurance Number (SIN)', am: 'የማህበራዊ ዋስትና ቁጥር (SIN)', ti: 'ቁጽሪ (SIN)' } 
    },
    { 
        name: 'tax_filing_history', 
        type: 'checkbox_group', 
        options: ['2024', '2023', '2022', '2021', '2020'], 
        label: { en: 'Check the years you filed income taxes (Must be at least 3 years)', am: 'ግብር የከፈሉባቸውን ዓመታት ይምረጡ (ቢያንስ 3 ዓመታት መሆን አለበት)', ti: 'ግብሪ ዝከፈልኩምለን ዓመታት ምረጹ (ብውሑዱ 3 ዓመታት ክኸውን ኣለዎ)' } 
    },

    // ===============================
    // SECTION 7: LANGUAGE PROOF (AGE 18-54)
    // ===============================
    { 
        name: 'language_proof_type', 
        type: 'select', 
        options: [
            'Test Results (CELPIP, IELTS, TEF)', 
            'Certificate from LINC/CLIC program', 
            'Diploma/Transcript from Secondary or Post-Secondary', 
            'None / Age Exempt'
        ], 
        label: { en: 'Language Proof Evidence', am: 'የቋንቋ ችሎታ ማረጋገጫ', ti: 'ናይ ቋንቋ ክእለት መረጋገጺ' } 
    },

    // ===============================
    // SECTION 8: PROHIBITIONS (CRIMINAL HISTORY) - HIGH RISK
    // ===============================
    // NOTE: "Indictable offence" is translated as "Serious Crime" for clarity in translation.

    // 8A: INSIDE CANADA
    { 
        name: 'crime_inside_canada', 
        type: 'select', 
        required: true, 
        options: ['Yes', 'No'], 
        label: { en: 'Are you currently charged with or on trial for an offence in Canada?', am: 'በአሁኑ ጊዜ በካናዳ ውስጥ በወንጀል ተከሰው ያውቃሉ?', ti: 'ኣብ ካናዳ ብገበን ተከሰስካ/ኪ ትፈልጥ/ጢ ዶ?' } 
    },
    { 
        name: 'convicted_inside_canada', 
        type: 'select', 
        required: true, 
        options: ['Yes', 'No'], 
        label: { en: 'In the past 4 years, have you been convicted of a crime in Canada?', am: 'ባለፉት 4 ዓመታት በካናዳ ውስጥ በወንጀል ጥፋተኛ ተብለዋል?', ti: 'ኣብ ዝሓለፈ 4 ዓመታት ኣብ ካናዳ ብገበን ተፈሪድካ ዶ?' } 
    },

    // 8B: OUTSIDE CANADA
    { 
        name: 'crime_outside_canada', 
        type: 'select', 
        required: true, 
        options: ['Yes', 'No'], 
        label: { en: 'Are you currently charged with or on trial for an offence OUTSIDE Canada?', am: 'በአሁኑ ጊዜ ከካናዳ ውጭ በወንጀል ተከሰው ያውቃሉ?', ti: 'ካብ ካናዳ ወጻኢ ብገበን ተከሰስካ/ኪ ትፈልጥ/ጢ ዶ?' } 
    },

    // 8D: IMMIGRATION STATUS
    { 
        name: 'under_removal_order', 
        type: 'select', 
        required: true, 
        options: ['Yes', 'No'], 
        label: { en: 'Are you under a removal order (asked to leave Canada)?', am: 'ከካናዳ እንዲወጡ ትዕዛዝ ተሰጥቶዎታል?', ti: 'ካብ ካናዳ ክትወጹ ትእዛዝ ተዋሂብኩም ዶ?' } 
    },
    { 
        name: 'misrepresentation', 
        type: 'select', 
        required: true, 
        options: ['Yes', 'No'], 
        label: { en: 'Have you been refused citizenship in the past 5 years due to misrepresentation?', am: 'ባለፉት 5 ዓመታት የዜግነት ጥያቄዎ በውሸት መረጃ ምክንያት ተከልክሏል?', ti: 'ኣብ ዝሓለፈ 5 ዓመታት ናይ ዜግነት ሕቶኩም ብጌጋ ሓበሬታ ምኽንያት ተነጺጉ ዶ?' } 
    },

    // ===============================
    // SECTION 9: OTHER CITIZENSHIPS & POLICE CERTIFICATES
    // ===============================
    { 
        name: 'other_citizenships', 
        type: 'select', 
        options: ['Yes', 'No'], 
        label: { en: 'Are you a citizen of any other country?', am: 'የሌላ ሀገር ዜግነት አለዎት?', ti: 'ናይ ካልእ ሃገር ዜግነት አለኩም ዶ?' } 
    },
    
    // THE 183-DAY RULE (Automatic Trigger for Police Certificate)
    { 
        name: 'lived_outside_183_days', 
        type: 'select', 
        required: true, 
        options: ['Yes', 'No'], 
        label: { en: 'In the past 4 years, did you live in another country for 183 days or more?', am: 'ባለፉት 4 ዓመታት ውስጥ በሌላ ሀገር ለ183 ቀናት ወይም ከዚያ በላይ ኖረዋል?', ti: 'ኣብ ዝሓለፈ 4 ዓመታት ኣብ ካልእ ሃገር ን183 መዓልታት ወይ ልዕሊኡ ተቀሚጥኩም ዶ?' } 
    },
    // Logic: If Yes -> "Please upload Police Certificate for that country"

    // ===============================
    // SECTION 10: DECLARATION
    // ===============================
    { 
        name: 'elections_canada_consent', 
        type: 'select', 
        options: ['Yes', 'No'], 
        label: { en: 'Do you authorize IRCC to give your name to Elections Canada?', am: 'ስምዎ ለምርጫ ቦርድ እንዲሰጥ ይፈቅዳሉ?', ti: 'ስምኩም ንቦርድ ምርጫ ክወሃብ ትፈቅዱ ዶ?' } 
    },
    { 
        name: 'declaration_truth', 
        type: 'checkbox', 
        required: true, 
        label: { en: 'I declare that the information provided is true, complete, and correct.', am: 'የሰጠሁት መረጃ እውነት፣ የተሟላ እና ትክክለኛ መሆኑን አረጋግጣለሁ።', ti: 'ዝሃብክዎ ሓበሬታ ሓቂ፣ ዝተማልአን ትክክልን ምዃኑ የረጋግጽ።' } 
    }
],

    'health_card': [ // Based on OHIP 0265-82
        { name: 'status_doc', type: 'select', options: ['PR Card', 'Work Permit', 'Confirmation of PR'], label: { en: 'Immigration Document', am: 'የኢሚግሬሽን ሰነድ', ti: 'ናይ ኢሚግሬሽን ሰነድ' } },
        { name: 'residency_doc', type: 'select', options: ['Drivers License', 'Bank Statement', 'Lease Agreement', 'Pay Stub'], label: { en: 'Proof of Address (Ontario)', am: 'የአድራሻ ማረጋገጫ', ti: 'ናይ ኣድራሻ መረጋገጺ' } },
        { name: 'arrival_date_canada', type: 'date', label: { en: 'Date Arrived in Canada', am: 'ካናዳ የገቡበት ቀን', ti: 'ናብ ካናዳ ዝኣተውሉ ዕለት' } },
        { name: 'arrival_date_ontario', type: 'date', label: { en: 'Date Arrived in Ontario', am: 'ኦንታሪዮ የገቡበት ቀን', ti: 'ናብ ኦንታሪዮ ዝኣተውሉ ዕለት' } }
    ],

    'single_status': [ // Statutory Declaration
        { name: 'full_name', type: 'text', label: { en: 'Full Name', am: 'ሙሉ ስም', ti: 'ሙሉእ ስም' } },
        { name: 'marital_status', type: 'select', options: ['Never Married', 'Divorced', 'Widowed'], label: { en: 'Current Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት መውስቦ' } },
        { name: 'fiance_name', type: 'text', label: { en: 'Name of Future Spouse', am: 'የሚጋቡት ሰው ስም', ti: 'ሽም መጻምድቲ' } },
        { name: 'marriage_country', type: 'text', label: { en: 'Country of Marriage', am: 'ጋብቻው የሚፈጸምበት አገር', ti: 'መርዓ ዝግበረሉ ሃገር' } },
        { name: 'father_name', type: 'text', label: { en: 'Father\'s Name', am: 'የአባት ስም', ti: 'ሽም ኣቦ' } },
        { name: 'mother_name', type: 'text', label: { en: 'Mother\'s Name', am: 'የእናት ስም', ti: 'ሽም ኣደ' } }
    ],

    'marriage_cert': [ // Service Ontario
        { name: 'groom_name', type: 'text', label: { en: 'Applicant 1 Name (Groom)', am: 'አመልካች 1 ስም (ሙሽራ)', ti: 'መመርዓዊ' } },
        { name: 'bride_name', type: 'text', label: { en: 'Applicant 2 Name (Bride)', am: 'አመልካች 2 ስም (ሙሽሪት)', ti: 'መመርዓዊት' } },
        { name: 'marriage_date', type: 'date', label: { en: 'Date of Marriage', am: 'የጋብቻ ቀን', ti: 'ዝተመርዓዉሉ ዕለት' } },
        { name: 'marriage_city', type: 'text', label: { en: 'City of Marriage', am: 'ጋብቻው የተፈጸመበት ከተማ', ti: 'መርዓ ዝተፈጸመሉ ከተማ' } }
    ],

    'death_cert': [
        { name: 'deceased_name', type: 'text', label: { en: 'Deceased Full Name', am: 'የሟች ሙሉ ስም', ti: 'ሙሉእ ሽም መዋቲ' } },
        { name: 'date_death', type: 'date', label: { en: 'Date of Death', am: 'የሞቱበት ቀን', ti: 'ዝሞትሉ ዕለት' } },
        { name: 'place_death', type: 'text', label: { en: 'Place of Death (City)', am: 'የሞቱበት ከተማ', ti: 'ዝሞትሉ ከተማ' } },
        { name: 'applicant_relationship', type: 'text', label: { en: 'Your Relationship to Deceased', am: 'ከሟች ጋር ያሎት ዝምድና', ti: 'ምስ መዋቲ ዘለኩም ዝምድና' } }
    ],

    'sin_card': [
        { name: 'full_name', type: 'text', label: { en: 'Full Name', am: 'ሙሉ ስም', ti: 'ሙሉእ ስም' } },
        { name: 'dob', type: 'date', label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } },
        { name: 'father_name', type: 'text', label: { en: 'Father\'s Name', am: 'የአባት ስም', ti: 'ሽም ኣቦ' } },
        { name: 'mother_name', type: 'text', label: { en: 'Mother\'s Maiden Name', am: 'የእናት ስም (ከጋብቻ በፊት)', ti: 'ሽም ኣደ (ቅድሚ መውስቦ)' } },
        { name: 'status_doc_type', type: 'select', options: ['PR Card', 'Work Permit', 'Refugee Doc'], label: { en: 'Primary Document Type', am: 'የመታወቂያ አይነት', ti: 'ዓይነት መታወቒ' } }
    ],

    'ei_benefit': [
        // ===============================
        // SECTION 1: PERSONAL IDENTIFIERS & CONTACT
        // ===============================
        { name: 'sin_number', type: 'text', required: true, label: { en: 'Social Insurance Number (SIN)', am: 'SIN number', ti: 'SIN number' } },
        { name: 'date_of_birth', type: 'date', required: true, label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለት ልደት' } }, // CRITICAL ADDITION
        { name: 'mother_maiden_name', type: 'text', required: true, label: { en: 'Parent’s Last Name at Birth (Mother\'s Maiden Name)', am: 'የእናት የትውልድ ስም', ti: 'ናይ ኣደ ስም ኣባሓጎ' } },
        { name: 'gender', type: 'select', options: ['Male', 'Female', 'Another Gender'], label: { en: 'Gender', am: 'ጾታ', ti: 'ጾታ' } }, // ADDED

        // ADDRESS FIELDS (CRITICAL FOR MAILING ACCESS CODE)
        { name: 'applicant_address', type: 'textarea', required: true, label: { en: 'Your Home Address (Street, City, Province, Postal Code)', am: 'የእርስዎ አድራሻ (መንገድ፣ ከተማ፣ ክፍለ ሀገር፣ ፖስታ ኮድ)', ti: 'ናይ ገዛ አድራሻ (መንገዲ፣ ከተማ፣ ፖስታ ኮድ)' } },

        // ===============================
        // SECTION 2: EMPLOYMENT INFORMATION
        // ===============================
        { name: 'last_employer_name', type: 'text', required: true, label: { en: 'Last Employer Name', am: 'የመጨረሻው አሰሪ ስም', ti: 'መወዳእታ ዝሰራሕካሉ/ክሉ ስራሕ ስም' } },
        { name: 'job_title', type: 'text', required: true, label: { en: 'Job Title', am: 'የስራ መደብ', ti: ' እንታይ ነይሩ ስራሕካ' } }, // ADDED
        { name: 'last_employer_address', type: 'textarea', required: true, label: { en: 'Last Employer Address', am: 'የመጨረሻው አሰሪ አድራሻ', ti: 'ኣድራሻ መወዳእታ ስራሕካ/ኪ' } },
        
        { name: 'first_day_worked', type: 'date', required: true, label: { en: 'First Day Worked', am: 'የመጀመሪያ የስራ ቀን', ti: 'ናይ መጀመርያ መዓልቲ ዝጀመርካሉ ዕለት' } }, // CRITICAL ADDITION
        { name: 'last_day_worked', type: 'date', required: true, label: { en: 'Last Day Worked', am: 'የመጨረሻ የስራ ቀን', ti: 'ናይ መወዳእታ መዓልቲ ዝሰራሕካላ/ሉ ዕለት' } },
        
        { name: 'return_to_work', type: 'select', options: ['Yes', 'No', 'Unknown'], label: { en: 'Do you expect to return to this job?', am: 'ወደዚህ ስራ ይመለሳሉ?', ti: 'ናብዚ ስራሕ ክትምለስ ተስፋ ኣለካ?' } }, // ADDED

        { name: 'reason_for_separation', type: 'select', required: true, options: [
            'Shortage of Work / Layoff',
            'Illness or Injury',
            'Pregnancy / Maternity',
            'Quit',
            'Fired / Dismissed',
            'Other'
        ], label: { en: 'Reason for Stopping Work', am: 'ስራ ያቆሙበት ምክንያት', ti: 'ምኽንያት ምቑራጽ ስራሕ' } },

        { name: 'reason_other_explanation', type: 'textarea', label: { en: 'If Other, Quit, or Fired: please explain details', am: 'ሌላ፣ በራስ ፈቃድ ወይም ከስራ የተባረሩ ከሆነ ያብራሩ', ti: 'ካልእ፣ ብፍቃድካ ዝወጻእካ ወይ ዝተባረርካ እንተኾይኑ መግለጺ' } },

        { name: 'family_relationship', type: 'select', required: true, options: ['Yes', 'No'], label: { en: 'Are you related to the employer or do you own more than 40% of the voting shares?', am: 'ከአሰሪው ጋር ዝምድና አለዎት ወይም ከ40% በላይ ድርሻ አለዎት?', ti: 'ምስ አስራሒ ዝምድና አለካ ዶ ወይ ኣብቲ ትካል ዋንነት አለካ ዶ?' } }, // CRITICAL ADDITION

        // ===============================
        // SECTION 3: ROE & MONEY
        // ===============================
        { name: 'roe_status', type: 'select', required: true, options: [
            'Employer submitted it electronically',
            'I have a paper copy to submit',
            'I do not have it yet'
        ], label: { en: 'Record of Employment (ROE) Status', am: 'የስራ ታሪክ ማስረጃ (ROE) ሁኔታ', ti: 'ኩነታት ROE (ናይ ስራሕ መረጋገጺ)' } },

        { name: 'vacation_pay', type: 'number', label: { en: 'Vacation Pay or Severance received ($)', am: 'የተቀበሉት የዕረፍት ወይም የስራ ማቆሚያ ክፍያ ($)', ti: 'ዝተቀበልኩሞ ናይ vacation ወይ ካልእ ክፍሊት ($)' } },

        { name: 'receiving_pension', type: 'select', required: true, options: ['Yes', 'No'], label: { en: 'Are you receiving a pension (CPP, etc)?', am: 'ጡረታ ያገኛሉ?', ti: 'ጡረታ ትወስድ ዶ?' } }, // CRITICAL ADDITION

        // ===============================
        // SECTION 4: WORK HISTORY
        // ===============================
        // Updated label to ensure they include dates, which is required
        { name: 'other_employers', type: 'textarea', label: { en: 'List other employers in the last 52 weeks (Include Name, Start Date, and End Date)', am: 'ባለፉት 52 ሳምንታት የሠሩባቸው ሌሎች ቦታዎች (ስም፣ መጀመሪያ እና መጨረሻ ቀን)', ti: 'ኣብ ዝሓለፈ 52 ሰሙናት ዝሰርሕኩምሎም ካልኦት ቦታታት (ስም፣ መጀመርያ እና መወዳእታ ዕለት)' } },

        // ===============================
        // SECTION 5: AVAILABILITY
        // ===============================
        { name: 'available_for_work', type: 'select', required: true, options: ['Yes', 'No'], label: { en: 'Are you willing and able to work?', am: 'ለመስራት ዝግጁ ነዎት?', ti: 'ስራሕ ክትሰርሕ ድሉው ዲካ?' } },
        
        // ===============================
        // SECTION 6: TAXES
        // ===============================
        { name: 'tax_preference', type: 'select', required: true, options: ['Basic Personal Amount', 'Basic + Spousal Amount'], label: { en: 'Income Tax Claim Amount', am: 'የግብር አቆራረጥ ምርጫ', ti: 'ምርጫ ኣቆራርጻ ግብሪ' } },

        // ===============================
        // SECTION 7: BANKING (DIRECT DEPOSIT)
        // ===============================
        { name: 'bank_institution_number', type: 'text', required: true, label: { en: 'Bank Institution Number (3 digits)', am: 'የባንክ መለያ ቁጥር (3 አሃዝ)', ti: 'ቁጽሪ ባንኪ (3 ቁጽርታት)' } },
        { name: 'bank_transit_number', type: 'text', required: true, label: { en: 'Transit Number (5 digits)', am: 'ትራንዚት ቁጥር (5 አሃዝ)', ti: ' Transit number  (5 ቁጽርታት)' } },
        { name: 'bank_account_number', type: 'text', required: true, label: { en: 'Account Number', am: 'የሂሳብ ቁጥር', ti: 'bank account' } }
    ],
    'oas': [
        { name: 'sin_num', type: 'text', label: { en: 'SIN Number', am: 'SIN ቁጥር', ti: 'SIN ቁጽሪ' } },
        { name: 'date_entered_canada', type: 'date', label: { en: 'Date Entered Canada', am: 'ካናዳ የገቡበት ቀን', ti: 'ናብ ካናዳ ዝኣተውሉ ዕለት' } },
        { name: 'marital_status', type: 'select', options: ['Married', 'Single', 'Widowed', 'Divorced'], label: { en: 'Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት መውስቦ' } },
        { name: 'spouse_sin', type: 'text', label: { en: 'Spouse SIN (If applicable)', am: 'የባለቤት SIN (ካለ)', ti: 'ናይ መጻምድቲ SIN (እንተልዩ)' } }
    ],

    'lost_passport': [
        { name: 'lost_date', type: 'date', label: { en: 'Date Lost/Stolen', am: 'የጠፋበት ቀን', ti: 'ዝጠፍአሉ ዕለት' } },
        { name: 'police_report', type: 'select', options: ['Yes', 'No'], label: { en: 'Reported to Police?', am: 'ለፖሊስ ተነግሯል?', ti: 'ንፖሊስ ተሓቢሩዶ?' } },
        { name: 'location_lost', type: 'text', label: { en: 'Location Lost (City, Country)', am: 'የጠፋበት ቦታ', ti: 'ዝጠፍአሉ ቦታ' } },
        { name: 'explanation', type: 'textarea', label: { en: 'Detailed Explanation', am: 'ዝርዝር ማብራሪያ', ti: 'ዝርዝር መብርሂ' } }
    ]
};


// --- INITIALIZATION ---
function init() {
    createToastContainer();
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('service-grid');
    grid.innerHTML = '';
    services.forEach(s => {
        const div = document.createElement('div');
        div.className = 'card';
        div.onclick = () => loadForm(s.id, div);
        div.innerHTML = `
            <span class="card-icon">${s.icon}</span>
            <span class="card-title" data-sid="${s.id}">${s.labels[currentLang]}</span>
        `;
        grid.appendChild(div);
    });
}

// --- FORM HANDLING ---
function loadForm(serviceId, cardElem) {
    currentService = serviceId;
    
    // UI Updates
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    cardElem.classList.add('active');

    const formContainer = document.getElementById('form-container');
    const dynamicInputs = document.getElementById('dynamic-inputs');
    
    // smooth hide/show
    formContainer.style.opacity = '0';
    
    setTimeout(() => {
        formContainer.style.display = 'block';
        dynamicInputs.innerHTML = ''; 

        // 1. Common Fields
        renderFields(commonFields);

        // 2. Specific Fields
        if(specificFields[serviceId]) {
            const div = document.createElement('div');
            div.className = 'form-section-title';
            div.innerText = getLabel('details');
            dynamicInputs.appendChild(div);
            renderFields(specificFields[serviceId]);
        }

        // Fade in
        formContainer.style.opacity = '1';
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
}

function renderFields(fieldList) {
    const container = document.getElementById('dynamic-inputs');
    
    fieldList.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';

        const lbl = document.createElement('label');
        lbl.innerText = field.label[currentLang];
        // Store translations
        lbl.dataset.en = field.label.en;
        lbl.dataset.am = field.label.am;
        lbl.dataset.ti = field.label.ti;
        group.appendChild(lbl);

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
        } else if (field.type === 'select') {
            input = document.createElement('select');
            field.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt;
                o.innerText = opt;
                input.appendChild(o);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        
        input.name = field.name;
        // input.required = true; // We will handle validation manually for better UX
        
        // Remove error on focus
        input.addEventListener('focus', () => {
            input.classList.remove('error');
        });

        group.appendChild(input);
        container.appendChild(group);
    });
}

// --- SUBMISSION LOGIC ---
window.handleFormSubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    const form = document.getElementById('main-form');
    
    // 1. Validation
    if(!validateForm()) {
        showToast("Please fill in all required fields.", "error");
        return;
    }

    // 2. Set Loading State
    const originalText = btn.innerText;
    btn.innerHTML = `<span class="spinner"></span> Processing...`;
    btn.disabled = true;

    // 3. Collect Data
    let formData = {
        service: currentService,
        timestamp: new Date(),
        data: {}
    };
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if(input.type !== 'file') {
            formData.data[input.name] = input.value;
        }
    });

    // 4. Submit to Firebase
    try {
        if(db) {
            await addDoc(collection(db, "submissions"), formData);
            showToast("Application submitted successfully!");
            setTimeout(() => location.reload(), 2000);
        } else {
            console.log("TEST MODE DATA:", formData);
            // Simulate network delay
            await new Promise(r => setTimeout(r, 1500));
            showToast("Success (Test Mode)! Check Console.");
            
            // Reset form UI
            btn.innerHTML = originalText;
            btn.disabled = false;
            form.reset();
        }
    } catch(err) {
        showToast("Error: " + err.message, "error");
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

function validateForm() {
    let isValid = true;
    const inputs = document.querySelectorAll('#dynamic-inputs input, #dynamic-inputs select, #dynamic-inputs textarea');
    
    inputs.forEach(input => {
        if(!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        }
    });
    return isValid;
}

// --- UI HELPERS ---

// Create the container for notifications
function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toast-container';
    document.body.appendChild(div);
}

// Show a notification
function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icons
    const icon = type === 'success' ? '✅' : '⚠️';
    const title = type === 'success' ? 'Success' : 'Attention';
    
    toast.innerHTML = `
        <div style="font-size: 1.5rem;">${icon}</div>
        <div>
            <span class="toast-title">${title}</span>
            <span class="toast-msg">${msg}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// --- TRANSLATION SYSTEM ---
window.setLang = function(lang) {
    currentLang = lang;
    
    // Update Buttons
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    // Update Grid Titles
    document.querySelectorAll('.card-title').forEach(el => {
        const sid = el.dataset.sid;
        const service = services.find(s => s.id === sid);
        if(service) el.innerText = service.labels[lang];
    });

    // Update Form Labels
    document.querySelectorAll('label').forEach(lbl => {
        if(lbl.dataset[lang]) lbl.innerText = lbl.dataset[lang];
    });

    // Update Hero & Static Text
    const texts = {
        en: { 
            heroT: "Welcome to Habesha Services", heroS: "Professional assistance for all your documentation needs.",
            select: "Select Service", app: "Application", docs: "Documents", upload: "Upload ID / Documents", btn: "Submit Application", details: "Service Details"
        },
        am: { 
            heroT: "ወደ ሀበሻ ሰርቪስ እንኳን በደህና መጡ", heroS: "ለሁሉም ዓይነት የሰነድ ጉዳዮችዎ ሙያዊ እገዛ እናደርጋለን።",
            select: "አገልግሎት ይምረጡ", app: "ማመልከቻ", docs: "ሰነዶች", upload: "መታወቂያ/ሰነድ ያስገቡ", btn: "ማመልከቻውን ላክ", details: "ዝርዝር መረጃ"
        },
        ti: { 
            heroT: "እንቋዕ ናብ HB ሰርቪስ ብሰላም መጻእኩም", heroS: "ንኩሉ ዓይነት ናይ ዶኩመንት ጉዳያትኩም ሞያዊ ሓገዝ ንገብር።",
            select: "ኣገልግሎት ምረጹ", app: "መመልከቲ", docs: "ሰነዳት", upload: "መታወቒ/ሰነድ ኣእትዉ", btn: "መመልከቲ ስደዱ", details: "ዝርዝር ሓበሬታ"
        }
    };

    const t = texts[lang];
    if(document.getElementById('hero-title')) document.getElementById('hero-title').innerText = t.heroT;
    if(document.getElementById('hero-subtitle')) document.getElementById('hero-subtitle').innerText = t.heroS;
    if(document.getElementById('select-title')) document.getElementById('select-title').innerText = t.select;
    if(document.getElementById('form-header-title')) document.getElementById('form-header-title').innerText = t.app;
    if(document.getElementById('lbl-docs')) document.getElementById('lbl-docs').innerText = t.docs;
    if(document.getElementById('lbl-upload')) document.getElementById('lbl-upload').innerText = t.upload;
    if(document.getElementById('btn-submit')) document.getElementById('btn-submit').innerText = t.btn;
};

function getLabel(key) {
    const dict = {
        details: { en: "Service Details", am: "ዝርዝር መረጃ", ti: "ዝርዝር ሓበሬታ" }
    };
    return dict[key] ? dict[key][currentLang] : "";
}

window.updateFileCount = function() {
    const input = document.getElementById('file-input');
    const count = input.files.length;
    document.getElementById('file-count').innerText = count > 0 ? `${count} file(s) selected` : "No files selected";
}

// Start
init();
