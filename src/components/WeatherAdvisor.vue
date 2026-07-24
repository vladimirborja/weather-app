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
  if (!props.weather?.main) return { text: '--', icon: '👕' }
  const temp = props.weather.main.temp
  const humidity = props.weather.main.humidity
  
  let text = ''
  let icon = '👕'
  
  if (temp >= 30) {
    icon = '🥵'
    text = `It's hot and tropical (${formatTemp(temp)}). Loose, light fabrics like linen or breathable cotton are highly recommended.`
    if (humidity >= 75) {
      text += " It's also quite muggy today, so avoid tight garments."
    }
  } else if (temp >= 24) {
    icon = '👕'
    text = `Warm and comfortable weather (${formatTemp(temp)}). A standard t-shirt, shorts, or light trousers will fit perfectly.`
  } else if (temp >= 18) {
    icon = '🧥'
    text = `Pleasantly cool (${formatTemp(temp)}). Long sleeves or a light jacket/cardigan will keep you cozy, especially in the evening.`
  } else {
    icon = '❄️'
    text = `Bracingly cold (${formatTemp(temp)}). Wearing a heavy sweater, hoodie, or layers is recommended to stay warm.`
  }
  
  return { text, icon }
})

// 2. Gear advice (umbrella / sun wear based on current and next hours)
const gearAdvice = computed(() => {
  if (!props.weather?.weather?.[0]) return { text: '--', icon: '👜' }
  const id = props.weather.weather[0].id
  
  let text = ''
  let icon = '☂️'
  
  if (id < 700) {
    icon = '⛈️'
    text = "Rain or storm active. Be sure to carry a sturdy umbrella, a raincoat, and waterproof shoes!"
  } else {
    const nextRain = props.forecastHourly.slice(0, 6).find(item => {
      return item.pop >= 30 || (item.description && (item.description.toLowerCase().includes('rain') || item.description.toLowerCase().includes('drizzle') || item.description.toLowerCase().includes('storm')))
    })
    
    if (nextRain) {
      icon = '🌦️'
      const time = new Date(nextRain.dt * 1000).toLocaleTimeString('en-PH', { hour: 'numeric', hour12: true })
      text = `Showers expected around ${time} (${nextRain.pop}% probability). Don't forget to pack an umbrella!`
    } else {
      icon = '🕶️'
      text = "Clear or partly cloudy skies expected. No rain gear needed today. Grab your sunglasses instead!"
    }
  }
  
  return { text, icon }
})

// 3. Outdoor/Activity guidance (safe hours / winds / sun)
const activityAdvice = computed(() => {
  if (!props.weather) return { text: '--', icon: '🚴' }
  const id = props.weather.weather?.[0]?.id ?? 800
  const clouds = props.weather.clouds?.all ?? 0
  const windSpeed = props.weather.wind?.speed ?? 0
  
  let text = ''
  let icon = '🚴'
  
  if (id < 700) {
    icon = '🏠'
    text = "Unfavorable weather conditions. Keep activities indoors today to stay safe and dry."
  } else if (windSpeed > 15) {
    icon = '🚩'
    text = "High winds detected. Outdoor sports or cycling are not recommended. Secure loose outdoor items."
  } else if (id === 800 && clouds <= 20) {
    icon = '☀️'
    text = "High sun exposure. UV index is high. Apply SPF 30+ sunscreen, wear a cap, and stay hydrated."
  } else if (clouds >= 70) {
    icon = '☁️'
    text = "Overcast skies keep the sun blocked. Great weather for outdoor runs, strolls, or outdoor chores."
  } else {
    icon = '🏃'
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
          <span class="advisor-emoji">{{ outfitAdvice.icon }}</span>
        </div>
        <div class="advisor-content">
          <h4 class="advisor-item-title">What to Wear</h4>
          <p class="advisor-item-text">{{ outfitAdvice.text }}</p>
        </div>
      </div>

      <!-- Gear -->
      <div class="advisor-item">
        <div class="advisor-icon-wrap gear-theme">
          <span class="advisor-emoji">{{ gearAdvice.icon }}</span>
        </div>
        <div class="advisor-content">
          <h4 class="advisor-item-title">What to Bring</h4>
          <p class="advisor-item-text">{{ gearAdvice.text }}</p>
        </div>
      </div>

      <!-- Activity -->
      <div class="advisor-item">
        <div class="advisor-icon-wrap activity-theme">
          <span class="advisor-emoji">{{ activityAdvice.icon }}</span>
        </div>
        <div class="advisor-content">
          <h4 class="advisor-item-title">Outdoor Index</h4>
          <p class="advisor-item-text">{{ activityAdvice.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
