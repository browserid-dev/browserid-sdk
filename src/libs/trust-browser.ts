import { algorithm } from "../constants";
import { base64UrlEncode } from "../utils/base46-utils";
import { storePrivateKeyOnDevice } from "../utils/store-private-key-on-device";
import { GenerateKeysResponse } from "../types";
import { GoodConditionsError, ErrorCode } from "../errors";
/**
 * Generates a cryptographic key pair (ECDSA P-384) for digital signatures and stores the private key on the device.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.userId - Required user identifier
 */
export const createKeypair = async ({
  userId,
}: {
  userId: string;
}): Promise<GenerateKeysResponse> => {
  if (!userId?.trim()) {
    throw new GoodConditionsError(ErrorCode.INVALID_KEY, "userId is required");
  }

  try {
    const keypair = (await crypto.subtle.generateKey(algorithm, true, [
      "sign",
      "verify",
    ])) as CryptoKeyPair;

    const deviceId = crypto.randomUUID();
    // TODO: when we do mobile, this will be different
    const hostname = window.location.hostname;

    try {
      await storePrivateKeyOnDevice({
        privateKey: keypair.privateKey,
        userId,
        deviceId,
        hostname,
      });
    } catch (error) {
      throw new GoodConditionsError(
        ErrorCode.KEY_STORAGE_FAILED,
        `Failed to store keys: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    try {
      const exportedKey = await crypto.subtle.exportKey(
        "spki",
        keypair.publicKey,
      );
      const base64Key = base64UrlEncode(new Uint8Array(exportedKey));

      return { publicKey: base64Key, userId, deviceId };
    } catch (error) {
      throw new GoodConditionsError(
        ErrorCode.KEY_GENERATION_FAILED,
        `Failed to export public key: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  } catch (error) {
    if (error instanceof GoodConditionsError) throw error;

    throw new GoodConditionsError(
      ErrorCode.KEY_GENERATION_FAILED,
      `Failed to generate keypair: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
