import { url } from "@/globals";
import { Posts } from "../Types/posts";
import { addToken, getToken } from "./credentials";
import { withTimeout } from "./helpers/withTimeout";

const TIMEOUT_DURATION = 5000; // Timeout in milliseconds

export async function getPosts(): Promise<{
    parsed: Posts;
    response: Response;
    statusCode: number;
    success: boolean;
}> {
    try {
        const postsUrl = new URL(url);
        postsUrl.pathname = "/posts";

        const response = await withTimeout(fetch(postsUrl), TIMEOUT_DURATION);
        const posts: Posts = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to fetch posts. Status: ${response.status}`,
            );
        }

        return {
            parsed: posts,
            response: response,
            statusCode: response.status,
            success: response.ok,
        };
    } catch (error: unknown) {
        throw new Error(`Error while getting posts: \n${error}`);
    }
}

export async function deletePost(id: string): Promise<{
    parsed: unknown;
    response: Response;
    statusCode: number;
    success: boolean;
}> {
    const token = getToken();
    if (!token) {
        throw new Error("No token found");
    }
    try {
        const postsUrl = new URL(url);
        postsUrl.pathname = `/posts/delete/${id}`;
        const response = await withTimeout(
            fetch(postsUrl, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            }),
            TIMEOUT_DURATION,
        );
        const postDeletion = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to delete post. Status: ${response.status}`,
            );
        }

        return {
            parsed: postDeletion,
            response: response,
            statusCode: response.status,
            success: response.ok,
        };
    } catch (error) {
        throw new Error(`Error deleting post: \n${error}`);
    }
}

export async function createPost(
    title: string,
    description: string,
): Promise<{
    parsed: unknown;
    response: Response;
    statusCode: number;
    success: boolean;
}> {
    if (!title || !description) {
        throw new Error("Title and description are required");
    }

    try {
        const headers =
            addToken({
                "Content-Type": "application/json",
            }) || {};
        const createPostUrl = new URL(url);
        createPostUrl.pathname = "/posts/new";

        const response = await withTimeout(
            fetch(createPostUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ title, description }),
            }),
            TIMEOUT_DURATION,
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                `Failed to create post. Status: ${response.status}`,
            );
        }

        return {
            success: response.ok,
            statusCode: response.status,
            parsed: data,
            response: response,
        };
    } catch (error) {
        throw new Error(`Error creating post: \n${error}`);
    }
}

export async function editPost(
    id: string,
    newTitle: string,
    newDescription: string,
): Promise<{
    parsed: unknown;
    response: Response;
    statusCode: number;
    success: boolean;
}> {
    if (!id || !newTitle || !newDescription) {
        throw new Error("New title, description, and ID are required.");
    }
    const headers =
        addToken({
            "Content-Type": "application/json",
        }) || {};
    const editPostUrl = new URL(url);
    editPostUrl.pathname = `/posts/edit/${id}`;
    try {
        const response = await withTimeout(
            fetch(editPostUrl, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                }),
            }),
            TIMEOUT_DURATION,
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to edit post. Status: ${response.status}`);
        }

        return {
            parsed: data,
            response: response,
            statusCode: response.status,
            success: response.ok,
        };
    } catch (error) {
        throw new Error(`Error editing post: \n${error}`);
    }
}

export function isErrorWithMessage(
    error: unknown,
): error is { message: string } {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
    );
}
