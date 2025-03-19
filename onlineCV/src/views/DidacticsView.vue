<script setup>
import { useDidacticsStore } from '@/stores/didacticsStore.js'
import { useLanguageStore } from '@/stores/languageStore'
import DidacticsSideNav from '@/components/DidacticsSideNav.vue'
import { watch, onMounted } from 'vue'

const DidacticsStore = useDidacticsStore()
const languageStore = useLanguageStore()

onMounted(() => {
  DidacticsStore.fetchData()
})
watch(
  () => languageStore.locale,
  () => {
    DidacticsStore.fetchData()
  },
)
const t = (key) => languageStore.currentTranslation[key] || key
</script>

<template>
  <div class="c-didactics">
    <div>
      <div v-if="DidacticsStore.loading">{{ t('loading') }}</div>
      <div v-else-if="DidacticsStore.error">{{ DidacticsStore.error }}</div>
      <div v-else class="didactics-container">
        <DidacticsSideNav
          :links="[
            { id: 'articles', name: 'Articles' },
            { id: 'research-grants', name: 'Research Grants' },
          ]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
