"use client";

import { useState } from "react";
import { User, Users } from "../Types/solve";
import styles from "./AdvancedDashboard.module.css";
import UserSelect from "./UserSelect";
import { changePasswordById } from "../utils/users";

export function ChangePasswordForm({ users }: { users: Users }) {
    const [selectedUserToChangePassword, setSelectedUserToChangePassword] =
        useState<User>(users[0]);
    const [newPassword, setPassword] = useState<string>("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword.trim()) {
            setMessage("Nova lozinka ne može biti prazna.");
            return;
        }

        setMessage(""); // Clear previous messages
        setLoading(true);

        try {
            const passwordChange = await changePasswordById({
                id: selectedUserToChangePassword._id,
                newPassword,
            });

            if (passwordChange.success) {
                setMessage("Lozinka je uspješno promijenjena.");
                setPassword(""); // Clear password on success
            } else {
                setMessage(
                    passwordChange.data?.message ||
                        "Greška prilikom promjene lozinke.",
                );
            }
        } catch (error) {
            console.error(error);
            setMessage("Došlo je do greške. Pokušajte ponovo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className={styles["change-password-form"]}
            onSubmit={handlePasswordChange}
        >
            <h2>Promjena lozinke</h2>
            <div className={styles["change-password-credentials"]}>
                <UserSelect
                    users={users}
                    setSelectedUser={setSelectedUserToChangePassword}
                    disabled={loading}
                    className={styles["user-select"]}
                />
                <div className={styles["password-input-container"]}>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={newPassword}
                        type="text"
                        placeholder="Nova lozinka"
                        className={styles["new-password"]}
                        disabled={loading}
                    />
                </div>
            </div>
            <button
                className={styles["change-password-btn"]}
                disabled={loading || !newPassword.trim()}
            >
                {loading ? "Učitavanje..." : "Promijeni lozinku"}
            </button>
            {message && <p className={styles["message"]}>{message}</p>}
        </form>
    );
}
