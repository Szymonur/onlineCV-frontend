import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/about',
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/publications',
      name: 'publications',
      redirect: '/publications/articles',
      component: () => import('@/views/PublicationsView.vue'),
      children: [
        {
          path: 'articles',
          name: 'articles',
          component: () => import('@/views/ArticlesView.vue'),
        },
        {
          path: 'research_grants',
          name: 'research_grants',
          component: () => import('@/views/ResearchGrantsView.vue'),
        },
      ],
    },
    {
      path: '/conferences',
      name: 'conferences',
      component: () => import('@/views/ConferencesView.vue'),
    },
  ],
})

export default router
