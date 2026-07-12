<script setup>
defineProps({
  cityName:       { type: String, required: true },
  conditionLabel: { type: String, default: '' },
  updatedAt:      { type: String, default: '' },
  animatedTemp:   { type: Number, default: 0 },
  weatherIcon:    { type: String, default: '' },
})
</script>

<template>
  <div class="hero-card animate-rise">
    <div class="hero-left">
      <div class="hero-meta">
        <span class="hero-country">Philippines</span>
        <span class="hero-updated">Updated {{ updatedAt }}</span>
      </div>
      <h1 class="hero-city">{{ cityName }}</h1>
      <p class="hero-condition">{{ conditionLabel }}</p>
      <div class="hero-temp">
        <span class="temp-number">{{ animatedTemp }}</span>
        <span class="temp-unit">°C</span>
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
