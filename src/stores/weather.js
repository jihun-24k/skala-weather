import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { getCurrentWeather, getWeatherForecast } from '../api/weatherApi'
import { initialCities } from '../data/cities'

const koreanDateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
})

const getKoreanDate = (timestamp) => koreanDateFormatter.format(new Date(timestamp * 1000))

export const useWeatherStore = defineStore('weather', () => {
    // =========================
    // state
    // =========================
    const weatherList = ref([])
    const selectedCityInfo = ref(null)
    const searchQuery = ref('')
    const isLoading = ref(false)
    const error = ref(null)

    // =========================
    // getters
    // =========================

    // 필터된 날씨 데이터는 캐싱한다.
    const filteredWeatherList = computed(() => {
        const query = searchQuery.value.trim().toLocaleLowerCase()

        if (!query) {
            return weatherList.value
        }

        // 도시 영어 이름을 기준으로 필터링
        return weatherList.value.filter(
            (weather) =>
                weather.name.includes(query) || weather.englishName.toLocaleLowerCase().includes(query),
        )
    })

    // 전체 도시의 평균 데이터를 캐싱한다.
    const averageTemp = computed(() => {
        if (!weatherList.value.length) return 0

        const total = weatherList.value.reduce((sum, weather) => sum + weather.temp, 0)

        return total / weatherList.value.length
    })

    // =========================
    // actions
    // =========================

    const fetchCityWeather = async (city) => {
        const [currentData, forecastData] = await Promise.all([
            getCurrentWeather(city),
            getWeatherForecast(city),
        ])

        // 지금 시간과 제일 가까운 강수량 정보 가져오기
        const currentTime = Date.now()

        const nearestForecast = forecastData.list.reduce((nearest, forecast) => {
            const nearestDifference = Math.abs(nearest.dt * 1000 - currentTime)
            const forecastDifference = Math.abs(forecast.dt * 1000 - currentTime)

            return forecastDifference < nearestDifference ? forecast : nearest
        })

        // 현재 한국 시간 기준으로 최저, 최고 기온을 측정하기 위한 전처리
        const todayInKorea = getKoreanDate(Math.floor(currentTime / 1000))
        const todayForecasts = forecastData.list.filter(
            (forecast) => getKoreanDate(forecast.dt) === todayInKorea,
        )
        const dailyForecasts = todayForecasts.length ? todayForecasts : [nearestForecast]
        const high = Math.max(
            currentData.main.temp,
            ...dailyForecasts.map((forecast) => forecast.main.temp_max),
        )
        const low = Math.min(
            currentData.main.temp,
            ...dailyForecasts.map((forecast) => forecast.main.temp_min),
        )

        return {
            ...city,
            temp: Math.round(currentData.main.temp),
            status: currentData.weather[0]?.description ?? '날씨 정보 없음',
            icon: getWeatherEmoji(currentData.weather[0]?.id),
            high: Math.round(high),
            low: Math.round(low),
            humidity: currentData.main.humidity,
            wind: currentData.wind.speed,
            rain: Math.round((nearestForecast.pop ?? 0) * 100),
            feelsLike: Math.round(currentData.main.feels_like),
        }
    }

    const selectCity = (weather) => {
        selectedCityInfo.value = weather
    }

    const fetchWeatherList = async () => {
        isLoading.value = true
        error.value = null

        try {
            weatherList.value = await Promise.all(initialCities.map((city) => fetchCityWeather(city)))

            selectCity(weatherList.value[0])
        } catch (requestError) {
            error.value = getRequestErrorMessage(requestError)
        } finally {
            isLoading.value = false
        }
    }

    const getWeatherEmoji = (weatherId) => {
        if (weatherId >= 200 && weatherId < 300) return '⛈️'
        if (weatherId >= 300 && weatherId < 600) return '🌧️'
        if (weatherId >= 600 && weatherId < 700) return '🌨️'
        if (weatherId >= 700 && weatherId < 800) return '🌫️'
        if (weatherId === 800) return '☀️'
        if (weatherId > 800) return '⛅'

        return '🌤️'
    }

    const getRequestErrorMessage = (error) => {
        if (!axios.isAxiosError(error)) {
            return '알 수 없는 오류가 발생했습니다.'
        }

        if (error.code === 'ECONNABORTED') {
            return '요청 시간이 초과되었습니다.'
        }

        if (!error.response) {
            return '네트워크 연결을 확인해 주세요.'
        }

        switch (error.response.status) {
            case 401:
                return 'OpenWeatherMap API 키를 확인해 주세요.'
            case 404:
                return '날씨 정보를 찾을 수 없습니다.'
            case 429:
                return 'API 요청 한도를 초과했습니다.'
            default:
                return error.response.data?.message || '날씨 정보를 불러오지 못했습니다.'
        }
    }

    return {
        weatherList,
        selectedCityInfo,
        searchQuery,
        isLoading,
        error,
        filteredWeatherList,
        averageTemp,
        fetchWeatherList,
        selectCity,
    }
})
