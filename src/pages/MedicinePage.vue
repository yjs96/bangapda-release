<script setup lang="ts">
import HeadBar from '@/components/HeadBar.vue';
import NavBar from '@/components/NavBar.vue';
import Main from '@/components/Main.vue'
</script>

<template>
  <HeadBar :bg-gray="true">복용약</HeadBar>
  <NavBar />
  <Main :headbar="true" :navbar="true" :bg-gray="true">Medicine</Main>
</template>

<style scoped></style>
