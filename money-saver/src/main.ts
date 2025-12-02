import { createApp } from 'vue'
import App from './App.vue'
import { useAuth } from './composables/useAuth'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(router)

// Initialize auth when app starts
const { initializeAuth } = useAuth()
initializeAuth().then(() => {
  app.mount('#app')
})
