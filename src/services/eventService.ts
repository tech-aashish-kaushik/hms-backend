import { Event } from "../models/event.model";
import { IEvent } from "../interfaces/eventInterface";

export const createEvent = async (eventData: IEvent): Promise<IEvent> => {
    const event = await Event.create(eventData);
    return event;
};