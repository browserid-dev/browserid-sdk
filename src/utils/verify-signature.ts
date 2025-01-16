import { algorithm } from "../constants";
import { GoodConditionsError, ErrorCode } from "../errors";

export async function verifySignature(
  publicKey: CryptoKey,
  signature: ArrayBuffer,
  challenge: string,
  userId: string,
): Promise<boolean> {
  if (!publicKey || !signature || !challenge || !userId) {
    throw new GoodConditionsError(
      ErrorCode.VERIFICATION_FAILED,
      "Missing required parameters for signature verification",
    );
  }

  try {
    const dataToVerify = `${challenge}:${userId}`;
    return await crypto.subtle.verify(
      algorithm,
      publicKey,
      signature,
      new TextEncoder().encode(dataToVerify),
    );
  } catch (error) {
    throw new GoodConditionsError(
      ErrorCode.VERIFICATION_FAILED,
      `Signature verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
