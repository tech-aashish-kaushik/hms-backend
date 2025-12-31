export enum ENV_NAME {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production"
}

export interface IConfig {
    DATABASE_URI: string,
    JWT_SECRET: string,
    PORT: number,
    SWAGGER_BASE_PATH: string,
    ENV_NAME: ENV_NAME
    EMAIL_HOST: string,
    EMAIL_PORT: number,
    EMAIL_USER: string,
    EMAIL_PASS: string,
    EMAIL_FROM: string,
    EMAIL_SERVICE: string,
}

export const CONFIG: IConfig = {
    DATABASE_URI: process.env.DATABASE_URI || "mongodb://localhost:27017/mydb",
    JWT_SECRET: process.env.JWT_SECRET || "mysecretkey",
    PORT: Number(process.env.PORT) || 5001,
    SWAGGER_BASE_PATH: process.env.SWAGGER_BASE_PATH || "http://localhost:5001",
    ENV_NAME: (Object.values(ENV_NAME).includes(process.env.ENV_NAME as ENV_NAME)
        ? process.env.ENV_NAME
        : ENV_NAME.DEVELOPMENT) as ENV_NAME,
    EMAIL_HOST: process.env.EMAIL_HOST || "smtp.example.com",
    EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
    EMAIL_USER: process.env.EMAIL_USER || "your-email@example.com",
    EMAIL_PASS: process.env.EMAIL_PASS || "your-email-password",
    EMAIL_FROM: process.env.EMAIL_FROM || "no-reply@example.com",
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || "gmail",
};
