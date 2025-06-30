// Lightweight fallback Service-Worker for v0 preview.
// – Does nothing except become active immediately –
//   enough to satisfy the browser’s registration request.

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", () => {
  self.clients.claim()
})
