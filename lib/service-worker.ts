const CACHE_NAME = "marketai-v1"
const STATIC_CACHE = "marketai-static-v1"
const DYNAMIC_CACHE = "marketai-dynamic-v1"

const STATIC_ASSETS = ["/", "/offline", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"]

// 설치 이벤트
self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
})

// 활성화 이벤트
self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// 네트워크 요청 가로채기
self.addEventListener("fetch", (event: any) => {
  const { request } = event
  const url = new URL(request.url)

  // API 요청은 네트워크 우선
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 성공적인 응답을 캐시
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // 네트워크 실패 시 캐시에서 반환
          return caches.match(request)
        }),
    )
    return
  }

  // 정적 자산은 캐시 우선
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request)
      }),
    )
    return
  }

  // 이미지는 캐시 우선, 없으면 네트워크
  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then((response) => {
        return (
          response ||
          fetch(request).then((fetchResponse) => {
            const responseClone = fetchResponse.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
            return fetchResponse
          })
        )
      }),
    )
    return
  }

  // 기본: 네트워크 우선, 실패 시 캐시
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone()
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone)
        })
        return response
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          return response || caches.match("/offline")
        })
      }),
  )
})

// 백그라운드 동기화
self.addEventListener("sync", (event: any) => {
  if (event.tag === "background-sync") {
    event.waitUntil(
      // 오프라인 중 저장된 데이터 동기화
      syncOfflineData(),
    )
  }
})

// 푸시 알림
self.addEventListener("push", (event: any) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: "view",
          title: "확인",
          icon: "/icons/view-24x24.png",
        },
        {
          action: "close",
          title: "닫기",
          icon: "/icons/close-24x24.png",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// 알림 클릭 처리
self.addEventListener("notificationclick", (event: any) => {
  event.notification.close()

  if (event.action === "view") {
    const url = event.notification.data?.url || "/"
    event.waitUntil(clients.openWindow(url))
  }
})

async function syncOfflineData() {
  try {
    // IndexedDB에서 오프라인 데이터 가져오기
    const offlineData = await getOfflineData()

    // 서버로 전송
    for (const data of offlineData) {
      await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    }

    // 동기화 완료 후 오프라인 데이터 삭제
    await clearOfflineData()
  } catch (error) {
    console.error("백그라운드 동기화 실패:", error)
  }
}

async function getOfflineData() {
  // IndexedDB에서 오프라인 데이터 조회
  return []
}

async function clearOfflineData() {
  // IndexedDB에서 오프라인 데이터 삭제
}
