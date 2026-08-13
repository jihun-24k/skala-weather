<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { koreaMapPaths } from '../../data/koreaMapPaths'
import { cityBoundaryPaths } from '../../data/cityBoundaryPaths'
import { provinceBoundaryPaths } from '../../data/provinceBoundaryPaths'

const selectedCityIds = defineModel({ type: Array, required: true })

const props = defineProps({
  cities: {
    type: Array,
    required: true,
  },
  maxSelection: {
    type: Number,
    default: 3,
  },
  selectionLabels: {
    type: Array,
    default: () => [],
  },
})

const hoveredProvinceName = ref(null)
const hoveredCityId = ref(null)
let provinceCloseTimer
let cityOpenTimer
let cityCloseTimer

const cityProvinceMap = {
  seoul: '경기도', busan: '경상남도', incheon: '경기도', daegu: '경상북도',
  daejeon: '충청남도', gwangju: '전라남도', ulsan: '경상남도', sejong: '충청남도',
  suwon: '경기도', goyang: '경기도', yongin: '경기도', seongnam: '경기도', hwaseong: '경기도',
  bucheon: '경기도', namyangju: '경기도', ansan: '경기도', anyang: '경기도', pyeongtaek: '경기도',
  uijeongbu: '경기도', gimpo: '경기도', wonju: '강원도', chuncheon: '강원도', gangneung: '강원도',
  sokcho: '강원도', cheongju: '충청북도', chungju: '충청북도', cheonan: '충청남도',
  jeonju: '전라북도', gunsan: '전라북도', mokpo: '전라남도', yeosu: '전라남도',
  pohang: '경상북도', gumi: '경상북도', andong: '경상북도', gyeongju: '경상북도',
  changwon: '경상남도', gimhae: '경상남도', jinju: '경상남도', geoje: '경상남도', jeju: '제주특별자치도',
}

const provinceGroupMap = {
  서울특별시: '경기도', 인천광역시: '경기도',
  대전광역시: '충청남도', 세종특별자치시: '충청남도',
  광주광역시: '전라남도', 대구광역시: '경상북도',
  부산광역시: '경상남도', 울산광역시: '경상남도',
}
const getProvinceGroup = (provinceName) => provinceGroupMap[provinceName] ?? provinceName

const projectCity = (city) => {
  const mapX = 50 + ((city.longitude - 124.8) / 5.5) * 340
  const mapY = 30 + ((38.7 - city.latitude) / 5.9) * 540

  return { ...city, mapX, mapY }
}

const mapCities = computed(() => props.cities.map(projectCity))
const selectedCities = computed(() =>
  selectedCityIds.value
    .map((cityId) => mapCities.value.find((city) => city.id === cityId))
    .filter(Boolean),
)
const displayedProvinceName = computed(() => hoveredProvinceName.value)
const displayedProvince = computed(() =>
  provinceBoundaryPaths.find((province) => province.name === displayedProvinceName.value),
)
const displayedProvinceCities = computed(() =>
  mapCities.value.filter((city) => cityProvinceMap[city.id] === displayedProvinceName.value),
)
const displayedProvinceCityShapes = computed(() =>
  displayedProvinceCities.value
    .map((city) => ({ ...city, boundaryPath: cityBoundaryPaths[city.id] }))
    .filter((city) => city.boundaryPath),
)

