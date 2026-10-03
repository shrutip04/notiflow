import { useState } from 'react'
import { useFeed } from '../hooks/useFeed'
import { computeInsights } from '../utils/insights'
import { WINDOWS } from '../utils/summary'
import EmptyState from './EmptyState'

export default function InsightsTab({ context }) {
    const { items, loading, error, refresh } = useFeed()
    const [windowKey, setWindowKey] = useState('24H')
    const win = WINDOWS.find((w) => w.key === windowKey)
    const ins = computeInsights(items, win.ms)

    return (
        <div>
            <div className="filters">
                {WINDOWS.map((w) => (
                    <button key={w.key} className={w.key === windowKey ? 'chip active' : 'chip'} onClick={() => setWindowKey(w.key)}>
                        {w.label}
                    </button>
                ))}
            </div>

            {error && <p className="error small">{error} <button className="link" onClick={refresh}>Retry</button></p>}

            {loading && !items.length ? (
                <p className="muted pad">Loading…</p>
            ) : ins.total === 0 ? (
                <EmptyState title="No data yet">Insights appear once notifications have been handled in this window.</EmptyState>
            ) : (
                <div className="ins">
                    <div className="sum-grid">
                        <div><b className="c-amber">{ins.avoided}</b><span>INTERRUPTIONS AVOIDED</span></div>
                        <div><b>{ins.blockRate == null ? '–' : `${ins.blockRate}%`}</b><span>BLOCK RATE</span></div>
                        <div><b>{context ? `${context.focusDurationMinutes}m` : '–'}</b><span>FOCUS SESSION</span></div>
                    </div>

                    <div className="label sum-label">DECISIONS</div>
                    <div className="bar">
                        {['ALLOW', 'DELAY', 'BLOCK'].map((d) =>
                            ins.counts[d] > 0 ? (
                                <div key={d} className={`seg seg-${d}`} style={{ flex: ins.counts[d] }} title={`${d} ${ins.counts[d]}`} />
                            ) : null,
                        )}
                    </div>
                    <div className="legend">
                        <span className="c-green">● ALLOW {ins.counts.ALLOW}</span>
                        <span className="c-amber">● DELAY {ins.counts.DELAY}</span>
                        <span className="c-red">● BLOCK {ins.counts.BLOCK}</span>
                    </div>

                    <div className="label sum-label">CATEGORIES</div>
                    {ins.categories.map(([name, n]) => (
                        <div key={name} className="cat">
                            <span>{name}</span>
                            <div className="cat-bar"><div style={{ width: `${(n / ins.total) * 100}%` }} /></div>
                            <span className="muted">{n}</span>
                        </div>
                    ))}

                    {ins.avgCost != null && (
                        <div className="hint">
                            Avg interruption cost {ins.avgCost.toFixed(2)} (0 to 1, higher means a worse moment to interrupt).
                        </div>
                    )}
                    <div className="hint">Focus session is the minutes on work or dev sites at your last sync.</div>
                </div>
            )}
        </div>
    )
}