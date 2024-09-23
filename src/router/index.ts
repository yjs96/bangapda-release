import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/HomePage.vue';
import Medicine from '@/pages/MedicinePage.vue';
import Prescription from '@/pages/PrescriptionPage.vue';
import Mypage from '@/pages/ProfilePage.vue';
import Login from '@/pages/Login/LoginPageKakao.vue';
import LoginPageInfoMember from '@/pages/Login/LoginPageInfoMember.vue';
import MedicineDetail from '@/pages/MedicineDetail.vue';
import PrescriptionDetail from '@/pages/PrescriptionDetail.vue';
import LoginPageInfoUser from '@/pages/Login/LoginPageInfoUser.vue';
import LoginPageInfoUser2 from '@/pages/Login/LoginPageInfoUser2.vue';
import LoginPageSuccess from '@/pages/Login/LoginPageSuccess.vue';

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
      path: '/login/member',
      name: 'loginPageInfoMember',
      component: LoginPageInfoMember
    },
    {
      path: '/login/bank_type',
      name: '/loginPageInfoUser',
      component: LoginPageInfoUser
    },
    {
      path: '/login/bank_id',
      name: '/loginPageInfoUser2',
      component: LoginPageInfoUser2
    },
    {
      path: '/success',
      name: '/loginPageSuccess',
      component: LoginPageSuccess
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
