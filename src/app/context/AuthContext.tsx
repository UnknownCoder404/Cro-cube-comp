"use client";

import { url } from "@/globals";
import { Role } from "../utils/credentials";
import { createContext, useContext, useEffect, useState } from "react";

export type AuthContextType = {
    username: string | null;
    role: Role | null;
    userId: string | null;
    login: (username: string, role: Role, userId: string) => void;
    logOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Initialize from localStorage
        setUsername(localStorage.getItem("username"));
        setRole(localStorage.getItem("role") as Role | null);
        setUserId(localStorage.getItem("id"));
    }, []);

    const login = (username: string, role: Role, userId: string) => {
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("id", userId);
        setUsername(username);
        setRole(role);
        setUserId(userId);
    };

    const logOut = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        setUsername(null);
        setRole(null);
        setUserId(null);

        const logOutUrl = new URL(url);
        logOutUrl.pathname = "session/logout";
        fetch(logOutUrl, {
            credentials: "include",
        });
    };

    return (
        <AuthContext.Provider value={{ username, role, userId, login, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
