// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDr1T8ruMk6FcSmucWCsMd8ACCURaUXPZQ",
    authDomain: "mini-tienda-8784b.firebaseapp.com",
    projectId: "mini-tienda-8784b",
    storageBucket: "mini-tienda-8784b.firebasestorage.app",
    messagingSenderId: "982494425103",
    appId: "1:982494425103:web:e8aeab7b3786ab3e9f337a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)