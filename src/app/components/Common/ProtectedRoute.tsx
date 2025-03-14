"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { tokenValid } from "@/app/utils/credentials";

type Props = {
    redirectTo?: string; // Optional redirection URL
    require: "admin" | "loggedin" | "loggedout";
    validateToken?: boolean;
    children: React.ReactNode;
};

export default function ProtectedRoute({
    require,
    redirectTo,
    validateToken,
    children,
}: Props) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null indicates "loading"
    const { role, token, logOut } = useAuth();
    const isLoggedIn = !!token; //Much better way to check if logged in

    useEffect(() => {
        const validateAccess = async () => {
            try {
                // If token needs validation, check if it's valid
                if (validateToken) {
                    const isTokenValid = await tokenValid();
                    // If token is invalid and user does not need to be logged out, redirect
                    if (!isTokenValid && require !== "loggedout") {
                        logOut(); // Log out so the old token is not valid anymore
                        handleRedirect();
                        return;
                    }
                    // If user has to be logged out, and user is logged in, log them out
                    if (
                        require === "loggedout" &&
                        !isTokenValid &&
                        isLoggedIn
                    ) {
                        // User has invalid token, but is logged in locally
                        logOut();
                        return;
                    }
                }

                // Check for other cases
                if (
                    (require === "loggedin" && !isLoggedIn) ||
                    (require === "admin" && role !== "admin") || // Simplified admin check
                    (require === "loggedout" && isLoggedIn) // Simplified loggedout
                ) {
                    handleRedirect();
                    return;
                }

                setIsAuthorized(true); // User is authorized
            } catch (error) {
                console.error("Error during validation:", error);
                handleRedirect(); // Redirect on error
            }
        };

        const handleRedirect = () => {
            if (redirectTo) {
                router.push(redirectTo);
            } else {
                setIsAuthorized(false); // Deny access without redirect
            }
        };

        validateAccess();
    }, [require, validateToken, redirectTo, router, isLoggedIn, role, logOut]);

    if (isAuthorized === null) {
        return null; // Hide content while loading
    }

    if (!isAuthorized) {
        return null; // Hide content for unauthorized users.
    }

    return <>{children}</>; // Render protected content
}
