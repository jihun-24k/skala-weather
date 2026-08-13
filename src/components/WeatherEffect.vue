<script setup>
const props = defineProps({
  weatherType: {
    type: String,
    default: 'unknown',
  },
})

const particles = Array.from({ length: 48 }, (_, index) => ({
  id: index,
  x: (index * 37) % 101,
  delay: -((index * 0.17) % 3),
  duration: 0.75 + (index % 7) * 0.13,
  size: 4 + (index % 5) * 2,
  drift: -30 + (index % 7) * 10,
}))

const particleStyle = (particle) => ({
  '--x': `${particle.x}vw`,
  '--delay': `${particle.delay}s`,
  '--duration': `${particle.duration}s`,
  '--size': `${particle.size}px`,
  '--drift': `${particle.drift}px`,
})
</script>

<template>
  <div class="effect-stage" aria-hidden="true">
    <Transition name="weather-fade" mode="out-in">
      <div :key="props.weatherType" class="weather-effect" :class="`is-${props.weatherType}`">
        <div v-if="props.weatherType === 'sunny'" class="sun" />

        <template v-if="['cloudy', 'thunder'].includes(props.weatherType)">
          <div v-for="cloud in 4" :key="cloud" class="cloud" :class="`cloud-${cloud}`" />
        </template>

        <template v-if="['rain', 'thunder', 'snow'].includes(props.weatherType)">
          <i
            v-for="particle in particles"
            :key="particle.id"
            class="particle"
            :style="particleStyle(particle)"
          />
        </template>

        <template v-if="props.weatherType === 'fog'">
          <div v-for="fog in 4" :key="fog" class="fog" :class="`fog-${fog}`" />
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.effect-stage,
.weather-effect {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.effect-stage {
  z-index: 0;
}

.weather-effect {
  background: linear-gradient(145deg, #63b7f4, #2777d1 55%, #1e65bd);
}

.is-sunny {
  background:
    radial-gradient(circle at 78% 12%, rgba(255, 244, 166, 0.45), transparent 24%),
    linear-gradient(145deg, #75c9f7, #3398e7 55%, #2475ce);
}

.sun {
  position: absolute;
  top: -90px;
  right: 7vw;
  width: min(330px, 45vw);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, #fffbd1 0 12%, #ffe36d 24%, rgba(255, 206, 73, 0.3) 52%, transparent 72%);
  filter: drop-shadow(0 0 45px rgba(255, 238, 130, 0.7));
  animation: sun-pulse 4s ease-in-out infinite alternate;
}

.is-cloudy {
  background: linear-gradient(155deg, #90aabd, #668399 52%, #526f87);
}

.is-rain,
.is-thunder {
  background: linear-gradient(155deg, #526f87, #263f5b 58%, #172e49);
}

.is-snow {
  background: linear-gradient(155deg, #b8d4e6, #789cb7 55%, #547994);
}

.is-fog {
  background: linear-gradient(155deg, #aebdc3, #80949c 58%, #667c86);
}

.cloud {
  position: absolute;
  width: 300px;
  height: 85px;
  border-radius: 999px;
  background: rgba(225, 235, 241, 0.34);
  filter: blur(5px);
  animation: cloud-drift 24s linear infinite;
}

.cloud::before,
.cloud::after {
  position: absolute;
  content: '';
  border-radius: 50%;
  background: inherit;
}

.cloud::before { width: 130px; height: 130px; left: 42px; bottom: 8px; }
.cloud::after { width: 170px; height: 170px; right: 35px; bottom: 2px; }
.cloud-1 { top: 10%; left: -320px; }
.cloud-2 { top: 28%; left: -420px; scale: 0.7; animation-delay: -8s; }
.cloud-3 { top: 55%; left: -380px; scale: 1.2; animation-delay: -15s; }
.cloud-4 { top: 75%; left: -350px; scale: 0.85; animation-delay: -20s; }

.is-thunder::after {
  position: absolute;
  inset: 0;
  content: '';
  background: rgba(230, 240, 255, 0.7);
  opacity: 0;
  animation: lightning 7s infinite;
}

.particle {
  position: absolute;
  top: -35px;
  left: var(--x);
  display: block;
  animation-delay: var(--delay);
  animation-duration: var(--duration);
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.is-rain .particle,
.is-thunder .particle {
  width: 2px;
  height: 28px;
  background: linear-gradient(transparent, rgba(205, 232, 255, 0.88));
  transform: rotate(10deg);
  animation-name: rain-fall;
}

.is-snow .particle {
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.65);
  animation-name: snow-fall;
  animation-duration: calc(var(--duration) * 4);
}

.fog {
  position: absolute;
  left: -30%;
  width: 160%;
  height: 130px;
  border-radius: 50%;
  background: rgba(238, 244, 246, 0.24);
  filter: blur(24px);
  animation: fog-drift 12s ease-in-out infinite alternate;
}

.fog-1 { top: 10%; }
.fog-2 { top: 32%; animation-delay: -4s; }
.fog-3 { top: 56%; animation-delay: -8s; }
.fog-4 { top: 78%; animation-delay: -11s; }

.weather-fade-enter-active,
.weather-fade-leave-active { transition: opacity 0.8s ease; }
.weather-fade-enter-from,
.weather-fade-leave-to { opacity: 0; }

@keyframes sun-pulse { to { transform: scale(1.12); filter: drop-shadow(0 0 70px rgba(255, 238, 130, 0.9)); } }
@keyframes cloud-drift { to { transform: translateX(calc(100vw + 750px)); } }
@keyframes rain-fall { to { translate: -45px 110vh; } }
@keyframes snow-fall { 50% { translate: var(--drift) 52vh; } 100% { translate: calc(var(--drift) * -0.6) 108vh; rotate: 360deg; } }
@keyframes fog-drift { to { transform: translateX(12%); opacity: 0.5; } }
@keyframes lightning { 2%, 5% { opacity: 0.72; } 3%, 7%, 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .sun,
  .cloud,
  .particle,
  .fog,
  .is-thunder::after { animation: none; }
}
</style>
