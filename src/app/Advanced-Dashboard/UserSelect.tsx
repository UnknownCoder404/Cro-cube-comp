import { User, Users } from "../Types/solve";
import { Select as MantineSelect } from "@mantine/core";

type UserSelectProps = {
    users: Users;
    setSelectedUser: (user: User) => void;
    disabled: boolean;
} & Omit<
    React.ComponentPropsWithoutRef<typeof MantineSelect>,
    "data" | "onChange" | "defaultValue" | "value"
>;

function UserSelect({
    users,
    setSelectedUser,
    disabled,
    ...rest
}: UserSelectProps) {
    const usersAsOptions = users.map((user) => ({
        value: user._id,
        label: user.username,
    }));
    const firstUser = usersAsOptions[0];

    return (
        <MantineSelect
            disabled={disabled}
            data={usersAsOptions}
            defaultValue={firstUser?.value}
            searchable
            onChange={(value: string | null) => {
                if (value) {
                    const selected = users.find((user) => user._id === value);
                    if (selected) {
                        setSelectedUser(selected);
                    }
                }
            }}
            {...rest}
        />
    );
}

export default UserSelect;
