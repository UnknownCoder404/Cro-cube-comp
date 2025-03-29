import { Posts, Post as PostType } from "../Types/posts";
import styles from "./Posts.module.css";
import { deletePost, editPost } from "../utils/posts";
import { isErrorWithMessage } from "../utils/helpers/isErrorWIthMessage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../components/Loader/Loader";
import EditSvg from "../components/Svg/edit";
import DeleteSvg from "../components/Svg/delete";
import posthog from "posthog-js";

type Props = {
    posts: Posts;
};

function EditPostModal({
    post,
    isShown,
    onClose,
}: {
    post: PostType;
    isShown: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const modalRef = useRef<HTMLDialogElement>(null);
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTitle(post.title);
        setDescription(post.description);
    }, [post]);

    useEffect(() => {
        const dialog = modalRef.current;
        if (!dialog) return;

        if (isShown) dialog.showModal();
        else dialog.close();

        const handleDialogClose = () => onClose();
        dialog.addEventListener("close", handleDialogClose);
        return () => dialog.removeEventListener("close", handleDialogClose);
    }, [isShown, onClose]);

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { success } = await editPost(post.id, title, description);
            onClose();

            if (success) {
                router.refresh();
                posthog.capture("post_edit_successful", {
                    post_id: post.id,
                    post_title: title,
                    post_description: description,
                });
            }
        } catch (e) {
            const message = isErrorWithMessage(e)
                ? e.message
                : "Greška pri uređivanju objave.";
            posthog.capture("post_edit_failed", {
                post_id: post.id,
                new_title: title,
                new_description: description,
                old_title: post.title,
                old_description: post.description,
                error: message,
            });
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <dialog ref={modalRef} className={styles["edit-post-dialog"]}>
            <form onSubmit={handleEdit} className={styles["edit-post-form"]}>
                <input
                    type="text"
                    placeholder="Uredi naslov..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles["edit-title-input"]}
                />
                <textarea
                    placeholder="Uredi opis..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles["edit-description-textarea"]}
                />
                <button type="submit" className={styles["edit-submit-btn"]}>
                    {isLoading ? <Loader /> : "Uredi objavu"}
                </button>
            </form>
        </dialog>
    );
}

function PostButtons({ post }: { post: PostType }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const { success, parsed } = await deletePost(post.id);
            if (success) {
                router.refresh();
                posthog.capture("post_delete_successful", {
                    post_id: post.id,
                    post_title: post.title,
                    post_description: post.description,
                });
            } else {
                const errorMessage = isErrorWithMessage(parsed)
                    ? parsed.message
                    : "Greška pri brisanju objave.";
                posthog.capture("post_delete_failed", {
                    post_id: post.id,
                    post_title: post.title,
                    post_description: post.description,
                    error: errorMessage,
                });
                alert(errorMessage);
            }
        } catch (e) {
            const message = isErrorWithMessage(e)
                ? e.message
                : "Greška pri brisanju objave.";
            posthog.capture("post_delete_failed", {
                post_id: post.id,
                post_title: post.title,
                post_description: post.description,
                error: message,
            });
            alert(message);
        }
    };

    const toggleEditModal = () => setShowEditModal((prev) => !prev);

    return (
        <>
            <div className={styles["post-btns-container"]}>
                <button
                    onClick={handleDelete}
                    className={styles["delete-post-btn"]}
                >
                    <DeleteSvg fill="black" height="24px" width="24px" />
                </button>
                <button
                    onClick={toggleEditModal}
                    className={styles["edit-post-btn"]}
                >
                    <EditSvg width="24px" height="24px" fill="black" />
                </button>
            </div>
            <EditPostModal
                post={post}
                isShown={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </>
    );
}

function Post({ post }: { post: PostType }) {
    return (
        <div className={styles["post"]}>
            <h2 className={styles["post-title"]}>{post.title}</h2>
            <div
                className={styles["post-description"]}
                dangerouslySetInnerHTML={{ __html: post.description }}
            />
            <p>
                Objavio{" "}
                <span className={styles["post-author"]}>
                    {post.author.username}
                </span>
            </p>
            <PostButtons post={post} />
        </div>
    );
}

export default function PostsList({ posts }: Props) {
    return (
        <div className={styles["posts"]}>
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
