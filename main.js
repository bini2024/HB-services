// main.js
import { db, storage, collection, addDoc, serverTimestamp, ref, uploadBytes, getDownloadURL } from './firebase-setup.js';
import { state, setLanguage, subscribe } from './state.js';
import { specificFields } from './config.js';
import { createToastContainer, showToast, renderGrid, updateFileCount, updateLanguageUI, renderFields, addRepeaterRow, showReviewModal, loadForm } from './ui.js';

// --- CONSTANTS ---
const ENGLISH_REGEX = /^[A-Za-z0-9\s.,'()\-#\/]*$/; 

// --- MAKE FUNCTIONS PUBLIC (Fixes "showSection is not defined") ---
window.showSection = function(sectionName) {
    // Hide everything first
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('services-section').classList.add('hidden');
    document.getElementById('instructions-section').classList.add('hidden');
    document.getElementById('form-container').classList.add('hidden');

    // Show the requested section
    if (sectionName === 'services') {
        document.getElementById('services-section').classList.remove('hidden');
        renderGrid(); // Ensure grid is rendered
    } else if (sectionName === 'instructions') {
        document.getElementById('instructions-section').classList.remove('hidden');
    }
};

window.goHome = function() {
    // Hide inner pages
    document.getElementById('services-section').classList.add('hidden');
    document.getElementById('instructions-section').classList.add('hidden');
    document.getElementById('form-container').classList.add('hidden');
    
    // Show Main Menu
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('hero-section').classList.remove('hidden');
    window.scrollTo(0,0);
};

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    createToastContainer();
    
    // 1. Subscribe to State Changes
    subscribe((newState) => {
        updateLanguageUI(newState.currentLang);
    });

    // 2. File Upload Listener
    const uploadBox = document.getElementById('upload-box-trigger');
    const fileInput = document.getElementById('file-input');
    if(uploadBox && fileInput) {
        uploadBox.setAttribute('tabindex', '0');
        uploadBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });
        uploadBox.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', updateFileCount);
    }

    // 3. Submit Button Listener
    const form = document.getElementById('main-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if(!validateForm()) {
                showToast("Please check errors in the form.", "error");
                return;
            }

            const formData = collectFormData(); 

            showReviewModal(formData, () => {
                submitToFirebase(); 
            });
        });
        
        // Auto-save draft
        let debounceTimer;
        form.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                saveDraft();
            }, 1000);
        });
    }

    // 4. Language Buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.dataset.lang;
            setLanguage(lang); 
        });
    });
});

// --- HELPER: COLLECT DATA ---
function collectFormData() {
    const form = document.getElementById('main-form');
    let data = {};
    
    const standardInputs = form.querySelectorAll(':not(.repeater-row) > .input-group > input, :not(.repeater-row) > .input-group > select, :not(.repeater-row) > .input-group > textarea');
    standardInputs.forEach(input => {
         if(input.name && input.type !== 'submit' && input.type !== 'file') {
             if(input.type === 'checkbox') {
                 if(document.querySelectorAll(`[name="${input.name}"]`).length > 1) {
                     if(!data[input.name]) data[input.name] = [];
                     if(input.checked) data[input.name].push(input.value);
                 } else {
                     data[input.name] = input.checked ? "Yes" : "No"; 
                 }
             } else {
                 data[input.name] = input.value;
             }
         }
    });

    const repeaters = form.querySelectorAll('.repeater-box');
    repeaters.forEach(box => {
        const sectionName = box.id.replace('repeater-', '');
        const rows = box.querySelectorAll('.repeater-row');
        if(rows.length > 0) {
            data[sectionName] = `${rows.length} Entries Provided`;
        }
    });
    
    return { 
        service: state.currentService,
        language: state.currentLang,
        data: data 
    };
}

