<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: { type: Object, required: true },
  arrivalAt: { type: String, required: true },
  weather: { type: Object, default: null },
  loading: Boolean,
  error: { type: String, default: '' },
  minDateTime: { type: String, required: true },
  maxDateTime: { type: String, required: true },
  roleLabel: { type: String, default: '' },
  timeLabel: { type: String, default: '도착 예정 일시' },
  referenceLabel: { type: String, default: '도착' },
})

const emit = defineEmits(['update:arrivalAt'])

const hourOptions = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'))
const dateValue = computed(() => props.arrivalAt.slice(0, 10))
const hourValue = computed(() => props.arrivalAt.slice(11, 13))
const minDate = computed(() => props.minDateTime.slice(0, 10))
const maxDate = computed(() => props.maxDateTime.slice(0, 10))

const updateDate = (date) => {
  emit('update:arrivalAt', `${date}T${hourValue.value || '00'}:00`)
}

const updateHour = (hour) => {
  emit('update:arrivalAt', `${dateValue.value}T${hour}:00`)
}

const isHourDisabled = (hour) => {
  const candidate = new Date(`${dateValue.value}T${hour}:00`).getTime()
  return candidate < new Date(props.minDateTime).getTime()
    || candidate > new Date(props.maxDateTime).getTime()
}
</script>

<template>
  <article class="arrival-card">
    <header>
      <div>
        <b v-if="roleLabel" class="role-label">{{ roleLabel }}</b>
        <h3>{{ city.name }}</h3>
        <p>{{ city.englishName }}</p>
      </div>
      <span v-if="weather" aria-hidden="true">{{ weather.icon }}</span>
    </header>

    <label :for="`arrival-${city.id}`">{{ timeLabel }}</label>
    <div class="date-time-fields">
      <input
        :id="`arrival-${city.id}`"
        :value="dateValue"
        type="date"
        :min="minDate"
        :max="maxDate"
        @input="updateDate($event.target.value)"
      />
      <select :value="hourValue" :aria-label="`${timeLabel} 시간`" @change="updateHour($event.target.value)">
        <option v-for="hour in hourOptions" :key="hour" :value="hour" :disabled="isHourDisabled(hour)">
          {{ hour }}시
        </option>
      </select>
    </div>

    <p v-if="loading" class="state-message">예보를 불러오는 중입니다…</p>
    <p v-else-if="error" class="state-message error">{{ error }}</p>

    <template v-else-if="weather">
      <div class="arrival-summary">
        <div><small>{{ referenceLabel }} 예상</small><strong>{{ weather.temp }}°</strong></div>
        <div><small>체감온도</small><strong>{{ weather.feelsLike }}°</strong></div>
        <div><small>강수확률</small><strong>{{ weather.rain }}%</strong></div>
      </div>

      <footer>
        <span>{{ weather.status }} · 바람 {{ weather.wind }}m/s</span>
        <small>가장 가까운 3시간 예보: {{ weather.forecastTime }}</small>
      </footer>
    </template>
  </article>
</template>

<style scoped>
.arrival-card { padding: 22px; background: #f7fafd; border: 1px solid #e4ecf5; border-radius: 20px; }
header { display: flex; align-items: center; justify-content: space-between; }
h3 { margin: 0; color: #223951; font-size: 20px; }
.role-label { display: block; margin-bottom: 5px; color: #3f80de; font-size: 10px; letter-spacing: 0.08em; }
header p { margin: 2px 0 0; color: #8796a8; font-size: 11px; }
header > span { font-size: 36px; }
label { display: block; margin-top: 20px; color: #536a82; font-size: 11px; font-weight: 800; }
.date-time-fields { display: grid; grid-template-columns: minmax(0, 1fr) 84px; gap: 8px; margin-top: 7px; }
input, select { width: 100%; padding: 11px 12px; color: #20344d; background: #fff; border: 1px solid #dce7f2; border-radius: 11px; outline: none; box-sizing: border-box; }
input:focus, select:focus { border-color: #5797ea; box-shadow: 0 0 0 3px rgba(65, 134, 224, 0.1); }
.state-message { min-height: 130px; margin: 18px 0 0; color: #718298; font-size: 12px; }
.state-message.error { color: #c95555; }
.arrival-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin-top: 18px; }
.arrival-summary div { padding: 11px 8px; text-align: center; background: #fff; border-radius: 11px; }
.arrival-summary small, .arrival-summary strong { display: block; }
.arrival-summary small { color: #8a99aa; font-size: 9px; }
.arrival-summary strong { margin-top: 5px; color: #294b6a; font-size: 16px; }
footer { display: grid; gap: 4px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #e1eaf3; }
footer span { color: #405b75; font-size: 11px; font-weight: 700; }
footer small { color: #8b9aaa; font-size: 9px; }
</style>
