// src/interfaces/ratingInterface.ts
import { Document } from "mongoose";

export interface IRating extends Document {
    product: string; // Reference to the product ID
    user: string; // Reference to the user ID
    rating: number; // Rating value (e.g., 1 to 5)
    comment?: string; // Optional comment
    createdAt?: Date;
    updatedAt?: Date;
}