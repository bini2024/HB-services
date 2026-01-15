// ui.js
import { state, setLanguage, setService } from './state.js';
import { services, specificFields } from './config.js';
import { saveDraft, restoreDraft } from './main.js'; // We will import logic from main

export function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toast-container';
    document.body.appendChild(div);
}

export function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : '⚠️';
    const title = type === 'success' ? 'Success' : 'Attention';
    toast.innerHTML = `
        <div style="font-size: 1.5rem;">${icon}</div>
        <div><span class="toast-title">${title}</span><span class="toast-msg">${msg}</span></div>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

export function renderGrid() {
    const grid = document.getElementById('service-grid');
    if(!grid) return;
    grid.innerHTML = '';
    services.forEach(s => {
        const div = document.createElement('div');
        div.className = 'card';
        div.onclick = () => loadForm(s.id, div);
        div.innerHTML = `
            <span class="card-icon">${s.icon}</span>
            <span class="card-title" data-sid="${s.id}">${s.labels[state.currentLang]}</span>
        `;
        grid.appendChild(div);
    });
}

export function loadForm(serviceId, cardElem) {
    const header = document.querySelector('.form-header');
    if(header && !header.querySelector('.back-btn')) {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn-text back-btn';
        backBtn.innerText = '← Back / ተመለስ';
        backBtn.style.marginRight = 'auto';
        backBtn.style.cursor = 'pointer';
        backBtn.style.fontWeight = 'bold';
        backBtn.onclick = () => {
            document.getElementById('form-container').style.display = 'none';
            document.getElementById('service-grid').style.display = 'grid';
            const hero = document.getElementById('hero-section');
            if(hero) hero.style.display = 'block';
            window.scrollTo(0, 0);
        };
        header.prepend(backBtn);
    }

    const hero = document.getElementById('hero-section');
    if(hero) hero.style.display = 'none';
    const grid = document.getElementById('service-grid');
    if(grid) grid.style.display = 'none';
    
    setService(serviceId); // Update state

    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    if(cardElem) cardElem.classList.add('active');

    const formContainer = document.getElementById('form-container');
    const dynamicInputs = document.getElementById('dynamic-inputs');
    formContainer.style.opacity = '0';
    
    setTimeout(() => {
        formContainer.style.display = 'block';
        dynamicInputs.innerHTML = ''; 
        if(specificFields[serviceId]) {
            const div = document.createElement('div');
            div.className = 'form-section-title';
            div.innerText = getLabel('details');
            dynamicInputs.appendChild(div);
            renderFields(specificFields[serviceId]);
        }
        restoreDraft(serviceId);
        formContainer.style.opacity = '1';
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
}

export function renderFields(fieldList, parentElement = null) {
    const container = parentElement || document.getElementById('dynamic-inputs');
    fieldList.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';
        const lbl = document.createElement('label');
        if(field.label) {
            lbl.innerText = field.label[state.currentLang] || field.label.en;
            lbl.dataset.en = field.label.en;
            lbl.dataset.am = field.label.am;
            lbl.dataset.ti = field.label.ti;
        }
        group.appendChild(lbl);

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
            addRepeaterRow(repeaterBox, field.fields);
            group.appendChild(repeaterBox);
            group.appendChild(addBtn);
            container.appendChild(group);
            return;
        }

        let input;
        if (field.type === 'checkbox_group') {
            input = document.createElement('div');
            field.options.forEach(opt => {
                const label = document.createElement('label');
                label.style.display = 'inline-block'; 
                label.style.marginRight = '15px';
                label.style.fontWeight = 'normal';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.name = field.name;
                cb.value = opt;
                cb.addEventListener('change', () => saveDraft());
                label.prepend(cb);
                label.appendChild(document.createTextNode(opt));
                input.appendChild(label);
            });
        } else if (field.type === 'checkbox') {
             input = document.createElement('div');
             const label = document.createElement('label');
             label.style.fontWeight = 'normal';
             const cb = document.createElement('input');
             cb.type = 'checkbox';
             cb.name = field.name;
             cb.value = "Yes";
             cb.required = field.required;
             cb.addEventListener('change', () => saveDraft());
             label.prepend(cb);
             label.appendChild(document.createTextNode(" " + (field.label[state.currentLang] || field.label.en)));
             if(group.querySelector('label')) group.querySelector('label').style.display = 'none';
             input.appendChild(label);
        } else if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
            input.name = field.name;
            if(field.required) input.required = true;
            input.addEventListener('input', () => saveDraft());
        } else if (field.type === 'select') {
            input = document.createElement('select');
            input.name = field.name;
            if(field.required) input.required = true;
            const def = document.createElement('option');
            def.value = ""; def.innerText = "Select...";
            input.appendChild(def);
            field.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt; o.innerText = opt;
                input.appendChild(o);
            });
            input.addEventListener('change', () => saveDraft());
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            if(field.required) input.required = true;
            input.addEventListener('input', () => saveDraft());
        }

        if(field.type !== 'checkbox' && field.placeholder) {
            input.placeholder = field.placeholder[state.currentLang] || "";
        }
        
        group.appendChild(input);
        container.appendChild(group);
    });
}

export function addRepeaterRow(container, fields) {
    const row = document.createElement('div');
    row.className = 'repeater-row';
    row.style.background = "#f9f9f9";
    row.style.padding = "15px";
    row.style.marginBottom = "15px";
    row.style.borderRadius = "8px";
    row.style.position = "relative";
    row.style.border = "1px solid #ddd";
    renderFields(fields, row);
    const delBtn = document.createElement('button');
    delBtn.innerText = "Remove / አጥፋ";
    delBtn.className = 'btn-danger small';
    delBtn.type = 'button';
    delBtn.style.marginTop = "10px";
    delBtn.onclick = () => row.remove();
    row.appendChild(delBtn);
    container.appendChild(row);
}

export function updateFileCount() {
    const input = document.getElementById('file-input');
    const count = input.files.length;
    document.getElementById('file-count').innerText = count > 0 ? `${count} file(s) selected` : "No files selected";
}

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
    
    // Update Static Texts
    const texts = {
        en: { heroT: "Welcome to HB Services", heroS: "Professional assistance for all your documentation needs.", select: "Select Service", app: "Application", docs: "Documents", upload: "Upload ID / Documents", btn: "Submit Application" },
        am: { heroT: "ወደ HB ሰርቪስ እንኳን በደህና መጡ", heroS: "ለሁሉም ዓይነት የሰነድ ጉዳዮችዎ ሙያዊ እገዛ እናደርጋለን።", select: "አገልግሎት ይምረጡ", app: "ማመልከቻ", docs: "ሰነዶች", upload: "መታወቂያ/ሰነድ ያስገቡ", btn: "ማመልከቻውን ላክ" },
        ti: { heroT: "እንቋዕ ናብ HB ሰርቪስ ብሰላም መጻእኩም", heroS: "ንኩሉ ዓይነት ናይ ዶኩመንት ጉዳያትኩም ሞያዊ ሓገዝ ንገብር።", select: "ኣገልግሎት ምረጹ", app: "መመልከቲ", docs: "ሰነዳት", upload: "መታወቒ/ሰነድ ኣእትዉ", btn: "መመልከቲ ስደዱ" }
    };
    const t = texts[lang];
    if(t) {
        if(document.getElementById('hero-title')) document.getElementById('hero-title').innerText = t.heroT;
        if(document.getElementById('hero-subtitle')) document.getElementById('hero-subtitle').innerText = t.heroS;
        if(document.getElementById('select-title')) document.getElementById('select-title').innerText = t.select;
        if(document.getElementById('form-header-title')) document.getElementById('form-header-title').innerText = t.app;
        if(document.getElementById('lbl-docs')) document.getElementById('lbl-docs').innerText = t.docs;
        if(document.getElementById('lbl-upload')) document.getElementById('lbl-upload').innerText = t.upload;
        if(document.getElementById('btn-submit')) document.getElementById('btn-submit').innerText = t.btn;
    }
}

function getLabel(key) {
    const dict = { details: { en: "Service Details", am: "ዝርዝር መረጃ", ti: "ዝርዝር ሓበሬታ" } };
    return dict[key] ? dict[key][state.currentLang] : "";
}
