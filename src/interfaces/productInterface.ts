import { Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
    createdAt?: Date;
    updatedAt?: Date;
}