import app from './plugins/prime-vue-config'
import firebaseConfig from './plugins/firebase-config';
import router from './router';
import vuelidate from 'vuelidate'
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

import '@/assets/styles.scss';

// Initialize Firebase
initializeApp(firebaseConfig);

// Global properties

app.use(router);
app.use(vuelidate);


app.mount('#app');
