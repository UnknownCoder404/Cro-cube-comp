import "@/globals.css";
import Header from "./components/Header/Header";
import { Roboto } from "next/font/google";
import ReactQueryProvider from "./components/Providers/react-query-provider";
import { AdminToolbar } from "./components/AdminToolbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const roboto = Roboto({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

const showToolBar: boolean = process.env.SHOW_TOOLBAR === "true";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="hr" className={roboto.className}>
            <meta
                name="google-site-verification"
                content="p4gzWQ-1iXVG0l_lfeyeSHMr_37F_pq6QH3hu8zmL40"
            />

            <body>
                <Header />
                <ReactQueryProvider>{children}</ReactQueryProvider>
                {showToolBar && <AdminToolbar />}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
