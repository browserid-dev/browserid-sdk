// Open IndexedDB
export const openDatabase = async (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("cryptoKeys", 1);
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            db.createObjectStore("keys");
        };
        request.onsuccess = (event: Event) => resolve((event.target as IDBOpenDBRequest).result);
        request.onerror = (event: Event) => reject((event.target as IDBOpenDBRequest).error);
    });
}