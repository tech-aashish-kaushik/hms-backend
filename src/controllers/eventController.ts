import { Response } from "express";
import {
    createEvent,
    deleteEvent,
    getEvent,
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
        eventData.userId = req?.user?._id;
        const event = await createEvent(eventData);
        REQUEST_SUCCESS(res, { data: event }, HTTP_STATUS_CODES.CREATED)
    } catch (error) {
        logger.error(`createEvent:controller:error - ${error}`);
        console.error(error);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};

export const getEventController = async (req: RequestWithUser, res: Response): Promise<void> => {
    logger.info('getEvent:controller:invoke');
    try {
        const { user } = req;
        const event = await getEvent({ userId: user?._id });
        REQUEST_SUCCESS(res, { data: event }, HTTP_STATUS_CODES.OK)
    } catch (error) {
        logger.error(`getEvent:controller:error - ${error}`);
        console.error(error);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};

export const deleteEventController = async (req: RequestWithUser, res: Response) => {
    logger.info('deleteEvent:controller:invoke');
    try {
        const userId = req?.user?._id;
        const eventId = req.params.id;

        const result = await deleteEvent(eventId, userId);

        if (!result) {
            return REQUEST_FAILURE(res, { error: ERROR_MESSAGES.NOT_FOUND }, HTTP_STATUS_CODES.NOT_FOUND)
        }

        REQUEST_SUCCESS(res, { data: { message: "Event deleted successfully" }, error: "" }, HTTP_STATUS_CODES.OK)
    } catch (error) {
        logger.error(`deleteEvent:controller:error - ${error}`);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};
