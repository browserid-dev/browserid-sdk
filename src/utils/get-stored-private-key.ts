import { openDatabase } from "./open-database";
import { algorithm, indexDbKeys } from "../constants";
import { DeviceNotRegisteredError } from "../errors";

export const getStoredPrivateKeyAndUserId = async (): Promise<{
  privateKey: CryptoKey;
  userId: string;
  deviceId: string;
  hostname: string;
}> => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("keys", "readonly");
      const store = tx.objectStore("keys");

      const privateKeyRequest = store.get(indexDbKeys.privateKey);
      const userIdRequest = store.get(indexDbKeys.userId);
      const deviceIdRequest = store.get(indexDbKeys.deviceId);
      const hostnameRequest = store.get(indexDbKeys.hostname);

      let privateKey: ArrayBuffer | null = null;
      let userId: string | null = null;
      let deviceId: string | null = null;
      let hostname: string | null = null;

      tx.oncomplete = async () => {
        if (!privateKey || !userId || !deviceId || !hostname) {
          reject(new DeviceNotRegisteredError());
          return;
        }

        try {
          const importedKey = await crypto.subtle.importKey(
            "pkcs8",
            privateKey,
            algorithm,
            true,
            ["sign"],
          );
          resolve({ privateKey: importedKey, userId, deviceId, hostname });
        } catch (importError) {
          reject(new DeviceNotRegisteredError());
        }
      };

      privateKeyRequest.onsuccess = (event) => {
        privateKey = (event.target as IDBRequest).result;
      };

      userIdRequest.onsuccess = (event) => {
        userId = (event.target as IDBRequest).result;
      };

      deviceIdRequest.onsuccess = (event) => {
        deviceId = (event.target as IDBRequest).result;
      };

      hostnameRequest.onsuccess = (event) => {
        hostname = (event.target as IDBRequest).result;
      };

      tx.onerror = () => {
        reject(new DeviceNotRegisteredError());
      };
    });
  } catch (error) {
    throw new DeviceNotRegisteredError();
  }
};
