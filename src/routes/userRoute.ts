import express from 'express'
import { signup, login } from '../controllers/authController'
import { validateSignup, validateLogin, validateToken } from '../middlewares/authMiddlewares'
import { getUsersList } from '../controllers/userController';

const userRouter = express.Router();

/**
 * @swagger
 * /v1/user/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mr."
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User created successfully,
 *         content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  success:
 *                      type: boolean
 *                      example: true
 *                  data:
 *                      type: object
 *                      properties: 
 *                          message:
 *                              type: string
 *                              example: "User created successfully"
 *                          usedId:
 *                              type: string
 *                              example: "679f46dd234d37a5441b35eb"
 *                  error: 
 *                      $ref: "#/components/emptyError"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
userRouter.post('/signup', validateSignup, signup);

/**
 * @swagger
 * /v1/user/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and return access & refresh tokens.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aashish.sharma.2306@yopmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 32
 *                 example: Test@1234
 *     responses:
 *       200:
 *         description: Login successful
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
 *                     message:
 *                       type: string
 *                       example: "Login successful"
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "65afc123456789abcdef01234"
 *                         firstName:
 *                           type: string
 *                           example: "John"
 *                         lastName:
 *                           type: string
 *                           example: "Doe"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         phone:
 *                           type: string
 *                           example: "1234567890"
 *                         role:
 *                           type: string
 *                           example: "user"
 *                         gender:
 *                           type: string
 *                           example: "male"
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *                     error:
 *                       $ref: "#/components/emptyError"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         description: Invalid Credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: ""
 *                 error: 
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
userRouter.post('/login', validateLogin, login);

/**
 * @swagger
 * /v1/user/users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a paginated list of users. Requires a valid access token.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users to return per page.
 *     responses:
 *       200:
 *         description: A list of users retrieved successfully.
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
 *                     userList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           "_id":
 *                              type: string
 *                              example: "679f46dd234d37a5441b35eb"
 *                           title:
 *                             type: string
 *                             example: "Mr."
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
 *                           gender:
 *                             type: string
 *                             example: "Male"
 *                           role:
 *                             type: string
 *                             example: "user"
 *                           email:
 *                             type: string
 *                             example: "johndoe@example.com"
 *                           phone:
 *                             type: string
 *                             example: "1234567890"
 *                     totalCounts:
 *                       type: integer
 *                       example: 100
 *                 error:
 *                   $ref: "#/components/emptyError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         description: Forbidden - User not found or authentication failed.
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
 *                   example: "User not found"
 *       500:
 *         $ref: "#/components/responses/InternalServerError"
 */
userRouter.get('/users', validateToken, getUsersList);


export {
    userRouter
}