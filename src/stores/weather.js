import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { getCurrentWeather, getWeatherForecast } from '../api/weatherApi'
import { initialCities } from '../data/cities'
import { getCurrentPosition } from '../utils/geolocation'
import { getWeatherEmoji, getWeatherType } from '../utils/weatherUtil'

const koreanDateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
})

const getKoreanDate = (timestamp) => koreanDateFormatter.format(new Date(timestamp * 1000))

// 현재 위치를 받아오기
const getCurrentLocationName = (apiCityName) => {
    if (!apiCityName) return '현재 위치'

    const matchedCity = initialCities.find(
        (city) => city.englishName.toLocaleLowerCase() === apiCityName.toLocaleLowerCase(),
    )

    return matchedCity?.name ?? apiCityName
}

export const useWeatherStore = defineStore('weather', () => {
    // =========================
    // state
    // =========================
    const weatherList = ref([])
    const selectedCityInfo = ref(null)
    const searchQuery = ref('')
    const isLoading = ref(false)
    const isLocating = ref(false)
    const error = ref(null)
    const locationError = ref(null)

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

        const weatherId = currentData.weather[0]?.id
        const weatherType = getWeatherType(weatherId)

        // 3시간 단위로 24시간 날씨 예측 데이터 전처리
        const next24Hours = currentTime + 24 * 60 * 60 * 1000
        const hourlyForecast = [
            {
                timestamp: Math.floor(currentTime / 1000),
                isCurrent: true,
                temp: Math.round(currentData.main.temp),
                rain: null,
                weatherType,
                icon: getWeatherEmoji(weatherType),
                status: currentData.weather[0]?.description ?? '날씨 정보 없음',
            },
            ...forecastData.list
                .filter((forecast) => {
                    const forecastTime = forecast.dt * 1000

                    return forecastTime >= currentTime && forecastTime <= next24Hours
                })
                .map((forecast) => {
                    const forecastWeatherType = getWeatherType(forecast.weather[0]?.id)

                    return {
                        timestamp: forecast.dt,
                        isCurrent: false,
                        temp: Math.round(forecast.main.temp),
                        rain: Math.round((forecast.pop ?? 0) * 100),
                        weatherType: forecastWeatherType,
                        icon: getWeatherEmoji(forecastWeatherType),
                        status: forecast.weather[0]?.description ?? '날씨 정보 없음',
                    }
                }),
        ]

        return {
            ...city,
            name: city.id === 'current-location' ? getCurrentLocationName(currentData.name) : city.name,
            weatherId,
            weatherType,
            temp: Math.round(currentData.main.temp),
            status: currentData.weather[0]?.description ?? '날씨 정보 없음',
            icon: getWeatherEmoji(weatherType),
            high: Math.round(high),
            low: Math.round(low),
            humidity: currentData.main.humidity,
            wind: currentData.wind.speed,
            rain: Math.round((nearestForecast.pop ?? 0) * 100),
            feelsLike: Math.round(currentData.main.feels_like),
            hourlyForecast,
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

            if (!selectedCityInfo.value) {
                selectCity(weatherList.value[0])
            }
        } catch (requestError) {
            error.value = getRequestErrorMessage(requestError)
        } finally {
            isLoading.value = false
        }
    }

    // 현재 위치를 가져와서 actions
    const fetchCurrentLocationWeather = async () => {
        isLocating.value = true
        locationError.value = null

        try {
            const coordinates = await getCurrentPosition()
            const currentLocationWeather = await fetchCityWeather({
                id: 'current-location',
                name: '현재 위치',
                englishName: 'Current location',
                ...coordinates,
            })

            selectCity(currentLocationWeather)
        } catch (requestError) {
            locationError.value = getLocationErrorMessage(requestError)
        } finally {
            isLocating.value = false
        }
    }

    const getLocationErrorMessage = (locationRequestError) => {
        if (axios.isAxiosError(locationRequestError)) {
            return getRequestErrorMessage(locationRequestError)
        }

        if (locationRequestError.message === 'GEOLOCATION_NOT_SUPPORTED') {
            return '이 브라우저에서는 위치 정보를 지원하지 않습니다.'
        }

        switch (locationRequestError.code) {
            case 1:
                return '위치 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해 주세요.'
            case 2:
                return '현재 위치를 확인할 수 없습니다.'
            case 3:
                return '위치 확인 시간이 초과되었습니다.'
            default:
                return '위치 정보를 불러오지 못했습니다.'
        }
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
        isLocating,
        error,
        locationError,
        filteredWeatherList,
        averageTemp,
        fetchWeatherList,
        fetchCurrentLocationWeather,
        selectCity,
    }
})
