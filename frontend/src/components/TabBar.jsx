const TABS = ['FEED', 'SUMMARY', 'VOICE', 'INSIGHTS']

export default function TabBar({ active, onChange }) {
    return (
        <nav className="tabs">
            {TABS.map((t) => (
                <button key={t} className={t === active ? 'tab active' : 'tab'} onClick={() => onChange(t)}>{t}</button>
            ))}
        </nav>
    )
}