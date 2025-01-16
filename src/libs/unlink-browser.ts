import { indexDbKeys } from "../constants";
import { openDatabase } from "../utils/open-database";
import { GoodConditionsError, ErrorCode } from "../errors";

/**
 * Removes user authentication data from the browser's IndexedDB storage.
 *
 * This function performs a logout operation by removing:
 * 1. The private key
 * 2. The user ID
 * 3. The device ID
 * 4. The hostname
 * from the browser's secure storage.
 *
 * @returns {Promise<void>} A promise that resolves when all data is successfully removed
 * @throws {Error} If any removal operation fails or if the database transaction fails
 */
export const unlinkBrowser = async (): Promise<void> => {
  try {
    const db = await openDatabase();
    const tx = db.transaction("keys", "readwrite");
    const store = tx.objectStore("keys");

    await Promise.all([
      deleteKey(store, indexDbKeys.privateKey),
      deleteKey(store, indexDbKeys.userId),
      deleteKey(store, indexDbKeys.deviceId),
      deleteKey(store, indexDbKeys.hostname),
    ]);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        reject(
          new GoodConditionsError(
            ErrorCode.UNLINK_FAILED,
            "Failed to complete unlink transaction",
          ),
        );
      };
    });
  } catch (error) {
    throw new GoodConditionsError(
      ErrorCode.UNLINK_FAILED,
      `Failed to unlink device: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

const deleteKey = (store: IDBObjectStore, key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () =>
      reject(
        new GoodConditionsError(
          ErrorCode.UNLINK_FAILED,
          `Failed to delete ${key}`,
        ),
      );
  });
};
