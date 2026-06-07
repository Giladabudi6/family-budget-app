import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // חיבור למסד הנתונים

const firebaseConfig = {
  apiKey: "AIzaSyBd8UTgXWM5ZdqS2pFZVS8_2nopeB2TsO0",
  authDomain: "family-budget-1db01.firebaseapp.com",
  projectId: "family-budget-1db01",
  storageBucket: "family-budget-1db01.firebasestorage.app",
  messagingSenderId: "270159171640",
  appId: "1:270159171640:web:b93d4f4a4d3730ba1cd6cd",
  measurementId: "G-HJH8C3X302"
};

// אתחול של פיירבייס
const app = initializeApp(firebaseConfig);

// ייצוא של מסד הנתונים (db) כדי שקובץ האפליקציה יוכל להשתמש בו
export const db = getFirestore(app);