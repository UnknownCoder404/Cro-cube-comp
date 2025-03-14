import { clsx } from "clsx";
import { isAdmin, Role } from "@/app/utils/credentials";
import dashboardStyles from "@/app/Dashboard/Dashboard.module.css";
import { assignAdminToUser, deleteUserById } from "@/app/utils/users";
import { useRouter } from "next/navigation";
import { User } from "@/app/Types/solve";
import { useAuth } from "@/app/context/AuthContext";

function DeleteUserButton({ id }: { id: string }) {
    const { userId } = useAuth();
    const router = useRouter();

    return (
        <button
            className={clsx(
                dashboardStyles["user-btn"],
                dashboardStyles["remove-btn"],
            )}
            onClick={async () => {
                if (id === userId) {
                    return alert("Ne možete izbrisati vlastiti računa.");
                }
                const userDeletion = await deleteUserById({ id });
                if (!userDeletion.success) {
                    return alert(
                        userDeletion.message ||
                            "Greška pri brisanju korisnika.",
                    );
                }
                router.refresh();
            }}
        >
            Izbriši
        </button>
    );
}

function AdminButton({ role, id }: { role: Role; id: string }) {
    const router = useRouter();

    return (
        <button
            className={clsx(dashboardStyles["user-btn"], {
                [dashboardStyles["remove-btn"]]: isAdmin(role),
                [dashboardStyles["add-btn"]]: !isAdmin(role),
            })}
            onClick={async () => {
                const adminAssignment = await assignAdminToUser({ id });
                if (!adminAssignment.success) {
                    return alert(
                        adminAssignment.message ||
                            "Greška pri dodavanju korisnika.",
                    );
                }
                router.refresh();
            }}
        >
            {isAdmin(role) ? "Makni ulogu admina" : "Postavi za admina"}
        </button>
    );
}

function CompButton({
    toggleCompVisibility,
}: {
    toggleCompVisibility: () => void;
}) {
    return (
        <button
            className={clsx(
                dashboardStyles["user-btn"],
                dashboardStyles["comp-btn"],
            )}
            onClick={toggleCompVisibility}
        >
            Natjecanje
        </button>
    );
}

type Props = {
    user: User;
    toggleCompVisibility: () => void;
};

export default function UserButtons({ user, toggleCompVisibility }: Props) {
    return (
        <div className={dashboardStyles["user-btns"]}>
            <DeleteUserButton id={user._id} />
            <AdminButton role={user.role} id={user._id} />
            <CompButton toggleCompVisibility={toggleCompVisibility} />
        </div>
    );
}
