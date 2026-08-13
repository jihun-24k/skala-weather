<script setup>
defineProps({
  as: {
    type: String,
    default: 'section',
  },
  elevated: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <component :is="as" class="surface" :class="{ 'surface--elevated': elevated }">
    <slot />
  </component>
</template>

<style scoped>
.surface {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(33, 77, 126, 0.1);
}

.surface--elevated {
  border-radius: 32px;
  box-shadow: 0 28px 70px rgba(18, 79, 151, 0.22);
}

@media (max-width: 580px) {
  .surface,
  .surface--elevated {
    border-radius: 22px;
  }
}
</style>
