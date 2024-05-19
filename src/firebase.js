import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG83ji2fipiWJUnHmhzFpwsrfo12Q7oYo",
  authDomain: "react-notes-d449c.firebaseapp.com",
  projectId: "react-notes-d449c",
  storageBucket: "react-notes-d449c.appspot.com",
  messagingSenderId: "606866046642",
  appId: "1:606866046642:web:c491e0ac2ce51c10b453ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const noteCollection = collection(db, "notes")

