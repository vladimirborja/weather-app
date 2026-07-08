<script setup>
import { ref, computed, watch } from 'vue'
import { useWeather } from './composables/useWeather'
import WeatherRadar from './components/WeatherRadar.vue'

const { weather, forecastHourly, forecastDaily, loading, error, isDemoMode, search } = useWeather()

const query       = ref('')
const animatedTemp = ref(0)
const activeTab   = ref('hourly')
const searchedCity = ref('')

function handleSearch() {
  if (!query.value?.trim()) return
  directSearch(query.value.trim())
  query.value = ''
}

function directSearch(city) {
  if (!city?.trim()) return
  searchedCity.value = city.trim()
  activeTab.value = 'hourly'
  search(city.trim())
}

// Smooth count-up on temp change
watch(weather, (w) => {
  if (!w) { animatedTemp.value = 0; return }
  const target = Math.round(w.main.temp)
  const start  = animatedTemp.value
  const t0     = performance.now()
  const dur    = 600
  const tick   = (now) => {
    const p = Math.min(1, (now - t0) / dur)
    animatedTemp.value = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3)))
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

const weatherIcon = computed(() =>
  weather.value
    ? `https://openweathermap.org/img/wn/${weather.value.weather[0].icon}@4x.png`
    : ''
)

const windLabel = computed(() => {
  if (!weather.value?.wind) return ''
  const { speed, deg } = weather.value.wind
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  const cardinal = dirs[Math.round(deg / 22.5) % 16]
  let tag = ''
  if (deg >= 200 && deg <= 290 && speed > 3)     tag = ' · Habagat'
  else if (deg >= 20 && deg <= 110 && speed > 3) tag = ' · Amihan'
  return `${speed.toFixed(1)} m/s ${cardinal}${tag}`
})

const updatedAt = computed(() => {
  if (!weather.value) return ''
  return new Date(weather.value.dt * 1000)
    .toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true })
})

// Warning helpers for friendlier labels
const tcws = computed(() => weather.value?.warning?.tcws ?? null)
const rainfall = computed(() => weather.value?.warning?.rainfall ?? null)

// Background gradient shifts per weather condition
const cardGradient = computed(() => {
  if (!weather.value) return ''
  const id = weather.value.weather[0].id
  if (id >= 200 && id <= 232)   return 'from-slate-800/80 to-purple-900/60'   // thunder
  if (id >= 500 && id <= 531)   return 'from-blue-900/80 to-teal-900/60'      // rain
  if (id >= 600 && id <= 622)   return 'from-sky-900/80 to-slate-800/60'      // snow/edge case
  if (id >= 700 && id <= 781)   return 'from-stone-800/80 to-teal-900/60'     // fog/mist
  if (id === 800)                return 'from-sky-800/80 to-teal-800/60'       // clear
  return 'from-teal-900/80 to-blue-900/60'                                     // clouds
})
</script>

