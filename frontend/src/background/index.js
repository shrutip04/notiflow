// Manifest V3 service worker. It can be suspended at any time, so it keeps no
// in-memory state; anything persistent goes to chrome.storage.
// Phase 1: lifecycle only. Phase 2 adds tab/idle listeners for browser context.
chrome.runtime.onInstalled.addListener((details) => {
    console.log('[Notiflow] installed/updated:', details.reason)
})
