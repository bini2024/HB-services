// state.js

// 1. The State Object (Changed to EXPORT so ui.js can see it)
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
