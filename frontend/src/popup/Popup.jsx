import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCurrentContext } from '../services/contextService'
import { getPreferences } from '../services/preferencesService'
import { getSummary } from '../services/dashboardService'
import { errorMessage } from '../services/api'
import { deriveState } from '../utils/deriveState'
import Header from '../components/Header'
import AuthForm from '../components/AuthForm'
import StateRing from '../components/StateRing'
import TabBar from '../components/TabBar'
import EmptyState from '../components/EmptyState'

const COMING = {
    FEED: ['Feed', 'Phase 3 — notifications joined with their ALLOW / DELAY / BLOCK decisions.'],
    SUMMARY: ['Summary', 'Phase 4 — what was handled while you were focused.'],
    VOICE: ['Voice', 'Phase 7 — speech to text with a confirm step. No service is connected to send replies yet.'],
    INSIGHTS: ['Insights', 'Phase 5 — interruption stats from your decision history.'],
}

function Dashboard() {
    const { auth, logout } = useAuth()
    const [tab, setTab] = useState('FEED')
    const [data, setData] = useState({ context: null, preferences: null, summary: null })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        setError('')
        const [ctx, prefs, summary] = await Promise.allSettled([getCurrentContext(), getPreferences(), getSummary()])
        const failed = [ctx, prefs, summary].find((r) => r.status === 'rejected')
        if (failed) setError(errorMessage(failed.reason))
        setData({
            context: ctx.value ?? null,
            preferences: prefs.value ?? null,
            summary: summary.value ?? null,
        })
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    const [title, text] = COMING[tab]
    return (
        <>
            <Header name={auth.name} onLogout={logout} />
            {loading ? <p className="muted pad">Connecting…</p> : (
                <StateRing stateKey={deriveState(data.context, data.preferences)} summary={data.summary} />
            )}
            {error && (
                <p className="error pad">{error} <button className="link" onClick={load}>Retry</button></p>
            )}
            <TabBar active={tab} onChange={setTab} />
            <EmptyState title={title}>{text}</EmptyState>
        </>
    )
}

export default function Popup() {
    const { auth, loading } = useAuth()
    return (
        <main className="popup">
            {loading ? null : auth ? <Dashboard /> : (<><Header /><AuthForm /></>)}
        </main>
    )
}
