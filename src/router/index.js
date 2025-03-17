import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/LoginPage.vue';
import DepoAndwithdrawPage from '@/components/DepoAndwithdrawPage.vue';
import { useAuthStore } from '@/stores/authStore';
import { createPinia } from 'pinia';

const pinia = createPinia();

const routes = [
    {path: '/', component: LoginPage},
    {
        path: '/deposit-withdraw',
        component: DepoAndwithdrawPage,
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStore(pinia);
            if (authStore.iSAuthenticated) {
                next();
            } else {
                next('/');
            }
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;