// ui.js
import { state, setLanguage, setService } from './state.js';
import { services, specificFields } from './config.js';
import { restoreDraft } from './main.js'; 

// --- TOAST NOTIFICATIONS ---
export function createToastContainer() {
    if (document.getElementById('toast-container')) return;
    
    const div = document.createElement('div');
    div.id = 'toast-container';
    document.body.appendChild(div);
}

export function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
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
    
    requestAnimationFrame(() => {
        setTimeout(() => toast.classList.add('show'), 10);
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// --- GRID RENDERER ---
export function renderGrid() {
    const grid = document.getElementById('service-grid');
    if(!grid) return;
    
    grid.innerHTML = '';
    
    if (!services || services.length === 0) {
        grid.innerHTML = '<p class="text-center">No services available.</p>';
        return;
    }

    services.forEach(s => {
        const div = document.createElement('div');
        div.className = 'card';
        div.setAttribute('tabindex', '0');
        div.setAttribute('role', 'button');
        div.setAttribute('aria-label', `Select ${s.labels.en}`);

        // CLICK ACTION: Show Instructions First -> Then Load Form
        const activate = () => {
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

    // UI Transitions
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    if(cardElem) cardElem.classList.add('active');

    const hero = document.getElementById('hero-section');
    const grid = document.getElementById('service-grid');
    const selectTitle = document.getElementById('select-title');
    const formContainer = document.getElementById('form-container');
    const dynamicInputs = document.getElementById('dynamic-inputs');

    if(hero) hero.classList.add('hidden');
    if(grid) grid.classList.add('hidden');
    if(selectTitle) selectTitle.classList.add('hidden');

    formContainer.classList.remove('hidden');
    window.scrollTo(0, 0);

    // Render Fields
    dynamicInputs.innerHTML = ''; 
    
    const div = document.createElement('div');
    div.className = 'form-section-title';
    div.innerText = getLabel('details');
    dynamicInputs.appendChild(div);

    if(specificFields[serviceId]) {
        renderFields(specificFields[serviceId]);
    } else {
        dynamicInputs.innerHTML = '<p>Form configuration not found.</p>';
    }

    restoreDraft(serviceId);
}

// --- FIELD RENDERER ---
export function renderFields(fieldList, parentElement = null) {
    const container = parentElement || document.getElementById('dynamic-inputs');
    
    fieldList.forEach((field) => {
        const group = document.createElement('div');
        group.className = 'input-group';
        
        const uniqueId = field.id || `field_${field.name}_${Math.random().toString(36).substr(2, 9)}`;

        // Label
        const lbl = document.createElement('label');
        if(field.label) {
            lbl.innerText = field.label[state.currentLang] || field.label.en;
            lbl.dataset.en = field.label.en;
            lbl.dataset.am = field.label.am;
            lbl.dataset.ti = field.label.ti;
            lbl.setAttribute('for', uniqueId);
        }
        group.appendChild(lbl);

        // Repeater
        if (field.type === 'repeater') {
            const repeaterBox = document.createElement('div');
            repeaterBox.className = 'repeater-box';
            repeaterBox.id = `repeater-${field.name}`;
            
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'btn-secondary small'; 
            addBtn.innerText = '+ Add Entry';
            addBtn.style.marginTop = "10px";
            addBtn.onclick = () => addRepeaterRow(repeaterBox, field.fields);
            
            addRepeaterRow(repeaterBox, field.fields);
            
            group.appendChild(repeaterBox);
            group.appendChild(addBtn);
            container.appendChild(group);
            return; 
        }

        // Input Types
        let input;

        if (field.type === 'checkbox_group') {
            input = document.createElement('div');
            field.options.forEach(opt => {
                const optLabel = document.createElement('label');
                optLabel.style.display = 'inline-flex'; 
                optLabel.style.alignItems = 'center';
                optLabel.style.marginRight = '15px';
                optLabel.style.fontWeight = 'normal';
                
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.name = field.name;
                cb.value = opt;
                cb.style.width = 'auto'; 
                cb.style.marginRight = '8px';

                optLabel.appendChild(cb);
                optLabel.appendChild(document.createTextNode(opt));
                input.appendChild(optLabel);
            });
        } 
        else if (field.type === 'checkbox') {
             input = document.createElement('div');
             const label = document.createElement('label');
             label.style.fontWeight = 'normal';
             label.style.display = 'flex';
             label.style.alignItems = 'center';

             const cb = document.createElement('input');
             cb.type = 'checkbox';
             cb.name = field.name;
             cb.value = "Yes";
             cb.id = uniqueId;
             cb.style.width = 'auto';
             cb.style.marginRight = '10px';
             if(field.required) cb.required = true;

             label.appendChild(cb);
             label.appendChild(document.createTextNode(field.label[state.currentLang] || field.label.en));
             
             if(group.querySelector('label')) group.querySelector('label').style.display = 'none';
             
             input.appendChild(label);
        } 
        else if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 4;
            input.name = field.name;
            input.id = uniqueId;
            if(field.required) input.required = true;
        } 
        else if (field.type === 'select') {
            input = document.createElement('select');
            input.name = field.name;
            input.id = uniqueId;
            if(field.required) input.required = true;
            
            const def = document.createElement('option');
            def.value = ""; 
            def.innerText = "Select...";
            input.appendChild(def);
            
            field.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt; o.innerText = opt;
                input.appendChild(o);
            });
        } 
        else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = uniqueId;
            if(field.required) input.required = true;
        }

        if(field.type !== 'checkbox' && field.type !== 'checkbox_group' && field.placeholder) {
            input.placeholder = field.placeholder[state.currentLang] || "";
        }
        
        group.appendChild(input);
        container.appendChild(group);
    });
}

// --- REPEATER ROW LOGIC ---
export function addRepeaterRow(container, fields) {
    const row = document.createElement('div');
    row.className = 'repeater-row';
    
    renderFields(fields, row);
    
    const delBtn = document.createElement('button');
    delBtn.innerText = "Remove / አጥፋ";
    delBtn.className = 'btn-danger small';
    delBtn.type = 'button';
    delBtn.style.marginTop = "10px";
    delBtn.onclick = () => {
        if(row.querySelector('input').value !== "") {
            if(confirm("Remove this entry?")) row.remove();
        } else {
            row.remove();
        }
    };
    
    row.appendChild(delBtn);
    container.appendChild(row);
}

export function updateFileCount() {
    const input = document.getElementById('file-input');
    const count = input.files.length;
    document.getElementById('file-count').innerText = count > 0 ? `${count} file(s) selected` : "No files selected";
}

// --- LANGUAGE SWITCHER ---
export function updateLanguageUI(lang) {
    setLanguage(lang);

    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
    });

    document.querySelectorAll('.card-title').forEach(el => {
        const sid = el.dataset.sid;
        const service = services.find(s => s.id === sid);
        if(service) el.innerText = service.labels[lang];
    });

    document.querySelectorAll('label').forEach(lbl => {
        if(lbl.dataset[lang]) lbl.innerText = lbl.dataset[lang];
    });
    
    const texts = {
        en: { heroT: "Welcome to HB Services", heroS: "Professional assistance for all your documentation needs.", select: "Select Service", app: "Application", docs: "Documents", upload: "Upload ID / Documents", btn: "Submit Application" },
        am: { heroT: "ወደ HB ሰርቪስ እንኳን በደህና መጡ", heroS: "ለሁሉም ዓይነት የሰነድ ጉዳዮችዎ ሙያዊ እገዛ እናደርጋለን።", select: "አገልግሎት ይምረጡ", app: "ማመልከቻ", docs: "ሰነዶች", upload: "መታወቂያ/ሰነድ ያስገቡ", btn: "ማመልከቻውን ላክ" },
        ti: { heroT: "እንቋዕ ናብ HB ሰርቪስ ብሰላም መጻእኩም", heroS: "ንኩሉ ዓይነት ናይ ዶኩመንት ጉዳያትኩም ሞያዊ ሓገዝ ንገብር።", select: "ኣገልግሎት ምረጹ", app: "መመልከቲ", docs: "ሰነዳት", upload: "መታወቒ/ሰነድ ኣእትዉ", btn: "መመልከቲ ስደዱ" }
    };
    
    const t = texts[lang];
    if(t) {
        setText('hero-title', t.heroT);
        setText('hero-subtitle', t.heroS);
        setText('select-title', t.select);
        setText('form-header-title', t.app);
        setText('lbl-docs', t.docs);
        setText('lbl-upload', t.upload);
        setText('btn-submit', t.btn);
    }
}

