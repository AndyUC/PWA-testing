

self.addEventListener("install", e=>{
    
    console.log("install")
})
  
  // This allows the web app to trigger skipWaiting via
  // registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
}
});

self.addEventListener('fetch', function(event) {
event.respondWith(
    caches.match(event.request)
    .then(function(response) {
        // Cache hit - return response
        if (response) {
        return response;
        }
        return fetch(event.request);
    }
    )
);
});

self.addEventListener('activate', function(event) {
var cacheWhitelist = ['pigment'];
event.waitUntil(
    caches.keys().then(function(cacheNames) {
    return Promise.all(
        cacheNames.map(function(cacheName) {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
        }
        })
    );
    })
);
});

self.addEventListener('push', (event) => {
let body
if (event.data) {
    //You can set an original message by passing it on the event.
    body = event.data.json()
} else {
    body = 'Default body'
}

const options = {
    body: body,
    icon: './logo192.png',
    vibrate: [100, 50, 100],
    data: {
    dateOfArrival: Date.now(),
    primaryKey: 1,
    },
}
event.waitUntil(
    self.registration.showNotification('Your Message Title',    
    options))
})
  
  