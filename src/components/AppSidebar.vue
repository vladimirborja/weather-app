<script setup>
defineProps({
  weatherEmoji: { type: String, default: '🌤️' },
  isRainy:      { type: Boolean, default: false },
  isSunny:      { type: Boolean, default: false },
  hasWeather:   { type: Boolean, default: false },
  activeView:   { type: String, default: 'weather' },
})
const emit = defineEmits(['nav-change'])
</script>

<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="">
      <div class="">
        <span>{{ weatherEmoji }}</span>
      </div>
    </div>

    <!-- Nav Icons -->
    <nav class="sidebar-nav" aria-label="Main navigation">
      <button
        class="nav-btn"
        :class="{ active: activeView === 'weather' }"
        id="nav-weather"
        aria-label="Weather"
        title="Weather"
        @click="emit('nav-change', 'weather')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      </button>
      <button
        class="nav-btn"
        :class="{ active: activeView === 'favourites' }"
        id="nav-favourites"
        aria-label="Favourites"
        title="My Places"
        @click="emit('nav-change', 'favourites')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <button
        class="nav-btn"
        :class="{ active: activeView === 'cities' }"
        id="nav-cities"
        aria-label="Cities"
        title="Cities"
        @click="emit('nav-change', 'cities')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </button>
      <button
        class="nav-btn"
        :class="{ active: activeView === 'wind' }"
        id="nav-wind"
        aria-label="Wind"
        title="Wind"
        @click="emit('nav-change', 'wind')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.59 4.59A2 2 0 1011 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/>
        </svg>
      </button>
      <button
        class="nav-btn"
        :class="{ active: activeView === 'settings' }"
        id="nav-settings"
        aria-label="Settings"
        title="Settings"
        @click="emit('nav-change', 'settings')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </button>
    </nav>

    <!-- Theme indicator badge -->
    <div class="sidebar-theme-badge" v-if="hasWeather">
      <span v-if="isRainy">🌧</span>
      <span v-else-if="isSunny">☀️</span>
      <span v-else>⛅</span>
    </div>
  </aside>
</template>
