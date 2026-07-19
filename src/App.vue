<script setup>
import { ref, computed, watch } from 'vue'
import { useWeather } from './composables/useWeather'

import AppSidebar     from './components/AppSidebar.vue'
import SearchBar      from './components/SearchBar.vue'
import LoadingState   from './components/LoadingState.vue'
import ErrorCard      from './components/ErrorCard.vue'
import WarningStrip   from './components/WarningStrip.vue'
import HeroCard       from './components/HeroCard.vue'
import HourlyForecast from './components/HourlyForecast.vue'
import AirConditions  from './components/AirConditions.vue'
import EmptyState     from './components/EmptyState.vue'
import ForecastPanel  from './components/ForecastPanel.vue'
import CitiesView     from './components/CitiesView.vue'
import WindView       from './components/WindView.vue'
import SettingsView   from './components/SettingsView.vue'

const {
  weather,
  forecastHourly,
  forecastDaily,
  loading,
  error,
  isDemoMode,
  search,
  searchByCoords
} = useWeather()

const animatedTemp  = ref(0)
const searchedCity  = ref('')
const useFahrenheit = ref(false)
const activeView    = ref('weather')

const QUICK_CITIES = ['Manila', 'Batanes', 'Baguio', 'Siargao', 'Cebu', 'Tagaytay', 'Davao']

function handleNavChange(view) {
  activeView.value = view
}

// ── Unit conversion ──────────────────────────────────────────────
function convertTemp(c) {
  return useFahrenheit.value ? Math.round(c * 9 / 5 + 32) : Math.round(c)
}
const tempUnit = computed(() => useFahrenheit.value ? '°F' : '°C')

// ── Search handlers ──────────────────────────────────────────────
function handleSearch(city) {
  if (!city?.trim()) return
  searchedCity.value = city.trim()
  search(city.trim())
  // Switch to weather view when a city is searched from any views
  activeView.value = 'weather'
}

function handleGeolocate({ lat, lon }) {
  searchedCity.value = 'your location'
  searchByCoords(lat, lon)
}

// Smooth count-up animation on temp change (always in °C internally)
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

// ── Theme / visual computed ──────────────────────────────────────
const weatherIcon = computed(() =>
  weather.value
    ? `https://openweathermap.org/img/wn/${weather.value.weather[0].icon}@4x.png`
    : ''
)

const isRainy = computed(() => {
  if (!weather.value) return false
  return weather.value.weather[0].id < 800
})

const isSunny = computed(() => {
  if (!weather.value) return false
  return weather.value.weather[0].id === 800
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
  if (id === 800)              return '☀️'
  if (id === 801)              return '🌤️'
  if (id === 802)              return '⛅'
  return '☁️'
})

// ── Weather data computed ────────────────────────────────────────
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
const pressure       = computed(() => weather.value?.main?.pressure ?? '--')
const tcws           = computed(() => weather.value?.warning?.tcws ?? null)
const rainfall       = computed(() => weather.value?.warning?.rainfall ?? null)

// ── Unit-converted values ────────────────────────────────────────
// displayTemp: animated °C value converted to selected unit
const displayTemp = computed(() => convertTemp(animatedTemp.value))

// feelsLike in selected unit
const feelsLike = computed(() =>
  weather.value ? convertTemp(weather.value.main.feels_like) : '--'
)

// Sunrise / Sunset from API timestamps
const sunrise = computed(() => {
  if (!weather.value?.sys?.sunrise) return '--'
  return new Date(weather.value.sys.sunrise * 1000)
    .toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true })
})
const sunset = computed(() => {
  if (!weather.value?.sys?.sunset) return '--'
  return new Date(weather.value.sys.sunset * 1000)
    .toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true })
})

// Visibility (metres → km)
const visibility = computed(() => {
  if (!weather.value?.visibility) return '--'
  return (weather.value.visibility / 1000).toFixed(1)
})

