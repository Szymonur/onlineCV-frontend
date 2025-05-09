<script setup>
import { useAboutStore } from "@/stores/aboutStore";
import { useLanguageStore } from "@/stores/languageStore";
import { watch, onMounted } from "vue";
import { useHead } from "@vueuse/head";

// Import Font Awesome icons
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const dataStore = useAboutStore();
const serverUrl = import.meta.env.VITE_SERWER;
const languageStore = useLanguageStore();

onMounted(() => {
  dataStore.fetchData();
});
watch(
  () => languageStore.locale,
  () => {
    dataStore.fetchData();
  }
);
useHead({
  title: "O mnie - Jakub Isański",
  meta: [
    { name: "description", content: "Dowiedz się więcej o Jakubie Isańskim i jego działalności naukowej." },
    { property: "og:title", content: "O mnie - Jakub Isański" }, // OpenGraph Title
    { property: "og:description", content: "Dowiedz się o moich badaniach i publikacjach." }, // OpenGraph Description
    { property: "og:url", content: "https://twojastrona.pl/about" }, // URL podstrony w OpenGraph
  ],
});
</script>

<template>
  <div class="c-about">
    <div class="c-about-container">
      <div v-if="dataStore.loading"></div>
      <div v-else-if="dataStore.error" class="error">Błąd: {{ dataStore.error }}</div>
      <div v-else-if="!dataStore.hasData"></div>
      <div v-else class="c-about-content">
        <div class="c-about-top">
          <div class="c-about-img">
            <img :src="serverUrl + dataStore.data[0].profile_picture.url" alt="" />
          </div>
          <div class="c-about-top-data">
            <h1>{{ dataStore.data[0].name }}</h1>
            <h2>{{ dataStore.data[0].title }}</h2>
            <h2>{{ dataStore.data[0].department }}</h2>
            <div class="c-about-top-contact">
              <a
                v-if="dataStore.data[0].email"
                :href="'mailto:' + dataStore.data[0].email"
                class="flex items-center gap-2">
                <FontAwesomeIcon :icon="faEnvelope" class="icon" />
                {{ dataStore.data[0].email }}
              </a>

              <a
                v-if="dataStore.data[0].orcid"
                :href="'https://orcid.org/' + dataStore.data[0].orcid"
                target="_blank"
                class="flex items-center gap-2">
                <img src="@/assets/icons/orcid.png" alt="" />

                ORCID {{ dataStore.data[0].orcid }}
              </a>
              <a
                v-if="dataStore.data[0].researchgate"
                :href="dataStore.data[0].researchgate"
                target="_blank"
                class="flex items-center gap-2">
                <img src="@/assets/icons/researchgate.png" alt="" />
                ResearchGate
              </a>
            </div>
          </div>
        </div>
        <div class="c-about-description">{{ dataStore.data[0].description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-about {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.c-about-container {
  max-width: 1024px;
  padding: 40px 10px;
}
.c-about-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.c-about-description {
  font-size: 18px;
}
.c-about-img {
  height: 100%;
}
.c-about-img img {
  border-radius: 50%;
  width: 200px;
}
.c-about-top-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
h1 {
  font-size: 5rem;
  font-weight: bold;
  padding: 0;
}
.c-about-top {
  display: flex;
  gap: 3rem;
  align-items: center;
}
.c-about-top-contact {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.error {
  color: red;
}
.icon {
  font-size: 1.2rem;
}
.c-about-top-contact img {
  width: 20px;
  height: 20px;
}
.c-about-top-contact a {
  display: flex;
  align-items: center;
  gap: 5px;
}
@media (max-width: 768px) {
  .c-about {
    height: auto;
  }
  .c-about-top {
    flex-direction: column;
    gap: 0;
  }
  .c-about-top h1 {
    text-align: center;
    font-size: 2.75rem;
  }
  .c-about-top h2 {
    text-align: center;
    font-size: 1rem;
  }
  .c-about-top-contact {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
  }
  .c-about-description {
    padding: 0 8px;
  }
}
</style>
