<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import Main from '@/components/Main.vue';
import ShadowBox from '@/components/ShadowBox.vue';
</script>

<template>
  <HeadBar :back-button="true">약사 페이지</HeadBar>
  <Main :headbar="true" :navbar="false" :padded="true" :bg-gray="false"> </Main>
</template>

<style scoped></style>
