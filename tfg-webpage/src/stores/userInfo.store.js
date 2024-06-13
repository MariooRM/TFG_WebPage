import { defineStore } from "pinia";
import { getFirestore, doc, collection, where, getDocs, query, updateDoc } from "firebase/firestore";
import { useAuthStore } from "./auth.store";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/tfg-mariorodrigomarcos.appspot.com/o/profile_images%2FProfile-icon.jpg?alt=media&token=92a5ee1e-7cbe-44cc-8f9d-46610b213b4f';

export const useUserInfoStore = defineStore({
    id: 'info',
    state: () => ({
        profileImg: localStorage.getItem('profileImg') || null,
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

                    if (!this.profileImg) {
                        this.profileImg = defaultProfileImgURL;
                        localStorage.setItem('profileImg', defaultProfileImgURL);
                    }
                } else {
                    this.username = null;
                    this.email = null;
                    this.name = null;
                    this.surname = null;
                    this.profileImg = defaultProfileImgURL;
                }
        
                // Save user information to local storage
                localStorage.setItem('username', this.username);
                localStorage.setItem('email', this.email);
                localStorage.setItem('name', this.name);
                localStorage.setItem('surname', this.surname);
                localStorage.setItem('profileImg', this.profileImg);
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

        clearData() {
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('name');
            localStorage.removeItem('surname');
            localStorage.removeItem('profileImg');
        },

        async updatePersonalInfo(name, surname) {
            const authStore = useAuthStore();
            const db = getFirestore();
            const userRef = doc(db, "users", authStore.userUID);
            try {
                await updateDoc(userRef, {name, surname });
                this.name = name;
                this.surname = surname;
        
                // Update local storage
                localStorage.setItem('name', name);
                localStorage.setItem('surname', surname);
            } catch (error) {
                console.error("Error updating user information:", error);
                throw error;
            }
        },

        async updateUsername(username) {
            const authStore = useAuthStore();
            const db = getFirestore();
            const userRef = doc(db, "users", authStore.userUID);
            try {
                await updateDoc(userRef, { username });
                this.username = username;
                localStorage.setItem('username', username);
            } catch (error) {
                console.error("Error updating username:", error);
                throw error;
            }
        },

        async updateEmail(email) {
            const authStore = useAuthStore();
            const db = getFirestore();
            const userRef = doc(db, "users", authStore.userUID);
            try {
                await updateDoc(userRef, { email });
                this.email = email;
                localStorage.setItem('email', email);
            } catch (error) {
                console.error("Error updating email:", error);
                throw error;
            }
        },

        async checkUsername(username) {
            const db = getFirestore();
            const userCollection = collection(db, 'users');

            if (!username)
            {
                return ['You must provide a username', false];
            }
        
            const usernameExistsBool = await this.usernameExists(userCollection, username);

            if (usernameExistsBool)
            {
                return ['Username already in use', false];
            } 
            else
            {
                return ['', true];
            } 
        },

        async usernameExists(userCollection, username) {
            try
            {
                const usernameQuery = query(userCollection, where('username', '==', username));
                const usernameQuerySnapshot = await getDocs(usernameQuery);

                if (!usernameQuerySnapshot.empty) {
                    return true;
                }
                else
                {
                    return false;
                } 
            }
            catch(error)
            {
                console.log(error.message);
            }
        },

        async checkEmail(email) {
            const db = getFirestore();
            const userCollection = collection(db, 'users');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email || !emailRegex.test(email))
            {
                return ['You must provide a valid email', false];
            }
            
            const emailExistsBool = await this.emailExists(userCollection, email);
                
            if (emailExistsBool)
            {
                return ['Email already in use', false];
            } 
            else 
            {
                return ['', true];
            }
        },

        async emailExists(userCollection, email) {
            try
            {
                const emailQuery = query(userCollection, where('email', '==', email));
                const querySnapshot = await getDocs(emailQuery);

                if (!querySnapshot.empty) {
                    return true;
                }
                else
                {
                    return false;
                } 
            }
            catch(error)
            {
                console.log(error.message);
            }
        },

        checkName(name) {
            if (!name)
            {
                return ['You must provide a name', false];
            }
            else
            {
                return ['', true];
            }
        },

        checkPassword(password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!password || !passwordRegex.test(password))
            {
                return ['You must provide a valid password', false];
            }
            else 
            {
                return ['', true];
            }
        }, 

        checkConfirmPassword(password, confirmPassword) {
            if (!confirmPassword)
            {
                return ['You must confirm your password', false];
            }
            else if (password !== confirmPassword)
            {
                return ['Passwords do not match', false];
            }
            else
            {
                return ['', true];
            }
        },
    }

});
