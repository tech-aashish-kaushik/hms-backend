import { Response } from "express";
import {
    createEvent,
} from "../services/eventService";
import { IEvent } from "../interfaces/eventInterface";
import { RequestWithUser } from "../interfaces/request";
import { REQUEST_FAILURE, REQUEST_SUCCESS } from "../utils/response";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";
import logger from "../config/logger";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const createEventController = async (req: RequestWithUser, res: Response): Promise<void> => {
    logger.info('createEvent:controller:invoke');
    try {
        const eventData: IEvent = req.body;
        const event = await createEvent(eventData);
        REQUEST_SUCCESS(res, { data: event }, HTTP_STATUS_CODES.CREATED)
    } catch (error) {
        logger.error(`createEvent:controller:error - ${error}`);
        console.error(error);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};
