import app from './plugins/prime-vue-config'
import firebaseConfig from './plugins/firebase-config';
import router from './router';
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

import '@/assets/styles.scss';

// Initialize Firebase
initializeApp(firebaseConfig);

// Global properties
app.config.globalProperties.$router = router;
app.use(router);


app.mount('#app');
