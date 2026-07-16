<script setup>
defineProps({
  quickCities: { type: Array, default: () => [] },
})

const emit = defineEmits(['search'])
</script>

<template>
  <div class="empty-state">
    <div class="empty-orb">
      <span class="empty-emoji">🏝️</span>
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
