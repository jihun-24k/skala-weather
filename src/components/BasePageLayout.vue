<template>
  <main class="page-layout">
    <slot />

    <footer v-if="$slots.footer" class="page-footer">
      <slot name="footer" />
    </footer>
  </main>
</template>

<style scoped>
.page-layout {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 0 0 32px;
}

.page-footer {
  padding: 22px 0 0;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  font-size: 11px;
}

@media (max-width: 580px) {
  .page-layout {
    width: min(100% - 24px, 1120px);
  }
}
</style>
