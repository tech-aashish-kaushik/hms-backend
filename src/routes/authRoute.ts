import express from 'express'
import { refreshToken } from '../controllers/authController'
import { validateRefreshToken } from '../middlewares/authMiddlewares'

const authRouter = express.Router();

authRouter.post('/refreshToken', validateRefreshToken, refreshToken);

export {
    authRouter
}