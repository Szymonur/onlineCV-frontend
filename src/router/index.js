import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/about",
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/publications",
      name: "publications",
      redirect: "/publications/articles",
      component: () => import("@/views/PublicationsView.vue"),
      children: [
        {
          path: "articles",
          name: "articles",
          component: () => import("@/views/ArticlesView.vue"),
        },
      ],
    },
    {
      path: "/conferences",
      name: "conferences",
      component: () => import("@/views/ConferencesView.vue"),
    },
    {
      path: "/education",
      name: "education",
      component: () => import("@/views/EducationView.vue"),
    },
    {
      path: "/employment",
      name: "employment",
      component: () => import("@/views/EmploymentView.vue"),
    },
    {
      path: "/invited_lectures",
      name: "invited_lectures",
      component: () => import("@/views/InvitedLecturesView.vue"),
    },
    {
      path: "/didactics",
      name: "didactics",
      component: () => import("@/views/DidacticsView.vue"),
    },
    {
      path: "/:pathMatch(.*)*", // This matches any path
      redirect: "/about",
    },
    {
      path: "/research_grants",
      name: "research_grants",
      component: () => import("@/views/ResearchGrantsView.vue"),
    },
  ],
});

export default router;
