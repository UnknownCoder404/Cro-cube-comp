import { url } from "@/globals";

function getUsername(): string | null {
    if (typeof window === "undefined") return null;
    const username = localStorage.getItem("username");
    return username;
}
export type Role = "admin" | "user";
// Type guard function to check if an object is a Role
function isRole(str: string | null): str is Role {
    return !!str && typeof str === "string";
}
function getRole(): Role | null {
    if (typeof window === "undefined") return null;
    const role = localStorage.getItem("role");
    if (isRole(role)) {
        return role;
    }
    return null;
}

function getId(): string | null {
    if (typeof window === "undefined") return null;
    const id = localStorage.getItem("id");
    return id;
}
function getToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    return token;
}
async function tokenValid(): Promise<boolean> {
    const sessionUrl = new URL(url);
    sessionUrl.pathname = "session";

    const response = await fetch(sessionUrl, {
        method: "GET",
        credentials: "include",
    });

    return response.ok;
}
function loggedIn(): boolean {
    return !!getRole() && !!getId();
}

function isUser(role: Role): boolean {
    return role.toUpperCase() === "USER";
}
function isAdmin(role: Role): boolean {
    return role.toUpperCase() === "ADMIN";
}

export {
    getUsername,
    getRole,
    getId,
    getToken,
    tokenValid,
    loggedIn,
    isUser,
    isAdmin,
};
