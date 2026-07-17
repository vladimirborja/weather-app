<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})

// Use the UNIX timestamp (dt) directly to avoid timezone-ambiguous string parsing
function formatTime(dt) {
  return new Date(dt * 1000).toLocaleTimeString('en-PH', { hour: 'numeric', hour12: true })
}
</script>

<template>
  <div class="section-card animate-rise" style="animation-delay: 0.08s">
    <p class="section-label">TODAY'S FORECAST</p>
    <div class="hourly-strip">
      <div
        v-for="item in items"
        :key="item.dt"
        class="hourly-item fade-up-item"
      >
        <span class="hourly-time">{{ formatTime(item.dt) }}</span>
        <img
          :src="`https://openweathermap.org/img/wn/${item.icon}@2x.png`"
          :alt="item.description"
          class="hourly-icon"
        />
        <span class="hourly-temp">{{ item.displayTemp }}°</span>
        <span v-if="item.pop > 10" class="hourly-pop">💧 {{ item.pop }}%</span>
      </div>
    </div>
  </div>
</template>
