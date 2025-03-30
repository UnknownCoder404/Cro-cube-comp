import { Metadata } from "next";
import Cards from "./components/HomePage/Cards";
import { getPosts } from "./utils/posts";

export const metadata: Metadata = {
    title: "Cro Cube Comp - Početna",
    description:
        "CroCubeComp je natjecanje Rubikove kocke u Hrvatskoj. Ova natjecanja prate WCA pravilnik.",
    keywords: [
        "Cro Cube Comp",
        "Natjecanje iz Rubikove kocke",
        "Cro Cube Club",
        "Cro.cube.club@gmail.com",
    ],
};

export const revalidate = 0; // Ensure no caching on fetch requests

export default async function Home() {
    const fetchedPosts = await getPosts();
    const posts = fetchedPosts.success ? fetchedPosts.parsed : [];

    return <Cards posts={posts} />;
}
