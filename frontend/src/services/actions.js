// Action architecture. An action is { type, service, target, payload }.
// Nothing here talks to an external service. An integration (Phase 8+) calls
// registerActionHandler(type, fn); until then every action reports "not supported",
// and the UI keeps the matching button disabled instead of pretending to work.
export const ACTION_TYPES = ['REPLY', 'OPEN', 'CALL', 'ARCHIVE', 'MARK_READ', 'SCHEDULE', 'SUMMARIZE']

const handlers = {}

export function registerActionHandler(type, handler) {
    handlers[type] = handler
}

export const isActionSupported = (type) => typeof handlers[type] === 'function'

export async function executeAction(action) {
    if (!isActionSupported(action.type)) {
        throw new Error(`${action.type} is not supported yet: no service is connected.`)
    }
    return handlers[action.type](action)
}