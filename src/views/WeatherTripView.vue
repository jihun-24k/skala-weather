<script setup>
import { computed, ref, watch } from 'vue'
import BasePageLayout from '../components/BasePageLayout.vue'
import BaseSurface from '../components/BaseSurface.vue'
import KoreaCityMap from '../components/trip/KoreaCityMap.vue'
import TripWeatherComparison from '../components/trip/TripWeatherComparison.vue'
import { initialCities } from '../data/cities'
import { useTripWeatherStore } from '../stores/tripWeather'

const today = new Date()
today.setMinutes(0, 0, 0)
const formatDateTimeValue = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
}

const maxDate = new Date(today)
maxDate.setDate(maxDate.getDate() + 4)
maxDate.setHours(23, 59, 0, 0)
const maxDepartureDate = new Date(maxDate)
maxDepartureDate.setHours(maxDepartureDate.getHours() - 3)

const selectedCityIds = ref(['seoul', 'busan'])
const arrivalTimesByCity = ref({})
const tripWeatherStore = useTripWeatherStore()
const minDateTime = formatDateTimeValue(today)
const maxDateTime = formatDateTimeValue(maxDate)
const maxDepartureDateTime = formatDateTimeValue(maxDepartureDate)

const selectedCities = computed(() =>
    selectedCityIds.value
        .map((cityId) => initialCities.find((city) => city.id === cityId))
        .filter(Boolean),
)

watch(
    selectedCityIds,
    (cityIds) => {
        Object.keys(arrivalTimesByCity.value).forEach((cityId) => {
            if (!cityIds.includes(cityId)) delete arrivalTimesByCity.value[cityId]
        })

        cityIds.forEach((cityId) => {
            const city = initialCities.find((item) => item.id === cityId)
            if (!city) return

            if (!arrivalTimesByCity.value[cityId]) {
                arrivalTimesByCity.value[cityId] = formatDateTimeValue(new Date())
            }

            tripWeatherStore.fetchCityForecast(city)
        })
    },
    { immediate: true },
)

const updateArrivalTime = (cityId, arrivalAt) => {
    arrivalTimesByCity.value[cityId] = arrivalAt

    if (cityId !== selectedCityIds.value[0]) return
    const destinationId = selectedCityIds.value[1]
    const destinationTime = arrivalTimesByCity.value[destinationId]
    if (!destinationId || new Date(destinationTime) > new Date(arrivalAt)) return

    const adjustedArrival = new Date(arrivalAt)
    adjustedArrival.setHours(adjustedArrival.getHours() + 3)
    arrivalTimesByCity.value[destinationId] = formatDateTimeValue(adjustedArrival)
}
</script>

<template>
    <BasePageLayout>
        <section class="trip-hero" aria-labelledby="trip-title">
            <div>
                <p class="eyebrow">WEATHER FOR YOUR JOURNEY</p>
                <h1 id="trip-title">여행지 날씨를<br />한눈에 비교하세요</h1>
                <p class="hero-description">
                    출발할 때의 도시 날씨와 다른 도시에 도착했을 때의 날씨를 간단히 비교할 수 있어요.
                </p>
            </div>
            <div class="trip-visual" aria-hidden="true">
                <span>🧳</span>
                <span>⛅</span>
            </div>
        </section>

        <BaseSurface class="trip-content">
            <section class="trip-form" aria-labelledby="plan-title">
                <div class="section-heading">
                    <div>
                        <p class="section-label">PLAN YOUR TRIP</p>
                        <h2 id="plan-title">여행 지역 선택</h2>
                    </div>
                    <span class="forecast-range">출발지 → 도착지</span>
                </div>

                <fieldset class="city-field">
                    <legend>이동 경로 선택 <span>출발지와 도착지</span></legend>
                    <KoreaCityMap v-model="selectedCityIds" :cities="initialCities" :max-selection="2"
                        :selection-labels="['출발', '도착']" />
                </fieldset>
            </section>

            <section class="comparison" aria-labelledby="comparison-title">
                <div class="section-heading">
                    <div>
                        <p class="section-label">COMPARE DESTINATIONS</p>
                        <h2 id="comparison-title">출발·도착 날씨 비교</h2>
                    </div>
                    <span class="forecast-range">도시별 도착 시간 기준</span>
                </div>

                <TripWeatherComparison v-if="selectedCities.length === 2" :departure="selectedCities[0]"
                    :destination="selectedCities[1]" :departure-at="arrivalTimesByCity[selectedCityIds[0]]"
                    :arrival-at="arrivalTimesByCity[selectedCityIds[1]]"
                    :departure-weather="tripWeatherStore.getArrivalWeather(selectedCityIds[0], arrivalTimesByCity[selectedCityIds[0]])"
                    :arrival-weather="tripWeatherStore.getArrivalWeather(selectedCityIds[1], arrivalTimesByCity[selectedCityIds[1]])"
                    :departure-loading="tripWeatherStore.loadingCityIds.includes(selectedCityIds[0])"
                    :arrival-loading="tripWeatherStore.loadingCityIds.includes(selectedCityIds[1])"
                    :departure-error="tripWeatherStore.errorsByCity[selectedCityIds[0]]"
                    :arrival-error="tripWeatherStore.errorsByCity[selectedCityIds[1]]" :min-date-time="minDateTime"
                    :max-departure-date-time="maxDepartureDateTime" :max-date-time="maxDateTime"
                    @update:departure-at="updateArrivalTime(selectedCityIds[0], $event)"
                    @update:arrival-at="updateArrivalTime(selectedCityIds[1], $event)" />

                <div v-else class="empty-comparison">
                    <span aria-hidden="true">📍</span>
                    <strong>{{ selectedCities.length ? '도착 도시를 선택해 주세요' : '아직 선택한 도시가 없습니다' }}</strong>
                    <p>출발 도시와 도착 도시를 모두 선택하면 하나의 화면에서 날씨 차이를 보여드려요.</p>
                </div>

                <aside class="next-step">
                    <span aria-hidden="true">💡</span>
                    <div>
                        <strong>예보 시간 안내</strong>
                        <p>출발 시각의 출발지 날씨와 도착 시각의 도착지 날씨만 나란히 비교합니다.</p>
                    </div>
                </aside>
            </section>
        </BaseSurface>

        <template #footer>여행 예보는 OpenWeatherMap의 5일 예보 범위 내에서 제공됩니다.</template>
    </BasePageLayout>
