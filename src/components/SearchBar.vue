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
    <div class="search-box" role="search">
      <span class="search-icon" aria-hidden="true">⌕</span>
      <el-input
        v-model="searchQuery"
        type="search"
        placeholder="도시 이름을 검색해 보세요"
        aria-label="도시 검색"
        @keyup.enter="emit('search')"
      />
      <button
        v-if="searchQuery"
        class="clear-button"
        type="button"
        aria-label="검색어 지우기"
        @click="searchQuery = ''"
      >
        ×
      </button>
      <button class="search-button" type="button" @click="emit('search')">검색</button>
    </div>
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
  margin: 0 0 8px;
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
  gap: 8px;
  width: min(450px, 100%);
  min-height: 52px;
  padding: 5px 6px 5px 15px;
  background: linear-gradient(135deg, rgba(244, 248, 253, 0.98), rgba(237, 244, 252, 0.94));
  border: 1px solid #dce8f6;
  border-radius: 17px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 8px 22px rgba(45, 99, 158, 0.07);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.search-box:focus-within {
  background: #fff;
  border-color: #6ba5ed;
  box-shadow:
    0 0 0 4px rgba(65, 134, 224, 0.1),
    0 12px 28px rgba(45, 99, 158, 0.12);
  transform: translateY(-1px);
}

.search-icon {
  flex: none;
  color: #6e829d;
  font-size: 25px;
  line-height: 1;
  transform: rotate(-20deg);
}

.search-box :deep(.el-input) {
  min-width: 0;
}

.search-box :deep(.el-input__wrapper) {
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.search-box :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
}

.search-box :deep(.el-input__inner) {
  height: 40px;
  color: #20324a;
  font-size: 13px;
}

.search-box :deep(.el-input__inner::placeholder) {
  color: #91a1b5;
}

.clear-button {
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: #8495aa;
  background: rgba(118, 143, 173, 0.1);
  border: 0;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: 0.2s ease;
}

.clear-button:hover {
  color: #42688f;
  background: rgba(118, 143, 173, 0.18);
}

.search-button {
  flex: none;
  min-width: 62px;
  height: 40px;
  padding: 0 15px;
  color: #fff;
  background: linear-gradient(135deg, #579bea, #327bd4);
  border: 0;
  border-radius: 12px;
  box-shadow: 0 7px 16px rgba(52, 123, 210, 0.22);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.search-button:hover {
  background: linear-gradient(135deg, #4b91e2, #246fc8);
  box-shadow: 0 9px 20px rgba(52, 123, 210, 0.3);
  transform: translateY(-1px);
}

@media (max-width: 580px) {
  .search-panel {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }
}
</style>
