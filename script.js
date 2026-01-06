// --- FIREBASE SETUP ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123...",
    appId: "1:123..."
};

// Initialize (Wrapped in try/catch so the UI works even if you haven't pasted keys yet)
let db, storage;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
} catch (e) {
    console.log("Firebase keys missing - UI Mode only");
}

// Expose submit function to window so HTML can see it
window.handleFormSubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    btn.innerText = "Sending...";
    btn.disabled = true;

    // Collect Data
    let formData = {
        service: currentService,
        timestamp: new Date(),
        data: {}
    };
    
    // Loop through inputs
    const inputs = document.querySelectorAll('#dynamic-inputs input, #dynamic-inputs select, #dynamic-inputs textarea');
    inputs.forEach(input => {
        formData.data[input.name] = input.value;
    });

    // 1. Upload Files (Mock logic if no keys)
    // In real app: Loop through fileInput.files, upload to Storage, get URLs, add to formData
    
    // 2. Save Data
    if(db) {
        try {
            await addDoc(collection(db, "submissions"), formData);
            alert("Success! We have received your application.");
            location.reload();
        } catch(err) {
            alert("Error submitting: " + err.message);
        }
    } else {
        console.log("Form Data Submitted:", formData);
        alert("Success (Test Mode): Check Console for data.");
        location.reload();
    }
};

// --- APP LOGIC & TRANSLATIONS ---

let currentLang = 'en';
let currentService = '';

// 1. DATA CONFIGURATION (The Brains)
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

// Common Inputs (Used everywhere)
const commonFields = [
    { name: 'full_name', type: 'text', label: { en: 'Full Legal Name', am: 'ሙሉ ስም (እንደ መታወቂያ)', ti: 'ሙሉእ ስም (ከም መታወቒ)' } },
    { name: 'phone', type: 'tel', label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } },
    { name: 'address', type: 'text', label: { en: 'Current Address', am: 'አድራሻ', ti: 'አድራሻ' } },
    { name: 'dob', type: 'date', label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዝተወለድካሉ/ክሉ ዕለት' } }
];

