import {Request, Response} from 'express';
import {APP_STATUS} from "../constants/constants";
import {validationResult} from "express-validator";
import ContactTable from "../database/ContactSchema";
import {IContact} from "../model/IContact";
import mongoose from "mongoose";
import {IUser} from "../model/IUser";
import UserTable from "../database/UserSchema";

/**
 @usage : to get all contacts
 @method : GET
 @params : no-params
 @url : http://localhost:9000/contacts
 */
export const getAllContacts = async (request: Request, response: Response) => {
    try {
        const userObj: any = request.headers['user-data'];
        const userId = userObj.id;
        const mongoUserId = new mongoose.Types.ObjectId(userId);
        const userData: IUser | undefined | null = await UserTable.findById(mongoUserId);
        if (!userData) {
            response.status(404).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "User is not found"
            });
        }
        let contacts: IContact[] | undefined = await ContactTable.find({user: new mongoose.Types.ObjectId(userId)}); // select * from contacts;
        if (contacts) {
            return response.status(200).json(contacts);
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
 @usage : get a contact
 @method : GET
 @params : no-params
 @url : http://localhost:9000/contacts/:contactId
 */
export const getContact = async (request: Request, response: Response) => {
    try {
        const userObj: any = request.headers['user-data'];
        const userId = userObj.id;
        const mongoUserId = new mongoose.Types.ObjectId(userId);
        const userData: IUser | undefined | null = await UserTable.findById(mongoUserId);
        if (!userData) {
            response.status(404).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "User is not found"
            });
        }
        let {contactId} = request.params;
        if (contactId) {
            const mongoContactId = new mongoose.Types.ObjectId(contactId); // string -> mongo id
            const contact: IContact | undefined | null = await ContactTable.findOne({
                _id: mongoContactId,
                user: mongoUserId
            });
            if (!contact) {
                return response.status(404).json({
                    status: APP_STATUS.FAILED,
                    data: null,
                    error: "No Contact found"
                });
            }
            return response.status(200).json(contact);
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
 @usage : create a contact
 @method : POST
 @params : name, imageUrl, email, mobile, company, title, groupId
 @url : http://localhost:9000/contacts/
 */
export const createContact = async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }
    try {
        const userObj: any = request.headers['user-data'];
        const userId = userObj.id;
        const mongoUserId = new mongoose.Types.ObjectId(userId);
        const userData: IUser | undefined | null = await UserTable.findById(mongoUserId);
        if (!userData) {
            response.status(404).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "User is not found"
            });
        }

        // read the form data
        let {name, imageUrl, email, mobile, company, title, groupId} = request.body;

        // check if the mobile exists
        let contact = await ContactTable.findOne({mobile: mobile});
        if (contact) {
            return response.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "Mobile number is already exists"
            });
        }
        // create
        let theContactObj: IContact = {
            user: userId,
            name: name,
            imageUrl: imageUrl,
            email: email,
            mobile: mobile,
            company: company,
            title: title,
            groupId: groupId
        }
        theContactObj = await new ContactTable(theContactObj).save();
        if (theContactObj) {
            return response.status(200).json(theContactObj);
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
 @usage : Update a contact
 @method : PUT
 @params : name, imageUrl, email, mobile, company, title, groupId
 @url : http://localhost:9000/contacts/:contactId
 */
export const updateContact = async (request: Request, response: Response) => {
    const {contactId} = request.params;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }
    try {
        const userObj: any = request.headers['user-data'];
        const userId = userObj.id;
        const mongoUserId = new mongoose.Types.ObjectId(userId);
        const userData: IUser | undefined | null = await UserTable.findById(mongoUserId);
        if (!userData) {
            response.status(404).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "User is not found"
            });
        }
        // read the form data
        let {name, imageUrl, email, mobile, company, title, groupId} = request.body;

        // check if the contact exists
        const mongoContactId = new mongoose.Types.ObjectId(contactId);
        let contact: IContact | null | undefined = await ContactTable.findOne({
            _id: mongoContactId,
            user: mongoUserId
        });
        if (!contact) {
            return response.status(404).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "Contact is not found"
            });
        }
        // update
        let theContactObj: IContact | null = {
            name: name,
            imageUrl: imageUrl,
            email: email,
            mobile: mobile,
            company: company,
            title: title,
            groupId: groupId
        }
        theContactObj = await ContactTable.findByIdAndUpdate(mongoContactId, {
            $set: theContactObj
        }, {new: true})
        if (theContactObj) {
            return response.status(200).json(theContactObj);
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
 @usage : Delete a contact
 @method : DELETE
 @params : no-params
 @url : http://localhost:9000/contacts/:contactId
 */
export const deleteContact = async (request: Request, response: Response) => {
    try {
        const userObj: any = request.headers['user-data'];
        const userId = userObj.id;
        const mongoUserId = new mongoose.Types.ObjectId(userId);
        const userData: IUser | undefined | null = await UserTable.findById(mongoUserId);
        if (!userData) {
            response.status(404).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "User is not found"
            });
        }
        let {contactId} = request.params;
        if (contactId) {
            const mongoContactId = new mongoose.Types.ObjectId(contactId); // string -> mongo id
            let contact: IContact | null | undefined = await ContactTable.findOne({
                _id: mongoContactId,
                user: mongoUserId
            });
            if (!contact) {
                return response.status(404).json({
                    status: APP_STATUS.FAILED,
                    data: null,
                    error: "No Contact found"
                });
            }
            let theContact: IContact | null = await ContactTable.findByIdAndDelete(mongoContactId);
            if (theContact) {
                return response.status(200).json({});
            }
        }
    } catch (error: any) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
}
