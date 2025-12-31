import { Response } from "express"
import logger from "../config/logger";

interface IData {
    data?: any;
    error?: any;
}

const defaultData = {
    data: "",
    error: ""
}

const REQUEST_FAILURE = (res: Response, resData: IData, statusCode = 400) => {
    logger.info('request_failure::invoke');
    res.status(statusCode).json({
        success: false,
        data: resData.data || defaultData.data,
        error: resData.error || defaultData.error
    });
}

const REQUEST_SUCCESS = (res: Response, resData: IData, statusCode = 200) => {
    logger.info('request_success::invoke');
    res.status(statusCode).json({
        success: true,
        data: resData.data || defaultData.data,
        error: resData.error || defaultData.error
    });
}

export {
    REQUEST_FAILURE,
    REQUEST_SUCCESS
}