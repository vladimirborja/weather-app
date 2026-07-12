<script setup>
import { ref } from 'vue'

const props = defineProps({
  isDemoMode: { type: Boolean, default: false },
})

const emit = defineEmits(['search'])

const query = ref('')

function handleSubmit() {
  if (!query.value?.trim()) return
  emit('search', query.value.trim())
  query.value = ''
}
</script>

<template>
  <div class="search-area">
    <form @submit.prevent="handleSubmit" class="search-form">
      <label for="city-search" class="sr-only">Search for a city</label>
      <div class="search-inner">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          id="city-search"
          v-model="query"
          type="text"
          placeholder="Search for cities..."
          class="search-input"
          autocomplete="off"
          @keydown.enter="handleSubmit"
        />
        <button v-if="query" type="submit" class="search-btn" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </form>

    <div v-if="isDemoMode" class="demo-badge" title="No API key — showing demo data">
      <span>◉</span> Demo Mode
    </div>
  </div>
</template>
