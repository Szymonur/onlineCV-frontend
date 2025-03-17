<script setup>
import PublicationsSideNav from '@/components/PublicationsSideNav.vue'
</script>

<template>
  <div class="c-publications">
    <PublicationsSideNav />

    <RouterView />
  </div>
</template>

<style>
.c-publications {
  display: flex;
  padding: 0 40px 0 0;
}
</style>
