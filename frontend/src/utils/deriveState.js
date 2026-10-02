// UI-only state. The backend has NO such field; it has activityLevel, idle and
// the focusModeEnabled preference. We map those onto four labels for display.
export const STATES = {
    IDLE: { label: 'Idle', hint: 'Review queue', color: 'var(--blue)' },
    FOCUS: { label: 'Focus', hint: 'Limited interruptions', color: 'var(--purple)' },
    BROWSING: { label: 'Browsing', hint: 'View / limited actions', color: 'var(--amber)' },
    CASUAL: { label: 'Casual', hint: 'Full actions', color: 'var(--green)' },
}

export function deriveState(context, preferences) {
    if (!context && !preferences) return null
    if (context?.idle) return 'IDLE'
    if (preferences?.focusModeEnabled) return 'FOCUS'
    switch (context?.activityLevel) {
        case 'HIGH': return 'FOCUS'
        case 'MEDIUM': return 'BROWSING'
        case 'LOW': return 'CASUAL'
        default: return null // no context yet
    }
}
