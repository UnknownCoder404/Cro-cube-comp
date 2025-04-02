import { Metadata } from "next";
import ScramblePage from "./ScramblePage";

export const dynamic = "error";

export const metadata: Metadata = {
    title: "Vježbanje - Cro Cube Comp",
    description: "Vježbaj za natjecanje iz Rubikove kocke",
    keywords: ["Vježbanje", "Scramble", "Rubikova kocka", "Miješanje"],
};

export default function Scramble() {
    return <ScramblePage />;
}
