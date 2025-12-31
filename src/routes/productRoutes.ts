// src/routes/productRoutes.ts
import express from "express";
import {
    createProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController,
    searchProductsController,
} from "../controllers/productController";
import { validateToken } from "../middlewares/authMiddlewares";
import { validateCreateProduct, validateProductUpdate } from "../middlewares/productMiddlewares";
import { validateParamsId } from "../middlewares/commonValidation";


const router = express.Router();

/**
 * @swagger
 * /v1/products:
 *   get:
 *     summary: Get all products with optional filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of items per page (default is 10)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: "Electronics"
 *         description: Filter products by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           example: 100
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           example: 500
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: A list of products with pagination details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "64f1a23b6d1b2a3e4c5f6789"
 *                           name:
 *                             type: string
 *                             example: "Smartphone"
 *                           category:
 *                             type: string
 *                             example: "Electronics"
 *                           price:
 *                             type: number
 *                             example: 299.99
 *                     totalCount:
 *                       type: integer
 *                       example: 100 
 *                 error:
 *                   $ref: "#/components/emptyError"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.get("/", getAllProductsController);

/**
 * @swagger
 * /v1/products/{id}:
 *   get:
 *     summary: Get a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f1a23b6d1b2a3e4c5f6789"
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f1a23b6d1b2a3e4c5f6789"
 *                     name:
 *                       type: string
 *                       example: "Smartphone"
 *                     description:
 *                       type: string
 *                       example: "this is the description "
 *                     category:
 *                       type: string
 *                       example: "Electronics"
 *                     price:
 *                       type: number
 *                       example: 299.99
 *                     stock:
 *                       type: number
 *                       example: 30
 *                     images:
 *                       type: array
 *                       item:
 *                          type: string                              
 *                          example: imgEndpoint
 *                 error:
 *                   $ref: "#/components/emptyError"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: string
 *                   example: ""
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.get("/:id",
    validateParamsId,
    getProductByIdController
);

/**
 * @swagger
 * /v1/products/search:
 *   get:
 *     summary: Search for products based on query, category, and price range
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: false
 *         description: The search keyword to match product names or descriptions
 *         example: "Smartphone"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter products by category
 *         example: "Electronics"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum price filter
 *         example: 100
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum price filter
 *         example: 500
 *     responses:
 *       200:
 *         description: Products matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "64f1a23b6d1b2a3e4c5f6789"
 *                       name:
 *                         type: string
 *                         example: "Smartphone"
 *                       category:
 *                         type: string
 *                         example: "Electronics"
 *                       price:
 *                         type: number
 *                         example: 299.99
 *                 error:
 *                    $ref: "#/components/emptyError"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.get("/search", searchProductsController);

// Admin-only routes
/**
 * @swagger
 * /v1/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphone"
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               price:
 *                 type: number
 *                 example: 299.99
 *               stock:
 *                 type: number
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: "Latest model with advanced features."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["image1.jpg", "image2.jpg"]
 *     responses:
 *       201:
 *         description: Product successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f1a23b6d1b2a3e4c5f6789"
 *                     name:
 *                       type: string
 *                       example: "Smartphone"
 *                     category:
 *                       type: string
 *                       example: "Electronics"
 *                     price:
 *                       type: number
 *                       example: 299.99
 *                     stock:
 *                       type: number
 *                       example: 50
 *                     description:
 *                       type: string
 *                       example: "Latest model with advanced features."
 *                 error:
 *                   $ref: "#/components/emptyError"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         description: Forbidden - Only admin users can access this endpoint
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.post("/",
    validateToken,
    validateCreateProduct,
    createProductController
);

/**
 * @swagger
 * /v1/products/{id}:
 *   put:
 *     summary: Update an existing product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the product
 *         schema:
 *           type: string
 *           example: "64f1a23b6d1b2a3e4c5f6789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Smartphone"
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               price:
 *                 type: number
 *                 example: 349.99
 *               stock:
 *                 type: number
 *                 example: 30
 *               description:
 *                 type: string
 *                 example: "Updated model with improved features."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["updated_image1.jpg", "updated_image2.jpg"]
 *     responses:
 *       200:
 *         description: Product successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f1a23b6d1b2a3e4c5f6789"
 *                     name:
 *                       type: string
 *                       example: "Updated Smartphone"
 *                     category:
 *                       type: string
 *                       example: "Electronics"
 *                     price:
 *                       type: number
 *                       example: 349.99
 *                     stock:
 *                       type: number
 *                       example: 30
 *                     description:
 *                       type: string
 *                       example: "Updated model with improved features."
 *                 error:
 *                   $ref: "#/components/emptyError"

 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         description: Forbidden - Only admin users can update products
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.put("/:id",
    validateToken,
    validateParamsId,
    validateProductUpdate,
    updateProductController
);

/**
 * @swagger
 * /v1/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the product to delete
 *         schema:
 *           type: string
 *           example: "64f1a23b6d1b2a3e4c5f6789"
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                       message:
 *                          type: string
 *                          example: "Product deleted successfully"
 *                 error:
 *                   type: string
 *                   example: ""
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         description: Forbidden - Only admin users can delete products
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   $ref: "#/components/emptyError"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.delete("/:id",
    validateToken,
    validateParamsId,
    deleteProductController
);

export default router;