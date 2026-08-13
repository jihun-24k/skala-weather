# 온도착 (Ondochak)

> 출발할 때부터 도착할 때까지, 달라지는 날씨를 한눈에 비교하세요.

온도착은 현재 위치와 국내 주요 도시의 날씨를 확인하고, 출발지와 도착지의 특정 시각 날씨를 비교할 수 있는 Vue 기반 웹 서비스입니다.

단순히 두 도시의 기온을 나열하는 데 그치지 않고 기온·체감온도·강수확률의 차이를 계산하여 옷차림과 우산 준비에 도움이 되는 여행 코멘트를 제공합니다.

## 주요 기능

### 현재 날씨

- 국내 주요 도시의 현재 기온과 날씨 상태 제공
- 최고·최저 기온, 체감온도, 습도, 풍속 및 강수확률 표시
- 한글 또는 영문 도시명 검색
- 브라우저 위치 권한을 활용한 현재 위치 날씨 조회
- 선택한 도시를 기준으로 현재부터 24시간 예보 제공

### 날씨별 화면 효과

- 맑음, 흐림, 비, 눈, 안개, 천둥 상태별 화면 테마 적용
- 비·눈·햇빛 등 날씨 상태를 표현하는 전체 화면 효과
- 날씨 유형에 맞춰 상세 정보 영역의 색상과 분위기 변경
- `prefers-reduced-motion` 환경에서 애니메이션 완화

### 여행 날씨 비교

- 실제 대한민국 윤곽을 기반으로 한 SVG 지도
- 도별 윤곽선 후버 및 확대 지도 제공
- 확대 지도에서 시·군 윤곽선과 도시 마커 선택
- 선택 순서에 따라 출발지와 도착지 지정
- 출발·도착 날짜와 시간을 시간 단위로 선택
- 출발 시각과 도착 시각에 가장 가까운 예보 비교
- 기온, 체감온도, 강수확률 및 풍속 비교
- 도착 후 변화량과 여행 준비 코멘트 자동 생성

## 사용 흐름

### 오늘의 날씨 확인

```text
도시 검색 또는 현재 위치 요청
        ↓
OpenWeatherMap 현재 날씨·예보 요청
        ↓
Pinia Store에서 응답 가공
        ↓
현재 날씨와 24시간 예보 표시
```

### 출발·도착 날씨 비교

```text
지도에서 출발지와 도착지 선택
        ↓
도시별 5일 예보 요청 및 캐싱
        ↓
출발·도착 날짜와 시간 선택
        ↓
각 입력 시각과 가장 가까운 3시간 예보 탐색
        ↓
날씨 차이 계산 및 여행 코멘트 생성
```

## 기술 스택

| 구분     | 기술                     | 사용 목적                                |
| -------- | ------------------------ | ---------------------------------------- |
| Frontend | Vue 3                    | Composition API 기반 UI 구성             |
| Build    | Vite                     | 개발 서버 및 프로덕션 빌드               |
| State    | Pinia                    | 날씨 상태, 비동기 요청 및 예보 캐시 관리 |
| Routing  | Vue Router               | Home, Travel, About 페이지 구성          |
| HTTP     | Axios                    | OpenWeatherMap API 통신                  |
| UI       | Element Plus             | 검색 입력 등 공통 UI 요소                |
| Map      | SVG                      | 대한민국·도·도시 윤곽선과 상호작용 구현  |
| Quality  | ESLint, Oxlint, Prettier | 코드 검사 및 포맷 정리                   |

## 외부 라이브러리 적용 상세

### 애플리케이션 실행 시 사용하는 라이브러리

#### Pinia

- **초기화 위치:** `src/main.js`에서 `createPinia()`를 생성해 Vue 애플리케이션에 등록합니다.
- **Store 적용 위치:** `src/stores/weather.js`, `src/stores/tripWeather.js`
- **컴포넌트 연결 위치:** `src/views/WeatherHomeView.vue`, `src/views/WeatherTripView.vue`, `src/components/AppHeader.vue`
- **적용 방식:** `defineStore`의 Setup Store 문법으로 상태와 액션을 구성합니다. `weather` Store는 현재 날씨, 검색, 위치 기반 조회와 24시간 예보를 관리하고, `tripWeather` Store는 도시별 5일 예보 캐시와 출발·도착 날씨 비교를 관리합니다. 컴포넌트에서는 `storeToRefs`를 사용해 Store의 반응성을 유지한 채 상태를 구조 분해합니다.

