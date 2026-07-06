<script setup>
import { computed } from 'vue'

const props = defineProps({
  weather: {
    type: Object,
    default: null
  },
  isDemoMode: {
    type: Boolean,
    default: false
  }
})

// Extract coordinates and description for technical overlay
const coordsText = computed(() => {
  if (!props.weather || !props.weather.coord) return 'STN LOC: 00.00°N 00.00°E'
  const { lat, lon } = props.weather.coord
  return `LAT: ${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} | LON: ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`
})

const stationName = computed(() => {
  if (!props.weather) return 'TELEMETRY OFFLINE'
  return `STN: ${props.weather.name.toUpperCase()}`
})

// Classify weather state to render specific radar echoes
const radarStatus = computed(() => {
  if (!props.weather) return 'idle'
  
  const windSpeedKmh = props.weather.wind.speed * 3.6
  const desc = props.weather.weather[0].description.toLowerCase()
  const weatherId = props.weather.weather[0].id
  
  // Typhoon conditions
  if (windSpeedKmh >= 62 || desc.includes('typhoon') || desc.includes('cyclone') || desc.includes('storm')) {
    return 'typhoon'
  }
  
  // Heavy rains or thunderstorm echoes
  if (
    (weatherId >= 200 && weatherId <= 232) || 
    weatherId === 502 || weatherId === 503 || weatherId === 504 || 
    desc.includes('heavy') || desc.includes('thunderstorm') || desc.includes('torrential')
  ) {
    return 'heavy-rain'
  }
  
  // Moderate or light rain echoes
  if (
    (weatherId >= 500 && weatherId <= 501) || 
    (weatherId >= 520 && weatherId <= 521) || 
    desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')
  ) {
    return 'light-rain'
  }
  
  // Cloudy reflections
  if (weatherId >= 801 && weatherId <= 804) {
    return 'cloudy'
  }
  
  return 'clear'
})

// Generate simulated radar status reading text
const signalStrength = computed(() => {
  if (!props.weather) return 'LINK LOST'
  if (props.isDemoMode) return 'SIM-LINK ACTIVE'
  return 'SAT-LINK 98%'
})

const dbzReading = computed(() => {
  switch (radarStatus.value) {
    case 'typhoon': return 'MAX DBZ: 58 (SEVERE VORTEX)'
    case 'heavy-rain': return 'MAX DBZ: 48 (THUNDERSTORM ECHO)'
    case 'light-rain': return 'MAX DBZ: 32 (STRATIFORM CLUTTER)'
    case 'cloudy': return 'MAX DBZ: 12 (METEOROLOGICAL CLUTTER)'
    default: return 'MAX DBZ: <5 (CLEAR SWEET)'
  }
})
</script>

