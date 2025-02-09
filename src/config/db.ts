import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose';
import logger from './logger';
import { CONFIG } from '../constants/config';

const mongoURI: string = CONFIG.DATABASE_URI || "";

const connectDB = async () => {
    logger.info('Database:connectDB:invoke');
    mongoose.connect(mongoURI)
        .then(() => logger.info('Database:connectDB:connected'))
        .catch(err => console.error(err));
}

export default connectDB