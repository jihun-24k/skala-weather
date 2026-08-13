<script setup>
import { RouterLink } from 'vue-router'
import BasePageLayout from '../components/BasePageLayout.vue'
import BaseSurface from '../components/BaseSurface.vue'

const features = [
  {
    icon: '⌕',
    title: '도시와 현재 위치',
    description: '도시를 검색하거나 위치 권한을 허용해 지금 있는 곳의 날씨를 바로 확인할 수 있습니다.',
  },
  {
    icon: '🕒',
    title: '24시간 예보',
    description: '현재 시점부터 24시간 동안의 기온과 강수확률 변화를 시간 순서로 확인합니다.',
  },
  {
    icon: '🌦️',
    title: '날씨를 닮은 화면',
    description: '맑음, 비, 눈과 같은 날씨 상태에 따라 배경과 전체 화면 효과가 달라집니다.',
  },
  {
    icon: '🧳',
    title: '여행 날씨 비교',
    description: '출발 도시와 도착 도시를 고르면 각 시각의 날씨 차이와 준비 코멘트를 제공합니다.',
  },
]
</script>

<template>
  <BasePageLayout>
    <section class="hero" aria-labelledby="about-title">
      <p class="eyebrow">WEATHER FOR EVERY MOMENT</p>
      <h1 id="about-title">오늘의 외출부터<br />다음 여행까지</h1>
      <p class="hero-description">
        지금 있는 곳의 날씨를 살펴보고, 다른 도시로 이동했을 때 달라질 날씨까지 한 흐름에서
        비교하는 날씨 서비스입니다.
      </p>

      <div class="weather-visual" aria-hidden="true">
        <span class="sun">☀️</span>
        <span class="cloud">☁️</span>
      </div>
    </section>

    <BaseSurface class="about-content" aria-label="서비스 소개">
      <div class="intro">
        <p class="section-label">WHY ONDOCHAK</p>
        <h2>숫자를 넘어<br />상황을 이해하는 날씨</h2>
        <p>
          기온, 체감온도, 습도, 바람과 강수확률을 보기 쉽게 정리합니다. 날씨에 따라 달라지는 화면과
          여행 경로 비교를 통해 어떤 준비가 필요한지도 빠르게 판단할 수 있습니다.
        </p>
      </div>

      <div class="feature-grid">
        <article v-for="feature in features" :key="feature.title">
          <span class="feature-icon" aria-hidden="true">{{ feature.icon }}</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>

      <section class="journey-guide" aria-labelledby="journey-guide-title">
        <div>
          <p class="section-label">TRAVEL COMPARE</p>
          <h2 id="journey-guide-title">출발할 때와 도착했을 때,<br />무엇이 달라질까요?</h2>
        </div>
        <ol>
          <li><b>01</b><span>지도에서 출발 도시와 도착 도시를 선택합니다.</span></li>
          <li><b>02</b><span>출발·도착 날짜와 시간을 시간 단위로 지정합니다.</span></li>
          <li><b>03</b><span>기온과 강수확률 차이, 여행 준비 코멘트를 확인합니다.</span></li>
        </ol>
      </section>

      <aside class="data-note">
        <div>
          <span class="note-icon" aria-hidden="true">i</span>
          <div>
            <h2>데이터 안내</h2>
            <p>
              현재 날씨와 5일 예보는 OpenWeatherMap 데이터를 사용합니다. 예보는 3시간 간격이므로
              선택한 시간과 가장 가까운 예보 시각을 기준으로 표시됩니다.
            </p>
          </div>
        </div>
        <div class="note-links">
          <RouterLink to="/">오늘 날씨 <span aria-hidden="true">→</span></RouterLink>
          <RouterLink to="/trip">여행 비교 <span aria-hidden="true">→</span></RouterLink>
        </div>
      </aside>
    </BaseSurface>

    <template #footer>온도착 · 출발부터 도착까지 이어지는 날씨 정보</template>
  </BasePageLayout>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 400px;
  padding: 72px 64px;
  overflow: hidden;
  color: #fff;
  background:
    linear-gradient(135deg, rgba(22, 107, 225, 0.94), rgba(64, 161, 244, 0.85)),
    radial-gradient(circle at 72% 18%, #b8e9ff 0, transparent 33%);
  border: 1px solid rgba(255, 255, 255, 0.36);
  border-radius: 32px;
  box-shadow: 0 28px 70px rgba(18, 79, 151, 0.22);
}