// Wind gust (optional — not always in API response)
const windGust = computed(() => {
  if (!weather.value?.wind?.gust) return ''
  return `${weather.value.wind.gust.toFixed(1)} m/s`
})

// Pre-converted hourly forecast (so child component stays presentation-only)
const forecastHourlyDisplay = computed(() =>
  forecastHourly.value.map(item => ({
    ...item,
    displayTemp: convertTemp(item.temp)
  }))
)

// Pre-converted daily forecast
const forecastDailyDisplay = computed(() =>
  forecastDaily.value.map(d => ({
    ...d,
    displayTempMin: convertTemp(d.tempMin),
    displayTempMax: convertTemp(d.tempMax)
  }))
)

// Weather object with pre-converted temps for ForecastPanel's "today" row
const weatherDisplay = computed(() => {
  if (!weather.value) return null
  return {
    ...weather.value,
    main: {
      ...weather.value.main,
      displayTemp:    convertTemp(weather.value.main.temp),
      displayTempMin: convertTemp(weather.value.main.temp_min ?? weather.value.main.temp)
    }
  }
})
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
        :activeView="activeView"
        @nav-change="handleNavChange"
      />

      <!-- Main panel -->
      <main class="main-panel">

        <!-- Search row: always visible -->
        <div class="search-row">
          <SearchBar
            :isDemoMode="isDemoMode"
            @search="handleSearch"
            @geolocate="handleGeolocate"
          />
          <button
            id="btn-unit-toggle"
            class="unit-toggle"
            :class="{ active: useFahrenheit }"
            :aria-label="`Switch to ${useFahrenheit ? 'Celsius' : 'Fahrenheit'}`"
            @click="useFahrenheit = !useFahrenheit"
          >
            {{ useFahrenheit ? '°F' : '°C' }}
          </button>
        </div>

        <!-- ── Cities view ── -->
        <CitiesView
          v-if="activeView === 'cities'"
          :quickCities="QUICK_CITIES"
          :weather="weather"
          @search="handleSearch"
        />

        <!-- ── Wind view ── -->
        <WindView
          v-else-if="activeView === 'wind'"
          :weather="weather"
          :windLabel="windLabel"
        />

        <!-- ── Settings view ── -->
        <SettingsView
          v-else-if="activeView === 'settings'"
          :useFahrenheit="useFahrenheit"
          :isDemoMode="isDemoMode"
          @toggle-unit="useFahrenheit = !useFahrenheit"
        />

        <!-- ── Weather view (default) ── -->
        <template v-else>
          <LoadingState v-if="loading" :weatherEmoji="weatherEmoji" :searchedCity="searchedCity" />

          <ErrorCard v-else-if="error" :searchedCity="searchedCity" />

          <template v-else-if="weather">
            <WarningStrip v-if="tcws || rainfall" :tcws="tcws" :rainfall="rainfall" />

            <HeroCard
              :cityName="weather.name"
              :conditionLabel="conditionLabel"
              :updatedAt="updatedAt"
              :animatedTemp="displayTemp"
              :weatherIcon="weatherIcon"
              :unit="tempUnit"
            />

            <HourlyForecast :items="forecastHourlyDisplay" />

            <AirConditions
              :feelsLike="feelsLike"
              :windLabel="windLabel"
              :humidity="humidity"
              :pressure="pressure"
              :sunrise="sunrise"
              :sunset="sunset"
              :visibility="visibility"
              :windGust="windGust"
              :unit="tempUnit"
            />
          </template>

          <EmptyState v-else :quickCities="QUICK_CITIES" @search="handleSearch" />
        </template>

      </main>

      <!-- 5-day forecast + radar panel -->
      <ForecastPanel
        :loading="loading"
        :weather="weatherDisplay"
        :forecastDaily="forecastDailyDisplay"
        :isDemoMode="isDemoMode"
      />

    </div>
  </div>
</template>