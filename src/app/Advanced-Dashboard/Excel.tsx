"use client";

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CompetitionType } from "../Types/solve";
import styles from "./AdvancedDashboard.module.css";
import { addToken } from "../utils/credentials";
import { url } from "@/globals";
import { Select as MantineSelect } from "@mantine/core";

type ResultsBtnProps = {
    competition: CompetitionType | undefined;
    setLoading: (arg0: boolean) => void;
    setError: (arg0: boolean) => void;
};

type CompSelectProps = {
    competitions: CompetitionType[];
    selectedCompetition: CompetitionType | undefined;
    setSelectedCompetition: (arg0: CompetitionType) => void;
    disabled: boolean;
} & React.ComponentPropsWithoutRef<typeof MantineSelect>;

const getResultsForCompById = async (id: string): Promise<Blob> => {
    const resultsUrl = new URL(url);
    resultsUrl.pathname = "results";
    resultsUrl.searchParams.set("competitionId", id);

    const data = await fetch(resultsUrl.toString(), {
        headers: addToken({}) || {},
    });
    if (!data.ok) {
        throw new Error("Error fetching results");
    }
    return data.blob();
};

function ResultsBtn({ competition, setLoading, setError }: ResultsBtnProps) {
    const competitionId = competition?._id || "";

    const resultsQuery = useQuery(
        ["results", competitionId],
        () => getResultsForCompById(competitionId),
        {
            enabled: !!competitionId,
        },
    );

    const { data: results, isLoading, error } = resultsQuery;
    const resultsStyles = styles["results"];

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    if (!competition) return null;
    if (isLoading)
        return <button className={resultsStyles}>Učitavanje...</button>;
    if (error) setError(true);
    return (
        <button
            className={resultsStyles}
            onClick={() => {
                if (!results) return;
                const url = window.URL.createObjectURL(results);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${competition.name} - Rezultati.xlsx`;

                document.body.appendChild(a);
                a.click();
            }}
        >
            Rezultati
        </button>
    );
}

function CompSelect({
    competitions,
    selectedCompetition,
    setSelectedCompetition,
    disabled,
    ...rest
}: CompSelectProps) {
    // Map competitions to the data format required by Mantine's Select component
    const data = competitions.map((competition) => ({
        value: competition._id,
        label: competition.name,
    }));

    return (
        <MantineSelect
            disabled={disabled}
            data={data}
            // Use a controlled value based on the selected competition's id (or an empty string when not selected)
            value={selectedCompetition ? selectedCompetition._id : ""}
            onChange={(value: string | null) => {
                if (value) {
                    const selected = competitions.find((c) => c._id === value);
                    if (selected) {
                        setSelectedCompetition(selected);
                    }
                }
            }}
            {...rest}
        />
    );
}

export default function Excel({
    competitions,
}: {
    competitions: CompetitionType[];
}) {
    const [selectedCompetition, setSelectedCompetition] = useState<
        CompetitionType | undefined
    >(competitions[0]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    return (
        <div className={styles["excel-options-container"]}>
            <h2>Excel</h2>
            {error ? (
                <p>Greška prilikom učitavanja</p>
            ) : (
                <>
                    <CompSelect
                        competitions={competitions}
                        selectedCompetition={selectedCompetition}
                        setSelectedCompetition={setSelectedCompetition}
                        disabled={loading}
                        // className={styles["competition-select"]}
                        placeholder="Select competition"
                    />
                    <ResultsBtn
                        setLoading={setLoading}
                        competition={selectedCompetition}
                        setError={setError}
                    />
                </>
            )}
        </div>
    );
}
