import { defineStore } from "pinia";

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut, signInWithEmailAndPassword,
     setPersistence, browserLocalPersistence, updateEmail, updatePassword } from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { router } from '@/router';
import { useUserInfoStore } from './userInfo.store';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        userUID: localStorage.getItem('userUID') || null,
        isAuthenticated: localStorage.getItem('isAuthenticated') || false
    }),

    actions: {
        async initAuth() {
            const auth = getAuth();
            onAuthStateChanged(auth, user => {
                if (user) {
                    this.userUID = user.uid;
                    this.isAuthenticated = true;
                    localStorage.setItem('userUID', JSON.stringify(user.uid));
                    localStorage.setItem('isAuthenticated', JSON.stringify(true));
                } else {
                    this.userUID = null;
                    this.isAuthenticated = false;
                    localStorage.removeItem('userUID');
                    localStorage.removeItem('isAuthenticated');
                }
            });
        },

        async login(email, password) {
            const auth = getAuth();
            const userInfoStore = useUserInfoStore();
            try {
                // Configurar persistencia antes de iniciar sesión
                await setPersistence(auth, browserLocalPersistence);

                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                this.userUID = userCredential.user.uid;
                this.isAuthenticated = true;
                await userInfoStore.getUserInfo(email);
                localStorage.setItem('userUID', JSON.stringify(userCredential.user.uid));
                localStorage.setItem('isAuthenticated', JSON.stringify(true));
                return true; 
            } catch (error) {
                console.error("Error during login:", error);
                return false; 
            }
        },

        async logout() {
            console.log("Logging out");
            const auth = getAuth();
            const userInfoStore = useUserInfoStore();
            await signOut(auth); 
            this.user = null;
            this.isAuthenticated = false;
            await userInfoStore.clearData();
            console.log(this.isAuthenticated)
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        },

        async register(name, surname, email, username, password) {
            const auth = getAuth();
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
                const userData = {
                name: name,
                surname: surname,
                email: email,
                username: username,
                createdAt: Timestamp.now(),
                profileImg: ''
                };
    
                return { userCredential, userData };
            } 
            catch (error) {
                console.log(error.message);
            }
        },

        async sendEmail(userCredential, userData, email) {
            console.log("Enviando email");
            const db = getFirestore();
            const user = userCredential.user;    
            try {
                // Email verification
                await sendEmailVerification(user);
                this.showToast('info', 'A verification email has been sent! Please, check your inbox');
                // Polling to check user verification status
                const intervalId = setInterval(async () => {
                    await user.reload();
                    if (user.emailVerified) {
                        clearInterval(intervalId); // Stop polling when user is verified
                        console.log("Verified");
    
                        // Create user document
                        const userRef = doc(db, "users", user.uid);
                        setDoc(userRef, userData);
                        this.showToast('info', 'Congratulations! Your account has been created');
                        setTimeout(() => {
                            router.push(`/auth/login?email=${encodeURIComponent(email)}`);
                        }, 2000);
                    }
                }, 5000); // Check every 5 secs
    
            } catch (error) {
                console.log(error.message);
            }
        },

        showToast (type, message)
        {
            toast(message, {
                "theme": "colored",
                "type": type,
                "autoClose": 2000,
                "dangerouslyHTMLString": true
                });
        }
        
    }
});
