import { useState } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useMicPermission } from '../hooks/useMicPermission'
import { parseIntent } from '../utils/intent'
import { isActionSupported } from '../services/actions'
import EmptyState from './EmptyState'

function openPermissionPage() {
    chrome.tabs.create({ url: chrome.runtime.getURL('permission.html') })
}

export default function VoiceTab() {
    const { supported, listening, transcript, setTranscript, interim, error, start, stop } = useSpeechRecognition()
    const mic = useMicPermission()
    const [review, setReview] = useState(null)

    if (!supported) {
        return <EmptyState title="Voice unavailable">This browser has no speech recognition.</EmptyState>
    }

    const needsPermission = mic === 'prompt' || mic === 'denied'
    const canSend = review?.action === 'REPLY' && review.recipient && review.service && isActionSupported('REPLY')

    if (review) {
        return (
            <div className="voice">
                {review.action === 'REPLY' ? (
                    <div className="review">
                        <div className="label">CONFIRM REPLY</div>
                        <div className="review-row"><span>To</span><b>{review.recipient || 'not specified'}</b></div>
                        <div className="review-row"><span>Via</span><b>no service connected</b></div>
                        <div className="review-msg">“{review.message}”</div>
                    </div>
                ) : (
                    <div className="review"><div className="muted">{review.reason}</div></div>
                )}
                <div className="review-actions">
                    <button className="chip" onClick={() => setReview(null)}>Cancel</button>
                    {review.action === 'REPLY' && (
                        <button className="primary send" disabled={!canSend}>Send</button>
                    )}
                </div>
                {review.action === 'REPLY' && !canSend && (
                    <div className="hint">Sending is disabled: no messaging service is connected yet (planned for Phase 8).</div>
                )}
            </div>
        )
    }

    return (
        <div className="voice">
            {needsPermission && (
                <div className="review">
                    <div className="muted">Microphone access is needed once. Chrome can only ask on a normal page.</div>
                    <button className="primary" onClick={openPermissionPage}>Allow microphone</button>
                </div>
            )}

            <div className="mic-row">
                <button className={listening ? 'mic live' : 'mic'} onClick={listening ? stop : start}
                        disabled={needsPermission} title={listening ? 'Stop' : 'Speak'}>
                    {listening ? '■' : '●'}
                </button>
                <span className="muted">{listening ? 'Listening…' : 'Tap to speak'}</span>
            </div>

            <textarea rows={3} placeholder='Say or type, e.g. "Tell Rahul I will send it tonight"'
                      value={transcript} onChange={(e) => setTranscript(e.target.value)} />
            {interim && <div className="hint">… {interim}</div>}
            {error && <p className="error small">{error}</p>}

            <button className="primary" disabled={!transcript.trim() || listening} onClick={() => setReview(parseIntent(transcript))}>
                Review
            </button>
            <div className="hint">Speech recognition is done by Chrome, which sends your audio to Google. You can also just type.</div>
        </div>
    )
}