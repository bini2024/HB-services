// ui.js
import { state, setLanguage, setService } from './state.js';
// We assume you have a config.js with your service list. If not, I can provide it.
import { services, specificFields } from './config.js'; 

// --- TOAST NOTIFICATIONS ---
export function createToastContainer() {
    if (document.getElementById('toast-container')) return;
    
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'toast-container'; // Ensure class matches CSS
    document.body.appendChild(div);
}

export function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

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
    
    // Animation: Slide In
    requestAnimationFrame(() => {
        setTimeout(() => toast.classList.add('show'), 10);
    });

    // Auto Remove: 4 Seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400); // Wait for slide-out animation
    }, 4000);
}

// --- GRID RENDERER (For the Services Page) ---
export function renderGrid() {
    const grid = document.getElementById('service-grid');
    if(!grid) return;
    
    grid.innerHTML = ''; // Clear loading spinner
    
    if (!services || services.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No services available.</p>';
        return;
    }

    services.forEach(s => {
        const div = document.createElement('div');
        div.className = 'card';
        div.setAttribute('tabindex', '0');
        div.setAttribute('role', 'button');
        
        // CLICK ACTION
        const activate = () => {
            // Show Instruction Modal before loading form
            showInstructionModal(() => {
                loadForm(s.id, div);
            });
        };

        div.onclick = activate;
        div.onkeydown = (e) => { if(e.key === 'Enter') activate(); };

        div.innerHTML = `
            <span class="card-icon">${s.icon}</span>
            <span class="card-title" data-sid="${s.id}">${s.labels[state.currentLang]}</span>
        `;
        grid.appendChild(div);
    });
}

// --- FORM LOADER ---
export function loadForm(serviceId, cardElem) {
    setService(serviceId);

    // 1. Hide All Other Sections (Critical for new Menu Layout)
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('services-section').classList.add('hidden');
    document.getElementById('instructions-section').classList.add('hidden');

    // 2. Show Form
    const formContainer = document.getElementById('form-container');
    const dynamicInputs = document.getElementById('dynamic-inputs');
    formContainer.classList.remove('hidden');
    
    // Scroll to top for mobile users
    window.scrollTo(0, 0);

    // 3. Render Fields
    dynamicInputs.innerHTML = ''; 
    
    // Add "Service Details" Header
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'form-section-title';
    sectionTitle.innerText = getLabel('details');
    dynamicInputs.appendChild(sectionTitle);

    // Render Specific Questions
    if(specificFields[serviceId]) {
        renderFields(specificFields[serviceId]);
    } else {
        dynamicInputs.innerHTML += '<p>Form configuration not found.</p>';
    }
}

// --- FIELD RENDERER ---
export function renderFields(fieldList, parentElement = null) {
    const container = parentElement || document.getElementById('dynamic-inputs');
    
    fieldList.forEach((field) => {
        const group = document.createElement('div');
        group.className = 'input-group';
        
        const uniqueId = field.id || `field_${field.name}_${Math.random().toString(36).substr(2, 9)}`;

        // 1. Label
        if (field.label) {
            const lbl = document.createElement('label');
            const langLabel = field.label[state.currentLang] || field.label.en;
            lbl.innerText = langLabel;
            
            // Store translations for live switching
            lbl.dataset.en = field.label.en;
            lbl.dataset.am = field.label.am;
            lbl.dataset.ti = field.label.ti;
            lbl.setAttribute('for', uniqueId);
            group.appendChild(lbl);
        }

        // 2. Input Types
        let input;

        // Type: SELECT
        if (field.type === 'select') {
            input = document.createElement('select');
            input.name = field.name;
            input.id = uniqueId;
            if(field.required) input.required = true;
            
            const def = document.createElement('option');
            def.value = ""; 
            def.innerText = "Select... / ምረጡ...";
            input.appendChild(def);
            
            field.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt; 
                o.innerText = opt;
                input.appendChild(o);
            });
        } 
        // Type: TEXTAREA
        else if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 4;
            input.name = field.name;
            input.id = uniqueId;
            if(field.required) input.required = true;
        } 
        // Type: STANDARD INPUT (text, date, number, tel)
        else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = uniqueId;
            if(field.required) input.required = true;
        }

        // Placeholder logic
        if(field.placeholder) {
            input.placeholder = field.placeholder[state.currentLang] || "";
        }
        
        group.appendChild(input);
        container.appendChild(group);
    });
}

