import logger from '../config/logger';
import { User } from '../models/user.model';
import { createAccessToken, verifyToken } from '../utils/auth';
import { isPasswordMatch } from '../utils/utils';

export const authenticateUser = async (email: string, password: string) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`authService:authenticateUser - Invalid credentials for email: ${email}`);
            return { success: false, error: 'Invalid credentials' };
        }

        // Validate password
        const isMatch = await isPasswordMatch(password, user.password);
        if (!isMatch) {
            logger.warn(`authService:authenticateUser - Invalid password for email: ${email}`);
            return { success: false, error: 'Invalid credentials' };
        }

        // Token payload
        const tokenPayload = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };

        // Generate access and refresh tokens
        const accessToken = await createAccessToken(tokenPayload);
        const refreshToken = await createAccessToken(tokenPayload, '365d');

        return {
            success: true,
            user: { ...tokenPayload, gender: user.gender },
            accessToken,
            refreshToken,
        };
    } catch (error) {
        logger.error(`authService:authenticateUser:error - ${error}`);
        throw new Error('Authentication failed');
    }
};

export const refreshUserToken = async (refreshToken: string) => {
    try {
        const decodedToken: any = await verifyToken(refreshToken);
        if (!decodedToken || !decodedToken._id) {
            logger.warn('authService:refreshUserToken - Invalid refresh token');
            return { success: false, error: 'Invalid refresh token' };
        }

        const user = await User.findById(decodedToken._id);
        if (!user) {
            logger.warn(`authService:refreshUserToken - No user found for token: ${decodedToken._id}`);
            return { success: false, error: 'User not found' };
        }

        // Prepare data for new tokens
        const tokenPayload = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };

        // Generate new access & refresh tokens
        const accessToken = await createAccessToken(tokenPayload);
        const newRefreshToken = await createAccessToken(tokenPayload, '365d');

        return {
            success: true,
            user: { ...tokenPayload, gender: user.gender },
            accessToken,
            refreshToken: newRefreshToken,
        };
    } catch (error) {
        logger.error(`authService:refreshUserToken:error - ${error}`);
        throw new Error('Failed to refresh token');
    }
};
