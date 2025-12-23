import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { injectSpeedInsights } from '@vercel/speed-insights'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')

// Vercel Speed Insights
injectSpeedInsights()
