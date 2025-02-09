import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { CONFIG } from "../constants/config";

const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "Express API with Swagger",
            contact: {
                name: "Aashish Sharma",
                email: "er.aashish.kaushik@gmail.com",
            },
        },
        servers: [
            {
                url: CONFIG.SWAGGER_BASE_PATH,
                description: `${CONFIG.ENV_NAME} Server`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            emptyError: {
                type: "string",
                example: ""
            },
            responses: {
                UnauthorizedError: {
                    description: "Unauthorized - Token missing or invalid",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: false },
                                    error: { type: "string", example: "Unauthorized" },
                                },
                            },
                        },
                    },
                },
                ValidationError: {
                    description: "Validation failed for request body",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: false },
                                    data: { type: "string", example: "" },
                                    error: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                field: {
                                                    type: "string",
                                                    example: "field name"
                                                },
                                                message: {
                                                    type: "string",
                                                    example: "field value is required"
                                                },
                                            }
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                InternalServerError: {
                    description: "Something went wrong on the server",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: false },
                                    data: { type: "string", example: "" },
                                    error: { type: "string", example: "Internal server error" },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    apis: ["./src/routes/*.ts"], // Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Application): void => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default swaggerDocs;
