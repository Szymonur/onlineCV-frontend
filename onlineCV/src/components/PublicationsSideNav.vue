<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/publications/articles">Articles</RouterLink>
    <RouterLink to="/publications/research_grants">Research grants </RouterLink>
    <!-- <RouterLink to="/publications">Publications</RouterLink> -->
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-size: 1.25rem;
  color: #000;
  border-right: 2px solid black;
  padding: 0.75rem 2rem;
}
</style>
