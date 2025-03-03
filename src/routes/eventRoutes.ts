import express from "express";
import {
    createEventController,
    getEventController
} from "../controllers/eventController";
import { validateToken } from "../middlewares/authMiddlewares";
import { validateCreateEvent } from "../middlewares/eventMiddleware";
import { validateParamsId } from "../middlewares/commonValidation";

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

/**
 * @swagger
 * /v1/events:
 *   get:
 *     summary: Get events for the authenticated user
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter events by category
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events starting from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events up to this date
 *       - in: query
 *         name: repeat
 *         schema:
 *           type: string
 *           enum: ["YEARLY", "HALF_YEARLY", "MONTHLY", "WEEKLY", "ONCE", "CUSTOM"]
 *         description: Filter events by repeat type
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
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
 *                       title:
 *                         type: string
 *                         example: "Doctor Appointment"
 *                       description:
 *                         type: string
 *                         example: "Annual check-up with Dr. Smith."
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-10T10:00:00.000Z"
 *                       category:
 *                         type: string
 *                         example: "Health"
 *                       repeat:
 *                         type: string
 *                         example: "MONTHLY"
 *                       repeatDetails:
 *                         type: object
 *                         properties:
 *                           frequency:
 *                             type: number
 *                             example: 2
 *                           unit:
 *                             type: string
 *                             example: "weeks"
 *                           endDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-12-31T23:59:59.000Z"
 *                       media:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["image1.jpg", "image2.jpg"]
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["appointment", "doctor"]
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
router.get("/",
    validateToken,
    // validateCreateEvent,
    getEventController
);

/**
 * @swagger
 * /v1/events/{eventId}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
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
 *                   example: "Event deleted successfully"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         description: Forbidden - You don't have permission to delete this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id",
    validateParamsId,
    validateToken,
    getEventController
);

export default router;