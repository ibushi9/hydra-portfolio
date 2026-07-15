/* Cabaret AI — Service Worker
   ・オフラインキャッシュ（アプリ本体を保存）
   ・通知のクリック処理
   ・（将来）バックエンドからのWeb Push受信口
*/
const CACHE = 'cabaret-ai-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});

/* 通知をタップしたらアプリを前面に */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(cs => {
      for (const c of cs) { if ('focus' in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

/* 将来：LINE/サーバー等からのWeb Push受信口
   （バックエンド接続時に、閉じていても届くプッシュがここに入ります） */
self.addEventListener('push', e => {
  let d = { title: 'Cabaret AI', body: '新しいお知らせがあります' };
  try { if (e.data) d = Object.assign(d, e.data.json()); } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body, icon: './icon-192.png', badge: './icon-192.png', tag: 'cabaret'
  }));
});
