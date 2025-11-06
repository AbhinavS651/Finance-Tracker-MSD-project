// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDYMoTojFZcMpICFEfxXLuIl74DnEfhyE",
  authDomain: "finance-tracker-9d697.firebaseapp.com",
  projectId: "finance-tracker-9d697",
  storageBucket: "finance-tracker-9d697.appspot.com",
  messagingSenderId: "793233208221",
  appId: "1:793233208221:web:f350d60c1511b6e0163574",
  measurementId: "G-9MB4609X16",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
