import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  {path: '/', name: 'home', component: LoginPage},
  {path: '/about_view', name: 'about', component: AboutView},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
