export default function Header({ name, onLogout, onSettings, settingsOpen }) {
    return (
        <header className="header">
            <div>
                <div className="brand">✦ NOTIFLOW</div>
                <div className="sub">ATTENTION ENGINE</div>
            </div>
            {name && (
                <div className="header-actions">
                    <button className={settingsOpen ? 'icon active' : 'icon'} onClick={onSettings} title="Preferences">⚙</button>
                    <button className="link" onClick={onLogout} title={`Signed in as ${name}`}>Log out</button>
                </div>
            )}
        </header>
    )
}