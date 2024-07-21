import { defineStore } from "pinia";
import { getFirestore, doc, collection, where, getDocs, query, updateDoc } from "firebase/firestore";
import { useAuthStore } from "./auth.store";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/tfg-mariorodrigomarcos.appspot.com/o/profile_images%2FProfile-icon.jpg?alt=media&token=92a5ee1e-7cbe-44cc-8f9d-46610b213b4f';

/**
 * @module Stores/UserInfoStore
 * @description This is the store used for managing user personal information from Firestore and Cloud Storage.
 * @author Mario Rodrigo Marcos @MariooRM on GitHub
 */
export const useUserInfoStore = defineStore({
    id: 'info',

    /**
     * Defines the initial state of the user information store.
     * @typedef {Object} UserInfoState
     * @property {string|null} profileImg - The URL of the user's profile image.
     * @property {string|null} username - The user's username.
     * @property {string|null} email - The user's email address.
     * @property {string|null} name - The user's first name.
     * @property {string|null} surname - The user's last name.
     */
    state: () => ({
        profileImg: localStorage.getItem('profileImg') || null,
        username: localStorage.getItem('username') || null,
        email: localStorage.getItem('email') || null,
        name: localStorage.getItem('name') || null,
        surname: localStorage.getItem('surname') || null,
    }),

    actions: {
        /**
         * @function getUserInfo
         * @description Retrieves user information from Firestore based on the provided email.
         * @param {string} email - The email address of the user to retrieve.
         * @returns {Promise<void>} A promise that resolves when user information has been retrieved and stored.
         */
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

        /**
         * @function updateProfileImg
         * @description Updates the user's profile image in Firestore and local storage.
         * @param {File} file - The image file to upload.
         * @returns {Promise<void>} A promise that resolves when the profile image has been updated.
         */
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

        /**
         * @function clearData
         * @description Clears user information from local storage.
         * @returns {void}
         */
        clearData() {
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('name');
            localStorage.removeItem('surname');
            localStorage.removeItem('profileImg');
        },

        /**
         * @function updatePersonalInfo
         * @description Updates the user's personal information (name and surname) in Firestore and local storage.
         * @param {string} name - The user's new name.
         * @param {string} surname - The user's new surname.
         * @returns {Promise<void>} A promise that resolves when the personal information has been updated.
         */
        async updatePersonalInfo(name, surname) {
            const authStore = useAuthStore();
            const db = getFirestore();
            const userRef = doc(db, "users", authStore.userUID);
            try {
                await updateDoc(userRef, { name, surname });
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

        /**
         * @function updateUsername
         * @description Updates the user's username in Firestore and local storage.
         * @param {string} username - The user's new username.
         * @returns {Promise<void>} A promise that resolves when the username has been updated.
         */
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

        /**
         * @function updateEmail
         * @description Updates the user's email in Firestore and local storage.
         * @param {string} email - The user's new email address.
         * @returns {Promise<void>} A promise that resolves when the email has been updated.
         */
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

        /**
         * @function checkUsername
         * @description Checks if the provided username is available.
         * @param {string} username - The username to check.
         * @returns {Promise<Array.<string, boolean>>} A promise that resolves to a tuple where the first element is a message and the second is a boolean indicating if the username is available.
         */
        async checkUsername(username) {
            const db = getFirestore();
            const userCollection = collection(db, 'users');

            if (!username) {
                return ['You must provide a username', false];
            }

            const usernameExistsBool = await this.usernameExists(userCollection, username);

            if (usernameExistsBool) {
                return ['Username already in use', false];
            } else {
                return ['', true];
            }
        },

        /**
         * @function usernameExists
         * @description Checks if a username already exists in the user collection.
         * @param {CollectionReference} userCollection - The user collection reference.
         * @param {string} username - The username to check.
         * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the username exists.
         */
        async usernameExists(userCollection, username) {
            try {
                const usernameQuery = query(userCollection, where('username', '==', username));
                const usernameQuerySnapshot = await getDocs(usernameQuery);

                return !usernameQuerySnapshot.empty;
            } catch (error) {
                console.log(error.message);
                return false;
            }
        },

        /**
         * @function checkEmail
         * @description Checks if the provided email is valid and available.
         * @param {string} email - The email to check.
         * @returns {Promise<Array.<string, boolean>>} A promise that resolves to a tuple where the first element is a message and the second is a boolean indicating if the email is valid and available.
         */
        async checkEmail(email) {
            const db = getFirestore();
            const userCollection = collection(db, 'users');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email || !emailRegex.test(email)) {
                return ['You must provide a valid email', false];
            }

            const emailExistsBool = await this.emailExists(userCollection, email);

            if (emailExistsBool) {
                return ['Email already in use', false];
            } else {
                return ['', true];
            }
        },

        /**
         * @function emailExists
         * @description Checks if an email already exists in the user collection.
         * @param {CollectionReference} userCollection - The user collection reference.
         * @param {string} email - The email to check.
         * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the email exists.
         */
        async emailExists(userCollection, email) {
            try {
                const emailQuery = query(userCollection, where('email', '==', email));
                const querySnapshot = await getDocs(emailQuery);

                return !querySnapshot.empty;
            } catch (error) {
                console.log(error.message);
                return false;
            }
        },

        /**
         * @function checkName
         * @description Checks if the provided name is valid.
         * @param {string} name - The name to check.
         * @returns {Array.<string, boolean>} A tuple where the first element is a message and the second is a boolean indicating if the name is valid.
         */
        checkName(name) {
            if (!name) {
                return ['You must provide a name', false];
            } else {
                return ['', true];
            }
        },

        /**
         * @function checkPassword
         * @description Checks if the provided password is valid according to specified criteria.
         * @param {string} password - The password to check.
         * @returns {Array.<string, boolean>} A tuple where the first element is a message and the second is a boolean indicating if the password is valid.
         */
        checkPassword(password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!password || !passwordRegex.test(password)) {
                return ['You must provide a valid password', false];
            } else {
                return ['', true];
            }
        },

        /**
         * @function checkConfirmPassword
         * @description Checks if the provided confirm password matches the original password.
         * @param {string} password - The original password.
         * @param {string} confirmPassword - The password confirmation.
         * @returns {Array.<string, boolean>} A tuple where the first element is a message and the second is a boolean indicating if the confirmation matches.
         */
        checkConfirmPassword(password, confirmPassword) {
            if (!confirmPassword) {
                return ['You must confirm your password', false];
            } else if (password !== confirmPassword) {
                return ['Passwords do not match', false];
            } else {
                return ['', true];
            }
        },
    }
});
