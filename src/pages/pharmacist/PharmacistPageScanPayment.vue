<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import HeadBar from '@/components/HeadBar.vue';
import Main from '@/components/Main.vue';
import ShadowBox from '@/components/ShadowBox.vue';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/api/instance';
import { toast } from '@steveyuowo/vue-hot-toast';

// Vue Router와 현재 라우트 정보를 사용하기 위한 설정
const router = useRouter();
const route = useRoute();

// 결제 상세 정보 표시 여부를 관리하는 ref
const showPaymentDetail = ref(false);

// 처방전 상세 정보와 약품 목록을 저장하는 ref
const prescriptionDetails = ref(null);
const medicineList = ref([]);

// 총 가격을 계산하는 computed 속성
const totalPrice = computed(() => {
  // @ts-ignore
  return medicineList.value.reduce((sum, item) => sum + item.price, 0);
});

// 결제 상세 정보 표시 토글 함수
const handlePaymentDetail = () => {
  showPaymentDetail.value = !showPaymentDetail.value;
};

// 결제 요청 처리 함수
const handlePaymentRequest = async () => {
  try {
    await axiosInstance.post('/api/pay', { prescriptionId: route.params.id });
    toast.success('결제가 완료되었습니다.');
    router.push('/pharmacist');
  } catch (error) {
    toast.error('결제 처리 중 오류가 발생했습니다.');
  }
};

// 컴포넌트가 마운트될 때 처방전 정보를 가져옵니다.
onMounted(async () => {
  try {
    const response = await axiosInstance.get(
      `/api/pharmacy/prescription/detail/${route.params.id}`
    );
    prescriptionDetails.value = response.data;
    medicineList.value = response.data.medicines; // 약품 목록 설정
  } catch (error) {
    toast.error('처방전 정보를 불러오는 데 실패했습니다.');
    router.push('/pharmacist');
  }
});
</script>

<template>
  <HeadBar :back-button="true">처방전 상세</HeadBar>
  <Main :headbar="true" :navbar="false" :padded="true" :bg-gray="true">
    <!-- <div class="notice" v-if="prescriptionDetails?.status === 'COMPLETED'">
      <i class="fa-regular fa-circle-check"></i>
      <div>결제 완료된 처방전이에요</div>
    </div> -->

    <ShadowBox :padding-x="20" :padding-y="20" class="prescription-container">
      <div class="prescription-title">처방전</div>
      <div class="prescription-info">
        처방전 ID: {{ route.params.id }}
        <!-- 추가적인 처방전 정보 표시 -->
      </div>
    </ShadowBox>

    <ShadowBox :padding-x="20" :padding-y="20">
      <div class="pill-arrow" @click="handlePaymentDetail">
        <div class="title-text">약품 내역</div>
        <i class="fa-solid fa-chevron-down" :class="{ rotate: showPaymentDetail }"></i>
      </div>

      <div class="divider"></div>

      <!-- <div v-if="showPaymentDetail">
        <div class="pill-list" v-for="medicine in medicineList" :key="medicine.id">
          <div class="pill-cost">
            <div>{{ medicine.name }}</div>
            <div>{{ medicine.price.toLocaleString() }}원</div>
          </div>
        </div>
      </div> -->

      <div class="pill-arrow" style="margin-bottom: 0">
        <div class="title-text">총 가격</div>
        <div class="title-number">{{ totalPrice.toLocaleString() }}원</div>
      </div>
    </ShadowBox>

    <!-- <Button
      size="lg"
      @click="handlePaymentRequest"
      v-if="prescriptionDetails?.status !== 'COMPLETED'"
      >결제 요청</Button
    > -->
  </Main>
</template>

<style scoped>
.notice {
  margin-top: 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--kb-yellow);
  gap: 8px;
}

.prescription-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 12px;
}

.prescription-title {
  font-size: 24px;
  font-weight: 600;
}

.prescription-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.pill-arrow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.fa-chevron-down.rotate {
  transform: rotate(180deg);
}

.divider {
  height: 1px;
  background-color: var(--dark-gray);
  margin-bottom: 16px;
}

.title-text {
  font-weight: 600;
  font-size: 18px;
}

.title-number {
  font-weight: 600;
  font-size: 20px;
  color: var(--kb-yellow);
}

.pill-list {
  display: flex;
  flex-direction: column;
  font-weight: 400;
  font-size: 16px;
  color: var(--dark-gray);
  margin-bottom: 16px;
}

.pill-cost {
  display: flex;
  justify-content: space-between;
}
</style>
