import {Request, Response, NextFunction} from 'express';
import {APP_STATUS} from "../constants/constants";
import jwt from "jsonwebtoken";

export const TokenMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        const token: string | string[] | undefined = request.headers['x-auth-token'];
        if (secretKey && token) {
            const decode: any = await jwt.verify(token.toString(), secretKey);
            if (decode) {
                request.headers['user-data'] = decode.user;
                next();
            } else {
                return response.status(401).json({
                    status: APP_STATUS.FAILED,
                    data: null,
                    error: "Unauthorized, Invalid token!"
                });
            }
        } else {
            return response.status(401).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "Unauthorized, No Token Provided!"
            });
        }
    } catch (error: any) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
};