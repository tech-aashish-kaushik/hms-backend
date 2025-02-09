// src/services/ratingService.ts
import { Rating } from "../models/ratingModel";
import { IRating } from "../interfaces/ratingInterface";

export const addRating = async (ratingData: IRating): Promise<IRating> => {
    const rating = await Rating.create(ratingData);
    return rating;
};

export const getRatingsByProduct = async (productId: string): Promise<IRating[]> => {
    const ratings = await Rating.find({ product: productId });
    return ratings;
};

export const updateRating = async (
    ratingId: string,
    ratingData: Partial<IRating>
): Promise<IRating | null> => {
    const rating = await Rating.findByIdAndUpdate(ratingId, ratingData, { new: true });
    return rating;
};

export const deleteRating = async (ratingId: string): Promise<void> => {
    await Rating.findByIdAndDelete(ratingId);
};