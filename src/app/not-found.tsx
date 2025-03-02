import Link from "next/link";
export const metadata = {
    title: "Stranica nije pronađena",
    description: "Stranica koju ste pokušali posjetiti nije pronađena.",
};

export default function NotFound() {
    return (
        <div>
            <h1>Stranica nije pronađena</h1>
            <p>
                Stranica koju ste pokušali posjetiti nije pronađena. Nemojte se
                brinuti, možda je to greška u URL-u.
            </p>
            <ul>
                <li>
                    <Link href="/">Povratak na početnu stranicu</Link>
                </li>
            </ul>
        </div>
    );
}
