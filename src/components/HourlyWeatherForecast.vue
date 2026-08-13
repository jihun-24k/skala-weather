<script setup>
defineProps({
  forecasts: {
    type: Array,
    default: () => [],
  },
})

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  hour: 'numeric',
})

const dayFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  weekday: 'short',
})

const getTimeLabel = (forecast) =>
  forecast.isCurrent ? '지금' : timeFormatter.format(new Date(forecast.timestamp * 1000))

const getDayLabel = (forecast) =>
  forecast.isCurrent ? '현재' : dayFormatter.format(new Date(forecast.timestamp * 1000))

const getDateTime = (timestamp) => new Date(timestamp * 1000).toISOString()
</script>

<template>
  <section v-if="forecasts.length" class="hourly-forecast" aria-labelledby="hourly-title">
    <header class="forecast-heading">
      <div>
        <small>24 HOURS</small>
        <h2 id="hourly-title">24시간 예보</h2>
      </div>
      <span>3시간 간격</span>
    </header>

    <div class="forecast-list">
      <article
        v-for="forecast in forecasts"
        :key="`${forecast.timestamp}-${forecast.isCurrent}`"
        class="forecast-item"
        :class="{ 'forecast-item--current': forecast.isCurrent }"
      >
        <small>{{ getDayLabel(forecast) }}</small>
        <time :datetime="getDateTime(forecast.timestamp)">{{ getTimeLabel(forecast) }}</time>
        <span class="forecast-icon" aria-hidden="true">{{ forecast.icon }}</span>
        <strong>{{ forecast.temp }}°</strong>
        <span v-if="forecast.rain !== null" class="forecast-rain">💧 {{ forecast.rain }}%</span>
        <span v-else class="forecast-rain forecast-rain--empty">현재 날씨</span>
        <p>{{ forecast.status }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.hourly-forecast {
  position: relative;
  z-index: 1;
  grid-column: 1 / -1;
  min-width: 0;
  padding-top: 4px;
}

.forecast-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 14px;
}

.forecast-heading small {
  color: rgba(255, 255, 255, 0.62);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.forecast-heading h2 {
  margin: 4px 0 0;
  color: #fff;
  font-size: 19px;
}

.forecast-heading > span {
  color: rgba(255, 255, 255, 0.65);
  font-size: 11px;
}

.forecast-list {
  display: grid;
  grid-auto-columns: minmax(108px, 1fr);
  grid-auto-flow: column;
  gap: 10px;
  padding-bottom: 8px;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-color: rgba(255, 255, 255, 0.4) transparent;
  scroll-snap-type: inline mandatory;
}

.forecast-item {
  display: grid;
  place-items: center;
  gap: 7px;
  min-width: 108px;
  padding: 15px 10px;
  background: var(--hero-panel);
  border: 1px solid var(--hero-border);
  border-radius: 16px;
  scroll-snap-align: start;
  backdrop-filter: blur(8px);
}

.forecast-item--current {
  background: var(--hero-panel-strong);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.forecast-item small,
.forecast-item p {
  color: rgba(255, 255, 255, 0.68);
  font-size: 10px;
}

.forecast-item time {
  font-size: 12px;
  font-weight: 700;
}

.forecast-icon {
  margin: 3px 0;
  font-size: 29px;
  filter: drop-shadow(0 5px 8px rgba(22, 68, 123, 0.16));
}

.forecast-item strong {
  font-size: 21px;
}

.forecast-rain {
  min-height: 17px;
  color: #ccecff;
  font-size: 10px;
}

.forecast-rain--empty {
  color: rgba(255, 255, 255, 0.52);
}

.forecast-item p {
  max-width: 100%;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 580px) {
  .forecast-heading {
    align-items: start;
  }

  .forecast-list {
    margin-right: -24px;
    padding-right: 24px;
  }
}
</style>
