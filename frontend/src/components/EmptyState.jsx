export default function EmptyState({ title, children }) {
    return (
        <div className="empty">
            <div className="empty-title">{title}</div>
            <div className="muted">{children}</div>
        </div>
    )
}
