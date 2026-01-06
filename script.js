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
    'travel_doc': [ // Based on IMM 5721
        { name: 'uci_number', type: 'text', label: { en: 'UCI / Client ID (from Refugee document)', am: 'UCI ቁጥር (ከጥገኝነት ወረቀት ላይ)', ti: 'UCI ቁጽሪ' } },
        { name: 'surname', type: 'text', label: { en: 'Surname (Last Name)', am: 'የቤተሰብ ስም', ti: 'ሽም ስድራ' } },
        { name: 'given_name', type: 'text', label: { en: 'Given Name(s)', am: 'የክርስትና ስም', ti: 'ሽም' } },
        { name: 'dob', type: 'date', label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } },
        { name: 'birth_country', type: 'text', label: { en: 'Country of Birth', am: 'የተወለዱበት አገር', ti: 'ዝተወለድካሉ ሃገር' } },
        { name: 'sex', type: 'select', options: ['F', 'M', 'X'], label: { en: 'Sex', am: 'ፆታ', ti: 'ጾታ' } },
        
        // Critical for Refugee Travel Doc
        { name: 'refugee_status_date', type: 'date', label: { en: 'Date Refugee Status Granted', am: 'ጥገኝነት ያገኙበት ቀን', ti: 'ዑቕባ ዝረኸብኩምሉ ዕለት' } },
        { name: 'citizenship_original', type: 'text', label: { en: 'Country of Citizenship (Original)', am: 'ዜግነት (የመጀመሪያ)', ti: 'ዜግነት (ናይ መጀመርያ)' } },
        
        { name: 'height', type: 'text', label: { en: 'Height (cm)', am: 'ቁመት (ሴሜ)', ti: 'ቁመት (ሰ.ሜ)' } },
        { name: 'eye_color', type: 'text', label: { en: 'Eye Color', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } },
        
        // Guarantor (Mandatory)
        { name: 'guarantor_name', type: 'text', label: { en: 'Guarantor Full Name', am: 'የዋስ ሙሉ ስም', ti: 'ሙሉእ ሽም ዋስ' } },
        { name: 'guarantor_ppt_number', type: 'text', label: { en: 'Guarantor Passport Number', am: 'የዋስ ፓስፖርት ቁጥር', ti: 'ቁጽሪ ፓስፖርት ዋስ' } },
        { name: 'guarantor_sign_date', type: 'date', label: { en: 'Date Guarantor Signed', am: 'ዋሱ የፈረመበት ቀን', ti: 'ዋስ ዝፈረመሉ ዕለት' } }
    ],

    'passport': [ // Based on PPTC 153
        { name: 'passport_validity', type: 'select', options: ['5 Years', '10 Years'], label: { en: 'Validity Period', am: 'የአገልግሎት ዘመን', ti: 'ግዜ ኣገልግሎት' } },
        { name: 'surname', type: 'text', label: { en: 'Surname (Last Name)', am: 'የቤተሰብ ስም', ti: 'ሽም ስድራ' } },
        { name: 'given_name', type: 'text', label: { en: 'Given Name(s)', am: 'የክርስትና ስም', ti: 'ሽም' } },
        { name: 'mothers_maiden_name', type: 'text', label: { en: 'Mother\'s Surname at Birth (Maiden Name)', am: 'የእናት ስም (ከጋብቻ በፊት)', ti: 'ሽም ኣደ (ቅድሚ መውስቦ)' } },
        { name: 'dob', type: 'date', label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } },
        { name: 'birth_city', type: 'text', label: { en: 'City of Birth', am: 'የተወለዱበት ከተማ', ti: 'ዝተወለድካሉ ከተማ' } },
        
        // Physical Desc
        { name: 'eye_color', type: 'text', label: { en: 'Eye Color', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } },
        { name: 'height', type: 'text', label: { en: 'Height (cm)', am: 'ቁመት (ሴሜ)', ti: 'ቁመት (ሰ.ሜ)' } },
        
        // Address History (2 Years)
        { name: 'address_history', type: 'textarea', label: { en: 'Address History (Last 2 Years - No Gaps)', am: 'የአድራሻ ታሪክ (ያለፉት 2 ዓመታት)', ti: 'ናይ ኣድራሻ ታሪክ (ዝሓለፈ 2 ዓመት)' } },
        
        // Guarantor
        { name: 'guarantor_name', type: 'text', label: { en: 'Guarantor Full Name', am: 'የዋስ ሙሉ ስም', ti: 'ሙሉእ ሽም ዋስ' } },
        { name: 'guarantor_ppt_number', type: 'text', label: { en: 'Guarantor Passport Number', am: 'የዋስ ፓስፖርት ቁጥር', ti: 'ቁጽሪ ፓስፖርት ዋስ' } },
        { name: 'guarantor_phone', type: 'tel', label: { en: 'Guarantor Phone', am: 'የዋስ ስልክ', ti: 'ተሌፎን ዋስ' } },
        
        // References (2 People)
        { name: 'ref1_details', type: 'textarea', label: { en: 'Reference 1 (Name, Phone, Address, Relation)', am: 'ዋቢ 1 (ስም፣ ስልክ፣ አድራሻ)', ti: 'መወከሲ 1 (ሽም፣ ስልክ፣ ኣድራሻ)' } },
        { name: 'ref2_details', type: 'textarea', label: { en: 'Reference 2 (Name, Phone, Address, Relation)', am: 'ዋቢ 2 (ስም፣ ስልክ፣ አድራሻ)', ti: 'መወከሲ 2 (ሽም፣ ስልክ፣ ኣድራሻ)' } }
    ],

    'citizenship': [ // Based on CIT 0002
        { name: 'uci_number', type: 'text', label: { en: 'UCI (Client ID)', am: 'UCI ቁጥር', ti: 'UCI ቁጽሪ' } },
        { name: 'full_name', type: 'text', label: { en: 'Full Name', am: 'ሙሉ ስም', ti: 'ሙሉእ ስም' } },
        { name: 'pr_date', type: 'date', label: { en: 'Date you became a PR', am: 'PR ያገኙበት ቀን', ti: 'PR ዝረኸብካሉ ዕለት' } },
        
        // The 5-Year Rule
        { name: 'presence_calc_days', type: 'number', label: { en: 'Physical Presence Days (From Calculator - must be >1095)', am: 'ካናዳ ውስጥ የኖሩበት ቀናት ብዛት (ከ1095 በላይ መሆን አለበት)', ti: 'ኣብ ካናዳ ዝነበርኩምሉ መዓልታት (ካብ 1095 ክበዝሕ ኣለዎ)' } },
        { name: 'address_history', type: 'textarea', label: { en: 'Address History (Last 5 Years)', am: 'የአድራሻ ታሪክ (ያለፉት 5 ዓመታት)', ti: 'ናይ ኣድራሻ ታሪክ (ዝሓለፈ 5 ዓመት)' } },
        { name: 'work_history', type: 'textarea', label: { en: 'Work/Education History (Last 5 Years)', am: 'የሥራ/ትምህርት ታሪክ (ያለፉት 5 ዓመታት)', ti: 'ናይ ስራሕ/ትምህርቲ ታሪክ (ዝሓለፈ 5 ዓመት)' } },
        
        // Taxes
        { name: 'taxes_filed', type: 'select', options: ['Yes', 'No'], label: { en: 'Filed Taxes for last 3 years?', am: 'ላለፉት 3 ዓመታት ግብር ከፍለዋል?', ti: 'ንዝሓለፈ 3 ዓመታት ግብሪ ከፊልካዶ?' } },
        
        // Language
        { name: 'language_proof', type: 'select', options: ['Diploma/Transcripts', 'LINC Certificate', 'CELPIP/IELTS', 'Age 55+ (Exempt)'], label: { en: 'Proof of Language (Age 18-54)', am: 'የቋንቋ ማረጋገጫ (ከ18-54 ዓመት)', ti: 'ናይ ቋንቋ መረጋገጺ (ካብ 18-54 ዓመት)' } },
        
        // Prohibitions
        { name: 'criminal_history', type: 'select', options: ['No', 'Yes'], label: { en: 'Any Criminal History / Charges?', am: 'የወንጀል ታሪክ አለ?', ti: 'ናይ ገበን ታሪክ ኣለኩምዶ?' } }
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
        { name: 'sin_num', type: 'text', label: { en: 'SIN Number', am: 'SIN ቁጥር', ti: 'SIN ቁጽሪ' } },
        { name: 'mother_maiden', type: 'text', label: { en: 'Mother\'s Maiden Name', am: 'የእናት ስም', ti: 'ሽም ኣደ' } },
        { name: 'last_employer', type: 'text', label: { en: 'Last Employer Name', am: 'የመጨረሻው አሰሪ ስም', ti: 'ናይ መወዳእታ ኣሰሪ ስም' } },
        { name: 'last_day_worked', type: 'date', label: { en: 'Last Day Worked', am: 'የመጨረሻ የስራ ቀን', ti: 'ናይ መወዳእታ ስራሕ መዓልቲ' } },
        { name: 'reason_leaving', type: 'select', options: ['Shortage of Work', 'Illness', 'Maternity', 'Quit', 'Fired'], label: { en: 'Reason for Stopping', am: 'ስራ ያቆሙበት ምክንያት', ti: 'ስራሕ ዘቋረጽኩምሉ ምኽንያት' } },
        
        // Banking Info (Critical for EI)
        { name: 'bank_inst', type: 'text', label: { en: 'Bank Institution # (3 digits)', am: 'የባንክ መለያ ቁጥር (3 አሃዝ)', ti: 'መፍለይ ቁጽሪ ባንኪ' } },
        { name: 'bank_transit', type: 'text', label: { en: 'Transit # (5 digits)', am: 'ትራንዚት ቁጥር (5 አሃዝ)', ti: 'ትራንዚት ቁጽሪ' } },
        { name: 'bank_account', type: 'text', label: { en: 'Account Number', am: 'የሂሳብ ቁጥር', ti: 'ቁጽሪ ሒሳብ' } }
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
            heroT: "እንቋዕ ናብ ሓበሻ ሰርቪስ ብሰላም መጻእኩም", heroS: "ንኩሉ ዓይነት ናይ ዶኩመንት ጉዳያትኩም ሙያዊ ሓገዝ ንገብር።",
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
