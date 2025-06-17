/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables Составляющие
import { createRouter, createWebHistory } from "vue-router";
// современные фреймворки автоматически прописывают новую страницу в роутере
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/index.vue"),
  },
  {
    path: "/leagues",
    name: "leagues",
    component: () => import("@/pages/leagues.vue"),
  },
  {
    path: "/league/:id",
    name: "league",
    component: () => import("@/pages/league.vue"),
  },
  {
    path: "/teams",
    name: "teams",
    component: () => import("@/pages/teams.vue"),
  },
  {
    path: "/team/:id",
    name: "team",
    component: () => import("@/pages/team.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Workaround for https://github.com/vitejs/vite/issues/11804
// если возникают ошибки, они выводятся здесь
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
