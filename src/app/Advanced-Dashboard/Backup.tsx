"use client";

import { useEffect } from "react";
import styles from "./AdvancedDashboard.module.css";
import { url } from "@/globals";
import { useQuery } from "react-query";

async function getFile(url: string): Promise<Blob> {
    if (!url) throw new Error("URL or fileName is not defined");
    const data = await fetch(url, {
        credentials: "include",
    });
    if (!data.ok) throw new Error("Error while fetching file");
    const blob = await data.blob();
    return blob;
}

export default function Backup() {
    const {
        data: backup,
        isLoading,
        refetch,
        error,
    } = useQuery(["backup"], async () => {
        const backupUrl = new URL(url);
        backupUrl.pathname = "system/backup";
        return await getFile(backupUrl.toString());
    });

    useEffect(() => {
        refetch().catch((e) => {
            console.error("Failed to refetch data: ", e);
        });
    }, [refetch]);

    return (
        <div className={styles["backups-container"]}>
            <h2>Sigurnosna kopija</h2>
            {error ? (
                <p>Greška prilikom učitavanja</p>
            ) : (
                <button
                    onClick={() => {
                        if (!backup) return;
                        try {
                            const url = window.URL.createObjectURL(backup);

                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `Sigurnosna kopija - ${new Date().toLocaleDateString()}.zip`;

                            document.body.appendChild(a);
                            a.click();
                        } catch (error) {
                            console.error("Error downloading backup: ", error);
                        }
                    }}
                    disabled={isLoading}
                    className={styles["backup-btn"]}
                >
                    {isLoading ? "Učitavanje..." : "Sigurnosna kopija"}
                </button>
            )}
        </div>
    );
}
