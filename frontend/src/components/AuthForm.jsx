import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { errorMessage } from '../services/api'

export default function AuthForm() {
    const { login, register } = useAuth()
    const [mode, setMode] = useState('login')
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

    async function submit(e) {
        e.preventDefault()
        setError('')
        setBusy(true)
        try {
            if (mode === 'login') await login(form.email, form.password)
            else await register(form.name, form.email, form.password)
        } catch (err) {
            setError(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <form className="auth" onSubmit={submit}>
            <p className="muted">{mode === 'login' ? 'Sign in to your attention engine' : 'Create your Notiflow account'}</p>
            {mode === 'register' && <input placeholder="Name" value={form.name} onChange={set('name')} required />}
            <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
            <input type="password" placeholder="Password" minLength={mode === 'register' ? 6 : undefined} value={form.password} onChange={set('password')} required />
            {error && <p className="error">{error}</p>}
            <button className="primary" disabled={busy}>{busy ? '…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
            <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
                {mode === 'login' ? 'No account? Register' : 'Have an account? Sign in'}
            </button>
        </form>
    )
}
