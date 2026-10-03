// The backend's LocalTime normally serialises as "09:00:00"; tolerate the array form [9, 0] too.
export function formatTime(value) {
    if (Array.isArray(value)) return value.slice(0, 2).map((n) => String(n).padStart(2, '0')).join(':')
    if (typeof value === 'string') return value.slice(0, 5)
    return '–'
}