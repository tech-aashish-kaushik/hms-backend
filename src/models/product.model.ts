// src/models/productModel.ts
import { Schema, model } from "mongoose";
import { IProduct } from "../interfaces/productInterface";

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        stock: { type: Number, required: true },
        images: { type: [String], required: true },
    },
    { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);