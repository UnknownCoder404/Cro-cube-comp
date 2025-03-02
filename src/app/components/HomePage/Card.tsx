import styles from "./Cards.module.css";
import { CardProp } from "../../Types/cards";
import { useState, useEffect } from "react";
import Description from "./Description";

export default function Card({
    title,
    description,
    author,
    shouldRender,
    loggedIn,
    isPost,
}: CardProp) {
    const [shouldCardRender, setShouldCardRender] = useState(false);

    useEffect(() => {
        setShouldCardRender(shouldRender ? shouldRender(loggedIn) : true);
    }, [shouldRender, loggedIn]);

    if (!shouldCardRender) return null;

    return (
        <article className={styles.card} role="article">
            <div className={styles["card-inside-container"]}>
                <header className={styles["post-title-container"]}>
                    <h2 className={styles["post-title"]} aria-label={title}>
                        {title}
                    </h2>
                </header>
                <div
                    className={styles["post-description-container"]}
                    aria-label="Post Description"
                >
                    <Description description={description} isPost={!!isPost} />
                </div>
                {author && (
                    <footer className={styles["post-author-container"]}>
                        <p className={styles["post-author-p"]}>
                            <span aria-label="Posted by">Objavio</span>{" "}
                            <span
                                className={styles["post-author"]}
                                aria-label={author.username}
                            >
                                {author.username}
                            </span>
                        </p>
                    </footer>
                )}
            </div>
        </article>
    );
}
