import app from './plugins/prime-vue-config'
import { firebaseConfig } from './plugins/firebase-config';
import { router } from './router';
import { initializeApp } from "firebase/app";
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth.store';

import '@/assets/styles.scss';

// Initialize Firebase
const pinia = createPinia();
initializeApp(firebaseConfig);

app.use(router);
app.use(pinia);

const authStore = useAuthStore();
authStore.initAuth();

app.mount('#app');
