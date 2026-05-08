<template>
  <div class="note-detail">
    <div class="note-header">
      <button @click="$router.go(-1)" class="btn btn-secondary">← Back to Notes</button>
      <h1 v-if="!isEditing">{{ note?.title }}</h1>
      <input
        v-else
        v-model="editedNote.title"
        type="text"
        class="title-input"
        placeholder="Note title"
      />

      <div class="note-actions">
        <button
          v-if="!isEditing"
          @click="startEditing"
          class="btn btn-primary"
        >
          Edit
        </button>

        <div v-else>
          <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
          <button @click="saveNote" class="btn btn-success">Save</button>
        </div>

        <button @click="confirmDelete" class="btn btn-danger">Delete</button>
      </div>
    </div>

    <div class="note-content">
      <div v-if="!isEditing" class="content-display">
        {{ note?.content }}
      </div>

      <textarea
        v-else
        v-model="editedNote.content"
        class="content-input"
        rows="15"
        placeholder="Note content"
      ></textarea>
    </div>

    <div class="note-meta" v-if="note">
      <p><strong>Created:</strong> {{ formatDate(note.createdAt) }}</p>
      <p><strong>Last Updated:</strong> {{ formatDate(note.updatedAt) }}</p>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button @click="showDeleteConfirm = false" class="close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <p>Are you sure you want to delete this note?</p>
          <p><strong>{{ note?.title }}</strong></p>
        </div>

        <div class="modal-footer">
          <button @click="showDeleteConfirm = false" class="btn btn-secondary">Cancel</button>
          <button @click="deleteNote" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/types/note'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const note = ref<Note | null>(null)
const isEditing = ref(false)
const editedNote = ref({
  title: '',
  content: ''
})
const showDeleteConfirm = ref(false)

onMounted(async () => {
  await fetchNote()
})

const fetchNote = async () => {
  try {
    // In a real app, we would fetch the specific note from the API
    // For now, we'll simulate by finding the note in the store
    const notes = notesStore.notes
    note.value = notes.find(n => n.id === route.params.id as string) || null

    if (!note.value) {
      // If not found in store, we could fetch from API
      console.error('Note not found')
      router.push('/notes')
    } else {
      // Initialize the editedNote with the current note's values
      editedNote.value = {
        title: note.value.title,
        content: note.value.content
      }
    }
  } catch (error) {
    console.error('Error fetching note:', error)
    router.push('/notes')
  }
}

const startEditing = () => {
  isEditing.value = true
  editedNote.value = {
    title: note.value?.title || '',
    content: note.value?.content || ''
  }
}

const cancelEdit = () => {
  isEditing.value = false
  if (note.value) {
    editedNote.value = {
      title: note.value.title,
      content: note.value.content
    }
  }
}

const saveNote = async () => {
  if (!note.value) return

  try {
    await notesStore.updateNote(note.value.id, editedNote.value)

    // Update the local note reference
    note.value.title = editedNote.value.title
    note.value.content = editedNote.value.content
    note.value.updatedAt = new Date()

    isEditing.value = false
  } catch (error) {
    console.error('Error saving note:', error)
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const deleteNote = async () => {
  if (!note.value) return

  try {
    await notesStore.deleteNote(note.value.id)
    showDeleteConfirm.value = false
    router.push('/notes')
  } catch (error) {
    console.error('Error deleting note:', error)
    showDeleteConfirm.value = false
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
.note-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.note-header h1 {
  margin: 0;
  color: #333;
  flex-grow: 1;
}

.title-input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.5rem;
  font-weight: bold;
}

.note-actions {
  display: flex;
  gap: 10px;
}

.note-content {
  margin-bottom: 20px;
}

.content-display {
  white-space: pre-wrap;
  line-height: 1.6;
  padding: 1rem;
  background-color: #fafafa;
  border-radius: 4px;
  min-height: 300px;
}

.content-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
}

.note-meta {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: 0.9rem;
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

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #1e7e34;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
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
  max-width: 500px;
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

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .note-header {
    flex-direction: column;
    align-items: stretch;
  }

  .note-actions {
    justify-content: center;
  }
}
</style>