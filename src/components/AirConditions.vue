<script setup>
defineProps({
  feelsLike: { type: [Number, String], default: '--' },
  windLabel: { type: String, default: '--' },
  humidity:  { type: [Number, String], default: '--' },
  pressure:  { type: [Number, String], default: '--' },
})
</script>

<template>
  <div class="section-card animate-rise" style="animation-delay: 0.16s">
    <div class="conditions-header">
      <p class="section-label">AIR CONDITIONS</p>
    </div>
    <div class="conditions-grid">
      <div class="condition-item">
        <div class="condition-icon">🌡️</div>
        <div>
          <p class="condition-label">Real Feel</p>
          <p class="condition-value">{{ feelsLike }}°C</p>
        </div>
      </div>
      <div class="condition-item">
        <div class="condition-icon">💨</div>
        <div>
          <p class="condition-label">Wind</p>
          <p class="condition-value">{{ windLabel }}</p>
        </div>
      </div>
      <div class="condition-item">
        <div class="condition-icon">💧</div>
        <div>
          <p class="condition-label">Humidity</p>
          <p class="condition-value">{{ humidity }}%</p>
        </div>
      </div>
      <div class="condition-item">
        <div class="condition-icon">🔵</div>
        <div>
          <p class="condition-label">Pressure</p>
          <p class="condition-value">{{ pressure }} hPa</p>
        </div>
      </div>
    </div>
  </div>
</template>
