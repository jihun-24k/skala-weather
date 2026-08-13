<script setup>
import { computed } from 'vue'

const props = defineProps({
  departure: { type: Object, required: true },
  destination: { type: Object, required: true },
  departureAt: { type: String, required: true },
  arrivalAt: { type: String, required: true },
  departureWeather: { type: Object, default: null },
  arrivalWeather: { type: Object, default: null },
  departureLoading: Boolean,
  arrivalLoading: Boolean,
  departureError: { type: String, default: '' },
  arrivalError: { type: String, default: '' },
  minDateTime: { type: String, required: true },
  maxDepartureDateTime: { type: String, required: true },
  maxDateTime: { type: String, required: true },
})

const emit = defineEmits(['update:departureAt', 'update:arrivalAt'])
const hours = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'))
const splitTime = (value) => ({ date: value.slice(0, 10), hour: value.slice(11, 13) })
const departureTime = computed(() => splitTime(props.departureAt))
const arrivalTime = computed(() => splitTime(props.arrivalAt))
const isLoading = computed(() => props.departureLoading || props.arrivalLoading)
const error = computed(() => props.departureError || props.arrivalError)

const updateTime = (type, field, value) => {
  const current = type === 'departure' ? departureTime.value : arrivalTime.value
  const next = field === 'date'
    ? `${value}T${current.hour}:00`
    : `${current.date}T${value}:00`
  emit(type === 'departure' ? 'update:departureAt' : 'update:arrivalAt', next)
}

const isDisabled = (type, hour) => {
  const date = type === 'departure' ? departureTime.value.date : arrivalTime.value.date
  const value = new Date(`${date}T${hour}:00`).getTime()
  const min = new Date(type === 'departure' ? props.minDateTime : props.departureAt).getTime()
  const max = new Date(type === 'departure' ? props.maxDepartureDateTime : props.maxDateTime).getTime()
  return value < min || value > max
}

const differences = computed(() => {
  if (!props.departureWeather || !props.arrivalWeather) return []
  return [
    { label: '기온', value: props.arrivalWeather.temp - props.departureWeather.temp, unit: '°' },
    { label: '체감', value: props.arrivalWeather.feelsLike - props.departureWeather.feelsLike, unit: '°' },
    { label: '강수확률', value: props.arrivalWeather.rain - props.departureWeather.rain, unit: '%p' },
  ]
})

const formatDifference = ({ value, unit }) => `${value > 0 ? '+' : ''}${value}${unit}`

const weatherComment = computed(() => {
  if (!props.departureWeather || !props.arrivalWeather) return ''

  const tempDifference = props.arrivalWeather.temp - props.departureWeather.temp
  const rainDifference = props.arrivalWeather.rain - props.departureWeather.rain
  const comments = []

  if (tempDifference >= 5) {
    comments.push(`도착지 기온은 출발지보다 ${tempDifference}° 높습니다. 더 가벼운 옷차림을 준비하세요.`)
  } else if (tempDifference > 0) {
    comments.push(`도착지 기온은 출발지보다 ${tempDifference}° 높지만 큰 차이는 아닙니다.`)
  } else if (tempDifference <= -5) {
    comments.push(`도착지 기온은 출발지보다 ${Math.abs(tempDifference)}° 낮습니다. 겉옷을 챙기는 게 좋아요.`)
  } else if (tempDifference < 0) {
    comments.push(`도착지 기온은 출발지보다 ${Math.abs(tempDifference)}° 낮지만 비슷한 옷차림으로 이동할 수 있어요.`)
  } else {
    comments.push('출발지와 도착지의 예상 기온이 같습니다.')
  }

  if (rainDifference >= 30) {
    comments.push(`도착지 강수확률은 출발지보다 ${rainDifference}%p 높습니다. 우산을 준비하세요.`)
  } else if (rainDifference > 0) {
    comments.push(`도착지 강수확률이 출발지보다 ${rainDifference}%p 높지만 차이는 크지 않습니다.`)
  } else if (rainDifference <= -30) {
    comments.push(`도착지 강수확률은 출발지보다 ${Math.abs(rainDifference)}%p 낮아 비 걱정이 줄어듭니다.`)
  } else if (rainDifference < 0) {
    comments.push(`도착지 강수확률은 출발지보다 ${Math.abs(rainDifference)}%p 낮습니다.`)
  } else {
    comments.push('출발지와 도착지의 강수확률이 같습니다.')
  }

  if (props.arrivalWeather.rain >= 60 && rainDifference < 30) {
    comments.push('도착지의 절대 강수확률이 높은 편이므로 우산을 챙기세요.')
  }

  return comments.join(' ')
})
</script>

