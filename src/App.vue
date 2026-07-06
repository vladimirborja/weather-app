<script setup>
import { ref, computed, watch } from 'vue'
import { useWeather } from './composables/useWeather'
import WeatherRadar from './components/WeatherRadar.vue'

const { weather, forecastHourly, forecastDaily, loading, error, isDemoMode, search } = useWeather()

const query = ref('')
const bulletinNo = ref(0)
const animatedTemp = ref(0)
const svgKey = ref(0)
const activeTab = ref('hourly') // 'hourly' | 'daily'

// Keep track of the last searched query to display on the empty or loading screen
const searchedCity = ref('')

function handleSearch() {
  if (!query.value || !query.value.trim()) return
  directSearch(query.value.trim())
  query.value = ''
}

function directSearch(cityName) {
  if (!cityName || !cityName.trim()) return
  searchedCity.value = cityName.trim()
  bulletinNo.value += 1
  svgKey.value += 1
  activeTab.value = 'hourly'
  search(cityName.trim())
}

// Teletype-style count-in for the temperature display
watch(weather, (w) => {
  if (!w) {
    animatedTemp.value = 0
    return
  }
  const target = Math.round(w.main.temp)
  const start = animatedTemp.value
  const duration = 600
  const t0 = performance.now()
  
  function tick(now) {
    const p = Math.min(1, (now - t0) / duration)
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - p, 3)
    animatedTemp.value = Math.round(start + (target - start) * eased)
    if (p < 1) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
})

// Isobar line path generation based on weather conditions (cyclone center vs calm monsoon waves)
const isobarPaths = computed(() => {
  if (!weather.value) return []
  const hasStorm = weather.value.warning && weather.value.warning.tcws
  if (hasStorm) {
    return [
      'M 200,45 A 25,25 0 1,0 200,46 Z',
      'M 200,45 A 50,50 0 1,0 200,47 Z',
      'M 200,45 A 80,80 0 1,0 200,48 Z',
      'M 200,45 A 110,110 0 1,0 200,49 Z'
    ]
  } else {
    return [
      'M 0,35 C 100,10 200,60 300,20 C 350,5 380,25 400,15',
      'M 0,55 C 80,35 180,80 280,40 C 330,20 370,50 400,35',
      'M 0,75 C 90,60 190,95 290,60 C 340,40 360,75 400,60'
    ]
  }
})

// Wind direction text mapping including local monsoon classification
const windText = computed(() => {
  if (!weather.value || !weather.value.wind) return ''
  const deg = weather.value.wind.deg
  const speed = weather.value.wind.speed
  
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(deg / 22.5) % 16
  const cardinal = directions[index]
  
  // Local monsoon detection based on speed and angles
  let monsoon = ''
  if (deg >= 200 && deg <= 290 && speed > 3.0) {
    monsoon = ' (Habagat / SW Monsoon)'
  } else if ((deg >= 20 && deg <= 110) && speed > 3.0) {
    monsoon = ' (Amihan / NE Monsoon)'
  } else if (deg >= 80 && deg <= 130) {
    monsoon = ' (Easterlies)'
  }
  
  return `${speed.toFixed(1)} m/s ${cardinal}${monsoon}`
})

const issuedAt = computed(() => {
  if (!weather.value) return ''
  return new Date(weather.value.dt * 1000).toLocaleTimeString('en-PH', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  }).toUpperCase()
})

const dateStamp = computed(() => {
  if (!weather.value) return ''
  return new Date(weather.value.dt * 1000).toLocaleDateString('en-PH', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).toUpperCase()
})

const bulletinNoText = computed(() => String(bulletinNo.value).padStart(3, '0'))
</script>

