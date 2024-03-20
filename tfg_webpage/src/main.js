import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify' 
import 'vuetify/styles'

/** FIREBASE INTEGRATION */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIVCKtuTfDwXs5UsDAET-MvhYvRqOqtAQ",
  authDomain: "tfg-mariorodrigomarcos.firebaseapp.com",
  projectId: "tfg-mariorodrigomarcos",
  storageBucket: "tfg-mariorodrigomarcos.appspot.com",
  messagingSenderId: "1009482475916",
  appId: "1:1009482475916:web:36d1109a183ed07f5a0ea9",
  measurementId: "G-P7BEKHTTQ8"
};

// Initialize Firebase
initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const vuetify = createVuetify()
const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