// Specific Inputs per Service
const specificFields = {
    'travel_doc': [
        { name: 'surname', type: 'text', label: { en: 'Surname (Last Name)', am: 'የቤተሰብ ስም', ti: 'ሽም ስድራ' } },
        { name: 'given_name', type: 'text', label: { en: 'Given Name(s)', am: 'የክርስትና ስም', ti: 'ሽም' } },
        { name: 'mothers_maiden_name', type: 'text', label: { en: 'Mother\'s Maiden Name (Surname at birth)', am: 'የእናት ስም (ከጋብቻ በፊት)', ti: 'ሽም ኣደ (ቅድሚ መውስቦ)' } },
        { name: 'birth_city', type: 'text', label: { en: 'City of Birth', am: 'የተወለዱበት ከተማ', ti: 'ዝተወለድካሉ ከተማ' } },
        { name: 'birth_country', type: 'text', label: { en: 'Country of Birth', am: 'የተወለዱበት አገር', ti: 'ዝተወለድካሉ ሃገር' } },
        { name: 'sex', type: 'select', options: ['F', 'M', 'X'], label: { en: 'Sex', am: 'ፆታ', ti: 'ጾታ' } },
        { name: 'marital_status', type: 'select', options: ['Single', 'Married', 'Common-law', 'Divorced', 'Widowed', 'Separated'], label: { en: 'Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት መውስቦ' } },
        { name: 'eye_color', type: 'text', label: { en: 'Eye Color', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } },
        { name: 'hair_color', type: 'text', label: { en: 'Hair Color', am: 'የፀጉር ቀለም', ti: 'ሕብሪ ጸጉሪ' } },
        { name: 'height', type: 'text', label: { en: 'Height (cm)', am: 'ቁመት (ሴሜ)', ti: 'ቁመት (ሰ.ሜ)' } },
        { name: 'pr_date', type: 'date', label: { en: 'Date became PR/Refugee', am: 'PR/ጥገኝነት ያገኙበት ቀን', ti: 'PR/ዑቕባ ዝረኸበሉ ዕለት' } },
        { name: 'uci_number', type: 'text', label: { en: 'UCI / Client ID (8 or 10 digits)', am: 'UCI ቁጥር', ti: 'UCI ቁጽሪ' } },
        { name: 'is_citizen_other', type: 'select', options: ['Yes', 'No'], label: { en: 'Are you a citizen of another country?', am: 'የሌላ አገር ዜጋ ነዎት?', ti: 'ናይ ካልእ ሃገር ዜጋ ዲኻ?' } },
        { name: 'other_citizenship_country', type: 'text', label: { en: 'If Yes, which country?', am: 'አዎ ከሆነ፣ የትኛው አገር?', ti: 'እወ እንተ ኮይኑ፡ ኣየነይቲ ሃገር?' } },
        { name: 'phone_primary', type: 'tel', label: { en: 'Primary Phone Number', am: 'ዋና ስልክ ቁጥር', ti: 'ቀዳማይ ቁጽሪ ስልክ' } },
        { name: 'email', type: 'email', label: { en: 'Email Address', am: 'ኢሜይል', ti: 'ኢመይል' } },
        { name: 'address_history', type: 'textarea', label: { en: 'Address History (Past 2 Years: Dates and Locations)', am: 'የአድራሻ ታሪክ (ያለፉት 2 ዓመታት)', ti: 'ናይ ኣድራሻ ታሪክ (ዝሓለፈ 2 ዓመት)' } },
        { name: 'occupation_history', type: 'textarea', label: { en: 'Employment/School History (Last 2 Years: Employer Name, Address, Date From/To)', am: 'የሥራ/ትምህርት ታሪክ (ያለፉት 2 ዓመታት)', ti: 'ናይ ስራሕ/ትምህርቲ ታሪክ (ዝሓለፈ 2 ዓመት)' } },
        { name: 'guarantor_name', type: 'text', label: { en: 'Guarantor Full Name', am: 'የዋስ ሙሉ ስም', ti: 'ሙሉእ ሽም ዋስ' } },
        { name: 'guarantor_dob', type: 'date', label: { en: 'Guarantor Date of Birth', am: 'የዋስ የተወለዱበት ቀን', ti: 'ዕለተ ልደት ዋስ' } },
        { name: 'guarantor_ppt_number', type: 'text', label: { en: 'Guarantor Passport Number', am: 'የዋስ ፓስፖርት ቁጥር', ti: 'ቁጽሪ ፓስፖርት ዋስ' } },
        { name: 'guarantor_issue_date', type: 'date', label: { en: 'Passport Issue Date', am: 'ፓስፖርት የተሰጠበት ቀን', ti: 'ፓስፖርት ዝተወሃበሉ ዕለት' } },
        { name: 'guarantor_phone', type: 'tel', label: { en: 'Guarantor Phone Number', am: 'የዋስ ስልክ', ti: 'ተሌፎን ዋስ' } },
        { name: 'guarantor_years_known', type: 'number', label: { en: 'Number of years known', am: 'ተዋውቀው የቆዩበት ዓመታት', ti: 'ዝተፈልለጥኩምሉ ዓመታት' } },
        { name: 'guarantor_address', type: 'text', label: { en: 'Guarantor Current Address', am: 'የዋስ አድራሻ', ti: 'ኣድራሻ ዋስ' } },
        { name: 'ref1_name', type: 'text', label: { en: 'Reference 1 Name', am: 'የመጀመሪያ ዋቢ ስም', ti: 'ሽም ቀዳማይ መወከሲ' } },
        { name: 'ref1_relation', type: 'text', label: { en: 'Relationship (e.g. Friend, Coworker)', am: 'ግንኙነት (ጓደኛ/የሥራ ባልደረባ)', ti: 'ዝምድና (መሓዛ/መሳርሕቲ)' } },
        { name: 'ref1_phone', type: 'tel', label: { en: 'Reference 1 Phone', am: 'የመጀመሪያ ዋቢ ስልክ', ti: 'ተሌፎን ቀዳማይ መወከሲ' } },
        { name: 'ref1_address', type: 'text', label: { en: 'Reference 1 Address', am: 'የመጀመሪያ ዋቢ አድራሻ', ti: 'ኣድራሻ ቀዳማይ መወከሲ' } },
        { name: 'ref1_years_known', type: 'number', label: { en: 'Years Known', am: 'የሚተዋወቁበት ጊዜ (ዓመት)', ti: 'ዝተፈልለጥኩምሉ ዓመታት' } },
        { name: 'ref2_name', type: 'text', label: { en: 'Reference 2 Name', am: 'የሁለተኛ ዋቢ ስም', ti: 'ሽም ካልኣይ መወከሲ' } },
        { name: 'ref2_relation', type: 'text', label: { en: 'Relationship (e.g. Friend, Coworker)', am: 'ግንኙነት (ጓደኛ/የሥራ ባልደረባ)', ti: 'ዝምድና (መሓዛ/መሳርሕቲ)' } },
        { name: 'ref2_phone', type: 'tel', label: { en: 'Reference 2 Phone', am: 'የሁለተኛ ዋቢ ስልክ', ti: 'ተሌፎን ካልኣይ መወከሲ' } },
        { name: 'ref2_address', type: 'text', label: { en: 'Reference 2 Address', am: 'የሁለተኛ ዋቢ አድራሻ', ti: 'ኣድራሻ ካልኣይ መወከሲ' } },
        { name: 'ref2_years_known', type: 'number', label: { en: 'Years Known', am: 'የሚተዋወቁበት ጊዜ (ዓመት)', ti: 'ዝተፈልለጥኩምሉ ዓመታት' } },
        { name: 'emergency_name', type: 'text', label: { en: 'Emergency Contact Name', am: 'የአደጋ ጊዜ ተጠሪ ስም', ti: 'ናይ ሓደጋ ጊዜ ተወካሲ' } },
        { name: 'emergency_phone', type: 'tel', label: { en: 'Emergency Contact Phone', am: 'የአደጋ ጊዜ ተጠሪ ስልክ', ti: 'ናይ ሓደጋ ጊዜ ስልክ' } },
        { name: 'emergency_relation', type: 'text', label: { en: 'Relationship', am: 'ግንኙነት', ti: 'ዝምድና' } },
        { name: 'emergency_address', type: 'text', label: { en: 'Emergency Contact Address', am: 'የአደጋ ጊዜ ተጠሪ አድራሻ', ti: 'ናይ ሓደጋ ጊዜ ኣድራሻ' } }
    ],
    // ... [Add the rest of your specificFields arrays here exactly as they were] ...
    // Note: I am abbreviating here for the chat response, but you should PASTE
    // the full 'specificFields' object from your original code here.
};

