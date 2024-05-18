import { defineStore } from "pinia";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, where, getDocs, query, Timestamp } from "firebase/firestore";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { router } from '@/router';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false
    }),

    actions: {
        async login(email, password) {
            const auth = getAuth();
            try {
                await signInWithEmailAndPassword(auth, email, password);
                const username = await this.getUsername(email);
                this.user = username;
                this.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(username));
                localStorage.setItem('isAuthenticated', JSON.stringify(true));
                return true; 
            } catch (error) {
                console.error("Error during login");
                return false; 
            }
        },

        async getUsername(email) {
            try {
                const db = getFirestore();
                const userCollection = collection(db, 'users');
                const usernameQuery = query(userCollection, where('email', '==', email));
                const usernameQuerySnapshot = await getDocs(usernameQuery);
                if (!usernameQuerySnapshot.empty) {
                    const userDoc = usernameQuerySnapshot.docs[0];
                    const username = userDoc.data().username;
                    return username;
                } else {
                    return null;
                } 
            } catch (error) {
                console.error("Error getting username:", error);
                throw error; 
            }
        },

        async logout() {
            const auth = getAuth();
            await signOut(auth); 
            this.user = null;
            this.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        },

        async register(name, surname, email, username, password) {
            const auth = getAuth();
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                const userData = {
                uid: user.uid, 
                name: name,
                surname: surname,
                email: email,
                username: username,
                createdAt: Timestamp.now()
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
                console.log("Email sent");
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
