import { Metadata } from "next";
import RegisterPage from "./RegisterPage";
import ProtectedRoute from "../components/Common/ProtectedRoute";

export const dynamic = "error";

export const metadata: Metadata = {
    title: "Registracija - Cro Cube Comp",
    description: "Registracija korisnika za Cro Cube Comp natjecanja",
    keywords: ["Registracija", "Cro Cube Comp"],
};

export default function Register() {
    return (
        <ProtectedRoute require="admin" redirectTo="/Login" validateToken>
            <RegisterPage />
        </ProtectedRoute>
    );
}
