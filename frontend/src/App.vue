<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div id="app">
    <header>
      <h1>Notes App</h1>
      <nav class="header-nav">
        <template v-if="userStore.isAuthenticated">
          <RouterLink to="/notes" class="nav-link">My Notes</RouterLink>
          <RouterLink to="/profile" class="nav-link">Profile</RouterLink>
          <button @click="userStore.logout()" class="btn-logout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="nav-link">Login</RouterLink>
          <RouterLink to="/register" class="nav-link">Register</RouterLink>
        </template>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

header h1 {
  color: #333;
  margin: 0;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: #007bff;
  text-decoration: none;
  font-size: 0.95rem;
}

.nav-link:hover {
  text-decoration: underline;
}

.btn-logout {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-logout:hover {
  background-color: #dc3545;
  color: white;
}
</style>