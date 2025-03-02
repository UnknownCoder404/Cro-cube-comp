import AdvancedDashboard from "./AdvancedDashboard";
import { getUsers } from "../utils/users";
import { getCompetitions } from "../utils/competitions";
import { Metadata } from "next";
import ProtectedRoute from "../components/Common/ProtectedRoute";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Ensure no caching between requests

export const metadata: Metadata = {
    title: "Napredna radna ploča - Cro Cube Comp",
    description:
        "Rezultati za printanje, sigurnosne kopije baze podataka i mijenjanje lozinke.",
    keywords: ["Cro Cube Comp", "Napredna radna ploča"],
};

export default async function AdvancedDashboardPage() {
    const [users, competitions] = await Promise.all([
        getUsers(),
        getCompetitions(),
    ]);

    if (!users.success) {
        return <p>Nemoguće dohvatiti korisnike</p>;
    }
    if (!competitions.success) {
        return <p>Nemoguće dohvatiti natjecanja</p>;
    }

    return (
        <ProtectedRoute require="admin" redirectTo="/Login" validateToken>
            <AdvancedDashboard
                users={users.parsed}
                competitions={competitions.parsed}
            />
        </ProtectedRoute>
    );
}
