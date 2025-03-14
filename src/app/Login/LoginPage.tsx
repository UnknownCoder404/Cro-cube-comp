"use client";

import styles from "./Login.module.css";
import { url } from "@/globals";
import { Dispatch, SetStateAction, useState } from "react";
import { Loader } from "../components/Loader/Loader";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { clsx } from "clsx";
import { useAuth } from "@/app/context/AuthContext"; // Import useAuth
import { Role } from "../utils/credentials";

async function handleSubmit(
    username: string,
    password: string,
    setMsg: Dispatch<SetStateAction<string>>,
    router: AppRouterInstance,
    login: (username: string, role: Role, userId: string) => void,
    setLoading: (isLoading: boolean) => void,
) {
    setLoading(true); // Set loading to true when the submission starts.

    try {
        const loginUrl = new URL(url);
        loginUrl.pathname = "/login";

        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        });

        const data = await response.json();

        if (response.status === 429) {
            setMsg(
                "Prekoračen je broj pokušaja. Pokušajte ponovno za par minuta.",
            );
            return;
        }

        if (response.status === 401) {
            setMsg("Netočno korisničko ime ili lozinka.");
            return;
        }

        if (!response.ok) {
            setMsg(`Došlo je do greške: ${response.statusText}`);
            return;
        }

        if (!data.info) {
            setMsg("Neočekivani odgovor od servera.");
            return;
        }

        const { id, username: responseUsername, role } = data.info;

        // Use context's login function instead of localStorage
        login(responseUsername, role, id);

        // Redirect based on role
        setTimeout(
            () => router.push(role === "admin" ? "/Dashboard" : "/"),
            1000,
        );
    } catch (error) {
        setMsg(
            `Greška prilikom prijave: ${
                error instanceof Error ? error.message : "Nepoznata greška"
            }`,
        );
        console.error(error);
    } finally {
        setLoading(false); // Ensure loading is set back to false.
    }
}

function ErrorMessage({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div className={styles["message-container"]}>
            <p className={clsx(styles["message"], styles["error"])}>
                {message}
            </p>
        </div>
    );
}

function LoginButton({
    loading,
    disabled,
}: {
    loading: boolean;
    disabled: boolean;
}) {
    return (
        <button
            className={clsx(styles["submit-btn"], {
                [styles.loading]: loading,
                [styles.disabled]: disabled,
            })}
            type="submit"
            disabled={disabled}
        >
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Loader />
                </div>
            ) : (
                "Prijava"
            )}
        </button>
    );
}

function LoginForm() {
    const router = useRouter();
    const { login } = useAuth(); // Get login function from context
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const isFormValid = username.trim() && password.trim();
    const isButtonDisabled = !isFormValid || isLoading;

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(""); // Clear previous message on new submission attempt.
        await handleSubmit(
            username,
            password,
            setMessage,
            router,
            login,
            setLoading,
        );
    };

    return (
        <form onSubmit={handleFormSubmit} id="login-form">
            <input
                autoComplete="username"
                type="text"
                id="username"
                name="username"
                placeholder="Korisničko ime"
                className={styles["username-input"]}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
            />
            <br />
            <input
                autoComplete="current-password"
                type="password"
                id="password"
                name="password"
                placeholder="Lozinka"
                className={styles["password-input"]}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <LoginButton loading={isLoading} disabled={isButtonDisabled} />
            <ErrorMessage message={message} />
        </form>
    );
}

export default function LoginPage() {
    return (
        <main className={styles["form-container"]}>
            <LoginForm />
        </main>
    );
}
