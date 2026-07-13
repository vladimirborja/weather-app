<script setup>
defineProps({
  loading:      { type: Boolean, default: false },
  weather:      { type: Object,  default: null },
  forecastDaily:{ type: Array,   default: () => [] },
})

function getDayLabel(dateStr) {
  const d     = new Date(dateStr)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  return d.toLocaleDateString('en-PH', { weekday: 'short' })
}
</script>

<template>
  <aside class="forecast-panel">
    <div class="forecast-header">
      <p class="forecast-title">7-DAY FORECAST</p>
    </div>

    <!-- Skeleton while loading -->
    <div v-if="loading" class="forecast-list">
      <div v-for="i in 7" :key="i" class="forecast-row skeleton-row">
        <div class="skeleton sk-day"></div>
        <div class="skeleton sk-icon"></div>
        <div class="skeleton sk-label"></div>
        <div class="skeleton sk-temp"></div>
      </div>
    </div>

    <!-- Daily rows -->
    <div v-else-if="weather && forecastDaily.length" class="forecast-list">
      <!-- Today row using current weather -->
      <div class="forecast-row today-row">
        <span class="fc-day">Today</span>
        <img
          :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
          :alt="weather.weather[0].description"
          class="fc-icon"
        />
        <span class="fc-label">{{ weather.weather[0].main }}</span>
        <span class="fc-temps">
          <span class="fc-max">{{ Math.round(weather.main.temp) }}</span>
          <span class="fc-min">/{{ Math.round(weather.main.temp_min ?? weather.main.temp - 4) }}</span>
        </span>
      </div>

      <div
        v-for="day in forecastDaily"
        :key="day.date"
        class="forecast-row fade-up-item"
      >
        <span class="fc-day">{{ getDayLabel(day.date) }}</span>
        <img
          :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
          :alt="day.description"
          class="fc-icon"
        />
        <span class="fc-label">{{ day.main }}</span>
        <span class="fc-temps">
          <span class="fc-max">{{ Math.round(day.tempMax) }}</span>
          <span class="fc-min">/{{ Math.round(day.tempMin) }}</span>
        </span>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="forecast-empty">
      <p>Search a city to see the 7-day outlook</p>
    </div>
  </aside>
</template>
