import express from "express";
import {
    createEventController
} from "../controllers/eventController";
import { validateToken } from "../middlewares/authMiddlewares";
import { validateCreateEvent } from "../middlewares/eventMiddleware";

const router = express.Router();

/**
 * @swagger
 * /v1/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Doctor Appointment"
 *               description:
 *                 type: string
 *                 example: "Annual check-up with Dr. Smith."
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-10T10:00:00.000Z"
 *               category:
 *                 type: string
 *                 example: "Health"
 *                 default: "GENERAL"
 *               repeat:
 *                 type: string
 *                 enum: ["YEARLY", "HALF_YEARLY", "MONTHLY", "WEEKLY", "ONCE", "CUSTOM"]
 *                 example: "MONTHLY"
 *               repeatDetails:
 *                 type: object
 *                 description: Required only if repeat type is "CUSTOM"
 *                 properties:
 *                   frequency:
 *                     type: number
 *                     example: 2
 *                   unit:
 *                     type: string
 *                     enum: ["days", "weeks", "months", "years"]
 *                     example: "weeks"
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-31T23:59:59.000Z"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["image1.jpg", "image2.jpg"]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["appointment", "doctor"]
 *     responses:
 *       201:
 *         description: Event successfully created
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
 *                     title:
 *                       type: string
 *                       example: "Doctor Appointment"
 *                     description:
 *                       type: string
 *                       example: "Annual check-up with Dr. Smith."
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-10T10:00:00.000Z"
 *                     category:
 *                       type: string
 *                       example: "Health"
 *                     repeat:
 *                       type: string
 *                       example: "MONTHLY"
 *                     repeatDetails:
 *                       type: object
 *                       properties:
 *                         frequency:
 *                           type: number
 *                           example: 2
 *                         unit:
 *                           type: string
 *                           example: "weeks"
 *                         endDate:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-12-31T23:59:59.000Z"
 *                     media:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["image1.jpg", "image2.jpg"]
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["appointment", "doctor"]
 *                 error:
 *                   $ref: "#/components/emptyError"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         description: Forbidden - Only authorized users can create events
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.post("/",
    validateToken,
    validateCreateEvent,
    createEventController
);

export default router;