</template>

<style scoped>
.trip-hero {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    min-height: 350px;
    padding: 60px 64px;
    overflow: hidden;
    color: #fff;
    background:
        radial-gradient(circle at 82% 20%, rgba(255, 232, 143, 0.38), transparent 25%),
        linear-gradient(135deg, rgba(28, 116, 222, 0.96), rgba(75, 180, 224, 0.88));
    border: 1px solid rgba(255, 255, 255, 0.36);
    border-radius: 32px;
    box-shadow: 0 28px 70px rgba(18, 79, 151, 0.22);
}

.eyebrow,
.section-label {
    margin: 0 0 10px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.14em;
}

.eyebrow {
    color: rgba(255, 255, 255, 0.72);
}

.section-label {
    color: #3f80de;
}

h1 {
    margin: 0;
    font-size: clamp(40px, 6vw, 64px);
    line-height: 1.14;
    letter-spacing: -0.055em;
}

.hero-description {
    max-width: 520px;
    margin: 22px 0 0;
    color: rgba(255, 255, 255, 0.82);
    font-size: 14px;
    line-height: 1.8;
}

.trip-visual {
    position: relative;
    width: 230px;
    height: 170px;
}

.trip-visual span {
    position: absolute;
    filter: drop-shadow(0 18px 18px rgba(22, 70, 123, 0.2));
}

.trip-visual span:first-child {
    right: 10px;
    bottom: 0;
    font-size: 110px;
}

.trip-visual span:last-child {
    top: 0;
    left: 0;
    font-size: 78px;
}

.trip-content {
    margin-top: 18px;
    padding: 42px;
}

.trip-form {
    padding-bottom: 40px;
    border-bottom: 1px solid #e7eef7;
}

.section-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 20px;
}

.section-heading h2 {
    margin: 0;
    color: #172942;
    font-size: 28px;
    letter-spacing: -0.04em;
}

.forecast-range {
    padding: 7px 11px;
    color: #3978ce;
    background: #edf5ff;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
}

.city-field legend {
    color: #344b66;
    font-size: 13px;
    font-weight: 800;
}

.city-field {
    min-width: 0;
    margin: 30px 0 0;
    padding: 0;
    border: 0;
}

.city-field legend span {
    margin-left: 6px;
    color: #8494a8;
    font-size: 11px;
    font-weight: 500;
}

.comparison {
    padding-top: 40px;
}

.empty-comparison {
    display: grid;
    place-items: center;
    min-height: 220px;
    margin-top: 24px;
    padding: 30px;
    text-align: center;
    background: #f7fafd;
    border: 1px dashed #ccdceb;
    border-radius: 20px;
}

.empty-comparison span {
    font-size: 32px;
}

.empty-comparison strong {
    margin-top: 10px;
    color: #38536d;
    font-size: 15px;
}

.empty-comparison p {
    margin: 6px 0 0;
    color: #8293a5;
    font-size: 11px;
}

.next-step {
    display: flex;
    gap: 13px;
    margin-top: 18px;
    padding: 18px 20px;
    background: #edf5ff;
    border: 1px solid #dbeafa;
    border-radius: 16px;
}

.next-step>span {
    font-size: 22px;
}

.next-step strong {
    color: #294664;
    font-size: 13px;
}

.next-step p {
    margin: 5px 0 0;
    color: #6f8195;
    font-size: 12px;
    line-height: 1.6;
}

@media (max-width: 800px) {
    .trip-hero {
        grid-template-columns: 1fr;
        padding: 48px 42px;
    }

    .trip-visual {
        display: none;
    }

    .comparison-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 580px) {
    .trip-hero {
        min-height: auto;
        padding: 40px 24px;
        border-radius: 24px;
    }

    .trip-content {
        padding: 30px 20px;
    }

    .section-heading {
        align-items: start;
        flex-direction: column;
        gap: 12px;
    }
}
</style>
