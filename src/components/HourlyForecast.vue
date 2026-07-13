<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})

function formatTime(dt_txt) {
  return new Date(dt_txt).toLocaleTimeString('en-PH', { hour: 'numeric', hour12: true })
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
        <span class="hourly-time">{{ formatTime(item.dt_txt) }}</span>
        <img
          :src="`https://openweathermap.org/img/wn/${item.icon}@2x.png`"
          :alt="item.description"
          class="hourly-icon"
        />
        <span class="hourly-temp">{{ Math.round(item.temp) }}°</span>
      </div>
    </div>
  </div>
</template>
