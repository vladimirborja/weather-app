<script setup>
const props = defineProps({
  quickCities: { type: Array, default: () => [] },
  weather:     { type: Object, default: null },
})
const emit = defineEmits(['search'])

const cityMeta = {
  Manila:   { emoji: '🏙️', region: 'NCR', desc: 'National Capital' },
  Batanes:  { emoji: '🌊', region: 'Region II', desc: 'Northernmost Tip' },
  Baguio:   { emoji: '🌲', region: 'CAR', desc: 'Summer Capital' },
  Siargao:  { emoji: '🏄', region: 'Region XIII', desc: 'Surfing Capital' },
  Cebu:     { emoji: '🏝️', region: 'Region VII', desc: 'Queen City of the South' },
  Tagaytay: { emoji: '🌋', region: 'Region IV-A', desc: 'Taal Volcano Ridge' },
  Davao:    { emoji: '🦅', region: 'Region XI', desc: 'Durian Capital' },
}
</script>

<template>
  <div class="cities-view animate-rise">
    <div class="cities-header">
      <h2 class="cities-title">Philippine Cities</h2>
      <p class="cities-subtitle">Select a city to view live weather data</p>
    </div>

    <div class="cities-grid">
      <button
        v-for="city in quickCities"
        :key="city"
        class="city-card"
        :class="{ 'city-card--active': weather?.name?.toLowerCase().startsWith(city.toLowerCase()) }"
        @click="emit('search', city)"
      >
        <div class="city-card-emoji">{{ cityMeta[city]?.emoji ?? '🌤️' }}</div>
        <div class="city-card-body">
          <p class="city-card-name">{{ city }}</p>
          <p class="city-card-region">{{ cityMeta[city]?.region }}</p>
          <p class="city-card-desc">{{ cityMeta[city]?.desc }}</p>
        </div>
        <div class="city-card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>
