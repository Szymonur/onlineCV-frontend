<script setup>
import { useConferenceStore } from "@/stores/conferenceStore.js";
import { useLanguageStore } from "@/stores/languageStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import { onMounted, watch } from "vue";

const ConferenceStore = useConferenceStore();
const languageStore = useLanguageStore();
const serverUrl = import.meta.env.VITE_SERWER;

onMounted(() => {
  ConferenceStore.fetchData();
  ConferenceStore.fetchBannerData();
});
watch(
  () => languageStore.locale,
  () => {
    ConferenceStore.fetchData();
  }
);
const t = (key) => languageStore.currentTranslation[key] || key;

// Funkcja do przewijania strony
const scrollToContent = () => {
  const contentSection = document.getElementById("content-section");
  if (contentSection) {
    contentSection.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<template>
  <div class="c-conferences">
    <div>
      <div v-if="ConferenceStore.loading"></div>
      <div v-else-if="ConferenceStore.error">{{ ConferenceStore.error }}</div>
      <div v-else>
        <div class="conferences-baner" v-if="ConferenceStore.bannerData && ConferenceStore.bannerData.image">
          <img :src="serverUrl + ConferenceStore.bannerData.image.url" alt="Conference Banner" />
          <div @click="scrollToContent" class="mobile-do-not-display scroll-button">
            <font-awesome-icon :icon="faArrowDown" />
          </div>
        </div>
        <div id="content-section" class="conferences-container">
          <ul>
            <li class="conference-card">
              <div>
                <h1>{{ t("conferences") }}</h1>
              </div>
              <div class="conference-card-right conference-card-right-header">
                <div>
                  <p class="mobile-do-not-display conference-card-right-date">{{ t("date") }}</p>
                </div>
              </div>
            </li>
            <li v-for="conference in ConferenceStore.data" :key="conference.id" class="conference-card">
              <div>
                <h2>
                  {{ conference.name }}
                </h2>
                <p class="conference-location">{{ conference.location }}</p>
                <p>{{ conference.topic }}</p>
              </div>
              <div class="conference-card-right">
                <div v-if="conference.link">
                  <p>
                    <a class="conference-card-right-link" :href="conference.link" target="_blank"
                      >{{ t("read_more") }}
                    </a>
                  </p>
                </div>
                <div>
                  <p class="conference-card-right-date">{{ conference.date }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .c-conferences {
  padding: 0 40px 0 0;
} */

.conference-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.conferences-container {
  padding: 0 40px 0 0;
}
.conference-card-right-header div {
  display: flex;
  align-items: end;
}
.conference-card-right {
  display: flex;
  gap: 2rem;
}
.conference-location {
  color: #646464;
}
.conference-card-right-header {
  gap: 5rem;
}
.conference-card-right-link {
  color: var(--link);
}
.conference-card h2 {
  margin: 0;
  font-size: 1.2em;
}

.conference-card a {
  color: var(--link);
  text-decoration: none;
}
.conference-card-right-date {
  text-wrap: nowrap;
  width: 77px;
}
.conferences-baner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-height: 700px;
    overflow: hidden;
    position: relative; /* To enable positioning of the button */
}
 .conferences-baner img {
    width: 100%;
    object-fit: cover;
}
h1 {
  padding: 15px 40px 0 0px;
}
/* Styl dla ikony strzałki */
.scroll-button {
  position: absolute;
  bottom: 20px; /* Dystans od dołu */
  left: 50%;
  transform: translateX(-50%);
  font-size: 2em;
  color: white;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.scroll-button:hover {
  opacity: 0.7;
}

/* Dodajemy styl dla ikony, aby korzystała z FontAwesome */
.scroll-button svg {
  font-size: 3rem; /* Wielkość ikony */
}
@media screen and (max-width: 768px) {
  .conference-card {
    flex-direction: column;
  }
  .conference-card-right {
    flex-direction: row-reverse;
    justify-content: start;
  }
  .conference-card-right-link {
    justify-self: flex-end;
  }
  .scroll-button {
    bottom: 10px;
    font-size: 1.25em;
  }
  .scroll-button svg {
    font-size: 2rem;
  }
  .mobile-do-not-display {
    display: none;
  }
}
</style>
