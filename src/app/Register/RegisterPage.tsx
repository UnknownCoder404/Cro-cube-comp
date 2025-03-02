"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "react-query";
import styles from "./Register.module.css";
import { registerUser } from "../utils/users";
import { Loader } from "../components/Loader/Loader";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [group, setGroup] = useState<number>(1);
    const [message, setMessage] = useState("");

    const { mutate, isLoading } = useMutation(registerUser, {
        onSuccess: (data) => {
            if (data.success) {
                setMessage(`Korisnik ${username} je registriran!`);
            } else {
                setMessage(data.message || "Greška prilikom registracije");
            }
        },
        onError: () => {
            setMessage("Greška prilikom registracije");
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Basic validation
        if (!username || !password) {
            setMessage("Ime i lozinka su obavezni");
            return;
        }
        mutate({ username, password, group });
    };

    return (
        <main className={styles["form-container"]}>
            <form
                id="registerForm"
                onSubmit={handleSubmit}
                className={styles["register-form"]}
            >
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Korisničko ime"
                    className={styles["username-input"]}
                    autoCapitalize="words"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Lozinka"
                    className={styles["password-input"]}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className={styles["groups-container"]}>
                    <div className={styles["group-container"]}>
                        <label htmlFor="group-1">Grupa 1</label>
                        <input
                            checked={group === 1}
                            type="radio"
                            id="group-1"
                            name="group"
                            className={styles["radio-input"]}
                            value="1"
                            onChange={(e) => setGroup(parseInt(e.target.value))}
                        />
                    </div>
                    <div className={styles["group-container"]}>
                        <label htmlFor="group-2">Grupa 2</label>
                        <input
                            checked={group === 2}
                            type="radio"
                            id="group-2"
                            name="group"
                            className={styles["radio-input"]}
                            value="2"
                            onChange={(e) => setGroup(parseInt(e.target.value))}
                        />
                    </div>
                </div>
                <button
                    className={styles["submit-btn"]}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader /> : "Registriraj"}
                </button>
                <div className={styles["message-container"]}>
                    <p className={styles["message"]}>{message}</p>
                </div>
            </form>
        </main>
    );
}
