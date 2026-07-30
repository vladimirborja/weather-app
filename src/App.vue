<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useWeather }    from './composables/useWeather'
import { useFavourites } from './composables/useFavourites'

import AppSidebar     from './components/AppSidebar.vue'
import MobileNav      from './components/MobileNav.vue'
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
import WeatherAdvisor from './components/WeatherAdvisor.vue'
import FavouritesView from './components/FavouritesView.vue'

const {
  weather,
  forecastHourly,
  forecastDaily,
  loading,
  error,
  isDemoMode,
  uvIndex,
  search,
  searchByCoords
} = useWeather()

const { isFavourite, toggleFavourite, addRecent } = useFavourites()

const animatedTemp   = ref(0)
const searchedCity   = ref('')
const useFahrenheit  = ref(false)
const activeView     = ref('weather')
const lastSearchArgs = ref(null)   // for auto-refresh
const refreshTimer   = ref(null)

// ── Home location — saved on first geolocation or set to Manila fallback ──
const homeLocation   = ref(null)  // { type: 'coords', lat, lon } | { type: 'city', value: string }

// True when user is viewing a manually searched city (not home)
const isSearchedCity = computed(() => {
  if (!homeLocation.value || !lastSearchArgs.value) return false
  const home = homeLocation.value
  const cur  = lastSearchArgs.value
  if (home.type !== cur.type) return true
  if (home.type === 'city')   return home.value !== cur.value
  // coords: consider "home" if within ~1km (0.009 degrees)
  return Math.abs(home.lat - cur.lat) > 0.009 || Math.abs(home.lon - cur.lon) > 0.009
})

// ── City name list for autocomplete (extracted from PH_CITIES in useWeather)
// We expose display names by using a small inline list of all distinct cities
// These are the same cities the composable knows about
const QUICK_CITIES = [
  'Manila', 'Quezon City', 'Makati',
  'Baguio', 'Tagaytay', 'Antipolo',
  'Batanes', 'Laoag', 'Tuguegarao',
  'Cebu', 'Iloilo', 'Bacolod', 'Dumaguete',
  'Tacloban', 'Legazpi',
  'Davao', 'Cagayan de Oro', 'General Santos',
  'Zamboanga', 'Siargao', 'Boracay',
  'Puerto Princesa', 'Butuan',
]

// Full PH city name list for autocomplete dropdown
const PH_CITY_NAMES = [
  'Manila', 'Quezon City', 'Caloocan', 'Las Piñas', 'Makati', 'Malabon',
  'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay',
  'Pasig', 'San Juan', 'Taguig', 'Valenzuela',
  'Laoag', 'Batac', 'Vigan', 'San Fernando', 'Dagupan', 'Urdaneta',
  'Tuguegarao', 'Ilagan', 'Cauayan', 'Santiago',
  'Baguio City', 'Tabuk', 'La Trinidad', 'Sagada',
  'Batanes', 'Basco',
  'Angeles', 'Olongapo', 'Malolos', 'Cabanatuan', 'Tarlac City',
  'Antipolo', 'Bacoor', 'Batangas City', 'Cavite City', 'Dasmariñas',
  'Imus', 'Lipa', 'Lucena', 'San Pablo', 'Santa Rosa', 'Tagaytay',
  'Puerto Princesa', 'Calapan', 'Coron', 'El Nido',
  'Legazpi City', 'Naga City', 'Sorsogon City',
  'Iloilo City', 'Bacolod', 'Roxas City', 'Boracay',
  'Cebu City', 'Lapu-Lapu', 'Mandaue', 'Dumaguete', 'Tagbilaran',
  'Tacloban', 'Ormoc', 'Catbalogan',
  'Zamboanga City', 'Pagadian', 'Dipolog',
  'Cagayan de Oro', 'Iligan', 'Ozamiz', 'Gingoog',
  'Davao City', 'Tagum', 'Mati', 'Digos',
  'General Santos', 'Cotabato City', 'Kidapawan', 'Koronadal',
  'Butuan', 'Surigao City', 'Bislig',
  'Marawi City', 'Siargao', 'Palawan', 'Camiguin', 'Subic Bay',
]

function handleNavChange(view) {
  activeView.value = view
}

// ── Unit conversion ───────────────────────────────────────────
function convertTemp(c) {
  return useFahrenheit.value ? Math.round(c * 9 / 5 + 32) : Math.round(c)
}
const tempUnit = computed(() => useFahrenheit.value ? '°F' : '°C')

// ── Search handlers ───────────────────────────────────────────
function handleSearch(city) {
  if (!city?.trim()) return
  const trimmed = city.trim()
  searchedCity.value = trimmed
  search(trimmed)
  addRecent(trimmed)
  activeView.value = 'weather'
  // Remember for auto-refresh
  lastSearchArgs.value = { type: 'city', value: trimmed }
  // Set home only once (first search if no home is set yet)
  if (!homeLocation.value) homeLocation.value = { type: 'city', value: trimmed }
  resetRefreshTimer()
}

function handleGeolocate({ lat, lon }) {
  searchedCity.value = 'your location'
  searchByCoords(lat, lon)
  lastSearchArgs.value = { type: 'coords', lat, lon }
  // Geolocation always becomes the home reference
  homeLocation.value = { type: 'coords', lat, lon }
  resetRefreshTimer()
}

// ── Go home: restore default/GPS location ────────────────────────────────
function goHome() {
  if (homeLocation.value) {
    const home = homeLocation.value
    if (home.type === 'coords') {
      handleGeolocate({ lat: home.lat, lon: home.lon })
    } else {
      handleSearch(home.value)
    }
  } else {
    // No home set yet — re-trigger GPS, fall back to Manila
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => handleGeolocate({ lat: coords.latitude, lon: coords.longitude }),
        ()           => handleSearch('Manila')
      )
    } else {
      handleSearch('Manila')
    }
  }
  activeView.value = 'weather'
}

