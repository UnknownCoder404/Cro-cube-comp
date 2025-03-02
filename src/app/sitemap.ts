import type { MetadataRoute } from "next";

export const dynamic = "error";

export default function sitemap(): MetadataRoute.Sitemap {
    const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    const baseUrl = productionDomain
        ? `https://${productionDomain}`
        : "https://cro-cube-comp.vercel.app";

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/Competitions`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/Rules`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/Login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/Scramble`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.4,
        },
        {
            url: `${baseUrl}/robots.txt`, // Linking robots.txt in sitemap
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.1,
        },
    ];
}
