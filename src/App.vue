<script setup lang="ts">
import { computed, ref, provide } from 'vue';
import { useRouter } from 'vue-router';
import { Toaster, toast } from '@steveyuowo/vue-hot-toast';
import { onMessageListener } from './firebase';

const router = useRouter();
const threshold = 176; // 새로고침을 트리거하는 당김 거리 (픽셀)
const pullDistance = ref(0);
const startY = ref(0);
const isRefreshing = ref(false);
const showRefreshingMessage = ref(false);

// FCM 토큰 상태 관리
const fcmToken = ref<string | null>(null);
provide('fcmToken', fcmToken);

// 푸시 알림 리스너 설정
onMessageListener()
  .then((payload: any) => {
    toast.success(payload.notification.title);
    // 필요한 경우 알림 클릭 시 특정 페이지로 이동하는 로직 추가 가능
  })
  .catch((err: Error) => console.error('포그라운드 메시지 수신 실패:', err));

const onTouchStart = (e: TouchEvent) => {
  if (!isRefreshing.value) {
    startY.value = e.touches[0].clientY;
  }
};

const onTouchMove = (e: TouchEvent) => {
  if (!isRefreshing.value) {
    const currentY = e.touches[0].clientY;
    pullDistance.value = Math.max(0, currentY - startY.value);
  }
};

const onTouchEnd = () => {
  if (pullDistance.value > threshold && !isRefreshing.value) {
    startRefresh();
  } else {
    pullDistance.value = 0;
  }
};

const startRefresh = () => {
  isRefreshing.value = true;
  pullDistance.value = threshold;
  setTimeout(() => {
    showRefreshingMessage.value = true;
    setTimeout(() => {
      router.go(0);
      pullDistance.value = 0;
    }, 350);
  }, 0);
};

const isOverThreshold = computed(() => pullDistance.value > threshold);
const rotationStyle = computed(() => ({
  transform: `rotate(${isOverThreshold.value ? 180 : 0}deg)`,
  transition: 'transform 0.3s ease'
}));
</script>

<template>
  <div
    class="pull-to-refresh"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="pull-to-refresh__indicator" :style="{ height: `${pullDistance / 1.6}px` }">
      <div v-if="!showRefreshingMessage">
        <i class="fa-solid fa-arrow-up" :style="rotationStyle"></i>
        {{ isOverThreshold ? '놓아서 새로고침' : '당겨서 새로고침' }}
      </div>
      <div v-else class="refreshing-message">
        <div class="spinner"></div>
        <span>새로고침 중</span>
      </div>
    </div>
    <div class="content">
      <RouterView />
    </div>
  </div>
  <Toaster />
</template>
