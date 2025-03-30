"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format, addYears, subYears } from "date-fns";
import { CompetitionType } from "../Types/solve";
import { Loader } from "../components/Loader/Loader";
import { editCompetition } from "../utils/competitions";
import styles from "./CompDialog.module.css";
import { EVENT_CODES, EventCode, getDisplayName } from "../utils/eventMappings";

// Types
type EventName = EventCode;

interface EventState {
    selected: boolean;
    rounds: number;
}

interface EventSelectionProps {
    selectedEvents: Record<EventName, EventState>;
    onEventChange: (eventName: EventName, checked: boolean) => void;
    onRoundsChange: (eventName: EventName, rounds: number) => void;
}

interface CompetitionFormProps {
    competition: CompetitionType;
    name: string;
    date: string;
    selectedEvents: Record<EventName, EventState>;
    setName: (value: string) => void;
    setDate: (value: string) => void;
    setSelectedEvents: React.Dispatch<
        React.SetStateAction<Record<EventName, EventState>>
    >;
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    closeModal: () => void;
}

interface EditCompDialogProps {
    competition: CompetitionType;
    show: boolean;
    setVisibilityAction: (visible: boolean) => void;
}

// Helper Components
const EventSelection = ({
    selectedEvents,
    onEventChange,
    onRoundsChange,
}: EventSelectionProps) => (
    <div className={styles.eventSelectionContainer}>
        <label className={styles.mainEventLabel}>Eventovi</label>
        {EVENT_CODES.map((eventCode) => (
            <div key={eventCode} className={styles.eventItem}>
                <input
                    type="checkbox"
                    id={`event-${eventCode}`}
                    name={eventCode}
                    onChange={(e) => onEventChange(eventCode, e.target.checked)}
                    checked={selectedEvents[eventCode]?.selected || false}
                    className={styles.checkbox}
                />
                <label
                    htmlFor={`event-${eventCode}`}
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
                        onChange={(e) =>
                            onRoundsChange(
                                eventCode,
                                parseInt(e.target.value, 10),
                            )
                        }
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        ))}
    </div>
);

const CompetitionForm = ({
    competition,
    name,
    date,
    selectedEvents,
    setName,
    setDate,
    setSelectedEvents,
    isLoading,
    setLoading,
    closeModal,
}: CompetitionFormProps) => {
    const router = useRouter();

    // Calculate min and max dates (±3 years from current date)
    const now = new Date();
    const minDate = format(subYears(now, 3), "yyyy-MM-dd'T'HH:mm");
    const maxDate = format(addYears(now, 3), "yyyy-MM-dd'T'HH:mm");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if at least one event is selected
        if (Object.values(selectedEvents).every((event) => !event.selected)) {
            alert("Izaberi barem 1 event.");
            return;
        }

        setLoading(true);

        try {
            const localDate = new Date(date);
            const utcDate = localDate.toISOString();

            const eventsList = Object.entries(selectedEvents)
                .filter(([, event]) => event.selected)
                .map(([eventName, event]) => ({
                    name: eventName,
                    rounds: event.rounds,
                }));

            const result = await editCompetition(
                competition._id,
                name,
                utcDate,
                eventsList,
            );

            if (!result.success) {
                throw new Error("Greška prilikom izmjene");
            }

            router.refresh();
            closeModal();
        } catch (error) {
            console.error("Error editing competition:", error);
            alert("Dogodila se greška prilikom izmjene natjecanja");
        } finally {
            setLoading(false);
        }
    };

    const handleEventChange = (eventName: EventName, checked: boolean) => {
        setSelectedEvents((prev) => ({
            ...prev,
            [eventName]: {
                selected: checked,
                rounds: prev[eventName]?.rounds || 1,
            },
        }));
    };

    const handleRoundsChange = (eventName: EventName, rounds: number) => {
        setSelectedEvents((prev) => ({
            ...prev,
            [eventName]: { ...prev[eventName], rounds },
        }));
    };

    return (
        <form className={styles["comp-dialog-form"]} onSubmit={handleSubmit}>
            <h2>Uredi natjecanje</h2>

            <div className={styles["form-group"]}>
                <label htmlFor="comp-name">Ime natjecanja</label>
                <input
                    type="text"
                    id="comp-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className={styles["form-group"]}>
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
            </div>

            <div className={styles["form-group"]}>
                <EventSelection
                    selectedEvents={selectedEvents}
                    onEventChange={handleEventChange}
                    onRoundsChange={handleRoundsChange}
                />
            </div>

            <div className={styles["comp-dialog-form-buttons"]}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <button
                            type="submit"
                            className={styles["comp-dialog-submit"]}
                        >
                            Uredi
                        </button>
                        <button type="button" onClick={closeModal}>
                            Zatvori
                        </button>
                    </>
                )}
            </div>
        </form>
    );
};

const EditCompDialog = ({
    competition,
    show,
    setVisibilityAction,
}: EditCompDialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState<string>(competition.name);
    const [date, setDate] = useState<string>(() => {
        try {
            const utcDate = new Date(competition.date);
            return format(utcDate, "yyyy-MM-dd'T'HH:mm");
        } catch (error) {
            console.error("Error parsing date:", error);
            return "";
        }
    });

    const [selectedEvents, setSelectedEvents] = useState<
        Record<EventName, EventState>
    >(() => {
        const initialEvents = EVENT_CODES.reduce((acc, event) => {
            acc[event] = { selected: false, rounds: 1 };
            return acc;
        }, {} as Record<EventName, EventState>);

        competition.events.forEach((event) => {
            if (event.name in initialEvents) {
                initialEvents[event.name as EventName] = {
                    selected: true,
                    rounds: event.rounds,
                };
            }
        });

        return initialEvents;
    });

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (show) dialog.showModal();
        else dialog.close();

        // Handle dialog close event (including ESC key press)
        const handleDialogClose = () => {
            setVisibilityAction(false);
        };

        dialog.addEventListener("close", handleDialogClose);

        // Cleanup function
        return () => {
            dialog.removeEventListener("close", handleDialogClose);
        };
    }, [show, setVisibilityAction]);

    return (
        <dialog ref={dialogRef} className={styles["comp-dialog-modal"]}>
            <CompetitionForm
                competition={competition}
                name={name}
                date={date}
                selectedEvents={selectedEvents}
                setName={setName}
                setDate={setDate}
                setSelectedEvents={setSelectedEvents}
                isLoading={isLoading}
                setLoading={setIsLoading}
                closeModal={() => setVisibilityAction(false)}
            />
        </dialog>
    );
};

export default EditCompDialog;
