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
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <!-- Sun rays -->
          <g stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round">
            <line x1="17" y1="7"  x2="17" y2="4" />
            <line x1="7"  y1="17" x2="4"  y2="17" />
            <line x1="10" y1="10" x2="8"  y2="8" />
            <line x1="24" y1="10" x2="26" y2="8" />
            <line x1="10" y1="24" x2="8"  y2="26" />
          </g>
          <!-- Sun disc -->
          <circle
            cx="17" cy="17" r="7"
            fill="var(--accent)"
            opacity="0.9"
          />
          <!-- Cloud body — layered, rounded, fills foreground -->
          <rect
            x="10" y="26" width="30" height="14"
            rx="7"
            fill="var(--text-primary)"
            opacity="0.12"
          />
          <ellipse
            cx="20" cy="28" rx="9" ry="8"
            fill="var(--text-primary)"
            opacity="0.18"
          />
          <ellipse
            cx="30" cy="27" rx="8" ry="7"
            fill="var(--text-primary)"
            opacity="0.18"
          />
          <rect
            x="12" y="30" width="26" height="10"
            rx="5"
            fill="var(--text-primary)"
            opacity="0.22"
          />
          <!-- Cloud highlight outline -->
          <path
            d="M14 38 Q10 38 10 32 Q10 26 18 25 Q20 20 27 21 Q34 20 35 26 Q40 26 40 32 Q40 38 36 38 Z"
            fill="var(--bg-card)"
            stroke="var(--accent-glow)"
            stroke-width="1"
            opacity="0.9"
          />
        </svg>
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
