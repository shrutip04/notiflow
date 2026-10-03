// The backend returns notifications and decisions separately; join them on notificationId.
// NotificationResponse.urgency is a number stored as a string (e.g. "0.85"), so the
// HIGH / MEDIUM / LOW label is derived here for display only.

export function priorityLabel(score) {
    if (score == null || Number.isNaN(score)) return null
    if (score >= 0.8) return 'HIGH'   // 0.8 is the Decision Engine's own "high urgency" threshold
    if (score >= 0.5) return 'MEDIUM'
    return 'LOW'
}

export function buildFeed(notifications, decisions) {
    // If a notification has several decisions, keep the newest.
    const byNotification = new Map()
    for (const d of decisions) {
        const prev = byNotification.get(d.notificationId)
        if (!prev || new Date(d.createdAt) > new Date(prev.createdAt)) byNotification.set(d.notificationId, d)
    }

    return notifications
        .map((n) => {
            const d = byNotification.get(n.id) || null
            const raw = d?.urgencyScore ?? Number(n.urgency)
            const score = Number.isNaN(raw) ? null : raw
            return {
                id: n.id,
                source: n.source,
                title: n.title,
                content: n.content,
                category: n.category,
                receivedAt: n.receivedAt,
                decision: d?.decisionType ?? null, // ALLOW | DELAY | BLOCK, or null if not processed
                priority: priorityLabel(score),
                reason: d?.reason ?? null,
                explanation: d?.aiExplanation ?? null,
            }
        })
        .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
}