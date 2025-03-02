// Client component
import CompetitionStyles from "./Competitions.module.css";
import { Result } from "../Types/solve";
import { formatTime, getAverage } from "../utils/solveTime";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function RoundResults({
    round,
    show,
}: {
    round: Result[];
    show: boolean;
}) {
    const className = clsx(CompetitionStyles["round-results"], {
        [CompetitionStyles["hidden"]]: !show,
    });

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
                opacity: show ? 1 : 0,
                height: show ? "auto" : 0,
                transition: { duration: 0.3, ease: "easeIn" },
            }}
            className={className}
        >
            {round.length === 0 ? (
                <p>Nema rezultata za ovu rundu.</p>
            ) : (
                round.map((result, index) => {
                    return (
                        <div
                            key={index}
                            className={CompetitionStyles["solver"]}
                        >
                            <p className={CompetitionStyles["solve"]}>
                                {index + 1}. {result.username}{" "}
                                {result.solves
                                    .map((solve) => formatTime(solve))
                                    .join(" ")}{" "}
                                (Ao5 {getAverage(result.solves)})
                            </p>
                        </div>
                    );
                })
            )}
        </motion.div>
    );
}
