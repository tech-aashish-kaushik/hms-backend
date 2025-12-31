import Joi from "joi";
import { Response, NextFunction } from "express";
import { REQUEST_FAILURE } from "../utils/response";
import logger from "../config/logger";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";
import { RequestWithUser } from "../interfaces/request";
import { RepeatType, RepeatUnits } from "../constants/enum";

const validateCreateEvent = (req: RequestWithUser, res: Response, next: NextFunction): void | Response => {
    logger.info("event:validateEvent:invoke");

    const EventSchema = Joi.object({
        title: Joi.string().trim().min(1).max(30).required().messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 1 character",
            "string.max": "Title cannot exceed 30 characters",
        }),
        description: Joi.string().trim().max(255).optional().messages({
            "string.max": "Description cannot exceed 255 characters",
        }),
        date: Joi.date().greater("now").optional().messages({
            "date.greater": "Date must be in the future",
        }),
        category: Joi.string().trim().max(50).optional().messages({
            "string.max": "Category cannot exceed 50 characters",
        }),
        repeat: Joi.string()
            .valid(...Object.values(RepeatType))
            .optional()
            .messages({
                "any.only": "Repeat must be one of YEARLY, HALF_YEARLY, MONTHLY, WEEKLY, CUSTOM",
            }),
        repeatDetails: Joi.object({
            frequency: Joi.number().integer().min(1).required(),
            unit: Joi.string().valid(...RepeatUnits).required(),
            endDate: Joi.date().greater("now").optional(),
        }).optional()
            .when("repeat", { is: RepeatType.CUSTOM, then: Joi.required() }),
        media: Joi.array().items(Joi.string().uri()).optional().messages({
            "array.includes": "Each media item must be a valid URL",
        }),
        tags: Joi.array().items(Joi.string().trim().max(30)).optional().messages({
            "array.includes": "Each tag must be a string up to 30 characters",
        }),
    });

    const { error } = EventSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => ({
            field: detail.path.join("."),
            message: detail.message,
        }));

        return REQUEST_FAILURE(res, { error: errorMessages }, HTTP_STATUS_CODES.BAD_REQUEST);
    }

    next();
};

export { validateCreateEvent };
