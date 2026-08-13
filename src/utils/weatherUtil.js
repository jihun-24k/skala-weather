export const getWeatherType = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return 'thunder'
  if (weatherId >= 300 && weatherId < 600) return 'rain'
  if (weatherId >= 600 && weatherId < 700) return 'snow'
  if (weatherId >= 700 && weatherId < 800) return 'fog'
  if (weatherId === 800) return 'sunny'
  if (weatherId > 800) return 'cloudy'

  return 'unknown'
}

const weatherEmoji = {
  thunder: '⛈️',
  rain: '🌧️',
  snow: '🌨️',
  fog: '🌫️',
  sunny: '☀️',
  cloudy: '⛅',
  unknown: '🌤️',
}

export const getWeatherEmoji = (weatherType) => weatherEmoji[weatherType] ?? weatherEmoji.unknown
