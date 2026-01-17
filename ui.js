// ui.js
import { state, setLanguage, setService } from './state.js';
import { services, specificFields } from './config.js'; 

// --- TOAST NOTIFICATIONS ---
export function createToastContainer() {
    if (document.getElementById('toast-container')) return;
    
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'toast-container'; 
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

// --- GRID RENDERER (For the Services Page) ---
export function renderGrid() {
    const grid = document.getElementById('service-grid');
    if(!grid) return;
    
    grid.innerHTML = ''; 
    
    if (!services || services.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No services available.</p>';
        return;
    }

    services.forEach(s => {
        const div = document.createElement('div');
        div.className = 'card';
        div.setAttribute('tabindex', '0');
        div.setAttribute('role', 'button');
        
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

    // 1. Hide All Other Sections
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('services-section').classList.add('hidden');
    document.getElementById('instructions-section').classList.add('hidden');

    // 2. Show Form
    const formContainer = document.getElementById('form-container');
    const dynamicInputs = document.getElementById('dynamic-inputs');
    formContainer.classList.remove('hidden');
    
    window.scrollTo(0, 0);

    // 3. Render Fields
    dynamicInputs.innerHTML = ''; 
    
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'form-section-title';
    sectionTitle.innerText = getLabel('details');
    dynamicInputs.appendChild(sectionTitle);

    if(specificFields[serviceId]) {
        renderFields(specificFields[serviceId]);
    } else {
        dynamicInputs.innerHTML += '<p>Form configuration not found.</p>';
    }
}

// --- FIELD RENDERER ---
// ui.js - Updated renderFields

export function renderFields(fieldList, parentElement = null) {
    const container = parentElement || document.getElementById('dynamic-inputs');
    
    fieldList.forEach((field) => {
        const group = document.createElement('div');
        group.className = 'input-group';
        
        const uniqueId = field.id || `field_${field.name}_${Math.random().toString(36).substr(2, 9)}`;

        // Label
        if (field.label) {
            const lbl = document.createElement('label');
            const langLabel = field.label[state.currentLang] || field.label.en;
            lbl.innerText = langLabel;
            
            lbl.dataset.en = field.label.en;
            lbl.dataset.am = field.label.am;
            lbl.dataset.ti = field.label.ti;
            lbl.setAttribute('for', uniqueId);
            group.appendChild(lbl);
        }

        // Input Types
        let input;

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
        else if (field.type === 'checkbox_group') {
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
        else if (field.type === 'select') {
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
        else if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 4;
            input.name = field.name;
            input.id = uniqueId;
            if(field.required) input.required = true;
        } 
        else {
            // STANDARD INPUTS
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = uniqueId;
            if(field.required) input.required = true;

            // --- NEW: INPUT MASKING (Phone & SIN) ---
            if (field.name.includes('phone') || field.name.includes('contact')) {
                input.placeholder = "(555) 555-5555";
                input.maxLength = 14;
                input.addEventListener('input', (e) => {
                    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
                });
            }
            else if (field.name.includes('sin') || field.name.includes('social')) {
                input.placeholder = "999-999-999";
                input.maxLength = 11;
                input.addEventListener('input', (e) => {
                    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})/);
                    e.target.value = !x[2] ? x[1] : x[1] + '-' + x[2] + (x[3] ? '-' + x[3] : '');
                });
            }
        }

        if(field.type !== 'checkbox' && field.type !== 'checkbox_group' && field.placeholder) {
            input.placeholder = field.placeholder[state.currentLang] || "";
        }
        
        group.appendChild(input);
        container.appendChild(group);
    });
}
// --- LANGUAGE SWITCHER UI ---
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

function setText(id, text) {
    const el = document.getElementById(id);
    if(el) el.innerText = text;
}

function getLabel(key) {
    const dict = { details: { en: "Service Details", am: "ዝርዝር መረጃ", ti: "ዝርዝር ሓበሬታ" } };
    return dict[key] ? dict[key][state.currentLang] : "";
}

// --- MISSING FUNCTION RESTORED: UPDATE FILE COUNT ---
export function updateFileCount() {
    const input = document.getElementById('file-input');
    const list = document.getElementById('file-list-preview');
    const uploadText = document.getElementById('upload-text');
    
    if (!input || !list) return;
    
    list.innerHTML = ''; // Clear current list
    
    if (input.files.length > 0) {
        if(uploadText) uploadText.innerText = `${input.files.length} file(s) selected`;
        
        Array.from(input.files).forEach(file => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${file.name} <small>(${Math.round(file.size/1024)}KB)</small></span>
                <span style="color:var(--primary); font-weight:bold;">Ready</span>
            `;
            list.appendChild(li);
        });
    } else {
        if(uploadText) uploadText.innerText = "Click to Select Files (PDF, JPG)";
    }
}

// --- INSTRUCTION MODAL ---
export function showInstructionModal(onConfirm) {
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
    
    modalOverlay.classList.remove('hidden');
    modalOverlay.style.display = 'flex'; 

    const btn = modalOverlay.querySelector('#btn-modal-confirm');
    btn.onclick = () => {
        modalOverlay.style.display = 'none';
        if (onConfirm) onConfirm();
    };
}

// --- REVIEW MODAL ---
export function showReviewModal(formData, onConfirm) {
    let modal = document.getElementById('review-modal');
    
    if (!modal) {
        const div = document.createElement('div');
        div.id = 'review-modal';
        div.className = 'modal-overlay hidden';
        div.innerHTML = `
            <div class="modal-card wide">
                <h3>Review Your Application / ማመልከቻዎን ይገምግሙ</h3>
                <p class="sub-text">Please review your details below. Click "Edit" to make changes or "Confirm" to submit.</p>
                <div id="review-content" class="review-scroll-area"></div>
                <div class="modal-actions">
                    <button id="btn-edit" class="btn-secondary">← Edit / ኣስተኻኽል</button>
                    <button id="btn-confirm-submit" class="btn-submit">Confirm & Submit / አረጋግጽ</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);
        modal = div;
    }

    const content = document.getElementById('review-content');
    const btnConfirm = document.getElementById('btn-confirm-submit');
    const btnEdit = document.getElementById('btn-edit');

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
    modal.style.display = 'flex';

    btnEdit.onclick = () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    };

    const newBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);
    
    newBtn.onclick = () => {
        newBtn.innerHTML = '<span class="spinner">⏳</span> Submitting...';
        newBtn.disabled = true;
        
        onConfirm(); 
        
        modal.classList.add('hidden');
        modal.style.display = 'none';
        
        setTimeout(() => {
            newBtn.innerHTML = 'Confirm & Submit / አረጋግጽ';
            newBtn.disabled = false;
        }, 3000);
    };
}

// --- REPEATER ROW FUNCTION ---
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
