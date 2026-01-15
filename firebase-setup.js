// firebase-setup.js

// 1. Import from the official Google CDN (Version 10.8.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    doc,        // ADDED: Needed for Status Page
    getDoc,     // ADDED: Needed for Status Page
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// 2. Your Web App's Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzlRJwD_dJ9qh22zipP5Ux77q7-9IT33I",
    authDomain: "hb-services-87372.firebaseapp.com",
    projectId: "hb-services-87372",
    storageBucket: "hb-services-87372.firebasestorage.app",
    messagingSenderId: "326833059312",
    appId: "1:326833059312:web:cee34d9ec63c4adfd21935"
};

// 3. Initialize Firebase
let db, storage;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("✅ Firebase Connected Successfully");
} catch (e) {
    console.error("❌ Firebase Connection Failed:", e);
    alert("Database Connection Failed. Please check your internet connection.");
}

// 4. Export everything needed by main.js AND status.html
export { 
    db, 
    storage, 
    collection, 
    addDoc, 
    doc,            // Exporting this for status.html
    getDoc,         // Exporting this for status.html
    serverTimestamp, 
    ref, 
    uploadBytes, 
    getDownloadURL 
};
