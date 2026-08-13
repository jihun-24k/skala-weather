export const getCurrentPosition = () =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('GEOLOCATION_NOT_SUPPORTED'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                resolve({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                })
            },
            // enableHighAccuracy: 날씨 조회에는 GPS 수준의 정밀도가 필요하지 않음
            // maximumAge: 5분 이내 위치 캐시 재사용
            reject,
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 5 * 60 * 1000,
            },
        )
    })