"use client"; // Error boundaries must be Client Components

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    console.error(error);
    return (
        <>
            <h2>Nešto je pošlo po zlu</h2>
            <button onClick={() => reset()}>Pokušaj ponovno!</button>
            <p>
                Ovo je vjerovatno greška u našem kodu. Kontaktirajte
                administratora.
            </p>
        </>
    );
}