// 2. UI FUNCTIONS
function init() {
    // Build Service Grid
    const grid = document.getElementById('service-grid');
    grid.innerHTML = '';
    services.forEach(s => {
        const div = document.createElement('div');
        div.className = 'card';
        div.onclick = () => loadForm(s.id, div);
        div.innerHTML = `<span class="card-icon">${s.icon}</span><span class="card-title" data-sid="${s.id}">${s.labels[currentLang]}</span>`;
        grid.appendChild(div);
    });
}

function loadForm(serviceId, cardElem) {
    currentService = serviceId;
    
    // Highlight Card
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    cardElem.classList.add('active');

    // Show Form Container
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('dynamic-inputs').innerHTML = ''; // Clear old fields

    // 1. Add Common Fields
    renderFields(commonFields);

    // 2. Add Specific Fields
    if(specificFields[serviceId]) {
        // Add a divider
        const div = document.createElement('div');
        div.className = 'form-section-title';
        div.id = 'lbl-details';
        div.innerText = getLabel('details');
        document.getElementById('dynamic-inputs').appendChild(div);
        
        renderFields(specificFields[serviceId]);
    }

    // Scroll to form
    document.getElementById('form-container').scrollIntoView({ behavior: 'smooth' });
}

function renderFields(fieldList) {
    const container = document.getElementById('dynamic-inputs');
    
    fieldList.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';

        // Label
        const lbl = document.createElement('label');
        lbl.innerText = field.label[currentLang];
        lbl.dataset.en = field.label.en;
        lbl.dataset.am = field.label.am;
        lbl.dataset.ti = field.label.ti;
        group.appendChild(lbl);

        // Input
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
        input.required = true;
        group.appendChild(input);
        container.appendChild(group);
    });
}

// 3. LANGUAGE SWITCHER
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

    // Update Form Labels (if form is open)
    document.querySelectorAll('#dynamic-inputs label').forEach(lbl => {
        if(lbl.dataset[lang]) lbl.innerText = lbl.dataset[lang];
    });

    // Update Static Text
    const staticText = {
        en: { select: "Select Service", app: "Application", docs: "Documents", upload: "Upload ID / Documents", btn: "Submit Application" },
        am: { select: "አገልግሎት ይምረጡ", app: "ማመልከቻ", docs: "ሰነዶች", upload: "መታወቂያ/ሰነድ ያስገቡ", btn: "ማመልከቻውን ላክ" },
        ti: { select: "ኣገልግሎት ምረጹ", app: "መመልከቲ", docs: "ሰነዳት", upload: "መታወቒ/ሰነድ ኣእትዉ", btn: "መመልከቲ ስደዱ" }
    };

    if(document.getElementById('select-title')) document.getElementById('select-title').innerText = staticText[lang].select;
    if(document.getElementById('form-header-title')) document.getElementById('form-header-title').innerText = staticText[lang].app;
    if(document.getElementById('lbl-docs')) document.getElementById('lbl-docs').innerText = staticText[lang].docs;
    if(document.getElementById('lbl-upload')) document.getElementById('lbl-upload').innerText = staticText[lang].upload;
    if(document.getElementById('btn-submit')) document.getElementById('btn-submit').innerText = staticText[lang].btn;
};

function getLabel(key) {
    const dict = {
        details: { en: "Service Details", am: "ዝርዝር መረጃ", ti: "ዝርዝር ሓበሬታ" }
    };
    return dict[key] ? dict[key][currentLang] : "";
}

// Helper for file count
window.updateFileCount = function() {
    const input = document.getElementById('file-input');
    const count = input.files.length;
    document.getElementById('file-count').innerText = count > 0 ? `${count} file(s) selected` : "No files selected";
}

// Run on load
init();
