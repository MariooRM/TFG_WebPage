import { defineStore } from "pinia";
import { getFirestore, doc, collection, where, getDocs, query, updateDoc } from "firebase/firestore";
import { useAuthStore } from "./auth.store";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

export const useUserInfoStore = defineStore({
    id: 'info',
    state: () => ({
        profileImg: localStorage.getItem('profileImg') || "../src/assets/images/Profile-icon.jpg",
        username: localStorage.getItem('username') || null,
        email: localStorage.getItem('email') || null,
        name: localStorage.getItem('name') || null,
        surname: localStorage.getItem('surname') || null,
    }),

    actions: {
        async getUserInfo(email) {
            try {
                const db = getFirestore();
                const userCollection = collection(db, 'users');
                const userQuery = query(userCollection, where('email', '==', email));
                const querySnapshot = await getDocs(userQuery);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    this.username = userDoc.data().username;
                    this.email = userDoc.data().email;
                    this.name = userDoc.data().name;
                    this.surname = userDoc.data().surname;
                    this.profileImg = userDoc.data().profileImg;
                } else {
                    this.username = null;
                    this.email = null;
                    this.name = null;
                    this.surname = null;
                    this.profileImg = "../src/assets/images/Profile-icon.jpg";
                }
        
                // Save user information to local storage
                localStorage.setItem('username', this.username);
                localStorage.setItem('email', this.email);
                localStorage.setItem('name', this.name);
                localStorage.setItem('surname', this.surname);
                localStorage.setItem('profileImg', JSON.stringify(this.profileImg));
            } catch (error) {
                console.error("Error getting user information:", error);
                throw error;
            }
        },

        async updateProfileImg(file) {
           

            const authStore = useAuthStore();
            const storage = getStorage();
            const userId = authStore.userUID;
            try {
                
                const storageRef = ref(storage, `profile_images/${userId}/profile.jpg`);
                await uploadBytes(storageRef, file);
                 console.log(userId);
                console.log("File uploaded successfully");
        
                const imageUrl = await getDownloadURL(storageRef); 
                const db = getFirestore();
                const userRef = doc(db, "users", userId);
                await updateDoc(userRef, { profileImg: imageUrl });
        
                // Update local storage
                this.profileImg = imageUrl;
                localStorage.setItem('profileImg', imageUrl);
            } catch (error) {
                console.error("Error updating profile image:", error);
                throw error;
            }
        },

        async clearData() {
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('name');
            localStorage.removeItem('surname');
            localStorage.removeItem('profileImg');
        }
    }
});
