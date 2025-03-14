"use client";

import Link from "next/link";
import headerStyles from "./Header.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import AccountCircleSvg from "../Svg/account_circle";

function ClientLoginStatus() {
    const router = useRouter();
    const { username, logout } = useAuth(); // Use useAuth hook
    const loggedIn = !!username;

    return (
        <header className={headerStyles["account-container"]}>
            <h2 className={headerStyles["log-in"]}>
                {username ? username : <Link href="/Login">Prijava</Link>}
            </h2>
            <AccountCircleSvg
                className={clsx(headerStyles["account-circle"], {
                    [headerStyles["logged-in"]]: loggedIn,
                })}
                width="24px"
                height="24px"
                fill="white"
                onClick={() => {
                    if (loggedIn) {
                        logout(); // Use logout from useAuth
                        router.refresh();
                    }
                }}
                role="button"
                tabIndex={0}
            />
        </header>
    );
}

export default ClientLoginStatus;