// --- HELPERS ---
function setText(id, text) {
    const el = document.getElementById(id);
    if(el) el.innerText = text;
}

function getLabel(key) {
    const dict = { details: { en: "Service Details", am: "ዝርዝር መረጃ", ti: "ዝርዝር ሓበሬታ" } };
    return dict[key] ? dict[key][state.currentLang] : "";
}

// --- NEW MODAL FUNCTIONS ---

export function showInstructionModal(onConfirm) {
    const modal = document.getElementById('instruction-modal');
    const btn = document.getElementById('btn-start-form');
    
    if(!modal) return; 
    modal.classList.remove('hidden');
    
    // Replace button to clear old listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.onclick = () => {
        modal.classList.add('hidden');
        if (onConfirm) onConfirm();
    };
}

export function showReviewModal(formData, onConfirm) {
    const modal = document.getElementById('review-modal');
    const content = document.getElementById('review-content');
    const btnConfirm = document.getElementById('btn-confirm-submit');
    const btnEdit = document.getElementById('btn-edit');

    if(!modal) return;

    // Generate HTML for review
    let html = '';
    for (const [key, value] of Object.entries(formData.data)) {
        if (typeof value !== 'object' && value) {
            const label = key.replace(/_/g, ' ').toUpperCase();
            html += `<div class="review-item">
                        <span class="review-label">${label}</span>
                        <span class="review-value">${value}</span>
                     </div>`;
        }
    }
    content.innerHTML = html;
    modal.classList.remove('hidden');

    // Edit Action
    btnEdit.onclick = () => {
        modal.classList.add('hidden');
    };

    // Confirm Action
    const newBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);
    
    newBtn.onclick = () => {
        newBtn.innerHTML = '<span class="spinner"></span> Submitting...';
        newBtn.disabled = true;
        
        onConfirm(); 
        modal.classList.add('hidden');
        
        setTimeout(() => {
            newBtn.innerHTML = 'Confirm & Submit / አረጋግጽ';
            newBtn.disabled = false;
        }, 3000);
    };
}
