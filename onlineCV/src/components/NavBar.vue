<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/publications">Publications</RouterLink>
    <RouterLink to="/conferences">Conferences</RouterLink>
  </nav>
</template>

<style scoped>
nav {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  font-size: 1.25rem;
  color: #000;
  border-bottom: 2px solid black;
  padding: 0.75rem 3rem;
}
.do_not_display {
  display: none;
}

:deep(.router-link-active) {
  color: #007bff; /* Blue color for active link */
}
</style>
