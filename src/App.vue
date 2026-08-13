<template>
  <header class="app-header">
    <RouterLink class="brand" to="/" aria-label="오늘의 날씨 홈">
      <span class="brand-icon" aria-hidden="true">☁</span>
      <span>오늘의 날씨</span>
    </RouterLink>

    <nav aria-label="주요 메뉴">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
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

.app-header {
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

.app-header nav {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
}

.app-header nav a {
  padding: 7px 13px;
  color: rgba(255, 255, 255, 0.76);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: 0.2s ease;
}

.app-header nav a:hover,
.app-header nav a.router-link-exact-active {
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
}
</style>
