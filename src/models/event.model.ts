import { Schema, model } from "mongoose";
import { IEvent } from "../interfaces/eventInterface";
import { RepeatType, RepeatUnits } from "../constants/enum";

const eventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true, default: "" },
        date: {
            type: Date,
            validate: {
                validator: (value: Date) => value > new Date(),
                message: "Date must be in the future"
            },
            default: null,
        },
        category: { type: String, trim: true, default: "GENERAL" },
        repeat: {
            type: String,
            enum: Object.values(RepeatType),
            default: RepeatType.ONCE,
        },
        repeatDetails: {
            type: {
                frequency: { type: Number, required: true },
                unit: { type: String, enum: RepeatUnits, required: true },
                endDate: { type: Date },
            },
            required: function () { return this.repeat === RepeatType.CUSTOM; },
        },
        media: { type: [String], default: [] },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const Event = model<IEvent>("Event", eventSchema);
