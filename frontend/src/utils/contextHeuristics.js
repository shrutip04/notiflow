// Pure functions: turn a URL into the fields the backend's ContextRequest expects.
// Only the HOSTNAME is ever used. Paths, queries and page titles never leave the browser.
//
// The backend's TaskRelevanceEngine treats applicationCategory DEVELOPMENT or WORK
// as "user is working". Other categories are free-form strings it just records.

// [domain suffix, display name, category]
const SITES = [
    ['github.com', 'GitHub', 'DEVELOPMENT'],
    ['gitlab.com', 'GitLab', 'DEVELOPMENT'],
    ['stackoverflow.com', 'Stack Overflow', 'DEVELOPMENT'],
    ['developer.mozilla.org', 'MDN', 'DEVELOPMENT'],
    ['leetcode.com', 'LeetCode', 'DEVELOPMENT'],
    ['vscode.dev', 'VS Code Web', 'DEVELOPMENT'],
    ['codesandbox.io', 'CodeSandbox', 'DEVELOPMENT'],
    ['localhost', 'localhost', 'DEVELOPMENT'],
    ['docs.google.com', 'Google Docs', 'WORK'],
    ['notion.so', 'Notion', 'WORK'],
    ['atlassian.net', 'Jira / Confluence', 'WORK'],
    ['linear.app', 'Linear', 'WORK'],
    ['figma.com', 'Figma', 'WORK'],
    ['meet.google.com', 'Google Meet', 'WORK'],
    ['mail.google.com', 'Gmail', 'COMMUNICATION'],
    ['outlook.live.com', 'Outlook', 'COMMUNICATION'],
    ['web.whatsapp.com', 'WhatsApp Web', 'COMMUNICATION'],
    ['discord.com', 'Discord', 'COMMUNICATION'],
    ['slack.com', 'Slack', 'COMMUNICATION'],
    ['linkedin.com', 'LinkedIn', 'SOCIAL'],
    ['instagram.com', 'Instagram', 'SOCIAL'],
    ['x.com', 'X', 'SOCIAL'],
    ['twitter.com', 'X', 'SOCIAL'],
    ['facebook.com', 'Facebook', 'SOCIAL'],
    ['reddit.com', 'Reddit', 'SOCIAL'],
    ['youtube.com', 'YouTube', 'ENTERTAINMENT'],
    ['netflix.com', 'Netflix', 'ENTERTAINMENT'],
    ['twitch.tv', 'Twitch', 'ENTERTAINMENT'],
    ['open.spotify.com', 'Spotify', 'ENTERTAINMENT'],
]

export const WORKING_CATEGORIES = ['DEVELOPMENT', 'WORK']

// Returns { application, domain, category } or null for pages we ignore
// (chrome://, extension pages, file://, new tab, ...).
export function classifyUrl(urlString) {
    let url
    try { url = new URL(urlString) } catch { return null }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    const domain = url.hostname.replace(/^www\./, '')
    if (!domain) return null
    const match = SITES.find(([suffix]) => domain === suffix || domain.endsWith('.' + suffix))
    return match
        ? { application: match[1], domain, category: match[2] }
        : { application: domain, domain, category: 'OTHER' }
}

// activityLevel is a HEURISTIC, not a measurement of the user's real workload:
//  - idle                       -> LOW (backend ignores it when idle=true)
//  - entertainment              -> LOW
//  - work/dev, few tab switches -> HIGH (sustained work)
//  - work/dev, many switches    -> MEDIUM
//  - anything else              -> MEDIUM
export function deriveActivityLevel({ category, idle, switchCount }) {
    if (idle) return 'LOW'
    if (category === 'ENTERTAINMENT') return 'LOW'
    if (WORKING_CATEGORIES.includes(category)) return switchCount <= 4 ? 'HIGH' : 'MEDIUM'
    return 'MEDIUM'
}