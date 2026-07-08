<script setup>
import { computed } from 'vue'

const props = defineProps({
  weather: { type: Object, default: null },
  isDemoMode: { type: Boolean, default: false }
})

// Classify weather for appropriate echo rendering
const radarType = computed(() => {
  if (!props.weather) return 'idle'
  const kmh  = props.weather.wind.speed * 3.6
  const desc = props.weather.weather[0].description.toLowerCase()
  const id   = props.weather.weather[0].id

  if (kmh >= 62 || desc.includes('typhoon') || desc.includes('cyclone'))    return 'typhoon'
  if ((id >= 200 && id <= 232) || id === 502 || id === 503 || id === 504
      || desc.includes('heavy') || desc.includes('thunderstorm'))             return 'heavy-rain'
  if ((id >= 500 && id <= 521) || desc.includes('rain') || desc.includes('drizzle')) return 'light-rain'
  if (id >= 801 && id <= 804)                                                  return 'cloudy'
  return 'clear'
})

const conditionLabel = computed(() => {
  switch (radarType.value) {
    case 'typhoon':    return 'Cyclone activity detected'
    case 'heavy-rain': return 'Heavy precipitation'
    case 'light-rain': return 'Scattered rainfall'
    case 'cloudy':     return 'Cloud cover'
    default:           return 'Clear skies'
  }
})
</script>

<template>
  <div class="relative flex flex-col gap-3 select-none">

    <!-- Radar scope -->
    <div class="relative mx-auto w-full max-w-[220px] aspect-square flex items-center justify-center">

      <!-- Range rings -->
      <div class="absolute inset-0 rounded-full border border-white/8"></div>
      <div class="absolute w-[75%] h-[75%] rounded-full border border-white/6"></div>
      <div class="absolute w-[50%] h-[50%] rounded-full border border-white/5"></div>
      <div class="absolute w-[25%] h-[25%] rounded-full border border-white/4"></div>

      <!-- Axes -->
      <div class="absolute w-full h-px bg-white/6"></div>
      <div class="absolute w-px h-full bg-white/6"></div>
      <div class="absolute w-full h-px bg-white/4 rotate-45"></div>
      <div class="absolute w-full h-px bg-white/4 -rotate-45"></div>

      <!-- Cardinal labels -->
      <span class="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-white/30 font-medium">N</span>
      <span class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-white/30 font-medium">S</span>
      <span class="absolute top-1/2 -right-5 -translate-y-1/2 text-[9px] text-white/30 font-medium">E</span>
      <span class="absolute top-1/2 -left-5 -translate-y-1/2 text-[9px] text-white/30 font-medium">W</span>

      <!-- Radar echoes -->
      <div class="absolute inset-0 rounded-full overflow-hidden pointer-events-none">

        <!-- Typhoon vortex -->
        <div v-if="radarType === 'typhoon'"
             class="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" class="w-3/4 h-3/4 opacity-75 animate-[spin_10s_linear_infinite]">
            <path d="M50,50 A22,22 0 0,0 22,38 A27,27 0 0,1 52,18 A32,32 0 0,0 50,50"
                  fill="url(#r-red)"/>
            <path d="M50,50 A18,18 0 0,1 76,53 A22,22 0 0,0 44,75 A27,27 0 0,1 50,50"
                  fill="url(#r-orange)"/>
            <path d="M50,50 A13,13 0 0,0 36,60 A16,16 0 0,1 62,60"
                  fill="url(#r-yellow)"/>
            <circle cx="50" cy="50" r="3.5" fill="#0d2137" stroke="#f43f5e" stroke-width="1"/>
          </svg>
        </div>

        <!-- Heavy rain cells -->
        <div v-else-if="radarType === 'heavy-rain'" class="absolute inset-0">
          <div class="absolute w-12 h-8 rounded-full bg-rose-500/35 blur-[7px] top-[30%] left-[22%] animate-pulse"></div>
          <div class="absolute w-5  h-5 rounded-full bg-amber-400/45 blur-[3px] top-[34%] left-[27%]"></div>
          <div class="absolute w-14 h-10 rounded-full bg-orange-400/28 blur-[9px] top-[42%] left-[48%] animate-pulse" style="animation-delay:.8s"></div>
          <div class="absolute w-20 h-14 rounded-full bg-teal-400/15 blur-[12px] top-[26%] left-[18%]"></div>
        </div>

        <!-- Light rain -->
        <div v-else-if="radarType === 'light-rain'" class="absolute inset-0">
          <div class="absolute w-10 h-6 rounded-full bg-teal-400/20 blur-[6px] top-[35%] left-[52%] animate-pulse" style="animation-delay:.5s"></div>
          <div class="absolute w-12 h-9 rounded-full bg-teal-400/18 blur-[8px] top-[50%] left-[24%]"></div>
          <div class="absolute w-7  h-4 rounded-full bg-amber-300/18 blur-[4px] top-[53%] left-[27%]"></div>
        </div>

        <!-- Cloudy -->
        <div v-else-if="radarType === 'cloudy'" class="absolute inset-0">
          <div class="absolute w-16 h-10 rounded-full bg-sky-400/10 blur-[10px] top-[24%] left-[42%]"></div>
          <div class="absolute w-14 h-12 rounded-full bg-sky-400/8 blur-[9px] top-[54%] left-[28%]"></div>
        </div>
      </div>

      <!-- Rotating sweep -->
      <div class="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-sweep">
        <div
          class="absolute w-1/2 h-1/2 top-0 right-0"
          style="transform-origin: bottom left;
                 background: conic-gradient(from 270deg at 0% 100%,
                   rgba(45,212,191,0.22) 0deg,
                   rgba(45,212,191,0)    80deg);
                 transform: rotate(90deg);">
        </div>
      </div>

      <!-- Centre dot -->
      <div class="absolute w-2 h-2 rounded-full bg-jade shadow-[0_0_10px_rgba(45,212,191,0.8)] z-20"
           style="background-color: var(--color-jade)"></div>
    </div>

    <!-- Condition label row -->
    <div class="flex items-center justify-between text-xs text-sky-300/50">
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-jade/70 animate-pulse"
              style="background-color: color-mix(in srgb, var(--color-jade) 70%, transparent)"></span>
        {{ conditionLabel }}
      </span>
      <span>{{ isDemoMode ? 'Simulated' : 'Live' }}</span>
    </div>

    <!-- Hidden SVG gradient defs -->
    <svg width="0" height="0" class="absolute">
      <defs>
        <radialGradient id="r-red">
          <stop offset="0%" stop-color="#f43f5e" stop-opacity=".8"/>
          <stop offset="100%" stop-color="#f43f5e" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="r-orange">
          <stop offset="0%" stop-color="#f97316" stop-opacity=".7"/>
          <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="r-yellow">
          <stop offset="0%" stop-color="#eab308" stop-opacity=".7"/>
          <stop offset="100%" stop-color="#eab308" stop-opacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
.animate-sweep { animation: sweep 5s linear infinite; }
@keyframes sweep {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .animate-sweep, [class*="animate-"] { animation: none !important; }
}
</style>
