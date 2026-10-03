import { useState } from 'react'
import { timeAgo } from '../utils/timeAgo'

// Actions (reply, call, ...) are intentionally absent: none is backed by a real integration yet.
export default function FeedItem({ item }) {
    const [open, setOpen] = useState(false)
    return (
        <article className="item" onClick={() => setOpen(!open)}>
            <div className="item-top">
                <span className="src">{item.source}</span>
                {item.priority && <span className={`prio prio-${item.priority}`}>{item.priority}</span>}
                <span className={`badge badge-${item.decision || 'NONE'}`}>{item.decision || 'PENDING'}</span>
                <span className="when">{timeAgo(item.receivedAt)}</span>
            </div>
            <div className="item-title">{item.title}</div>
            <div className={open ? 'item-body open' : 'item-body'}>{item.content}</div>
            {open && (
                <div className="why">
                    {item.category && <div>Category: {item.category}</div>}
                    {item.reason && <div>Why: {item.reason}</div>}
                    {item.explanation && <div>{item.explanation}</div>}
                    {!item.reason && !item.explanation && <div>No decision details available.</div>}
                </div>
            )}
        </article>
    )
}