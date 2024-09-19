<script setup lang="ts">
import HeadBar from '@/components/HeadBar.vue';
import NavBar from '@/components/NavBar.vue';
import Main from '@/components/Main.vue';
</script>

<template>
  <HeadBar :bg-gray="true">처방전</HeadBar>
  <NavBar />
  <Main :headbar="true" :navbar="true" :padded="true" :bg-gray="true">

  </Main>
</template>

<style scoped></style>
