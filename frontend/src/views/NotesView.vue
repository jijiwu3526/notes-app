<template>
  <div class="notes">
    <div class="notes-header">
      <h1>My Notes</h1>

      <div class="search-bar">
        <input
          type="text"
          v-model="notesStore.searchTerm"
          placeholder="Search notes..."
          class="search-input"
        />
      </div>

      <button @click="showCreateModal = true" class="btn btn-primary">Create New Note</button>
    </div>

    <!-- Loading indicator -->
    <div v-if="notesStore.loading" class="loading">
      Loading notes...
    </div>

    <!-- Error message -->
    <div v-if="notesStore.error" class="error">
      {{ notesStore.error }}
    </div>

    <!-- Notes list -->
    <div v-if="!notesStore.loading && !notesStore.error" class="notes-list">
      <div
        v-for="note in notesStore.filteredNotes"
        :key="note.id"
        class="note-card"
        @click="$router.push(`/notes/${note.id}`)"
      >
        <h3>{{ note.title }}</h3>
        <p class="note-preview">{{ note.content.substring(0, 100) }}{{ note.content.length > 100 ? '...' : '' }}</p>
        <div class="note-meta">
          <span>Created: {{ formatDate(note.createdAt) }}</span>
          <span>Updated: {{ formatDate(note.updatedAt) }}</span>
        </div>
      </div>

      <div v-if="notesStore.filteredNotes.length === 0" class="empty-state">
        <p>No notes found. {{ notesStore.searchTerm ? 'Try a different search.' : 'Create your first note!' }}</p>
      </div>
    </div>

    <!-- Create Note Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create New Note</h2>
          <button @click="showCreateModal = false" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="createNote" class="create-note-form">
          <div class="form-group">
            <label for="note-title">Title</label>
            <input
              id="note-title"
              type="text"
              v-model="newNote.title"
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="note-content">Content</label>
            <textarea
              id="note-content"
              v-model="newNote.content"
              required
              rows="6"
              class="form-control"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Note</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'

const notesStore = useNotesStore()
const router = useRouter()

const showCreateModal = ref(false)
const newNote = ref({
  title: '',
  content: ''
})

onMounted(() => {
  if (notesStore.notes.length === 0) {
    notesStore.fetchNotes()
  }
})

const createNote = async () => {
  try {
    await notesStore.createNote(newNote.value)
    newNote.value = { title: '', content: '' }
    showCreateModal.value = false
  } catch (error) {
    console.error('Failed to create note:', error)
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.notes {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.notes-header h1 {
  margin: 0;
  color: #333;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
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

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #dc3545;
}

.notes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
  background-color: white;
}

.note-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-color: #007bff;
}

.note-card h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
}

.note-preview {
  color: #666;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #999;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.create-note-form {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .notes-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .notes-list {
    grid-template-columns: 1fr;
  }
}
</style>