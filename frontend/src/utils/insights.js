// Pure calculations over real notification + decision data. Nothing is estimated or invented.
export function computeInsights(items, windowMs, now = Date.now()) {
    const inWindow = items.filter((i) => now - new Date(i.receivedAt).getTime() <= windowMs)
    const counts = { ALLOW: 0, DELAY: 0, BLOCK: 0 }
    for (const i of inWindow) if (counts[i.decision] !== undefined) counts[i.decision] += 1

    const decided = counts.ALLOW + counts.DELAY + counts.BLOCK
    const costs = inWindow.map((i) => i.cost).filter((c) => typeof c === 'number')

    const categoryCounts = {}
    for (const i of inWindow) {
        const key = i.category || 'UNCATEGORISED'
        categoryCounts[key] = (categoryCounts[key] || 0) + 1
    }

    return {
        total: inWindow.length,
        decided,
        counts,
        avoided: counts.DELAY + counts.BLOCK, // interruptions Notiflow held back
        blockRate: decided ? Math.round((counts.BLOCK / decided) * 100) : null,
        avgCost: costs.length ? costs.reduce((a, b) => a + b, 0) / costs.length : null,
        categories: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 4),
    }
}