// Pure counting over real notification + decision data. No AI model is involved.
export const WINDOWS = [
    { key: '1H', label: 'Last hour', ms: 60 * 60 * 1000 },
    { key: '24H', label: 'Last 24h', ms: 24 * 60 * 60 * 1000 },
    { key: 'ALL', label: 'All time', ms: Infinity },
]

const RANK = { HIGH: 0, MEDIUM: 1, LOW: 2 }

export function summarize(items, windowMs, now = Date.now()) {
    const inWindow = items.filter((i) => now - new Date(i.receivedAt).getTime() <= windowMs)
    const by = (decision) => inWindow.filter((i) => i.decision === decision)

    // Items Notiflow let through, most urgent first, then newest.
    const attention = by('ALLOW').sort(
        (a, b) =>
            (RANK[a.priority] ?? 3) - (RANK[b.priority] ?? 3) ||
            new Date(b.receivedAt) - new Date(a.receivedAt),
    )

    const sourceCounts = {}
    for (const i of inWindow) sourceCounts[i.source] = (sourceCounts[i.source] || 0) + 1
    const sources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])

    return {
        total: inWindow.length,
        attention,
        delayed: by('DELAY').length,
        blocked: by('BLOCK').length,
        unprocessed: inWindow.filter((i) => !i.decision).length,
        sources,
    }
}