export const EVENT_MAPPINGS = {
    "3x3": "3x3",
    "3x3oh": "3x3 jednoručno",
    "4x4": "4x4",
    "2x2": "2x2",
    "3x3bld": "3x3 naslijepo",
    megaminx: "Megaminx",
    teambld: "Timsko naslijepo",
} as const;

export type EventCode = keyof typeof EVENT_MAPPINGS;

export const EVENT_CODES = Object.keys(EVENT_MAPPINGS) as EventCode[];

export function getDisplayName(eventCode: EventCode): string {
    return EVENT_MAPPINGS[eventCode];
}
