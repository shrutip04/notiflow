import { useCallback, useRef, useState } from 'react'

// Real browser speech-to-text (Chrome's Web Speech API). Chrome sends the audio to Google's servers.
const Recognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

function describeError(code) {
    switch (code) {
        case 'not-allowed':
        case 'service-not-allowed': return 'Microphone blocked. Use "Allow microphone" below.'
        case 'no-speech': return 'No speech heard. Try again.'
        case 'audio-capture': return 'No microphone found.'
        case 'network': return 'Speech service unreachable. It needs an internet connection.'
        case 'aborted': return ''
        default: return `Speech error: ${code}`
    }
}

export function useSpeechRecognition() {
    const ref = useRef(null)
    const [listening, setListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [interim, setInterim] = useState('')
    const [error, setError] = useState('')

    const start = useCallback(() => {
        if (!Recognition || ref.current) return
        setError('')
        setInterim('')
        const r = new Recognition()
        r.lang = navigator.language || 'en-US'
        r.interimResults = true
        r.continuous = false
        r.onresult = (e) => {
            let finalText = ''
            let interimText = ''
            for (let i = e.resultIndex; i < e.results.length; i += 1) {
                const res = e.results[i]
                if (res.isFinal) finalText += res[0].transcript
                else interimText += res[0].transcript
            }
            if (finalText) setTranscript((prev) => `${prev} ${finalText}`.trim())
            setInterim(interimText)
        }
        r.onerror = (e) => setError(describeError(e.error))
        r.onend = () => {
            ref.current = null
            setListening(false)
            setInterim('')
        }
        ref.current = r
        r.start()
        setListening(true)
    }, [])

    const stop = useCallback(() => ref.current?.stop(), [])

    return { supported: Boolean(Recognition), listening, transcript, setTranscript, interim, error, start, stop }
}