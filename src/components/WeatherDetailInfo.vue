<script setup>
import { computed } from 'vue'
import HourlyWeatherForecast from './HourlyWeatherForecast.vue'

const props = defineProps({
  selectedCityInfo: {
    type: Object,
    required: true,
  },
})

const currentDate = computed(() =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date()),
)

const clothingRecommendation = computed(() => {
  const temperature = props.selectedCityInfo.feelsLike ?? props.selectedCityInfo.temp

  if (temperature >= 28) {
    return {
      items: ['👕', '🩳', '🧢'],
      title: '아주 더운 날씨예요',
      description: '민소매, 반팔과 반바지처럼 시원한 옷차림을 추천해요.',
    }
  }

  if (temperature >= 23) {
    return {
      items: ['👕', '👖', '🧢'],
      title: '따뜻한 날씨예요',
      description: '반팔이나 얇은 셔츠, 면바지가 잘 어울려요.',
    }
  }

  if (temperature >= 20) {
    return {
      items: ['👔', '👖', '👟'],
      title: '선선한 날씨예요',
      description: '얇은 긴팔이나 셔츠, 가벼운 바지를 추천해요.',
    }
  }

  if (temperature >= 17) {
    return {
      items: ['🧶', '👖', '👟'],
      title: '가벼운 겉옷이 필요해요',
      description: '얇은 니트나 가디건을 함께 챙겨 보세요.',
    }
  }

  if (temperature >= 12) {
    return {
      items: ['🧥', '🧶', '👖'],
      title: '쌀쌀한 날씨예요',
      description: '재킷, 가디건 또는 야상 같은 겉옷을 추천해요.',
    }
  }

  if (temperature >= 9) {
    return {
      items: ['🧥', '🧣', '👖'],
      title: '따뜻하게 입으세요',
      description: '트렌치코트나 두꺼운 니트가 잘 어울려요.',
    }
  }

  if (temperature >= 5) {
    return {
      items: ['🧥', '🧣', '🧤'],
      title: '추운 날씨예요',
      description: '코트와 니트, 목도리를 함께 챙겨 보세요.',
    }
  }

  return {
    items: ['🧥', '🧣', '🧤'],
    title: '매우 추운 날씨예요',
    description: '패딩과 두꺼운 겨울옷, 장갑을 착용하세요.',
  }
})
</script>
<template>
  <section
    class="hero"
    :data-weather="selectedCityInfo.weatherType ?? 'unknown'"
    aria-labelledby="current-weather-title"
  >
    <div class="weather-decoration" aria-hidden="true" />

    <div class="hero-copy">
      <p class="eyebrow">대한민국 · 현재 날씨</p>
      <div class="location-line">
        <h1 id="current-weather-title">{{ selectedCityInfo.name }}</h1>
        <span class="location-pin" aria-hidden="true">●</span>
      </div>
      <p class="today">{{ currentDate }} · {{ selectedCityInfo.status }}</p>

      <div class="current-temperature">
        <span class="weather-symbol" aria-hidden="true">{{ selectedCityInfo.icon }}</span>
        <strong>{{ selectedCityInfo.temp }}<sup>°</sup></strong>
      </div>
      <p class="feels-like">
        오늘은 <b>{{ selectedCityInfo.high }}°</b>까지 올라가요. 외출 전 날씨를 확인하세요.
      </p>
    </div>

    <aside class="weather-side">
      <div class="metrics" aria-label="상세 날씨 정보">
        <article>
          <span class="metric-icon">💧</span>
          <div>
            <small>습도</small><strong>{{ selectedCityInfo.humidity }}%</strong>
          </div>
        </article>
        <article>
          <span class="metric-icon">〰</span>
          <div>
            <small>바람</small><strong>{{ selectedCityInfo.wind }} m/s</strong>
          </div>
        </article>
        <article>
          <span class="metric-icon">☂</span>
          <div>
            <small>강수확률</small><strong>{{ selectedCityInfo.rain }}%</strong>
          </div>
        </article>
      </div>
    </aside>

    <div class="clothing-recommendation">
      <div :key="selectedCityInfo.id" class="outfit-preview" aria-hidden="true">
        <div class="outfit-rail"></div>
        <span
          v-for="(item, index) in clothingRecommendation.items"
          :key="`${selectedCityInfo.id}-${item}-${index}`"
          class="outfit-item"
          :class="{ 'outfit-item--featured': index === 0 }"
          :style="{ '--outfit-delay': `${index * 110}ms` }"
        >
          {{ item }}
        </span>
      </div>
      <div class="clothing-copy">
        <small>오늘의 옷차림 · 체감 {{ selectedCityInfo.feelsLike }}°</small>
        <strong>{{ clothingRecommendation.title }}</strong>
        <p>{{ clothingRecommendation.description }}</p>
      </div>
    </div>

    <HourlyWeatherForecast :forecasts="selectedCityInfo.hourlyForecast" />
  </section>
</template>

