import { createApp } from 'vue';
import app from './plugins/prime-vue-config';
import { firebaseConfig } from './plugins/firebase-config';
import { initializeApp } from "firebase/app";
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth.store';
import { router } from './router';
import { VueFire, VueFireAuth } from 'vuefire';
import '@/assets/styles.scss';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const pinia = createPinia();

app.use(router);
app.use(pinia);

const authStore = useAuthStore();
authStore.initAuth();

// Configure VueFire
app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ],
});

app.mount('#app');
