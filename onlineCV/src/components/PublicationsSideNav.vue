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
  /* gap: 2rem; */
  min-width: 220px;
  font-size: 1.25rem;
  color: #000;
  border-right: 2px solid black;
  padding: 0.75rem 0 0 0;
}
nav a {
  border-bottom: 2px solid #ffffff00;
  padding: 0.75rem 2rem;
}
:deep(.router-link-active) {
  color: #007bff; /* Blue color for active link */
}
</style>
