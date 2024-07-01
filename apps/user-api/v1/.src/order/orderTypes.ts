import { Document, Model, Schema, Types } from 'mongoose';
import { IProduct } from '../product/productTypes';
import { IUser } from '../user/userTypes';

export interface IOrderShippingInfo {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
    phoneNo: number;
}

export interface IOrderItem {
    name: string;
    price: number;
    quantity: number;
    image: string;
    product: string | Types.ObjectId | IProduct; // Adjust based on your schema and imports
}

export interface IPaymentInfo {
    id: string;
    status: string;
}

export interface IOrder extends Document {
    shippingInfo: IOrderShippingInfo;
    orderItems: IOrderItem[];
    user: string | Types.ObjectId | IUser; // Adjust based on your schema and imports
    paymentInfo: IPaymentInfo;
    paidAt: Date;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: string;
    deliveredAt?: Date | number;
    createdAt: Date;
}

export interface IOrderModel extends Model<IOrder> {}