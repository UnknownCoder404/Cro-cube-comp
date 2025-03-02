"use client";

import { useState } from "react";
import { Result } from "../Types/solve";
import CompetitionStyles from "./Competitions.module.css";
import ShowAndHide from "../components/Competitions/showAndHide";
import dynamic from "next/dynamic";
import { Loader } from "../components/Loader/Loader";
import { clsx } from "clsx";

const GroupResults = dynamic(() => import("./GroupResults"), {
    ssr: false,
    loading: () => <LoadingGroup />,
});

function LoadingGroup() {
    return (
        <div className={CompetitionStyles["group-loader"]}>
            <Loader />
        </div>
    );
}

type Props = {
    group: Result[][];
    groupNumber: number;
};

export default function Group({ group, groupNumber }: Props) {
    const [areGroupResultsShown, setGroupResultsVisibility] = useState(true);
    const [roundVisibilities, setRoundVisibilities] = useState<boolean[]>(
        group.map(() => false), // Default to false (hidden) for each round
    );

    function toggleGroupResultsVisibility() {
        setGroupResultsVisibility(!areGroupResultsShown);
    }

    function toggleRoundVisibility(index: number) {
        setRoundVisibilities((prevVisibilities) => {
            const newVisibilities = [...prevVisibilities];
            newVisibilities[index] = !newVisibilities[index];
            return newVisibilities;
        });
    }

    const groupIndex = groupNumber - 1;

    return (
        <section
            className={clsx(CompetitionStyles["group"], {
                [CompetitionStyles["no-gap"]]: !areGroupResultsShown,
            })} // Apply the no-gap class when group results are hidden
            id={`group-${groupIndex}`}
            aria-labelledby={`group-title-${groupIndex}`}
        >
            <div className={CompetitionStyles["group-title-container"]}>
                <h4
                    id={`group-title-${groupIndex}`}
                    className={CompetitionStyles["group-title"]}
                >
                    Grupa {groupNumber}
                </h4>
                <ShowAndHide
                    show={areGroupResultsShown}
                    toggleVisibility={toggleGroupResultsVisibility}
                />
            </div>

            <GroupResults
                roundVisibilities={roundVisibilities}
                areGroupResultsShown={areGroupResultsShown}
                group={group}
                toggleRoundVisibility={toggleRoundVisibility}
            />
        </section>
    );
}
