import axios from 'axios'

const weatherApi = axios.create({
  baseURL: import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org',
  timeout: 10000,
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    units: 'metric',
    lang: 'kr',
  },
})

// 현재 날씨 정보 들고오기
export const getCurrentWeather = async ({ latitude, longitude }) => {
  const response = await weatherApi.get('/data/2.5/weather', {
    params: {
      lat: latitude,
      lon: longitude,
    },
  })

  return response.data
}

// 현재 기준 3시간 단위의 정보를 들고오기
// UTC 기준으로 정보를 조회한다
export const getWeatherForecast = async ({
  latitude,
  longitude,
}) => {
  const response = await weatherApi.get('/data/2.5/forecast', {
    params: {
      lat: latitude,
      lon: longitude,
    },
  })

  return response.data
}

export const searchLocations = async (query) => {
  const response = await weatherApi.get('/geo/1.0/direct', {
    params: {
      q: `${query},KR`,
      limit: 5,
    },
  })

  return response.data
}

export default weatherApi
