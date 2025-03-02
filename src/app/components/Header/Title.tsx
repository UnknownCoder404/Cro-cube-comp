"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import headerStyles from "./Header.module.css";

const routeTitles: {
    [index: string]: string | undefined;
} = {
    "/": "Cro Cube Comp",
    "/Login": "Prijava",
    "/Register": "Registracija",
    "/Competitions": "Rezultati",
    "/Competitions-Dashboard": "Natjecanja",
    "/Scramble": "Vježbanje",
    "/Dashboard": "Radna ploča",
    "/Advanced-Dashboard": "Radna ploča",
    "/Rules": "Pravila",
    "/Posts": "Objave",
};

function ClientTitle() {
    const pathname = usePathname(); // Get the current pathname
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        // Update the title based on the current pathname
        const currentTitle = routeTitles[pathname] || "Cro Cube Comp";
        setTitle(currentTitle);
    }, [pathname]); // Re-run when pathname changes

    return <h1 className={headerStyles["title"]}>{title}</h1>;
}

export default ClientTitle;
