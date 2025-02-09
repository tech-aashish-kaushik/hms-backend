import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import mongoose from 'mongoose';
import logger from './src/config/logger';
import connectDB from './src/config/db';
import { userRouter } from './src/routes/userRoute';
import { authRouter } from './src/routes/authRoute';
import productRouter from './src/routes/productRoutes';
import ratingRoutes from "./src/routes/ratingRoutes";

import { setupSwagger } from "./src/config/swaggerConfig";


const app: express.Application = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

setupSwagger(app);

// Routes
app.use('/v1/user', userRouter);
app.use('/v1/auth', authRouter);
app.use("/v1/products", productRouter);
app.use("/v1/ratings", ratingRoutes);


// Health Check Route
app.get('/', (req: express.Request, res: express.Response) => {
    logger.info('GET request received');
    res.status(200).send({ version: '1.0.0', status: 'Running' });
});

// Database Connection
const startServer = async () => {
    try {
        await connectDB(); // Ensure DB is connected before starting server

        mongoose.connection.once('open', () => {
            logger.info('DB: connected');
            app.listen(PORT, () => {
                logger.info(`Server running on port ${PORT}`);
            });
        });

        mongoose.connection.on('error', (err) => {
            logger.error('DB Connection Error:', err);
            process.exit(1); // Exit process if DB fails
        });

    } catch (error) {
        logger.error('Server Initialization Error:', error);
        process.exit(1); // Exit process on failure
    }
};

// Graceful Shutdown Handling
process.on('SIGINT', async () => {
    logger.info('SIGINT received, closing MongoDB connection...');
    await mongoose.connection.close();
    logger.info('MongoDB connection closed. Exiting process.');
    process.exit(0);
});

// Start the server
startServer();
