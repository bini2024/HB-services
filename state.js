// state.js

// 1. The State Object (Private, so it can't be messed with directly)
const state = {
    currentLang: 'en',
    currentService: null,
    formData: {} // Store form answers here
};

// 2. Subscribers (Functions waiting for updates)
const listeners = [];

/**
 * Get a snapshot of the current state
 * @returns {Object} A copy of the state
 */
export function getState() {
    return { ...state }; // Return a copy to prevent direct mutation
}

/**
 * Update the current service and notify listeners
 * @param {string} id - The service ID (e.g., 'passport_renewal')
 */
export function setService(id) {
    if (state.currentService === id) return; // Don't update if nothing changed
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
    
    // Save preference to localStorage so it remembers next time
    localStorage.setItem('hb_pref_lang', lang);
    
    notifyListeners();
}

/**
 * Subscribe to state changes.
 * The callback function will run whenever state updates.
 * @param {Function} callback 
 */
export function subscribe(callback) {
    listeners.push(callback);
}

// Internal function to trigger updates
function notifyListeners() {
    console.log('State Updated:', state); // Helpful for debugging
    listeners.forEach(listener => listener(state));
}

// Initialize logic (Check if user has a saved language)
const savedLang = localStorage.getItem('hb_pref_lang');
if (savedLang) {
    state.currentLang = savedLang;
}
