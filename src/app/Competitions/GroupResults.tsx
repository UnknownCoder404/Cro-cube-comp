import { motion } from "framer-motion";
import competitionStyles from "./Competitions.module.css";
import Round from "./Round";
import { Result } from "../Types/solve";

type Props = {
    areGroupResultsShown: boolean;
    roundVisibilities: boolean[];
    toggleRoundVisibility: (index: number) => void;
    group: Result[][];
};
export default function GroupResults({
    areGroupResultsShown,
    roundVisibilities,
    toggleRoundVisibility,
    group,
}: Props) {
    return (
        <motion.div
            className={competitionStyles["group-results"]}
            initial={{
                height: 100,
                opacity: 0,
                paddingTop: 0,
                paddingBottom: 0,
                scale: 0.5,
            }}
            animate={{
                height: areGroupResultsShown ? "auto" : 0,
                opacity: areGroupResultsShown ? 1 : 0,
                paddingTop: areGroupResultsShown ? "1rem" : 0,
                paddingBottom: areGroupResultsShown ? "1rem" : 0,
                scale: areGroupResultsShown ? 1 : 0.5,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
        >
            {group.map((round, index) => {
                return (
                    <Round
                        round={round}
                        show={roundVisibilities[index]}
                        toggleRoundVisibility={() =>
                            toggleRoundVisibility(index)
                        }
                        key={index}
                        roundIndex={index}
                    />
                );
            })}
        </motion.div>
    );
}
