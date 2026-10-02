import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '../context/AuthContext'
import Popup from './Popup'
import '../styles/popup.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <Popup />
        </AuthProvider>
    </StrictMode>,
)
