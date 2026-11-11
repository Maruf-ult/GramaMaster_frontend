import { LoginResponseRequest } from "@/types/auth";
import { tokenStorage } from "../auth/token-storage";
import { apiEndpoints } from "./endpoints";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let refreashPromise: Promise<string | null> | null = null;

async function refreashAccessToken(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken();
    const accessToken = tokenStorage.getAccessToken();

    if (!refreshToken || !accessToken) {
        tokenStorage.clearSession();
        return null;
    }

    try {
        const res = await fetch(`${API_BASE_URL}${apiEndpoints.auth.refreshToken}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken, refreshToken }),
        });

        if (!res.ok) {
            tokenStorage.clearSession();
            return null;
        }
        const json = await res.json();
        const data: LoginResponseRequest = json.data ?? json;

        if (data?.accessToken) {
            tokenStorage.setSession(data);
            return data.accessToken;
        }
        tokenStorage.clearSession();
        return null;
    } catch (error) {
        console.error("Token refresh failed:", error);
        return null;
    } finally {
        isRefreshing = false;
        refreashPromise = null;
    }




}

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = tokenStorage.getAccessToken();

    const headers = new Headers(options.headers || {});

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const isFormData = options.body instanceof FormData;

    if (!isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreashPromise = refreashAccessToken();
        }

        const newToken = await refreashPromise;
        if (newToken) {
            headers.set("Authorization", `Bearer ${newToken}`);
            response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });
        } else {

            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
                window.location.href = "/login";
            }
            throw new Error("Session expired. Please log in again.");
        }
    }
    if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;
        try {
            const errorJson = await response.json();
            errorMessage =
                errorJson.message ||
                errorJson.errors?.join(", ") ||
                errorMessage;
        } catch {

        }
        throw new Error(errorMessage);
    }
    return response.json() as Promise<T>;
}