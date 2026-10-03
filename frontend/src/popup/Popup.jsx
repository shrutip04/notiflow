import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCurrentContext, getSharingEnabled, setSharingEnabled, getTrackerStatus } from '../services/contextService'
import { getPreferences } from '../services/preferencesService'
import { getSummary } from '../services/dashboardService'
import { errorMessage } from '../services/api'
import { deriveState } from '../utils/deriveState'
import Header from '../components/Header'
import AuthForm from '../components/AuthForm'
import StateRing from '../components/StateRing'
import TabBar from '../components/TabBar'
import EmptyState from '../components/EmptyState'
import ContextCard from '../components/ContextCard'
import FeedTab from '../components/FeedTab'
import SummaryTab from '../components/SummaryTab'
import InsightsTab from '../components/InsightsTab'

const COMING = {
    VOICE: ['Voice', 'Phase 7 — speech to text with a confirm step. No service is connected to send replies yet.'],
}

function Dashboard() {
    const { auth, logout } = useAuth()
    const [tab, setTab] = useState('FEED')
    const [feedFilter, setFeedFilter] = useState('ALL')
    const [data, setData] = useState({ context: null, preferences: null, summary: null })
    const [sharing, setSharing] = useState(true)
    const [status, setStatus] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    const [reloadKey, setReloadKey] = useState(0)
    const reload = () => setReloadKey((k) => k + 1)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            const [[ctx, prefs, summary], enabled, trackerStatus] = await Promise.all([
                Promise.allSettled([getCurrentContext(), getPreferences(), getSummary()]),
                getSharingEnabled(),
                getTrackerStatus(),
            ])
            if (cancelled) return
            const failed = [ctx, prefs, summary].find((r) => r.status === 'rejected')
            setError(failed ? errorMessage(failed.reason) : '')
            setData({
                context: ctx.value ?? null,
                preferences: prefs.value ?? null,
                summary: summary.value ?? null,
            })
            setSharing(enabled)
            setStatus(trackerStatus)
            setLoading(false)
        })()
        return () => { cancelled = true }
    }, [reloadKey])

    async function toggleSharing(enabled) {
        setSharing(enabled)
        await setSharingEnabled(enabled)
    }

    const coming = COMING[tab]
    return (
        <>
            <Header name={auth.name} onLogout={logout} />
            {loading ? <p className="muted pad">Connecting…</p> : (
                <StateRing stateKey={deriveState(data.context, data.preferences)} summary={data.summary} />
            )}
            {error && (
                <p className="error pad">{error} <button className="link" onClick={reload}>Retry</button></p>
            )}
            {!loading && <ContextCard context={data.context} enabled={sharing} onToggle={toggleSharing} status={status} />}
            <TabBar active={tab} onChange={setTab} />
            {tab === 'FEED' && <FeedTab onChanged={reload} initialFilter={feedFilter} />}
            {tab === 'SUMMARY' && <SummaryTab onReview={() => { setFeedFilter('ALLOW'); setTab('FEED') }} />}
            {tab === 'INSIGHTS' && <InsightsTab context={data.context} />}
            {coming && <EmptyState title={coming[0]}>{coming[1]}</EmptyState>}
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