// --- LANGUAGE SWITCHER UI ---
export function updateLanguageUI(lang) {
    setLanguage(lang); // Update State

    // Highlight active button
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
    });

    // Update Service Card Titles
    document.querySelectorAll('.card-title').forEach(el => {
        const sid = el.dataset.sid;
        const service = services.find(s => s.id === sid);
        if(service) el.innerText = service.labels[lang];
    });

    // Update Form Labels
    document.querySelectorAll('label').forEach(lbl => {
        if(lbl.dataset[lang]) lbl.innerText = lbl.dataset[lang];
    });
    
    // Static Text Replacements
    const texts = {
        en: { 
            heroT: "Welcome to HB Services", 
            heroS: "How can we help you today?", 
            startT: "Start Application", startD: "Passport, Visa, Citizenship",
            statusT: "Check Status", statusD: "Track your file",
            docsT: "Documents & Info", docsD: "Requirements & Guides",
            select: "Select Service", app: "Application", docs: "Documents", upload: "Upload ID / Documents", btn: "Submit Application" 
        },
        am: { 
            heroT: "ወደ HB ሰርቪስ እንኳን በደህና መጡ", 
            heroS: "ዛሬ ምን ልንርዳዎ?", 
            startT: "አዲስ ማመልከቻ", startD: "ፓስፖርት ፣ ቪዛ ፣ ዜግነት",
            statusT: "ሁኔታውን ይፈትሹ", statusD: "የፋይልዎን ሁኔታ ይከታተሉ",
            docsT: "መረጃ እና ሰነዶች", docsD: "መስፈርቶች እና መመሪያዎች",
            select: "አገልግሎት ይምረጡ", app: "ማመልከቻ", docs: "ሰነዶች", upload: "መታወቂያ/ሰነድ ያስገቡ", btn: "ማመልከቻውን ላክ" 
        },
        ti: { 
            heroT: "እንቋዕ ናብ HB ሰርቪስ ብሰላም መጻእኩም", 
            heroS: "ሎሚ ብመንገዲ እንታይ ክንሕግዘኩም?", 
            startT: "ሓድሽ አፕሊኬሽን", startD: "ፓስፖርት ፣ ቪዛ ፣ ዜግነት",
            statusT: "ኩነታት ቼክ ግበር", statusD: "ናይ ፋይልኩም ኩነታት ተኸታተሉ",
            docsT: "ሓበሬታን ሰነዳትን", docsD: "ቅድመ ኩነትን መምርሒን",
            select: "ኣገልግሎት ምረጹ", app: "መመልከቲ", docs: "ሰነዳት", upload: "መታወቒ/ሰነድ ኣእትዉ", btn: "መመልከቲ ስደዱ" 
        }
    };
    
    const t = texts[lang];
    if(t) {
        setText('hero-title', t.heroT);
        setText('hero-subtitle', t.heroS);
        
        // Menu Buttons
        setText('menu-start-title', t.startT); setText('menu-start-desc', t.startD);
        setText('menu-status-title', t.statusT); setText('menu-status-desc', t.statusD);
        setText('menu-docs-title', t.docsT); setText('menu-docs-desc', t.docsD);

        setText('select-title', t.select);
        setText('form-header-title', t.app);
        setText('lbl-docs', t.docs);
        setText('lbl-upload', t.upload);
        setText('btn-submit', t.btn);
    }
}

// --- HELPER: Safely Set Text ---
function setText(id, text) {
    const el = document.getElementById(id);
    if(el) el.innerText = text;
}

// --- HELPER: Get Section Title ---
function getLabel(key) {
    const dict = { details: { en: "Service Details", am: "ዝርዝር መረጃ", ti: "ዝርዝር ሓበሬታ" } };
    return dict[key] ? dict[key][state.currentLang] : "";
}

// --- INSTRUCTION MODAL ---
export function showInstructionModal(onConfirm) {
    const modal = document.getElementById('instructions-section'); // We reuse the section or modal logic
    // NOTE: In your HTML, you don't have a modal div for instructions yet, 
    // but you DO have <div id="instructions-section">. 
    // Since the flow is Click Service -> Show Modal -> Show Form, let's inject a modal dynamically.
    
    // Create Modal if not exists
    let modalOverlay = document.getElementById('dynamic-instr-modal');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'dynamic-instr-modal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-card">
                <h3>⚠️ Important / አስፈላጊ</h3>
                <div class="modal-body" style="text-align:left;">
                    <ul>
                        <li>Use <strong>English Letters</strong> only.<br><small>የእንግሊዝኛ ፊደላት ብቻ ይጠቀሙ።</small></li>
                        <li>Scan documents clearly.<br><small>ሰነዶችን በጥራት ይስቀሉ።</small></li>
                    </ul>
                </div>
                <button id="btn-modal-confirm" class="btn-submit">I Understand / ተረዲኡኒ ኣሎ</button>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }
    
    // Show it
    modalOverlay.classList.remove('hidden');
    modalOverlay.style.display = 'flex'; // Force flex

    // Handle Click
    const btn = modalOverlay.querySelector('#btn-modal-confirm');
    btn.onclick = () => {
        modalOverlay.style.display = 'none';
        if (onConfirm) onConfirm();
    };
}

// --- MISSING REPEATER FUNCTION ---
export function addRepeaterRow(container, fields) {
    const row = document.createElement('div');
    row.className = 'repeater-row';
    
    // Use the existing renderFields function to fill this row
    renderFields(fields, row);
    
    const delBtn = document.createElement('button');
    delBtn.innerText = "Remove / አጥፋ";
    delBtn.className = 'btn-danger small';
    delBtn.type = 'button';
    delBtn.style.marginTop = "10px";
    delBtn.onclick = () => {
        // Confirmation before deleting data
        if(row.querySelector('input').value !== "") {
            if(confirm("Remove this entry?")) row.remove();
        } else {
            row.remove();
        }
    };
    
    row.appendChild(delBtn);
    container.appendChild(row);
}
