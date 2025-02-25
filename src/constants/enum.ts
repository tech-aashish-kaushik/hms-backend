export enum RepeatType {
    YEARLY = "YEARLY",
    HALF_YEARLY = "HALF_YEARLY",
    MONTHLY = "MONTHLY",
    WEEKLY = "WEEKLY",
    ONCE = "ONCE",
    CUSTOM = "CUSTOM",
}

export const RepeatUnits = ["days", "weeks", "months", "years"] as const;
