// src/controllers/productController.ts
import { Request, Response } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
} from "../services/productService";
import { IProduct } from "../interfaces/productInterface";
import { RequestWithUser } from "../interfaces/request";
import { REQUEST_FAILURE, REQUEST_SUCCESS } from "../utils/response";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";
import logger from "../config/logger";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const createProductController = async (req: RequestWithUser, res: Response): Promise<void> => {
    logger.info('createProduct:controller:invoke');
    try {
        const productData: IProduct = req.body;
        const product = await createProduct(productData);
        REQUEST_SUCCESS(res, { data: product }, HTTP_STATUS_CODES.CREATED)
    } catch (error) {
        logger.error(`createProduct:controller:error - ${error}`);
        console.error(error);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};

export const getAllProductsController = async (req: Request, res: Response): Promise<void> => {
    logger.info('getAllProducts:controller:invoke');
    try {
        const { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;
        const filters: any = {};
        if (category) filters.category = category;
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = parseFloat(minPrice as string);
            if (maxPrice) filters.price.$lte = parseFloat(maxPrice as string);
        }
        const { products, totalCount } = await getAllProducts(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );
        REQUEST_SUCCESS(res, { data: { products, totalCount } }, HTTP_STATUS_CODES.OK)
    } catch (error) {
        logger.error(`getAllProducts:controller:error - ${error}`);
        console.error(error);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};

export const getProductByIdController = async (req: Request, res: Response): Promise<void> => {
    logger.info('getProductById:controller:invoke');
    try {
        const { id } = req.params;
        const product = await getProductById(id);
        if (!product) {
            REQUEST_FAILURE(res, { error: "Product not found" }, HTTP_STATUS_CODES.NOT_FOUND)
            return;
        }
        REQUEST_SUCCESS(res, { data: product }, HTTP_STATUS_CODES.OK)
    } catch (error) {
        logger.error(`getProductById:controller:error - ${error}`);
        console.error(error);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};

export const updateProductController = async (req: RequestWithUser, res: Response): Promise<void> => {
    logger.info('updateProduct:controller:invoke');
    try {
        const { id } = req.params;
        const productData: Partial<IProduct> = req.body;
        const product = await updateProduct(id, productData);
        if (!product) {
            REQUEST_FAILURE(res, { error: "Product not found" }, HTTP_STATUS_CODES.NOT_FOUND)
            return;
        }
        REQUEST_SUCCESS(res, { data: product }, HTTP_STATUS_CODES.OK)
    } catch (error) {
        logger.error(`updateProduct:controller:error - ${error}`);
        console.error(error);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};

export const deleteProductController = async (req: Request, res: Response): Promise<void> => {
    logger.info('deleteProduct:controller:invoke');
    try {
        const { id } = req.params;
        await deleteProduct(id);
        REQUEST_SUCCESS(res, { data: { message: "Product deleted successfully" } }, HTTP_STATUS_CODES.OK)
    } catch (error) {
        logger.error(`deleteProduct:controller:error - ${error}`);
        console.error(error);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};

export const searchProductsController = async (req: Request, res: Response): Promise<void> => {
    logger.info('searchProducts:controller:invoke');
    try {
        const { query, category, minPrice, maxPrice } = req.query;
        const products = await searchProducts(
            query as string,
            category as string,
            parseFloat(minPrice as string),
            parseFloat(maxPrice as string)
        );
        REQUEST_SUCCESS(res, { data: products }, HTTP_STATUS_CODES.OK)
    } catch (error) {
        logger.error(`searchProducts:controller:error - ${error}`);
        console.error(error);
        REQUEST_FAILURE(res, { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
};