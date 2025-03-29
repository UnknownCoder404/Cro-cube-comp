"use client";
import { useRouter } from "next/navigation";
import { createCompetition } from "../utils/competitions";
import styles from "./CompetitionDashboard.module.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Loader } from "../components/Loader/Loader";
import { format, parseISO } from "date-fns";
import posthog from "posthog-js";

const events = ["3x3", "3x3oh", "4x4", "2x2", "3x3bld", "megaminx", "teambld"];

function EventSelection({
    selectedEvents,
    handleEventChange,
    handleRoundsChange,
}: {
    selectedEvents: { [key: string]: { selected: boolean; rounds: number } };
    handleEventChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleRoundsChange: (
        e: ChangeEvent<HTMLSelectElement>,
        eventName: string,
    ) => void;
}) {
    return (
        <>
            {events.map((event, index) => (
                <div key={index}>
                    <input
                        type="checkbox"
                        id={`event-${index}`}
                        name={event}
                        onChange={handleEventChange}
                    />
                    <label htmlFor={`event-${index}`}>{event}</label>
                    <br />
                    <label htmlFor={`rounds-${event}`}>Broj rundi</label>
                    <select
                        id={`rounds-${event}`}
                        disabled={!selectedEvents[event]?.selected}
                        value={selectedEvents[event]?.rounds || 1}
                        onChange={(e) => handleRoundsChange(e, event)}
                    >
                        {[...Array(5)].map((_, i) => (
                            <option key={i} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </>
    );
}

function CompetitionForm({
    name,
    date,
    selectedEvents,
    setName,
    setDate,
    handleEventChange,
    handleRoundsChange,
    handleSubmit,
    isLoading,
    closeModal,
}: {
    name: string;
    date: string;
    selectedEvents: { [key: string]: { selected: boolean; rounds: number } };
    setName: (value: string) => void;
    setDate: (value: string) => void;
    handleEventChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleRoundsChange: (
        e: ChangeEvent<HTMLSelectElement>,
        eventName: string,
    ) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    isLoading: boolean;
    closeModal: () => void;
}) {
    return (
        <form className={styles["make-comp-form"]} onSubmit={handleSubmit}>
            <h2>Izradi natjecanje</h2>
            <label htmlFor="comp-name">Ime natjecanja</label>
            <input
                type="text"
                id="comp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={5}
                maxLength={35}
                required
            />

            <label htmlFor="comp-date">Datum natjecanja</label>
            <input
                type="datetime-local"
                id="comp-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date(
                    new Date().setFullYear(new Date().getFullYear() - 3),
                )
                    .toISOString()
                    .slice(0, 16)}
                max={new Date(
                    new Date().setFullYear(new Date().getFullYear() + 3),
                )
                    .toISOString()
                    .slice(0, 16)}
                required
            />

            <label>Eventovi</label>
            <EventSelection
                selectedEvents={selectedEvents}
                handleEventChange={handleEventChange}
                handleRoundsChange={handleRoundsChange}
            />

            {isLoading ? (
                <Loader />
            ) : (
                <div className={styles["make-comp-form-buttons"]}>
                    <button
                        type="submit"
                        className={styles["make-comp-submit"]}
                    >
                        Napravi
                    </button>
                    <button type="button" onClick={closeModal}>
                        Zatvori
                    </button>
                </div>
            )}
        </form>
    );
}

function CreateCompDialog({
    showModal,
    closeModal,
}: {
    showModal: boolean;
    closeModal: () => void;
}) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [selectedEvents, setSelectedEvents] = useState<{
        [key: string]: { selected: boolean; rounds: number };
    }>({});
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!dialogRef.current) return;

        if (showModal) dialogRef.current.showModal();
        else dialogRef.current.close();
    }, [showModal]);

    const handleEventChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelectedEvents((prev) => ({
            ...prev,
            [name]: { selected: checked, rounds: prev[name]?.rounds || 1 },
        }));
    };

    const handleRoundsChange = (
        e: ChangeEvent<HTMLSelectElement>,
        eventName: string,
    ) => {
        const { value } = e.target;
        setSelectedEvents((prev) => ({
            ...prev,
            [eventName]: { ...prev[eventName], rounds: parseInt(value, 10) },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if at least one event is selected
        if (Object.values(selectedEvents).every((event) => !event.selected)) {
            alert("Izaberi barem 1 event.");
            return;
        }

        const selectedEventList = Object.entries(selectedEvents)
            .filter(([, { selected }]) => selected)
            .map(([name, { rounds }]) => ({ name, rounds }));

        const localDate = parseISO(date);
        const utcDateString = format(localDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

        try {
            setIsLoading(true);
            const { success } = await createCompetition(
                name,
                utcDateString,
                selectedEventList,
            );
            if (!success) throw new Error("Failed to create competition");

            posthog.capture("competition_creation_successful", {
                name,
                date: utcDateString,
                events: selectedEventList.map((event) => event.name),
            });

            closeModal();
            router.refresh();
        } catch (error) {
            posthog.capture("competition_creation_fail", {
                name,
                date: utcDateString,
                events: selectedEventList.map((event) => event.name),
                error,
            });
            console.error("Error creating competition:", error);
            alert("Dogodila se greška pri stvaranju natjecanja.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <dialog
            className={styles["make-comp-modal"]}
            ref={dialogRef}
            onClose={closeModal}
        >
            <CompetitionForm
                name={name}
                date={date}
                selectedEvents={selectedEvents}
                setName={setName}
                setDate={setDate}
                handleEventChange={handleEventChange}
                handleRoundsChange={handleRoundsChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                closeModal={closeModal}
            />
        </dialog>
    );
}

export function CreateCompButton() {
    const [showModal, setModalVisibility] = useState(false);
    const toggleModal = () => setModalVisibility((prev) => !prev);

    return (
        <>
            <button className={styles["create-comp-btn"]} onClick={toggleModal}>
                Izradi natjecanje
            </button>
            {showModal && (
                <CreateCompDialog
                    showModal={showModal}
                    closeModal={() => setModalVisibility(false)}
                />
            )}
        </>
    );
}
