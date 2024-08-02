// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "Nunya Biznis",
  authDomain: "inventory-management-f80d6.firebaseapp.com",
  projectId: "inventory-management-f80d6",
  storageBucket: "inventory-management-f80d6.appspot.com",
  messagingSenderId: "463406184584",
  appId: "1:463406184584:web:df19cc85bfcbc7d0bd073d",
  measurementId: "G-B9J5N0MZHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

// Access firestore from othr files
export{firestore}