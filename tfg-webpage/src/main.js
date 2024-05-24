import app from './plugins/prime-vue-config'
import { firebaseConfig } from './plugins/firebase-config';
import { router } from './router';
import { initializeApp } from "firebase/app";
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth.store';

import '@/assets/styles.scss';

// Initialize Firebase
initializeApp(firebaseConfig);
const pinia = createPinia();

// Global properties
export const defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/tfg-mariorodrigomarcos.appspot.com/o/profile_images%2FProfile-icon.jpg?alt=media&token=92a5ee1e-7cbe-44cc-8f9d-46610b213b4f'
app.use(router);
app.use(pinia);

const authStore = useAuthStore();
authStore.initAuth();

app.mount('#app');
