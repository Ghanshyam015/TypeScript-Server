import {Router, Request, Response} from 'express';
import * as contactController from "../controllers/contactController";
import {body} from 'express-validator';
import {TokenMiddleware} from "../middlewares/TokenMiddleware";

const contactRouter: Router = Router();

/**
 @usage : to get all contacts
 @method : GET
 @params : no-params
 @url : http://localhost:9000/contacts
 */
contactRouter.get("/", TokenMiddleware, async (request: Request, response: Response) => {
    await contactController.getAllContacts(request, response);
});


/**
 @usage : get a contact
 @method : GET
 @params : no-params
 @url : http://localhost:9000/contacts/:contactId
 */
contactRouter.get("/:contactId", TokenMiddleware, async (request: Request, response: Response) => {
    await contactController.getContact(request, response);
});


/**
 @usage : create a contact
 @method : POST
 @params : name, imageUrl, email, mobile, company, title, groupId
 @url : http://localhost:9000/contacts/
 */
contactRouter.post("/", TokenMiddleware, [
    body('name').not().isEmpty().withMessage("Name is Required"),
    body('imageUrl').not().isEmpty().withMessage("imageUrl is Required"),
    body('email').not().isEmpty().withMessage("email is Required"),
    body('mobile').not().isEmpty().withMessage("mobile is Required"),
    body('company').not().isEmpty().withMessage("company is Required"),
    body('title').not().isEmpty().withMessage("title is Required"),
    body('groupId').not().isEmpty().withMessage("groupId is Required"),
], async (request: Request, response: Response) => {
    await contactController.createContact(request, response);
});


/**
 @usage : Update a contact
 @method : PUT
 @params : name, imageUrl, email, mobile, company, title, groupId
 @url : http://localhost:9000/contacts/:contactId
 */
contactRouter.put("/:contactId", TokenMiddleware, [
    body('name').not().isEmpty().withMessage("Name is Required"),
    body('imageUrl').not().isEmpty().withMessage("imageUrl is Required"),
    body('email').not().isEmpty().withMessage("email is Required"),
    body('mobile').not().isEmpty().withMessage("mobile is Required"),
    body('company').not().isEmpty().withMessage("company is Required"),
    body('title').not().isEmpty().withMessage("title is Required"),
    body('groupId').not().isEmpty().withMessage("groupId is Required"),
], async (request: Request, response: Response) => {
    await contactController.updateContact(request, response);
});


/**
 @usage : Delete a contact
 @method : DELETE
 @params : no-params
 @url : http://localhost:9000/contacts/:contactId
 */
contactRouter.delete("/:contactId", TokenMiddleware, async (request: Request, response: Response) => {
    await contactController.deleteContact(request, response);
});

export default contactRouter;