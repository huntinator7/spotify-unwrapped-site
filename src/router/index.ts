import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from "vuefire";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/callback",
      name: "callback",
      component: () => import("../views/SpotifyCallback.vue"),
    },
    {
      path: "/stats",
      name: "stats",
      component: () => import("../views/StatsHome.vue"),
      children: [
        {
          path: "plays",
          name: "plays",
          component: () => import("../components/stats/PlaysList.vue"),
        },
        {
          path: "sessions",
          name: "sessions",
          component: () => import("../components/stats/SessionsList.vue"),
        },
      ],
    },
    {
      path: "/account",
      name: "account",
      component: () => import("../views/AccountView.vue"),
    },
  ],
});

router.beforeEach(async () => {
  await getCurrentUser();
});

export default router;