<style scoped>
.hero {
  --hero-start: rgba(22, 107, 225, 0.94);
  --hero-end: rgba(64, 161, 244, 0.85);
  --hero-glow: #b8e9ff;
  --hero-accent: #9fe1ff;
  --hero-panel: rgba(255, 255, 255, 0.13);
  --hero-panel-strong: rgba(255, 255, 255, 0.16);
  --hero-border: rgba(255, 255, 255, 0.22);
  --hero-shadow: rgba(18, 79, 151, 0.22);
  position: relative;
  display: grid;
  grid-template-columns: 1fr 320px;
  align-items: end;
  gap: 44px;
  min-height: 390px;
  padding: 58px 64px 48px;
  overflow: hidden;
  color: #fff;
  background:
    linear-gradient(135deg, var(--hero-start), var(--hero-end)),
    radial-gradient(circle at 72% 18%, var(--hero-glow) 0, transparent 33%);
  border: 1px solid rgba(255, 255, 255, 0.36);
  border-radius: 32px;
  box-shadow: 0 28px 70px var(--hero-shadow);
  transition: background 0.7s ease, box-shadow 0.7s ease;
}

.hero[data-weather='sunny'] {
  --hero-start: rgba(24, 142, 225, 0.96);
  --hero-end: rgba(82, 189, 242, 0.88);
  --hero-glow: #fff29b;
  --hero-accent: #fff08a;
  --hero-panel: rgba(255, 250, 210, 0.15);
  --hero-panel-strong: rgba(255, 248, 195, 0.19);
  --hero-shadow: rgba(21, 111, 180, 0.28);
}

.hero[data-weather='cloudy'] {
  --hero-start: rgba(83, 111, 132, 0.96);
  --hero-end: rgba(135, 158, 174, 0.9);
  --hero-glow: #dce9ef;
  --hero-accent: #e6f0f4;
  --hero-shadow: rgba(45, 66, 82, 0.27);
}

.hero[data-weather='rain'] {
  --hero-start: rgba(30, 54, 77, 0.97);
  --hero-end: rgba(72, 105, 131, 0.92);
  --hero-glow: #8ec8e8;
  --hero-accent: #a8ddfa;
  --hero-panel: rgba(176, 215, 239, 0.11);
  --hero-panel-strong: rgba(176, 215, 239, 0.15);
  --hero-shadow: rgba(17, 35, 51, 0.35);
}

.hero[data-weather='thunder'] {
  --hero-start: rgba(24, 29, 51, 0.98);
  --hero-end: rgba(67, 69, 108, 0.94);
  --hero-glow: #d8d0ff;
  --hero-accent: #ddd6ff;
  --hero-panel: rgba(201, 194, 239, 0.1);
  --hero-panel-strong: rgba(201, 194, 239, 0.14);
  --hero-shadow: rgba(12, 16, 31, 0.42);
}

.hero[data-weather='snow'] {
  --hero-start: rgba(91, 132, 159, 0.96);
  --hero-end: rgba(170, 204, 222, 0.92);
  --hero-glow: #f7fdff;
  --hero-accent: #fff;
  --hero-panel: rgba(255, 255, 255, 0.18);
  --hero-panel-strong: rgba(255, 255, 255, 0.22);
  --hero-shadow: rgba(65, 103, 128, 0.28);
}

.hero[data-weather='fog'] {
  --hero-start: rgba(93, 113, 121, 0.96);
  --hero-end: rgba(165, 180, 184, 0.92);
  --hero-glow: #edf3f4;
  --hero-accent: #eef5f6;
  --hero-panel: rgba(244, 248, 249, 0.11);
  --hero-panel-strong: rgba(244, 248, 249, 0.15);
  --hero-shadow: rgba(51, 67, 72, 0.28);
}

.hero::before,
.hero::after {
  position: absolute;
  content: '';
  background: rgba(255, 255, 255, 0.09);
  border-radius: 50%;
}

.weather-decoration {
  position: absolute;
  inset: 0;
  opacity: 0.72;
  pointer-events: none;
  transition: opacity 0.7s ease;
}

.hero[data-weather='sunny'] .weather-decoration {
  background: radial-gradient(circle at 86% 10%, rgba(255, 244, 143, 0.68), transparent 25%);
}

.hero[data-weather='cloudy'] .weather-decoration {
  background:
    radial-gradient(ellipse at 90% 26%, rgba(244, 249, 251, 0.22) 0 13%, transparent 14%),
    radial-gradient(ellipse at 73% 12%, rgba(244, 249, 251, 0.16) 0 17%, transparent 18%);
}

.hero[data-weather='rain'] .weather-decoration,
.hero[data-weather='thunder'] .weather-decoration {
  background: repeating-linear-gradient(105deg, transparent 0 26px, rgba(190, 225, 255, 0.14) 27px 29px, transparent 30px 54px);
}

.hero[data-weather='thunder'] .weather-decoration {
  filter: drop-shadow(0 0 24px rgba(220, 213, 255, 0.4));
}

