/* Reloj Reposo: guarda los archivos para que la app abra sin conexión.
   Primero intenta la red (así los cambios se ven de inmediato) y si falla usa la copia guardada. */
var CACHE = 'reposo-v1';
var ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'keepawake.mp4',
  'fonts/antonio-latin-200-normal.woff2',
  'fonts/antonio-latin-600-normal.woff2',
  'sounds/amanecer.mp3',
  'sounds/campana.mp3',
  'sounds/clasico.mp3',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Safari pide audio y video por tramos (Range); se responde con 206 desde la copia guardada.
function rangeResponse(resp, range) {
  return resp.arrayBuffer().then(function (buf) {
    var m = /bytes=(\d*)-(\d*)/.exec(range) || [];
    var size = buf.byteLength;
    var start = m[1] ? parseInt(m[1], 10) : 0;
    var end = m[2] ? Math.min(parseInt(m[2], 10), size - 1) : size - 1;
    if (!m[1] && m[2]) { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }
    return new Response(buf.slice(start, end + 1), {
      status: 206,
      statusText: 'Partial Content',
      headers: {
        'Content-Type': resp.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
        'Content-Length': String(end - start + 1),
        'Accept-Ranges': 'bytes'
      }
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // el clima va directo a la red

  var range = req.headers.get('range');
  if (range) {
    e.respondWith(
      caches.match(req.url, { ignoreSearch: true }).then(function (cached) {
        if (cached) return rangeResponse(cached, range);
        return fetch(req);
      })
    );
    return;
  }

  e.respondWith(
    fetch(req).then(function (resp) {
      if (resp && resp.ok && resp.status === 200) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return resp;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (r) {
        return r || caches.match('index.html');
      });
    })
  );
});
