<script setup>
import BasePageLayout from '../components/BasePageLayout.vue'
import BaseSurface from '../components/BaseSurface.vue'
</script>

<template>
  <BasePageLayout>
    <section class="hero" aria-labelledby="about-title">
      <p class="eyebrow">WEATHER FOR EVERY DAY</p>
      <h1 id="about-title">날씨를 확인하는<br />가장 산뜻한 방법</h1>
      <p class="hero-description">
        오늘의 날씨는 복잡한 기상 정보를 누구나 빠르게 이해할 수 있도록 정리해 보여주는 날씨
        대시보드입니다.
      </p>

      <div class="weather-visual" aria-hidden="true">
        <span class="sun">☀️</span>
        <span class="cloud">☁️</span>
      </div>
    </section>

    <BaseSurface class="about-content" aria-label="서비스 소개">
      <div class="intro">
        <p class="section-label">OUR PURPOSE</p>
        <h2>필요한 날씨만<br />한눈에 확인하세요</h2>
        <p>
          현재 기온부터 습도, 바람, 강수 확률까지 일상에 필요한 정보를 간결하게 제공합니다. 지역별
          날씨를 비교하고 원하는 도시의 상세 정보를 바로 확인할 수 있습니다.
        </p>
      </div>

      <div class="feature-grid">
        <article>
          <span class="feature-icon" aria-hidden="true">⌕</span>
          <h3>빠른 지역 검색</h3>
          <p>도시의 한글 또는 영문 이름으로 원하는 지역을 빠르게 찾을 수 있습니다.</p>
        </article>
        <article>
          <span class="feature-icon" aria-hidden="true">🌡️</span>
          <h3>간결한 정보</h3>
          <p>기온과 날씨 상태, 생활에 필요한 주요 기상 지표를 보기 쉽게 정리합니다.</p>
        </article>
        <article>
          <span class="feature-icon" aria-hidden="true">☂️</span>
          <h3>일상을 위한 안내</h3>
          <p>외출 전에 확인해야 할 핵심 정보를 직관적인 화면으로 전달합니다.</p>
        </article>
      </div>

      <aside class="data-note">
        <div>
          <span class="note-icon" aria-hidden="true">i</span>
          <div>
            <h2>데이터 안내</h2>
            <p>
              현재 표시되는 기상 정보는 Vue 컴포넌트와 반응형 데이터 흐름을 학습하기 위한 예시
              데이터입니다.
            </p>
          </div>
        </div>
        <a href="/">날씨 보러 가기 <span aria-hidden="true">→</span></a>
      </aside>
    </BaseSurface>

    <template #footer>오늘의 날씨 · 일상을 위한 간결한 날씨 정보</template>
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
  grid-template-columns: repeat(3, 1fr);
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

.data-note a {
  display: flex;
  flex: 0 0 auto;
  gap: 16px;
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
}
</style>
