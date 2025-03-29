"use client";

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CompetitionType } from "../Types/solve";
import styles from "./AdvancedDashboard.module.css";
import { url } from "@/globals";
import Select, { Props as SelectProps } from "react-select";

type ResultsBtnProps = {
    competition: CompetitionType | undefined;
    setLoading: (arg0: boolean) => void;
    setError: (arg0: boolean) => void;
};

type CompSelectProps = {
    competitions: CompetitionType[];
    setSelectedCompetition: (arg0: CompetitionType) => void;
    disabled: boolean;
} & Omit<SelectProps, "options" | "onChange" | "isDisabled" | "defaultValue">; // Extend SelectProps and omit conflicting props

const getResultsForCompById = async (id: string): Promise<Blob> => {
    const resultsUrl = new URL(url);
    resultsUrl.pathname = `competitions/${id}/results`;

    const data = await fetch(resultsUrl.toString(), {
        credentials: "include",
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
    setSelectedCompetition,
    disabled,
    ...rest // Receive other props
}: CompSelectProps) {
    const competitionsAsOptions = competitions.map((competition) => ({
        value: competition._id,
        label: competition.name,
    }));
    return (
        <Select
            isDisabled={disabled}
            isLoading={disabled}
            options={competitionsAsOptions}
            defaultValue={competitionsAsOptions[0]}
            instanceId="prefix"
            onChange={(e) => {
                // Handle null/undefined e
                // @ts-expect-error We will fix this later, react-select is not typed correctly
                if (e && e.value) {
                    const selectedComp = competitions.find(
                        // @ts-expect-error We will fix this later, react-select is not typed correctly
                        (c) => c._id === e.value,
                    );
                    if (selectedComp) {
                        setSelectedCompetition(selectedComp);
                    }
                }
            }}
            {...rest} // Pass down other props
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
                        setSelectedCompetition={setSelectedCompetition}
                        disabled={loading}
                        className={styles["competition-select"]}
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