const getPathBounds = (path, paddingRatio = 0.12) => {
  const points = [...path.matchAll(/[ML](-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)]
    .map((match) => [Number(match[1]), Number(match[2])])
  if (!points.length) return { minX: 0, minY: 0, width: 100, height: 80, viewBox: '0 0 100 80' }
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const width = Math.max(maxX - minX, 3)
  const height = Math.max(maxY - minY, 3)
  const padding = Math.max(width, height) * paddingRatio
  return { minX, minY, width, height, viewBox: `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}` }
}

const hoveredCity = computed(() =>
  displayedProvinceCities.value.find((city) => city.id === hoveredCityId.value),
)
const hoveredCityBoundaryPath = computed(() => cityBoundaryPaths[hoveredCityId.value] ?? '')
const hoveredCityViewBox = computed(() =>
  hoveredCityBoundaryPath.value
    ? getPathBounds(hoveredCityBoundaryPath.value, 0.16).viewBox
    : '0 0 100 80',
)

const provinceZoom = computed(() => {
  if (!displayedProvince.value) return null
  const bounds = getPathBounds(displayedProvince.value.path, 0.12)
  const scaleUnit = Math.max(bounds.width, bounds.height) / 100
  return {
    ...bounds,
    markerRadius: scaleUnit * 2.2,
    markerOffset: scaleUnit * 3.4,
    labelSize: scaleUnit * 4.2,
  }
})
const routePoints = computed(() =>
  selectedCities.value.map((city) => `${city.mapX},${city.mapY}`).join(' '),
)

const isSelected = (cityId) => selectedCityIds.value.includes(cityId)
const isDisabled = (cityId) => selectedCityIds.value.length >= props.maxSelection && !isSelected(cityId)
const toggleCity = (cityId) => {
  if (isSelected(cityId)) {
    selectedCityIds.value = selectedCityIds.value.filter((id) => id !== cityId)
    return
  }

  if (!isDisabled(cityId)) {
    selectedCityIds.value = [...selectedCityIds.value, cityId]
  }
}

const selectCity = (event, cityId) => {
  toggleCity(cityId)
  window.clearTimeout(cityOpenTimer)
  window.clearTimeout(cityCloseTimer)
  hoveredCityId.value = null
  event.currentTarget?.blur()
}

const showCityPreview = (cityId, delay = 200) => {
  window.clearTimeout(cityOpenTimer)
  window.clearTimeout(cityCloseTimer)
  if (hoveredCityId.value === cityId) return
  cityOpenTimer = window.setTimeout(() => {
    hoveredCityId.value = cityId
  }, delay)
}

const scheduleCityPreviewClose = () => {
  window.clearTimeout(cityOpenTimer)
  window.clearTimeout(cityCloseTimer)
  cityCloseTimer = window.setTimeout(() => {
    hoveredCityId.value = null
  }, 140)
}

const showProvince = (provinceName) => {
  window.clearTimeout(provinceCloseTimer)
  const provinceGroup = getProvinceGroup(provinceName)
  if (hoveredProvinceName.value !== provinceGroup) {
    window.clearTimeout(cityOpenTimer)
    window.clearTimeout(cityCloseTimer)
    hoveredCityId.value = null
  }
  hoveredProvinceName.value = provinceGroup
}

const scheduleProvinceClose = () => {
  window.clearTimeout(provinceCloseTimer)
  provinceCloseTimer = window.setTimeout(() => {
    hoveredProvinceName.value = null
    hoveredCityId.value = null
  }, 260)
}

onBeforeUnmount(() => {
  window.clearTimeout(provinceCloseTimer)
  window.clearTimeout(cityOpenTimer)
  window.clearTimeout(cityCloseTimer)
})
</script>

<template>
  <div class="map-layout">
    <div class="map-canvas">
      <svg
        viewBox="0 0 440 620"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby="korea-map-title korea-map-description"
      >
        <title id="korea-map-title">대한민국 여행지 선택 지도</title>
        <desc id="korea-map-description">도에 마우스를 올린 뒤 확대 지도에서 도시를 선택해 날씨를 비교합니다.</desc>

        <defs>
          <linearGradient id="land-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f8fdff" />
            <stop offset="0.52" stop-color="#dceffc" />
            <stop offset="1" stop-color="#b9dbf2" />
          </linearGradient>
          <linearGradient id="province-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff" stop-opacity=".12" />
            <stop offset="1" stop-color="#54a6df" stop-opacity=".08" />
          </linearGradient>
          <filter id="land-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#155e9d" flood-opacity=".22" />
          </filter>
        </defs>

        <g class="map-geometry" transform="translate(-39 0) scale(1.18 1)">
        <g class="land" filter="url(#land-shadow)">
          <path
            v-for="(path, index) in koreaMapPaths"
            :key="index"
            :class="{ mainland: index === 0, island: index > 0 }"
            :d="path"
          />
        </g>

        <g class="province-boundaries" aria-label="시도 경계">
          <path
            v-for="province in provinceBoundaryPaths"
            :key="province.name"
            :d="province.path"
            :class="{ active: displayedProvinceName === getProvinceGroup(province.name) }"
            role="button"
            tabindex="0"
            @mouseenter="showProvince(province.name)"
            @mouseleave="scheduleProvinceClose"
            @focus="showProvince(province.name)"
            @blur="scheduleProvinceClose"
            @mousedown.prevent
          >
            <title>{{ province.name }}</title>
          </path>
        </g>

        <polyline v-if="selectedCities.length > 1" :points="routePoints" class="travel-route" />
        <g
          v-for="city in mapCities"
          :key="city.id"
          class="city-marker"
          :class="{ selected: isSelected(city.id), disabled: isDisabled(city.id) }"
          aria-hidden="true"
        >
          <circle class="marker-wave" :cx="city.mapX" :cy="city.mapY" r="8" />
          <circle class="marker-dot" :cx="city.mapX" :cy="city.mapY" r="5" />
          <text v-if="isSelected(city.id)" :x="city.mapX + 11" :y="city.mapY - 10">
            {{ city.name }}
          </text>
        </g>
        </g>

        <g
          v-if="displayedProvince && provinceZoom"
          class="province-zoom"
          @mouseenter="showProvince(displayedProvince.name)"
          @mouseleave="scheduleProvinceClose"
        >
          <svg
            x="18"
            y="34"
            width="404"
            height="520"
            :viewBox="provinceZoom.viewBox"
            preserveAspectRatio="xMidYMid meet"
          >
            <path :d="displayedProvince.path" class="zoom-province-shape" />
            <path
              v-for="city in displayedProvinceCityShapes"
              :key="`boundary-${city.id}`"
              :d="city.boundaryPath"
              class="zoom-city-boundary"
              :class="{
                hovered: hoveredCityId === city.id,
                selected: isSelected(city.id),
                disabled: isDisabled(city.id),
              }"
              role="button"
              :tabindex="isDisabled(city.id) ? -1 : 0"
              :aria-label="`${city.name} ${isSelected(city.id) ? '선택 해제' : '선택'}`"
              @mouseenter="showCityPreview(city.id)"
              @mouseleave="scheduleCityPreviewClose"
              @focus="showCityPreview(city.id, 0)"
              @blur="scheduleCityPreviewClose"
              @click.stop="selectCity($event, city.id)"
              @keydown.enter="toggleCity(city.id)"
              @keydown.space.prevent="toggleCity(city.id)"
            />
            <g
              v-for="city in displayedProvinceCities"
              :key="city.id"
              class="zoom-city-marker"
              :class="{
                hovered: hoveredCityId === city.id,
                selected: isSelected(city.id),
                disabled: isDisabled(city.id),
              }"
              role="button"
              :tabindex="isDisabled(city.id) ? -1 : 0"
              :aria-label="`${city.name} ${isSelected(city.id) ? '선택 해제' : '선택'}`"
              :aria-pressed="isSelected(city.id)"
              :aria-disabled="isDisabled(city.id)"
              @mouseenter="showCityPreview(city.id)"
              @mouseleave="scheduleCityPreviewClose"
              @focus="showCityPreview(city.id, 0)"
              @blur="scheduleCityPreviewClose"
              @click.stop="selectCity($event, city.id)"
              @keydown.enter="toggleCity(city.id)"
              @keydown.space.prevent="toggleCity(city.id)"
            >
              <circle :cx="city.mapX" :cy="city.mapY" :r="provinceZoom.markerRadius" />
              <text
                :x="city.mapX + provinceZoom.markerOffset"
                :y="city.mapY + provinceZoom.labelSize * 0.35"
                :style="{ fontSize: `${provinceZoom.labelSize}px` }"
              >{{ city.name }}</text>
            </g>
          </svg>
          <text class="province-zoom-title" x="220" y="572" text-anchor="middle">
            {{ displayedProvince.name }} · 도시 선택
          </text>
        </g>

        <g
          v-if="hoveredCity && hoveredCityBoundaryPath"
          class="city-hover-preview"
          :class="{ selected: isSelected(hoveredCity.id) }"
          aria-hidden="true"
        >
          <svg
            x="92"
            y="165"
            width="256"
            height="250"
            :viewBox="hoveredCityViewBox"
            preserveAspectRatio="xMidYMid meet"
          >
            <path :d="hoveredCityBoundaryPath" class="city-hover-preview-shape" />
          </svg>
          <g class="city-hover-preview-label">
            <text class="city-hover-preview-name" x="220" y="282" text-anchor="middle">
              {{ hoveredCity.name }}
            </text>
            <text class="city-hover-preview-english" x="220" y="306" text-anchor="middle">
              {{ hoveredCity.englishName }}
            </text>
          </g>
        </g>
      </svg>
      <p class="map-guide"><span /> 도에 마우스를 올린 뒤 확대 지도에서 도시를 선택하세요</p>
    </div>

    <aside class="selected-panel" aria-live="polite">
      <div class="selected-heading">
        <div>
          <small>SELECTED</small>
          <strong>{{ selectionLabels.length ? '출발·도착 도시' : '선택한 여행지' }}</strong>
        </div>
        <b>{{ selectedCities.length }} / {{ maxSelection }}</b>
      </div>

      <ol>
        <li v-for="(city, index) in selectedCities" :key="city.id">
          <span>{{ selectionLabels[index] ?? `0${index + 1}` }}</span>
          <div><strong>{{ city.name }}</strong><small>{{ city.englishName }}</small></div>
          <button type="button" :aria-label="`${city.name} 선택 해제`" @click="toggleCity(city.id)">×</button>
        </li>
      </ol>

      <p v-if="selectionLabels.length">선택한 순서대로 출발지와 도착지가 지정되며 모두 해제할 수 있습니다.</p>
      <p v-else>도시를 선택하지 않거나 최대 {{ maxSelection }}곳까지 비교할 수 있습니다.</p>
    </aside>
  </div>
