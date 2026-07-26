<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isDemoMode: { type: Boolean, default: false },
  cityNames:  { type: Array,   default: () => [] },
})

const emit = defineEmits(['search', 'geolocate'])

const query       = ref('')
const geoLoading  = ref(false)
const geoError    = ref('')
const showDropdown = ref(false)
const activeIdx    = ref(-1)
const inputRef     = ref(null)
const dropdownRef  = ref(null)

// ── Autocomplete filtering ─────────────────────────────────────
const suggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q || q.length < 2) return []
  const startsWith = props.cityNames.filter(c => c.toLowerCase().startsWith(q))
  const contains   = props.cityNames.filter(c => !c.toLowerCase().startsWith(q) && c.toLowerCase().includes(q))
  return [...startsWith, ...contains].slice(0, 8)
})

watch(suggestions, () => {
  activeIdx.value = -1
  showDropdown.value = suggestions.value.length > 0
})

// Close on outside click
function handleOutsideClick(e) {
  if (
    inputRef.value && !inputRef.value.contains(e.target) &&
    dropdownRef.value && !dropdownRef.value.contains(e.target)
  ) {
    showDropdown.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

// ── Keyboard navigation ────────────────────────────────────────
function onKeydown(e) {
  if (!showDropdown.value) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIdx.value = Math.min(activeIdx.value + 1, suggestions.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIdx.value = Math.max(activeIdx.value - 1, -1)
  } else if (e.key === 'Escape') {
    showDropdown.value = false
    activeIdx.value = -1
  }
}

// ── Submit ─────────────────────────────────────────────────────
function handleSubmit() {
  const selected = activeIdx.value >= 0 ? suggestions.value[activeIdx.value] : query.value.trim()
  if (!selected) return
  emit('search', selected)
  query.value = ''
  showDropdown.value = false
  activeIdx.value = -1
}

function selectSuggestion(city) {
  emit('search', city)
  query.value = ''
  showDropdown.value = false
  activeIdx.value = -1
}

function onFocus() {
  if (suggestions.value.length > 0) showDropdown.value = true
}

// ── Geolocation ───────────────────────────────────────────────
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
    <form @submit.prevent="handleSubmit" class="search-form" autocomplete="off">
      <label for="city-search" class="sr-only">Search for a city</label>
      <div class="search-inner" ref="inputRef">
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
          @keydown="onKeydown"
          @keydown.enter.prevent="handleSubmit"
          @focus="onFocus"
        />
        <button v-if="query" type="submit" class="search-btn" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <!-- Autocomplete dropdown -->
      <div
        v-if="showDropdown && suggestions.length"
        class="autocomplete-dropdown"
        ref="dropdownRef"
        role="listbox"
      >
        <button
          v-for="(city, i) in suggestions"
          :key="city"
          type="button"
          class="autocomplete-item"
          :class="{ 'autocomplete-item--active': i === activeIdx }"
          role="option"
          :aria-selected="i === activeIdx"
          @mousedown.prevent="selectSuggestion(city)"
        >
          <svg class="ac-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{{ city }}</span>
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
      <svg v-if="!geoLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
      </svg>
      <svg v-else class="geo-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
    </button>

    <div v-if="isDemoMode" class="demo-badge" title="No API key — showing demo data">
      <span>◉</span> Demo
    </div>
  </div>
</template>
