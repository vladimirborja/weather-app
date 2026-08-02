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
  if (uv <= 2)  return { label: 'Low',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)'   }
  if (uv <= 5)  return { label: 'Moderate',  color: '#eab308', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.25)'   }
  if (uv <= 7)  return { label: 'High',      color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)'  }
  if (uv <= 10) return { label: 'Very High', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)'   }
  return             { label: 'Extreme',     color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.25)'  }
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
        <div class="condition-icon">
          <!-- Thermometer -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>
        </div>
        <div>
          <p class="condition-label">Real Feel</p>
          <p class="condition-value">{{ feelsLike }}{{ unit }}</p>
        </div>
      </div>

      <!-- Wind + optional gust -->
      <div class="condition-item">
        <div class="condition-icon">
          <!-- Wind -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1011 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>
        </div>
        <div>
          <p class="condition-label">Wind{{ windGust ? ' / Gust' : '' }}</p>
          <p class="condition-value">{{ windLabel }}</p>
          <p v-if="windGust" class="condition-sub">↑ {{ windGust }}</p>
        </div>
      </div>

      <!-- Humidity -->
      <div class="condition-item">
        <div class="condition-icon">
          <!-- Droplet -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
        </div>
        <div>
          <p class="condition-label">Humidity</p>
          <p class="condition-value">{{ humidity }}%</p>
        </div>
      </div>

      <!-- Pressure -->
      <div class="condition-item">
        <div class="condition-icon">
          <!-- Gauge / Activity -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <div>
          <p class="condition-label">Pressure</p>
          <p class="condition-value">{{ pressure }} hPa</p>
        </div>
      </div>

      <!-- UV Index -->
      <div v-if="uvInfo" class="condition-item uv-item" :style="{ background: uvInfo.bg, border: `1px solid ${uvInfo.border}` }">
        <div class="condition-icon">
          <!-- Sun (UV is always solar) -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" :style="{ stroke: uvInfo.color }"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </div>
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
        <div class="condition-icon">
          <!-- Sunrise -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 00-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>
        </div>
        <div>
          <p class="condition-label">Sunrise</p>
          <p class="condition-value">{{ sunrise }}</p>
        </div>
      </div>

      <!-- Sunset -->
      <div class="condition-item">
        <div class="condition-icon">
          <!-- Sunset -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 00-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/></svg>
        </div>
        <div>
          <p class="condition-label">Sunset</p>
          <p class="condition-value">{{ sunset }}</p>
        </div>
      </div>

      <!-- Visibility (only shown when available) -->
      <div v-if="visibility !== '--'" class="condition-item">
        <div class="condition-icon">
          <!-- Eye -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
        <div>
          <p class="condition-label">Visibility</p>
          <p class="condition-value">{{ visibility }} km</p>
        </div>
      </div>

    </div>
  </div>
</template>
