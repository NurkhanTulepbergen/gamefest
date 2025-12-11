const APP_SHELL_CACHE = "anime-app-shell-v1";
const RUNTIME_CACHE = "anime-runtime-v1";

const APP_SHELL_URLS = [
    "/",
    "manifest.json",
    "icons/icon-192.png",
    "icons/icon-512.png",
];

const PUBLIC_API_ORIGIN = "https://api.jikan.moe";

self.addEventListener("install", (event) => {
    console.log("[SW] Install");

    event.waitUntil(
        caches.open(APP_SHELL_CACHE).then((cache) => {
            console.log("[SW] Pre-caching app shell");
            return cache.addAll(APP_SHELL_URLS);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("[SW] Activate");

    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== APP_SHELL_CACHE && key !== RUNTIME_CACHE) {
                        console.log("[SW] Deleting old cache:", key);
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.mode === "navigate") {
        event.respondWith(
            (async () => {
                const cache = await caches.open(APP_SHELL_CACHE);

                // 1 — пробуем найти кэшированную версию /
                const cached = await cache.match("/");

                if (cached) {
                    return cached;
                }

                try {
                    const network = await fetch("/");

                    cache.put("/", network.clone());

                    return network;
                } catch (err) {
                    return new Response(
                        "<h1>Offline</h1><p>Страница недоступна.</p>",
                        { headers: { "Content-Type": "text/html" } }
                    );
                }
            })()
        );
        return;
    }


    const url = new URL(request.url);
    if (url.origin === PUBLIC_API_ORIGIN) {
        event.respondWith(networkFirstForApi(request));
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            return (
                cached ||
                fetch(request).catch(() => {
                    return new Response("", {
                        status: 503,
                        statusText: "Offline",
                    });
                })
            );
        })
    );
});

async function networkFirstForApi(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.warn("[SW] Network error for API, trying cache:", error);

        const cached = await caches.match(request);
        if (cached) return cached;

        return new Response(
            JSON.stringify({
                offline: true,
                message: "You are offline. Data is not cached.",
            }),
            { headers: { "Content-Type": "application/json" }, status: 503 }
        );
    }
}
