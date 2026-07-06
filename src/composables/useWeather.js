import { ref } from 'vue'

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'

// High-quality mock data for Philippine stations during monsoon/typhoon season
const MOCK_STATIONS = {
  manila: {
    weather: {
      name: 'Manila',
      coord: { lat: 14.5995, lon: 120.9842 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 33.4, feels_like: 41.2, humidity: 76, pressure: 1008 },
      wind: { speed: 3.2, deg: 230 },
      weather: [{ id: 803, main: 'Clouds', description: 'scattered clouds, sweltering tropical heat', icon: '03d' }],
      sys: { country: 'PH', sunrise: 1780716000, sunset: 1780762800 }
    },
    warning: { tcws: null, rainfall: null }
  },
  batanes: {
    weather: {
      name: 'Basco (Batanes)',
      coord: { lat: 20.4487, lon: 121.9686 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 24.8, feels_like: 21.5, humidity: 92, pressure: 985 },
      wind: { speed: 32.5, deg: 60 }, // Super stormy
      weather: [{ id: 504, main: 'Rain', description: 'torrential typhoon rains, zero visibility', icon: '10n' }],
      sys: { country: 'PH', sunrise: 1780715100, sunset: 1780763200 }
    },
    warning: {
      tcws: { signal: 4, text: 'Typhoon Warning Active' },
      rainfall: { alert: 'Red', text: 'TORRENTIAL RAINFALL: EVACUATE' }
    }
  },
  baguio: {
    weather: {
      name: 'Baguio City',
      coord: { lat: 16.4023, lon: 120.5960 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 18.2, feels_like: 17.5, humidity: 95, pressure: 1010 },
      wind: { speed: 5.8, deg: 240 },
      weather: [{ id: 701, main: 'Mist', description: 'dense mountain fog and amihan breeze', icon: '50d' }],
      sys: { country: 'PH', sunrise: 1780716100, sunset: 1780762900 }
    },
    warning: { tcws: null, rainfall: { alert: 'Yellow', text: 'HEAVY RAIN ALERT: LOW-LYING FLOODS POSSIBLE' } }
  },
  siargao: {
    weather: {
      name: 'General Luna (Siargao)',
      coord: { lat: 9.7916, lon: 126.1610 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 29.5, feels_like: 34.1, humidity: 71, pressure: 1012 },
      wind: { speed: 9.5, deg: 90 },
      weather: [{ id: 800, main: 'Clear', description: 'clear skies with heavy offshore swells', icon: '01d' }],
      sys: { country: 'PH', sunrise: 1780714800, sunset: 1780761200 }
    },
    warning: { tcws: null, rainfall: null }
  },
  cebu: {
    weather: {
      name: 'Cebu City',
      coord: { lat: 10.3157, lon: 123.8854 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 31.0, feels_like: 36.8, humidity: 70, pressure: 1011 },
      wind: { speed: 4.1, deg: 180 },
      weather: [{ id: 801, main: 'Clouds', description: 'partly cloudy, gentle sea breeze', icon: '02d' }],
      sys: { country: 'PH', sunrise: 1780715300, sunset: 1780761900 }
    },
    warning: { tcws: null, rainfall: null }
  },
  tagaytay: {
    weather: {
      name: 'Tagaytay',
      coord: { lat: 14.1153, lon: 120.9621 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 22.5, feels_like: 22.5, humidity: 85, pressure: 1009 },
      wind: { speed: 6.2, deg: 70 },
      weather: [{ id: 500, main: 'Rain', description: 'cool mountain breeze with light drizzle', icon: '09d' }],
      sys: { country: 'PH', sunrise: 1780716000, sunset: 1780762800 }
    },
    warning: { tcws: null, rainfall: { alert: 'Yellow', text: 'LIGHT MONSOON DRIZZLE ACTIVE' } }
  },
  davao: {
    weather: {
      name: 'Davao City',
      coord: { lat: 7.1907, lon: 125.4553 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 32.1, feels_like: 37.5, humidity: 68, pressure: 1011 },
      wind: { speed: 2.1, deg: 130 },
      weather: [{ id: 802, main: 'Clouds', description: 'scattered cloud layers, calm waters', icon: '03d' }],
      sys: { country: 'PH', sunrise: 1780714900, sunset: 1780760900 }
    },
    warning: { tcws: null, rainfall: null }
  }
}

