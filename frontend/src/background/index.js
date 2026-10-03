// Manifest V3 service worker. Listeners MUST be registered synchronously at top level.
// No polling: everything is driven by browser events, plus one 10-minute heartbeat alarm.
import { AUTH_KEY, CTX_ENABLED_KEY } from '../services/config.js'
import {
    FLUSH_ALARM, HEARTBEAT_ALARM, IDLE_DETECTION_SECONDS, onActivity,
} from './contextTracker.js'

const run = (label) => onActivity().catch((e) => console.warn('[Notiflow] context update failed:', label, e))

chrome.idle.setDetectionInterval(IDLE_DETECTION_SECONDS)

chrome.tabs.onActivated.addListener(() => run('tab-activated'))
chrome.tabs.onUpdated.addListener((_id, change, tab) => {
    if (tab.active && (change.url || change.status === 'complete')) run('tab-updated')
})
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) run('window-focus')
})
chrome.idle.onStateChanged.addListener(() => run('idle-changed'))

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === FLUSH_ALARM || alarm.name === HEARTBEAT_ALARM) run(alarm.name)
})

// Send context right after login, and right after the user turns sharing on.
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return
    if (changes[AUTH_KEY]?.newValue?.token) run('login')
    if (changes[CTX_ENABLED_KEY]?.newValue === true) run('sharing-enabled')
})

async function ensureHeartbeat() {
    if (!(await chrome.alarms.get(HEARTBEAT_ALARM))) {
        chrome.alarms.create(HEARTBEAT_ALARM, { periodInMinutes: 10 })
    }
}
chrome.runtime.onInstalled.addListener(ensureHeartbeat)
chrome.runtime.onStartup.addListener(ensureHeartbeat)