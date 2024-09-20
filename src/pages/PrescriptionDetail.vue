<script setup lang="ts">
import HeadBar from '@/components/HeadBar.vue';
import NavBar from '@/components/NavBar.vue';
import Main from '@/components/Main.vue';

import { Button } from '@/components/ui/button';
import { ref } from 'vue';

const prescDetail = [
  {
    key: '병원명',
    value: '김성현내과의원'
  },
  {
    key: '의사명',
    value: '김성현'
  },
  {
    key: '약국명',
    value: '무슨무슨약국'
  },
  {
    key: '약사명',
    value: '임준수'
  },
  {
    key: '작성일',
    value: '2024. 09. 13'
  },
  {
    key: '처방약',
    value: '3개'
  },
]

const showMedicine = ref(false);

</script>

<template>
  <HeadBar :back-button="true">상세보기</HeadBar>
  <NavBar />
  <Main :headbar="true" :navbar="true" :padded="true">
    <div class="misc-func-frame">
      <div class="misc-func-container">
        <div class="misc-func-left">
          <div class="icon-frame">
            <!-- 아이콘 -->
          </div>
          <div class="misc-info-text">
            <span class="misc-info-title">보험금 간편 청구</span>
            <span class="misc-info-desc">{서비스명}이 복잡한 과정을 대신 해드려요</span>
          </div>
        </div>
        <Button>신청</Button>
      </div>
      <div class="misc-func-container">
        <div class="misc-func-left">
          <div class="icon-frame">
            <!-- 아이콘 -->
          </div>
          <div class="misc-info-text">
            <span class="misc-info-title">약 수령 확인</span>
            <span class="misc-info-desc">{서비스명}을 사용하지 않았어도 바꿀 수 있어요</span>
          </div>
        </div>
        <Button variant="destructive">완료</Button>
      </div>
    </div>
    <div class="presc-title">처방전 상세</div>
    <div class="detail-frame">
      <div class="detail-container" v-for="info in prescDetail" :key="info.key">
        <span>{{ info.key }}</span>
        <div>
          {{ info.value }}
          <i v-if="info.key == '처방약'" class="fa-solid fa-caret-down" @click="showMedicine = !showMedicine"></i>
          <div v-if="showMedicine && info.key =='처방약'">dddd</div>
        </div>
      </div>
    </div>
    <div class="seperator"></div>
    <div class="docu-button">
      <span>처방전 보기</span>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    <div class="docu-button">
      <span>영수증 보기</span>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
  </Main>
</template>

<style scoped>
.misc-func-frame {
  margin-top: 24px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.misc-func-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.misc-func-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-frame {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  background-color: var(--gray);
  display: flex;
  justify-content: center;
  align-items: center;
}

.misc-info-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.misc-info-title {
  font-size: 16px;
  font-weight: 550;
}

.misc-info-desc {
  font-size: 12px;
  color: var(--dark-gray);
}

.presc-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.detail-frame {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 32px;
}

.detail-container {
  display: flex;
  justify-content: space-between;

  div {
    font-size: 16px;
    color: var(--dark-gray);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  span {
    font-size: 18px;
    font-weight: 550;
  }
}

.seperator {
  width: 100%;
  height: 1px;
  border-bottom: 1px solid var(--gray);
  margin-bottom: 16px;
}

.docu-button {
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  span {
    font-size: 20px;
    font-weight: 600
  }
}
</style>