// --- FIREBASE SETUP ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
// Your Config
const firebaseConfig = {
  apiKey: "AIzaSyBzlRJwD_dJ9qh22zipP5Ux77q7-9IT33I",
  authDomain: "hb-services-87372.firebaseapp.com",
  projectId: "hb-services-87372",
  storageBucket: "hb-services-87372.firebasestorage.app",
  messagingSenderId: "326833059312",
  appId: "1:326833059312:web:cee34d9ec63c4adfd21935"
};

let db, storage;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase Connected Successfully");
} catch (e) {
    console.error("Firebase Connection Failed:", e);
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
        label: { en: 'Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'የጋብቻ ሁኔታ' } 
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
    { name: 'emergency_contact', type: 'textarea', label: { en: 'Emergency Contact (Optional)', am: 'የአደጋ ጊዜ ግንኙነት', ti: 'ናይ ህጹጽ እዋን ተጸዋዒ(ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } },
    
    { 
        name: 'additionalInformation', 
        type: 'textarea', 
        label: { en: 'Additional Information', am: 'ተጨማሪ መረጃ', ti: 'ተወሳኪ ሓበሬታ' }, 
        placeholder: { en: 'Please provide any additional information here...', am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' } 
    }
],

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
        { name: 'emergency_contact', type: 'textarea', label: { en: 'Emergency Contact (Name, Phone, Address)', am: 'የአደጋ ጊዜ ተጠሪ', ti: 'ናይ ህጹጽ እዋን ተጸዋዒ(ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } },
       { 
    name: 'additionalInformation', 
    type: 'textarea', 
    label: { 
        en: 'Additional Information', 
        am: 'ተጨማሪ መረጃ', 
        ti: 'ተወሳኪ ሓበሬታ' 
    }, 
    placeholder: { 
        en: 'Please provide any additional information here...', 
        am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', 
        ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' 
    } 
}

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
    },
         { 
    name: 'additionalInformation', 
    type: 'textarea', 
    label: { 
        en: 'Additional Information', 
        am: 'ተጨማሪ መረጃ', 
        ti: 'ተወሳኪ ሓበሬታ' 
    }, 
    placeholder: { 
        en: 'Please provide any additional information here...', 
        am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', 
        ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' 
    } 
}
],

    'health_card': [ // Based on OHIP 0265-82
        { name: 'full_name', type: 'text', required: true, label: { en: 'Full Legal Name', am: 'ሙሉ ስም', ti: 'ሙሉእ ስም' } },
        { name: 'dob', type: 'date', required: true, label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለት ልደት' } },
        { name: 'phone', type: 'tel', required: true, label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } },
        { name: 'current_address', type: 'textarea', required: true, label: { en: 'Current Address', am: 'መኖሪያ አድራሻ', ti: 'ናይ ገዛ አድራሻ' } },
        { name: 'status_doc', type: 'select', options: ['PR Card', 'Work Permit', 'Confirmation of PR'], label: { en: 'Immigration Document', am: 'የኢሚግሬሽን ሰነድ', ti: 'ናይ ኢሚግሬሽን ሰነድ' } },
        { name: 'residency_doc', type: 'select', options: ['Drivers License', 'Bank Statement', 'Lease Agreement', 'Pay Stub'], label: { en: 'Proof of Address (Ontario)', am: 'የአድራሻ ማረጋገጫ', ti: 'ናይ ኣድራሻ መረጋገጺ' } },
        { name: 'arrival_date_canada', type: 'date', label: { en: 'Date Arrived in Canada', am: 'ካናዳ የገቡበት ቀን', ti: 'ናብ ካናዳ ዝኣተውሉ ዕለት' } },
        { name: 'arrival_date_ontario', type: 'date', label: { en: 'Date Arrived in Ontario', am: 'ኦንታሪዮ የገቡበት ቀን', ti: 'ናብ ኦንታሪዮ ዝኣተውሉ ዕለት' } },
        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Information', am: 'ተጨማሪ መረጃ', ti: 'ተወሳኪ ሓበሬታ' }, 
            placeholder: { en: 'Please provide any additional information here...', am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' } 
        }
    ],

   'single_status': [ 
    // ===============================
    // SECTION 1: THE DECLARANT (YOU)
    // ===============================
    { 
        name: 'full_name', 
        type: 'text', 
        required: true, 
        label: { en: 'Full Name (as on Passport)', am: 'ሙሉ ስም (በፓስፖርት ላይ እንዳለው)', ti: 'ሙሉእ ስም (ከምቲ ኣብ ፓስፖርት ዘሎ)' } 
    },
    { 
        name: 'current_address', 
        type: 'textarea', 
        required: true, 
        label: { en: 'Current Home Address', am: 'የአሁን የመኖሪያ አድራሻ', ti: 'ናይ ሕጂ ዘለኩምዎ አድራሻ' } 
    },
    { 
        name: 'occupation', 
        type: 'text', 
        required: true, 
        label: { en: 'Occupation', am: 'የስራ ድርሻ/ሙያ', ti: 'ስራሕ/ሞያ' } 
    },

    // ===============================
    // SECTION 2: PARENTS
    // ===============================
    { 
        name: 'father_name', 
        type: 'text', 
        required: true, 
        label: { en: 'Father\'s Full Name', am: 'የአባት ሙሉ ስም', ti: 'ናይ ኣቦ ሙሉእ ስም' } 
    },
    { 
        name: 'mother_name', 
        type: 'text', 
        required: true, 
        label: { en: 'Mother\'s Full Name', am: 'የእናት ሙሉ ስም', ti: 'ናይ ኣደ ሙሉእ ስም' } 
    },

    // ===============================
    // SECTION 3: MARITAL STATUS
    // ===============================
    { 
        name: 'marital_status', 
        type: 'select', 
        required: true, 
        options: ['Never Married', 'Divorced', 'Widowed'], 
        label: { en: 'Current Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት ሓዳር' } 
    },

    // ===============================
    // SECTION 4: MARRIAGE INTENT (ADDED)
    // ===============================
    { 
        name: 'marriage_country', 
        type: 'text', 
        required: true, 
        label: { en: 'Country where marriage will take place', am: 'ጋብቻው የሚፈጸምበት አገር', ti: 'መርዓ ዝግበረሉ ሃገር' } 
    },

    // ===============================
    // SECTION 5: PREVIOUS MARRIAGE INFO (Conditional)
    // ===============================
    { 
        name: 'previous_marriage_end_date', 
        type: 'date', 
        label: { en: 'If Divorced/Widowed: Date it ended', am: 'የተፋቱ ወይም የሞተበት ከሆነ፡ የተጠናቀቀበት ቀን', ti: 'ዝተፋታሕኩም ወይ በዓል ቤት ብህይወት እንተዘየልዩ እንተኾይኑ፡ ዝተወድኣሉ ዕለት' } 
    },
    { 
        name: 'divorce_file_number', 
        type: 'text', 
        label: { en: 'If Divorced: Court File Number', am: 'የተፋቱ ከሆነ፡ የፍርድ ቤት መዝገብ ቁጥር', ti: 'ዝተፋታሕኩም እንተኾይኑ፡ ናይ ቤት ፍርዲ መዝገብ ቁጽሪ' } 
    },

    // ===============================
    // SECTION 6: EXTRA INFO
    // ===============================
    { 
        name: 'additionalInformation', 
        type: 'textarea', 
        label: { 
            en: 'Additional Information', 
            am: 'ተጨማሪ መረጃ', 
            ti: 'ተወሳኪ ሓበሬታ' 
        }, 
        placeholder: { 
            en: 'Please provide any additional information here...', 
            am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', 
            ti: 'ተወሳኪ ሓበሬታ ኣብዚ የእትዉ...' 
        } 
    }
],

    'marriage_cert': [ // Service Ontario
        { name: 'groom_name', type: 'text', label: { en: 'Applicant 1 Name (Groom)', am: 'አመልካች 1 ስም (ሙሽራ)', ti: 'መመርዓዊ' } },
        { name: 'bride_name', type: 'text', label: { en: 'Applicant 2 Name (Bride)', am: 'አመልካች 2 ስም (ሙሽሪት)', ti: 'መመርዓዊት' } },
        { name: 'marriage_date', type: 'date', label: { en: 'Date of Marriage', am: 'የጋብቻ ቀን', ti: 'ዝተመርዓዉሉ ዕለት' } },
        { name: 'marriage_city', type: 'text', label: { en: 'City of Marriage', am: 'ጋብቻው የተፈጸመበት ከተማ', ti: 'መርዓ ዝተፈጸመሉ ከተማ' } },
         { 
    name: 'additionalInformation', 
    type: 'textarea', 
    label: { 
        en: 'Additional Information', 
        am: 'ተጨማሪ መረጃ', 
        ti: 'ተወሳኪ ሓበሬታ' 
    }, 
    placeholder: { 
        en: 'Please provide any additional information here...', 
        am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', 
        ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' 
    } 
}
    ],

    'death_cert': [
        { name: 'applicant_name', type: 'text', required: true, label: { en: 'Your Full Name (Applicant)', am: 'የአመልካች ስም', ti: 'ናይ ኣመልካቲ ስም' } },
        { name: 'applicant_phone', type: 'tel', required: true, label: { en: 'Your Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } },
        { name: 'deceased_name', type: 'text', required: true, label: { en: 'Deceased Full Name', am: 'የሟች ሙሉ ስም', ti: 'ሙሉእ ሽም መዋቲ' } },
        { name: 'date_death', type: 'date', label: { en: 'Date of Death', am: 'የሞቱበት ቀን', ti: 'ዝሞትሉ ዕለት' } },
        { name: 'place_death', type: 'text', label: { en: 'Place of Death (City)', am: 'የሞቱበት ከተማ', ti: 'ዝሞትሉ ከተማ' } },
        { name: 'applicant_relationship', type: 'text', label: { en: 'Your Relationship to Deceased', am: 'ከሟች ጋር ያሎት ዝምድና', ti: 'ምስ መዋቲ ዘለኩም ዝምድና' } },
        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Information', am: 'ተጨማሪ መረጃ', ti: 'ተወሳኪ ሓበሬታ' }, 
            placeholder: { en: 'Please provide any additional information here...', am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' } 
        }
    ],

    'sin_card': [
        { name: 'full_name', type: 'text', label: { en: 'Full Name', am: 'ሙሉ ስም', ti: 'ሙሉእ ስም' } },
        { name: 'dob', type: 'date', label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } },
        { name: 'father_name', type: 'text', label: { en: 'Father\'s Name', am: 'የአባት ስም', ti: 'ሽም ኣቦ' } },
        { name: 'mother_name', type: 'text', label: { en: 'Mother\'s Maiden Name', am: 'የእናት ስም (ከጋብቻ በፊት)', ti: 'ሽም ኣደ (ቅድሚ መውስቦ)' } },
        { name: 'status_doc_type', type: 'select', options: ['PR Card', 'Work Permit', 'Refugee Doc'], label: { en: 'Primary Document Type', am: 'የመታወቂያ አይነት', ti: 'ዓይነት መታወቒ' } },
         { 
    name: 'additionalInformation', 
    type: 'textarea', 
    label: { 
        en: 'Additional Information', 
        am: 'ተጨማሪ መረጃ', 
        ti: 'ተወሳኪ ሓበሬታ' 
    }, 
    placeholder: { 
        en: 'Please provide any additional information here...', 
        am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', 
        ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' 
    } 
}
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
        { name: 'bank_account_number', type: 'text', required: true, label: { en: 'Account Number', am: 'የሂሳብ ቁጥር', ti: 'bank account' } },
         { 
    name: 'additionalInformation', 
    type: 'textarea', 
    label: { 
        en: 'Additional Information', 
        am: 'ተጨማሪ መረጃ', 
        ti: 'ተወሳኪ ሓበሬታ' 
    }, 
    placeholder: { 
        en: 'Please provide any additional information here...', 
        am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', 
        ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' 
    } 
}
        
    ],
    'oas': [
        { name: 'full_name', type: 'text', required: true, label: { en: 'Full Legal Name', am: 'ሙሉ ስም', ti: 'ሙሉእ ስም' } },
        { name: 'dob', type: 'date', required: true, label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለት ልደት' } },
        { name: 'phone', type: 'tel', required: true, label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } },
        { name: 'current_address', type: 'textarea', required: true, label: { en: 'Current Address', am: 'መኖሪያ አድራሻ', ti: 'ናይ ገዛ አድራሻ' } },
        { name: 'sin_num', type: 'text', label: { en: 'SIN Number', am: 'SIN ቁጥር', ti: 'SIN ቁጽሪ' } },
        { name: 'date_entered_canada', type: 'date', label: { en: 'Date Entered Canada', am: 'ካናዳ የገቡበት ቀን', ti: 'ናብ ካናዳ ዝኣተውሉ ዕለት' } },
        { name: 'marital_status', type: 'select', options: ['Married', 'Single', 'Widowed', 'Divorced'], label: { en: 'Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት መውስቦ' } },
        { name: 'spouse_sin', type: 'text', label: { en: 'Spouse SIN (If applicable)', am: 'የባለቤት SIN (ካለ)', ti: 'ናይ መጻምድቲ SIN (እንተልዩ)' } }
    ],

   'lost_passport': [
        // ===============================
        // SECTION 1: APPLICATION TYPE (LOGIC TRIGGER)
        // ===============================
        { 
            name: 'application_type', 
            type: 'select', 
            required: true, 
            options: ['New Application (First Time)', 'Renewal', 'Replace Lost or Stolen Passport'], 
            label: { en: 'Application Type', am: 'የማመልከቻው አይነት', ti: 'ዓይነት ኣመልካቲ' } 
        },

        // ===============================
        // SECTION 2: PASSPORT VALIDITY
        // ===============================
        { name: 'passport_validity', type: 'select', required: true, options: ['5 Years', '10 Years'], label: { en: 'Passport Validity Period', am: 'የፓስፖርት አገልግሎት ዘመን', ti: 'ናይ ክንደይ ግዜ ፓስፖርት ትደሊ' } },

        // ===============================
        // SECTION 3: PERSONAL INFORMATION
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
        // SECTION 4: PROOF OF CITIZENSHIP
        // ===============================
        { name: 'citizenship_doc_type', type: 'select', required: true, options: ['Birth Certificate (Canada)', 'Citizenship Certificate'], label: { en: 'Citizenship Document Type', am: 'የዜግነት ማረጋገጫ አይነት', ti: 'ዓይነት ሰነድ ዜግነት' } },
        { name: 'citizenship_doc_number', type: 'text', required: true, label: { en: 'Certificate / Registration Number', am: 'የሰርተፍኬት ቁጥር', ti: 'ቁጽሪ ሰርተፍኬት' } },
        { name: 'citizenship_issue_date', type: 'date', required: true, label: { en: 'Date of Issue', am: 'የተሰጠበት ቀን', ti: 'ዝተዋህበሉ ዕለት' } },

        // ===============================
        // SECTION 5: SUPPORTING ID
        // ===============================
        { name: 'id_type', type: 'text', required: true, label: { en: 'ID Document Type (e.g. Driver\'s License)', am: 'የመታወቂያ አይነት (መንጃ ፈቃድ)', ti: 'ዓይነት መንነት እተቅርቦ ' } },
        { name: 'id_number', type: 'text', required: true, label: { en: 'ID Document Number', am: 'የመታወቂያ ቁጥር', ti: 'ቁጽሪ ID ' } },
        { name: 'id_expiry_date', type: 'date', required: true, label: { en: 'ID Expiry Date', am: 'መታወቂያው የሚያበቃበት ቀን', ti: 'ID ዘብቅዓሉ ዕለት' } },

        // ===============================
        // SECTION 6: CONTACT & ADDRESSES
        // ===============================
        { name: 'home_address', type: 'textarea', required: true, label: { en: 'Current Home Address', am: 'የአሁን መኖሪያ አድራሻ', ti: 'ሕጂ ዘለካ ኣድራሻ' } },
        { name: 'mailing_address', type: 'textarea', label: { en: 'Mailing Address (if different)', am: 'የፖስታ አድራሻ', ti: 'ኣድራሻ ፖስታ' } },
        { name: 'phone_primary', type: 'tel', required: true, label: { en: 'Primary Phone Number', am: 'ዋና ስልክ', ti: 'ቁጽሪ ቴሌ.' } },
        { name: 'email', type: 'email', required: true, label: { en: 'Email Address', am: 'ኢሜይል', ti: 'ኢሜይል' } },
        { name: 'address_history', type: 'textarea', required: true, label: { en: 'Address History – Last 2 Years (No gaps)', am: 'የአድራሻ ታሪክ (2 ዓመት)', ti: 'ናይ 2 ዓመት ዝተቀመጥካሉ ኣድራሻ ብዝርዝር ጥቀስ' } },
        { name: 'occupation_history', type: 'textarea', required: true, label: { en: 'Employment / School History – Last 2 Years', am: 'የሥራ/ትምህርት ታሪክ', ti: 'ናይ ስራሕ ወይ ትምህርቲ ዝከድካዮ ኣብዚ 2 ዓመት ብዝርዝር ጥቀስ(ኣድራሻ፣ ዝሰራሕካሉ ትካል ወይ ትምህርቲ) ' } },

        // ===============================
        // SECTION 7: GUARANTOR
        // ===============================
        { name: 'guarantor_full_name', type: 'text', required: true, label: { en: 'Guarantor Full Name', am: 'የዋስ ሙሉ ስም', ti: 'ሙሉእ ስም ዋሕስ' } },
        { name: 'guarantor_ppt_number', type: 'text', required: true, label: { en: 'Guarantor Passport Number', am: 'የዋስ ፓስፖርት ቁጥር', ti: 'ቁጽሪ ፓስፖርት ዋሕስ' } },
        { name: 'guarantor_issue_date', type: 'date', required: true, label: { en: 'Guarantor Passport Issue Date', am: 'ፓስፖርቱ የተሰጠበት ቀን', ti: 'ፓስፖርት ዝተወሃበሉ ዕለት' } },
        { name: 'guarantor_expiry_date', type: 'date', required: true, label: { en: 'Guarantor Passport Expiry Date', am: 'ፓስፖርቱ የሚያበቃበት ቀን', ti: 'ፓስፖርት ዘብቅዓሉ ዕለት' } },
        { name: 'guarantor_phone', type: 'tel', required: true, label: { en: 'Guarantor Phone Number', am: 'የዋስ ስልክ', ti: 'ቁጽሪ ቴሌ. ዋሕስ' } },
        { name: 'guarantor_known_years', type: 'number', required: true, label: { en: 'Years Known Guarantor', am: 'ዋሱ ስንት ዓመት ያውቅዎታል?', ti: 'ንክንደይ ግዜ ትፋለጡ ምስ ዋሕስ?' } },

        // ===============================
        // SECTION 8: REFERENCES
        // ===============================
        { name: 'reference_1', type: 'textarea', required: true, label: { en: 'Reference 1 (Name, Phone, Address, Relationship)', am: 'መወከሲ 1', ti: 'ምስክር 1 (ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } },
        { name: 'reference_2', type: 'textarea', required: true, label: { en: 'Reference 2 (Name, Phone, Address, Relationship)', am: 'መወከሲ 2', ti: 'ምስክር 2 (ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } },

        // ===============================
        // SECTION 9: LOST / STOLEN DETAILS (ONLY SHOW IF "LOST" SELECTED)
        // ===============================
        { 
            name: 'lost_passport_number', 
            type: 'text', 
            label: { en: 'Lost Passport Number (if known)', am: 'የጠፋው ፓስፖርት ቁጥር (የሚያውቁት ከሆነ)', ti: 'ቁጽሪ ናይ ዝጠፍአ ፓስፖርት (ትፈልጥዎ እንተኾንኩም)' } 
        },
        { 
            name: 'date_of_loss', 
            type: 'date', 
            // required: true, // Only require if Lost/Stolen selected
            label: { en: 'Date of Loss/Theft', am: 'የጠፋበት ወይም የተሰረቀበት ቀን', ti: 'ዝጠፍኣሉ ወይ ዝተሰርቀሉ ዕለት' } 
        },
        { 
            name: 'location_of_loss', 
            type: 'text', 
            // required: true, // Only require if Lost/Stolen selected
            label: { en: 'Location where it was lost/stolen (City, Country)', am: 'የጠፋበት ወይም የተሰረቀበት ቦታ (ከተማ፣ ሀገር)', ti: 'ዝጠፍኣሉ ወይ ዝተሰርቀሉ ቦታ (ከተማ፣ ሃገር)' } 
        },
        { 
            name: 'police_report_filed', 
            type: 'select', 
            // required: true, // Only require if Lost/Stolen selected
            options: ['Yes', 'No'], 
            label: { en: 'Did you file a police report?', am: 'ለፖሊስ አሳውቀዋል?', ti: 'ንፖሊስ ሓቢርኩም ዶ?' } 
        },
        { 
            name: 'police_file_number', 
            type: 'text', 
            label: { en: 'Police File Number (if applicable)', am: 'የፖሊስ መዝገብ ቁጥር', ti: 'ናይ ፖሊስ መዝገብ ቁጽሪ' } 
        },
        { 
            name: 'loss_explanation', 
            type: 'textarea', 
            // required: true, // Only require if Lost/Stolen selected
            label: { en: 'Explain specifically how it was lost or stolen', am: 'እንዴት እንደጠፋ ወይም እንደተሰረቀ በዝርዝር ያስረዱ', ti: 'ብኸመይ ከምዝጠፍአ ወይ ከምዝተሰርቀ ብዝርዝር ግለጹ' },
            placeholder: { en: 'Example: I left my bag on the train...', am: 'ምሳሌ፡ ባቡር ውስጥ ቦርሳዬን ረሳሁ...', ti: 'ኣብነት፡ ኣብ ባቡር ቦርሳይ ረሲዐ...' }
        },

        // ===============================
        // SECTION 10: EMERGENCY CONTACT & EXTRA
        // ===============================
        { name: 'emergency_contact', type: 'textarea', label: { en: 'Emergency Contact (Name, Phone, Address)', am: 'የአደጋ ጊዜ ተጠሪ', ti: 'ናይ ህጹጽ እዋን ተጸዋዒ(ሙሉእ ስም፣ ቴሌ.፣ ኣድራሻን ዝምድና)' } },
        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { 
                en: 'Additional Information', 
                am: 'ተጨማሪ መረጃ', 
                ti: 'ተወሳኪ ሓበሬታ' 
            }, 
            placeholder: { 
                en: 'Please provide any additional information here...', 
                am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', 
                ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' 
            } 
        }
    ],
};


function init() {
    createToastContainer();
    renderGrid();

    // 1. Wire up the File Upload Box
    const uploadBox = document.getElementById('upload-box-trigger');
    const fileInput = document.getElementById('file-input');
    
    if(uploadBox && fileInput) {
        // Clicking the box triggers the hidden file input
        uploadBox.addEventListener('click', () => fileInput.click());
        
        // When files are selected, update the text
        fileInput.addEventListener('change', window.updateFileCount);
    }

    // 2. Wire up the Submit Button
    const form = document.getElementById('main-form');
    if(form) {
        form.addEventListener('submit', window.handleFormSubmit);
    }

    // 3. Language Switcher Logic
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.dataset.lang;
            window.setLang(lang);
        });
    });
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

 // We use querySelector because the element has a class="form-header", not an ID
const header = document.querySelector('.form-header');
    
    // Check if button already exists to prevent adding it twice
    if(header && !header.querySelector('.back-btn')) {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn-text back-btn'; // We will style this class in CSS later
        backBtn.innerText = '← Back / ተመለስ';
        backBtn.style.marginRight = 'auto'; // Pushes it to the left
        backBtn.style.cursor = 'pointer';
        backBtn.style.fontWeight = 'bold';
        
        backBtn.onclick = () => {
            // Hide Form
            document.getElementById('form-container').style.display = 'none';
            // Show Grid
            document.getElementById('service-grid').style.display = 'grid';
            // Show Hero Section (Welcome text)
            const hero = document.getElementById('hero-section');
            if(hero) hero.style.display = 'block';
            
            // Scroll to top
            window.scrollTo(0, 0);
        };
        
        // Add button to the top of the header
        header.prepend(backBtn);
    }
    
    // 2. HIDE GRID AND HERO WHEN FORM OPENS
    const hero = document.getElementById('hero-section');
    if(hero) hero.style.display = 'none';
    
    const grid = document.getElementById('service-grid');
    if(grid) grid.style.display = 'none';
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

      
        // 2. Specific Fields
        if(specificFields[serviceId]) {
            const div = document.createElement('div');
            div.className = 'form-section-title';
            div.innerText = getLabel('details');
            dynamicInputs.appendChild(div);
            renderFields(specificFields[serviceId]);
        }

      // Restore previous work if it exists
        restoreDraft(serviceId);
        // Fade in
        formContainer.style.opacity = '1';
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
}

// 1. UPDATED RENDER FUNCTION (Fixed Validation)
function renderFields(fieldList, parentElement = null) {
    // If we are inside a repeater, use the row as the parent, otherwise find the main container
    const container = parentElement || document.getElementById('dynamic-inputs');
    
    fieldList.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';

        // Create the Label
        const lbl = document.createElement('label');
        if(field.label) {
            lbl.innerText = field.label[currentLang] || field.label.en;
            lbl.dataset.en = field.label.en;
            lbl.dataset.am = field.label.am;
            lbl.dataset.ti = field.label.ti;
        }
        group.appendChild(lbl);

        // --- REPEATER LOGIC ---
        if (field.type === 'repeater') {
            const repeaterBox = document.createElement('div');
            repeaterBox.className = 'repeater-box';
            repeaterBox.style.borderLeft = "3px solid #007bff";
            repeaterBox.style.paddingLeft = "15px";
            repeaterBox.id = `repeater-${field.name}`;

            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'btn-secondary small'; 
            addBtn.innerText = '+ Add Entry';
            addBtn.style.marginTop = "10px";
            
            addBtn.onclick = () => addRepeaterRow(repeaterBox, field.fields);

            // Add one default empty row to start
            addRepeaterRow(repeaterBox, field.fields);

            group.appendChild(repeaterBox);
            group.appendChild(addBtn);
            container.appendChild(group);
            return; // Stop here for this field
        }

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
        } else if (field.type === 'select') {
            input = document.createElement('select');
            // Add a default blank option
            const def = document.createElement('option');
            def.value = "";
            def.innerText = "Select...";
            input.appendChild(def);
            
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

        // --- FIX: APPLY REQUIRED ATTRIBUTE ---
        if(field.required) {
            input.required = true;
        }

        // Auto-save when user types
        input.addEventListener('input', () => saveDraft());
        if(field.placeholder) {
            input.placeholder = field.placeholder[currentLang] || "";
        }

        // UX: Remove red error border when user clicks
        input.addEventListener('focus', () => {
            input.classList.remove('error');
        });

        group.appendChild(input);
        container.appendChild(group);
    });
}
// 2. NEW HELPER FUNCTION (Paste this right under renderFields)
function addRepeaterRow(container, fields) {
    const row = document.createElement('div');
    row.className = 'repeater-row';
    
    // Simple styling for the row
    row.style.background = "#f9f9f9";
    row.style.padding = "15px";
    row.style.marginBottom = "15px";
    row.style.borderRadius = "8px";
    row.style.position = "relative";
    row.style.border = "1px solid #ddd";

    // Recursively call renderFields to put inputs INSIDE this row
    renderFields(fields, row);

    // Add a Remove Button for this specific row
    const delBtn = document.createElement('button');
    delBtn.innerText = "Remove / አጥፋ";
    delBtn.className = 'btn-danger small';
    delBtn.type = 'button';
    delBtn.style.marginTop = "10px";
    delBtn.onclick = () => row.remove();

    row.appendChild(delBtn);
    container.appendChild(row);
}

// --- SUBMISSION LOGIC (REAL MODE ONLY) ---
window.handleFormSubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    const form = document.getElementById('main-form');
    
    // 1. Check if Firebase is ready
    if (!db) {
        alert("CRITICAL ERROR: Firebase is not connected.\n\nCheck your API Keys and Internet Connection.");
        return;
    }

    // 2. Validation
    if(!validateForm()) {
        showToast("Please fill in all required fields.", "error");
        return;
    }

    // 3. Set Loading State
    const originalText = btn.innerText;
    btn.innerHTML = `<span class="spinner"></span> Generating ID...`;
    btn.disabled = true;

    try {
        // 4. Handle File Uploads
        const fileInput = document.getElementById('file-input');
        const uploadedFileUrls = [];

        if (fileInput && fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedFileUrls.push({
                    name: file.name,
                    url: downloadURL,
                    type: file.type
                });
            }
        }

        // 5. Collect Data
        let formData = {
            service: currentService,
            status: 'new',
            submittedAt: serverTimestamp(),
            language: currentLang,
            documents: uploadedFileUrls,
            data: {}
        };
        
       const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type !== 'file' && input.type !== 'submit' && input.name) {
                // Check if this field name already exists (for Repeaters)
                if (formData.data.hasOwnProperty(input.name)) {
                    // If it's not an array yet, convert it to an array
                    if (!Array.isArray(formData.data[input.name])) {
                        formData.data[input.name] = [formData.data[input.name]];
                    }
                    // Add the new value to the list
                    formData.data[input.name].push(input.value);
                } else {
                    // First time seeing this field, just save the value
                    formData.data[input.name] = input.value;
                }
            }
        });

        // 6. SUBMIT TO REAL DATABASE
        // This line generates the REAL ID
        const docRef = await addDoc(collection(db, "submissions"), formData);
        
        console.log("SUCCESS! Real ID:", docRef.id);

      // Clear the saved draft so the form is empty next time
        localStorage.removeItem(`draft_${currentService}`);
        // 7. Success Alert
        showToast("Application submitted successfully!");
        
        // Slight delay to ensure the Toast is seen
        setTimeout(() => {
            alert(`✅ APPLICATION SUCCESSFUL\n\nYour Tracking ID is:\n${docRef.id}\n\nPlease take a screenshot of this ID.`);
            location.reload();
        }, 500);

    } catch(err) {
        console.error("Submission Error:", err);
        
        // SPECIFIC ERROR MESSAGES
        if (err.code === 'permission-denied') {
            alert("❌ Database Permission Denied.\n\nGo to Firebase Console -> Firestore -> Rules\nChange to: allow create: if true;");
        } else if (err.code === 'unavailable') {
            alert("❌ Network Error.\n\nCheck your internet connection.");
        } else {
            alert("❌ Error: " + err.message);
        }

        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

function validateForm() {
    let isValid = true;
    // We only want to validate inputs that are actually visible
    const inputs = document.querySelectorAll('#dynamic-inputs input, #dynamic-inputs select, #dynamic-inputs textarea');
    
    inputs.forEach(input => {
        // ONLY check if the input has the 'required' attribute
        if(input.hasAttribute('required') && !input.value.trim()) {
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

window.setLang = function(lang) {
    currentLang = lang;
    
    // Update Buttons (Find the button with this lang and activate it)
    document.querySelectorAll('.lang-btn').forEach(b => {
        if(b.dataset.lang === lang) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

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
            heroT: "Welcome to HB Services", heroS: "Professional assistance for all your documentation needs.",
            select: "Select Service", app: "Application", docs: "Documents", upload: "Upload ID / Documents", btn: "Submit Application", details: "Service Details"
        },
        am: { 
            heroT: "ወደ HB ሰርቪስ እንኳን በደህና መጡ", heroS: "ለሁሉም ዓይነት የሰነድ ጉዳዮችዎ ሙያዊ እገዛ እናደርጋለን።",
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

// --- DRAFT SYSTEM (AUTO-SAVE) ---
function saveDraft() {
    if(!currentService) return;
    
    const form = document.getElementById('main-form');
    const data = {};
    
    // Capture all inputs
    form.querySelectorAll('input, select, textarea').forEach(el => {
        // Only save fields that have a name and aren't file uploads
        if(el.name && el.type !== 'file' && el.type !== 'submit') {
            data[el.name] = el.value;
        }
    });

    // Save to browser memory
    localStorage.setItem(`draft_${currentService}`, JSON.stringify(data));
    // Optional: console.log("Saved");
}

function restoreDraft(serviceId) {
    const saved = localStorage.getItem(`draft_${serviceId}`);
    if(!saved) return;
    
    try {
        const data = JSON.parse(saved);
        const form = document.getElementById('main-form');
        
        // Loop through saved data and put it back into the form
        Object.keys(data).forEach(key => {
            const val = data[key];
            const el = form.querySelector(`[name="${key}"]`);
            if(el) {
                el.value = val;
            }
        });
        
        // Let user know data came back
        showToast("Draft Restored / የጀመሩት ተመልሷል", "success");
    } catch(e) {
        console.error("Draft restore error", e);
    }
}
