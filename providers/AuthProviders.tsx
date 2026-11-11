"use client"

import { StoredUser, tokenStorage } from "@/lib/auth/token-storage"
import { LoginResponseRequest, UserRole } from "@/types/auth";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
    user: StoredUser | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginResponseRequest) => void;
    logout: () => void;
    updateUser: (updatedUser: Partial<StoredUser>) => void;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<StoredUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedUser = tokenStorage.getUser();
        const token = tokenStorage.getAccessToken();

        if (token && savedUser) {
            setUser(savedUser);
        }
        setIsLoading(false);
    }, [])

    const login = (data: LoginResponseRequest) => {
        tokenStorage.setSession(data);
        const currentUser: StoredUser = {
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            profileImageUrl: data.profileImageUrl,
            role: data.role,
        };
        setUser(currentUser);

        if (data.role === "Student") {
            router.push("/student/dashboard");
        } else if (data.role === "Teacher") {
            router.push("/teacher/dashboard");
        } else if (data.role === "Admin") {
            router.push("/admin/dashboard");
        }
    };

    const logout = () => {
        tokenStorage.clearSession();
        setUser(null);
        router.push("/login");
    };

    const updateUser = (updatedFields: Partial<StoredUser>) => {
        if (!user) return;
        const updated = { ...user, ...updatedFields };
        setUser(updated);
        localStorage.setItem("gm_user", JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, role: user?.role ?? null, isAuthenticated: !!user, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
