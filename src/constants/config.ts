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
}

export const CONFIG: IConfig = {
    DATABASE_URI: process.env.DATABASE_URI || "mongodb://localhost:27017/mydb",
    JWT_SECRET: process.env.JWT_SECRET || "mysecretkey",
    PORT: Number(process.env.PORT) || 5001,
    SWAGGER_BASE_PATH: process.env.SWAGGER_BASE_PATH || "http://localhost:5001",
    ENV_NAME: (Object.values(ENV_NAME).includes(process.env.ENV_NAME as ENV_NAME)
        ? process.env.ENV_NAME
        : ENV_NAME.DEVELOPMENT) as ENV_NAME
};
