export function shallowEqual(objA: any, objB: any): boolean {
    if (Object.is(objA, objB)) return true;
    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) return false;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (let key of keysA) {
        if (!objB.hasOwnProperty(key)) return false;
        if (!Object.is(objA[key], objB[key])) return false;
    }
    return true;
}
