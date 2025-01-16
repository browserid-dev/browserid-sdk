import { indexDbKeys } from "../constants";
import { StorePrivateKeyOnDeviceOptions } from "../types";
import { openDatabase } from "./open-database";
import { GoodConditionsError, ErrorCode } from "../errors";

/**
 * Stores the private key securely using IndexedDB.
 * @param privateKey - The private key to store.
 */
export const storePrivateKeyOnDevice = async (
    { privateKey, userId, deviceId, hostname }: StorePrivateKeyOnDeviceOptions
): Promise<void> => {
    if (!privateKey || !userId || !deviceId || !hostname) {
        throw new GoodConditionsError(
            ErrorCode.KEY_STORAGE_FAILED,
            "Missing required parameters for key storage"
        );
    }

    try {
        const exportedKey = await crypto.subtle.exportKey("pkcs8", privateKey);
        const db = await openDatabase();

        return new Promise((resolve, reject) => {
            const tx = db.transaction("keys", "readwrite");
            const store = tx.objectStore("keys");

            try {
                store.put(exportedKey, indexDbKeys.privateKey);
                store.put(userId, indexDbKeys.userId);
                store.put(deviceId, indexDbKeys.deviceId);
                store.put(hostname, indexDbKeys.hostname);
            } catch (error) {
                reject(new GoodConditionsError(
                    ErrorCode.KEY_STORAGE_FAILED,
                    `Failed to store key data: ${error instanceof Error ? error.message : 'Unknown error'}`
                ));
            }

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(new GoodConditionsError(
                ErrorCode.KEY_STORAGE_FAILED,
                "Transaction failed while storing keys"
            ));
        });
    } catch (error) {
        throw new GoodConditionsError(
            ErrorCode.KEY_STORAGE_FAILED,
            `Failed to export or store key: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}
