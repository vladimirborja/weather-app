import { ref } from 'vue'

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'

const PH_CITIES = [
  'Manila', 'Cebu City', 'Davao', 'Quezon City',
  'Baguio', 'Iloilo', 'Zamboanga', 'Cagayan de Oro',
  'Bacolod', 'Angeles',
]

export function useWeather() {
  const weather = ref(null)
  const forecast = ref([])
  const loading = ref(false)
  const error = ref('')
  const cities = PH_CITIES

  async function search(city) {
    loading.value = true
    error.value = ''
    weather.value = null
    forecast.value = []

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${BASE}/weather?q=${city},PH&units=metric&appid=${API_KEY}`),
        fetch(`${BASE}/forecast?q=${city},PH&units=metric&cnt=8&appid=${API_KEY}`),
      ])

      if (!currentRes.ok) throw new Error('City not found')

      weather.value = await currentRes.json()
      const forecastData = await forecastRes.json()
      forecast.value = forecastData.list
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { weather, forecast, loading, error, search, cities }
}