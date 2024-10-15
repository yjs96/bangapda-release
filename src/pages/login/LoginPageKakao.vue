<script setup lang="ts">
import { Button } from '@/components/ui/button';
import Main from '@/components/Main.vue';

const kakaoURL = import.meta.env.VITE_BASE_URL;

const navigateToNextPage = async () => {
  window.location.href = `${kakaoURL}/oauth2/authorization/kakao`;
};
</script>

<template>
  <Main :headbar="false" :navbar="false" :padded="false" :bg-gray="false">
    <div class="login-container">
      <div>
        <div class="login-icon">
          <img src="/icons/icon-256x256.png" alt="Banggabda" class="logo" />
        </div>
        <div class="login-name">방갑다</div>
      </div>
      <div class="w-full flex justify-center">
        <Button size="lg" class="login-kakao" @click="navigateToNextPage">
          <i class="fa-solid fa-comment"></i>카카오 로그인
        </Button>
      </div>
    </div>
  </Main>
</template>

<style scoped>
@font-face {
  font-family: 'SBAggroB';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff')
    format('woff');
  font-weight: normal;
  font-style: normal;
}

.login-container {
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  top: 44%;
  transform: translateY(-48%);
}

.login-icon {
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0px;
  overflow: hidden;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 24px;
  object-fit: cover;
}

.login-name {
  font-family: 'SBAggroB';
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  margin-left: 2px;
  margin-top: 8px;
  font-weight: 500;
}

.login-kakao {
  width: 80%;
  background-color: #fee500;
  gap: 12px;
}
</style>
