const CACHE_NAME = 'crepe-v1';
const BASE_URL = self.location.origin;

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html',
  '/crepe-newlogo.png',
  '/crepe-newlogo2.png'
];

// Service Worker 설치
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  
  // 새로운 Service Worker를 즉시 활성화
  self.skipWaiting();
});

// Service Worker 활성화
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // 모든 클라이언트에서 새로운 Service Worker 제어
  self.clients.claim();
});

// 네트워크 요청 가로채기 (캐시 우선 전략)
self.addEventListener('fetch', (event) => {
  // API 요청은 항상 네트워크 우선
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // API 요청 실패 시 오프라인 페이지 반환
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        })
    );
    return;
  }

  // 정적 자원은 캐시 우선
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시된 버전 반환
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(event.request)
          .then((response) => {
            // 유효한 응답이 아니면 그대로 반환
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답을 복제하여 캐시에 저장
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // 네트워크 요청 실패 시 오프라인 페이지 반환 (페이지 탐색인 경우)
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// 푸시 알림 수신
self.addEventListener('push', (event) => {
  console.log('Push message received:', event);
  
  let notificationData = {
    title: 'Crepe 알림',
    body: '새로운 알림이 있습니다.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'crepe-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: '확인하기',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'view') {
    // 앱 열기 또는 포커스
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // 이미 열린 탭이 있으면 포커스
        for (const client of clientList) {
          if (client.url === BASE_URL && 'focus' in client) {
            return client.focus();
          }
        }
        // 새 탭 열기
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'order-sync') {
    event.waitUntil(syncOrders());
  }
});

// 주문 동기화 함수
async function syncOrders() {
  try {
    // 로컬에 저장된 미전송 주문들을 서버로 전송
    console.log('Syncing orders...');
    // 여기에 실제 동기화 로직 구현
  } catch (error) {
    console.error('Order sync failed:', error);
  }
}