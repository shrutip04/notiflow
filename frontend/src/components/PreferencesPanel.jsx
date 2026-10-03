import { useState } from 'react'
import { updatePreferences } from '../services/preferencesService'
import { errorMessage } from '../services/api'
import { formatTime } from '../utils/formatTime'
import ToggleRow from './ToggleRow'
import EmptyState from './EmptyState'

// Each toggle saves immediately (PUT /api/preferences) and rolls back if the save fails.
export default function PreferencesPanel({ preferences, onSaved, onBack }) {
    const [prefs, setPrefs] = useState(preferences)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    async function change(key, value) {
        const previous = prefs
        setPrefs({ ...prefs, [key]: value })
        setSaving(true)
        setError('')
        try {
            setPrefs(await updatePreferences({ ...prefs, [key]: value }))
            onSaved()
        } catch (e) {
            setPrefs(previous)
            setError(errorMessage(e))
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="prefs">
            <div className="prefs-head">
                <button className="link" onClick={onBack}>← Back</button>
                <span className="label">PREFERENCES</span>
            </div>

            {!prefs ? (
                <EmptyState title="Preferences unavailable">They could not be loaded from the backend.</EmptyState>
            ) : (
                <>
                    <ToggleRow label="Focus mode" hint="Makes interrupting you cost more (+0.2), so more is delayed or blocked."
                               checked={prefs.focusModeEnabled} disabled={saving} onChange={(v) => change('focusModeEnabled', v)} />
                    <ToggleRow label="Favour high-urgency" hint="Gives notifications with urgency 0.8 or more a priority boost."
                               checked={prefs.allowHighPriority} disabled={saving} onChange={(v) => change('allowHighPriority', v)} />
                    <ToggleRow label="Work notifications" hint="When off, WORK notifications lose priority and are held back more."
                               checked={prefs.allowWorkNotifications} disabled={saving} onChange={(v) => change('allowWorkNotifications', v)} />
                    <ToggleRow label="Personal notifications" hint="When off, PERSONAL notifications lose priority and are held back more."
                               checked={prefs.allowPersonalNotifications} disabled={saving} onChange={(v) => change('allowPersonalNotifications', v)} />

                    <div className="hint prefs-hours">
                        Work hours {formatTime(prefs.workHoursStart)}–{formatTime(prefs.workHoursEnd)} are saved on your account but not
                        used by the Decision Engine yet, so they are not editable here.
                    </div>
                </>
            )}
            {error && <p className="error small">{error}</p>}
        </div>
    )
}