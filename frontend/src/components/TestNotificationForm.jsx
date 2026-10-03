import { useState } from 'react'
import { submitNotification } from '../services/notificationService'
import { errorMessage } from '../services/api'

// Developer tool. Sends a REAL notification to POST /api/notifications so you can watch
// the Decision Engine react until an actual integration exists.
export default function TestNotificationForm({ onSent }) {
    const [form, setForm] = useState({ source: 'GITHUB', title: '', content: '' })
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)
    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

    async function submit(e) {
        e.preventDefault()
        setError('')
        setBusy(true)
        try {
            await submitNotification(form)
            setForm({ ...form, title: '', content: '' })
            onSent()
        } catch (err) {
            setError(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <form className="test" onSubmit={submit}>
            <div className="hint">Developer test: sends a real notification to your backend.</div>
            <input placeholder="Source (e.g. GITHUB)" value={form.source} onChange={set('source')} required />
            <input placeholder="Title (e.g. PR review requested)" value={form.title} onChange={set('title')} required />
            <input placeholder="Content" value={form.content} onChange={set('content')} required />
            {error && <p className="error small">{error}</p>}
            <button className="primary" disabled={busy}>{busy ? '…' : 'Send test notification'}</button>
        </form>
    )
}