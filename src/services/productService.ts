// src/services/productService.ts
import { Product } from "../models/product.model";
import { IProduct } from "../interfaces/productInterface";

export const createProduct = async (productData: IProduct): Promise<IProduct> => {
    const product = await Product.create(productData);
    return product;
};

export const getAllProducts = async (
    page: number = 1,
    limit: number = 10,
    filters: any = {}
): Promise<{ products: IProduct[]; totalCount: number }> => {
    const skip = (page - 1) * limit;
    const products = await Product.find(filters).skip(skip).limit(limit);
    const totalCount = await Product.countDocuments(filters);
    return { products, totalCount };
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
    const product = await Product.findById(id);
    return product;
};

export const updateProduct = async (
    id: string,
    productData: Partial<IProduct>
): Promise<IProduct | null> => {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    return product;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await Product.findByIdAndDelete(id);
};

export const searchProducts = async (
    query: string,
    category: string,
    minPrice: number,
    maxPrice: number
): Promise<IProduct[]> => {
    const filters: any = {};
    if (query) filters.name = { $regex: query, $options: "i" };
    if (category) filters.category = category;
    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = minPrice;
        if (maxPrice) filters.price.$lte = maxPrice;
    }
    const products = await Product.find(filters);
    return products;
};