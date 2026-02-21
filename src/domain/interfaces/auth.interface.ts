export interface SignInResponse {
    message: string;
    has_totp: boolean;
    session_token: string;
    user: {
        id: string;
        nickname: string;
        email: string;
        role?: string;
        access_role?: string;
    };
}

export interface SignOutResponse {
    status: number;
    message: string;
}

