<script setup>
import { useConferenceStore } from '@/stores/conferenceStore.js'
import { useLanguageStore } from '@/stores/languageStore'

import { onMounted, watch } from 'vue'

const ConferenceStore = useConferenceStore()
const languageStore = useLanguageStore()

onMounted(() => {
  ConferenceStore.fetchData()
})
watch(
  () => languageStore.locale,
  () => {
    ConferenceStore.fetchData()
  },
)
const t = (key) => languageStore.currentTranslation[key] || key
</script>

<template>
  <!-- <pre>
    {{ ConferenceStore.data }}
  </pre> -->
  <div class="c-conferences">
    <div>
      <div v-if="ConferenceStore.loading">Loading...</div>
      <div v-else-if="ConferenceStore.error">{{ ConferenceStore.error }}</div>
      <div v-else class="conferences-container">
        <ul>
          <li class="conference-card">
            <div>
              <h1>{{ t('conferences') }}</h1>
            </div>
            <div class="conference-card-right conference-card-right-header">
              <div>
                <p class="conference-card-right-date">{{ t('date') }}</p>
              </div>
            </div>
          </li>
          <li
            v-for="conference in ConferenceStore.data"
            :key="conference.id"
            class="conference-card"
          >
            <div>
              <h2>
                {{ conference.name }}
              </h2>
              <p>{{ conference.topic }}</p>
            </div>
            <div class="conference-card-right">
              <div v-if="conference.link">
                <p>
                  <a class="conference-card-right-link" :href="conference.link" target="_blank"
                    >{{ Link }} {{ t('read_more') }}
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
</template>

<style scoped>
.c-conferences {
  padding: 0 40px 0 0;
}
.conferences-container {
  margin: auto;
  font-family: Arial, sans-serif;
}

.conference-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.conference-card-right-header div {
  display: flex;
  align-items: end;
}
.conference-card-right {
  display: flex;
  gap: 2rem;
}
.conference-card-right-header {
  gap: 5rem;
}
.conference-card-right-link {
  color: #007bff;
}
.conference-card h2 {
  margin: 0;
  font-size: 1.2em;
}

.conference-card a {
  color: #007bff;
  text-decoration: none;
}
.conference-card-right-date {
  text-wrap: nowrap;
  width: 77px;
}

.conference-card a:hover {
  text-decoration: underline;
}
h1 {
  padding: 15px 40px 0 0px;
}
</style>
