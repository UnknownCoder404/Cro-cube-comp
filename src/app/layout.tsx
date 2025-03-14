import "@/globals.css";
import Header from "./components/Header/Header";
import { Roboto } from "next/font/google";
import ReactQueryProvider from "./components/Providers/react-query-provider";
import { AdminToolbar } from "./components/AdminToolbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/app/context/AuthContext";

const roboto = Roboto({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

const showToolBar = process.env.SHOW_TOOLBAR === "true";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="hr" className={roboto.className}>
            <meta
                name="google-site-verification"
                content="p4gzWQ-1iXVG0l_lfeyeSHMr_37F_pq6QH3hu8zmL40"
            />
            <body>
                <AuthProvider>
                    <ReactQueryProvider>
                        <Header />
                        {children}
                        {showToolBar && <AdminToolbar />}
                        <SpeedInsights />
                        <Analytics />
                    </ReactQueryProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