<template>
  <article class="comparison-card">
    <div class="route-heading">
      <div><small>DEPARTURE</small><strong>{{ departure.name }}</strong><span>{{ departure.englishName }}</span></div>
      <b aria-hidden="true">→</b>
      <div><small>ARRIVAL</small><strong>{{ destination.name }}</strong><span>{{ destination.englishName }}</span></div>
    </div>

    <div class="time-grid">
      <div v-for="type in ['departure', 'arrival']" :key="type">
        <label>{{ type === 'departure' ? '출발 일시' : '도착 일시' }}</label>
        <div class="time-fields">
          <input
            type="date"
            :value="type === 'departure' ? departureTime.date : arrivalTime.date"
            :min="(type === 'departure' ? minDateTime : departureAt).slice(0, 10)"
            :max="(type === 'departure' ? maxDepartureDateTime : maxDateTime).slice(0, 10)"
            @input="updateTime(type, 'date', $event.target.value)"
          />
          <select
            :value="type === 'departure' ? departureTime.hour : arrivalTime.hour"
            @change="updateTime(type, 'hour', $event.target.value)"
          >
            <option v-for="hour in hours" :key="hour" :value="hour" :disabled="isDisabled(type, hour)">{{ hour }}시</option>
          </select>
        </div>
      </div>
    </div>

    <p v-if="isLoading" class="state">두 도시의 예보를 불러오는 중입니다…</p>
    <p v-else-if="error" class="state error">{{ error }}</p>

    <template v-else-if="departureWeather && arrivalWeather">
      <div class="weather-comparison">
        <section v-for="(weather, index) in [departureWeather, arrivalWeather]" :key="index">
          <div class="weather-role">{{ index === 0 ? 'DEPARTURE · 출발 날씨' : 'ARRIVAL · 도착 날씨' }}</div>
          <span class="weather-icon">{{ weather.icon }}</span>
          <strong>{{ weather.temp }}°</strong>
          <p>{{ weather.status }}</p>
          <dl>
            <div><dt>체감</dt><dd>{{ weather.feelsLike }}°</dd></div>
            <div><dt>강수</dt><dd>{{ weather.rain }}%</dd></div>
            <div><dt>바람</dt><dd>{{ weather.wind }}m/s</dd></div>
          </dl>
          <small>{{ weather.forecastTime }} 예보</small>
        </section>
      </div>

      <div class="arrival-change">
        <div class="difference-panel">
          <small>도착 후 변화</small>
          <div class="difference-list">
            <div v-for="difference in differences" :key="difference.label">
              <span>{{ difference.label }}</span>
              <b :class="{ warm: difference.value > 0, cool: difference.value < 0 }">{{ formatDifference(difference) }}</b>
            </div>
          </div>
        </div>
        <div class="weather-comment">
          <small>TRAVEL COMMENT</small>
          <strong>이동 후 날씨가 이렇게 달라져요</strong>
          <p>{{ weatherComment }}</p>
        </div>
      </div>
    </template>
  </article>
</template>

