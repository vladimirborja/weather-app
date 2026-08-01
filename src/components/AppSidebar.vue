<script setup>
defineProps({
  weatherIconId: { type: String, default: 'partly-cloudy' },
  isRainy:      { type: Boolean, default: false },
  isSunny:      { type: Boolean, default: false },
  hasWeather:   { type: Boolean, default: false },
  activeView:   { type: String, default: 'weather' },
  isSearchedCity: { type: Boolean, default: false },
})
const emit = defineEmits(['nav-change', 'go-home'])
</script>

<template>
  <aside class="sidebar">

    <!-- ── Logo ── -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <!-- storm -->
        <svg v-if="weatherIconId === 'storm'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 16.9A5 5 0 0014 8h-1.26A8 8 0 102 16.29"/><polyline points="13 11 9 17 15 17 11 23"/></svg>
        <!-- rain / drizzle -->
        <svg v-else-if="weatherIconId === 'rain' || weatherIconId === 'drizzle'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/></svg>
        <!-- snow -->
        <svg v-else-if="weatherIconId === 'snow'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/></svg>
        <!-- fog -->
        <svg v-else-if="weatherIconId === 'fog'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h3M12 5h7M3 10h7M14 10h7M5 15h5M14 15h5M3 20h4M11 20h10"/></svg>
        <!-- sun -->
        <svg v-else-if="weatherIconId === 'sun'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <!-- partly-cloudy (default) -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41M12 22v-2"/><circle cx="12" cy="12" r="4"/><path d="M16.5 9.5A4.5 4.5 0 0121 14a4.5 4.5 0 01-4.5 4.5H9a3 3 0 010-6 4 4 0 017.5-3z"/></svg>
      </div>
    </div>

    <!-- ── Divider ── -->
    <div class="sidebar-divider" aria-hidden="true"></div>

    <!-- ── Top nav group ── -->
    <nav class="sidebar-nav" aria-label="Main navigation">
      <button
        class="nav-btn"
        :class="{ active: activeView === 'weather' }"
        id="nav-weather"
        aria-label="Weather"
        data-tooltip="Weather"
        @click="emit('nav-change', 'weather')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      </button>

      <!-- Home / default-location button -->
      <button
        class="nav-btn"
        :class="{ 'nav-btn--home-active': isSearchedCity }"
        id="nav-home"
        aria-label="Home location"
        data-tooltip="Home"
        @click="emit('go-home')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </button>

      <button
        class="nav-btn"
        :class="{ active: activeView === 'favourites' }"
        id="nav-favourites"
        aria-label="Favourites"
        data-tooltip="My Places"
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
        data-tooltip="Cities"
        @click="emit('nav-change', 'cities')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="6" height="14" rx="1"/>
          <rect x="9" y="3" width="6" height="18" rx="1"/>
          <rect x="16" y="10" width="6" height="11" rx="1"/>
        </svg>
      </button>

      <button
        class="nav-btn"
        :class="{ active: activeView === 'wind' }"
        id="nav-wind"
        aria-label="Wind"
        data-tooltip="Wind"
        @click="emit('nav-change', 'wind')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.59 4.59A2 2 0 1011 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/>
        </svg>
      </button>

      <!-- Spacer: pushes settings to the bottom -->
      <div class="sidebar-spacer"></div>

      <button
        class="nav-btn"
        :class="{ active: activeView === 'settings' }"
        id="nav-settings"
        aria-label="Settings"
        data-tooltip="Settings"
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
      <!-- Rain -->
      <svg v-if="isRainy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/></svg>
      <!-- Sun -->
      <svg v-else-if="isSunny" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      <!-- Cloud -->
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M17.5 19H9a7 7 0 110-14 7 7 0 0114 7 4.5 4.5 0 01-5.5 7z"/></svg>
    </div>
  </aside>
</template>
