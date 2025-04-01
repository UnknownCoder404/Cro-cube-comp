import RoundResults from "./RoundResults";
import CompetitionStyles from "./Competitions.module.css";
import ShowAndHide from "../components/Competitions/showAndHide";
import { Result } from "../Types/solve";

export default function Round({
    round,
    show,
    toggleRoundVisibility,
    roundIndex,
}: {
    round: Result[];
    show: boolean;
    toggleRoundVisibility: () => void;
    roundIndex: number;
}) {
    return (
        <>
            <div className={CompetitionStyles["round-title-container"]}>
                <h4 className={CompetitionStyles["round-title"]}>
                    Runda {roundIndex + 1}
                </h4>
                <ShowAndHide
                    toggleVisibility={toggleRoundVisibility}
                    show={show}
                />
            </div>
            <RoundResults show={show} round={round} />
        </>
    );
}
