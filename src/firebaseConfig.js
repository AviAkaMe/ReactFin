import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnvHWbvgM0SVhJVHUfZzfXkbZdpOjnCsU",
  authDomain: "react-fin.firebaseapp.com",
  projectId: "react-fin",
  storageBucket: "react-fin.firebasestorage.app",
  messagingSenderId: "346481815494",
  appId: "1:346481815494:web:d13372231a4526efb2ccc7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
