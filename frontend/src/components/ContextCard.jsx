import { timeAgo } from '../utils/timeAgo'

// Shows exactly what the backend last received, plus the sharing switch.
export default function ContextCard({ context, enabled, onToggle, status }) {
    return (
        <section className="ctx">
            <div className="ctx-head">
                <span className="label">LAST SYNCED</span>
                <label className="switch" title="Send browser context to your Notiflow backend">
                    <input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
                    <span>{enabled ? 'Sharing on' : 'Sharing off'}</span>
                </label>
            </div>
            {context ? (
                <>
                    <div className="ctx-main">
                        {context.activeApplication}
                        <span className="muted"> · {context.applicationCategory || 'OTHER'}</span>
                    </div>
                    <div className="ctx-meta">
                        {context.activityLevel} activity · {context.focusDurationMinutes}m focus · {context.applicationSwitchCount} switches
                        {context.idle ? ' · idle' : ''} · {timeAgo(context.timestamp)}
                    </div>
                </>
            ) : (
                <div className="muted">
                    {enabled ? 'No context received yet. Open a website and it will appear here.' : 'Turn sharing on to let Notiflow see which site you are on.'}
                </div>
            )}
            {status?.lastError && <div className="error small">{status.lastError}</div>}
            <div className="hint">Only the site&apos;s domain is shared, never page titles, URLs or content.</div>
        </section>
    )
}