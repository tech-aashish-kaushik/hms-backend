import Joi from 'joi';
import { Response, NextFunction } from 'express';
import { REQUEST_FAILURE } from '../utils/response';
import logger from '../config/logger';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import { RequestWithUser } from '../interfaces/request';
import mongoose from 'mongoose';

const validateCreateProduct = (req: RequestWithUser, res: Response, next: NextFunction): void | Response => {
    logger.info('product:validateProduct:invoke');

    const productSchema = Joi.object({
        name: Joi.string().trim().min(3).max(100).required().messages({
            'string.empty': 'Product name is required',
            'string.min': 'Product name must be at least 3 characters',
            'string.max': 'Product name cannot exceed 100 characters',
        }),
        description: Joi.string().trim().min(10).max(500).required().messages({
            'string.empty': 'Product description is required',
            'string.min': 'Description must be at least 10 characters',
            'string.max': 'Description cannot exceed 500 characters',
        }),
        price: Joi.number().positive().precision(2).required().messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be a positive value',
            'any.required': 'Price is required',
        }),
        category: Joi.string().trim().min(3).max(50).required().messages({
            'string.empty': 'Category is required',
            'string.min': 'Category must be at least 3 characters',
            'string.max': 'Category cannot exceed 50 characters',
        }),
        stock: Joi.number().integer().min(0).required().messages({
            'number.base': 'Stock must be a number',
            'number.integer': 'Stock must be an integer',
            'number.min': 'Stock cannot be negative',
            'any.required': 'Stock is required',
        }),
        images: Joi.array().items(Joi.string().trim().required().messages({
            'string.empty': 'Image URL cannot be empty',
        })).min(1).required().messages({
            'array.min': 'At least one image URL is required',
            'any.required': 'Images field is required',
        }),
    });

    const { error } = productSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));

        return REQUEST_FAILURE(res, { error: errorMessages }, HTTP_STATUS_CODES.BAD_REQUEST);
    }

    next();
};

const validateProductUpdate = (req: RequestWithUser, res: Response, next: NextFunction): void | Response => {
    logger.info('product:validateProductUpdate:invoke');

    const updateProductSchema = Joi.object({
        name: Joi.string().trim().min(3).max(100).messages({
            'string.min': 'Product name must be at least 3 characters',
            'string.max': 'Product name cannot exceed 100 characters',
        }),
        description: Joi.string().trim().min(10).max(500).messages({
            'string.min': 'Description must be at least 10 characters',
            'string.max': 'Description cannot exceed 500 characters',
        }),
        price: Joi.number().positive().precision(2).messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be a positive value',
        }),
        category: Joi.string().trim().min(3).max(50).messages({
            'string.min': 'Category must be at least 3 characters',
            'string.max': 'Category cannot exceed 50 characters',
        }),
        stock: Joi.number().integer().min(0).messages({
            'number.base': 'Stock must be a number',
            'number.integer': 'Stock must be an integer',
            'number.min': 'Stock cannot be negative',
        }),
        images: Joi.array().items(Joi.string().trim().messages({
            'string.empty': 'Image URL cannot be empty',
        })).min(1).messages({
            'array.min': 'At least one image URL is required',
        }),
    }).min(1).messages({
        'object.min': 'At least one field is required for update',
    });

    const { error } = updateProductSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));

        return REQUEST_FAILURE(res, { error: errorMessages }, HTTP_STATUS_CODES.BAD_REQUEST);
    }

    next();
};

export { validateCreateProduct, validateProductUpdate };
