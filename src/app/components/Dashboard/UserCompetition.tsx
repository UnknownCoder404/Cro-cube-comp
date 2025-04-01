import { useLayoutEffect, useState } from "react";
import clsx from "clsx";
import dashboardStyles from "@/app/Dashboard/Dashboard.module.css";
import Event from "./Event";
import { CompetitionType, User } from "@/app/Types/solve";
import { motion } from "framer-motion";

function saveSelectedCompetition(selectedCompetition: CompetitionType) {
    sessionStorage.setItem(
        "selectedCompetitionId",
        JSON.stringify(selectedCompetition._id),
    );
}

// CompetitionSelect component allows user to choose a competition from a list
function CompetitionSelect({
    setSelectedCompetition,
    competitions,
    selectedCompetition,
    show,
}: {
    setSelectedCompetition: (arg0: CompetitionType) => void;
    competitions: CompetitionType[];
    selectedCompetition: CompetitionType | undefined;
    show: boolean;
}) {
    if (!competitions) {
        return <p>Učitavanje...</p>; // Loading message in case competitions are not available
    }

    return (
        <section aria-labelledby="competition-select">
            <select
                aria-label="Izaberi natjecanje"
                className={clsx(dashboardStyles["select-comp"])}
                value={selectedCompetition?._id || ""}
                onChange={(e) => {
                    const selectedComp = competitions.find(
                        (c) => c._id === e.target.value,
                    )!;
                    setSelectedCompetition(selectedComp);
                    saveSelectedCompetition(selectedComp);
                }}
                tabIndex={show ? 0 : -1}
            >
                {competitions.map((competition: CompetitionType) => (
                    <option key={competition._id} value={competition._id}>
                        {competition.name}
                    </option>
                ))}
            </select>
        </section>
    );
}

// Component displaying competition details and events
function CompResults({
    user,
    selectedCompetition,
    show,
}: {
    user: User;
    selectedCompetition: CompetitionType | undefined;
    show: boolean;
}) {
    if (!selectedCompetition) {
        return <></>;
    }

    const compDate = new Date(selectedCompetition.date);
    const dateString = compDate.toLocaleString();

    return (
        <article
            className={clsx(dashboardStyles["comp-results"])}
            aria-labelledby="competition-details"
        >
            <header className={clsx(dashboardStyles["comp-results-info"])}>
                <h2
                    id="competition-details"
                    className={clsx(dashboardStyles["comp-name"])}
                >
                    {selectedCompetition.name}
                </h2>
                <p className={clsx(dashboardStyles["comp-date"])}>
                    {dateString}
                </p>
            </header>
            {selectedCompetition.events.map((event) => (
                <Event
                    isLocked={selectedCompetition.isLocked}
                    competitionId={selectedCompetition._id}
                    userId={user._id}
                    event={event}
                    key={event.name}
                    userComp={user.competitions.find(
                        (c) => c.competitionId === selectedCompetition._id,
                    )}
                    show={show}
                />
            ))}
        </article>
    );
}

function CompetitionWindow({
    user,
    competitions,
    show,
}: {
    user: User;
    competitions: CompetitionType[];
    show: boolean;
}) {
    const [selectedCompetition, setSelectedCompetition] = useState<
        CompetitionType | undefined
    >(undefined);

    // Using useLayoutEffect instead of useEffect to ensure that the state is set
    // before the browser paints. This prevents the page from scrolling to the top
    // when new solves are added or when the competition list updates.
    useLayoutEffect(() => {
        // Retrieve the last selected competition from sessionStorage, if available
        const rememberedCompetitionId = sessionStorage.getItem(
            "selectedCompetitionId",
        );

        if (rememberedCompetitionId) {
            setSelectedCompetition(
                competitions.find(
                    (c) => c._id === JSON.parse(rememberedCompetitionId),
                ) || competitions[0],
            );
            return;
        }
        setSelectedCompetition(competitions[0]); // Default to the first competition if none is stored
    }, [competitions]);

    if (!selectedCompetition) return <></>;

    return (
        <motion.div
            className={clsx(dashboardStyles["comp"])}
            initial={{ height: 0 }}
            animate={{
                height: show ? "auto" : "0",
            }}
            transition={{
                ease: "easeInOut",
                duration: 0.3,
            }}
            aria-live="polite" // Notify screen readers of visibility change
            aria-hidden={!show} // Helps assistive tech identify visibility status
        >
            <CompetitionSelect
                setSelectedCompetition={setSelectedCompetition}
                competitions={competitions}
                selectedCompetition={selectedCompetition}
                show={show}
            />
            <CompResults
                user={user}
                selectedCompetition={selectedCompetition}
                show={show}
            />
        </motion.div>
    );
}

type Props = {
    user: User;
    show: boolean;
    competitions: CompetitionType[];
};

// Main UserCompetition component wrapping CompetitionWindow for display
export default function UserCompetition({ user, show, competitions }: Props) {
    return (
        <CompetitionWindow
            user={user}
            competitions={competitions}
            show={show}
        />
    );
}
