// firebase-setup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, doc, getDoc, updateDoc, 
    serverTimestamp, query, orderBy, getDocs 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzlRJwD_dJ9qh22zipP5Ux77q7-9IT33I",
    authDomain: "hb-services-87372.firebaseapp.com",
    projectId: "hb-services-87372",
    storageBucket: "hb-services-87372.firebasestorage.app",
    messagingSenderId: "326833059312",
    appId: "1:326833059312:web:cee34d9ec63c4adfd21935"
};

let db, storage, auth;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    console.log("✅ Firebase Connected");
} catch (e) {
    console.error("❌ Connection Failed:", e);
}

export { 
    db, storage, auth, 
    collection, addDoc, doc, getDoc, updateDoc, getDocs, query, orderBy, serverTimestamp, 
    ref, uploadBytes, getDownloadURL,
    signInWithEmailAndPassword, signOut, onAuthStateChanged 
};
