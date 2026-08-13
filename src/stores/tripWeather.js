import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getWeatherForecast } from '../api/weatherApi'
import { getWeatherEmoji, getWeatherType } from '../utils/weatherUtil'

const formatForecastTime = (timestamp) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(timestamp * 1000))

export const useTripWeatherStore = defineStore('tripWeather', () => {
  const forecastsByCity = ref({})
  const loadingCityIds = ref([])
  const errorsByCity = ref({})

  const isLoading = computed(() => loadingCityIds.value.length > 0)

  const fetchCityForecast = async (city) => {
    if (forecastsByCity.value[city.id] || loadingCityIds.value.includes(city.id)) return

    loadingCityIds.value = [...loadingCityIds.value, city.id]
    errorsByCity.value = { ...errorsByCity.value, [city.id]: null }

    try {
      const data = await getWeatherForecast(city)
      forecastsByCity.value = { ...forecastsByCity.value, [city.id]: data.list ?? [] }
    } catch {
      errorsByCity.value = {
        ...errorsByCity.value,
        [city.id]: '이 도시의 예보를 불러오지 못했습니다.',
      }
    } finally {
      loadingCityIds.value = loadingCityIds.value.filter((cityId) => cityId !== city.id)
    }
  }

  const getArrivalWeather = (cityId, arrivalAt) => {
    const forecasts = forecastsByCity.value[cityId]
    const arrivalTime = new Date(arrivalAt).getTime()
    if (!forecasts?.length || Number.isNaN(arrivalTime)) return null

    const arrivalIndex = forecasts.reduce((nearestIndex, forecast, index) => {
      const nearestDifference = Math.abs(forecasts[nearestIndex].dt * 1000 - arrivalTime)
      const forecastDifference = Math.abs(forecast.dt * 1000 - arrivalTime)
      return forecastDifference < nearestDifference ? index : nearestIndex
    }, 0)

    const arrival = forecasts[arrivalIndex]
    const weatherType = getWeatherType(arrival.weather[0]?.id)

    return {
      forecastAt: arrival.dt,
      forecastTime: formatForecastTime(arrival.dt),
      temp: Math.round(arrival.main.temp),
      feelsLike: Math.round(arrival.main.feels_like),
      rain: Math.round((arrival.pop ?? 0) * 100),
      wind: arrival.wind.speed,
      status: arrival.weather[0]?.description ?? '날씨 정보 없음',
      icon: getWeatherEmoji(weatherType),
    }
  }

  return {
    forecastsByCity,
    loadingCityIds,
    errorsByCity,
    isLoading,
    fetchCityForecast,
    getArrivalWeather,
  }
})
