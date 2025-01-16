export const base64UrlDecode = (base64Url: string): Uint8Array => {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

export const base64UrlEncode = (bytes: Uint8Array): string => {
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(bytes)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};