import Joi from 'joi'
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { User } from '../models/user.model';
import { RequestWithUser } from '../interfaces/request';
import { REQUEST_FAILURE } from '../utils/response';
import logger from '../config/logger';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import { ERROR_MESSAGES } from '../constants/errorMessages';

const validateSignup = (req: Request, res: Response, next: NextFunction): void | Response => {
  logger.info('signup:validateSignup:invoke');

  const signupSchema = Joi.object({
    title: Joi.string().trim().required().valid('Mr.', 'Mrs.').messages({
      'any.only': 'Title must be "Mr." or "Mrs."',
      'string.empty': 'Title is required'
    }),
    firstName: Joi.string().trim().required().messages({
      'string.empty': 'First name is required'
    }),
    lastName: Joi.string().trim().required().messages({
      'string.empty': 'Last name is required'
    }),
    email: Joi.string().trim().email().required().messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required'
    }),
    phone: Joi.string().trim().length(10).pattern(/^\d+$/).required().messages({
      'string.length': 'Phone number must be exactly 10 digits',
      'string.pattern.base': 'Phone number must contain only numbers',
      'string.empty': 'Phone number is required'
    }),
    gender: Joi.string().trim().required().messages({
      'string.empty': 'Gender is required'
    }),
    password: Joi.string().trim().min(8).max(32).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot exceed 32 characters',
      'string.empty': 'Password is required'
    }),
  });

  const { error } = signupSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return REQUEST_FAILURE(res, { error: errorMessages }, HTTP_STATUS_CODES.BAD_REQUEST);
  }

  next();
};

const validateLogin = (req: Request, res: Response, next: NextFunction): void | Response => {
  logger.info('login:validateLogin:invoke');

  const loginSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().trim().min(8).max(32).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot exceed 32 characters',
      'string.empty': 'Password is required'
    })
  });

  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return REQUEST_FAILURE(res, { error: errorMessages }, HTTP_STATUS_CODES.BAD_REQUEST);
  }

  next();
};

const validateToken = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<Response | void> => {
  logger.info('validateToken::invoke');
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return REQUEST_FAILURE(res, { error: ERROR_MESSAGES.ACCESS_TOKEN_REQUIRED }, HTTP_STATUS_CODES.UNAUTHORIZED);
    }

    const decodedToken = await verifyToken(token) as { _id: string } | null;

    if (!decodedToken || !decodedToken._id) {
      return REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INVALID_TOKEN }, HTTP_STATUS_CODES.UNAUTHORIZED);
    }

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      return REQUEST_FAILURE(res, { error: ERROR_MESSAGES.USER_NOT_FOUND }, HTTP_STATUS_CODES.FORBIDDEN);
    }

    req.user = user;
    next();
  } catch (error: any) {
    logger.error(`validateToken::error`, error);
    if (error?.name === 'TokenExpiredError') {
      return REQUEST_FAILURE(res, { error: ERROR_MESSAGES.TOKEN_EXPIRED }, HTTP_STATUS_CODES.UNAUTHORIZED);
    }
    return REQUEST_FAILURE(res, { error: ERROR_MESSAGES.AUTH_FAIL }, HTTP_STATUS_CODES.FORBIDDEN);
  }
};

const validateRefreshToken = (req: RequestWithUser, res: Response, next: NextFunction): void | Response => {
  logger.info('validateRefreshToken::invoke');

  const schema = Joi.object({
    refreshToken: Joi.string().trim().required().messages({
      "string.empty": "Refresh token is required",
      "any.required": "Refresh token is required"
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return REQUEST_FAILURE(res, { error: errorMessages }, HTTP_STATUS_CODES.BAD_REQUEST);
  }

  next();
};

export { validateSignup, validateLogin, validateToken, validateRefreshToken };


