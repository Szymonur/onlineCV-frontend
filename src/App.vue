<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import { watch, onMounted } from "vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useAppStore } from "@/stores/useAppStore";
import Footer from "./components/Footer.vue";

// Inicjalizujemy store
const languageStore = useLanguageStore();
const appStore = useAppStore();
// Ładujemy tłumaczenia podczas montowania komponentu
onMounted(() => {
  languageStore.initializeTranslations(); // Załaduj tłumaczenia na początku
  appStore.initializeBasicData(); // Załaduj tylko podstawowe dane (np. aboutView)
});
watch(
  () => languageStore.locale,
  () => {
    appStore.reloadDataAfterLanguageChange();
  }
);
</script>

<template>
  <NavBar />
  <div class="wrapper">
    <transition name="fade" mode="out-in">
      <RouterView />
    </transition>
    <Footer />
  </div>
</template>

<style scoped></style>
