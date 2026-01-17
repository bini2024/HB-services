// state.js

// 1. The State Object
export const state = {
    currentLang: 'en',
    currentService: null,
    formData: {} 
};

// 2. Subscribers (Functions waiting for updates)
const listeners = [];

/**
 * Update the current service and notify listeners
 * @param {string} id - The service ID (e.g., 'passport_renewal')
 */
export function setService(id) {
    if (state.currentService === id) return;
    
    // Optional: Clear old form data when switching services
    // Comment this out if you want to keep data across services
    resetForm(); 

    state.currentService = id;
    notifyListeners();
}

/**
 * Update the language and notify listeners
 * @param {string} lang - 'en', 'am', or 'ti'
 */
export function setLanguage(lang) {
    const validLangs = ['en', 'am', 'ti'];
    if (!validLangs.includes(lang)) {
        console.warn(`Attempted to set invalid language: ${lang}`);
        return;
    }
    
    if (state.currentLang === lang) return;
    
    state.currentLang = lang;
    
    // Save preference to localStorage
    localStorage.setItem('hb_pref_lang', lang);
    
    notifyListeners();
}

/**
 * Update a specific field in the form data
 * @param {string} key - The input ID (e.g., 'full_name')
 * @param {string|number} value - The user's input
 */
export function updateFormInput(key, value) {
    state.formData[key] = value;
    // We do NOT notify listeners here to prevent performance lag while typing
}

/**
 * Clear form data
 */
export function resetForm() {
    state.formData = {};
    // We do not notify here because usually a setService() call follows immediately
}

/**
 * Subscribe to state changes.
 * @param {Function} callback 
 */
export function subscribe(callback) {
    listeners.push(callback);
}

// Internal function to trigger updates
function notifyListeners() {
    console.log('State Updated:', state);
    listeners.forEach(listener => listener(state));
}

// Initialize logic (Check if user has a saved language)
const savedLang = localStorage.getItem('hb_pref_lang');
if (savedLang) {
    state.currentLang = savedLang;
}
