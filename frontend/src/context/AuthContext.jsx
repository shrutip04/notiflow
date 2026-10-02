import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'
import { setUnauthorizedHandler } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        authService.getStoredAuth().then(setAuth).finally(() => setLoading(false))
        setUnauthorizedHandler(() => setAuth(null))
    }, [])

    const login = useCallback(async (email, password) => setAuth(await authService.login(email, password)), [])
    const register = useCallback(async (name, email, password) => setAuth(await authService.register(name, email, password)), [])
    const logout = useCallback(async () => { await authService.logout(); setAuth(null) }, [])

    const value = useMemo(() => ({ auth, loading, login, register, logout }), [auth, loading, login, register, logout])
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
