// src/controllers/ratingController.ts
import { Request, Response } from "express";
import { addRating, getRatingsByProduct, updateRating, deleteRating } from "../services/ratingService";
import { IRating } from "../interfaces/ratingInterface";
import { RequestWithUser } from "../interfaces/request";
import logger from "../config/logger";
import { REQUEST_FAILURE, REQUEST_SUCCESS } from "../utils/response";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const addRatingController = async (req: RequestWithUser, res: Response): Promise<void> => {
    logger.info('addRating:controller:invoke');
    try {
        const ratingData: IRating = req.body;
        const rating = await addRating(ratingData);
        REQUEST_SUCCESS(res, { data: rating }, HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        logger.error(`addRating:controller:error - ${error}`);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};

export const getRatingsByProductController = async (req: Request, res: Response): Promise<void> => {
    logger.info('getRatingsByProduct:controller:invoke');
    try {
        const { productId } = req.params;
        const ratings = await getRatingsByProduct(productId);
        REQUEST_SUCCESS(res, { data: ratings }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        logger.error(`getRatingsByProduct:controller:error - ${error}`);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};

export const updateRatingController = async (req: RequestWithUser, res: Response): Promise<void> => {
    logger.info('updateRating:controller:invoke');
    try {
        const { ratingId } = req.params;
        const ratingData: Partial<IRating> = req.body;
        const rating = await updateRating(ratingId, ratingData);
        if (!rating) {
            REQUEST_FAILURE(res, { error: "Rating not found" }, HTTP_STATUS_CODES.NOT_FOUND);
        }
        REQUEST_SUCCESS(res, { data: rating }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        logger.error(`updateRating:controller:error - ${error}`);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};

export const deleteRatingController = async (req: Request, res: Response): Promise<void> => {
    logger.info('deleteRating:controller:invoke');
    try {
        const { ratingId } = req.params;
        await deleteRating(ratingId);
        REQUEST_SUCCESS(res, { data: { message: "Rating deleted successfully" } }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        logger.error(`deleteRating:controller:error - ${error}`);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};