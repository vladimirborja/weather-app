import { ref, watch } from 'vue'

const SAVED_KEY  = 'ph-weather-saved'
const RECENT_KEY = 'ph-weather-recent'
const MAX_RECENT = 5

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// ── Singleton state (shared across all useFavourites() calls) ──
const savedCities   = ref(readStorage(SAVED_KEY,  []))
const recentSearches = ref(readStorage(RECENT_KEY, []))

watch(savedCities,    (v) => localStorage.setItem(SAVED_KEY,  JSON.stringify(v)), { deep: true })
watch(recentSearches, (v) => localStorage.setItem(RECENT_KEY, JSON.stringify(v)), { deep: true })

export function useFavourites() {
  function isFavourite(cityName) {
    return savedCities.value.includes(cityName)
  }

  function addFavourite(cityName) {
    if (!isFavourite(cityName)) {
      savedCities.value = [cityName, ...savedCities.value]
    }
  }

  function removeFavourite(cityName) {
    savedCities.value = savedCities.value.filter(c => c !== cityName)
  }

  function toggleFavourite(cityName) {
    isFavourite(cityName) ? removeFavourite(cityName) : addFavourite(cityName)
  }

  function addRecent(cityName) {
    const filtered = recentSearches.value.filter(c => c !== cityName)
    recentSearches.value = [cityName, ...filtered].slice(0, MAX_RECENT)
  }

  function clearRecent() {
    recentSearches.value = []
  }

  return {
    savedCities,
    recentSearches,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    addRecent,
    clearRecent,
  }
}
