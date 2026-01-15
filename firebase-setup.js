// firebase-setup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBzlRJwD_dJ9qh22zipP5Ux77q7-9IT33I",
  authDomain: "hb-services-87372.firebaseapp.com",
  projectId: "hb-services-87372",
  storageBucket: "hb-services-87372.firebasestorage.app",
  messagingSenderId: "326833059312",
  appId: "1:326833059312:web:cee34d9ec63c4adfd21935"
};

let db, storage;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase Connected Successfully");
} catch (e) {
    console.error("Firebase Connection Failed:", e);
}

export { db, storage, collection, addDoc, serverTimestamp, ref, uploadBytes, getDownloadURL };
