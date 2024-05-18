import app from './plugins/prime-vue-config'
import { firebaseConfig } from './plugins/firebase-config';
import { router } from './router';
import { initializeApp } from "firebase/app";
import { createPinia } from 'pinia';
//import { getAnalytics } from "firebase/analytics";

import '@/assets/styles.scss';

// Initialize Firebase
initializeApp(firebaseConfig);
const pinia = createPinia();

// Global properties

app.use(router);
app.use(pinia);

app.mount('#app');
