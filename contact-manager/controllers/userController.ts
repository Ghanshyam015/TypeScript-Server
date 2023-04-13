import {Request, Response} from "express";
import {APP_STATUS} from "../constants/constants";
import {validationResult} from "express-validator";
import UserTable from "../database/UserSchema";
import bcryptjs from 'bcryptjs';
import gravatar from "gravatar";
import {IUser} from "../model/IUser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserSchema from "../database/UserSchema";

/**
 * @usage : register a user
 *  @method : POST
 *  @params : username, email, password
 *  @url : http://localhost:9000/users/register
 *  @access : PUBLIC
 */
export const registerUser = async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }
    try {
        // read the form data
        let {username, email, password} = request.body;

        // check if the user is exists
        const userObj = await UserTable.findOne({email: email});
        if (userObj) {
            return response.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "The user is already exists"
            });
        }

        // password encryption
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);
        console.log(hashPassword);
        // gravatar url
        const imageUrl = gravatar.url(email, {
            size: "200",
            rating: 'pg',
            default: "mm"
        });

        // insert to db
        const newUser: IUser = {
            username: username,
            email: email,
            password: hashPassword,
            imageUrl: imageUrl,
            isAdmin: false
        }
        const theUserObj = await new UserTable(newUser).save();

        if (theUserObj) {
            return response.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: theUserObj,
                msg: "Registration is success!"
            });
        }
    } catch (error: any) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
}

/**
 * @usage : login a user
 *  @method : POST
 *  @params : email, password
 *  @url : http://localhost:9000/users/login
 *  @access : PUBLIC
 */
export const loginUser = async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }
    try {
        // read the form data
        let {email, password} = request.body;

        // check for email
        const userObj: IUser | undefined | null = await UserTable.findOne({email: email});
        if (!userObj) {
            return response.status(500).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "Invalid Email address!"
            });
        }
        // check for password
        let isMatch: boolean = await bcryptjs.compare(password, userObj.password);

        if (!isMatch) {
            return response.status(500).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "Invalid Password!"
            });
        }
// -----
        // create a token
        const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        
        const payload: any = {
            user: {
                id: userObj._id,
                email: userObj.email
            }
        };
        if (secretKey && payload) {
            jwt.sign(payload, secretKey, {
                expiresIn: 100000000000
            }, (error, encoded) => {
                if (error) throw error;
                if (encoded) {
                    return response.status(200).json({
                        status: APP_STATUS.SUCCESS,
                        data: userObj,
                        token: encoded,
                        msg: "Login is Success!"
                    })
                }
            })
        }
    } catch (error: any) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
}

/**
 * @usage : Get User Info
 *  @method : GET
 *  @params : no-params
 *  @url : http://localhost:9000/users/me
 *  @access : PRIVATE
 */
export const getUserInfo = async (request: Request, response: Response) => {
    try {
        const userObj: any = request.headers['user-data'];
        const userId = userObj.id;
        const mongoUserId = new mongoose.Types.ObjectId(userId);
        const userData: IUser | undefined | null = await UserTable.findById(mongoUserId);
        if (userData) {
            response.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: userData,
                msg: ""
            });     
        }
    } catch (error: any) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
}