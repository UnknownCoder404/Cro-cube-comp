import { CompetitionResultType } from "../Types/solve";
import { EventCode } from "../utils/eventMappings";
import CompetitionEvent from "./CompetitionEvent";
import competitionStyles from "./Competitions.module.css";

// Component for displaying the competition name
function CompetitionName({ name }: { name: string }) {
    return (
        <h2 className={competitionStyles["comp-name"]}>
            {name || "Ime natjecanja nije dostupno"}
        </h2>
    );
}

// Component for displaying the competition date
function CompetitionDate({ date }: { date: string }) {
    const dateInLocalString = new Date(date).toLocaleString("hr-HR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Zagreb",
    });
    return (
        <time className={competitionStyles["comp-date"]} dateTime={date}>
            {dateInLocalString}
        </time>
    );
}

// Main Competition component
export default async function Competition(props: {
    competition: CompetitionResultType;
    competitionName: string;
}) {
    const { competition, competitionName } = props;
    const competitionDateString = competition.date;
    const competitionEvents = Object.keys(competition.events) as EventCode[];

    return (
        <div className={competitionStyles["comp-info"]}>
            <CompetitionName name={competitionName} />
            <CompetitionDate date={competitionDateString} />
            <div>
                {competitionEvents.map((eventName, index) => {
                    const event = competition.events[eventName];
                    return (
                        <CompetitionEvent
                            eventName={eventName}
                            key={index}
                            event={event}
                        />
                    );
                })}
            </div>
        </div>
    );
}
