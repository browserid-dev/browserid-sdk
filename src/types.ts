export type KeypairData = {
    publicKey: CryptoKey;
    privateKey: CryptoKey;
}

export type ApiResponse = {
    success: boolean;
    result?: any;
    errors?: {
        message: string;
        code: number;
    }[];
}

/**
* Response object returned after successful key generation
*/
export type GenerateKeysResponse = {
    /**
     * Base64url-encoded public key string
     */
    publicKey: string;
    /**
     * The user identifier (either provided or generated)
     */
    userId: string;
    /**
     * A unique UUID for this device/key pair
     */
    deviceId: string;
}

export type StorePrivateKeyOnDeviceOptions = {
    privateKey: CryptoKey;
    userId: string;
    deviceId: string;
    hostname: string;
}

/**
 * Response containing the challenge and its signature
 */
export type CreateChallengeResponse = {
    /** Base64URL-encoded random challenge string */
    challenge: string;
    /** Cryptographic signature of the challenge */
    signature: string;
    /** Identifier of the signing user */
    userId: string;
    /** A unique UUID for this device/key pair */
    deviceId: string;
}

export type SignChallengeResponse = {
    signature: string;
    userId: string;
    deviceId: string;
    hostname: string;
}

export { GoodConditionsError, DeviceNotRegisteredError, ErrorCode } from './errors';