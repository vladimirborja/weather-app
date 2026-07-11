<script setup>
import { ref, computed, watch } from 'vue'
import { useWeather } from './composables/useWeather'

import AppSidebar    from './components/AppSidebar.vue'
import SearchBar     from './components/SearchBar.vue'
import LoadingState  from './components/LoadingState.vue'
import ErrorCard     from './components/ErrorCard.vue'
import WarningStrip  from './components/WarningStrip.vue'
import HeroCard      from './components/HeroCard.vue'
import HourlyForecast from './components/HourlyForecast.vue'
import AirConditions from './components/AirConditions.vue'
import EmptyState    from './components/EmptyState.vue'
import ForecastPanel from './components/ForecastPanel.vue'

const { weather, forecastHourly, forecastDaily, loading, error, isDemoMode, search } = useWeather()

const animatedTemp = ref(0)
const searchedCity = ref('')

const QUICK_CITIES = ['Manila', 'Batanes', 'Baguio', 'Siargao', 'Cebu', 'Tagaytay', 'Davao']

function handleSearch(city) {
  if (!city?.trim()) return
  searchedCity.value = city.trim()
  search(city.trim())
}

// Smooth count-up animation on temp change
watch(weather, (w) => {
  if (!w) { animatedTemp.value = 0; return }
  const target = Math.round(w.main.temp)
  const start  = animatedTemp.value
  const t0     = performance.now()
  const dur    = 800
  const tick   = (now) => {
    const p = Math.min(1, (now - t0) / dur)
    animatedTemp.value = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3)))
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

// ── Computed helpers ────────────────────────────────────────────
const weatherIcon = computed(() =>
  weather.value
    ? `https://openweathermap.org/img/wn/${weather.value.weather[0].icon}@4x.png`
    : ''
)

const isRainy = computed(() => {
  if (!weather.value) return false
  const id = weather.value.weather[0].id
  return id < 800 // 2xx–7xx = thunderstorm/rain/snow/atmosphere
})

const isSunny = computed(() => {
  if (!weather.value) return false
  return weather.value.weather[0].id === 800 // clear sky only
})

const themeClass = computed(() => {
  if (!weather.value) return 'theme-default'
  if (isRainy.value)  return 'theme-rainy'
  if (isSunny.value)  return 'theme-sunny'
  return 'theme-cloudy'
})

const weatherEmoji = computed(() => {
  if (!weather.value) return '🌤️'
  const id = weather.value.weather[0].id
  if (id >= 200 && id <= 232) return '⛈️'
  if (id >= 300 && id <= 321) return '🌦️'
  if (id >= 500 && id <= 531) return '🌧️'
  if (id >= 600 && id <= 622) return '❄️'
  if (id >= 700 && id <= 781) return '🌫️'
  if (id === 800)             return '☀️'
  if (id === 801)             return '🌤️'
  if (id === 802)             return '⛅'
  return '☁️'
})

const windLabel = computed(() => {
  if (!weather.value?.wind) return '--'
  const { speed, deg } = weather.value.wind
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  const cardinal = dirs[Math.round(deg / 22.5) % 16]
  return `${speed.toFixed(1)} m/s ${cardinal}`
})

const updatedAt = computed(() => {
  if (!weather.value) return ''
  return new Date(weather.value.dt * 1000)
    .toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true })
})

const conditionLabel = computed(() => weather.value?.weather[0].description ?? '')
const humidity       = computed(() => weather.value?.main?.humidity ?? '--')
const feelsLike      = computed(() => weather.value ? Math.round(weather.value.main.feels_like) : '--')
const pressure       = computed(() => weather.value?.main?.pressure ?? '--')
const tcws           = computed(() => weather.value?.warning?.tcws ?? null)
const rainfall       = computed(() => weather.value?.warning?.rainfall ?? null)
</script>

<template>
  <div class="app-shell" :class="themeClass">
    <!-- Animated background blobs -->
    <div class="bg-blob blob-1" aria-hidden="true"></div>
    <div class="bg-blob blob-2" aria-hidden="true"></div>
    <div class="bg-blob blob-3" aria-hidden="true"></div>

    <div class="dashboard-layout">

      <!-- Sidebar -->
      <AppSidebar
        :weatherEmoji="weatherEmoji"
        :isRainy="isRainy"
        :isSunny="isSunny"
        :hasWeather="!!weather"
      />

      <!-- Main panel -->
      <main class="main-panel">
        <SearchBar :isDemoMode="isDemoMode" @search="handleSearch" />

        <LoadingState v-if="loading" :weatherEmoji="weatherEmoji" :searchedCity="searchedCity" />

        <ErrorCard v-else-if="error" :searchedCity="searchedCity" />

        <template v-else-if="weather">
          <WarningStrip v-if="tcws || rainfall" :tcws="tcws" :rainfall="rainfall" />

          <HeroCard
            :cityName="weather.name"
            :conditionLabel="conditionLabel"
            :updatedAt="updatedAt"
            :animatedTemp="animatedTemp"
            :weatherIcon="weatherIcon"
          />

          <HourlyForecast :items="forecastHourly" />

          <AirConditions
            :feelsLike="feelsLike"
            :windLabel="windLabel"
            :humidity="humidity"
            :pressure="pressure"
          />
        </template>

        <EmptyState v-else :quickCities="QUICK_CITIES" @search="handleSearch" />
      </main>

      <!-- 7-day forecast panel -->
      <ForecastPanel
        :loading="loading"
        :weather="weather"
        :forecastDaily="forecastDaily"
      />

    </div>
  </div>
</template>