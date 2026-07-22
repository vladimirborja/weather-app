<script setup>
import { computed } from 'vue'

const props = defineProps({
  weather: { type: Object, default: null },
  windLabel: { type: String, default: '--' },
})

// Beaufort scale
function beaufortScale(mps) {
  if (mps < 0.3)  return { num: 0, name: 'Calm',          color: '#64748b' }
  if (mps < 1.6)  return { num: 1, name: 'Light Air',     color: '#38bdf8' }
  if (mps < 3.4)  return { num: 2, name: 'Light Breeze',  color: '#34d399' }
  if (mps < 5.5)  return { num: 3, name: 'Gentle Breeze', color: '#a3e635' }
  if (mps < 8.0)  return { num: 4, name: 'Moderate Breeze',color: '#facc15'}
  if (mps < 10.8) return { num: 5, name: 'Fresh Breeze',  color: '#fb923c' }
  if (mps < 13.9) return { num: 6, name: 'Strong Breeze', color: '#f87171' }
  if (mps < 17.2) return { num: 7, name: 'Near Gale',     color: '#e879f9' }
  if (mps < 20.8) return { num: 8, name: 'Gale',          color: '#c084fc' }
  if (mps < 24.5) return { num: 9, name: 'Severe Gale',   color: '#a78bfa' }
  if (mps < 28.5) return { num:10, name: 'Storm',         color: '#818cf8' }
  if (mps < 32.7) return { num:11, name: 'Violent Storm', color: '#6366f1' }
  return             { num:12, name: 'Hurricane Force',    color: '#ef4444' }
}

const windSpeed   = computed(() => props.weather?.wind?.speed ?? 0)
const windDeg     = computed(() => props.weather?.wind?.deg   ?? 0)
const windGust    = computed(() => props.weather?.wind?.gust  ?? null)
const beaufort    = computed(() => beaufortScale(windSpeed.value))
const speedKmh    = computed(() => (windSpeed.value * 3.6).toFixed(1))
const speedKnots  = computed(() => (windSpeed.value * 1.944).toFixed(1))

// Cardinal direction label
const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
const cardinal = computed(() => dirs[Math.round(windDeg.value / 22.5) % 16])

// Beaufort bar fill (0–12 scale)
const barPercent = computed(() => Math.min(100, (beaufort.value.num / 12) * 100))
</script>

<template>
  <div class="wind-view animate-rise">
    <div class="wind-header">
      <h2 class="wind-title">Wind Conditions</h2>
      <p class="wind-subtitle" v-if="weather">{{ weather.name }} · Live Data</p>
      <p class="wind-subtitle" v-else>Search a city to see wind details</p>
    </div>

    <div v-if="weather" class="wind-content">

      <!-- Compass -->
      <div class="wind-compass-wrap">
        <div class="wind-compass">
          <div class="compass-ring">
            <span class="compass-label north">N</span>
            <span class="compass-label south">S</span>
            <span class="compass-label east">E</span>
            <span class="compass-label west">W</span>
            <!-- Arrow -->
            <div class="compass-needle-wrap" :style="{ transform: `rotate(${windDeg}deg)` }">
              <div class="compass-needle"></div>
            </div>
            <!-- Center dot -->
            <div class="compass-center"></div>
          </div>
        </div>
        <div class="compass-info">
          <p class="compass-direction">{{ cardinal }}</p>
          <p class="compass-deg">{{ windDeg }}°</p>
        </div>
      </div>

      <!-- Speed cards -->
      <div class="wind-stats">
        <div class="wind-stat-card">
          <span class="wsc-icon">💨</span>
          <div>
            <p class="wsc-label">Wind Speed</p>
            <p class="wsc-value">{{ windSpeed.toFixed(1) }} <span class="wsc-unit">m/s</span></p>
          </div>
        </div>
        <div class="wind-stat-card">
          <span class="wsc-icon">🚀</span>
          <div>
            <p class="wsc-label">Speed (km/h)</p>
            <p class="wsc-value">{{ speedKmh }} <span class="wsc-unit">km/h</span></p>
          </div>
        </div>
        <div class="wind-stat-card">
          <span class="wsc-icon">⚓</span>
          <div>
            <p class="wsc-label">Speed (knots)</p>
            <p class="wsc-value">{{ speedKnots }} <span class="wsc-unit">kn</span></p>
          </div>
        </div>
        <div class="wind-stat-card" v-if="windGust">
          <span class="wsc-icon">⚡</span>
          <div>
            <p class="wsc-label">Wind Gust</p>
            <p class="wsc-value">{{ windGust.toFixed(1) }} <span class="wsc-unit">m/s</span></p>
          </div>
        </div>
      </div>

      <!-- Beaufort scale -->
      <div class="beaufort-card">
        <div class="beaufort-header">
          <span class="bf-label">Beaufort Scale</span>
          <span class="bf-num" :style="{ color: beaufort.color }">BF {{ beaufort.num }}</span>
        </div>
        <p class="bf-name" :style="{ color: beaufort.color }">{{ beaufort.name }}</p>
        <div class="bf-bar-track">
          <div class="bf-bar-fill" :style="{ width: barPercent + '%', background: beaufort.color }"></div>
        </div>
        <div class="bf-scale-labels">
          <span>0 Calm</span>
          <span>6 Strong</span>
          <span>12 Hurricane</span>
        </div>
      </div>

    </div>

    <!-- Empty state -->
    <div v-else class="wind-empty">
      <div class="wind-empty-icon">💨</div>
      <p>No wind data available.<br>Search a Philippine city above.</p>
    </div>
  </div>
</template>
