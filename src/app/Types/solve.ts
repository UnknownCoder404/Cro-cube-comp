import { Role } from "../utils/credentials";
import { EventCode } from "../utils/eventMappings";

export type UserEvent = {
    event: EventCode;
    rounds: number[][];
};

export type UserComp = {
    competitionId: string;
    events: UserEvent[];
};

export type User = {
    _id: string;
    username: string;
    password: string;
    role: Role;
    competitions: UserComp[];
    group: 1 | 2;
};

export type Users = User[];

export type EventDetail = {
    name: EventCode;
    rounds: number;
};
export type CompetitionType = {
    _id: string;
    name: string;
    date: string; // ISO date string
    isLocked: boolean;
    events: EventDetail[];
};
export type CompetitionResultType = {
    date: string;
    isLocked: boolean;
    events: {
        [key in EventCode]: Result[][];
    };
};
export type CompetitionResultsType = {
    [key: string]: CompetitionResultType;
};

export type Result = {
    userId: "string";
    group: number;
    average: string;
    username: string;
    solves: number[];
};
