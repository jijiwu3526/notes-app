<template>
  <div class="home">
    <h1>Welcome to Notes App</h1>
    <p>Your personal notes manager built with Vue.js and TypeScript</p>

    <div class="actions">
      <RouterLink to="/notes" class="btn btn-primary">View My Notes</RouterLink>
      <RouterLink to="/login" class="btn btn-secondary" v-if="!userStore.isAuthenticated">Login</RouterLink>
      <RouterLink to="/register" class="btn btn-secondary" v-if="!userStore.isAuthenticated">Register</RouterLink>
      <button @click="userStore.logout()" class="btn btn-secondary" v-if="userStore.isAuthenticated">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.actions {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>