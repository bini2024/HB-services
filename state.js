// state.js
export const state = {
    currentLang: 'en',
    currentService: ''
};

export function setService(id) {
    state.currentService = id;
}

export function setLanguage(lang) {
    state.currentLang = lang;
}
