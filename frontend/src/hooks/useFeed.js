import { useEffect, useState } from 'react'
import { getNotifications } from '../services/notificationService'
import { getDecisions } from '../services/decisionService'
import { errorMessage } from '../services/api'
import { buildFeed } from '../utils/feed'

// Shared by the Feed and Summary tabs: notifications joined with their decisions.
export function useFeed() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const [notifications, decisions] = await Promise.all([getNotifications(), getDecisions()])
                if (cancelled) return
                setItems(buildFeed(notifications, decisions))
                setError('')
            } catch (e) {
                if (!cancelled) setError(errorMessage(e))
            } finally {
                if (!cancelled) setLoading(false)
            }
        })()
        return () => { cancelled = true }
    }, [reloadKey])

    const refresh = () => { setLoading(true); setReloadKey((k) => k + 1) }
    return { items, loading, error, refresh }
}