import { url } from "@/globals";
import { addToken, getId, getToken } from "./credentials";
import { AllowedEvents, Users } from "../Types/solve";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    response?: Response;
    message?: string;
};

type DeleteUserByIdParams = { id: string };
type AssignAdminToUserParams = { id: string };
type AddSolveParams = {
    userId: string;
    competitionId: string;
    event: string;
    roundIndex: number;
    solves: number[];
};
type DeleteSolveParams = {
    userId: string;
    competitionId: string;
    eventName: AllowedEvents;
    roundIndex: number;
    solveIndex: number;
};
type ChangePasswordParams = {
    username: string;
    newPassword: string;
};
type RegisterUserParams = {
    username: string;
    password: string;
    group: number;
};

/**
 * Delete a user by ID
 */
export async function deleteUserById({
    id,
}: DeleteUserByIdParams): Promise<ApiResponse<{ message?: string }>> {
    if (id === getId()) {
        return {
            success: false,
            message: "Nedopušteno brisanje vlastitog računa.",
        };
    }
    try {
        const userDeletionUrl = new URL(url);
        userDeletionUrl.pathname = `users/${id}`;
        const response = await fetch(userDeletionUrl, {
            method: "DELETE",
            headers: addToken({}) || {},
            credentials: "include",
        });
        const data = await response.json();

        return {
            success: response.ok,
            data,
            response,
            message: response.ok
                ? undefined
                : "Greška prilikom brisanja korisnika.",
        };
    } catch (error) {
        console.error(`Error deleting user: \n${error}`);
        return { success: false };
    }
}

/**
 * Assign admin role to a user
 */
export async function assignAdminToUser({
    id,
}: AssignAdminToUserParams): Promise<ApiResponse<{ message?: string }>> {
    try {
        const adminAssignmentUrl = new URL(url);
        adminAssignmentUrl.pathname = `admin/assign/${id}`;
        const response = await fetch(adminAssignmentUrl, {
            method: "POST",
            headers: addToken({}) || {},
        });
        const data = await response.json();

        return {
            success: response.ok,
            data,
            message: response.ok ? undefined : data.message,
        };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

/**
 * Add a solve for a user
 */
export async function addSolve({
    userId,
    competitionId,
    event,
    roundIndex,
    solves,
}: AddSolveParams): Promise<ApiResponse<{ message?: string }>> {
    try {
        const solvesUrl = new URL(url);
        solvesUrl.pathname = `solves/add/${userId}`;
        const response = await fetch(solvesUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: getToken() || "",
            },
            body: JSON.stringify({
                round: roundIndex + 1,
                solves: { event, rounds: solves },
                competitionId,
            }),
        });
        const data = await response.json();

        return {
            success: response.ok,
            data,
            response,
        };
    } catch (error) {
        console.error("Error adding solve: \n", error);
        return { success: false };
    }
}

/**
 * Delete a specific solve for a user
 */
export async function deleteSolve({
    userId,
    competitionId,
    eventName,
    roundIndex,
    solveIndex,
}: DeleteSolveParams): Promise<ApiResponse<{ message?: string }>> {
    try {
        const solvesUrl = new URL(url);
        solvesUrl.pathname = `solves/delete/${userId}`;
        const response = await fetch(solvesUrl, {
            method: "DELETE",
            headers: addToken({ "Content-Type": "application/json" }) || {},
            body: JSON.stringify({
                round: roundIndex + 1,
                solve: solveIndex + 1,
                event: eventName,
                competitionId,
            }),
            credentials: "include",
        });
        const data = await response.json();

        return {
            success: response.ok,
            data,
            response,
        };
    } catch (error) {
        console.error("Error deleting solve: \n", error);
        return { success: false };
    }
}

/**
 * Change password for a user by username
 */
export async function changePasswordByUsername({
    username,
    newPassword,
}: ChangePasswordParams): Promise<ApiResponse<{ message?: string }>> {
    try {
        const changePasswordUrl = new URL(url);
        changePasswordUrl.pathname = "users/change-password";
        const response = await fetch(changePasswordUrl, {
            method: "POST",
            headers: addToken({ "Content-Type": "application/json" }) || {},
            body: JSON.stringify({ username, newPassword }),
            credentials: "include",
        });
        const data = await response.json();

        return {
            success: response.ok,
            data,
            response,
        };
    } catch (error) {
        console.error("Error changing password: \n", error);
        return { success: false };
    }
}

/**
 * Get all users
 */
export async function getUsers(): Promise<
    | { success: false; error: unknown }
    | { parsed: Users; success: boolean; status: number }
> {
    try {
        const usersUrl = new URL(url);
        usersUrl.pathname = "users";
        const response = await fetch(usersUrl, {
            signal: AbortSignal.timeout(5000),
        });
        const data = (await response.json()) as Users;

        return {
            parsed: data,
            success: response.ok,
            status: response.status,
        };
    } catch (error) {
        console.error("Error fetching users: \n", error);
        return { success: false, error };
    }
}

/**
 * Register a new user
 */
export async function registerUser({
    username,
    password,
    group,
}: RegisterUserParams): Promise<
    ApiResponse<{
        message?: string;
        registeredUser?: { username: string; password: string; group: number };
    }>
> {
    try {
        const registerUrl = new URL(url);
        registerUrl.pathname = "register";
        const response = await fetch(registerUrl, {
            method: "POST",
            headers: addToken({ "Content-Type": "application/json" }) || {},
            body: JSON.stringify({ username, password, group }),
            signal: AbortSignal.timeout(5000),
            credentials: "include",
        });
        const data = await response.json();

        return {
            success: response.ok,
            data,
            message: data.message,
        };
    } catch (error) {
        console.error("Error registering user: \n", error);
        return { success: false };
    }
}
