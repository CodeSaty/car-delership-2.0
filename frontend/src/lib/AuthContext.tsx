"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, AuthUser, clearAuthCredentials } from "@/lib/api";

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isManager: boolean;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    login: async () => { },
    logout: () => { },
    isManager: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const stored = sessionStorage.getItem("aura_auth");
        if (stored) {
            api.getMe()
                .then(setUser)
                .catch(() => { clearAuthCredentials(); })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    async function login(username: string, password: string) {
        const userData = await api.login(username, password);
        setUser(userData);
    }

    function logout() {
        clearAuthCredentials();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isManager: user?.role === "manager" }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;
