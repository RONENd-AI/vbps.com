// We use the global `firebase` object loaded from the compat CDN links in index.html

const firebaseConfig = {
    apiKey: "AIzaSyBLRMgVuRAXcQGuMqOmLUcE20u1Fb-xwtY",
    authDomain: "vbps-24f24.firebaseapp.com",
    projectId: "vbps-24f24",
    storageBucket: "vbps-24f24.firebasestorage.app",
    messagingSenderId: "72563423890",
    appId: "1:72563423890:web:ab77c0f25b11c760ba044b",
    measurementId: "G-LXHNBFKVRD"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const authInstance = firebase.auth();
const db = firebase.firestore();

// Secondary App to cleanly create user accounts without dropping current authentication sessions
const secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
const authSecondary = secondaryApp.auth();