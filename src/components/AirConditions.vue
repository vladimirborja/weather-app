<script setup>
import { computed } from 'vue'

const props = defineProps({
  feelsLike:  { type: [Number, String], default: '--' },
  windLabel:  { type: String,           default: '--' },
  humidity:   { type: [Number, String], default: '--' },
  pressure:   { type: [Number, String], default: '--' },
  sunrise:    { type: String,           default: '--' },
  sunset:     { type: String,           default: '--' },
  visibility: { type: [Number, String], default: '--' },
  windGust:   { type: String,           default: ''   },
  unit:       { type: String,           default: '°C' },
  uvIndex:    { type: [Number, String], default: null  },
})

const uvInfo = computed(() => {
  const uv = Number(props.uvIndex)
  if (props.uvIndex === null || isNaN(uv)) return null
  if (uv <= 2)  return { label: 'Low',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)',   emoji: '😎' }
  if (uv <= 5)  return { label: 'Moderate',  color: '#eab308', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.25)',   emoji: '🕶️' }
  if (uv <= 7)  return { label: 'High',      color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)',  emoji: '🧴' }
  if (uv <= 10) return { label: 'Very High', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   emoji: '⛱️' }
  return             { label: 'Extreme',     color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.25)',  emoji: '🚫' }
})
</script>

<template>
  <div class="section-card animate-rise" style="animation-delay: 0.16s">
    <div class="conditions-header">
      <p class="section-label">AIR CONDITIONS</p>
    </div>
    <div class="conditions-grid">

      <!-- Real Feel -->
      <div class="condition-item">
        <div class="condition-icon">🌡️</div>
        <div>
          <p class="condition-label">Real Feel</p>
          <p class="condition-value">{{ feelsLike }}{{ unit }}</p>
        </div>
      </div>

      <!-- Wind + optional gust -->
      <div class="condition-item">
        <div class="condition-icon">💨</div>
        <div>
          <p class="condition-label">Wind{{ windGust ? ' / Gust' : '' }}</p>
          <p class="condition-value">{{ windLabel }}</p>
          <p v-if="windGust" class="condition-sub">↑ {{ windGust }}</p>
        </div>
      </div>

      <!-- Humidity -->
      <div class="condition-item">
        <div class="condition-icon">💧</div>
        <div>
          <p class="condition-label">Humidity</p>
          <p class="condition-value">{{ humidity }}%</p>
        </div>
      </div>

      <!-- Pressure -->
      <div class="condition-item">
        <div class="condition-icon">🔵</div>
        <div>
          <p class="condition-label">Pressure</p>
          <p class="condition-value">{{ pressure }} hPa</p>
        </div>
      </div>

      <!-- UV Index -->
      <div v-if="uvInfo" class="condition-item uv-item" :style="{ background: uvInfo.bg, border: `1px solid ${uvInfo.border}` }">
        <div class="condition-icon">{{ uvInfo.emoji }}</div>
        <div>
          <p class="condition-label">UV Index</p>
          <p class="condition-value" :style="{ color: uvInfo.color }">
            {{ Math.round(Number(uvIndex)) }}
            <span class="uv-label">{{ uvInfo.label }}</span>
          </p>
        </div>
      </div>

      <!-- Sunrise -->
      <div class="condition-item">
        <div class="condition-icon">🌅</div>
        <div>
          <p class="condition-label">Sunrise</p>
          <p class="condition-value">{{ sunrise }}</p>
        </div>
      </div>

      <!-- Sunset -->
      <div class="condition-item">
        <div class="condition-icon">🌇</div>
        <div>
          <p class="condition-label">Sunset</p>
          <p class="condition-value">{{ sunset }}</p>
        </div>
      </div>

      <!-- Visibility (only shown when available) -->
      <div v-if="visibility !== '--'" class="condition-item">
        <div class="condition-icon">👁️</div>
        <div>
          <p class="condition-label">Visibility</p>
          <p class="condition-value">{{ visibility }} km</p>
        </div>
      </div>

    </div>
  </div>
</template>
