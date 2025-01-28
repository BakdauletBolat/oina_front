

export function getFromCache(key: string) {
    if (localStorage.getItem(key)) return JSON.parse(localStorage.getItem(key)!);
    return null;
}

export function setToCache(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
}