import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/HomePage.vue';
import Medicine from '@/pages/MedicinePage.vue';
import Prescription from '@/pages/PrescriptionPage.vue';
import Mypage from '@/pages/ProfilePage.vue';
import Login from '@/pages/Login/LoginPageKakao.vue';
import LoginMember from '@/pages/Login/LoginPageInfoMember.vue';
import MedicineDetail from '@/pages/MedicineDetail.vue';
import PrescriptionDetail from '@/pages/PrescriptionDetail.vue';

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
    },
    {
      path: '/loginMember',
      name: 'loginMember',
      component: LoginMember
    },
    {
      path: '/medicine/:id',
      name: 'medicineDetail',
      component: MedicineDetail
    },
    {
      path: '/prescription/:id',
      name: 'PrescriptionDetail',
      component: PrescriptionDetail
    }
  ]
});

export default router;