.hero[data-weather='snow'] .weather-decoration {
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.75) 0 3px, transparent 4px),
    radial-gradient(circle, rgba(255, 255, 255, 0.46) 0 5px, transparent 6px);
  background-position: 20px 30px, 100px 70px;
  background-size: 120px 120px, 170px 170px;
}

.hero[data-weather='fog'] .weather-decoration {
  background: repeating-linear-gradient(0deg, transparent 0 45px, rgba(244, 249, 250, 0.16) 55px 85px, transparent 95px 140px);
  filter: blur(12px);
}

.hero::before {
  top: -130px;
  right: -80px;
  width: 290px;
  height: 290px;
}

.hero::after {
  bottom: -125px;
  left: 48%;
  width: 170px;
  height: 170px;
}

.hero-copy,
.weather-side,
.clothing-recommendation,
.hourly-forecast {
  position: relative;
  z-index: 1;
}

.weather-side {
  display: grid;
  gap: 12px;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  opacity: 0.78;
}

.location-line,
.current-temperature {
  display: flex;
  align-items: center;
}

.location-line {
  gap: 12px;
}

h1 {
  margin: 0;
  font-size: clamp(40px, 6vw, 64px);
  line-height: 1;
  letter-spacing: -0.05em;
}

.location-pin {
  color: var(--hero-accent);
  font-size: 10px;
  box-shadow: 0 0 18px #fff;
}

.today {
  margin: 12px 0 22px;
  color: rgba(255, 255, 255, 0.78);
}

.current-temperature {
  gap: 22px;
}

.weather-symbol {
  font-size: 76px;
  filter: drop-shadow(0 12px 14px rgba(22, 68, 123, 0.2));
}

.current-temperature strong {
  font-size: clamp(76px, 10vw, 110px);
  line-height: 0.8;
  letter-spacing: -0.08em;
}

sup {
  font-size: 0.42em;
  vertical-align: top;
}

.feels-like {
  margin: 25px 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 14px;
}

.feels-like b {
  color: #fff;
}

.metrics {
  display: grid;
  gap: 10px;
}

.metrics article {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--hero-panel);
  border: 1px solid var(--hero-border);
  border-radius: 16px;
  backdrop-filter: blur(8px);
}

.metric-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
}

.metrics small,
.metrics strong {
  display: block;
}

.metrics small {
  margin-bottom: 3px;
  color: rgba(255, 255, 255, 0.66);
  font-size: 11px;
}

.metrics strong {
  font-size: 15px;
}

.clothing-recommendation {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 28px;
  margin-top: 4px;
  padding: 24px 28px;
  background: var(--hero-panel-strong);
  border: 1px solid var(--hero-border);
  border-radius: 16px;
  backdrop-filter: blur(8px);
}

.outfit-preview {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 52px);
  gap: 12px;
  width: fit-content;
  padding-top: 10px;
}

.outfit-rail {
  position: absolute;
  top: 5px;
  right: 0;
  left: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.28);
  border-radius: 999px;
}

.outfit-item {
  position: relative;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  font-size: 28px;
  opacity: 0;
  animation: outfit-enter 0.55s cubic-bezier(0.2, 0.8, 0.2, 1.15) forwards;
  animation-delay: var(--outfit-delay);
}

.outfit-item::before {
  position: absolute;
  top: -10px;
  width: 1px;
  height: 10px;
  content: '';
  background: rgba(255, 255, 255, 0.38);
}

.outfit-item--featured {
  animation:
    outfit-enter 0.55s cubic-bezier(0.2, 0.8, 0.2, 1.15) forwards,
    outfit-float 2.8s ease-in-out 0.7s infinite;
}

@keyframes outfit-enter {
  from {
    opacity: 0;
    transform: translateY(-14px) rotate(-7deg) scale(0.82);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotate(0) scale(1);
  }
}

@keyframes outfit-float {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-4px) rotate(2deg);
  }
}

.clothing-recommendation small,
.clothing-recommendation strong {
  display: block;
}

.clothing-recommendation small {
  color: rgba(255, 255, 255, 0.66);
  font-size: 11px;
}

.clothing-recommendation strong {
  margin-top: 5px;
  font-size: 18px;
}

.clothing-recommendation p {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 13px;
  line-height: 1.6;
}

@media (prefers-reduced-motion: reduce) {
  .outfit-item,
  .outfit-item--featured {
    opacity: 1;
    animation: none;
  }
}

@media (max-width: 800px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 34px;
    padding: 42px;
  }

  .metrics {
    grid-template-columns: repeat(3, 1fr);
  }

  .metrics article {
    display: block;
    padding: 14px;
  }

  .metric-icon {
    margin-bottom: 10px;
  }
}

@media (max-width: 580px) {
  .hero {
    min-height: auto;
    padding: 36px 24px 26px;
    border-radius: 24px;
  }

  .weather-symbol {
    font-size: 56px;
  }

  .metrics {
    grid-template-columns: 1fr;
  }

  .metrics article {
    display: flex;
    padding: 12px 14px;
  }

  .metric-icon {
    margin-bottom: 0;
  }

  .clothing-recommendation {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 22px 20px;
  }
}
</style>
