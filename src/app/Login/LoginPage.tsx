"use client";
import loginStyles from "./Login.module.css";
import { url } from "@/globals";
import { Dispatch, SetStateAction, useState } from "react";
import { isAdmin } from "../utils/credentials";
import { Loader } from "../components/Loader/Loader";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { clsx } from "clsx";

async function handleSubmit(
    username: string,
    password: string,
    setMsg: Dispatch<SetStateAction<string>>,
    router: AppRouterInstance,
) {
    try {
        const loginUrl = new URL(url);
        loginUrl.pathname = "/login";

        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.status === 429) {
            setMsg(
                "Prekoračen je broj pokušaja. Pokušajte ponovo za par minuta.",
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

        const { id, token, username: responseUsername, role } = data.info;
        localStorage.setItem("id", id);
        localStorage.setItem("token", token);
        localStorage.setItem("username", responseUsername);
        localStorage.setItem("role", role);

        window.dispatchEvent(new Event("storage"));

        isAdmin(role) ? router.push("/Dashboard") : router.push("/");
    } catch (error) {
        setMsg(
            `Greška prilikom prijave: ${
                error instanceof Error ? error.message : "Nepoznata greška"
            }`,
        );
        console.error(error);
    }
}

function ErrorMessage({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div id="message">
            <p>{message}</p>
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
            className={clsx(loginStyles["submit-btn"], {
                [loginStyles.loading]: loading,
                [loginStyles.disabled]: disabled,
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
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const isFormValid = username.trim() && password.trim();
    const isButtonDisabled = !isFormValid || isLoading;

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");
        setLoading(true);
        try {
            await handleSubmit(username, password, setMessage, router);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} id="login-form">
            <input
                autoComplete="username"
                type="text"
                id="username"
                name="username"
                placeholder="Korisničko ime"
                className={loginStyles["username-input"]}
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
                className={loginStyles["password-input"]}
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
        <main className={loginStyles["form-container"]}>
            <LoginForm />
        </main>
    );
}
