import { Schema, model } from "mongoose";
import { IEvent } from "../interfaces/eventInterface";
import { RepeatType, RepeatUnits } from "../constants/enum";

const eventSchema = new Schema<IEvent>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true, default: "" },
        date: {
            type: Date,
            validate: {
                validator: function (value: Date | null) {
                    return value === null || value > new Date();
                },
                message: "Date must be in the future",
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