<template>
  <div class="relative w-full aspect-square md:aspect-auto md:h-72 border border-ph-teal-light bg-ph-teal-dark rounded overflow-hidden flex flex-col items-center justify-center p-3 select-none radar-crt">
    
    <!-- Outer radar rings and grid -->
    <div class="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
      
      <!-- Range Rings -->
      <div class="absolute w-full h-full border border-[#173f38]/50 rounded-full"></div>
      <div class="absolute w-[75%] h-[75%] border border-[#173f38]/40 rounded-full"></div>
      <div class="absolute w-[50%] h-[50%] border border-[#173f38]/30 rounded-full"></div>
      <div class="absolute w-[25%] h-[25%] border border-[#173f38]/20 rounded-full"></div>
      
      <!-- Axis Lines -->
      <div class="absolute w-full h-px bg-[#173f38]/30"></div>
      <div class="absolute h-full w-px bg-[#173f38]/30"></div>
      
      <!-- 45 Degree Crosshairs -->
      <div class="absolute w-full h-px bg-[#173f38]/15 rotate-45"></div>
      <div class="absolute w-full h-px bg-[#173f38]/15 -rotate-45"></div>
      
      <!-- Range Labels -->
      <span class="absolute top-[38.5%] left-[52%] font-mono text-[7px] text-ph-mint/40">100km</span>
      <span class="absolute top-[26%] left-[52%] font-mono text-[7px] text-ph-mint/30">200km</span>
      <span class="absolute top-[13.5%] left-[52%] font-mono text-[7px] text-ph-mint/20">300km</span>
      <span class="absolute top-[1%] left-[52%] font-mono text-[7px] text-ph-mint/15">400km</span>

      <!-- Cardinal Labels -->
      <span class="absolute -top-1.5 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold text-ph-mint/60">N</span>
      <span class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold text-ph-mint/60">S</span>
      <span class="absolute top-1/2 -right-2 -translate-y-1/2 font-mono text-[9px] font-bold text-ph-mint/60">E</span>
      <span class="absolute top-1/2 -left-2 -translate-y-1/2 font-mono text-[9px] font-bold text-ph-mint/60">W</span>

      <!-- Dynamic Weather Radar Echoes (Simulating Doppler feedback) -->
      <div class="absolute w-full h-full overflow-hidden rounded-full pointer-events-none">
        
        <!-- Case 1: Typhoon / Vortex -->
        <div v-if="radarStatus === 'typhoon'" class="absolute w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" class="w-2/3 h-2/3 opacity-70 animate-spin" style="animation-duration: 9s;">
            <!-- Outer swirl bands -->
            <path d="M 50,50 A 25,25 0 0,0 20,40 A 30,30 0 0,1 55,20 A 35,35 0 0,0 50,50" fill="url(#grad-red)" class="animate-pulse" style="animation-duration: 2s;"></path>
            <path d="M 50,50 A 20,20 0 0,1 78,55 A 25,25 0 0,0 45,78 A 30,30 0 0,1 50,50" fill="url(#grad-orange)"></path>
            <path d="M 50,50 A 15,15 0 0,0 35,62 A 18,18 0 0,1 60,62" fill="url(#grad-yellow)"></path>
            
            <circle cx="50" cy="50" r="4" fill="#051b18" stroke="#ef4444" stroke-width="1" class="animate-ping" style="animation-duration: 2s;"></circle>
          </svg>
        </div>

        <!-- Case 2: Heavy Rain / Thunderstorm Echoes -->
        <div v-else-if="radarStatus === 'heavy-rain'" class="absolute w-full h-full">
          <!-- Multi-colored rain cells reflecting signal dBZ -->
          <div class="absolute w-12 h-8 rounded-full bg-ph-red/40 filter blur-[8px] top-[30%] left-[25%] animate-pulse" style="animation-duration: 2.5s;"></div>
          <div class="absolute w-6 h-6 rounded-full bg-ph-yellow/50 filter blur-[4px] top-[33%] left-[30%]"></div>
          <div class="absolute w-16 h-12 rounded-full bg-ph-orange/30 filter blur-[10px] top-[40%] left-[45%] animate-pulse" style="animation-duration: 4s;"></div>
          <div class="absolute w-10 h-8 rounded-full bg-ph-red/35 filter blur-[6px] top-[44%] left-[48%]"></div>
          <div class="absolute w-24 h-16 rounded-full bg-green-500/15 filter blur-[12px] top-[28%] left-[20%]"></div>
        </div>

        <!-- Case 3: Light Rain / Drizzle Echoes -->
        <div v-else-if="radarStatus === 'light-rain'" class="absolute w-full h-full">
          <div class="absolute w-10 h-6 rounded-full bg-green-500/25 filter blur-[6px] top-[35%] left-[55%] animate-pulse" style="animation-duration: 3s;"></div>
          <div class="absolute w-12 h-10 rounded-full bg-green-500/20 filter blur-[8px] top-[50%] left-[25%]"></div>
          <div class="absolute w-6 h-4 rounded-full bg-ph-yellow/20 filter blur-[4px] top-[52%] left-[28%]"></div>
          <div class="absolute w-8 h-8 rounded-full bg-green-500/15 filter blur-[7px] top-[20%] left-[40%]"></div>
        </div>

        <!-- Case 4: Cloudy Reflections -->
        <div v-else-if="radarStatus === 'cloudy'" class="absolute w-full h-full">
          <div class="absolute w-16 h-10 rounded-full bg-[#8fada3]/10 filter blur-[10px] top-[25%] left-[45%]"></div>
          <div class="absolute w-14 h-12 rounded-full bg-[#8fada3]/10 filter blur-[8px] top-[55%] left-[30%]"></div>
        </div>
      </div>

      <!-- Rotating Sweep Beam -->
      <div class="absolute w-full h-full rounded-full overflow-hidden pointer-events-none animate-scan">
        <div class="absolute w-1/2 h-1/2 top-0 right-0 border-l border-t border-dashed border-ph-mint/40" 
             style="transform-origin: bottom left; background: conic-gradient(from 270deg at 0% 100%, rgba(143, 173, 163, 0.25) 0deg, rgba(143, 173, 163, 0) 90deg); transform: rotate(90deg);">
        </div>
      </div>

      <!-- Station Center Dot -->
      <div class="absolute w-1.5 h-1.5 bg-[#f1e9d2] rounded-full shadow-[0_0_8px_#f1e9d2] z-20"></div>
    </div>

    <!-- Technical Telemetry Readout panel -->
    <div class="w-full mt-3 border-t border-[#173f38] pt-2 flex flex-wrap justify-between items-center text-[9px] font-mono text-ph-mint/70 tracking-wider">
      <div class="flex flex-col gap-0.5">
        <span class="font-bold text-[#f1e9d2]">{{ stationName }}</span>
        <span>{{ coordsText }}</span>
      </div>
      <div class="flex flex-col items-end gap-0.5 mt-1 sm:mt-0">
        <span>{{ signalStrength }} · ELEV: 1.5°</span>
        <span class="text-ph-gold font-semibold uppercase">{{ dbzReading }}</span>
      </div>
    </div>

    <!-- Hidden SVG Gradients for storm spirals -->
    <svg width="0" height="0" class="absolute">
      <defs>
        <radialGradient id="grad-red" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#c1432d" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#c1432d" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="grad-orange" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#e67e22" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#e67e22" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="grad-yellow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f1c40f" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#f1c40f" stop-opacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
/* Scoped overrides for CRT styling on radar */
.animate-spin {
  animation: spin 9s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .animate-spin,
  .animate-scan {
    animation: none !important;
  }
}
</style>
