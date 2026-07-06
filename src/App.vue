<script setup>
import { ref, computed } from 'vue'
import { useWeather } from './composables/useWeather'

const { weather, forecast, loading, error, search, cities } = useWeather()
const selected = ref('')

function handleSelect(city) {
  selected.value = city
  search(city)
}

const bgGradient = computed(() => {
  if (!weather.value) return 'from-[#0f172a] to-[#1e293b]'
  const main = weather.value.weather[0].main.toLowerCase()
  if (main.includes('clear')) return 'from-[#0369a1] to-[#0c4a6e]'
  if (main.includes('cloud')) return 'from-[#334155] to-[#1e293b]'
  if (main.includes('rain') || main.includes('drizzle')) return 'from-[#1e3a5f] to-[#0f172a]'
  if (main.includes('thunder')) return 'from-[#1e1b4b] to-[#0f172a]'
  if (main.includes('mist') || main.includes('haze') || main.includes('fog')) return 'from-[#374151] to-[#1f2937]'
  return 'from-[#0f172a] to-[#1e293b]'
})

function getIcon(code) {
  return `https://openweathermap.org/img/wn/${code}@2x.png`
}

function getTime(dt_txt) {
  return new Date(dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const now = computed(() => {
  return new Date().toLocaleDateString('en-PH', {
    weekday: 'long', month: 'long', day: 'numeric'
  })
})
</script>

<template>
  <main
    class="min-h-screen bg-gradient-to-br transition-all duration-700 flex flex-col items-center px-4 py-12 font-sans"
    :class="bgGradient"
  >
    <!-- Header -->
    <div class="w-full max-w-lg mb-8 text-center">
      <div class="inline-flex items-center gap-2 mb-2">
        <span class="text-2xl">🇵🇭</span>
        <h1 class="text-white text-2xl font-bold tracking-tight">PH Weather</h1>
      </div>
      <p class="text-white/40 text-xs">{{ now }}</p>
    </div>

    <!-- City pills -->
    <div class="flex flex-wrap justify-center gap-2 w-full max-w-lg mb-8">
      <button
        v-for="city in cities"
        :key="city"
        @click="handleSelect(city)"
        class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
        :class="selected === city
          ? 'bg-white text-slate-900 border-white'
          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'"
      >
        {{ city }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-20 flex flex-col items-center gap-3">
      <div class="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      <p class="text-white/50 text-sm">Fetching weather...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="mt-20 text-red-400 text-sm">{{ error }}</div>

    <!-- Weather card -->
    <template v-else-if="weather">
      <div class="w-full max-w-lg">

        <!-- Main card -->
        <div class="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 mb-4 relative overflow-hidden">
          <!-- Glow blob -->
          <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

          <div class="flex items-start justify-between">
            <div>
              <p class="text-white/60 text-sm font-medium">{{ weather.name }}, PH</p>
              <p class="text-white text-8xl font-bold tracking-tighter mt-1">
                {{ Math.round(weather.main.temp) }}<span class="text-4xl align-top mt-4 inline-block font-light">°C</span>
              </p>
              <p class="text-white/70 text-base capitalize mt-1">{{ weather.weather[0].description }}</p>
            </div>
            <img
              :src="getIcon(weather.weather[0].icon)"
              class="w-24 h-24 drop-shadow-2xl -mt-2"
            />
          </div>

          <!-- Stats row -->
          <div class="grid grid-cols-3 gap-3 mt-8">
            <div class="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
              <p class="text-white/40 text-[10px] uppercase tracking-widest mb-1">Feels like</p>
              <p class="text-white font-bold text-lg">{{ Math.round(weather.main.feels_like) }}°</p>
            </div>
            <div class="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
              <p class="text-white/40 text-[10px] uppercase tracking-widest mb-1">Humidity</p>
              <p class="text-white font-bold text-lg">{{ weather.main.humidity }}%</p>
            </div>
            <div class="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
              <p class="text-white/40 text-[10px] uppercase tracking-widest mb-1">Wind</p>
              <p class="text-white font-bold text-lg">{{ weather.wind.speed }}<span class="text-xs font-normal"> m/s</span></p>
            </div>
          </div>
        </div>

        <!-- Forecast strip -->
        <div class="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-5">
          <p class="text-white/40 text-[10px] uppercase tracking-widest mb-4">Next hours</p>
          <div class="flex gap-3 overflow-x-auto pb-1">
            <div
              v-for="item in forecast"
              :key="item.dt"
              class="flex-shrink-0 flex flex-col items-center gap-1 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 min-w-[68px]"
            >
              <p class="text-white/50 text-[10px]">{{ getTime(item.dt_txt) }}</p>
              <img :src="getIcon(item.weather[0].icon)" class="w-9 h-9" />
              <p class="text-white text-sm font-semibold">{{ Math.round(item.main.temp) }}°</p>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- Empty state -->
    <div v-else class="mt-20 text-center">
      <p class="text-5xl mb-4">🌤️</p>
      <p class="text-white/50 text-sm">Pick a city above to see the weather</p>
    </div>

  </main>
</template>