import { type Metadata } from "next";
import { getPosts } from "../utils/posts";
import PostsPage from "./PostsPage";
import ProtectedRoute from "../components/Common/ProtectedRoute";

export const metadata: Metadata = {
    title: "Objave - Cro Cube Comp",
    description: "Upravljaj objavama na Cro Cube Comp stranici.",
    keywords: ["Upravljanje objavama", "Cro Cube Comp"],
};

export const revalidate = 0; // Ensure no caching on fetch requests

export default async function Posts() {
    const fetchedPosts = await getPosts();
    const posts = fetchedPosts.success ? fetchedPosts.parsed : [];

    // Sort posts from newest to oldest
    posts.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return (
        <ProtectedRoute require="admin" redirectTo="/Login" validateToken>
            <PostsPage posts={posts} />
        </ProtectedRoute>
    );
}
