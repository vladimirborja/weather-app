<script setup>
defineProps({
  feelsLike:  { type: [Number, String], default: '--' },
  windLabel:  { type: String,           default: '--' },
  humidity:   { type: [Number, String], default: '--' },
  pressure:   { type: [Number, String], default: '--' },
  sunrise:    { type: String,           default: '--' },
  sunset:     { type: String,           default: '--' },
  visibility: { type: [Number, String], default: '--' },
  windGust:   { type: String,           default: ''   },
  unit:       { type: String,           default: '°C' },
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
