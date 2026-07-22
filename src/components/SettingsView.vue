<script setup>
const props = defineProps({
  useFahrenheit: { type: Boolean, default: false },
  isDemoMode:    { type: Boolean, default: false },
})
const emit = defineEmits(['toggle-unit'])
</script>

<template>
  <div class="settings-view animate-rise">
    <div class="settings-header">
      <h2 class="settings-title">Settings</h2>
      <p class="settings-subtitle">Customize your weather experience</p>
    </div>

    <!-- Temperature unit -->
    <div class="settings-section">
      <p class="settings-section-label">Temperature Unit</p>
      <div class="settings-unit-row">
        <div class="settings-unit-info">
          <span class="settings-unit-icon">🌡️</span>
          <div>
            <p class="settings-item-title">Display Unit</p>
            <p class="settings-item-desc">Currently showing in {{ useFahrenheit ? 'Fahrenheit (°F)' : 'Celsius (°C)' }}</p>
          </div>
        </div>
        <button
          class="settings-toggle-btn"
          :class="{ 'settings-toggle-btn--active': useFahrenheit }"
          @click="emit('toggle-unit')"
        >
          {{ useFahrenheit ? '°F' : '°C' }}
        </button>
      </div>
    </div>

    <!-- API / Mode info -->
    <div class="settings-section">
      <p class="settings-section-label">Data Source</p>
      <div class="settings-info-card" :class="isDemoMode ? 'info-card--demo' : 'info-card--live'">
        <span class="info-card-dot"></span>
        <div>
          <p class="settings-item-title">{{ isDemoMode ? 'Demo Mode Active' : 'Live API Connected' }}</p>
          <p class="settings-item-desc">
            {{ isDemoMode
              ? 'Using mock Philippine weather data. Add VITE_OPENWEATHER_KEY to .env to switch to live data.'
              : 'Fetching real-time data from OpenWeatherMap API.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- API Key instruction -->
    <div class="settings-section" v-if="isDemoMode">
      <p class="settings-section-label">Connect Live API</p>
      <div class="settings-code-card">
        <p class="code-card-step">1. Create a <strong>.env</strong> file in your project root</p>
        <div class="code-block">VITE_OPENWEATHER_KEY=your_key_here</div>
        <p class="code-card-step">2. Get a free key at <strong>openweathermap.org</strong></p>
        <p class="code-card-step">3. Restart the dev server</p>
      </div>
    </div>

    <!-- About -->
    <div class="settings-section">
      <p class="settings-section-label">About</p>
      <div class="settings-about-card">
        <div class="about-logo">🌤️</div>
        <div>
          <p class="settings-item-title">PH Weather Dashboard</p>
          <p class="settings-item-desc">Real-time Philippine weather with PAGASA-style typhoon and rainfall warnings.</p>
          <p class="settings-item-desc" style="margin-top: 6px; opacity: 0.6;">Powered by OpenWeatherMap · Vue 3 · Vite</p>
        </div>
      </div>
    </div>

  </div>
</template>
