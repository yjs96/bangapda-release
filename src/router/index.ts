import { createRouter, createWebHistory } from 'vue-router';
import { useTokenStore } from '@/stores/tokenControl';
import Home from '@/pages/patient/HomePage.vue';
import Medicine from '@/pages/patient/MedicinePage.vue';
import Prescription from '@/pages/patient/PrescriptionPage.vue';
import Mypage from '@/pages/patient/ProfilePage.vue';
import Login from '@/pages/login/LoginPageKakao.vue';
import LoginPageInfoMember from '@/pages/login/LoginPageInfoMember.vue';
import MedicineDetail from '@/pages/patient/MedicineDetail.vue';
import PrescriptionDetail from '@/pages/patient/PrescriptionDetail.vue';
import LoginPageInfoUser from '@/pages/login/LoginPageInfoUser.vue';
import LoginPageInfoUser2 from '@/pages/login/LoginPageInfoUser2.vue';
import LoginPageSuccess from '@/pages/login/LoginPageSuccess.vue';
import LoginPageDoctor from '@/pages/login/LoginPageDoctor.vue';
import LoginPageDoctor2 from '@/pages/login/LoginPageDoctor2.vue';
import LoginPagePharmacist from '@/pages/login/LoginPagePharmacist.vue';
import PharmacistPage from '@/pages/pharmacist/PharmacistPage.vue';
import PharmacistPageScanPayment from '@/pages/pharmacist/PharmacistPageScanPayment.vue';
import DoctorPage from '@/pages/doctor/DoctorPage.vue';
import DoctorFinalCheck from '@/pages/doctor/DoctorFinalCheck.vue';
import LoginPagePharmacist2 from '@/pages/login/LoginPagePharmacist2.vue';
import Error404 from '@/pages/Error404.vue';
import InjectionDetail from '@/pages/patient/InjectionDetail.vue';
import LoginRedrection from '@/pages/login/LoginRedirection.vue';

function decodeJWT(token: string) {
  // console.log('decoding');
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT', e);
    return null;
  }
}

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
      path: '/login/doctor',
      name: '/loginPageDoctor',
      component: LoginPageDoctor
    },
    {
      path: '/login/doctor/license',
      name: '/loginPageDoctor2',
      component: LoginPageDoctor2
    },
    {
      path: '/login/pharmacist',
      name: '/LoginPagePharmacist',
      component: LoginPagePharmacist
    },
    {
      path: '/login/pharmacist/license',
      name: '/LoginPagePharmacist2',
      component: LoginPagePharmacist2
    },
    {
      path: '/success',
      name: '/loginPageSuccess',
      component: LoginPageSuccess
    },
    {
      path: '/pharmacist',
      name: '/pharmacist',
      component: PharmacistPage
    },
    {
      path: '/pharmacist/:id',
      name: '/pharmacistPayment',
      component: PharmacistPageScanPayment
    },
    {
      path: '/doctor',
      name: '/doctorPage',
      component: DoctorPage
    },
    {
      path: '/doctor/check',
      name: '/doctorFinalCheck',
      component: DoctorFinalCheck
    },
    {
      path: '/medicine/:id',
      name: 'medicineDetail',
      component: MedicineDetail
    },
    {
      path: '/injection/:id',
      name: 'injectionDetail',
      component: InjectionDetail
    },
    {
      path: '/prescription/:id',
      name: 'PrescriptionDetail',
      component: PrescriptionDetail
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Error404',
      component: Error404
    },
    {
      path: '/doctor/check/:id', // URL에서 :id 부분이 params로 전달됨
      name: 'DoctorFinalCheck',
      component: DoctorFinalCheck
    },
    {
      path: '/redirect',
      component: LoginRedrection
    }
  ]
});

router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore();
  const isLoggedIn = !!tokenStore.accessToken;

  // '/redirect'와 '/login'은 항상 접근 가능
  if (to.path === '/redirect' || to.path === '/login') {
    next();
    return;
  }

  if (!isLoggedIn) {
    next('/login');
  } else {
    // 로그인 상태이고 홈 페이지로 이동하려는 경우, 역할에 따라 리다이렉트
    if (to.path === '/') {
      const decodedToken = decodeJWT(tokenStore.accessToken);
      if (decodedToken && decodedToken.rol) {
        switch (decodedToken.rol) {
          case 'USER':
            next();
            break;
          case 'doctor':
            next('/doctor');
            break;
          case 'chemist':
            next('/pharmacist');
            break;
          default:
            next('/'); // 기본값으로 홈페이지로 이동
        }
      } else {
        next('/'); // 토큰 디코딩 실패 시 기본적으로 홈페이지로 이동
      }
    } else {
      next(); // 다른 경로의 경우 정상적으로 진행
    }
  }
});

export default router;
