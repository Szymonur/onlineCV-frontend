<script setup>
import PublicationsSideNav from "@/components/PublicationsSideNav.vue";
</script>

<template>
  <div class="c-publications">
    <PublicationsSideNav />
    <transition name="fade" mode="out-in">
      <RouterView />
    </transition>
  </div>
</template>

<style>
.c-publications {
  display: flex;
  padding: 0 40px 0 0;
}
@media (max-width: 768px) {
  .c-publications {
    flex-direction: column;
  }
  ul {
    padding-left: 1.25rem;
  }
}
</style>
