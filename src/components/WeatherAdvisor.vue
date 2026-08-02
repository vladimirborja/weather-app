<script setup>
import { computed } from 'vue'

const props = defineProps({
  weather:        { type: Object, default: null },
  forecastHourly: { type: Array,  default: () => [] },
  useFahrenheit:  { type: Boolean, default: false },
})

// Conversion helper
function formatTemp(c) {
  const rounded = props.useFahrenheit ? Math.round(c * 9 / 5 + 32) : Math.round(c)
  return `${rounded}°${props.useFahrenheit ? 'F' : 'C'}`
}

// 1. Outfit advice (temp + humidity)
const outfitAdvice = computed(() => {
  if (!props.weather?.main) return { text: '--', icon: 'shirt' }
  const temp = props.weather.main.temp
  const humidity = props.weather.main.humidity
  
  let text = ''
  let icon = 'shirt'
  
  if (temp >= 30) {
    icon = 'thermometer-high'
    text = `Hot and tropical (${formatTemp(temp)}). Loose, light fabrics like linen or breathable cotton are highly recommended.`
    if (humidity >= 75) {
      text += " It's also quite muggy today, so avoid tight garments."
    }
  } else if (temp >= 24) {
    icon = 'shirt'
    text = `Warm and comfortable weather (${formatTemp(temp)}). A standard t-shirt, shorts, or light trousers will fit perfectly.`
  } else if (temp >= 18) {
    icon = 'layers'
    text = `Pleasantly cool (${formatTemp(temp)}). Long sleeves or a light jacket/cardigan will keep you cozy, especially in the evening.`
  } else {
    icon = 'snowflake'
    text = `Bracingly cold (${formatTemp(temp)}). Wearing a heavy sweater, hoodie, or layers is recommended to stay warm.`
  }
  
  return { text, icon }
})

// 2. Gear advice (umbrella / sun wear based on current and next hours)
const gearAdvice = computed(() => {
  if (!props.weather?.weather?.[0]) return { text: '--', icon: 'bag' }
  const id = props.weather.weather[0].id
  
  let text = ''
  let icon = 'umbrella'
  
  if (id < 700) {
    icon = 'cloud-lightning'
    text = "Rain or storm active. Be sure to carry a sturdy umbrella, a raincoat, and waterproof shoes!"
  } else {
    const nextRain = props.forecastHourly.slice(0, 6).find(item => {
      return item.pop >= 30 || (item.description && (item.description.toLowerCase().includes('rain') || item.description.toLowerCase().includes('drizzle') || item.description.toLowerCase().includes('storm')))
    })
    
    if (nextRain) {
      icon = 'cloud-rain'
      const time = new Date(nextRain.dt * 1000).toLocaleTimeString('en-PH', { hour: 'numeric', hour12: true })
      text = `Showers expected around ${time} (${nextRain.pop}% probability). Don't forget to pack an umbrella!`
    } else {
      icon = 'sun'
      text = "Clear or partly cloudy skies expected. No rain gear needed today. Grab your sunglasses instead!"
    }
  }
  
  return { text, icon }
})

// 3. Outdoor/Activity guidance (safe hours / winds / sun)
const activityAdvice = computed(() => {
  if (!props.weather) return { text: '--', icon: 'bike' }
  const id = props.weather.weather?.[0]?.id ?? 800
  const clouds = props.weather.clouds?.all ?? 0
  const windSpeed = props.weather.wind?.speed ?? 0
  
  let text = ''
  let icon = 'bike'
  
  if (id < 700) {
    icon = 'home'
    text = "Unfavorable weather conditions. Keep activities indoors today to stay safe and dry."
  } else if (windSpeed > 15) {
    icon = 'flag'
    text = "High winds detected. Outdoor sports or cycling are not recommended. Secure loose outdoor items."
  } else if (id === 800 && clouds <= 20) {
    icon = 'sun'
    text = "High sun exposure. UV index is high. Apply SPF 30+ sunscreen, wear a cap, and stay hydrated."
  } else if (clouds >= 70) {
    icon = 'cloud'
    text = "Overcast skies keep the sun blocked. Great weather for outdoor runs, strolls, or outdoor chores."
  } else {
    icon = 'run'
    text = "Excellent conditions. Great day for outdoor workouts, jogs, or exploring the town."
  }
  
  return { text, icon }
})
</script>

<template>
  <div class="section-card advisor-card animate-rise" style="animation-delay: 0.12s">
    <p class="section-label">DAILY ADVISOR</p>
    
    <div class="advisor-grid">
      <!-- Outfit -->
      <div class="advisor-item">
        <div class="advisor-icon-wrap outfit-theme">
          <span class="advisor-emoji">
            <!-- thermometer-high: hot -->
            <svg v-if="outfitAdvice.icon === 'thermometer-high'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>
            <!-- layers: cool -->
            <svg v-else-if="outfitAdvice.icon === 'layers'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <!-- snowflake: cold -->
            <svg v-else-if="outfitAdvice.icon === 'snowflake'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7l-5-5-5 5"/><path d="M17 17l-5 5-5-5"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M7 7l-5 5 5 5"/><path d="M17 7l5 5-5 5"/></svg>
            <!-- shirt: default / warm -->
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
          </span>
        </div>
        <div class="advisor-content">
          <h4 class="advisor-item-title">What to Wear</h4>
          <p class="advisor-item-text">{{ outfitAdvice.text }}</p>
        </div>
      </div>

      <!-- Gear -->
      <div class="advisor-item">
        <div class="advisor-icon-wrap gear-theme">
          <span class="advisor-emoji">
            <!-- cloud-lightning: storm active -->
            <svg v-if="gearAdvice.icon === 'cloud-lightning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 16.9A5 5 0 0014 8h-1.26A8 8 0 102 16.29"/><polyline points="13 11 9 17 15 17 11 23"/></svg>
            <!-- cloud-rain: showers expected -->
            <svg v-else-if="gearAdvice.icon === 'cloud-rain'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/></svg>
            <!-- sun: no rain expected -->
            <svg v-else-if="gearAdvice.icon === 'sun'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <!-- umbrella: default -->
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 12a11.05 11.05 0 00-22 0zm-5 7a3 3 0 01-6 0v-7"/></svg>
          </span>
        </div>
        <div class="advisor-content">
          <h4 class="advisor-item-title">What to Bring</h4>
          <p class="advisor-item-text">{{ gearAdvice.text }}</p>
        </div>
      </div>

      <!-- Activity -->
      <div class="advisor-item">
        <div class="advisor-icon-wrap activity-theme">
          <span class="advisor-emoji">
            <!-- home: stay indoors -->
            <svg v-if="activityAdvice.icon === 'home'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <!-- flag: high wind -->
            <svg v-else-if="activityAdvice.icon === 'flag'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            <!-- sun: high UV -->
            <svg v-else-if="activityAdvice.icon === 'sun'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <!-- cloud: overcast -->
            <svg v-else-if="activityAdvice.icon === 'cloud'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 110-14 7 7 0 0114 7 4.5 4.5 0 01-5.5 7z"/></svg>
            <!-- run: excellent (default) / bike -->
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="M20 12h-5.5L12 7 9 12l-3 3H2"/><path d="M7 15l2 4 3-3 3 3 2-4"/></svg>
          </span>
        </div>
        <div class="advisor-content">
          <h4 class="advisor-item-title">Outdoor Index</h4>
          <p class="advisor-item-text">{{ activityAdvice.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
