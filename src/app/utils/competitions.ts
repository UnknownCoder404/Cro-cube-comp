import { url } from "@/globals";
import { CompetitionResultsType, CompetitionType } from "../Types/solve";
import { addToken } from "./credentials";
import { withTimeout } from "./helpers/withTimeout";

const TIMEOUT_DURATION = 5000; // Timeout in milliseconds

export async function getCompetitions(): Promise<
    | {
          success: false;
          error: unknown;
      }
    | {
          success: true;
          parsed: CompetitionType[];
      }
> {
    try {
        const competitionsUrl = new URL(url);
        competitionsUrl.pathname = "competitions";
        const data = await withTimeout(
            fetch(competitionsUrl),
            TIMEOUT_DURATION,
        );
        if (!data.ok)
            throw new Error(
                `Failed to fetch competitions. Status: ${data.status}`,
            );
        const parsedJSON = await data.json();
        return { success: true, parsed: parsedJSON };
    } catch (error: unknown) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}

export async function getResults(): Promise<
    | { success: false; error: unknown }
    | { parsed: CompetitionResultsType; success: true; status: number }
> {
    const resultsUrl = new URL(url);
    resultsUrl.pathname = "competitions/results";
    try {
        const data = await withTimeout(
            fetch(resultsUrl, {
                cache: "no-store",
                credentials: "include",
            }),
            TIMEOUT_DURATION,
        );
        const parsedJSON = await data.json();
        return {
            parsed: parsedJSON,
            success: true,
            status: data.status,
        };
    } catch (error) {
        return {
            success: false,
            error,
        };
    }
}

export async function createCompetition(
    name: string,
    date: string,
    events: {
        name: string;
        rounds: number;
    }[],
) {
    const headers = addToken({ "Content-Type": "application/json" }) || {};
    const compCreationUrl = new URL(url);
    compCreationUrl.pathname = "competitions/create";

    try {
        const response = await withTimeout(
            fetch(compCreationUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ name, date, events }),
                credentials: "include",
            }),
            TIMEOUT_DURATION,
        );
        const parsedData = await response.json();
        return {
            status: response.status,
            success: response.ok,
            parsed: parsedData,
        };
    } catch (error: unknown) {
        return {
            status: 500,
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}

export async function deleteCompetition(id: string) {
    const deleteCompUrl = new URL(url);
    deleteCompUrl.pathname = `competitions/${id}`;
    const headers = addToken({ "Content-Type": "application/json" }) || {};

    try {
        const response = await withTimeout(
            fetch(deleteCompUrl, {
                method: "DELETE",
                headers: headers,
                credentials: "include",
            }),
            TIMEOUT_DURATION,
        );
        return {
            status: response.status,
            success: response.ok,
            parsed: await response.json(),
        };
    } catch (error: unknown) {
        return {
            status: 500,
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}

export async function lockCompetition(id: string) {
    const lockUrl = new URL(url);
    lockUrl.pathname = `competitions/${id}/lock`;
    const headers = addToken({ "Content-Type": "application/json" }) || {};

    try {
        const response = await withTimeout(
            fetch(lockUrl, {
                method: "POST",
                headers: headers,
                credentials: "include",
            }),
            TIMEOUT_DURATION,
        );
        return {
            status: response.status,
            success: response.ok,
            parsed: await response.json(),
        };
    } catch (error: unknown) {
        return {
            status: 500,
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}

export async function editCompetition(
    id: string,
    name: string,
    date: string,
    events: { name: string; rounds: number }[],
) {
    const editCompUrl = new URL(url);
    editCompUrl.pathname = `competitions/${id}`;
    const headers = addToken({ "Content-Type": "application/json" }) || {};

    try {
        const response = await withTimeout(
            fetch(editCompUrl, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify({ name, date, events }),
                credentials: "include",
            }),
            TIMEOUT_DURATION,
        );
        return {
            status: response.status,
            success: response.ok,
            parsed: await response.json(),
        };
    } catch (error: unknown) {
        return {
            status: 500,
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}
