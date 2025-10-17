import { createRouter, createWebHistory } from 'vue-router'
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
      component: DashboardView
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: ExpensesView
    },
    {
      path: '/budget',
      name: 'budget',
      component: BudgetView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    // Catch all 404s
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router