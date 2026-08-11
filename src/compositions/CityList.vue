<script setup>
import { ref } from 'vue'

const weatherList = ref([
    { id: 'city_01', name: "서울", temp: 28, status: '맑음' },
    { id: 'city_02', name: "울산", temp: 24, status: '비' },
    { id: 'city_03', name: "광주", temp: 26, status: '구름' }
])

const cityName = ref('')

const showDetail = (cityName, status) => {
    window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>
<template>
    <h1>⛅️ 과제 1: 날씨 (Mockup)</h1>
    <div>
        <h2>도시 검색</h2>
        <input type="text" v-model="cityName" placeholder="도시 이름을 입력하세요.">
        <p>
            검색 중인 도시: {{ cityName }}
        </p>
    </div>
    <div>
        <h2>지역별 학습</h2>
        <ul>
            <li v-for="weather in weatherList" :key="weather.id">
                <div class="weather-info">
                    <span class="city">{{ weather.name }} ({{ weather.status }})</span>
                    <span class="temp">현재 기온: {{ weather.temp }}℃</span>
                </div>

                <span v-if="weather.temp >= 25" class="tag hot">
                    더움 (25도 이상)
                </span>

                <span v-if="weather.temp < 25" class="tag cool">
                    선선함 (25도 미만)
                </span>

                <button @click.stop="showDetail(weather.name, weather.status)">
                    상세보기
                </button>
            </li>
        </ul>
    </div>
</template>

<style scoped>
div {
    max-width: 720px;
    margin: 24px auto;
    padding: 24px;
}

h2 {
    margin-bottom: 16px;
}

input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 18px;
    margin-bottom: 12px;
    border: 1px solid #ddd;
    border-radius: 10px;
}

.weather-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 12px;
    padding: 0;
}

.city {
    font-size: 18px;
    font-weight: bold;
}

.temp {
    font-size: 18px;
    font-weight: bold;
}

.tag {
    display: inline-block;
    padding: 5px 10px;
    margin-right: 10px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
}

/* 25도 이상 */
.hot {
    color: #d32f2f;
    background-color: #ffebee;
    border: 1px solid #d32f2f;
}

/* 25도 미만 */
.cool {
    color: #1976d2;
    background-color: #e3f2fd;
    border: 1px solid #1976d2;
}

button {
    padding: 7px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
</style>