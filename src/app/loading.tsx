import { Loader } from "./components/Loader/Loader";
import styles from "./Loading.module.css";
export default function LoadingPage() {
    return (
        <div className={styles["loadingContainer"]}>
            <Loader />
        </div>
    );
}
