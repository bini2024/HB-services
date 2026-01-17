// main.js
import { db, storage, collection, addDoc, serverTimestamp, ref, uploadBytes, getDownloadURL } from './firebase-setup.js';
import { state, setLanguage, subscribe } from './state.js';
import { specificFields } from './config.js';
import { createToastContainer, showToast, renderGrid, updateFileCount, updateLanguageUI, renderFields, addRepeaterRow, showReviewModal } from './ui.js';

// --- CONSTANTS ---
// FIXED: Added # and / to allow addresses like "Apt #101" or "1/2 Main St"
const ENGLISH_REGEX = /^[A-Za-z0-9\s.,'()\-#\/]*$/; 

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    createToastContainer();
    renderGrid(); // Initial Render

    // 1. Subscribe to State Changes (This connects state.js to the UI)
    subscribe((newState) => {
        updateLanguageUI(newState.currentLang);
    });

    // 2. File Upload Listener
    const uploadBox = document.getElementById('upload-box-trigger');
    const fileInput = document.getElementById('file-input');
    if(uploadBox && fileInput) {
        // Accessibility: allow "Enter" key to trigger upload
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
            
            // A. Validate first
            if(!validateForm()) {
                showToast("Please check errors in the form.", "error");
                return;
            }

            // B. Collect Data for Review
            const formData = collectFormData(); 

            // C. Show Review Modal
            showReviewModal(formData, () => {
                // D. Actually Submit to Firebase (Callback)
                submitToFirebase(); 
            });
        });
        
        // AUTO-SAVE DRAFT LOGIC
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
            setLanguage(lang); 
        });
    });
    
    // 5. Back Button
    const backBtn = document.getElementById('back-btn');
    if(backBtn) {
        backBtn.addEventListener('click', () => {
            // Hide Form
            document.getElementById('form-container').classList.add('hidden');
            
            // Show Home Elements
            document.getElementById('main-menu').classList.remove('hidden');
            document.getElementById('hero-section').classList.remove('hidden');
            document.getElementById('services-section').classList.add('hidden'); // Ensure services grid is hidden if we used menu
            
            // Reset Scroll
            window.scrollTo(0,0);
        });
    }
});

// --- HELPER: COLLECT DATA (For Review Modal) ---
function collectFormData() {
    const form = document.getElementById('main-form');
    let data = {};
    
    // 1. Standard Inputs
    const standardInputs = form.querySelectorAll(':not(.repeater-row) > .input-group > input, :not(.repeater-row) > .input-group > select, :not(.repeater-row) > .input-group > textarea');
    standardInputs.forEach(input => {
         if(input.name && input.type !== 'submit' && input.type !== 'file') {
             if(input.type === 'checkbox') {
                 // Checkbox logic
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

    // 2. Repeater Inputs
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

// --- HELPER: SUBMIT TO FIREBASE (The Real Submit) ---
async function submitToFirebase() {
    if (!db) {
        alert("CRITICAL ERROR: Firebase is not connected. Check API Keys/Internet.");
        return;
    }

    const form = document.getElementById('main-form');

    try {
        // 1. Upload Files first
        const fileInput = document.getElementById('file-input');
        const uploadedFileUrls = [];
        
        if (fileInput && fileInput.files.length > 0) {
            showToast("Uploading files...", "success"); // Feedback to user
            for (const file of fileInput.files) {
                const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedFileUrls.push({ name: file.name, url: downloadURL, type: file.type });
            }
        }

        // 2. Re-Collect Final Data Structure
        let finalData = {
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

        // Repeater Inputs (Full Data)
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

        // 3. Submit to Firestore
        const docRef = await addDoc(collection(db, "submissions"), finalData);
        console.log("SUCCESS! ID:", docRef.id);
        
        // 4. Cleanup
        localStorage.removeItem(`draft_${state.currentService}`);
        
        // Success Message
        alert(`✅ APPLICATION SUBMITTED!\n\nYour Tracking ID is:\n${docRef.id}\n\nPlease take a screenshot.`);
        location.reload();

    } catch(err) {
        console.error("Submission Error:", err);
        showToast("Error: " + err.message, "error");
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
        if(input.hasAttribute('required')) {
            // FIXED: Special check for checkboxes
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

        // 2. Check English Only (if it's a text input)
        // Skip validation for Emails and Dates
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
