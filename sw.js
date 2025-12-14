const CACHE_NAME = 'mouza-app-v3-glassy'; // ভার্সন নাম পরিবর্তন করা হলো
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './images/logo.png',
  './images/logo2.png'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কারকে সাথে সাথে একটিভ হতে বাধ্য করা
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Event (পুরানো ক্যাশ ডিলিট করার জন্য)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Old cache cleared:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // ক্যাশ থেকে পেলে ভালো, না হলে নেটওয়ার্ক থেকে আনবে
      return response || fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
          });
      });
    })
  );
});
