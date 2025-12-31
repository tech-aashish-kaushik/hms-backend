import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwtConfig';
import logger from '../config/logger';

const createAccessToken = async (data = {}, expiresIn = jwtConfig.expiresIn) => {
    logger.info('createAccessToken::invoke');
    const token = jwt.sign(data, jwtConfig.secret, { expiresIn: expiresIn });
    return token
}

const verifyToken = async (token: string) => {
    logger.info('verifyToken::invoke');
    const decorderToken = await jwt.verify(token, jwtConfig.secret)
    return decorderToken
}

export {
    createAccessToken,
    verifyToken
}