#### Vue Router

- **라우터 설정:** `src/router/index.js`
- **등록 위치:** `src/main.js`
- **사용 위치:** `src/App.vue`, `src/components/AppHeader.vue`, `src/views/WeatherAboutView.vue`, `src/views/NotFoundView.vue`
- **적용 방식:** `createRouter`와 `createWebHistory`로 History 모드 라우터를 구성합니다. `RouterView`에 현재 페이지를 표시하고 `RouterLink`로 Home·Travel·About 페이지를 이동합니다. 현재 위치 조회 후에는 `useRouter().push('/')`로 홈 화면으로 이동합니다.

#### Axios

- **API 클라이언트 적용 위치:** `src/api/weatherApi.js`
- **오류 판별 적용 위치:** `src/stores/weather.js`
- **적용 방식:** `axios.create`로 OpenWeatherMap 전용 인스턴스를 만들고 Base URL, 10초 타임아웃, API Key, 섭씨 단위(`metric`), 한국어 응답(`kr`)을 공통 설정합니다.
- **호출 API:** `/data/2.5/weather`에서 현재 날씨, `/data/2.5/forecast`에서 5일·3시간 예보, `/geo/1.0/direct`에서 국내 도시 검색 결과를 가져옵니다. Store에서는 `axios.isAxiosError`로 API 오류와 일반 오류를 구분합니다.

#### Element Plus

- **전역 등록 위치:** `src/main.js`
- **실제 컴포넌트 사용 위치:** `src/components/SearchBar.vue`
- **적용 방식:** `ElementPlus` 플러그인과 기본 CSS를 전역 등록하고, 도시 검색창에 `el-input`을 사용합니다. 입력값 바인딩, Enter 키 검색, 지우기 기능과 크기·접근성 속성을 Element Plus 입력 컴포넌트로 처리합니다.

> 대한민국 지도는 별도 지도 라이브러리를 사용하지 않습니다. `src/data/`의 SVG 경로 데이터와 `src/components/trip/KoreaCityMap.vue`의 Vue 이벤트 처리로 직접 구현했습니다. 브라우저 위치 조회도 외부 패키지 대신 Web Geolocation API를 사용합니다.

## 프로젝트 구조

```text
src/
├── api/
│   └── weatherApi.js              # OpenWeatherMap API 요청
├── components/
│   ├── trip/
│   │   ├── KoreaCityMap.vue       # SVG 지도와 출발·도착 도시 선택
│   │   └── TripWeatherComparison.vue # 통합 여행 날씨 비교
│   ├── AppHeader.vue              # 서비스 헤더와 현재 위치 버튼
│   ├── HourlyWeatherForecast.vue  # 24시간 예보
│   ├── SearchBar.vue              # 도시 검색
│   ├── WeatherCard.vue            # 도시 날씨 요약 카드
│   ├── WeatherDetailInfo.vue      # 선택 도시 상세 날씨
│   └── WeatherEffect.vue          # 날씨별 전체 화면 효과
├── data/
│   ├── cities.js                  # 도시 이름과 좌표
│   ├── koreaMapPaths.js           # 대한민국 SVG 경로
│   ├── provinceBoundaryPaths.js   # 도별 SVG 경로
│   └── cityBoundaryPaths.js       # 도시별 SVG 경로
├── router/
│   └── index.js                   # 페이지 라우팅
├── stores/
│   ├── weather.js                 # 현재 날씨와 24시간 예보 상태
│   └── tripWeather.js             # 여행 예보 요청·캐싱·비교 로직
├── utils/
│   ├── geolocation.js             # 브라우저 위치 정보 처리
│   └── weatherUtil.js             # 날씨 유형과 이모지 변환
└── views/
    ├── WeatherHomeView.vue        # 홈 날씨 페이지
    ├── WeatherTripView.vue        # 여행 날씨 비교 페이지
    └── WeatherAboutView.vue       # 서비스 소개 페이지
```

## 핵심 설계

### 화면과 API 로직 분리

컴포넌트는 사용자 입력과 렌더링을 담당하고, 비동기 요청과 응답 가공은 Pinia Store에서 처리합니다.

```text
Vue View / Component
        ↓ action 호출
Pinia Store
        ↓ API 요청
weatherApi
        ↓
OpenWeatherMap
```

### 도시별 예보 캐싱

