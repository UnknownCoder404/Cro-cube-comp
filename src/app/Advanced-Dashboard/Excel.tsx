import { useEffect, useState } from "react";
import { CompetitionType, Users } from "../Types/solve";
import styles from "./AdvancedDashboard.module.css";
import { addToken } from "../utils/credentials";
import { url } from "@/globals";

function ResultsBtn({
  competition,
  setLoading,
}: {
  competition: CompetitionType | undefined;
  setLoading: (arg0: boolean) => void;
}) {
  if (!competition) return <></>;
  const [results, setResults] = useState<Blob | undefined>(undefined);
  const resultsStyles = styles["results"];
  useEffect(() => {
    setResults(undefined);
    const getResults = async () => {
      setLoading(true);
      const results = await getResultsForCompById(competition._id);
      setResults(results);
      setLoading(false);
    };
    getResults();
  }, [competition]);
  if (!results) return <button className={resultsStyles}>Učitavanje...</button>;
  return (
    <button
      className={resultsStyles}
      onClick={() => {
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

async function getFile(url: string): Promise<Blob> {
  if (!url) throw new Error("URL or fileName is not defined");
  const data = await fetch(url, {
    headers: addToken({}) || {},
  });
  const blob = await data.blob();
  return blob;
}

const resultsCache: Record<string, Blob> = {}; // Cache object

async function getResultsForCompById(id: string) {
  // Check if the results are already cached
  if (resultsCache[id]) {
    return resultsCache[id];
  }

  // If not cached, fetch the results
  const resultsUrl = new URL(url);
  resultsUrl.pathname = "results";
  resultsUrl.searchParams.set("competitionId", id);

  const file = await getFile(resultsUrl.toString());

  // Store the fetched results in the cache
  resultsCache[id] = file;

  return file;
}

function CompSelect({
  competitions,
  setSelectedCompetition,
  disabled,
}: {
  competitions: CompetitionType[];
  setSelectedCompetition: (arg0: CompetitionType) => void;
  disabled: boolean;
}) {
  return (
    <select
      disabled={disabled}
      className={styles["competition-select"]}
      onChange={(e) =>
        setSelectedCompetition(
          competitions.find((c) => c._id === e.target.value)!,
        )
      }
    >
      {competitions.map((comp) => {
        return (
          <option value={comp._id} key={comp._id}>
            {comp.name}
          </option>
        );
      })}
    </select>
  );
}

export default function Excel({
  competitions,
  users,
}: {
  competitions: CompetitionType[];
  users: Users;
}) {
  const [selectedCompetition, setSelectedCompetition] = useState<
    CompetitionType | undefined
  >(competitions[0]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles["excel-options-container"]}>
      <h2>Excel</h2>
      <CompSelect
        competitions={competitions}
        setSelectedCompetition={setSelectedCompetition}
        disabled={loading}
      />
      <ResultsBtn setLoading={setLoading} competition={selectedCompetition} />
    </div>
  );
}
