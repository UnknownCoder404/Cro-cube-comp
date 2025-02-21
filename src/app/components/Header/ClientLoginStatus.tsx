"use client";

import Link from "next/link";
import headerStyles from "./Header.module.css";
import { getUsername, logOut } from "@/app/utils/credentials";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import AccountCircleSvg from "../Svg/account_circle";

function ClientLoginStatus() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const loggedIn = !!username;

    useEffect(() => {
        const syncUsername = () => {
            setUsername(getUsername());
        };

        setUsername(getUsername());
        setLoaded(true);

        window.addEventListener("storage", syncUsername); // Listen for changes in storage
        return () => {
            window.removeEventListener("storage", syncUsername);
        };
    }, []);

    if (!loaded) {
        return <div className={headerStyles["account-container"]}></div>;
    }

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
                        logOut();
                        setUsername(null);
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
