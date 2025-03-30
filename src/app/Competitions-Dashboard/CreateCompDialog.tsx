"use client";
import { useRouter } from "next/navigation";
import { createCompetition } from "../utils/competitions";
import styles from "./CompDialog.module.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Loader } from "../components/Loader/Loader";
import { format, parseISO, addYears, subYears } from "date-fns";
import { EVENT_CODES, EventCode, getDisplayName } from "../utils/eventMappings";

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
        <div className={styles.eventSelectionContainer}>
            <label className={styles.mainEventLabel}>Eventovi</label>
            {EVENT_CODES.map((eventCode, index) => (
                <div key={index} className={styles.eventItem}>
                    <input
                        type="checkbox"
                        id={`event-${index}`}
                        name={eventCode}
                        onChange={handleEventChange}
                        className={styles.checkbox}
                    />
                    <label
                        htmlFor={`event-${index}`}
                        className={styles.eventLabel}
                    >
                        {getDisplayName(eventCode)}
                    </label>
                    <div className={styles.roundsControlGroup}>
                        <label
                            htmlFor={`rounds-${eventCode}`}
                            className={styles.roundsLabel}
                        >
                            Broj rundi
                        </label>
                        <select
                            id={`rounds-${eventCode}`}
                            className={styles.roundsSelect}
                            disabled={!selectedEvents[eventCode]?.selected}
                            value={selectedEvents[eventCode]?.rounds || 1}
                            onChange={(e) => handleRoundsChange(e, eventCode)}
                        >
                            {[...Array(5)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
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
    // Calculate min and max dates (±3 years from current date)
    const now = new Date();
    const minDate = format(subYears(now, 3), "yyyy-MM-dd'T'HH:mm");
    const maxDate = format(addYears(now, 3), "yyyy-MM-dd'T'HH:mm");

    return (
        <form className={styles["comp-dialog-form"]} onSubmit={handleSubmit}>
            <h2>Izradi natjecanje</h2>
            <label htmlFor="comp-name">Ime natjecanja</label>
            <input
                type="text"
                id="comp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <label htmlFor="comp-date">Datum natjecanja</label>
            <input
                type="datetime-local"
                id="comp-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                max={maxDate}
                required
            />

            <EventSelection
                selectedEvents={selectedEvents}
                handleEventChange={handleEventChange}
                handleRoundsChange={handleRoundsChange}
            />

            {isLoading ? (
                <Loader />
            ) : (
                <div className={styles["comp-dialog-form-buttons"]}>
                    <button
                        type="submit"
                        className={styles["comp-dialog-submit"]}
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

            closeModal();
            router.refresh();
        } catch (error) {
            console.error("Error creating competition:", error);
            alert("Dogodila se greška pri stvaranju natjecanja.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <dialog
            className={styles["comp-dialog-modal"]}
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
