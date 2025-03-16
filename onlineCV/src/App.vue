<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <div class="wrapper"></div>
  <RouterView />
</template>

<style scoped></style>
