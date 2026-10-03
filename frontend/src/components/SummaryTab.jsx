import { useState } from 'react'
import { useFeed } from '../hooks/useFeed'
import { summarize, WINDOWS } from '../utils/summary'
import { timeAgo } from '../utils/timeAgo'
import EmptyState from './EmptyState'

export default function SummaryTab({ onReview }) {
    const { items, loading, error, refresh } = useFeed()
    const [windowKey, setWindowKey] = useState('24H')
    const win = WINDOWS.find((w) => w.key === windowKey)
    const s = summarize(items, win.ms)

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
            ) : s.total === 0 ? (
                <EmptyState title="Nothing handled">No notifications in this time window.</EmptyState>
            ) : (
                <div className="sum">
                    <div className="sum-head">{s.total} notification{s.total === 1 ? '' : 's'} handled</div>
                    <div className="sum-grid">
                        <div><b className="c-green">{s.attention.length}</b><span>need attention</span></div>
                        <div><b className="c-amber">{s.delayed}</b><span>delayed</span></div>
                        <div><b className="c-red">{s.blocked}</b><span>blocked</span></div>
                    </div>

                    {s.attention.length > 0 && (
                        <>
                            <div className="label sum-label">NEEDS YOUR ATTENTION</div>
                            <ul className="sum-list">
                                {s.attention.slice(0, 5).map((i) => (
                                    <li key={i.id}>
                                        <span className="src">{i.source}</span> {i.title}
                                        {i.priority === 'HIGH' && <span className="prio prio-HIGH"> HIGH</span>}
                                        <span className="when"> · {timeAgo(i.receivedAt)}</span>
                                    </li>
                                ))}
                            </ul>
                            {onReview && <button className="link" onClick={onReview}>Review in Feed →</button>}
                        </>
                    )}

                    <div className="hint">
                        By source: {s.sources.map(([name, n]) => `${name} ${n}`).join(' · ')}
                        {s.unprocessed > 0 && ` · ${s.unprocessed} without a decision`}
                    </div>
                    <div className="hint">Counts from your decision history. No AI summarisation yet.</div>
                </div>
            )}
        </div>
    )
}