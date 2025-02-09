import { Request, Response, NextFunction } from 'express';
import { REQUEST_FAILURE } from '../utils/response';
import logger from '../config/logger';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import mongoose from 'mongoose';

export const validateParamsId = (req: Request, res: Response, next: NextFunction): void | Response => {
    logger.info('product:validateDeleteProduct:invoke');

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return REQUEST_FAILURE(
            res,
            {
                error: [
                    {
                        "field": "id",
                        "message": "Invalid product ID format"
                    }
                ]
            },
            HTTP_STATUS_CODES.BAD_REQUEST);
    }

    next();
};