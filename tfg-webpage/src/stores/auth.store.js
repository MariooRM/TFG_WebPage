import { defineStore } from "pinia";

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut, signInWithEmailAndPassword,
     setPersistence, browserLocalPersistence, updatePassword, EmailAuthProvider, sendPasswordResetEmail, 
     reauthenticateWithCredential, confirmPasswordReset, deleteUser} from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp, collection, deleteDoc, getDocs} from "firebase/firestore";

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { router } from '@/router';
import { useUserInfoStore } from './userInfo.store';
import { useStatsStore } from './stats.store';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        userUID: localStorage.getItem('userUID') || null,
        isAuthenticated: localStorage.getItem('isAuthenticated') || false
    }),

    actions: {
        /**
         * Initialize the authentication state of the user
         */
        async initAuth() {
            const auth = getAuth();
            onAuthStateChanged(auth, user => {
                if (user) {
                    this.userUID = user.uid;
                    this.isAuthenticated = true;
                    localStorage.setItem('userUID', user.uid);
                    localStorage.setItem('isAuthenticated', true);
                } else {
                    this.userUID = null;
                    this.isAuthenticated = false;
                    localStorage.removeItem('userUID');
                    localStorage.removeItem('isAuthenticated');
                }
            });
        },

        /**
         * Log in the user
         * @param {string} email 
         * @param {string} password 
         * @returns 
         */
        async login(email, password) {
            const auth = getAuth();
            const userInfoStore = useUserInfoStore();
            const statsStore = useStatsStore();
            try {
                try {
                    await setPersistence(auth, browserLocalPersistence);
                   
                  } catch (error) {
                    console.error(error);
                  }

                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                this.userUID = userCredential.user.uid;
                this.isAuthenticated = true;
                await userInfoStore.getUserInfo(email);
                statsStore.fetchUserGamesDocs(userCredential.user.uid);
                localStorage.setItem('userUID', JSON.stringify(userCredential.user.uid));
                localStorage.setItem('isAuthenticated', JSON.stringify(true));
                return true; 
            } catch (error) {
                console.error("Error during login:", error);
                return false; 
            }
        },

        /**
         * Log out the user
         */
        async logout() {
            console.log("Logging out");
            const auth = getAuth();
            const userInfoStore = useUserInfoStore();
            const statsStore = useStatsStore();
            await signOut(auth); 
            this.userUID = null;
            this.isAuthenticated = false;
            userInfoStore.clearData();
            statsStore.clearData();
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            router.push('/');
        },

        /**
         * Register a new user
         * @param {string} name 
         * @param {string} surname 
         * @param {string} email 
         * @param {string} username 
         * @param {string} password 
         * @returns 
         */
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

        /**
         * Send email verification and create user document when verified
         * @param {*} userCredential 
         * @param {*} userData 
         * @param {string} email 
         */
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

        /**
         * Check the current password of the user
         * @param {string} password 
         * @returns 
         */
        async checkCurrentPassword(password) {
            const auth = getAuth();
            const user = auth.currentUser;
        
            if (user) {
                const credential = EmailAuthProvider.credential(user.email, password);
                try {
                    await reauthenticateWithCredential(user, credential);
                    return ['', true];
                } catch (error) {
                    if (error.code === 'auth/invalid-credential') {
                        return ['Incorrect password. You have 6 total attempts', false];
                    } else if (error.code === 'auth/too-many-requests') {
                        return ['Too many attempts, please try again later', false];
                    }
                }
            } else {
                return ['No user is currently signed in.', false];
            }
        },

        /**
         * Change the user's password
         * @param {string} newPassword 
         * @returns 
         */
        async changePassword(newPassword) {
            const auth = getAuth();
            const user = auth.currentUser;
        
            if (user) {
                try {
                    await updatePassword(user, newPassword);
                    return true;
                } catch (error) {
                    return false;
                }
            } else {
                return false;
            }
        },

        /**
         * Send recovery email to the user
         * @param {string} email 
         * @returns 
         */
        async sendRecoveryEmail(email) {
            const auth = getAuth();
            try {
                await sendPasswordResetEmail(auth, email);
                return true;
            } catch (error) {
                console.error(error.message);
                return false;
            }
        },

        /**
         * Reset user's password
         * @param {string} actionCode 
         * @param {string} newPassword 
         * @returns 
         */
        async resetPassword(actionCode, newPassword) {
            try
            {
                const auth = getAuth();
                await confirmPasswordReset(auth, actionCode, newPassword);
                return true;
            }
            catch(error)
            {
                console.error(error);
                return false;
            }
            
        },

        /**
         * Delete user account
         * @param {string} email 
         * @param {string} password 
         */
        async deleteUserAccount(email, password)
        {
            const auth = getAuth();
            const userInfoStore = useUserInfoStore();
            const statsStore = useStatsStore();
            const db = getFirestore();
            const user = auth.currentUser;
            console.log(auth.currentUser);

            try
            {
                const credential = EmailAuthProvider.credential(email, password);

                if (credential)
                {
                    await reauthenticateWithCredential(user, credential);
                    const userRef = doc(db, "users", auth.currentUser.uid);
                    await deleteDoc(userRef);
                    await deleteUser(user);
                    //await this.deleteUserSubCollections(userUID);

                    userInfoStore.clearData();
                    statsStore.clearData();

                    localStorage.removeItem('user');
                    localStorage.removeItem('isAuthenticated');
                    this.showToast('info', 'Your account has been deleted');
                    setTimeout(() => {
                        router.push('/');
                    }, 2000);
                }
                else
                {
                    this.showToast('error', 'Incorrect credentials, please try again');
                }

            }
            catch(error)
            {
                this.showToast('error', 'Error while trying to delete your account');
                console.error(error);
            }
        },

        /**
         * Delete all the subcollections related to the user's document
         * @param {string} userId 
         */
        async deleteUserSubCollections(userId) {
            const db = getFirestore();
            const userRef = doc(db, 'users', userId);
            const subcollections = ['games'];

            for (const subcollection of subcollections) {
                const queryRef = collection(userRef.collection(subcollection));
                const snapshot = await getDocs(queryRef);

                // Eliminar todos los documentos de la subcolección
                snapshot.forEach(async doc => {
                    await deleteDoc(doc.ref);
                });
            }
        },
        
        /**
         * Show toast message
         * @param {string} type 
         * @param {string} message 
         */
        showToast (type, message)
        {
            toast(message, {
                "theme": "colored",
                "type": type,
                "autoClose": 1500,
                "dangerouslyHTMLString": true
                });
        }
        
    }
});