<template>
  <main class="app-grid-bg min-h-screen w-full flex flex-col items-center px-4 py-8 md:py-12 select-none text-ph-cream font-body">
    
    <!-- Masthead -->
    <header class="w-full max-w-2xl flex flex-col sm:flex-row items-center sm:items-baseline justify-between border-b border-dashed border-ph-teal-light pb-4 mb-6">
      <div class="text-center sm:text-left">
        <h1 class="font-display text-ph-cream text-2xl font-bold tracking-[0.2em]">ULAT PANAHON</h1>
        <p class="font-mono text-ph-mint text-xs mt-1 uppercase tracking-wider">National Weather Broadcast Feed</p>
      </div>
      <div class="mt-2 sm:mt-0 text-center sm:text-right">
        <p class="font-mono text-ph-mint text-[11px] tracking-widest">
          PAR MONITORING: ACTIVE · PHT (UTC+8)
        </p>
      </div>
    </header>

    <!-- Console Controller / Search Box -->
    <div class="w-full max-w-2xl mb-8">
      <form @submit.prevent="handleSearch" class="flex flex-col gap-2">
        <label for="city-search" class="font-mono text-ph-mint text-xs tracking-widest uppercase">
          Manual Station Broadcast Query
        </label>
        <div class="relative flex items-stretch">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ph-mint">
            <!-- Terminal prompt symbol -->
            <span class="font-mono font-bold mr-1 text-sm">&gt;</span>
          </span>
          <input
            id="city-search"
            v-model="query"
            type="text"
            placeholder="Type city name (e.g. Manila, Batanes, Baguio, Siargao)..."
            class="w-full font-mono text-sm pl-8 pr-12 py-3.5 bg-ph-teal-dark border border-ph-teal-light rounded-l-md text-ph-cream focus:outline-none focus:border-ph-gold transition-colors placeholder:text-ph-teal-light text-ellipsis"
            autocomplete="off"
            required
            aria-required="true"
          />
          <button
            type="submit"
            class="px-5 bg-ph-teal-light border-y border-r border-ph-teal-light hover:bg-ph-mint hover:text-ph-teal-dark font-mono text-xs font-bold tracking-widest uppercase rounded-r-md transition-colors text-ph-cream focus:outline-none"
            aria-label="Submit Weather Search Query"
          >
            <!-- Search Icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>

    <!-- MAIN TELEMETRY CONTENT FEED -->
    
    <!-- 1. LOADING STATE -->
    <div v-if="loading" class="w-full max-w-2xl min-h-[300px] border border-ph-teal-light bg-ph-teal-dark/60 rounded p-8 flex flex-col items-center justify-center gap-4 text-center">
      <div class="flex items-center gap-3">
        <span class="w-2.5 h-2.5 rounded-full bg-ph-gold animate-ping-slow"></span>
        <p class="font-mono text-ph-gold text-sm tracking-widest blink">SYNCHRONIZING BEACON DIAL...</p>
      </div>
      <p class="font-mono text-ph-mint text-[11px] max-w-sm">
        Receiving telemetry packet downlink for station '{{ searchedCity }}' via PH-WEATHER-SAT-4. Establishing parity stream...
      </p>
      <!-- Vintage visual loader bar -->
      <div class="w-48 h-3 bg-ph-teal-dark border border-ph-teal-light rounded relative overflow-hidden mt-2">
        <div class="h-full bg-ph-mint animate-pulse w-3/4 transition-all duration-[1.4s]"></div>
      </div>
    </div>

    <!-- 2. ERROR STATE / ARCHIPELAGO BORDER EXCLUSION -->
    <div v-else-if="error" class="w-full max-w-2xl border border-ph-red/60 bg-ph-red/5 rounded p-6 md:p-8 flex flex-col gap-3">
      <div class="flex items-center gap-2 text-ph-red">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="font-mono text-sm font-bold uppercase tracking-widest">Downlink Failure</span>
      </div>
      <p class="font-mono text-[#fcdcd3] text-[13px] leading-relaxed">
        {{ error }}
      </p>
      <div class="border-t border-ph-red/20 pt-3 flex flex-wrap gap-2 text-[10px] font-mono text-ph-red/80 uppercase">
        <span>ERR_CODE: MET_DIAL_REFUSED</span>
        <span>·</span>
        <span>SYS_STATUS: LOCAL_BUFFER_RUNNING</span>
      </div>
    </div>

    <!-- 3. SUCCESS STATE: BULLETIN BOARD & DOPPLER SCANNER -->
    <div v-else-if="weather" class="w-full max-w-2xl flex flex-col gap-6">
      
      <!-- Demo Mode alert notification -->
      <div v-if="isDemoMode" class="w-full flex items-center justify-between px-4 py-2 border border-ph-gold/40 bg-ph-gold/5 rounded text-ph-gold text-xs font-mono">
        <span class="blink">● STATION SIMULATOR ENGAGED</span>
        <span>MOCK DATA TRANSMISSION ACTIVE</span>
      </div>

      <!-- The Official Bulletin Page -->
      <article class="bulletin-sheet bg-ph-cream text-ph-teal-dark border-t-4 border-dashed border-ph-teal-light rounded shadow-2xl overflow-hidden relative">
        <!-- Punch card punch holes decoration on the left/right edges -->
        <div class="absolute left-0 top-0 bottom-0 w-2.5 flex flex-col justify-around py-4 pointer-events-none opacity-30">
          <div v-for="i in 12" :key="i" class="w-1.5 h-1.5 rounded-full bg-ph-teal-dark"></div>
        </div>
        <div class="absolute right-0 top-0 bottom-0 w-2.5 flex flex-col justify-around py-4 pointer-events-none opacity-30">
          <div v-for="i in 12" :key="i" class="w-1.5 h-1.5 rounded-full bg-ph-teal-dark"></div>
        </div>

        <div class="px-6 md:px-8 py-5 md:py-6 border-b border-ph-teal-light/20 flex justify-between items-baseline">
          <span class="font-mono text-[10px] font-bold text-ph-teal-light tracking-[0.2em]">BULLETIN {{ bulletinNoText }}</span>
          <span class="font-mono text-[10px] text-ph-teal-light tracking-[0.1em] font-semibold">{{ dateStamp }} // {{ issuedAt }} H</span>
        </div>

        <div class="px-6 md:px-8 py-4 relative">
          <!-- Concentric pressure waves SVG container -->
          <svg :key="svgKey" viewBox="0 0 400 90" class="isobar absolute left-0 right-0 top-4 w-full h-24 opacity-[0.06] pointer-events-none">
            <path v-for="(path, i) in isobarPaths" :key="i" :d="path" fill="none" stroke="#0b2b26" stroke-width="1.5" />
          </svg>

          <!-- Warning strip in case of severe wind or rain -->
          <div v-if="weather.warning && (weather.warning.tcws || weather.warning.rainfall)" class="mb-4 flex flex-col gap-1.5 relative z-10 font-mono text-[10px]">
            <!-- Wind signal warning -->
            <div v-if="weather.warning.tcws" class="px-3 py-2 bg-ph-red text-ph-cream font-bold flex items-center justify-between border-l-4 border-ph-gold animate-pulse">
              <span>⚠️ PAGASA SIGNAL NO. {{ weather.warning.tcws.signal }} IN EFFECT</span>
              <span class="uppercase text-[9px] tracking-wider">{{ weather.warning.tcws.text }}</span>
            </div>
            <!-- Rainfall warning -->
            <div v-if="weather.warning.rainfall" class="px-3 py-2 text-ph-cream font-bold flex items-center justify-between"
                 :class="{
                   'bg-ph-red': weather.warning.rainfall.alert === 'Red',
                   'bg-ph-orange': weather.warning.rainfall.alert === 'Orange',
                   'bg-ph-yellow text-ph-teal-dark': weather.warning.rainfall.alert === 'Yellow'
                 }">
              <span>🌊 RAINFALL LEVEL: {{ weather.warning.rainfall.alert }}</span>
              <span class="uppercase text-[9px] tracking-wider font-semibold">{{ weather.warning.rainfall.text }}</span>
            </div>
          </div>

          <!-- Current Weather Core Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">
            <div>
              <p class="font-mono text-xs uppercase tracking-widest text-ph-teal-light/75">METEOROLOGICAL STATION</p>
              <h2 class="font-display text-3xl font-bold tracking-tight text-ph-teal mt-0.5">{{ weather.name }}</h2>
              
              <!-- Large animated temp display -->
              <div class="flex items-baseline mt-2">
                <span class="font-display text-6xl md:text-7xl font-bold tracking-tighter text-ph-teal-dark tabular-nums">
                  {{ animatedTemp }}
                </span>
                <span class="font-display text-2xl font-bold text-ph-teal-light align-top ml-1">°C</span>
              </div>
              <p class="font-mono text-xs text-ph-teal-light capitalize mt-1.5 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-ph-teal-light"></span>
                {{ weather.weather[0].description }}
              </p>
            </div>

            <!-- Doppler Radar Simulation integrated inline -->
            <div class="w-full">
              <WeatherRadar :weather="weather" :isDemoMode="isDemoMode" />
            </div>
          </div>
        </div>

        <!-- Metric parameters footer grid -->
        <div class="grid grid-cols-3 border-t border-ph-teal-light/20 bg-ph-teal-light/5 text-center divide-x divide-ph-teal-light/20 relative z-10">
          <div class="py-3 px-2 flex flex-col items-center">
            <span class="font-mono text-[9px] tracking-widest text-ph-teal-light/70 uppercase">FEELS LIKE</span>
            <span class="font-mono text-base font-bold text-ph-teal-dark mt-0.5">{{ Math.round(weather.main.feels_like) }}°C</span>
          </div>
          <div class="py-3 px-2 flex flex-col items-center">
            <span class="font-mono text-[9px] tracking-widest text-ph-teal-light/70 uppercase">HUMIDITY</span>
            <span class="font-mono text-base font-bold text-ph-teal-dark mt-0.5">{{ weather.main.humidity }}%</span>
          </div>
          <div class="py-3 px-2 flex flex-col items-center">
            <span class="font-mono text-[9px] tracking-widest text-ph-teal-light/70 uppercase">WIND FEED</span>
            <span class="font-mono text-xs font-bold text-ph-teal-dark mt-1 tracking-tight truncate max-w-full">
              {{ windText }}
            </span>
          </div>
        </div>
      </article>

      <!-- FORECAST STATION CENTER -->
      <section class="border border-ph-teal-light bg-ph-teal-dark/50 rounded overflow-hidden">
        
        <!-- Toggle header tabs -->
        <div class="flex border-b border-ph-teal-light bg-ph-teal-dark font-mono text-xs text-ph-mint tracking-wider">
          <button
            @click="activeTab = 'hourly'"
            class="flex-1 py-3 px-4 text-center font-bold transition-colors focus:outline-none"
            :class="activeTab === 'hourly' ? 'bg-ph-teal-light text-ph-cream border-b-2 border-ph-gold' : 'hover:bg-ph-teal-light/30 text-ph-mint'"
            role="tab"
            aria-selected="activeTab === 'hourly'"
          >
            HOURLY TRANSMISSION (24H)
          </button>
          <button
            @click="activeTab = 'daily'"
            class="flex-1 py-3 px-4 text-center font-bold transition-colors focus:outline-none"
            :class="activeTab === 'daily' ? 'bg-ph-teal-light text-ph-cream border-b-2 border-ph-gold' : 'hover:bg-ph-teal-light/30 text-ph-mint'"
            role="tab"
            aria-selected="activeTab === 'daily'"
          >
            5-DAY OUTLOOK BULLETIN
          </button>
        </div>

        <!-- Tab 1: Hourly Forecast -->
        <div v-if="activeTab === 'hourly'" class="p-4" role="tabpanel">
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <div
              v-for="(item, i) in forecastHourly"
              :key="item.dt"
              class="flex-shrink-0 flex flex-col items-center gap-1.5 py-3 px-4 min-w-[76px] rounded bg-ph-teal-dark border border-ph-teal-light/30"
            >
              <!-- 3-Hour Time format -->
              <span class="font-mono text-[10px] text-ph-mint">
                {{ new Date(item.dt_txt).toLocaleTimeString('en-PH', { hour: 'numeric', hour12: true }).toUpperCase() }}
              </span>
              <!-- Standard code representation, styled to match theme -->
              <span class="font-mono text-[9px] uppercase tracking-tighter text-[#fcdcd3] text-center w-full truncate" :title="item.description">
                {{ item.description }}
              </span>
              <!-- Forecast Temperature -->
              <span class="font-mono text-sm font-bold text-ph-cream mt-0.5">
                {{ Math.round(item.temp) }}°
              </span>
            </div>
          </div>
        </div>

        <!-- Tab 2: Daily Outlook Forecast -->
        <div v-else-if="activeTab === 'daily'" class="p-4 flex flex-col gap-2.5" role="tabpanel">
          <div
            v-for="day in forecastDaily"
            :key="day.date"
            class="flex items-center justify-between p-3 rounded bg-ph-teal-dark border border-ph-teal-light/30 font-mono text-xs"
          >
            <div class="flex flex-col">
              <span class="font-bold text-ph-cream">{{ day.dayName }}</span>
              <span class="text-[9px] text-ph-mint">{{ day.dateStr }}</span>
            </div>
            
            <div class="flex-grow mx-4 text-left">
              <span class="text-ph-mint capitalize text-[10px]">{{ day.description }}</span>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-ph-mint/60 text-[10px]">MIN: {{ Math.round(day.tempMin) }}°</span>
              <span class="w-12 h-1.5 bg-ph-teal-light rounded overflow-hidden flex relative">
                <!-- Visual relative temperature offset bar -->
                <span class="h-full bg-ph-gold rounded absolute left-[20%] right-[20%]"></span>
              </span>
              <span class="text-ph-gold font-bold">MAX: {{ Math.round(day.tempMax) }}°</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 4. STANDBY EMPTY STATE -->
    <div v-else class="w-full max-w-2xl border border-ph-teal-light bg-ph-teal-dark/40 rounded p-8 flex flex-col items-center justify-center text-center gap-4">
      <div class="flex items-center gap-2 text-ph-mint">
        <span class="w-2.5 h-2.5 rounded-full bg-ph-mint animate-pulse"></span>
        <span class="font-mono text-xs tracking-widest uppercase">Beacon Receiver Standby</span>
      </div>
      <p class="font-mono text-ph-mint text-xs max-w-md leading-relaxed">
        Satellite dialer is ready to listen. Please enter a Philippine municipality or capital city name into the control console above to download today's meteorology forecast.
      </p>
      
      <!-- Typing suggestions box -->
      <div class="mt-4 border border-[#173f38] rounded-md p-4 bg-ph-teal-dark/60 text-left w-full max-w-md">
        <h3 class="font-mono text-[10px] font-semibold text-ph-gold tracking-widest uppercase mb-2">ARCHIPELAGO TRANSMISSION DIRECTORIES</h3>
        <div class="flex flex-wrap gap-2 text-[10px] font-mono">
          <button @click="directSearch('Manila')" class="px-2 py-1 border border-ph-teal-light rounded hover:border-ph-gold transition-colors text-ph-mint hover:text-ph-gold focus:outline-none">
            Manila (Metro)
          </button>
          <button @click="directSearch('Batanes')" class="px-2 py-1 border border-ph-teal-light rounded hover:border-ph-gold transition-colors text-ph-mint hover:text-ph-gold focus:outline-none">
            Batanes (Typhoon Warning)
          </button>
          <button @click="directSearch('Baguio')" class="px-2 py-1 border border-ph-teal-light rounded hover:border-ph-gold transition-colors text-ph-mint hover:text-ph-gold focus:outline-none">
            Baguio (Mountain Fog)
          </button>
          <button @click="directSearch('Siargao')" class="px-2 py-1 border border-ph-teal-light rounded hover:border-ph-gold transition-colors text-ph-mint hover:text-ph-gold focus:outline-none">
            Siargao (Coastal Ocean Winds)
          </button>
          <button @click="directSearch('Cebu')" class="px-2 py-1 border border-ph-teal-light rounded hover:border-ph-gold transition-colors text-ph-mint hover:text-ph-gold focus:outline-none">
            Cebu (Sunny Reef)
          </button>
          <button @click="directSearch('Tagaytay')" class="px-2 py-1 border border-ph-teal-light rounded hover:border-ph-gold transition-colors text-ph-mint hover:text-ph-gold focus:outline-none">
            Tagaytay (Cool Drizzle)
          </button>
          <button @click="directSearch('Davao')" class="px-2 py-1 border border-ph-teal-light rounded hover:border-ph-gold transition-colors text-ph-mint hover:text-ph-gold focus:outline-none">
            Davao (Calm Waters)
          </button>
        </div>
      </div>
    </div>

    <!-- Technical Footer -->
    <footer class="w-full max-w-2xl border-t border-dashed border-ph-teal-light pt-4 mt-12 text-center text-[10px] font-mono text-ph-mint/60 flex flex-col sm:flex-row justify-between gap-2">
      <span>Downlinked telemetry source: OpenWeather SAT network</span>
      <span>Handcrafted for PAGASA area calibration © 2026</span>
    </footer>
  </main>
</template>

<style scoped>
/* Core bulletin sheet background shading details */
.bulletin-sheet {
  background-color: var(--color-ph-cream);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
}

.scrollbar-thin::-webkit-scrollbar {
  height: 5px;
}

@keyframes telemetry-blink {
  to {
    opacity: 0.3;
  }
}
</style>