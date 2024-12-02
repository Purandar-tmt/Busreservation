// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAG4IJNT49L95Qa-v1FzFSnY6pvq2L4Yvw",
  authDomain: "busreservationsystem-a4061.firebaseapp.com",
  projectId: "busreservationsystem-a4061",
  storageBucket: "busreservationsystem-a4061.firebasestorage.app",
  messagingSenderId: "633210113091",
  appId: "1:633210113091:web:49ac81909e752ee656d8f6",
  measurementId: "G-RRC5PB26LQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
