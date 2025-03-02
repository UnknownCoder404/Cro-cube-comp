import { User, Users } from "../Types/solve";
import Select, { Props as SelectProps } from "react-select"; // Import Props

type UserSelectProps = {
    users: Users;
    setSelectedUser: (arg0: User) => void;
    disabled: boolean;
} & Omit<SelectProps, "options" | "onChange" | "isDisabled" | "defaultValue">; //  Extend SelectProps and Remove Duplicates

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
        <Select
            instanceId={"prefix"} // Random string fixes error
            defaultValue={firstUser}
            options={usersAsOptions}
            isLoading={disabled}
            isDisabled={disabled}
            isSearchable={true}
            onChange={(e) =>
                // @ts-expect-error We will fix this later, react-select is not typed correctly
                setSelectedUser(users.find((user) => user._id === e!.value)!)
            }
            {...rest} // Spread the rest of the props here
        />
    );
}

export default UserSelect;
