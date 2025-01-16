import { CreateChallengeResponse } from "../types";
import { base64UrlEncode } from "../utils/base46-utils";
import { signChallenge } from "../utils/sign-challenge";
import { DeviceNotRegisteredError } from "../errors";

/**
 * Creates and signs a timestamped challenge for authentication.
 *
 * @returns {Promise<CreateChallengeResponse>} Object containing:
 *  - challenge: Base64URL-encoded challenge string
 *  - signature: Cryptographic signature
 *  - userId: Associated user ID
 *  - deviceId: Device identifier
 *  - timestamp: ISO timestamp
 * @throws {DeviceNotRegisteredError} If no valid keys are found
 */
export const createChallenge = async (): Promise<CreateChallengeResponse> => {
  try {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const challenge = base64UrlEncode(array);

    const { signature, userId, deviceId } = await signChallenge(challenge);
    return {
      challenge,
      signature,
      userId,
      deviceId,
    };
  } catch (error) {
    if (error instanceof DeviceNotRegisteredError) {
      throw error;
    }
    throw error;
  }
};
