import { STATES } from '../utils/deriveState'

// Ring = share of notifications Notiflow did NOT let through (delayed + blocked).
// Centre number = total notifications handled. Both are real backend counts.
export default function StateRing({ stateKey, summary }) {
    const state = stateKey ? STATES[stateKey] : null
    const total = summary?.totalNotifications ?? 0
    const held = (summary?.delayedCount ?? 0) + (summary?.blockedCount ?? 0)
    const R = 34, C = 2 * Math.PI * R
    const frac = total ? held / total : 0

    return (
        <div className="ring-wrap">
            <svg width="88" height="88" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r={R} className="ring-bg" />
                <circle cx="44" cy="44" r={R} className="ring-fg" stroke={state?.color ?? 'var(--line)'}
                        strokeDasharray={`${C * frac} ${C}`} transform="rotate(-90 44 44)" />
                <text x="44" y="49" textAnchor="middle" className="ring-num">{summary ? total : '–'}</text>
            </svg>
            <div className="ring-info">
                <div className="state" style={{ color: state?.color }}>● {state ? state.label : 'No context yet'}</div>
                <div className="hint">{state ? state.hint : 'Context arrives in Phase 2'}</div>
                {summary && <div className="hint">{held} interruptions held back</div>}
            </div>
        </div>
    )
}
