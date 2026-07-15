<script setup>
defineProps({
  weatherEmoji: { type: String, default: '🌤️' },
  searchedCity: { type: String, default: '' },
})
</script>

<template>
  <div class="loading-state">
    <div class="loading-orb">
      <div class="orb-ring"></div>
      <span class="orb-emoji">{{ weatherEmoji }}</span>
    </div>
    <p class="loading-text">
      Fetching weather for <strong>{{ searchedCity }}</strong>…
    </p>
  </div>
</template>
