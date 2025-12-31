import { CONFIG } from "../constants/config";

const jwtConfig = {
    secret: CONFIG.JWT_SECRET,
    expiresIn: '1h',
};

export default jwtConfig;