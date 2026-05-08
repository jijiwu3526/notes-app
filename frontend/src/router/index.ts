import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('@/views/NotesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/notes/:id',
      name: 'note-detail',
      component: () => import('@/views/NoteDetailView.vue'),
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // If route requires authentication
  if (to.meta.requiresAuth) {
    // If user is not logged in, redirect to login
    if (!userStore.isAuthenticated) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    // If user is logged in and tries to access login/register, redirect to notes
    if (userStore.isAuthenticated && ['login', 'register'].includes(to.name as string)) {
      next({ name: 'notes' })
    } else {
      next()
    }
  }
})

export default router