// ── Auto-refresh every 10 minutes ────────────────────────────
const REFRESH_INTERVAL = 10 * 60 * 1000

function resetRefreshTimer() {
  if (refreshTimer.value) clearInterval(refreshTimer.value)
  refreshTimer.value = setInterval(() => {
    if (!lastSearchArgs.value) return
    if (lastSearchArgs.value.type === 'city') {
      search(lastSearchArgs.value.value)
    } else {
      searchByCoords(lastSearchArgs.value.lat, lastSearchArgs.value.lon)
    }
  }, REFRESH_INTERVAL)
}

onUnmounted(() => {
  if (refreshTimer.value) clearInterval(refreshTimer.value)
})

// ── Favourite toggle ──────────────────────────────────────────
const currentIsFavourite = computed(() =>
  weather.value ? isFavourite(weather.value.name) : false
)

function handleToggleFavourite() {
  if (weather.value) toggleFavourite(weather.value.name)
}

// ── Animated temp counter ─────────────────────────────────────
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

// ── Theme / visual computed ───────────────────────────────────
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

// ── Weather data computed ─────────────────────────────────────
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

// ── Unit-converted values ─────────────────────────────────────
const displayTemp = computed(() => convertTemp(animatedTemp.value))

const feelsLike = computed(() =>
  weather.value ? convertTemp(weather.value.main.feels_like) : '--'
)

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

const visibility = computed(() => {
  if (!weather.value?.visibility) return '--'
  return (weather.value.visibility / 1000).toFixed(1)
})

const windGust = computed(() => {
  if (!weather.value?.wind?.gust) return ''
  return `${weather.value.wind.gust.toFixed(1)} m/s`
})

const forecastHourlyDisplay = computed(() =>
  forecastHourly.value.map(item => ({
    ...item,
    displayTemp: convertTemp(item.temp)
  }))
)

const forecastDailyDisplay = computed(() =>
  forecastDaily.value.map(d => ({
    ...d,
    displayTempMin: convertTemp(d.tempMin),
    displayTempMax: convertTemp(d.tempMax)
  }))
)

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

      <!-- Sidebar (desktop) -->
      <AppSidebar
        :weatherEmoji="weatherEmoji"
        :isRainy="isRainy"
        :isSunny="isSunny"
        :hasWeather="!!weather"
        :activeView="activeView"
        :isSearchedCity="isSearchedCity"
        @nav-change="handleNavChange"
        @go-home="goHome"
      />

      <!-- Main panel -->
      <main class="main-panel">

        <!-- Search row: always visible -->
        <div class="search-row">
          <!-- Back button (when not on weather view) -->
          <button
            v-if="activeView !== 'weather'"
            id="btn-back"
            class="back-btn"
            aria-label="Back to weather"
            @click="activeView = 'weather'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>

          <SearchBar
            :isDemoMode="isDemoMode"
            :cityNames="PH_CITY_NAMES"
            @search="handleSearch"
            @geolocate="handleGeolocate"
          />

          <!-- Favourite toggle (only when weather is loaded and on weather view) -->
          <button
            v-if="weather && activeView === 'weather'"
            id="btn-favourite"
            class="fav-toggle-btn"
            :class="{ 'fav-toggle-btn--active': currentIsFavourite }"
            :aria-label="currentIsFavourite ? 'Remove from favourites' : 'Add to favourites'"
            :title="currentIsFavourite ? 'Remove from favourites' : 'Save city'"
            @click="handleToggleFavourite"
          >
            <svg viewBox="0 0 24 24" :fill="currentIsFavourite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

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

        <!-- ── View transitions ── -->
        <Transition name="view-slide" mode="out-in">

          <!-- ── Favourites view ── -->
          <FavouritesView
            v-if="activeView === 'favourites'"
            key="favourites"
            @search="handleSearch"
          />

          <!-- ── Cities view ── -->
          <CitiesView
            v-else-if="activeView === 'cities'"
            key="cities"
            :quickCities="QUICK_CITIES"
            :weather="weather"
            @search="handleSearch"
          />

          <!-- ── Wind view ── -->
          <WindView
            v-else-if="activeView === 'wind'"
            key="wind"
            :weather="weather"
            :windLabel="windLabel"
          />

          <!-- ── Settings view ── -->
          <SettingsView
            v-else-if="activeView === 'settings'"
            key="settings"
            :useFahrenheit="useFahrenheit"
            :isDemoMode="isDemoMode"
            @toggle-unit="useFahrenheit = !useFahrenheit"
          />

          <!-- ── Weather view (default) ── -->
          <div v-else key="weather" class="weather-view-wrapper">
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
                :showBack="isSearchedCity"
                @go-home="goHome"
              />

              <HourlyForecast :items="forecastHourlyDisplay" />

              <WeatherAdvisor
                :weather="weather"
                :forecastHourly="forecastHourly"
                :useFahrenheit="useFahrenheit"
              />

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
                :uvIndex="uvIndex"
              />
            </template>

            <EmptyState v-else :quickCities="QUICK_CITIES" @search="handleSearch" />
          </div>

        </Transition>

      </main>

      <!-- 5-day forecast + radar panel -->
      <ForecastPanel
        :loading="loading"
        :weather="weatherDisplay"
        :forecastDaily="forecastDailyDisplay"
        :isDemoMode="isDemoMode"
      />

    </div>

    <!-- Mobile bottom nav -->
    <MobileNav
      :activeView="activeView"
      :weatherEmoji="weatherEmoji"
      @nav-change="handleNavChange"
    />
  </div>
</template>