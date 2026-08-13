<script setup>
import { useRoute } from 'vue-router'
import BasePageLayout from '../components/BasePageLayout.vue'
import BaseSurface from '../components/BaseSurface.vue'

const route = useRoute()
</script>

<template>
  <BasePageLayout>
    <BaseSurface class="not-found-card" elevated aria-labelledby="not-found-title">
      <div class="weather-scene" aria-hidden="true">
        <span class="cloud">☁️</span>
        <span class="wind">〰</span>
        <span class="compass">⌖</span>
      </div>

      <div class="error-code" aria-hidden="true">404</div>
      <p class="eyebrow">PAGE NOT FOUND</p>
      <h1 id="not-found-title">길을 잃은 구름이에요</h1>
      <p class="description">
        요청하신 <strong>{{ route.path }}</strong> 페이지를 찾을 수 없습니다.<br />
        주소를 다시 확인하거나 홈에서 날씨를 살펴보세요.
      </p>

      <div class="actions">
        <RouterLink class="primary-action" to="/">홈으로 돌아가기 <span>→</span></RouterLink>
        <RouterLink class="secondary-action" to="/about">서비스 소개 보기</RouterLink>
      </div>

      <div class="weather-tip">
        <span aria-hidden="true">💡</span>
        <p><b>오늘의 팁</b> 외출 전 현재 기온과 강수 확률을 확인해 보세요.</p>
      </div>
    </BaseSurface>
  </BasePageLayout>
</template>

<style scoped>
.not-found-card {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 620px;
  padding: 72px 64px;
  overflow: hidden;
  text-align: center;
  flex-direction: column;
}

.not-found-card::before,
.not-found-card::after {
  position: absolute;
  content: '';
  background: #edf6ff;
  border-radius: 50%;
}

.not-found-card::before {
  top: -150px;
  right: -110px;
  width: 360px;
  height: 360px;
}

.not-found-card::after {
  bottom: -180px;
  left: -130px;
  width: 400px;
  height: 400px;
}

.weather-scene {
  position: relative;
  z-index: 1;
  width: 180px;
  height: 105px;
  margin-bottom: 8px;
}

.weather-scene span {
  position: absolute;
}

.cloud {
  top: 0;
  left: 34px;
  font-size: 92px;
  filter: drop-shadow(0 16px 18px rgba(56, 106, 163, 0.16));
}

.wind {
  right: 0;
  bottom: 5px;
  color: #85b9ed;
  font-size: 42px;
}

.compass {
  bottom: 0;
  left: 0;
  color: #4b91e4;
  font-size: 32px;
}

.error-code {
  position: relative;
  z-index: 1;
  color: #dcecff;
  font-size: clamp(72px, 12vw, 120px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.08em;
}

.eyebrow {
  position: relative;
  z-index: 1;
  margin: 22px 0 10px;
  color: #4b91e4;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

h1 {
  position: relative;
  z-index: 1;
  margin: 0;
  color: #172942;
  font-size: clamp(32px, 5vw, 48px);
  letter-spacing: -0.05em;
}

.description {
  position: relative;
  z-index: 1;
  margin: 20px 0 0;
  color: #718197;
  font-size: 14px;
  line-height: 1.8;
}

.description strong {
  color: #3f80de;
  overflow-wrap: anywhere;
}

.actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.actions a {
  padding: 13px 18px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  transition: 0.2s ease;
}

.primary-action {
  display: flex;
  gap: 18px;
  color: #fff;
  background: #3f86dc;
  box-shadow: 0 10px 24px rgba(63, 134, 220, 0.24);
}

.primary-action:hover {
  background: #3176c9;
  transform: translateY(-2px);
}

.secondary-action {
  color: #4a6686;
  background: #f3f7fc;
  border: 1px solid #e3ebf5;
}

.secondary-action:hover {
  background: #eaf3fe;
  border-color: #cfe2f8;
}

.weather-tip {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 42px;
  padding: 12px 16px;
  color: #77889d;
  background: #f8fafd;
  border: 1px solid #e8eef6;
  border-radius: 999px;
  font-size: 11px;
}

.weather-tip p {
  margin: 0;
}

.weather-tip b {
  margin-right: 5px;
  color: #405978;
}

@media (max-width: 580px) {
  .not-found-card {
    min-height: 570px;
    padding: 54px 20px;
  }

  .actions {
    width: 100%;
    flex-direction: column;
  }

  .actions a {
    justify-content: center;
  }

  .weather-tip {
    align-items: flex-start;
    border-radius: 16px;
    text-align: left;
  }
}
</style>
