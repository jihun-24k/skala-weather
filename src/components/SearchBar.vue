<script setup>
const searchQuery = defineModel({ type: String, required: true })
const emit = defineEmits(['search'])
</script>

<template>
  <div class="search-panel">
    <div>
      <p class="section-label">WEATHER AROUND YOU</p>
      <h2 id="city-weather-title">다른 지역 날씨</h2>
    </div>
    <label class="search-box">
      <span aria-hidden="true">⌕</span>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="도시 이름을 검색해 보세요"
        aria-label="도시 검색"
        @keyup.enter="emit('search')"
      />
      <button v-if="searchQuery" type="button" aria-label="검색어 지우기" @click="searchQuery = ''">
        ×
      </button>
    </label>
  </div>
</template>

<style scoped>
.search-panel {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
}

.section-label {
  margin: 0 0 10px;
  color: #3f80de;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  opacity: 0.78;
}

h2 {
  margin: 0;
  color: #172942;
  font-size: 28px;
  letter-spacing: -0.04em;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(390px, 100%);
  padding: 0 15px;
  background: #f3f7fc;
  border: 1px solid #e3ebf5;
  border-radius: 14px;
  transition: 0.2s ease;
}

.search-box:focus-within {
  background: #fff;
  border-color: #5797ea;
  box-shadow: 0 0 0 4px rgba(65, 134, 224, 0.1);
}

.search-box > span {
  color: #6e829d;
  font-size: 24px;
  transform: rotate(-20deg);
}

.search-box input {
  width: 100%;
  padding: 14px 0;
  color: #20324a;
  background: transparent;
  border: 0;
  outline: none;
  font: inherit;
  font-size: 13px;
}

.search-box button {
  padding: 0;
  color: #8495aa;
  background: none;
  border: 0;
  font-size: 20px;
  cursor: pointer;
}

@media (max-width: 580px) {
  .search-panel {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    width: auto;
  }

}
</style>
