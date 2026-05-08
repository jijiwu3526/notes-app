import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Note } from '@/types/note'

export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchTerm = ref('')

  // Computed
  const filteredNotes = computed(() => {
    if (!searchTerm.value) return notes.value

    return notes.value.filter(note =>
      note.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })

  // Actions
  const fetchNotes = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/notes')
      notes.value = response.data.data.notes.map((note: any) => ({
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }))
    } catch (err: any) {
      error.value = err.message || 'An error occurred while fetching notes'
      console.error('Error fetching notes:', err)
    } finally {
      loading.value = false
    }
  }

  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/notes', noteData)
      const newNote = {
        id: response.data.data._id,
        title: response.data.data.title,
        content: response.data.data.content,
        createdAt: new Date(response.data.data.createdAt),
        updatedAt: new Date(response.data.data.updatedAt)
      }
      notes.value.unshift(newNote)
      return newNote
    } catch (err: any) {
      error.value = err.message || 'An error occurred while creating note'
      console.error('Error creating note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNote = async (id: string, noteData: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/notes/${id}`, noteData)
      const updatedNote = {
        id: response.data.data._id,
        title: response.data.data.title,
        content: response.data.data.content,
        createdAt: new Date(response.data.data.createdAt),
        updatedAt: new Date(response.data.data.updatedAt)
      }
      const index = notes.value.findIndex(note => note.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      return updatedNote
    } catch (err: any) {
      error.value = err.message || 'An error occurred while updating note'
      console.error('Error updating note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteNote = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/notes/${id}`)
      notes.value = notes.value.filter(note => note.id !== id)
      return true
    } catch (err: any) {
      error.value = err.message || 'An error occurred while deleting note'
      console.error('Error deleting note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setSearchTerm = (term: string) => {
    searchTerm.value = term
  }

  return {
    notes,
    loading,
    error,
    searchTerm,
    filteredNotes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setSearchTerm
  }
})
