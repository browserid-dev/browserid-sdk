import { ApiResponse, CreateChallengeResponse, GenerateKeysResponse } from "../types";

export class Backend {
    private workspaceId: string;
    private apiKey: string;
    private baseUrl: string;

    constructor({workspaceId, apiKey}: {workspaceId: string, apiKey: string}) {
        this.workspaceId = workspaceId;
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.browserid.dev/v1/workspaces'
    }

    async register({ userId, publicKey, deviceId }: GenerateKeysResponse) {
        const request = await fetch(`${this.baseUrl}/${this.workspaceId}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                userId,
                publicKey,
                deviceId
            })
        })
    
        return await request.json() as ApiResponse
    }

    async verify({ challenge, signature, userId, deviceId }: CreateChallengeResponse) {
        const request = await fetch(`${this.baseUrl}/${this.workspaceId}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                challenge,
                signature,
                userId,
                deviceId
            })
        })
    
        return await request.json() as ApiResponse
    }
}