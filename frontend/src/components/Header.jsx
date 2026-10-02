export default function Header({ name, onLogout }) {
    return (
        <header className="header">
            <div>
                <div className="brand">✦ NOTIFLOW</div>
                <div className="sub">ATTENTION ENGINE</div>
            </div>
            {name && (
                <button className="link" onClick={onLogout} title={`Signed in as ${name}`}>Log out</button>
            )}
        </header>
    )
}
