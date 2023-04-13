import mongoose from "mongoose";
import {IContact} from "../model/IContact";

const ContactSchema = new mongoose.Schema<IContact>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    name: {type: String, required: true},
    imageUrl: {type: String, required: true},
    mobile: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    company: {type: String, required: true},
    title: {type: String, required: true},
    groupId: {type: String, required: true},
}, {timestamps: true});

const ContactTable = mongoose.model<IContact>('contacts', ContactSchema);
export default ContactTable;