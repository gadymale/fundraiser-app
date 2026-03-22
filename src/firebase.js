import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 Firebase config (copy from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyC-0RFcEH22VF1Yot9I6AVoI_pifcnxskE",
  authDomain: "fundraiser-app-cee68.firebaseapp.com",
  projectId: "fundraiser-app-cee68",
  storageBucket: "fundraiser-app-cee68.firebasestorage.app",
  messagingSenderId: "222753697654",
  appId: "1:222753697654:web:3ab16001a5558ff7b0d457"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 👉 This line CREATES your database connection
export const db = getFirestore(app);