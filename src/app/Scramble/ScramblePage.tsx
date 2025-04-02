"use client";

import { useState, useEffect } from "react";
import scrambleStyles from "./Scramble.module.css";
import { Loader } from "../components/Loader/Loader";
import dynamic from "next/dynamic";

const ScrambleDisplay = dynamic(
    () => import("../components/Scramble/ScrambleDisplay"),
    {
        loading: () => <LoadingScrambleDisplay />,
        ssr: false,
    },
);

function LoadingScrambleDisplay() {
    return (
        <div className={scrambleStyles["scramble-display-container"]}>
            <Loader />
        </div>
    );
}

function handleScrambleShare(scramble: string) {
    const url = window.location.href;
    if (!navigator.share) {
        alert("Ovaj preglednik ne podržava dijeljenje.");
        return;
    }
    navigator.share({
        title: "",
        text: `Složio sam Rubikovu kocku za scramble-om: ${scramble}. Pokušaj i ti! ${
            url || ""
        }`,
    });
}

async function generateNewScramble(setScramble: (scramble: string) => void) {
    const { default: getScramble } = await import("./getScramble");
    setScramble(getScramble());
}

export default function ScramblePage() {
    const [scramble, setScramble] = useState<string>("");

    useEffect(() => {
        // This fixes issue with SSR in package sr-scrambler
        import("../Scramble/getScramble")
            .then(({ default: getScramble }) => {
                setScramble(getScramble());
            })
            .catch((error) => {
                console.error("Failed to load scramble module:", error);
                alert(
                    "Došlo je do pogreške prilikom učitavanja scramble modula.",
                );
            });
    }, []);

    return (
        <main className={scrambleStyles["main"]}>
            <p className={scrambleStyles["scramble"]}>{scramble}</p>
            <div className={scrambleStyles["scramble-controls"]}>
                <ScrambleDisplay
                    scramble={scramble}
                    event="333"
                    visualization="2D"
                    containerClassName={
                        scrambleStyles["scramble-display-container"]
                    }
                    onClick={() => handleScrambleShare(scramble)}
                />
                <div className={scrambleStyles["btn-rescramble-container"]}>
                    <button
                        className={scrambleStyles["btn-rescramble"]}
                        onClick={() => generateNewScramble(setScramble)}
                    >
                        Promiješaj
                    </button>
                </div>
            </div>
        </main>
    );
}
