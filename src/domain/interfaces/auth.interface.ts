export interface SignInResponse {
    message: string;
    has_totp: boolean;
    session_token: string;
    user: {
        id: number;
        nickname: string;
        email: string;
        role?: string;
    };
}

export interface SignOutResponse {
    status: number;
    message: string;
}

