"use client";
import { VercelToolbar } from "@vercel/toolbar/next";
import { isAdmin } from "../utils/credentials";
import { useAuth } from "../context/AuthContext";

// Show the Vercel toolbar only for admin users
export function AdminToolbar() {
    const { role } = useAuth();
    const isUserAdmin = role && isAdmin(role);
    return isUserAdmin ? <VercelToolbar /> : null;
}
