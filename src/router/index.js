import { createRouter, createWebHistory, createMemoryHistory } from "vue-router";

export const routes = [
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
    path: "/research_grants",
    name: "research_grants",
    component: () => import("@/views/ResearchGrantsView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/about",
  },
];

export const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes,
});
