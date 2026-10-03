import { useEffect, useState } from 'react'

// 'granted' | 'prompt' | 'denied' | 'unknown' (Permissions API unavailable)
export function useMicPermission() {
    const [state, setState] = useState('unknown')

    useEffect(() => {
        let status = null
        let cancelled = false
        navigator.permissions
            ?.query({ name: 'microphone' })
            .then((s) => {
                if (cancelled) return
                status = s
                setState(s.state)
                s.onchange = () => setState(s.state)
            })
            .catch(() => {})
        return () => {
            cancelled = true
            if (status) status.onchange = null
        }
    }, [])

    return state
}