<style scoped>
.comparison-card { margin-top: 24px; padding: 26px; background: #f7fafd; border: 1px solid #e1eaf3; border-radius: 22px; }
.route-heading { display: grid; grid-template-columns: minmax(0, 1fr) 48px minmax(0, 1fr); align-items: stretch; gap: 16px; }
.route-heading > div { display: grid; align-content: center; min-width: 0; min-height: 92px; padding: 16px 18px; background: #fff; border: 1px solid #e4ecf5; border-radius: 15px; box-sizing: border-box; }
.route-heading > div:last-child { text-align: right; }
.route-heading small, .route-heading strong, .route-heading span { display: block; }
.route-heading small { color: #4b86cf; font-size: 9px; font-weight: 900; letter-spacing: .13em; }
.route-heading strong { margin-top: 5px; color: #223951; font-size: 24px; }
.route-heading span { color: #8a99aa; font-size: 10px; }
.route-heading b { display: grid; place-items: center; color: #f49a32; font-size: 28px; }
.time-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; margin-top: 22px; }
.time-grid > div { min-width: 0; }
.time-grid label { color: #536a82; font-size: 11px; font-weight: 800; }
.time-fields { display: grid; grid-template-columns: 1fr 84px; gap: 8px; margin-top: 7px; }
input, select { width: 100%; padding: 11px 12px; color: #20344d; background: #fff; border: 1px solid #dce7f2; border-radius: 11px; box-sizing: border-box; outline: none; }
input:focus, select:focus { border-color: #5797ea; box-shadow: 0 0 0 3px rgba(65, 134, 224, .1); }
.state { min-height: 180px; margin-top: 24px; color: #718298; }
.state.error { color: #c95555; }
.weather-comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; align-items: stretch; margin-top: 26px; }
.weather-comparison section { display: flex; flex-direction: column; min-width: 0; min-height: 280px; padding: 22px; text-align: center; background: #fff; border-radius: 17px; box-sizing: border-box; }
.weather-role { margin-bottom: 13px; color: #4b86cf; font-size: 9px; font-weight: 900; letter-spacing: .08em; }
.weather-icon { display: block; font-size: 42px; }
.weather-comparison section > strong { display: block; margin-top: 4px; color: #25415e; font-size: 36px; }
.weather-comparison section > p { margin: 4px 0 16px; color: #6f8296; font-size: 12px; }
dl { display: grid; gap: 7px; margin: 0; }
dl div { display: flex; justify-content: space-between; }
dt { color: #8a99aa; font-size: 10px; }
dd { margin: 0; color: #435d76; font-size: 11px; font-weight: 800; }
.weather-comparison section > small { display: block; margin-top: auto; padding-top: 15px; color: #9aa8b6; font-size: 8px; }
.arrival-change { display: grid; grid-template-columns: minmax(230px, .75fr) minmax(0, 1.25fr); gap: 14px; margin-top: 16px; }
.difference-panel, .weather-comment { padding: 20px; background: #edf5ff; border-radius: 17px; }
.difference-panel > small, .weather-comment > small { color: #6b88a4; font-size: 9px; font-weight: 900; letter-spacing: .08em; }
.difference-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 13px; }
.difference-list div { display: grid; gap: 5px; padding: 10px; text-align: center; background: rgba(255, 255, 255, .72); border-radius: 10px; font-size: 10px; }
.difference-panel span { color: #7890a7; }
.difference-panel b { color: #5c7084; }
.difference-panel b.warm { color: #e77d21; }
.difference-panel b.cool { color: #3978ce; }
.weather-comment { background: linear-gradient(135deg, #edf5ff, #f8fbff); }
.weather-comment strong { display: block; margin-top: 8px; color: #31516f; font-size: 14px; }
.weather-comment p { margin: 7px 0 0; color: #6b7f92; font-size: 11px; line-height: 1.7; }
@media (max-width: 700px) { .time-grid, .weather-comparison, .arrival-change { grid-template-columns: 1fr; gap: 14px; } }
</style>
