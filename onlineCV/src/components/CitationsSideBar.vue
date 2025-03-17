<script setup>
import { useCitationsStore } from '@/stores/citationsStore.js'
import { useLanguageStore } from '@/stores/languageStore'
import { onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const CitationsStore = useCitationsStore()
const languageStore = useLanguageStore()

onMounted(() => {
  CitationsStore.fetchData()
})

const t = (key) => languageStore.currentTranslation[key] || key

const citationsData = computed(() => {
  if (!CitationsStore.data || !CitationsStore.data.table) return []
  return CitationsStore.data.table
})

const yearlyCitations = computed(() => {
  if (!CitationsStore.data || !CitationsStore.data.graph) return { labels: [], datasets: [] }
  return {
    labels: CitationsStore.data.graph.map((entry) => entry.year),
    datasets: [
      {
        label: t('citations_per_year'),
        data: CitationsStore.data.graph.map((entry) => entry.citations),
        backgroundColor: 'rgba(0, 0, 255, 0.6)',
        borderColor: 'blue',
        borderWidth: 1,
      },
    ],
  }
})

const coAuthors = computed(() => {
  return CitationsStore.data?.co_authors || []
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
}
</script>

<template>
  <div class="c-citatons-side-bar">
    <div>
      <div v-if="CitationsStore.loading">{{ t('loading') }}</div>
      <div v-else-if="CitationsStore.error">{{ CitationsStore.error }}</div>
      <div v-else class="citatons-side-bar-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{{ t('all_time') }}</th>
              <th>{{ t('since') }} 2020</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ t('citations') }}</td>
              <td>{{ citationsData[0]?.citations?.all }}</td>
              <td>{{ citationsData[0]?.citations?.since_2020 }}</td>
            </tr>
            <tr>
              <td>{{ t('H-Index') }}</td>
              <td>{{ citationsData[1]?.h_index?.all }}</td>
              <td>{{ citationsData[1]?.h_index?.since_2020 }}</td>
            </tr>
            <tr>
              <td>{{ t('i10-Index') }}</td>
              <td>{{ citationsData[2]?.i10_index?.all }}</td>
              <td>{{ citationsData[2]?.i10_index?.since_2020 }}</td>
            </tr>
          </tbody>
        </table>

        <!-- CHART -->
        <div class="chart-container">
          <Bar :data="yearlyCitations" :options="chartOptions" />
        </div>
        <!-- CHART -->

        <!-- CO-AUTHORS -->
        <div class="co-authors">
          <h3>{{ t('co_authors') }}</h3>
          <ul>
            <li v-for="author in coAuthors" :key="author.author_id" class="co-author-item">
              <div class="co-author-item-img-name">
                <img :src="author.thumbnail" alt="Author Thumbnail" class="co-author-img" />
                <div>
                  <a :href="author.link" target="_blank">{{ author.name }}</a>
                </div>
              </div>
              <div>
                <span class="co-author-affiliation">({{ author.affiliations }})</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- CO-AUTHORS -->
      </div>
    </div>
  </div>
</template>

<style>
.c-citatons-side-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 300px;
  padding-top: 94px;
}

.citatons-side-bar-container {
  width: 100%;
}

.chart-container {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.co-authors {
  margin-top: 60px;
}

.co-authors h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.co-authors ul {
  list-style: none;
  padding: 0;
}

.co-author-item {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 10px;
}

.co-author-item-img-name a {
  height: min-content;
  text-align: center;
}

.co-author-item-img-name {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.co-author-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.co-author-affiliation {
  font-size: 0.8em;
  color: gray;
}
</style>
