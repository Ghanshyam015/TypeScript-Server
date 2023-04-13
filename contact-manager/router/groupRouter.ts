import {Router, Request, Response} from 'express';
import * as groupController from "../controllers/groupController";
import {body} from "express-validator";

const groupRouter: Router = Router();


/**
 @usage : to get all groups
 @method : GET
 @params : no-params
 @url : http://localhost:9000/groups
 */
groupRouter.get("/", async (request: Request, response: Response) => {
    await groupController.getAllGroups(request, response);
});

/**
 @usage : create group
 @method : POST
 @params : name
 @url : http://localhost:9000/groups
 */
groupRouter.post("/", [
    body('name').not().isEmpty().withMessage("Name is Required")
], async (request: Request, response: Response) => {
    await groupController.createGroup(request, response);
});


/**
 @usage : to get a group
 @method : GET
 @params : no-params
 @url : http://localhost:9000/groups/:groupId
 */
groupRouter.get("/:groupId", async (request: Request, response: Response) => {
    await groupController.getGroup(request, response);
});

export default groupRouter;