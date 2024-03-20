import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import MainPage from '../views/MainPage.vue'

const routes = [
  {path: '/', name: 'home', component: LoginPage},
  {path: '/register', name: 'register', component: RegisterPage},
  {path: '/main_page', name: 'mainPage', component: MainPage},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
