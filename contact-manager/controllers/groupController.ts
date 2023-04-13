import {Request, Response} from "express";
import {APP_STATUS} from "../constants/constants";
import {validationResult} from "express-validator";
import GroupsTable from "../database/GroupSchema";
import {IGroup} from "../model/IGroup";
import mongoose from "mongoose";

/**
 @usage : create group
 @method : POST
 @params : name
 @url : http://localhost:9000/groups
 */
export const createGroup = async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }
    try {
        let {name} = request.body;

        // check if the name already exists
        let group: IGroup | null | undefined = await GroupsTable.findOne({name: name});
        if (group) {
            return response.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "Name is already Exists"
            });
        }

        let theGroup: IGroup | null | undefined = await new GroupsTable({name: name}).save();
        if (theGroup) {
            return response.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: theGroup,
                msg: "Group is Created"
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
 @usage : to get all groups
 @method : GET
 @params : no-params
 @url : http://localhost:9000/groups
 */
export const getAllGroups = async (request: Request, response: Response) => {
    try {
        let groups: IGroup[] | undefined = await GroupsTable.find();
        if (groups) {
            return response.status(200).json(groups);
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
 @usage : to get a group
 @method : GET
 @params : no-params
 @url : http://localhost:9000/groups/:groupId
 */
export const getGroup = async (request: Request, response: Response) => {
    try {
        let {groupId} = request.params;
        const mongoGroupId = new mongoose.Types.ObjectId(groupId);
        let theGroup: IGroup | undefined | null = await GroupsTable.findById(mongoGroupId);
        if (!theGroup) {
            return response.status(404).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "No Group is found"
            });
        }
        return response.status(200).json(theGroup);
    } catch (error: any) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
}