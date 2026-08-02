<script setup>
defineProps({
  quickCities: { type: Array, default: () => [] },
})

const emit = defineEmits(['search'])
</script>

<template>
  <div class="empty-state">
    <div class="empty-orb">
      <span class="empty-emoji">
        <!-- Compass icon: represents searching/locating a place -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
      </span>
    </div>
    <h2 class="empty-title">Where's the weather today?</h2>
    <p class="empty-sub">
      Search any Philippine city — from Batanes in the north to Tawi-Tawi down south.
    </p>
    <div class="quick-cities">
      <button
        v-for="city in quickCities"
        :key="city"
        @click="emit('search', city)"
        class="city-chip"
      >
        {{ city }}
      </button>
    </div>
  </div>
</template>
