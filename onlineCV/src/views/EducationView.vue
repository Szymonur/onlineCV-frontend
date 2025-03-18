<script setup>
import { useEducationStore } from '@/stores/educationStore.js'
import { useLanguageStore } from '@/stores/languageStore'

import { onMounted } from 'vue'

const EducationStore = useEducationStore()
const languageStore = useLanguageStore()

onMounted(() => {
  EducationStore.fetchData()
})
const t = (key) => languageStore.currentTranslation[key] || key
</script>

<template>
  <div class="c-education">
    <div>
      <div v-if="EducationStore.loading">{{ t('loading') }}</div>
      <div v-else-if="EducationStore.error">{{ EducationStore.error }}</div>
      <div v-else class="education-container">
        <ul>
          <li class="education-card">
            <div>
              <h1>{{ t('education') }}</h1>
            </div>
            <div class="education-card-right education-card-right-header">
              <div>
                <p class="education-card-right-location">{{ t('location') }}</p>
              </div>
              <div>
                <p class="education-card-right-date">{{ t('date') }}</p>
              </div>
            </div>
          </li>
          <li v-for="education in EducationStore.main" :key="education.id" class="education-card">
            <div>
              <h2>{{ education.university }}, {{ education.degree }}</h2>
              <p>{{ education.description }}</p>
            </div>
            <div class="education-card-right">
              <div>
                <p class="education-card-right-location">{{ education.location }}</p>
              </div>
              <div>
                <p class="education-card-right-date">{{ education.year }}</p>
              </div>
            </div>
          </li>
          <!-- ADDITIONAL -->

          <li class="education-card">
            <div class="education-card-title">
              <h1>{{ t('summer_school_courses') }}</h1>
              <h2>( {{ t('as_participant') }} )</h2>
            </div>
            <div class="education-card-right education-card-right-header">
              <div>
                <p class="education-card-right-location">{{ t('location') }}</p>
              </div>
              <div>
                <p class="education-card-right-date">{{ t('date') }}</p>
              </div>
            </div>
          </li>
          <li
            v-for="education in EducationStore.additional"
            :key="education.id"
            class="education-card"
          >
            <div>
              <h2>{{ education.university }}, {{ education.degree }}</h2>
              <p>{{ education.description }}</p>
            </div>
            <div class="education-card-right">
              <div>
                <p class="education-card-right-location">{{ education.location }}</p>
              </div>
              <div>
                <p class="education-card-right-date">{{ education.year }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-educations {
  /* padding: 0 40px 0 0; */
}
.education-container {
  margin: auto;
  padding: 0 40px 0 0;
}
.education-card-title {
  display: flex;
  justify-content: flex-start;
  align-items: end;
}
.education-card-title h1 {
  padding: 15px 20px 0 0;
}
.education-card-title h2 {
  padding: 0 0 4px 0;
}
.education-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.education-card-right-header div {
  display: flex;
  align-items: end;
  justify-content: center;
}
.education-card-right,
.education-card-right-header div p {
  text-align: center;
}
.education-card-right {
  display: flex;
  gap: 2rem;
}
.education-card-right-header {
  gap: 2rem;
}
.education-card-right-link {
  color: #007bff;
}
.education-card h2 {
  margin: 0;
  font-size: 1.2em;
}

.education-card a {
  color: #007bff;
  text-decoration: none;
}
.education-card-right-date {
  text-wrap: nowrap;
  width: 77px;
}
.education-card-right-location {
  text-wrap: nowrap;
  width: 90px;
}

.education-card a:hover {
  text-decoration: underline;
}
h1 {
  padding: 15px 40px 0 0px;
}
</style>
