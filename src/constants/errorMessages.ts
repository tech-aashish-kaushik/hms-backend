export interface IErrorMessages {
    USER_NOT_FOUND: string,
    INVALID_CREDENTIALS: string,
    ACCESS_DENIED: string,
    INTERNAL_SERVER_ERROR: string,
    ACCESS_TOKEN_REQUIRED: string,
    INVALID_TOKEN: string,
    AUTH_FAIL: string
}

export const ERROR_MESSAGES: IErrorMessages = {
    USER_NOT_FOUND: "User not found",
    INVALID_CREDENTIALS: "Invalid credentials",
    ACCESS_DENIED: "Access denied",
    INTERNAL_SERVER_ERROR: "Internal server error",
    ACCESS_TOKEN_REQUIRED: "Access token is required",
    INVALID_TOKEN: "Invalid or expired token",
    AUTH_FAIL: "Authentication failed"
};