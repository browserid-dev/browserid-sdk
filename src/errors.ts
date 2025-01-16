export enum ErrorCode {
    DEVICE_NOT_REGISTERED = 'DEVICE_NOT_REGISTERED',
    SIGNING_FAILED = 'SIGNING_FAILED',
    INVALID_KEY = 'INVALID_KEY',
    KEY_GENERATION_FAILED = 'KEY_GENERATION_FAILED',
    KEY_STORAGE_FAILED = 'KEY_STORAGE_FAILED',
    DATABASE_ERROR = 'DATABASE_ERROR',
    UNLINK_FAILED = 'UNLINK_FAILED',
    VERIFICATION_FAILED = 'VERIFICATION_FAILED'
}

export class GoodConditionsError extends Error {
    code: ErrorCode;

    constructor(code: ErrorCode, message: string) {
        super(`[${code}] ${message}`);
        this.code = code;
        this.name = 'GoodConditionsError';
    }
}

export class DeviceNotRegisteredError extends GoodConditionsError {
    constructor() {
        super(
            ErrorCode.DEVICE_NOT_REGISTERED,
            "No signature key found - device not registered"
        );
    }
} 