import dashboardStyles from "@/app/Dashboard/Dashboard.module.css";
import {
    formatInputToSeconds,
    formatTime,
    getAverage,
} from "@/app/utils/solveTime";
import { useRef, useState } from "react";
import { addSolve, deleteSolve } from "@/app/utils/users";
import { useRouter } from "next/navigation";
import {
    AllowedEvents,
    EventDetail,
    UserComp,
    UserEvent,
} from "@/app/Types/solve";
import { clsx } from "clsx";
import DeleteSvg from "../Svg/delete";
import posthog from "posthog-js";

function DeleteSolveButton({
    competitionId,
    event,
    roundNumber,
    solveNumber,
    userId,
    isLocked,
    show,
}: {
    competitionId: string;
    event: AllowedEvents;
    roundNumber: number;
    solveNumber: number;
    userId: string;
    isLocked: boolean;
    show: boolean;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const deleteThisSolve = async () => {
        try {
            setLoading(true);
            const solveDeletion = await deleteSolve({
                userId,
                competitionId,
                eventName: event,
                roundIndex: roundNumber - 1,
                solveIndex: solveNumber - 1,
            });

            if (!solveDeletion.success) {
                posthog.capture("solve_deleted_failure", {
                    competitionId,
                    eventName: event,
                    roundNumber,
                    solveNumber,
                    userId,
                    errorMessage:
                        (solveDeletion.data && solveDeletion.data.message) ||
                        "Greška pri brisanju slaganja.",
                });
                return alert(
                    (solveDeletion.data && solveDeletion.data.message) ||
                        "Greška pri brisanju slaganja.",
                );
            }

            posthog.capture("solve_deleted_success", {
                competitionId,
                eventName: event,
                roundNumber,
                solveNumber,
                userId,
            });
            router.refresh();
        } catch (error) {
            posthog.capture("solve_deleted_failure", {
                competitionId,
                eventName: event,
                roundNumber,
                solveNumber,
                userId,
                error: error,
            });
            alert("Greška pri brisanju slaganja: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={deleteThisSolve}
            className={clsx(dashboardStyles["delete-solve"], {
                [dashboardStyles.locked]: isLocked,
            })}
            disabled={loading}
            tabIndex={show ? 0 : -1}
        >
            <DeleteSvg width="24px" height="24px" fill="black" />
        </button>
    );
}

function AddSolveInputAndButton({
    competitionId,
    roundNumber,
    eventName,
    userId,
    isLocked,
    show,
}: {
    competitionId: string;
    roundNumber: number;
    eventName: string;
    userId: string;
    isLocked: boolean;
    show: boolean;
}) {
    const router = useRouter();
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(event.target.value);

    const addSolveToUser = async () => {
        try {
            if (!inputValue.trim()) return;

            const solves = inputValue
                .split(" ")
                .map((solve) => formatInputToSeconds(solve))
                .filter(
                    (solve): solve is number =>
                        solve !== null && solve !== undefined,
                );

            if (!solves.length) return;

            setLoading(true);
            const response = await addSolve({
                userId: userId,
                competitionId,
                event: eventName,
                roundIndex: roundNumber - 1,
                solves,
            });

            if (!response.success) {
                posthog.capture("solve_added_failure", {
                    competitionId,
                    eventName,
                    roundNumber,
                    solvesCount: solves.length,
                    userId,
                    errorMessage:
                        (response.data && response.data.message) ||
                        "Greška prilikom dodavanja slaganja.",
                });
                alert(
                    (response.data && response.data.message) ||
                        "Greška prilikom dodavanja slaganja.",
                );
                return;
            }

            posthog.capture("solve_added_success", {
                competitionId,
                eventName,
                roundNumber,
                solvesCount: solves.length,
                userId,
            });
            setInputValue("");
            router.refresh();

            setTimeout(() => inputRef.current?.focus(), 0);
        } catch (error) {
            posthog.capture("solve_added_failure", {
                competitionId,
                eventName,
                roundNumber,
                userId,
                error: error,
            });
            alert("Greška prilikom dodavanja slaganja: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <input
                ref={inputRef}
                placeholder="Dodaj slaganje"
                className={clsx(dashboardStyles["solve-input"], {
                    [dashboardStyles.locked]: isLocked,
                })}
                value={inputValue}
                onChange={handleChange}
                disabled={loading}
                onKeyDown={(e) => e.key === "Enter" && addSolveToUser()}
                tabIndex={show ? 0 : -1}
            />
            <button
                onClick={addSolveToUser}
                className={clsx(dashboardStyles["solve-add-btn"], {
                    [dashboardStyles.locked]: isLocked,
                })}
                disabled={loading}
                tabIndex={show ? 0 : -1}
            >
                {loading ? "..." : "Dodaj"}
            </button>
        </>
    );
}

function Solve({
    solve,
    competitionId,
    eventName,
    roundNumber,
    userId,
    solveNumber,
    isLocked,
    show,
}: {
    solve: number;
    competitionId: string;
    eventName: AllowedEvents;
    roundNumber: number;
    userId: string;
    solveNumber: number;
    isLocked: boolean;
    show: boolean;
}) {
    return (
        <li className={dashboardStyles.solve}>
            {formatTime(solve)}
            <DeleteSolveButton
                solveNumber={solveNumber}
                competitionId={competitionId}
                event={eventName}
                roundNumber={roundNumber}
                userId={userId}
                isLocked={isLocked}
                show={show}
            />
        </li>
    );
}

function Round({
    roundNumber,
    round,
    competitionId,
    eventName,
    userId,
    isLocked,
    show,
}: {
    roundNumber: number;
    round: number[] | undefined;
    competitionId: string;
    eventName: AllowedEvents;
    userId: string;
    isLocked: boolean;
    show: boolean;
}) {
    return (
        <div className={dashboardStyles.round}>
            <h4>Runda {roundNumber}</h4>
            <p>Ao5: {getAverage(round)}</p>
            <ol className={dashboardStyles["solves-list"]}>
                {round?.map((solve, index) => (
                    <Solve
                        key={index}
                        solve={solve}
                        solveNumber={index + 1}
                        competitionId={competitionId}
                        eventName={eventName}
                        roundNumber={roundNumber}
                        userId={userId}
                        isLocked={isLocked}
                        show={show}
                    />
                ))}
            </ol>
            {round?.length !== 5 && (
                <AddSolveInputAndButton
                    competitionId={competitionId}
                    roundNumber={roundNumber}
                    eventName={eventName}
                    userId={userId}
                    isLocked={isLocked}
                    show={show}
                />
            )}
        </div>
    );
}

function EventResults({
    event,
    userEvent,
    competitionId,
    userId,
    isLocked,
    show,
}: {
    event: EventDetail;
    userEvent: UserEvent | undefined;
    competitionId: string;
    userId: string;
    isLocked: boolean;
    show: boolean;
}) {
    return (
        <div className={dashboardStyles["event-results"]}>
            {[...Array(event.rounds)].map((_, index) => {
                const round = userEvent?.rounds[index];
                return (
                    <Round
                        key={index}
                        roundNumber={index + 1}
                        round={round}
                        competitionId={competitionId}
                        eventName={event.name}
                        userId={userId}
                        isLocked={isLocked}
                        show={show}
                    />
                );
            })}
        </div>
    );
}

export default function Event({
    event,
    userComp,
    userId,
    competitionId,
    isLocked,
    show,
}: {
    event: EventDetail;
    userComp: UserComp | undefined;
    userId: string;
    competitionId: string;
    isLocked: boolean;
    show: boolean;
}) {
    return (
        <div className={dashboardStyles.event}>
            <h3 className={dashboardStyles["event-name"]}>{event.name}</h3>
            <EventResults
                event={event}
                userEvent={userComp?.events.find(
                    (userComp) => userComp.event === event.name,
                )}
                competitionId={competitionId}
                userId={userId}
                isLocked={isLocked}
                show={show}
            />
        </div>
    );
}
