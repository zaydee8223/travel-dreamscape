import * as $ from 'jquery';


import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./firebaseConfig";

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword } from "firebase/auth";

import { getFirestore, collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


//routing content

//home 
// KEEP GOING 
