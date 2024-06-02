import { defineStore } from "pinia";

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut, signInWithEmailAndPassword,
     setPersistence, browserLocalPersistence, updatePassword, EmailAuthProvider, 
     reauthenticateWithCredential} from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";


import { router } from '@/router';
import { useUserInfoStore } from './userInfo.store';

export const useStatsStore = defineStore({
    id: 'auth',
    state: () => ({
        totalGames: /*localStorage.getItem('totalGames') || 5*/ 5,
    }),

    actions: {
        
        
    }
});
