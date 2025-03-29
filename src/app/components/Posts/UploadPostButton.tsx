import { createPost } from "@/app/utils/posts";
import styles from "../../Posts/Posts.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "../Loader/Loader";
import { markdownToHtml } from "@/app/utils/markdown";
import { clsx } from "clsx";
import { isErrorWithMessage } from "@/app/utils/helpers/isErrorWIthMessage";
import posthog from "posthog-js";

type Props = {
    title: string;
    description: string;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
};
export default function UploadPostButton({
    title,
    description,
    setDescription,
    setTitle,
}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function createThisPost() {
        try {
            const descriptionAsHtml = markdownToHtml(description);
            setIsLoading(true);
            const postCreation = await createPost(title, descriptionAsHtml);
            if (postCreation.success) {
                router.refresh();
                setTitle("");
                setDescription("");
                posthog.capture("post_creation_success", {
                    title,
                    descriptionAsHtml,
                });
            } else {
                const errorMsg = isErrorWithMessage(postCreation.parsed)
                    ? postCreation.parsed.message
                    : "Greška prilikom izrade objave.";
                posthog.capture("post_creation_failure", {
                    title,
                    error: errorMsg,
                });
                alert(errorMsg);
            }
        } catch (error) {
            console.error("Error creating post:", error);
            posthog.capture("create_post_failure", {
                title,
                error:
                    error instanceof Error ? error.message : "Nepoznata greška",
                description,
            });
            alert("Dogodila se greška prilikom izrade objave.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            disabled={!title.trim() || !description.trim()}
            onClick={createThisPost}
            className={clsx(styles["post-btn"], {
                [styles["loading"]]: isLoading,
            })}
        >
            {isLoading ? <Loader /> : "Objavi"}
        </button>
    );
}
