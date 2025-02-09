// src/routes/ratingRoutes.ts
import express from "express";
import {
    addRatingController,
    getRatingsByProductController,
    updateRatingController,
    deleteRatingController,
} from "../controllers/ratingController";
import { validateToken } from "../middlewares/authMiddlewares";

const router = express.Router();

// Add a rating (Authenticated users only)
/**
 * @swagger
 * /v1/ratings:
 *   post:
 *     summary: Add a rating to a product
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - user
 *               - rating
 *             properties:
 *               product:
 *                 type: string
 *                 description: The ID of the product being rated
 *                 example: "64f1a23b6d1b2a3e4c5f6789"
 *               user:
 *                 type: string
 *                 description: The ID of the user giving the rating
 *                 example: "659bc23b1c2d4f3e8b1a5678"
 *               rating:
 *                 type: number
 *                 description: Rating value (1-5)
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: Optional review text
 *                 example: "Great product, highly recommend!"
 *     responses:
 *       201:
 *         description: Rating added successfully
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
 *                     _id:
 *                       type: string
 *                       example: "6602f9b6e7d4a3c1b7a5e678"
 *                     productId:
 *                       type: string
 *                       example: "64f1a23b6d1b2a3e4c5f6789"
 *                     userId:
 *                       type: string
 *                       example: "659bc23b1c2d4f3e8b1a5678"
 *                     rating:
 *                       type: number
 *                       example: 4
 *                     review:
 *                       type: string
 *                       example: "Great product, highly recommend!"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.post("/", validateToken, addRatingController);

// Get ratings for a product (Public)
/**
 * @swagger
 * /v1/ratings/products/{productId}/ratings:
 *   get:
 *     summary: Get ratings for a product
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to get ratings for
 *     responses:
 *       200:
 *         description: Successful retrieval of product ratings
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
 *                   items: # Define the structure of each rating object in the array
 *                     type: object
 *                     properties:
 *                       _id:  # Example: Include the ID of the rating if applicable
 *                         type: string
 *                         example: "66030d7be8d5b4c2c8b6f789"
 *                       productId:
 *                         type: string
 *                         example: "64f1a23b6d1b2a3e4c5f6789"
 *                       userId: # Example: Include the user ID if you want to return it
 *                         type: string
 *                         example: "659bc23b1c2d4f3e8b1a5678"
 *                       rating:
 *                         type: number
 *                         example: 4
 *                       review: # Example: Include the review text if it exists
 *                         type: string
 *                         example: "Great product, highly recommend!"
 *                       createdAt: # Example: Include a timestamp
 *                         type: string
 *                         format: date-time
 *                         example: "2024-04-26T12:00:00.000Z"
 *                       updatedAt: # Example: Include a timestamp
 *                         type: string
 *                         format: date-time
 *                         example: "2024-04-26T12:00:00.000Z"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.get("/products/:productId/ratings", getRatingsByProductController);

// Update a rating (Authenticated users only)
/**
 * @swagger
 * /v1/ratings/{ratingId}:
 *   put:
 *     summary: Update a rating for a product
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the rating to update
 *         example: "6602f9b6e7d4a3c1b7a5e678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: New rating value (1-5)
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               review:
 *                 type: string
 *                 description: Optional updated review text
 *                 example: "Fantastic product, exceeded my expectations!"
 *     responses:
 *       200:
 *         description: Rating updated successfully
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
 *                     _id:
 *                       type: string
 *                       example: "6602f9b6e7d4a3c1b7a5e678"
 *                     productId:
 *                       type: string
 *                       example: "64f1a23b6d1b2a3e4c5f6789"
 *                     userId:
 *                       type: string
 *                       example: "659bc23b1c2d4f3e8b1a5678"
 *                     rating:
 *                       type: number
 *                       example: 5
 *                     review:
 *                       type: string
 *                       example: "Fantastic product, exceeded my expectations!"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         description: Rating not found
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
 *                   example: "Rating not found"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.put("/:ratingId", validateToken, updateRatingController);

// Delete a rating (Authenticated users only)
/**
 * @swagger
 * /v1/ratings/{ratingId}:
 *   delete:
 *     summary: Delete a rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the rating to delete
 *         example: "6602f9b6e7d4a3c1b7a5e678"
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Rating deleted successfully"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         description: Rating not found
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
 *                   example: "Rating not found"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.delete("/:ratingId", validateToken, deleteRatingController);

export default router;