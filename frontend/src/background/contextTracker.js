// Event-driven browser context tracking for the MV3 service worker.
// The worker can be suspended at any time, so ALL state lives in chrome.storage.local.
// Privacy: only hostname + derived category/level are sent (see contextHeuristics.js).
import { API_BASE_URL, AUTH_KEY, CTX_ENABLED_KEY, CTX_STATE_KEY, CTX_STATUS_KEY } from '../services/config.js'
import { classifyUrl, deriveActivityLevel, WORKING_CATEGORIES } from '../utils/contextHeuristics.js'

export const FLUSH_ALARM = 'notiflow-flush'
export const HEARTBEAT_ALARM = 'notiflow-heartbeat'

const SWITCH_WINDOW_MS = 5 * 60 * 1000   // window for applicationSwitchCount
const MIN_SEND_GAP_MS = 30 * 1000        // never POST more than once per 30 s
const HEARTBEAT_MS = 10 * 60 * 1000      // refresh unchanged context every 10 min
const IDLE_SECONDS = 60                  // chrome.idle detection interval

export const IDLE_DETECTION_SECONDS = IDLE_SECONDS

const read = async (key) => (await chrome.storage.local.get(key))[key] ?? null
const write = (key, value) => chrome.storage.local.set({ [key]: value })

async function sharingEnabled() {
    const v = await read(CTX_ENABLED_KEY)
    return v === null ? true : v
}

async function activeTabInfo() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    return tab?.url ? classifyUrl(tab.url) : null
}

function buildPayload(s, now) {
    const switchCount = s.switches.filter((t) => now - t < SWITCH_WINDOW_MS).length
    // Focus minutes only accumulate on work/dev sites; the backend subtracts them
    // from interruptibility, which would be wrong for e.g. a long YouTube session.
    const working = WORKING_CATEGORIES.includes(s.category)
    const focusDurationMinutes =
        working && !s.idle && s.categorySince ? Math.floor((now - s.categorySince) / 60000) : 0
    return {
        activeApplication: s.application,
        applicationCategory: s.category,
        activeDomain: s.domain,
        activityLevel: deriveActivityLevel({ category: s.category, idle: s.idle, switchCount }),
        idle: s.idle,
        focusDurationMinutes,
        applicationSwitchCount: switchCount,
    }
}

const signature = (p) => [p.activeDomain, p.applicationCategory, p.activityLevel, p.idle].join('|')

// Called for every relevant browser event. Updates stored state, then decides whether to POST.
export async function onActivity() {
    const now = Date.now()
    const s = (await read(CTX_STATE_KEY)) || { switches: [], idle: false }

    const info = await activeTabInfo()
    if (info) {
        if (s.domain && info.domain !== s.domain) s.switches.push(now) // real domain changes only
        if (info.category !== s.category || !s.categorySince) s.categorySince = now
        s.application = info.application
        s.domain = info.domain
        s.category = info.category
    }

    const wasIdle = s.idle
    s.idle = (await chrome.idle.queryState(IDLE_SECONDS)) !== 'active'
    if (wasIdle && !s.idle) s.categorySince = now // focus streak restarts after a break

    s.switches = s.switches.filter((t) => now - t < SWITCH_WINDOW_MS)
    await write(CTX_STATE_KEY, s)
    await maybeSend(s, now)
}

async function maybeSend(s, now) {
    if (!s.application || !(await sharingEnabled())) return
    const auth = await read(AUTH_KEY)
    if (!auth?.token) return

    const payload = buildPayload(s, now)
    const changed = signature(payload) !== s.lastSig
    const stale = now - (s.lastSentAt || 0) >= HEARTBEAT_MS
    if (!changed && !stale) return

    const wait = MIN_SEND_GAP_MS - (now - (s.lastAttemptAt || 0))
    if (wait > 0) {
        chrome.alarms.create(FLUSH_ALARM, { when: now + wait }) // retry once the throttle window ends
        return
    }
    await send(auth.token, payload, now)
}

async function send(token, payload, now) {
    const fresh = (await read(CTX_STATE_KEY)) || {}
    fresh.lastAttemptAt = now
    try {
        const res = await fetch(`${API_BASE_URL}/api/context`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
        })
        if (res.status === 401 || res.status === 403) {
            await chrome.storage.local.remove(AUTH_KEY) // session over; popup will show login
            await write(CTX_STATUS_KEY, { lastError: 'Session expired. Log in again.', lastAttemptAt: now })
        } else if (!res.ok) {
            await write(CTX_STATUS_KEY, { lastError: `Backend returned ${res.status}`, lastAttemptAt: now })
        } else {
            fresh.lastSig = signature(payload)
            fresh.lastSentAt = now
            await write(CTX_STATUS_KEY, { lastSentAt: now, lastError: null })
        }
    } catch {
        await write(CTX_STATUS_KEY, { lastError: 'Backend unreachable', lastAttemptAt: now })
    }
    await write(CTX_STATE_KEY, fresh)
}