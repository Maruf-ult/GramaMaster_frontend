import { LoginResponseRequest, UserRole } from "@/types/auth";

const ACCESS_TOKEN_KEY = "gm_access_token";
const REFRESH_TOKEN_KEY = "gm_refresh_token";
const USER_KEY = "gm_user";


export interface StoredUser {
    userId: string;
    fullName: string;
    email: string;
    profileImageUrl?: string;
    role: UserRole;
}

export const tokenStorage = {
    getAccessToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },
    getUser(): StoredUser | null {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as StoredUser;
        } catch {
            return null;
        }
    },

    setSession(data: LoginResponseRequest): void {
        if (typeof window === "undefined") return;

        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

        const user: StoredUser = {
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            profileImageUrl: data.profileImageUrl,
            role: data.role,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        document.cookie = `${ACCESS_TOKEN_KEY}=${data.accessToken}; path=/; max-age=7200; SameSite=Lax`;
        document.cookie = `gm_role=${data.role}; path=/; max_age=7200; SameSite=Lax`;
    },

    clearSession(): void {
        if (typeof window === "undefined") return;

        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        document.cookie = `${ACCESS_TOKEN_KEY}=; path/; max_age=0; SameSite=Lax`;
        document.cookie = `gm_role=; path=/; max_age=0; SameSite=Lax`;
    },

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    },
};
