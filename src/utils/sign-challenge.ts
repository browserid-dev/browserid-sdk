import { SignChallengeResponse } from "../types";
import { base64UrlEncode } from "../utils/base46-utils";
import { getStoredPrivateKeyAndUserId } from "./get-stored-private-key";
import { ErrorCode, GoodConditionsError } from "../errors";

export const signChallenge = async (challenge: string): Promise<SignChallengeResponse> => {
    const { privateKey, userId, deviceId, hostname } = await getStoredPrivateKeyAndUserId();

    const dataToSign = `${challenge}:${userId}:${deviceId}:${hostname}`;

    try {
        const signature = await crypto.subtle.sign(
            {
                name: "ECDSA",
                hash: { name: "SHA-384" },
            },
            privateKey,
            new TextEncoder().encode(dataToSign)
        );

        return {
            signature: base64UrlEncode(new Uint8Array(signature)),
            userId,
            deviceId,
            hostname
        };
    } catch (error) {
        throw new GoodConditionsError(ErrorCode.SIGNING_FAILED, `Failed to sign challenge: ${error}`);
    }
}