import { createRouter, createWebHistory } from "vue-router";
import { AuthTokenManager } from "@/utils/auth";
import { store } from "@/store";
import BudgetView from "../views/BudgetView.vue";
import DashboardView from "../views/DashboardView.vue";
import ExpensesView from "../views/ExpensesView.vue";
import HomeView from "../views/HomeView.vue";
import SettingsView from "../views/SettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    // Auth routes (public)
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/auth/RegisterView.vue"),
      meta: { requiresGuest: true },
    },
    // Protected routes (require authentication)
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/expenses",
      name: "expenses",
      component: ExpensesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/budget",
      name: "budget",
      component: BudgetView,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/auth/ProfileView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    // Catch all 404s
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

// Navigation Guards
router.beforeEach(async (to, _from, next) => {
  const token = AuthTokenManager.getValidToken();
  const isAuthenticated = store.getters["auth/isAuthenticated"];

  // If we have a token but store doesn't think we're authenticated, check auth
  if (token && !isAuthenticated) {
    await store.dispatch("auth/checkAuth");
  }

  // Handle routes that require authentication
  if (to.meta.requiresAuth && !store.getters["auth/isAuthenticated"]) {
    next({
      name: "login",
      query: { redirect: to.fullPath }, // Save the intended destination
    });
    return;
  }

  // Handle routes that require guest (not authenticated)
  if (to.meta.requiresGuest && store.getters["auth/isAuthenticated"]) {
    next({ name: "dashboard" });
    return;
  }

  next();
});

export default router;
