import Image from "next/image";
import { Posts, Post as PostType } from "../Types/posts";
import styles from "./Posts.module.css";
import deleteIcon from "@/app/public/delete.svg";
import editIcon from "@/app/public/edit.svg";
import { deletePost, editPost } from "../utils/posts";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../components/Loader/Loader";

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

        isShown ? dialog.showModal() : dialog.close();

        const handleDialogClose = () => onClose();
        dialog.addEventListener("close", handleDialogClose);
        return () => dialog.removeEventListener("close", handleDialogClose);
    }, [isShown, onClose]);

    const handleEdit = async () => {
        setIsLoading(true);
        try {
            const { success } = await editPost(post.id, title, description);
            if (success) router.refresh();
        } catch {
            alert("An error occurred while editing the post.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <dialog ref={modalRef} className={styles["edit-post-dialog"]}>
            <form onSubmit={handleEdit} className={styles["edit-post-form"]}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles["edit-title-input"]}
                />
                <textarea
                    placeholder="Description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles["edit-description-textarea"]}
                />
                <button type="submit" className={styles["edit-submit-btn"]}>
                    {isLoading ? <Loader /> : "Edit Post"}
                </button>
            </form>
        </dialog>
    );
}

function PostButtons({ post }: { post: PostType }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const { success, parsed } = await deletePost(post.id);
        if (!success) alert(parsed?.message || "Error deleting post.");
        router.refresh();
    };

    const toggleEditModal = () => setShowEditModal((prev) => !prev);

    return (
        <>
            <div className={styles["post-btns-container"]}>
                <button
                    onClick={handleDelete}
                    className={styles["delete-post-btn"]}
                >
                    <Image
                        src={deleteIcon}
                        alt="Delete"
                        width={24}
                        height={24}
                    />
                </button>
                <button
                    onClick={toggleEditModal}
                    className={styles["edit-post-btn"]}
                >
                    <Image src={editIcon} alt="Edit" width={24} height={24} />
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
            <p className={styles["post-author"]}>
                Posted by {post.author.username}
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
