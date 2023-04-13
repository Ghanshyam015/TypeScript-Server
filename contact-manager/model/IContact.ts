export interface IContact {
    _id?: string;
    user?: string;
    name: string;
    imageUrl: string;
    mobile: string;
    email: string;
    company: string;
    title: string;
    groupId: string;
    createdAt?: Date;
    updatedAt?: Date;
}