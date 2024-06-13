import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {

            path: '/layout',
            component: AppLayout,
            children: [
                {
                    path: '/home/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/pages/home/Dashboard.vue')
                },
                {
                    path: '/home/profile',
                    name: 'profile',
                    component: () => import('@/views/pages/home/Profile.vue')
                },
                {
                    path: '/home/stats',
                    name: 'stats',
                    component: () => import('@/views/pages/home/Stats.vue')
                },
                {
                    path: '/home/game_details',
                    name: 'game_details',
                    component: () => import('@/views/pages/home/GameDetails.vue'),
                    props: true
                },
                {
                    path: '/home/leaderboard',
                    name: 'leaderboard',
                    component: () => import('@/views/pages/home/Leaderboard.vue')
                },
            ]
        },
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue'),
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },

        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/forgot_password',
            name: 'forgot_password',
            component: () => import('@/views/pages/auth/ForgotPassword.vue')
        },
        {
            path: '/auth/recovery_password',
            name: 'recovery_password',
            component: () => import('@/views/pages/auth/RecoveryPassword.vue')
        },
    ]
});

