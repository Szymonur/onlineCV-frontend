import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PublicationsView from '@/views/PublicationsView.vue'
import ArticlesView from '@/views/ArticlesView.vue'
import ResearchGrantsView from '@/views/ResearchGrantsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/publications',
      name: 'publications',
      component: () => import('@/views/PublicationsView.vue'),
      children: [
        {
          path: 'articles', // Child route for publications
          name: 'articles',
          component: () => import('@/views/ArticlesView.vue'),
        },
        {
          path: 'research_grants', // Child route for publications
          name: 'research_grants',
          component: () => import('@/views/ResearchGrantsView.vue'),
        },
      ],
    },
  ],
})

export default router
