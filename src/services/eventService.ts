import { Event } from "../models/event.model";
import { IEvent, GetEventsQuery } from "../interfaces/eventInterface";
import mongoose, { Types } from "mongoose";

export const createEvent = async (eventData: IEvent): Promise<IEvent> => {
    const event = await Event.create(eventData);
    return event;
};

export const getEvent = async (query: GetEventsQuery): Promise<IEvent[]> => {
    const { userId, startDate, endDate, category, search, page = 1, limit = 10 } = query;

    const filter: any = { userId: userId }
    if (startDate) filter.date = { $gte: new Date(startDate) };
    if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const events = await Event.find(filter)
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return events;
};

export const getEventById = async (eventId: string, userId: Types.ObjectId | undefined): Promise<IEvent | null> => {
    const objectId = new mongoose.Types.ObjectId(eventId);
    return await Event.findOne({ _id: objectId, userId });
};


export const deleteEvent = async (eventId: string, userId: Types.ObjectId | undefined) => {
    const objectId = new mongoose.Types.ObjectId(eventId);
    const deletedEvent = await Event.findOneAndDelete({ _id: objectId, userId });
    return deletedEvent;
};

export const updateEvent = async (eventId: string, userId: Types.ObjectId | undefined, updateData: Partial<IEvent>): Promise<IEvent | null> => {
    const objectId = new mongoose.Types.ObjectId(eventId);
    const updatedEvent = await Event.findOneAndUpdate(
        { _id: objectId, userId },
        { $set: updateData },
        { new: true }
    );
    return updatedEvent;
};