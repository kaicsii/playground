// 定義快取名稱和要快取的檔案列表
const CACHE_NAME = 'debt-ledger-cache-v1';
// 'index.html' 是您主程式的檔名，請根據實際情況修改
const FILES_TO_CACHE = [
  '/',
  'index.html', 
  // 如果您有獨立的 CSS 或 JS 檔案，也要加進來
  // 'styles.css',
  // 'app.js',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// 安裝 Service Worker 時觸發
self.addEventListener('install', (event) => {
  // 等待快取操作完成
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] 開啟快取:', CACHE_NAME);
        // 將指定的檔案加入快取
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// 攔截網路請求時觸發
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // 嘗試從快取中尋找對應的回應
    caches.match(event.request)
      .then((response) => {
        // 如果快取中有對應的回應，就直接回傳，否則就發出網路請求
        return response || fetch(event.request);
      })
  );
});

// 啟用 Service Worker 時觸發，用於清理舊的快取
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 如果快取名稱不在白名單中，就刪除它
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[ServiceWorker] 刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
