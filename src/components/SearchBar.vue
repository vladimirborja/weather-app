<script setup>
import { ref } from 'vue'

defineProps({
  isDemoMode: { type: Boolean, default: false },
})

const emit = defineEmits(['search', 'geolocate'])

const query      = ref('')
const geoLoading = ref(false)
const geoError   = ref('')

function handleSubmit() {
  if (!query.value?.trim()) return
  emit('search', query.value.trim())
  query.value = ''
}

function handleGeolocate() {
  if (!navigator.geolocation) {
    geoError.value = 'Geolocation not supported by your browser.'
    return
  }
  geoLoading.value = true
  geoError.value   = ''
  navigator.geolocation.getCurrentPosition(
    pos => {
      geoLoading.value = false
      emit('geolocate', { lat: pos.coords.latitude, lon: pos.coords.longitude })
    },
    () => {
      geoLoading.value = false
      geoError.value   = 'Unable to detect your location.'
    },
    { timeout: 10000 }
  )
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
          placeholder="Search Philippine cities..."
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

    <!-- Geolocation button -->
    <button
      id="btn-geolocate"
      class="geo-btn"
      :class="{ 'geo-loading': geoLoading }"
      :disabled="geoLoading"
      :title="geoError || 'Use my location'"
      aria-label="Detect my location"
      @click="handleGeolocate"
    >
      <!-- Crosshair / GPS icon -->
      <svg v-if="!geoLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
      </svg>
      <!-- Spinner while locating -->
      <svg v-else class="geo-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
    </button>

    <div v-if="isDemoMode" class="demo-badge" title="No API key — showing demo data">
      <span>◉</span> Demo Mode
    </div>
  </div>
</template>
