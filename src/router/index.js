import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projeler',
      name: 'projects',
      component: ProjectsView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Hash varsa (örn: #hakkimizda)
    if (to.hash) {
      // Farklı route'tan geliyorsak, element'in DOM'a mount olmasını bekle
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 80, // Sticky header offset
          })
        }, 300) // Transition süresi + biraz buffer
      })
    }
    // Geri/ileri tuşlarında eski pozisyon
    if (savedPosition) {
      return savedPosition
    }
    // Varsayılan: sayfa başına git
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
