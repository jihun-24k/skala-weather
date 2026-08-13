<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <RouterView />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap');

:root {
  font-family:
    'Noto Sans KR',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  color: #182b44;
  background: #3187df;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  background: #3187df;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at 12% 12%, rgba(135, 215, 255, 0.7), transparent 25%),
    radial-gradient(circle at 90% 70%, rgba(23, 101, 201, 0.5), transparent 34%),
    linear-gradient(145deg, #53a9ed 0%, #2777d1 48%, #1e65bd 100%);
  background-attachment: fixed;
}

button,
input {
  font-family: inherit;
}

::selection {
  color: #fff;
  background: #246fc8;
}

</style>
