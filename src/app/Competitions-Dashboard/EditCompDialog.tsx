"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CompetitionType } from "../Types/solve";
import { Loader } from "../components/Loader/Loader";
import { editCompetition } from "../utils/competitions";
import styles from "./CompetitionDashboard.module.css";

// Constants
const EVENTS = [
    "3x3",
    "3x3oh",
    "4x4",
    "2x2",
    "3x3bld",
    "megaminx",
    "teambld",
] as const;
type EventName = (typeof EVENTS)[number];

// Types
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
    <div className={styles["events-grid"]}>
        {EVENTS.map((event) => (
            <div key={event} className={styles["event-item"]}>
                <div className={styles["event-checkbox"]}>
                    <input
                        type="checkbox"
                        id={`event-${event}`}
                        name={event}
                        onChange={(e) => onEventChange(event, e.target.checked)}
                        checked={selectedEvents[event]?.selected || false}
                    />
                    <label htmlFor={`event-${event}`}>{event}</label>
                </div>

                <div className={styles["rounds-select"]}>
                    <label htmlFor={`rounds-${event}`}>Broj rundi</label>
                    <select
                        id={`rounds-${event}`}
                        disabled={!selectedEvents[event]?.selected}
                        value={selectedEvents[event]?.rounds || 1}
                        onChange={(e) =>
                            onRoundsChange(event, parseInt(e.target.value, 10))
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if at least one event is selected
        if (Object.values(selectedEvents).every((event) => !event.selected)) {
            alert("Please select at least one event.");
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
        <form className={styles["make-comp-form"]} onSubmit={handleSubmit}>
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
                    required
                />
            </div>

            <div className={styles["form-group"]}>
                <label>Eventovi</label>
                <EventSelection
                    selectedEvents={selectedEvents}
                    onEventChange={handleEventChange}
                    onRoundsChange={handleRoundsChange}
                />
            </div>

            <div className={styles["make-comp-form-buttons"]}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <button
                            type="submit"
                            className={styles["make-comp-submit"]}
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
        const initialEvents = EVENTS.reduce(
            (acc, event) => {
                acc[event] = { selected: false, rounds: 1 };
                return acc;
            },
            {} as Record<EventName, EventState>,
        );

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
    }, [show]);

    return (
        <dialog ref={dialogRef}>
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
