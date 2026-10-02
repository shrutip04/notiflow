// Thin promise wrapper over chrome.storage.local.
// Falls back to localStorage only when opened outside Chrome (e.g. `vite dev`).
const hasChrome = typeof chrome !== 'undefined' && chrome.storage?.local

export async function getItem(key) {
    if (hasChrome) {
        const result = await chrome.storage.local.get(key)
        return result[key] ?? null
    }
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
}

export async function setItem(key, value) {
    if (hasChrome) return chrome.storage.local.set({ [key]: value })
    localStorage.setItem(key, JSON.stringify(value))
}

export async function removeItem(key) {
    if (hasChrome) return chrome.storage.local.remove(key)
    localStorage.removeItem(key)
}
