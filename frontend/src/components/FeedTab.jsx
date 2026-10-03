import { useState } from 'react'
import { useFeed } from '../hooks/useFeed'
import FeedItem from './FeedItem'
import TestNotificationForm from './TestNotificationForm'
import EmptyState from './EmptyState'

const FILTERS = ['ALL', 'ALLOW', 'DELAY', 'BLOCK']

export default function FeedTab({ onChanged, initialFilter = 'ALL' }) {
    const { items, loading, error, refresh } = useFeed()
    const [filter, setFilter] = useState(initialFilter)
    const [showTest, setShowTest] = useState(false)

    const handleSent = () => { refresh(); onChanged?.() }

    const count = (f) => (f === 'ALL' ? items.length : items.filter((i) => i.decision === f).length)
    const visible = filter === 'ALL' ? items : items.filter((i) => i.decision === filter)

    return (
        <div>
            <div className="filters">
                {FILTERS.map((f) => (
                    <button key={f} className={f === filter ? 'chip active' : 'chip'} onClick={() => setFilter(f)}>
                        {f} {count(f)}
                    </button>
                ))}
                <button className="chip test-toggle" onClick={() => setShowTest(!showTest)}>{showTest ? '× Close' : '+ Test'}</button>
            </div>

            {showTest && <TestNotificationForm onSent={handleSent} />}
            {error && <p className="error small">{error} <button className="link" onClick={refresh}>Retry</button></p>}

            {loading && !items.length ? (
                <p className="muted pad">Loading…</p>
            ) : visible.length === 0 ? (
                <EmptyState title={items.length ? `No ${filter} items` : 'Nothing handled yet'}>
                    {items.length
                        ? 'Try another filter.'
                        : 'Notifications appear here once a source sends them to Notiflow. No service is connected yet.'}
                </EmptyState>
            ) : (
                <div className="list">{visible.map((i) => <FeedItem key={i.id} item={i} />)}</div>
            )}
        </div>
    )
}