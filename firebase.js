// Import and configure Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {

  apiKey: "AIzaSyBlDcn2xJTWTVftGEOptBOWLFlY4LaS-YQ",
  authDomain: "spellingbee-935f5.firebaseapp.com",
  projectId: "spellingbee-935f5",
  storageBucket: "spellingbee-935f5.appspot.com",
  messagingSenderId: "1037070024462",
  appId: "1:1037070024462:web:59fad718924cc57371a15f",



};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, query, where, getDocs, updateDoc, doc };
