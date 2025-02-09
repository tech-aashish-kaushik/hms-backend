import logger from '../config/logger';
import { User } from '../models/user.model';
import { encryptPassword } from '../utils/utils';

interface UserInput {
    title?: string;
    firstName: string;
    lastName: string;
    gender?: string;
    email: string;
    phone?: string;
    password: string;
}

export const createUser = async (userData: UserInput) => {
    try {
        const { password, ...otherDetails } = userData;

        // Hash the password
        const hashedPassword = await encryptPassword(password);

        // Create and save the user
        const user = new User({ ...otherDetails, password: hashedPassword });
        const savedUser = await user.save();

        logger.info(`userService:createUser:success - User ${savedUser.id} created`);
        return { success: true, userId: savedUser.id };
    } catch (error) {
        logger.error(`userService:createUser:error - ${error}`);
        throw new Error('Error creating user');
    }
};
