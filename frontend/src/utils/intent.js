// Rule-based intent parsing for ONE pattern: "tell <name> <message>". Not NLP, not AI.
// service is always null: nothing in the sentence (or the app) says where to send it yet.
const PRONOUNS = new Set(['him', 'her', 'them', 'he', 'she', 'they'])

const PATTERNS = [
    /^(?:please\s+)?let\s+(\S+)\s+know\s+(?:that\s+)?(.+)$/i,
    /^(?:please\s+)?reply\s+to\s+(\S+?)[,:]?\s+(?:saying\s+|with\s+|that\s+)?(.+)$/i,
    /^(?:please\s+)?(?:tell|message|text|ping)\s+(\S+?)[,:]?\s+(?:that\s+)?(.+)$/i,
]

export function parseIntent(text) {
    const input = (text || '').trim()
    if (!input) return { action: null, reason: 'Nothing to interpret.' }

    for (const pattern of PATTERNS) {
        const match = input.match(pattern)
        if (!match) continue
        const name = match[1].replace(/[,:]$/, '')
        const message = match[2].trim()
        return {
            action: 'REPLY',
            recipient: PRONOUNS.has(name.toLowerCase()) ? null : name,
            message: message.charAt(0).toUpperCase() + message.slice(1),
            service: null,
        }
    }
    return {
        action: null,
        reason: 'Only replies like "Tell Rahul I will send it tonight" are recognised for now.',
    }
}