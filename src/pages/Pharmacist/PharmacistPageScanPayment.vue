<script setup lang="ts">
import HeadBar from '@/components/HeadBar.vue';
import Main from '@/components/Main.vue';
import ShadowBox from '@/components/ShadowBox.vue';
import { ref } from 'vue';

const showPaymentDetail = ref(false);

const handlePaymentDetail = () => {
  showPaymentDetail.value = !showPaymentDetail.value;
};
</script>

<template>
  <HeadBar :back-button="true"></HeadBar>
  <Main :headbar="true" :navbar="false" :padded="true" :bg-gray="true">
    <div class="prescription-container">
      <ShadowBox :padding-x="20" :padding-y="20">
        <div class="prescription-info">처방전</div>
        <div class="prescription-info">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam delectus autem amet
          tempore, error nihil quae quas aut iure quisquam doloremque voluptatum nesciunt
          accusantium, et numquam nisi totam id. Commodi!
        </div>
      </ShadowBox>
    </div>
    <ShadowBox :padding-x="20" :padding-y="20">
      <div class="pill-arrow" @click="handlePaymentDetail()">
        <div class="title-text">약품 내역</div>
        <i class="fa-solid fa-chevron-down" :class="{ rotate: showPaymentDetail }"></i>
      </div>

      <div class="divider"></div>

      <div v-if="showPaymentDetail">
        <div>
          <div class="pill-list">
            <div class="pill-cost">
              <div>약품 정보</div>
              <div>12,000원</div>
            </div>
          </div>
          <div class="pill-list">
            <div class="pill-cost">
              <div>약품 정보</div>
              <div>12,000원</div>
            </div>
          </div>
          <div class="pill-list">
            <div class="pill-cost">
              <div>약품 정보</div>
              <div>12,000원</div>
            </div>
          </div>
          <div class="pill-list">
            <div class="pill-cost">
              <div>약품 정보</div>
              <div>12,000원</div>
            </div>
          </div>
          <div class="pill-list">
            <div class="pill-cost">
              <div>약품 정보</div>
              <div>12,000원</div>
            </div>
          </div>
        </div>
      </div>

      <div class="pill-arrow" style="margin-bottom: 0">
        <div class="title-text">총 가격</div>
        <div class="title-number">65,000원</div>
      </div>
    </ShadowBox>
  </Main>
</template>

<style scoped>
.prescription-container {
  display: flex;
  margin-top: 20px;
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
