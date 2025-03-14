import { Metadata } from "next";
import LoginPage from "./LoginPage";

export const dynamic = "error";

export const metadata: Metadata = {
    title: "Prijava - Cro Cube Comp",
    description: "Prijava na Cro Cube Comp račun",
    keywords: ["Prijava", "Cro Cube Comp"],
};

export default function Login() {
    return <LoginPage />;
}
