import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Medicine from '@/pages/Medicine.vue';
import Prescription from '@/pages/Prescription.vue';
import Mypage from '@/pages/Mypage.vue';
import Login from '@/pages/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Home
    },
    {
      path: '/medicine',
      name: 'medicine',
      component: Medicine
    },
    {
      path: '/prescription',
      name: 'prescription',
      component: Prescription
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: Mypage
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
});

export default router;
