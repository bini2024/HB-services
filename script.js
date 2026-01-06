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

// Paste your specificFields object here (using the one from previous steps)
const specificFields = {
    // ... [KEEP YOUR PREVIOUS specificFields DATA HERE] ...
    // For the sake of this code block, I will assume the object exists.
    // Ensure you copy the 'specificFields' object from our previous chat into this spot.
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
