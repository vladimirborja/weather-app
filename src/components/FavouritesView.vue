<script setup>
import { useFavourites } from '../composables/useFavourites'

const emit = defineEmits(['search'])
const { savedCities, recentSearches, removeFavourite, clearRecent } = useFavourites()

const regionEmojis = {
  'Metro Manila': '🏙️', 'CAR': '🌲', 'Region I': '🌾', 'Region II': '🌊',
  'Region III': '🏔️', 'CALABARZON': '🌋', 'MIMAROPA': '🏝️', 'Region V': '🌁',
  'Region VI': '🍚', 'Region VII': '🏄', 'Region VIII': '🌀', 'Region IX': '🌊',
  'Region X': '🌿', 'Region XI': '🦅', 'Region XII': '🌺', 'Region XIII': '🌊',
  'BARMM': '🕌',
}

function getEmoji(city) {
  const emojis = ['🌤️','🌦️','⛅','🌞','🌧️','🌈','🏙️','🌃']
  const idx = city.charCodeAt(0) % emojis.length
  return emojis[idx]
}

function selectCity(city) {
  emit('search', city)
}
</script>

<template>
  <div class="favourites-view animate-rise">
    <div class="fav-header">
      <h2 class="fav-title">My Places</h2>
      <p class="fav-subtitle">Your saved cities and recent searches</p>
    </div>

    <!-- Saved Cities -->
    <section class="fav-section">
      <div class="fav-section-header">
        <span class="fav-section-label">
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          Saved Cities
        </span>
        <span class="fav-count" v-if="savedCities.length">{{ savedCities.length }}</span>
      </div>

      <div v-if="savedCities.length" class="fav-city-list">
        <div
          v-for="city in savedCities"
          :key="city"
          class="fav-city-card"
        >
          <button class="fav-city-main" @click="selectCity(city)">
            <span class="fav-city-emoji">{{ getEmoji(city) }}</span>
            <div class="fav-city-info">
              <span class="fav-city-name">{{ city }}</span>
              <span class="fav-city-sub">Philippines</span>
            </div>
            <svg class="fav-city-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          <button class="fav-remove-btn" :aria-label="`Remove ${city}`" @click="removeFavourite(city)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-else class="fav-empty">
        <div class="fav-empty-icon">💔</div>
        <p>No saved cities yet.</p>
        <p class="fav-empty-hint">Search for a city and tap the ♡ button to save it here.</p>
      </div>
    </section>

    <!-- Recent Searches -->
    <section class="fav-section" v-if="recentSearches.length">
      <div class="fav-section-header">
        <span class="fav-section-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Recent Searches
        </span>
        <button class="fav-clear-btn" @click="clearRecent">Clear</button>
      </div>
      <div class="fav-recent-list">
        <button
          v-for="city in recentSearches"
          :key="city"
          class="fav-recent-chip"
          @click="selectCity(city)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ city }}
        </button>
      </div>
    </section>
  </div>
</template>
