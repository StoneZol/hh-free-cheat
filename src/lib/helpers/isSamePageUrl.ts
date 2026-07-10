export function isSamePageUrl(left: string, right: string): boolean {
    if (!left || !right) {
        return false
    }

    try {
        return new URL(left).href === new URL(right).href
    } catch {
        return left === right
    }
}
