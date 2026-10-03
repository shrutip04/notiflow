export default function ToggleRow({ label, hint, checked, onChange, disabled }) {
    return (
        <label className="row">
      <span className="row-text">
        <span className="row-label">{label}</span>
        <span className="hint">{hint}</span>
      </span>
            <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        </label>
    )
}