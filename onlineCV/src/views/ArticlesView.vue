<script setup>
import { useArticlesStore } from '@/stores/articlesStore.js'
import { onMounted } from 'vue'

const ArticlesStore = useArticlesStore()

onMounted(() => {
  ArticlesStore.fetchData()
})
</script>

<template>
  <div class="c-publications">
    <div>
      <div v-if="ArticlesStore.loading">Loading...</div>
      <div v-else-if="ArticlesStore.error">{{ ArticlesStore.error }}</div>
      <div v-else class="articles-container">
        <h1>Articles</h1>
        <ul>
          <li v-for="article in ArticlesStore.data" :key="article.citation_id" class="article-card">
            <h2>
              <a :href="article.link" target="_blank">{{ article.title }}</a>
            </h2>
            <p><strong>Autorzy:</strong> {{ article.authors }}</p>
            <p><strong>Publikacja:</strong> {{ article.publication }}</p>
            <p><strong>Rok:</strong> {{ article.year }}</p>
            <p>
              <strong>Cytowania: </strong>
              <a :href="article.cited_by.link" target="_blank">{{ article.cited_by.value }}</a>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.c-publications {
  display: flex;
}
.articles-container {
  max-width: 800px;
  margin: auto;
  font-family: Arial, sans-serif;
}

.article-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

.article-card h2 {
  margin: 0;
  font-size: 1.2em;
}

.article-card a {
  color: #007bff;
  text-decoration: none;
}

.article-card a:hover {
  text-decoration: underline;
}
h1 {
  padding: 15px 40px 0 40px;
}
</style>
