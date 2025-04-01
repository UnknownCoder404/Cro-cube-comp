"use client";
import { useState, useEffect } from "react";
import UserButtons from "../components/Dashboard/UserButtons";
import dynamic from "next/dynamic";
import { CompetitionType, User } from "../Types/solve";

const UserCompetition = dynamic(
    () => import("../components/Dashboard/UserCompetition"),
    { ssr: false },
);

export default function UserCompAndButtons({
    user,
    competitions,
}: {
    user: User;
    competitions: CompetitionType[];
}) {
    const [showComp, setCompVisibility] = useState(false);

    function toggleCompVisibility() {
        setCompVisibility(!showComp);
    }

    return (
        <section aria-labelledby="user-competitions">
            <UserButtons
                toggleCompVisibility={toggleCompVisibility}
                user={user}
                aria-label="User action buttons"
            />
            <UserCompetition
                show={showComp}
                user={user}
                competitions={competitions}
                aria-labelledby="user-competitions"
            />
        </section>
    );
}
