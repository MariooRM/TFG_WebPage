import { defineStore } from "pinia";
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

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
                console.error("Error during login:", error);
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
        }
    }
});
