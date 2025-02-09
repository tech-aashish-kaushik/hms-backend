// src/models/ratingModel.ts
import { Schema, model } from "mongoose";
import { IRating } from "../interfaces/ratingInterface";

const ratingSchema = new Schema<IRating>(
    {
        product: { type: String, required: true }, // Product ID
        user: { type: String, required: true }, // User ID
        rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
        comment: { type: String }, // Optional comment
    },
    { timestamps: true }
);

export const Rating = model<IRating>("Rating", ratingSchema);