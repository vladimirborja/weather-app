<script setup>
const props = defineProps({
  quickCities: { type: Array, default: () => [] },
  weather:     { type: Object, default: null },
})
const emit = defineEmits(['search'])

// City metadata without emojis
const cityMeta = {
  Manila:   { iconType: 'city',     region: 'NCR',         desc: 'National Capital' },
  Batanes:  { iconType: 'waves',    region: 'Region II',   desc: 'Northernmost Tip' },
  Baguio:   { iconType: 'mountain', region: 'CAR',         desc: 'Summer Capital' },
  Siargao:  { iconType: 'waves',    region: 'Region XIII', desc: 'Surfing Capital' },
  Cebu:     { iconType: 'anchor',   region: 'Region VII',  desc: 'Queen City of the South' },
  Tagaytay: { iconType: 'mountain', region: 'Region IV-A', desc: 'Taal Volcano Ridge' },
  Davao:    { iconType: 'tree',     region: 'Region XI',   desc: 'Durian Capital' },
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
        <div class="city-card-emoji">
          <!-- city: Metro / urban -->
          <svg v-if="cityMeta[city]?.iconType === 'city'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="6" height="14" rx="1"/><rect x="9" y="3" width="6" height="18" rx="1"/><rect x="16" y="10" width="6" height="11" rx="1"/></svg>
          <!-- waves: coastal / surfing -->
          <svg v-else-if="cityMeta[city]?.iconType === 'waves'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/></svg>
          <!-- mountain: highland / volcanic -->
          <svg v-else-if="cityMeta[city]?.iconType === 'mountain'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3l4 8 5-5 5 15H2L8 3z"/></svg>
          <!-- anchor: port city -->
          <svg v-else-if="cityMeta[city]?.iconType === 'anchor'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0020 0h-3"/></svg>
          <!-- tree: nature / greenery -->
          <svg v-else-if="cityMeta[city]?.iconType === 'tree'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14l3-3H4l3 3"/><path d="M14 10l2-4H8l2 4"/><line x1="12" y1="22" x2="12" y2="14"/></svg>
          <!-- default: map pin -->
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
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
