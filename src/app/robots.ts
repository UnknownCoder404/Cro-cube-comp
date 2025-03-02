import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => ({
    rules: [
        {
            userAgent: "*",
            allow: "*",
            disallow: [
                "/Register",
                "/Advanced-Dashboard",
                "/Dashboard",
                "/Competitions-Dashboard",
                "/Posts",
            ],
        },
    ],
});

export default robots;

export const dynamic = "error";
