<script setup>
defineProps({
  weather: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])
</script>

<template>
  <article
    class="city-card"
    :class="{ selected }"
    tabindex="0"
    @click="emit('select')"
    @keyup.enter="emit('select')"
  >
    <div class="card-top">
      <div>
        <h3>{{ weather.name }}</h3>
        <p>{{ weather.englishName }}</p>
      </div>
      <span class="card-weather-icon" aria-hidden="true">{{ weather.icon }}</span>
    </div>
    <div class="card-temperature">
      <strong>{{ weather.temp }}<sup>°</sup></strong>
      <span>{{ weather.status }}</span>
    </div>
    <div class="temp-range">
      <span
        >최고 <b>{{ weather.high }}°</b></span
      >
      <span class="divider"></span>
      <span
        >최저 <b>{{ weather.low }}°</b></span
      >
    </div>
    <button class="detail-button" type="button" @click.stop="emit('select')">
      자세히 보기 <span>→</span>
    </button>
  </article>
</template>

<style scoped>
.city-card {
  padding: 24px;
  background: #f8fafd;
  border: 1px solid #e8eef6;
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.city-card:hover,
.city-card:focus-visible,
.city-card.selected {
  background: #fff;
  border-color: #8fbae9;
  box-shadow: 0 16px 36px rgba(42, 93, 151, 0.13);
  transform: translateY(-4px);
}

.city-card.selected {
  box-shadow:
    inset 0 3px #4b93e7,
    0 16px 36px rgba(42, 93, 151, 0.13);
}

.card-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.card-top h3 {
  margin: 0 0 3px;
  color: #1e3048;
  font-size: 20px;
}
.card-top p {
  margin: 0;
  color: #99a6b7;
  font-size: 11px;
}
.card-weather-icon {
  font-size: 36px;
  filter: drop-shadow(0 7px 9px rgba(59, 92, 128, 0.16));
}

.card-temperature {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin: 30px 0 18px;
}

.card-temperature strong {
  color: #182b44;
  font-size: 48px;
  line-height: 0.85;
  letter-spacing: -0.07em;
}
.card-temperature span {
  color: #61738b;
  font-size: 12px;
  font-weight: 700;
}
sup {
  font-size: 0.42em;
  vertical-align: top;
}

.temp-range {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 0;
  color: #8b98aa;
  border-top: 1px solid #e5ebf2;
  border-bottom: 1px solid #e5ebf2;
  font-size: 11px;
}

.temp-range b {
  color: #41536b;
}
.divider {
  width: 1px;
  height: 11px;
  background: #d5deea;
}

.detail-button {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 17px 0 0;
  color: #377dcc;
  background: transparent;
  border: 0;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.detail-button span {
  font-size: 16px;
  transition: transform 0.2s ease;
}
.city-card:hover .detail-button span {
  transform: translateX(4px);
}
</style>
