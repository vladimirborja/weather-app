<script setup>
defineProps({
  cityName:       { type: String, required: true },
  conditionLabel: { type: String, default: '' },
  updatedAt:      { type: String, default: '' },
  animatedTemp:   { type: Number, default: 0 },
  weatherIcon:    { type: String, default: '' },
  unit:           { type: String, default: '°C' },
  showBack:       { type: Boolean, default: false },
})
const emit = defineEmits(['go-home'])
</script>

<template>
  <div class="hero-card animate-rise">
    <div class="hero-left">
      <div class="hero-meta">
        <span class="hero-country">Philippines</span>
        <span class="hero-updated">Updated {{ updatedAt }}</span>
      </div>
      <div class="hero-city-row">
        <button
          v-if="showBack"
          class="hero-back-btn"
          aria-label="Back to home location"
          title="Back to home location"
          @click="emit('go-home')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 class="hero-city">{{ cityName }}</h1>
      </div>
      <p class="hero-condition">{{ conditionLabel }}</p>
      <div class="hero-temp">
        <span class="temp-number">{{ animatedTemp }}</span>
        <span class="temp-unit">{{ unit }}</span>
      </div>
    </div>

    <div class="hero-right">
      <img
        v-if="weatherIcon"
        :src="weatherIcon"
        :alt="conditionLabel"
        class="hero-icon animate-float"
      />
    </div>
  </div>
</template>
