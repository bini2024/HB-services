// main.js
import { db, storage, collection, addDoc, serverTimestamp, ref, uploadBytes, getDownloadURL } from './firebase-setup.js';
import { state, setLanguage, subscribe } from './state.js';
import { specificFields } from './config.js';
import { createToastContainer, showToast, renderGrid, updateFileCount, updateLanguageUI, renderFields, addRepeaterRow } from './ui.js';

// --- CONSTANTS ---
const ENGLISH_REGEX = /^[A-Za-z0-9\s.,'()-]*$/; // Allows letters, numbers, and basic punctuation

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    createToastContainer();
    renderGrid(); // Initial Render

    // 1. Subscribe to State Changes (This connects state.js to the UI)
    subscribe((newState) => {
        updateLanguageUI(newState.currentLang);
        // If you had other UI elements relying on state, you'd update them here too
    });

    // 2. File Upload Listener
    const uploadBox = document.getElementById('upload-box-trigger');
    const fileInput = document.getElementById('file-input');
    if(uploadBox && fileInput) {
        // Accessibility: allow "Enter" key to trigger upload
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
        form.addEventListener('submit', handleFormSubmit);
        
        // AUTO-SAVE DRAFT LOGIC
        // We listen to 'input' events on the whole form and save after user stops typing
        let debounceTimer;
        form.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                saveDraft();
            }, 1000); // Save 1 second after last keystroke
        });
    }

    // 4. Language Buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.dataset.lang;
            setLanguage(lang); // Update state, which triggers the subscriber above
        });
    });
    
    // 5. Back Button
    const backBtn = document.getElementById('back-btn');
    if(backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('form-container').classList.add('hidden');
            document.getElementById('service-grid').classList.remove('hidden');
            document.getElementById('select-title').classList.remove('hidden');
            document.getElementById('hero-section').classList.remove('hidden');
            window.scrollTo(0,0);
        });
    }
});

// --- LOGIC FUNCTIONS ---

async function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    const form = document.getElementById('main-form');
    
    if (!db) {
        alert("CRITICAL ERROR: Firebase is not connected. Check API Keys/Internet.");
        return;
    }

    // Validate
    if(!validateForm()) {
        showToast("Please check errors in the form.", "error");
        return;
    }

    const originalText = btn.innerText;
    btn.innerHTML = `<span class="spinner"></span> Generating ID...`;
    btn.disabled = true;

    try {
        // Upload Files
        const fileInput = document.getElementById('file-input');
        const uploadedFileUrls = [];
        if (fileInput && fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedFileUrls.push({ name: file.name, url: downloadURL, type: file.type });
            }
        }

        // Collect Data
        let formData = {
            service: state.currentService,
            status: 'new',
            submittedAt: serverTimestamp(),
            language: state.currentLang,
            documents: uploadedFileUrls,
            data: {}
        };

        // Standard Inputs
        const standardInputs = form.querySelectorAll(':not(.repeater-row) > .input-group > input, :not(.repeater-row) > .input-group > select, :not(.repeater-row) > .input-group > textarea');
        standardInputs.forEach(input => {
             if(input.name && input.type !== 'submit') {
                 formData.data[input.name] = input.value;
             }
        });

        // Repeater Inputs
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
            formData.data[sectionName] = rowData;
        });

        // Submit to Firebase
        const docRef = await addDoc(collection(db, "submissions"), formData);
        console.log("SUCCESS! ID:", docRef.id);
        
        // Clear Draft
        localStorage.removeItem(`draft_${state.currentService}`);
        
        showToast("Application submitted successfully!");
        
        setTimeout(() => {
            alert(`✅ APPLICATION SUCCESSFUL\n\nYour Tracking ID is:\n${docRef.id}\n\nPlease take a screenshot.`);
            location.reload();
        }, 500);

    } catch(err) {
        console.error("Submission Error:", err);
        showToast("Error: " + err.message, "error");
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

/**
 * Validates Required Fields AND English Characters
 */
function validateForm() {
    let isValid = true;
    let firstError = null;

    const inputs = document.querySelectorAll('#dynamic-inputs input, #dynamic-inputs select, #dynamic-inputs textarea');
    
    inputs.forEach(input => {
        // Reset previous errors
        input.classList.remove('error');
        
        // 1. Check Required
        if(input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('error');
            isValid = false;
            if(!firstError) firstError = input;
        }

        // 2. Check English Only (if it's a text input)
        // We skip type="date", type="email" (email has its own format), etc.
        if (input.type === 'text' || input.tagName === 'TEXTAREA') {
            if (input.value.trim() && !ENGLISH_REGEX.test(input.value)) {
                input.classList.add('error');
                showToast("Please use English letters only.", "error"); // Toast explanation
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
    
    // Standard inputs
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

    // Repeater inputs
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
    console.log("Draft Saved");
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
                   el.value = data[key];
                }
            }
        });
        showToast("Draft Restored", "success");
    } catch(e) {
        console.error("Draft restore error", e);
    }
}
