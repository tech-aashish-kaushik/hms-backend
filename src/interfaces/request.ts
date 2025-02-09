import { Request } from "express";
import { IUserSchema } from "../models/user.model";

export interface RequestWithUser extends Request {
    user?: IUserSchema;
}