import { CompetitionResultsType } from "../Types/solve";
import Competition from "./Competition";

type Props = {
    competitions: {
        parsed: CompetitionResultsType;
        success: true;
        status: number;
    };
};

export default async function Competitions(props: Props) {
    const competitions = props.competitions.parsed;

    // Convert competitions object to array and sort by date
    const sortedCompetitions = Object.entries(competitions).sort((a, b) => {
        const dateA = new Date(a[1].date);
        const dateB = new Date(b[1].date);
        return dateB.getTime() - dateA.getTime(); // Newest first
    });

    return (
        <main>
            {sortedCompetitions.map(([compName, competition], index) => (
                <Competition
                    competitionName={compName}
                    competition={competition}
                    key={index}
                />
            ))}
        </main>
    );
}
