<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weather'

const weatherStore = useWeatherStore()
const router = useRouter()
const { isLocating, locationError } = storeToRefs(weatherStore)

const showCurrentLocationWeather = async () => {
  await weatherStore.fetchCurrentLocationWeather()

  if (!locationError.value) {
    await router.push('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <header class="app-header">
    <RouterLink class="brand" to="/" aria-label="오늘의 날씨 홈">
      <span class="brand-icon" aria-hidden="true">☁</span>
      <span>오늘의 날씨</span>
    </RouterLink>

    <div class="header-actions">
      <button
        class="location-button"
        type="button"
        :disabled="isLocating"
        @click="showCurrentLocationWeather"
      >
        <span aria-hidden="true">⌖</span>
        {{ isLocating ? '위치 확인 중' : '현재 위치 날씨' }}
      </button>

      <nav aria-label="주요 메뉴">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>

    <p v-if="locationError" class="location-error" role="alert">{{ locationError }}</p>
  </header>
</template>

<style scoped>
.app-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0 26px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
}

.brand-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #2471d8;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 7px 18px rgba(15, 58, 112, 0.16);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-button {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 14px;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.location-button:hover:not(:disabled) {
  color: #2471d8;
  background: #fff;
}

.location-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.location-error {
  position: absolute;
  top: calc(100% - 18px);
  right: 0;
  max-width: min(390px, 100%);
  margin: 0;
  padding: 10px 13px;
  color: #913838;
  background: rgba(255, 244, 244, 0.98);
  border: 1px solid rgba(244, 211, 211, 0.9);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(30, 66, 107, 0.16);
  font-size: 12px;
}

nav {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
}

nav a {
  padding: 7px 13px;
  color: rgba(255, 255, 255, 0.76);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: 0.2s ease;
}

nav a:hover,
nav a.router-link-exact-active {
  color: #2471d8;
  background: #fff;
}

@media (max-width: 580px) {
  .app-header {
    width: min(100% - 24px, 1120px);
    padding-top: 16px;
  }

  .brand > span:last-child {
    display: none;
  }

  .header-actions {
    gap: 6px;
  }

  .location-button {
    justify-content: center;
    width: 38px;
    padding: 0;
    overflow: hidden;
    color: transparent;
    white-space: nowrap;
  }

  .location-button span {
    color: #fff;
    font-size: 17px;
  }

  .location-button:hover:not(:disabled) span {
    color: #2471d8;
  }
}
</style>