</template>

<style scoped>
.map-layout { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(240px, 0.65fr); align-items: start; gap: 18px; margin-top: 14px; }
.map-canvas { position: relative; min-height: 570px; padding: 8px; overflow: hidden; background: #f8fafc; border: 1px solid #e2eaf2; border-radius: 28px; box-shadow: inset 0 1px 0 #fff, 0 18px 42px rgba(45, 83, 115, 0.08); }
.map-canvas > svg { display: block; width: 100%; height: 535px; }
.land path, .land circle { fill: url(#land-gradient); stroke: #fff; stroke-width: 2.4; stroke-linejoin: round; }
.mainland { stroke-dasharray: 1500; stroke-dashoffset: 1500; animation: draw-land 1.2s ease forwards; }
.island { opacity: 0.82; animation: island-enter 0.7s ease 0.65s both; }
.province-boundaries { pointer-events: auto; }
.province-boundaries path { fill: url(#province-gradient); stroke: rgba(79, 142, 188, 0.46); stroke-width: 1.1; stroke-linejoin: round; vector-effect: non-scaling-stroke; cursor: zoom-in; transition: fill 0.2s ease, stroke 0.2s ease; }
.province-boundaries path:nth-child(even) { fill: rgba(255, 255, 255, 0.07); }
.province-boundaries path:hover, .province-boundaries path:focus, .province-boundaries path.active { fill: rgba(87, 158, 211, 0.28); stroke: #357fba; stroke-width: 2; outline: none; }
.travel-route { fill: none; stroke: #ffad3d; stroke-width: 3.4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 8 8; filter: drop-shadow(0 3px 4px rgba(202, 114, 20, 0.34)); pointer-events: none; animation: route-flow 0.9s linear infinite; }
.city-marker { color: #5895c1; pointer-events: none; }
.marker-dot { fill: currentcolor; stroke: #fff; stroke-width: 3; filter: drop-shadow(0 3px 4px rgba(33, 95, 143, 0.2)); transition: fill 0.2s ease, stroke 0.2s ease; }
.marker-wave { fill: none; stroke: currentcolor; stroke-width: 2; opacity: 0; }
.city-marker.selected { color: #f49a32; }
.city-marker.selected .marker-wave { animation: marker-pulse 1.8s ease-out infinite; }
.city-marker.disabled { opacity: 0.24; }
.city-marker text { fill: #294966; paint-order: stroke; stroke: #f5fbff; stroke-width: 5px; stroke-linejoin: round; font-size: 13px; font-weight: 800; }
.province-zoom { cursor: default; filter: drop-shadow(0 18px 18px rgba(38, 83, 117, 0.32)); animation: province-zoom-enter 0.3s ease both; }
.province-zoom > svg { transform-box: fill-box; transform-origin: center; animation: province-shape-enter 0.38s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.zoom-province-shape { fill: rgba(203, 233, 251, 0.98); stroke: #fff; stroke-width: 4; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.zoom-city-boundary { fill: rgba(255, 255, 255, 0.06); stroke: rgba(62, 126, 173, 0.55); stroke-width: 1.2; stroke-linejoin: round; vector-effect: non-scaling-stroke; cursor: pointer; outline: none; transition: fill 0.18s ease, stroke 0.18s ease; }
.zoom-city-boundary.hovered, .zoom-city-boundary:focus { fill: rgba(244, 154, 50, 0.38); stroke: #e78117; stroke-width: 2.6; filter: drop-shadow(0 4px 4px rgba(192, 103, 14, 0.25)); }
.zoom-city-boundary.selected { fill: rgba(244, 154, 50, 0.28); stroke: #e98c25; stroke-width: 2; }
.zoom-city-boundary.disabled { cursor: not-allowed; opacity: 0.32; }
.zoom-city-marker { color: #397fad; cursor: pointer; outline: none; }
.zoom-city-marker circle { fill: currentcolor; stroke: #fff; stroke-width: 2; vector-effect: non-scaling-stroke; transition: fill 0.22s ease, stroke 0.22s ease; }
.zoom-city-marker text { fill: #173b58; paint-order: stroke fill; stroke: #fff; stroke-width: 3px; stroke-linejoin: round; font-weight: 900; }
.zoom-city-marker:hover circle, .zoom-city-marker:focus circle, .zoom-city-marker.hovered circle { fill: #f49a32; stroke: #fff4df; stroke-width: 3; }
.zoom-city-marker.selected { color: #f49a32; }
.zoom-city-marker.disabled { opacity: 0.3; cursor: not-allowed; }
.province-zoom-title { fill: #173b58; paint-order: stroke fill; stroke: #f8fafc; stroke-width: 5px; font-size: 16px; font-weight: 900; }
.city-hover-preview { pointer-events: none; filter: drop-shadow(0 18px 16px rgba(27, 74, 111, 0.38)); animation: city-hover-preview-enter 0.34s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.city-hover-preview-shape { fill: rgba(67, 137, 187, 0.96); stroke: #fff; stroke-width: 4; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.city-hover-preview.selected .city-hover-preview-shape { fill: rgba(244, 154, 50, 0.96); }
.city-hover-preview-label { filter: drop-shadow(0 3px 3px rgba(19, 55, 82, 0.4)); }
.city-hover-preview-name, .city-hover-preview-english { paint-order: stroke fill; stroke: #173b58; stroke-linejoin: round; }
.city-hover-preview-name { fill: #fff; stroke-width: 6px; font-size: 25px; font-weight: 900; letter-spacing: -0.03em; }
.city-hover-preview-english { fill: #eaf7ff; stroke-width: 4px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; }
.map-guide { position: absolute; right: 18px; bottom: 14px; display: flex; align-items: center; gap: 7px; margin: 0; color: #71869a; font-size: 11px; }
.map-guide span { width: 8px; height: 8px; background: #5c8eb6; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 0 1px #8bb2ce; }
.selected-panel { height: fit-content; padding: 20px 22px; background: linear-gradient(155deg, rgba(255, 255, 255, 0.94), rgba(232, 245, 254, 0.9)); border: 1px solid rgba(255, 255, 255, 0.88); border-radius: 22px; box-shadow: 0 15px 35px rgba(38, 104, 159, 0.1); backdrop-filter: blur(12px); }
.selected-heading { display: flex; align-items: center; justify-content: space-between; }
.selected-heading small, .selected-heading strong { display: block; }
.selected-heading small { margin-bottom: 4px; color: #6394c1; font-size: 9px; font-weight: 800; letter-spacing: 0.14em; }
.selected-heading strong { color: #29435d; font-size: 15px; }
.selected-heading b { padding: 6px 9px; color: #3978ce; background: #fff; border-radius: 999px; font-size: 11px; }
ol { display: grid; grid-template-columns: 1fr; gap: 9px; margin: 16px 0; padding: 0; list-style: none; }
li { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; padding: 12px; background: rgba(255, 255, 255, 0.82); border: 1px solid #e0ebf5; border-radius: 13px; }
li > span { display: inline-grid; place-items: center; width: 34px; min-height: 22px; color: #6285a5; background: #edf5fb; border-radius: 7px; font-size: 10px; font-weight: 800; }
li strong, li small { display: block; }
li strong { color: #334d67; font-size: 13px; }
li small { margin-top: 2px; color: #91a0af; font-size: 9px; }
li button { display: grid; place-items: center; width: 25px; height: 25px; padding: 0; color: #8498ab; background: #eff4f8; border: 0; border-radius: 50%; font-size: 16px; cursor: pointer; }
.selected-panel > p { margin: 0; color: #8293a5; font-size: 10px; line-height: 1.6; }
@keyframes draw-land { to { stroke-dashoffset: 0; } }
@keyframes island-enter { from { opacity: 0; transform: translateY(10px) scale(0.9); } }
@keyframes route-flow { to { stroke-dashoffset: -16; } }
@keyframes marker-pulse { 0%, 100% { opacity: 0.28; } 50% { opacity: 0.7; } }
@keyframes province-zoom-enter { from { opacity: 0; } }
@keyframes province-shape-enter { from { transform: translateY(8px) scale(0.88); } }
@keyframes city-hover-preview-enter { from { opacity: 0; transform: translateY(5px) scale(0.94); transform-origin: center; } }
@media (prefers-reduced-motion: reduce) { .mainland, .island, .travel-route, .city-marker.selected .marker-wave, .province-zoom, .province-zoom > svg, .city-hover-preview { animation: none; stroke-dashoffset: 0; } }
@media (max-width: 800px) { .map-layout { grid-template-columns: 1fr; } .map-canvas { min-height: 570px; } .map-canvas > svg { height: 535px; } }
@media (max-width: 580px) { .map-canvas { min-height: 510px; padding: 0; } .map-canvas > svg { height: 480px; } .map-guide { right: 12px; bottom: 10px; } }
</style>
