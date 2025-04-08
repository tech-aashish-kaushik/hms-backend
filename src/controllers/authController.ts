import { Request, Response } from 'express';
import { REQUEST_FAILURE, REQUEST_SUCCESS } from '../utils/response';
import logger from '../config/logger';
import { createUser } from '../services/userService';
import { authenticateUser, refreshUserToken } from '../services/authService';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { sendWelcomeEmail } from '../services/emailService';

const signup = async (req: Request, res: Response): Promise<void> => {
  logger.info('signup:controller:invoke');
  try {
    const { title, firstName, lastName, gender, email, phone, password } = req.body ?? {};
    const result = await createUser({ title, firstName, lastName, gender, email, phone, password });
    sendWelcomeEmail(email, firstName)
    REQUEST_SUCCESS(res, { data: { message: 'User created successfully', userId: result.userId } }, HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    logger.error(`signup:controller:error - ${error}`);
    REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  logger.info('login:controller:invoke');
  try {
    const { email, password } = req.body ?? {};

    const result = await authenticateUser(email, password);

    if (!result.success) {
      return REQUEST_FAILURE(res, { error: result.error }, HTTP_STATUS_CODES.UNAUTHORIZED);
    }

    // Send success response
    REQUEST_SUCCESS(res, {
      data: { message: 'Login successful', user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
    }, HTTP_STATUS_CODES.OK);

  } catch (error) {
    logger.error(`login:controller:error - ${error}`);
    REQUEST_FAILURE(
      res,
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  logger.info('refreshToken:controller:invoke');
  try {
    const { refreshToken } = req.body ?? {};

    const result = await refreshUserToken(refreshToken);

    if (!result.success) {
      return REQUEST_FAILURE(res, { error: result.error }, HTTP_STATUS_CODES.UNAUTHORIZED);
    }

    // Send success response
    REQUEST_SUCCESS(res, {
      data: { message: 'Token refreshed successfully', user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
    }, HTTP_STATUS_CODES.OK);

  } catch (error) {
    logger.error(`refreshToken:controller:error - ${error}`);
    REQUEST_FAILURE(
      res,
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

export { signup, login, refreshToken };
