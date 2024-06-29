import { Document, Schema, Model } from 'mongoose';
import { IUser } from '../user/userTypes';

export interface IImage {
    public_id: string;
    url: string;
}

export interface IReview {
    user: string; // Assuming user ID for simplicity, you can adjust as per your user model
    name: string;
    rating: number;
    comment: string;
    _id?:string;
}

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    ratings: number;
    images: IImage[];
    category: string;
    stock: number;
    numOfReviews: number;
    reviews: IReview[];
    user:string | IUser ;// Assuming user ID for simplicity
    createdAt: Date;
    // id:string;
}

export interface IProductModel extends Model<IProduct> {}
