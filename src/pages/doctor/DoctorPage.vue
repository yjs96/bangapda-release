<script setup lang="ts">
import HeadBar from '@/components/HeadBar.vue';
import Main from '@/components/Main.vue';
import ShadowBox from '@/components/ShadowBox.vue';
import { Button } from '@/components/ui/button';
</script>

<template>
  <div>
    <HeadBar :back-button="false">처방전</HeadBar>
    <Main :headbar="true" :navbar="false" :padded="true" :bg-gray="true">
      <div class="prescription-container">
        <ShadowBox :padding-x="20" :padding-y="20">
          <div class="prescription-info">처방전</div>
          <div class="prescription-info">처방서</div>
        </ShadowBox>
      </div>
    </Main>
  </div>
</template>

<style scoped>
.prescription-container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.prescription-info {
  display: flex;
  justify-content: center;
}
</style>
