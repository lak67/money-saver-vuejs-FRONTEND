import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../features/auth'
import BudgetView from '../views/BudgetView.vue'
import DashboardView from '../views/DashboardView.vue'
import ExpensesView from '../views/ExpensesView.vue'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: ExpensesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/budget',
      name: 'budget',
      component: BudgetView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    },
    // Catch all 404s
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

// Route guard to protect authenticated routes
router.beforeEach(async (to, _from, next) => {
  const { isAuthenticated, hasInitiallyChecked, checkAuthStatus } = useAuth()

  // If we haven't checked auth yet, check it now
  if (!hasInitiallyChecked.value) {
    await checkAuthStatus()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirect to home page if not authenticated
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router