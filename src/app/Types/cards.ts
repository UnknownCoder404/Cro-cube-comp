export type CardProp = {
    title: string;
    description: React.ReactNode | string;
    author?: {
        username: string;
    };
    shouldRender?: (loggedIn?: boolean) => boolean;
    loggedIn?: boolean;
    isPost?: boolean;
};
