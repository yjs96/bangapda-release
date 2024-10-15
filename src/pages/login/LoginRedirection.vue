<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTokenStore } from '@/stores/tokenControl';

const router = useRouter();
const route = useRoute();

const handleOAuthKakao = async (token: string, role: string) => {
  try {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    console.log(route);
    await router.push('/login/member');
    //console.log(login.isLoggedIn);
  } catch (error) {
    console.log(error);
    await router.push('/login');
  }
};

const tokenStore = useTokenStore();

onMounted(async () => {
  const token = route.query.accessToken?.toString() ?? '';
  const role = route.query.role?.toString() ?? '';
  const state = route.query.state?.toString();
  tokenStore.accessToken = token;
  localStorage.setItem('accessToken', token);

  if (token) {
    if (state === 'user') {
      await router.push('/');
      return;
    } else if (state === 'chemist') {
      await router.push('/pharmacist');
      return;
    } else if (state === 'doctor') {
      await router.push('/doctor');
      return;
    } else if (state === 'register') {
      handleOAuthKakao(token, role);
    }
  } else {
    alert('다시시도.');
    router.push('/login');
  }
});
</script>

<template>
  <div>
    <div>Processing...</div>
  </div>
</template>

<style scoped></style>
