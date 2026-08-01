<script setup>
defineProps({
  weatherIconId: { type: String, default: 'partly-cloudy' },
  searchedCity:  { type: String, default: '' },
})
</script>

<template>
  <div class="loading-state">
    <div class="loading-orb">
      <div class="orb-ring"></div>
      <span class="orb-emoji">
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
        <!-- partly-cloudy / cloudy (default) -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41M12 22v-2"/><circle cx="12" cy="12" r="4"/><path d="M16.5 9.5A4.5 4.5 0 0121 14a4.5 4.5 0 01-4.5 4.5H9a3 3 0 010-6 4 4 0 017.5-3z"/></svg>
      </span>
    </div>
    <p class="loading-text">
      Fetching weather for <strong>{{ searchedCity }}</strong>…
    </p>
  </div>
</template>
