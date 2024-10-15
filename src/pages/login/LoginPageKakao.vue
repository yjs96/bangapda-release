<script setup lang="ts">
import { Button } from '@/components/ui/button';
import Main from '@/components/Main.vue';
import { onMounted, ref } from 'vue';
import { Dialog, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';

localStorage.clear();
sessionStorage.clear();

const kakaoURL = import.meta.env.VITE_BASE_URL;

const navigateToNextPage = async () => {
  window.location.href = `${kakaoURL}/oauth2/authorization/kakao`;
};

const isIOS = ref(false);
const showIOSDialog = ref(false);

const deferredPrompt = ref<any>(null);
const isPWAInstallable = ref(false);

onMounted(() => {
  const isDeviceIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
  isIOS.value = isDeviceIOS;

  if (!isDeviceIOS) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt.value = e;
      isPWAInstallable.value = true;
    });
  }
});

const installPWA = async () => {
  if (isIOS.value) {
    showIOSDialog.value = true;
  } else if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    deferredPrompt.value = null;
    isPWAInstallable.value = false;
  }
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
      <div class="w-full flex flex-col items-center gap-5 relative">
        <Button size="lg" class="login-kakao" @click="navigateToNextPage">
          <img class="button-icon kakao" src="/images/kakao-logo.png" alt="" />카카오 로그인
        </Button>
        <Button size="lg" class="login-kakao download" @click="installPWA">
          <i class="fa-solid fa-download button-icon"></i>어플리케이션 설치
        </Button>
      </div>
    </div>

    <Dialog v-model:open="showIOSDialog">
      <DialogContent>
        <h2 class="text-lg font-semibold mb-4">iOS에서 앱 설치하기</h2>
        <ol class="list-decimal list-inside space-y-2">
          <li>브라우저의 공유 버튼을 탭하세요.</li>
          <li>"홈 화면에 추가" 옵션을 선택하세요.</li>
          <li>"추가"를 탭하여 홈 화면에 앱을 설치하세요.</li>
        </ol>
        <DialogFooter>
          <DialogClose asChild>
            <Button>닫기</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  position: relative;
  width: 80%;
  background-color: #fee500;
  gap: 12px;
}

.button-icon {
  position: absolute;
  left: 18px;
}

.kakao {
  width: 24px;
  height: 24px;
}

.fa-download {
  font-size: 21px;
  margin-left: 1px;
}

.download {
  background-color: var(--black);
  color: var(--white);
}
</style>
