import {Router, Request, Response} from 'express';
import {body} from 'express-validator';
import * as UserController from "../controllers/userController";
import {TokenMiddleware} from "../middlewares/TokenMiddleware";

const userRouter: Router = Router();

/**
 * @usage : register a user
 *  @method : POST
 *  @params : username, email, password
 *  @url : http://localhost:9000/users/register
 */
userRouter.post("/register", [
    body('username').not().isEmpty().withMessage("Username is Required"),
    body('email').isEmail().withMessage("Proper Email is Required"),
    body('password').isStrongPassword().withMessage("Strong Password is Required")
], async (request: Request, response: Response) => {
    await UserController.registerUser(request, response);
});

/**
 * @usage : login a user
 *  @method : POST
 *  @params : email, password
 *  @url : http://localhost:9000/users/login
 *   @access : PUBLIC
 */
userRouter.post("/login", [
    body('email').isEmail().withMessage("Proper Email is Required"),
    body('password').isStrongPassword().withMessage("Strong Password is Required")
], async (request: Request, response: Response) => {
    await UserController.loginUser(request, response);
});

/**
 * @usage : Get User Info
 *  @method : GET
 *  @params : no-params
 *  @url : http://localhost:9000/users/me
 *  @access : PRIVATE
 */
userRouter.get("/me", TokenMiddleware, async (request: Request, response: Response) => {
    await UserController.getUserInfo(request, response);
});
export default userRouter;