import { CompetitionType } from "../Types/solve";
import { getCompetitions } from "../utils/competitions";
import CompButtons from "./CompButtons";
import styles from "./CompetitionDashboard.module.css";

export const metadata = {
  title: "Upravljanje natjecanjima",
};
export const dynamic = "force-dynamic";

function CurrentCompetitions({
  competitions,
}: {
  competitions: CompetitionType[];
}) {
  return (
    <div className={styles["competitions"]}>
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
            <h2>{name}</h2>
            <p>Datum: {dateFormatted}</p>
            <h2>Eventovi</h2>
            <ul className={styles["events-list"]}>
              {events.map((event, index) => (
                <li key={index} className={styles["event"]}>
                  {event.name} ({event.rounds})
                </li>
              ))}
            </ul>
            <CompButtons isLocked={isLocked} competitionId={_id} />
          </div>
        );
      })}
    </div>
  );
}

export default async function CompetitionsDashboard() {
  const competitions = await getCompetitions();
  if (!competitions.success)
    return <p>Dogodila se greška prilikom dobivanja natjecanje</p>;
  return (
    <>
      <CurrentCompetitions competitions={competitions.parsed} />
    </>
  );
}
