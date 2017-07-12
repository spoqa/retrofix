export function assert(condition: boolean | (() => boolean), message?: string) {
    if (process.env.NODE_ENV !== 'production') {
        if (typeof condition === 'function' ? condition() : condition) {
            throw new Error(message);
        }
    }
}