.eyebrow,
.section-label {
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.eyebrow {
  color: rgba(255, 255, 255, 0.72);
}

h1 {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: clamp(42px, 6vw, 68px);
  line-height: 1.15;
  letter-spacing: -0.055em;
}

.hero-description {
  position: relative;
  z-index: 1;
  max-width: 540px;
  margin: 24px 0 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.8;
}

.weather-visual {
  position: absolute;
  right: 72px;
  bottom: 54px;
  width: 230px;
  height: 180px;
}

.weather-visual span {
  position: absolute;
  filter: drop-shadow(0 20px 20px rgba(19, 70, 129, 0.2));
}

.sun {
  top: 0;
  right: 0;
  font-size: 105px;
}

.cloud {
  bottom: 0;
  left: 0;
  font-size: 130px;
}

.about-content {
  margin-top: 18px;
  padding: 48px 42px 42px;
}

.intro {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 18px 70px;
  align-items: start;
}

.section-label {
  grid-column: 1 / -1;
  color: #3f80de;
}

.intro h2 {
  margin: 0;
  color: #172942;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.3;
  letter-spacing: -0.045em;
}

.intro > p:last-child {
  margin: 4px 0 0;
  color: #6e7e92;
  font-size: 14px;
  line-height: 1.9;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 44px;
}

.feature-grid article {
  padding: 25px;
  background: #f8fafd;
  border: 1px solid #e8eef6;
  border-radius: 20px;
}

.feature-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  color: #397fd2;
  background: #eaf3fe;
  border-radius: 12px;
  font-size: 22px;
}

.feature-grid h3 {
  margin: 20px 0 8px;
  color: #20344d;
  font-size: 17px;
}

.feature-grid p {
  margin: 0;
  color: #8290a2;
  font-size: 12px;
  line-height: 1.75;
}

.journey-guide {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 48px;
  align-items: center;
  margin-top: 18px;
  padding: 34px;
  color: #fff;
  background: linear-gradient(135deg, #367fd5, #61b4df);
  border-radius: 22px;
}

.journey-guide .section-label { color: rgba(255, 255, 255, 0.68); }
.journey-guide h2 { margin: 0; font-size: clamp(22px, 3vw, 31px); line-height: 1.4; letter-spacing: -0.04em; }
.journey-guide ol { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
.journey-guide li { display: grid; grid-template-columns: 34px 1fr; align-items: center; gap: 11px; padding: 12px 14px; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; }
.journey-guide li b { color: #ffe3a7; font-size: 10px; }
.journey-guide li span { font-size: 11px; line-height: 1.5; }

.data-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  margin-top: 18px;
  padding: 24px 26px;
  background: #edf5ff;
  border: 1px solid #dbeafa;
  border-radius: 18px;
}

.data-note > div {
  display: flex;
  align-items: center;
  gap: 16px;
}

.note-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 36px;
  height: 36px;
  color: #fff;
  background: #4b91e4;
  border-radius: 50%;
  font-weight: 800;
}

.data-note h2 {
  margin: 0 0 5px;
  color: #2a4565;
  font-size: 14px;
}

.data-note p {
  margin: 0;
  color: #71849a;
  font-size: 12px;
  line-height: 1.65;
}

.note-links { display: flex; flex: 0 0 auto; gap: 18px; }
.note-links a {
  display: flex;
  gap: 8px;
  color: #397fd2;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
}

@media (max-width: 800px) {
  .weather-visual {
    right: 30px;
    opacity: 0.45;
  }

  .intro {
    grid-template-columns: 1fr;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .journey-guide { grid-template-columns: 1fr; gap: 24px; }
}

@media (max-width: 580px) {
  .hero {
    min-height: 380px;
    padding: 48px 24px;
    border-radius: 24px;
  }

  .weather-visual {
    right: -32px;
    bottom: 24px;
    transform: scale(0.75);
  }

  .about-content {
    padding: 34px 18px 24px;
  }

  .data-note,
  .data-note > div {
    align-items: flex-start;
  }

  .data-note {
    flex-direction: column;
  }

  .note-links { width: 100%; justify-content: space-between; }
}
</style>
