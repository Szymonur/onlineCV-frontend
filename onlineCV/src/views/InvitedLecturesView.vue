<script setup>
import { useInvitedLectureStore } from '@/stores/invitedLecturesStore.js'
import { useLanguageStore } from '@/stores/languageStore'

import { onMounted, watch } from 'vue'

const InvitedLectureStore = useInvitedLectureStore()
const languageStore = useLanguageStore()

onMounted(() => {
  InvitedLectureStore.fetchData()
})
watch(
  () => languageStore.locale,
  () => {
    InvitedLectureStore.fetchData()
  },
)
const t = (key) => languageStore.currentTranslation[key] || key
</script>

<template>
  <div class="c-invitedLectures">
    <div>
      <div v-if="InvitedLectureStore.loading">Loading...</div>
      <div v-else-if="InvitedLectureStore.error">{{ InvitedLectureStore.error }}</div>
      <div v-else class="invitedLectures-container">
        <ul>
          <li class="invitedLecture-card">
            <div>
              <h1>{{ t('invited_lectures') }}</h1>
            </div>
            <div class="invitedLecture-card-right invitedLecture-card-right-header">
              <div>
                <p class="invitedLecture-card-right-date">{{ t('date') }}</p>
              </div>
            </div>
          </li>
          <li
            v-for="invitedLecture in InvitedLectureStore.data"
            :key="invitedLecture.id"
            class="invitedLecture-card"
          >
            <div>
              <h2>
                <a :href="invitedLecture.link" target="_blank">{{ invitedLecture.topic }}</a>
              </h2>
              <h2>{{ invitedLecture.university }}</h2>
              <p>{{ invitedLecture.description }}</p>
            </div>
            <div class="invitedLecture-card-right">
              <div v-if="invitedLecture.link && !invitedLecture.topic">
                <p>
                  <a class="invitedLecture-card-right-link">{{ Link }} {{ t('read_more') }} </a>
                </p>
              </div>
              <div>
                <p class="invitedLecture-card-right-date">{{ invitedLecture.date }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-invitedLectures {
  padding: 0 40px 0 0;
}

.invitedLecture-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.invitedLecture-card-right-header div {
  display: flex;
  align-items: end;
}
.invitedLecture-card-right {
  display: flex;
  gap: 2rem;
}
.invitedLecture-card-right-header {
  gap: 5rem;
}
.invitedLecture-card-right-link {
  color: #007bff;
  text-wrap: nowrap;
}
.invitedLecture-card h2 {
  margin: 0;
  font-size: 1.2em;
}

.invitedLecture-card a {
  color: #007bff;
}
.invitedLecture-card-right-date {
  text-wrap: nowrap;
  text-align: center;
  width: 77px;
}

h1 {
  padding: 15px 40px 0 0px;
}
</style>
