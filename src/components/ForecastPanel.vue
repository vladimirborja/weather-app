<script setup>
defineProps({
  loading:       { type: Boolean, default: false },
  weather:       { type: Object,  default: null  },
  forecastDaily: { type: Array,   default: () => [] },
  isDemoMode:    { type: Boolean, default: false },
})
</script>

<template>
  <aside class="forecast-panel">

    <!-- 5-day forecast header -->
    <div class="forecast-header">
      <p class="forecast-title">5-DAY FORECAST</p>
    </div>

    <!-- Skeleton while loading -->
    <div v-if="loading" class="forecast-list">
      <div v-for="i in 5" :key="i" class="forecast-row skeleton-row">
        <div class="skeleton sk-day"></div>
        <div class="skeleton sk-icon"></div>
        <div class="skeleton sk-label"></div>
        <div class="skeleton sk-temp"></div>
      </div>
    </div>

    <!-- Daily rows -->
    <div v-else-if="weather && forecastDaily.length" class="forecast-list">
      <!-- Today row using current weather (pre-converted temps from parent) -->
      <div class="forecast-row today-row">
        <span class="fc-day">Today</span>
        <img
          :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
          :alt="weather.weather[0].description"
          class="fc-icon"
        />
        <span class="fc-label">{{ weather.weather[0].main }}</span>
        <span class="fc-temps">
          <span class="fc-max">{{ weather.main.displayTemp }}</span>
          <span class="fc-min">/{{ weather.main.displayTempMin }}</span>
        </span>
      </div>

      <div
        v-for="day in forecastDaily"
        :key="day.date"
        class="forecast-row fade-up-item"
      >
        <span class="fc-day">{{ day.dayName }}</span>
        <img
          :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
          :alt="day.description"
          class="fc-icon"
        />
        <span class="fc-label">{{ day.main }}</span>
        <span class="fc-temps">
          <span class="fc-max">{{ day.displayTempMax }}</span>
          <span class="fc-min">/{{ day.displayTempMin }}</span>
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="forecast-empty">
      <p>Search a city to see the 5-day outlook</p>
    </div>

  </aside>
</template>
