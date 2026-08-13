<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BasePageLayout from '../components/BasePageLayout.vue'
import BaseSurface from '../components/BaseSurface.vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import WeatherDetailInfo from '../components/WeatherDetailInfo.vue'
import WeatherEffect from '../components/WeatherEffect.vue'
import { useWeatherStore } from '../stores/weather'

const weatherStore = useWeatherStore()

const {
  weatherList,
  searchQuery,
  selectedCityInfo,
  filteredWeatherList,
  averageTemp,
  isLoading,
  error,
} = storeToRefs(weatherStore)

onMounted(() => {
  if (!weatherList.value.length) {
    weatherStore.fetchWeatherList()
  }
})

const showDetail = (weather) => {
  weatherStore.selectCity(weather)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const searchCity = () => {
  if (filteredWeatherList.value.length > 0) {
    showDetail(filteredWeatherList.value[0])
  }
}
</script>

<template>
  <WeatherEffect :weather-type="selectedCityInfo?.weatherType" />

  <BasePageLayout>
    <div v-if="isLoading" class="request-state">
      <span aria-hidden="true">🌤️</span>
      <p>주요 도시의 날씨를 불러오는 중입니다...</p>
    </div>

    <div v-else-if="error" class="request-state request-state--error">
      <span aria-hidden="true">⚠️</span>
      <p>{{ error }}</p>
      <button type="button" @click="weatherStore.fetchWeatherList()">다시 시도</button>
    </div>

    <template v-else-if="selectedCityInfo">
      <WeatherDetailInfo :selected-city-info="selectedCityInfo" />

      <BaseSurface class="content" aria-labelledby="city-weather-title">
        <SearchBar v-model="searchQuery" @search="searchCity" />

        <div class="summary-row">
          <span>전국 주요 도시</span>
          <span>평균 기온 <b>{{ averageTemp.toFixed(1) }}°</b></span>
        </div>

        <div v-if="filteredWeatherList.length" class="city-grid">
          <WeatherCard v-for="weather in filteredWeatherList" :key="weather.id" :weather="weather"
            :selected="selectedCityInfo.id === weather.id" @select="showDetail(weather)" />
        </div>

        <div v-else class="empty-state">
          <span>🌤️</span>
          <h3>검색 결과가 없어요</h3>
          <p>전국 주요 도시 {{ weatherList.length }}곳 중에서 다시 검색해 보세요.</p>
          <button type="button" @click="searchQuery = ''">전체 도시 보기</button>
        </div>
      </BaseSurface>
    </template>

    <template #footer>기상 데이터는 OpenWeatherMap에서 제공합니다.</template>
  </BasePageLayout>
</template>

<style scoped>
.content {
  margin-top: 18px;
  padding: 38px 42px 42px;
}

.request-state {
  display: grid;
  place-items: center;
  min-height: 390px;
  padding: 48px 20px;
  color: #647991;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
}

.request-state span {
  font-size: 58px;
}

.request-state p {
  margin: 12px 0 0;
}

.request-state button {
  margin-top: 16px;
  padding: 10px 15px;
  color: #fff;
  background: #3f86dc;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 30px 0 14px;
  color: #8492a5;
  font-size: 12px;
}

.summary-row b {
  color: #334862;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.empty-state {
  padding: 56px 20px;
  text-align: center;
  background: #f8fafd;
  border: 1px dashed #cfdae8;
  border-radius: 20px;
}

.empty-state>span {
  font-size: 45px;
}

.empty-state h3 {
  margin: 14px 0 7px;
  color: #263b56;
}

.empty-state p {
  margin: 0 0 18px;
  color: #8290a2;
  font-size: 13px;
}

.empty-state button {
  padding: 10px 15px;
  color: #fff;
  background: #3f86dc;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}

@media (max-width: 800px) {
  .city-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 580px) {
  .content {
    padding: 28px 18px;
  }
}
</style>
