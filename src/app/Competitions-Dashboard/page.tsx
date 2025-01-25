import { Metadata } from "next";
import { CompetitionType } from "../Types/solve";
import { getCompetitions } from "../utils/competitions";
import CompButtons from "./CompButtons";
import styles from "./CompetitionDashboard.module.css";
import { CreateCompButton } from "./CreateCompetition";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import CalendarSvg from "../components/Svg/calendar";
import LockSvg from "../components/Svg/lock";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const svgFillColor = "#e8eaed";

export const metadata: Metadata = {
    title: "Upravljanje natjecanjima",
    description: "Upravljanje Cro Cube Comp natjecanjima",
    keywords: ["Cro Cube Comp", "Upravljanje natjecanjima"],
};

function CurrentCompetitions({
    competitions,
}: {
    competitions: CompetitionType[];
}) {
    return (
        <main className={styles["competitions"]}>
            {competitions.map((comp) => {
                const { name, isLocked, date, _id, events } = comp;
                const dateFormatted = new Date(date).toLocaleDateString(
                    ["hr-HR", "fr-FR"],
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    },
                );
                return (
                    <div key={_id} className={styles["competition"]}>
                        <div className={styles["title-row"]}>
                            <div className={styles["title-and-date-container"]}>
                                <h2 className={styles["title"]}>{name}</h2>
                                <div
                                    className={
                                        styles["calendar-date-container"]
                                    }
                                >
                                    <CalendarSvg
                                        fill={svgFillColor}
                                        width={"20px"}
                                        height={"20px"}
                                    />
                                    <p className={styles["date"]}>
                                        {dateFormatted}
                                    </p>
                                </div>
                            </div>
                            {isLocked ? (
                                <div className={styles["locked-container"]}>
                                    <div className={styles["locked"]}>
                                        <LockSvg
                                            className={styles["locked-img"]}
                                            width={"20px"}
                                            height={"20px"}
                                            isLocked={true}
                                            fill={svgFillColor}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <h3 className={styles["events-title"]}>Eventovi</h3>
                        <div className={styles["events-list"]}>
                            {events.map((event, index) => (
                                <div key={index} className={styles["event"]}>
                                    {event.name} ({event.rounds})
                                </div>
                            ))}
                        </div>
                        <CompButtons
                            isLocked={isLocked}
                            competitionId={_id}
                            competition={comp}
                        />
                    </div>
                );
            })}
        </main>
    );
}

export default async function CompetitionsDashboard() {
    const competitions = await getCompetitions();
    if (!competitions.success)
        return <p>Dogodila se greška prilikom dobivanja natjecanje</p>;
    return (
        <ProtectedRoute require="admin" redirectTo="/Login" validateToken>
            <CurrentCompetitions competitions={competitions.parsed} />
            <CreateCompButton />
        </ProtectedRoute>
    );
}
