import { Document } from "mongoose";
import { RepeatType } from "../constants/enum";

export interface IRepeatDetails {
    frequency: number; // e.g., repeat every X days/weeks/months
    unit: "days" | "weeks" | "months" | "years"; // Unit of repetition
    endDate?: Date; // Optional: Stop repeating after this date
}

export interface IEvent extends Document {
    title: string;
    description?: string;
    date?: Date;
    repeatDetails?: IRepeatDetails;
    category?: string;
    repeat?: RepeatType;
    media?: string[];
    tags?: string[]
    createdAt?: Date;
    updatedAt?: Date;
}