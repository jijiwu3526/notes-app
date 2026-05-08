import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/users/login', { email, password })
      user.value = response.data.data.user
      token.value = response.data.data.token
      localStorage.setItem('token', token.value)
      return response.data.data
    } catch (err: any) {
      error.value = err.message || 'An error occurred during login'
      console.error('Login error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (username: string, email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/users/register', { username, email, password })
      user.value = response.data.data.user
      token.value = response.data.data.token
      localStorage.setItem('token', token.value)
      return response.data.data
    } catch (err: any) {
      error.value = err.message || 'An error occurred during registration'
      console.error('Registration error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const fetchUserProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/users/profile')
      user.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.message || 'An error occurred while fetching user profile'
      console.error('Fetch user profile error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUserProfile
  }
})
