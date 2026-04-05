self.addEventListener('install', (e) => {
    console.log('[Service Worker] Kuruldu');
});

self.addEventListener('fetch', (e) => {
    // Şimdilik sadece uygulamanın indirilmesine izin veren temel yapı
});