<template>
  <div class="page-bg dot-grid min-h-screen w-full">
    <main class="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

      <!-- ── Header ───────────────────────────────────────── -->
      <header class="flex items-center justify-between pt-2">
        <div>
          <h1 class="font-display text-white text-xl font-bold tracking-tight">
            🌤️ Ulat Panahon
          </h1>
          <p class="text-sky-300/70 text-xs mt-0.5">Philippine Weather · PHT (UTC+8)</p>
        </div>
        <div v-if="isDemoMode && weather"
             class="text-xs bg-amber-400/10 border border-amber-400/30 text-amber-300 rounded-full px-3 py-1 font-medium">
          Demo mode
        </div>
      </header>

      <!-- ── Search ────────────────────────────────────────── -->
      <form @submit.prevent="handleSearch" class="relative">
        <label for="city-search" class="sr-only">Search for a Philippine city</label>
        <div class="flex">
          <input
            id="city-search"
            v-model="query"
            type="text"
            placeholder="Search a city — Manila, Baguio, Siargao..."
            class="w-full bg-white/10 border border-white/15 text-white placeholder:text-white/35 rounded-2xl rounded-r-none px-5 py-4 text-sm font-body focus:outline-none focus:border-jade/60 focus:bg-white/15 transition-all"
            autocomplete="off"
          />
          <button
            type="submit"
            class="bg-jade text-teal-900 font-semibold px-5 rounded-2xl rounded-l-none hover:bg-jade-light active:scale-95 transition-all focus:outline-none shrink-0"
            aria-label="Search"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
          </button>
        </div>
      </form>

      <!-- ── Loading skeleton ─────────────────────────────── -->
      <div v-if="loading" class="flex flex-col gap-4">
        <!-- Skeleton card -->
        <div class="weather-card p-6 flex flex-col gap-4">
          <div class="skeleton h-5 w-1/3"></div>
          <div class="skeleton h-16 w-1/2"></div>
          <div class="skeleton h-4 w-1/4"></div>
          <div class="grid grid-cols-3 gap-3 mt-2">
            <div class="skeleton h-16 rounded-xl"></div>
            <div class="skeleton h-16 rounded-xl"></div>
            <div class="skeleton h-16 rounded-xl"></div>
          </div>
        </div>
        <div class="text-center text-sky-300/60 text-sm animate-pulse">
          Fetching weather for {{ searchedCity }}…
        </div>
      </div>

      <!-- ── Error ────────────────────────────────────────── -->
      <div v-else-if="error"
           class="glass-card p-6 flex flex-col gap-3 border-rose-400/20 bg-rose-500/5 animate-fade-up">
        <div class="flex items-center gap-2 text-rose-400">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
          <span class="font-semibold text-sm">City not found</span>
        </div>
        <p class="text-rose-200/80 text-sm leading-relaxed">
          We couldn't find weather data for <strong>"{{ searchedCity }}"</strong>.
          Make sure it's a Philippine city — try <em>Manila</em>, <em>Cebu City</em>, or <em>Davao</em>.
        </p>
      </div>

      <!-- ── Weather card ─────────────────────────────────── -->
      <template v-else-if="weather">

        <!-- Warnings (friendly banners) -->
        <div v-if="tcws || rainfall" class="flex flex-col gap-2 animate-fade-up">
          <div v-if="tcws"
               class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-500/15 border border-rose-400/30 text-rose-200">
            <span class="text-xl shrink-0">🌀</span>
            <div>
              <p class="font-semibold text-sm">Typhoon Warning · Signal No. {{ tcws.signal }}</p>
              <p class="text-xs text-rose-300/80 mt-0.5">{{ tcws.text }}</p>
            </div>
          </div>
          <div v-if="rainfall"
               class="flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm"
               :class="{
                 'bg-rose-500/10 border-rose-400/30 text-rose-200':   rainfall.alert === 'Red',
                 'bg-orange-500/10 border-orange-400/30 text-orange-200': rainfall.alert === 'Orange',
                 'bg-yellow-500/10 border-yellow-400/30 text-yellow-200': rainfall.alert === 'Yellow',
               }">
            <span class="text-xl shrink-0">🌧️</span>
            <div>
              <p class="font-semibold">{{ rainfall.alert }} Rainfall Warning</p>
              <p class="text-xs opacity-75 mt-0.5 capitalize">{{ rainfall.text.toLowerCase() }}</p>
            </div>
          </div>
        </div>

        <!-- Main weather card -->
        <article class="weather-card animate-fade-up">
          <!-- Top bar: location + time -->
          <div class="flex items-start justify-between px-6 pt-6">
            <div>
              <p class="text-jade/80 text-xs font-semibold uppercase tracking-widest">Philippines</p>
              <h2 class="font-display text-white text-2xl font-bold mt-0.5 leading-tight">
                {{ weather.name }}
              </h2>
              <p class="text-sky-300/60 text-xs mt-1">Updated {{ updatedAt }}</p>
            </div>
            <!-- Weather icon -->
            <img
              v-if="weatherIcon"
              :src="weatherIcon"
              :alt="weather.weather[0].description"
              class="w-20 h-20 -mt-2 -mr-1 animate-float drop-shadow-lg"
            />
          </div>

          <!-- Temperature + description -->
          <div class="px-6 pb-2 mt-1">
            <div class="flex items-baseline gap-1">
              <span class="font-display text-7xl font-bold text-white tabular-nums leading-none">
                {{ animatedTemp }}
              </span>
              <span class="font-display text-3xl text-white/50 font-medium">°C</span>
            </div>
            <p class="text-sky-200/70 text-sm capitalize mt-1">{{ weather.weather[0].description }}</p>
          </div>

          <!-- Stat pills -->
          <div class="grid grid-cols-3 gap-2 px-6 mt-4 pb-2">
            <div class="bg-white/6 rounded-xl p-3 flex flex-col items-center gap-1">
              <span class="text-lg">🌡️</span>
              <span class="text-white font-semibold text-sm">{{ Math.round(weather.main.feels_like) }}°C</span>
              <span class="text-sky-300/60 text-xs">Feels like</span>
            </div>
            <div class="bg-white/6 rounded-xl p-3 flex flex-col items-center gap-1">
              <span class="text-lg">💧</span>
              <span class="text-white font-semibold text-sm">{{ weather.main.humidity }}%</span>
              <span class="text-sky-300/60 text-xs">Humidity</span>
            </div>
            <div class="bg-white/6 rounded-xl p-3 flex flex-col items-center gap-1">
              <span class="text-lg">💨</span>
              <span class="text-white font-semibold text-sm">{{ weather.wind.speed.toFixed(1) }} m/s</span>
              <span class="text-sky-300/60 text-xs">{{ windLabel.split(' ')[2] || 'Wind' }}</span>
            </div>
          </div>

          <!-- Monsoon tag if relevant -->
          <div v-if="windLabel.includes('·')" class="px-6 pb-5 mt-1">
            <span class="inline-flex items-center gap-1.5 text-xs text-jade/80 bg-jade/10 border border-jade/20 rounded-full px-3 py-1">
              🌬️ {{ windLabel.split('·')[1]?.trim() }} season
            </span>
          </div>
          <div v-else class="pb-4"></div>

          <!-- Radar strip -->
          <div class="border-t border-white/8 px-6 pt-4 pb-5">
            <p class="text-sky-300/60 text-xs font-medium uppercase tracking-wider mb-3">Live Radar</p>
            <WeatherRadar :weather="weather" :isDemoMode="isDemoMode" />
          </div>
        </article>

        <!-- ── Forecast ─────────────────────────────────── -->
        <div class="glass-card overflow-hidden animate-fade-up">
          <!-- Tabs -->
          <div class="flex border-b border-white/8">
            <button
              @click="activeTab = 'hourly'"
              class="flex-1 py-3.5 text-sm font-semibold transition-colors"
              :class="activeTab === 'hourly'
                ? 'text-jade border-b-2 border-jade -mb-px'
                : 'text-white/40 hover:text-white/70'"
            >Hourly</button>
            <button
              @click="activeTab = 'daily'"
              class="flex-1 py-3.5 text-sm font-semibold transition-colors"
              :class="activeTab === 'daily'
                ? 'text-jade border-b-2 border-jade -mb-px'
                : 'text-white/40 hover:text-white/70'"
            >5-Day</button>
          </div>

          <!-- Hourly -->
          <div v-if="activeTab === 'hourly'" class="p-4">
            <div class="flex gap-2.5 overflow-x-auto pb-1">
              <div
                v-for="item in forecastHourly"
                :key="item.dt"
                class="fade-up-item flex-shrink-0 flex flex-col items-center gap-2 bg-white/6 hover:bg-white/10 transition-colors rounded-2xl px-4 py-3 min-w-[76px] cursor-default"
              >
                <span class="text-sky-300/70 text-xs font-medium">
                  {{ new Date(item.dt_txt).toLocaleTimeString('en-PH', { hour: 'numeric', hour12: true }) }}
                </span>
                <img
                  :src="`https://openweathermap.org/img/wn/${item.icon}@2x.png`"
                  :alt="item.description"
                  class="w-9 h-9"
                />
                <span class="text-white font-semibold text-sm">{{ Math.round(item.temp) }}°</span>
              </div>
            </div>
          </div>

          <!-- Daily -->
          <div v-else class="p-4 flex flex-col gap-2">
            <div
              v-for="day in forecastDaily"
              :key="day.date"
              class="fade-up-item flex items-center gap-4 hover:bg-white/5 rounded-xl px-3 py-2.5 transition-colors"
            >
              <div class="w-12 shrink-0">
                <p class="text-white font-semibold text-sm">{{ day.dayName }}</p>
                <p class="text-sky-300/50 text-xs">{{ day.dateStr }}</p>
              </div>
              <p class="flex-grow text-sky-200/60 text-xs capitalize truncate">{{ day.description }}</p>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-sky-400/60 text-sm">{{ Math.round(day.tempMin) }}°</span>
                <!-- Temp range bar -->
                <div class="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full rounded-full bg-gradient-to-r from-jade/60 to-sun"></div>
                </div>
                <span class="text-white font-semibold text-sm">{{ Math.round(day.tempMax) }}°</span>
              </div>
            </div>
          </div>
        </div>

      </template>

      <!-- ── Empty state ──────────────────────────────────── -->
      <div v-else class="flex flex-col items-center text-center pt-4 pb-8 gap-6 animate-fade-up">
        <!-- Decorative illustration -->
        <div class="text-7xl animate-float select-none" aria-hidden="true">🏝️</div>
        <div>
          <h2 class="font-display text-white text-xl font-semibold">Where's the weather today?</h2>
          <p class="text-sky-300/60 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            Type any city in the Philippines above — from Batanes in the north to Tawi-Tawi down south.
          </p>
        </div>

        <!-- Quick city chips -->
        <div class="flex flex-wrap justify-center gap-2 max-w-sm">
          <button
            v-for="city in ['Manila', 'Batanes', 'Baguio', 'Siargao', 'Cebu', 'Tagaytay', 'Davao']"
            :key="city"
            @click="directSearch(city)"
            class="px-4 py-2 rounded-full bg-white/8 border border-white/12 text-sky-200 text-sm hover:bg-white/15 hover:border-jade/40 hover:text-jade transition-all active:scale-95 focus:outline-none"
          >
            {{ city }}
          </button>
        </div>
      </div>

      <!-- ── Footer ───────────────────────────────────────── -->
      <footer class="text-center text-sky-400/30 text-xs pb-4">
        Powered by OpenWeather · Philippine Area of Responsibility
      </footer>

    </main>
  </div>
</template>

<style scoped>
/* token shorthand for custom colours — Tailwind v4 custom props */
.text-jade     { color: var(--color-jade); }
.bg-jade       { background-color: var(--color-jade); }
.bg-jade\/10   { background-color: color-mix(in srgb, var(--color-jade) 10%, transparent); }
.border-jade   { border-color: var(--color-jade); }
.border-jade\/20 { border-color: color-mix(in srgb, var(--color-jade) 20%, transparent); }
.text-jade\/80 { color: color-mix(in srgb, var(--color-jade) 80%, transparent); }
.from-jade\/60 { --tw-gradient-from: color-mix(in srgb, var(--color-jade) 60%, transparent); }
.text-sun      { color: var(--color-sun); }
.to-sun        { --tw-gradient-to: var(--color-sun); }

/* Jade hover for search button */
.bg-jade:hover { background-color: var(--color-jade-light); }
</style>