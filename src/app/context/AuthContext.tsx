"use client";

import { Role } from "../utils/credentials";
import { createContext, useContext, useEffect, useState } from "react";

export type AuthContextType = {
    token: string | null;
    username: string | null;
    role: Role | null;
    userId: string | null;
    login: (
        token: string,
        username: string,
        role: Role,
        userId: string,
    ) => void;
    logOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Initialize from localStorage
        setToken(localStorage.getItem("token"));
        setUsername(localStorage.getItem("username"));
        setRole(localStorage.getItem("role") as Role | null);
        setUserId(localStorage.getItem("id"));
    }, []);

    const login = (
        token: string,
        username: string,
        role: Role,
        userId: string,
    ) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("id", userId);
        setToken(token);
        setUsername(username);
        setRole(role);
        setUserId(userId);
    };

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        setToken(null);
        setUsername(null);
        setRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider
            value={{ token, username, role, userId, login, logOut }}
        >
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
