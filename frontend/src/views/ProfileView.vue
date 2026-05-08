<template>
  <div class="profile">
    <h1>User Profile</h1>

    <div v-if="loading" class="loading">
      Loading profile...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="userStore.user" class="profile-content">
      <h2>{{ userStore.user.username }}</h2>
      <p><strong>Email:</strong> {{ userStore.user.email }}</p>

      <div class="profile-actions">
        <button @click="logout" class="btn btn-danger">Logout</button>
      </div>
    </div>

    <div v-else class="no-user">
      <p>You are not logged in.</p>
      <RouterLink to="/login" class="btn btn-primary">Login</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const error = ref('')

onMounted(() => {
  if (userStore.isAuthenticated && !userStore.user) {
    loadProfile()
  }
})

const loadProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    await userStore.fetchUserProfile()
  } catch (err: any) {
    error.value = err.message || 'Failed to load profile'
    console.error('Profile load error:', err)
  } finally {
    loading.value = false
  }
}

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #dc3545;
}

.profile-content {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 1rem;
}

.profile-content h2 {
  margin-top: 0;
  color: #333;
}

.profile-actions {
  margin-top: 2rem;
  text-align: center;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.no-user {
  text-align: center;
  padding: 2rem;
}
</style>