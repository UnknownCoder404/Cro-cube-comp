// Server component
import { url } from "@/globals";
import Competitions from "./Competitions";
import { CompetitionResultsType } from "../Types/solve";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rezultati - Cro Cube Comp",
    description: "Rezultati za Cro Cube Comp natjecanja",
    keywords: ["Cro Cube Comp", "Rezultati"],
};

async function getResults(): Promise<
    | { success: false }
    | { parsed: CompetitionResultsType; success: true; status: number }
> {
    try {
        const data = await fetch(`${url.toString()}competitions/results`);
        const parsedJSON = await data.json();
        return {
            parsed: parsedJSON,
            success: data.ok,
            status: data.status,
        };
    } catch {
        return {
            success: false,
        };
    }
}
export default async function CompetitionsPage() {
    const competitions = await getResults();

    if (!competitions.success) {
        return <p>Nemoguće dohvatiti rezultate</p>;
    }
    return <Competitions competitions={competitions} />;
}