여행 페이지에서 날짜나 시간만 변경할 때마다 API를 다시 호출하지 않도록 도시별 Forecast 응답을 `forecastsByCity`에 저장합니다.

```js
{
  seoul: [/* 3시간 간격 예보 */],
  busan: [/* 3시간 간격 예보 */],
}
```

사용자가 시간을 변경하면 캐시된 목록에서 입력 시각과 가장 가까운 예보만 다시 탐색합니다. 현재 캐시는 메모리 기반이므로 페이지를 새로고침하면 초기화됩니다.

### 3시간 예보와 시간 선택

OpenWeatherMap 5 Day / 3 Hour Forecast는 3시간 간격으로 데이터를 제공합니다. 온도착의 시간 입력은 정각 단위이며, 선택 시각과 가장 가까운 API 예보를 비교에 사용합니다. 실제 적용된 예보 시각은 비교 화면에도 표시됩니다.

### SVG 지도 상호작용

전체 지도에서는 도시 위치를 마커로 보여주고, 도 윤곽선에 마우스를 올리면 해당 지역을 크게 표시합니다. 확대된 지도에서 도시 마커 또는 도시 윤곽선을 선택할 수 있어 수도권처럼 마커가 밀집된 지역의 선택 문제를 줄였습니다.

## 시작하기

### 요구사항

- Node.js `20.19.0` 이상 또는 `22.12.0` 이상
- npm
- OpenWeatherMap API Key

### 설치

```bash
git clone <repository-url>
cd skala-weather
npm install
```

### 환경변수

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org
```

`VITE_OPENWEATHER_BASE_URL`은 생략할 수 있으며, 생략하면 위 주소를 기본값으로 사용합니다.

API Key는 [OpenWeatherMap](https://openweathermap.org/api)에서 발급할 수 있습니다.

### 개발 서버 실행

```bash
npm run dev
```

Vite가 출력한 로컬 주소로 접속합니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과는 `dist/` 디렉터리에 생성됩니다.

### eslint 검사

```bash
npm run lint
```

eslint.config.js에 있는 규칙을 기준으로 검사합니다.

## 페이지

| 경로     | 설명                                     |
| -------- | ---------------------------------------- |
| `/`      | 주요 도시 및 현재 위치 날씨, 24시간 예보 |
| `/trip`  | 출발·도착 도시 선택과 날씨 비교          |
| `/about` | 온도착의 주요 기능과 데이터 안내         |

## API 안내

온도착은 OpenWeatherMap의 다음 API를 사용합니다.

- Current Weather Data: 현재 날씨 조회
- 5 Day / 3 Hour Forecast: 5일간 3시간 단위 예보

브라우저의 현재 위치 기능은 Geolocation API를 사용합니다. 위치 권한이 거부되거나 HTTPS 또는 로컬 환경이 아닌 경우 현재 위치 조회가 제한될 수 있습니다.

## 트러블 슈팅

### 밀집된 도시 마커

전체 지도에서 모든 도시를 직접 선택하면 수도권 마커가 겹치는 문제가 있었습니다. 도별 확대 단계를 추가하고 확대 지도 안에서 도시 윤곽선과 마커를 함께 선택하도록 개선했습니다.

### 후버 효과의 시각적 피로

마커를 빠르게 지나갈 때 확대 윤곽선이 반복적으로 나타나는 문제를 줄이기 위해 후버 진입 지연과 이탈 유예 시간을 적용했습니다. 마커 크기는 고정하고 색상과 테두리 위주로 상태를 표현합니다.

### 불필요한 Forecast 재요청

출발·도착 시간을 변경할 때마다 같은 도시 예보를 요청하지 않도록 Store에 도시별 예보를 캐싱하고, 시간 변경 시 비교 데이터만 다시 계산하도록 구성했습니다.

### 출발지와 도착지의 직접 비교

도시별 날씨를 서로 분리된 카드로 나열하면 차이를 파악하기 어려웠습니다. 두 도시를 하나의 비교 컴포넌트에 배치하고 기온·체감온도·강수확률의 변화량과 준비 코멘트를 함께 표시했습니다.

## 라이선스 및 데이터

날씨 데이터는 [OpenWeatherMap](https://openweathermap.org/)에서 제공받습니다. 지도 경로 데이터와 외부 데이터의 사용 및 배포 조건은 각 원본 라이선스를 확인해야 합니다.

---

**온도착** — 출발부터 도착까지 이어지는 날씨 정보