export function useWeather() {
  const weather = ref(null)
  const forecastHourly = ref([])
  const forecastDaily = ref([])
  const loading = ref(false)
  const error = ref('')
  const isDemoMode = ref(false)

  // PAGASA Tropical Cyclone Wind Signal (TCWS) scale calculation
  function calculateTCWS(windSpeedMetersPerSecond) {
    const windSpeedKmh = windSpeedMetersPerSecond * 3.6
    if (windSpeedKmh >= 185) {
      return { signal: 5, text: 'Super Typhoon Warning (Winds ≥ 185 km/h)' }
    } else if (windSpeedKmh >= 118) {
      return { signal: 4, text: 'Typhoon Warning (Winds 118–184 km/h)' }
    } else if (windSpeedKmh >= 89) {
      return { signal: 3, text: 'Severe Tropical Storm Warning (Winds 89–117 km/h)' }
    } else if (windSpeedKmh >= 62) {
      return { signal: 2, text: 'Tropical Storm Warning (Winds 62–88 km/h)' }
    } else if (windSpeedKmh >= 39) {
      return { signal: 1, text: 'Tropical Depression Warning (Winds 39–61 km/h)' }
    }
    return null
  }

  // PAGASA Color-coded Rainfall Warning System calculation
  function calculateRainfallWarning(description, id) {
    const desc = description.toLowerCase()
    
    // Check specific heavy weather IDs (OpenWeather Codes)
    // 200-232: Thunderstorms, 502-504: Heavy rain, 522: Heavy shower
    const isTorrential = id >= 200 && id <= 232 || id === 503 || id === 504 || id === 522 || desc.includes('torrential') || desc.includes('heavy thunderstorm')
    const isModerate = desc.includes('moderate') || desc.includes('heavy rain') || desc.includes('thunderstorm')
    const isLight = desc.includes('light') || desc.includes('drizzle') || desc.includes('rain')

    if (isTorrential) {
      return { alert: 'Red', text: 'TORRENTIAL RAINFALL WARNING: EVACUATE LOW-LYING AREAS' }
    } else if (isModerate) {
      return { alert: 'Orange', text: 'INTENSE RAINFALL WARNING: PREPARE AND MONITOR FLOODING' }
    } else if (isLight) {
      return { alert: 'Yellow', text: 'HEAVY RAINFALL ALERT: EXPECT FLOODING IN PRONE REGIONS' }
    }
    return null
  }

  // Parse OpenWeather 40-interval forecast into hourly (next 24h) and daily averages
  function parseForecasts(list) {
    // 1. Hourly Forecast: next 24 hours (8 intervals of 3 hours)
    forecastHourly.value = list.slice(0, 8).map(item => ({
      dt: item.dt,
      dt_txt: item.dt_txt,
      temp: item.main.temp,
      icon: item.weather[0].icon,
      description: item.weather[0].description
    }))

    // 2. Daily Forecast: group remaining intervals by day
    const groups = {}
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(item)
    })

    const dailyData = []
    Object.keys(groups).forEach(date => {
      const items = groups[date]
      const minTemp = Math.min(...items.map(i => i.main.temp_min))
      const maxTemp = Math.max(...items.map(i => i.main.temp_max))
      
      // Determine dominant weather by most frequent main class in group
      const weatherCounts = {}
      items.forEach(i => {
        const key = `${i.weather[0].icon}|${i.weather[0].description}|${i.weather[0].main}`
        weatherCounts[key] = (weatherCounts[key] || 0) + 1
      })
      
      let dominantKey = Object.keys(weatherCounts)[0]
      let maxCount = 0
      Object.keys(weatherCounts).forEach(key => {
        if (weatherCounts[key] > maxCount) {
          maxCount = weatherCounts[key]
          dominantKey = key
        }
      })

      const [icon, description, main] = dominantKey.split('|')
      
      dailyData.push({
        date,
        dayName: new Date(date).toLocaleDateString('en-PH', { weekday: 'short' }).toUpperCase(),
        dateStr: new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }).toUpperCase(),
        tempMin: minTemp,
        tempMax: maxTemp,
        icon,
        description,
        main
      })
    })

    // Return the next 5 days of forecast (excluding today if today is the first element)
    const todayStr = new Date().toISOString().split('T')[0]
    forecastDaily.value = dailyData.filter(d => d.date !== todayStr).slice(0, 5)
  }

  // Generate realistic mock forecast data for Demo Mode
  function generateMockForecast(cityKey, baseTemp) {
    const list = []
    const startMs = Date.now()
    
    // Create 40 intervals (5 days)
    for (let i = 0; i < 40; i++) {
      const timeMs = startMs + i * 3 * 60 * 60 * 1000
      const dateObj = new Date(timeMs)
      
      // Format YYYY-MM-DD HH:MM:SS
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')
      const hour = String(dateObj.getHours()).padStart(2, '0')
      const dt_txt = `${year}-${month}-${day} ${hour}:00:00`
      
      // Add slight temperature swings (cooler at night, warmer at 12:00–15:00)
      const hourVal = dateObj.getHours()
      const daySwing = hourVal >= 9 && hourVal <= 17 ? 2.5 + Math.random() : -3.5 - Math.random()
      const randomOffset = Math.sin(i / 3) * 1.5 + (Math.random() - 0.5)
      const currentTemp = baseTemp + daySwing + randomOffset
      
      // Mock storm progression for Batanes or rainy setups
      let weatherConfig = { main: 'Clouds', description: 'partly cloudy', icon: '02d' }
      if (cityKey === 'batanes') {
        if (i < 16) {
          weatherConfig = { main: 'Rain', description: 'torrential typhoon rains', icon: '10d' }
        } else if (i < 30) {
          weatherConfig = { main: 'Rain', description: 'moderate storm winds', icon: '09d' }
        } else {
          weatherConfig = { main: 'Clouds', description: 'heavy overcast skies', icon: '04d' }
        }
      } else if (cityKey === 'manila' || cityKey === 'baguio') {
        const isAfternoon = hourVal >= 12 && hourVal <= 18
        if (isAfternoon) {
          weatherConfig = { main: 'Thunderstorm', description: 'scattered lightning storm', icon: '11d' }
        } else {
          weatherConfig = { main: 'Clouds', description: 'overcast skies', icon: '04d' }
        }
      } else if (cityKey === 'tagaytay') {
        weatherConfig = { main: 'Rain', description: 'cool mountain drizzle', icon: '09d' }
      } else if (cityKey === 'siargao') {
        weatherConfig = i % 8 === 0 ? { main: 'Clouds', description: 'partly cloudy', icon: '02d' } : { main: 'Clear', description: 'clear sea sky', icon: '01d' }
      }

      list.push({
        dt: Math.floor(timeMs / 1000),
        dt_txt,
        main: {
          temp: currentTemp,
          temp_min: currentTemp - 1.5,
          temp_max: currentTemp + 1.5,
          humidity: cityKey === 'baguio' || cityKey === 'batanes' ? 90 : 70
        },
        weather: [weatherConfig],
        wind: {
          speed: cityKey === 'batanes' ? 30 - i * 0.4 : 5 + Math.random() * 3
        }
      })
    }
    
    return list
  }

  // Trigger search sequence
  async function search(city) {
    if (!city || !city.trim()) return

    const sanitizedCity = city.trim()
    loading.value = true
    error.value = ''
    weather.value = null
    forecastHourly.value = []
    forecastDaily.value = []
    
    // Check if API key is configured. If not, trigger Demo Mode.
    if (!API_KEY || API_KEY.trim() === '' || API_KEY === 'undefined') {
      isDemoMode.value = true
      
      // Simulate network delay for realistic transmission effect
      await new Promise(resolve => setTimeout(resolve, 1400))
      
      const cityKey = sanitizedCity.toLowerCase().replace(/ city$/, '')
      const station = MOCK_STATIONS[cityKey]
      
      if (station) {
        // Deep copy mock data
        const stationCopy = JSON.parse(JSON.stringify(station))
        
        // Dynamically compute warnings based on winds/desc in case they shift
        stationCopy.warning = {
          tcws: calculateTCWS(stationCopy.weather.wind.speed),
          rainfall: calculateRainfallWarning(stationCopy.weather.weather[0].description, stationCopy.weather.weather[0].id)
        }
        
        weather.value = stationCopy.weather
        weather.value.warning = stationCopy.warning
        
        // Generate and parse mock forecast
        const mockList = generateMockForecast(cityKey, stationCopy.weather.main.temp)
        parseForecasts(mockList)
        loading.value = false
        return
      } else {
        // Return custom thematic warning in app's voice
        error.value = `UNRESOLVED TRANSMISSION: The weather station at '${sanitizedCity}' did not respond. Check if the city name is spelled correctly (e.g. 'Manila', 'Batanes', 'Siargao', 'Baguio') or configure a valid VITE_OPENWEATHER_KEY in your .env file to enable live satellite queries.`
        loading.value = false
        return
      }
    }

    // Live Satellite API Query
    isDemoMode.value = false
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${BASE}/weather?q=${encodeURIComponent(sanitizedCity)},PH&units=metric&appid=${API_KEY}`),
        fetch(`${BASE}/forecast?q=${encodeURIComponent(sanitizedCity)},PH&units=metric&appid=${API_KEY}`)
      ])

      // Handle 401 Unauthorized API Key
      if (currentRes.status === 401) {
        isDemoMode.value = true
        error.value = `TRANSMISSION UNAUTHORIZED: The satellite server rejected our connection key. Reverting to local terminal mode. Please verify the validity of VITE_OPENWEATHER_KEY in your .env file.`
        loading.value = false
        return
      }

      if (!currentRes.ok) {
        throw new Error(`Archipelago directory lookup failed for station '${sanitizedCity}'.`)
      }

      const weatherData = await currentRes.json()
      
      // Strictly enforce Philippine Area of Responsibility (PAR)
      if (weatherData.sys.country !== 'PH') {
        error.value = `JURISDICTION EXCLUSION: '${sanitizedCity}' falls outside our tracking boundary. This monitoring terminal strictly tracks weather stations within the Philippine Area of Responsibility (PAR).`
        loading.value = false
        return
      }

      const forecastData = await forecastRes.json()

      // Compute warnings based on OpenWeather parameters
      const warning = {
        tcws: calculateTCWS(weatherData.wind.speed),
        rainfall: calculateRainfallWarning(weatherData.weather[0].description, weatherData.weather[0].id)
      }

      weatherData.warning = warning
      weather.value = weatherData
      
      // Parse multi-day and hourly forecast
      parseForecasts(forecastData.list)
    } catch (e) {
      error.value = `UNRESOLVED TRANSMISSION: ${e.message} Verify spelling or ensure the city name is in Tagalog/English directory listings.`
    } finally {
      loading.value = false
    }
  }

  return {
    weather,
    forecastHourly,
    forecastDaily,
    loading,
    error,
    isDemoMode,
    search
  }
}