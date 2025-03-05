self.addEventListener("install",e=>{
    e.waitUntil(
        caches.open("static").then(cache=>{
            return cache.addAll(["./","./styles.css","./img/icon64.png","./img/icon512.png","./img/login.png","./img/logout.png","./img/pause.png","./scrit.js"]);
        })
    )
})

self.addEventListener("fech",e=>{
    e.respondWith(
        caches.match(e.request).then(response=>{
            return response || fetch(e.request)
        })
    )
})