// --- HELPER: SUBMIT TO FIREBASE ---
async function submitToFirebase() {
    if (!db) {
        alert("CRITICAL ERROR: Firebase is not connected.");
        return;
    }

    const form = document.getElementById('main-form');

    try {
        const fileInput = document.getElementById('file-input');
        const uploadedFileUrls = [];
        
        if (fileInput && fileInput.files.length > 0) {
            showToast("Uploading files...", "success"); 
            for (const file of fileInput.files) {
                const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedFileUrls.push({ name: file.name, url: downloadURL, type: file.type });
            }
        }

        let finalData = {
            service: state.currentService,
            status: 'new',
            submittedAt: serverTimestamp(),
            language: state.currentLang,
            documents: uploadedFileUrls,
            data: {}
        };

        const standardInputs = form.querySelectorAll(':not(.repeater-row) > .input-group > input, :not(.repeater-row) > .input-group > select, :not(.repeater-row) > .input-group > textarea');
        standardInputs.forEach(input => {
             if(input.name && input.type !== 'submit' && input.type !== 'file') {
                 if(input.type === 'checkbox') {
                     if(document.querySelectorAll(`[name="${input.name}"]`).length > 1) {
                         if(!finalData.data[input.name]) finalData.data[input.name] = [];
                         if(input.checked) finalData.data[input.name].push(input.value);
                     } else {
                         finalData.data[input.name] = input.checked; 
                     }
                 } else {
                     finalData.data[input.name] = input.value;
                 }
             }
        });

        const repeaters = form.querySelectorAll('.repeater-box');
        repeaters.forEach(box => {
            const sectionName = box.id.replace('repeater-', ''); 
            const rows = box.querySelectorAll('.repeater-row');
            const rowData = [];
            rows.forEach(row => {
                const rowObj = {};
                row.querySelectorAll('input, select, textarea').forEach(input => {
                    if(input.name) rowObj[input.name] = input.value;
                });
                rowData.push(rowObj);
            });
            finalData.data[sectionName] = rowData;
        });

        const docRef = await addDoc(collection(db, "submissions"), finalData);
        
        localStorage.removeItem(`draft_${state.currentService}`);
        
        alert(`✅ APPLICATION SUBMITTED!\n\nTracking ID: ${docRef.id}`);
        location.reload();

    } catch(err) {
        console.error("Submission Error:", err);
        showToast("Error: " + err.message, "error");
    }
}

// --- HELPER: VALIDATION ---
function validateForm() {
    let isValid = true;
    let firstError = null;
    const inputs = document.querySelectorAll('#dynamic-inputs input, #dynamic-inputs select, #dynamic-inputs textarea');
    
    inputs.forEach(input => {
        input.classList.remove('error');
        if(input.hasAttribute('required')) {
            if(input.type === 'checkbox') {
                if(!input.checked) {
                    input.classList.add('error');
                    isValid = false;
                    if(!firstError) firstError = input;
                }
            } else if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
                if(!firstError) firstError = input;
            }
        }
        if ((input.type === 'text' || input.tagName === 'TEXTAREA') && input.value.trim()) {
            if (!ENGLISH_REGEX.test(input.value)) {
                input.classList.add('error');
                showToast("Please use English letters only.", "error");
                isValid = false;
                if(!firstError) firstError = input;
            }
        }
    });

    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }
    return isValid;
}

// --- DRAFT LOGIC ---
export function saveDraft() {
    if(!state.currentService) return;
    const form = document.getElementById('main-form');
    const data = {};
    
    const inputs = form.querySelectorAll(':not(.repeater-row) > .input-group input, :not(.repeater-row) > .input-group select, :not(.repeater-row) > .input-group textarea');
    inputs.forEach(el => {
        if(!el.name || el.type === 'submit' || el.type === 'file') return;
        if(el.type === 'checkbox') {
             if(document.querySelectorAll(`[name="${el.name}"]`).length > 1) {
                 if(!data[el.name]) data[el.name] = [];
                 if(el.checked) data[el.name].push(el.value);
             } else {
                 data[el.name] = el.checked; 
             }
        } else {
            data[el.name] = el.value;
        }
    });

    const repeaters = form.querySelectorAll('.repeater-box');
    repeaters.forEach(box => {
        const key = box.id.replace('repeater-', '');
        const rows = box.querySelectorAll('.repeater-row');
        const rowData = [];
        rows.forEach(row => {
            const rowObj = {};
            row.querySelectorAll('input, select, textarea').forEach(input => {
                if(input.name) rowObj[input.name] = input.value;
            });
            rowData.push(rowObj);
        });
        data[key] = rowData;
    });

    localStorage.setItem(`draft_${state.currentService}`, JSON.stringify(data));
}

export function restoreDraft(serviceId) {
    const saved = localStorage.getItem(`draft_${serviceId}`);
    if(!saved) return;
    try {
        const data = JSON.parse(saved);
        const form = document.getElementById('main-form');
        
        Object.keys(data).forEach(key => {
            if(Array.isArray(data[key])) {
                const rowsData = data[key];
                const repeaterBox = document.getElementById(`repeater-${key}`);
                if(repeaterBox) {
                    repeaterBox.innerHTML = ''; 
                    const serviceConfig = specificFields[serviceId];
                    const repeaterConfig = serviceConfig.find(f => f.name === key);
                    if(repeaterConfig) {
                        rowsData.forEach(rowData => {
                            addRepeaterRow(repeaterBox, repeaterConfig.fields);
                            const lastRow = repeaterBox.lastElementChild;
                            Object.keys(rowData).forEach(subKey => {
                                const el = lastRow.querySelector(`[name="${subKey}"]`);
                                if(el) el.value = rowData[subKey];
                            });
                        });
                    }
                }
            } else {
                const el = form.querySelector(`[name="${key}"]`);
                if(el && !el.closest('.repeater-row')) {
                   if(el.type === 'checkbox') {
                       el.checked = data[key];
                   } else {
                       el.value = data[key];
                   }
                }
            }
        });
        showToast("Draft Restored", "success");
    } catch(e) {
        console.error("Draft restore error", e);
    }
}
