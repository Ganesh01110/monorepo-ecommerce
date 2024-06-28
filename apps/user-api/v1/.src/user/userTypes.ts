import { Document, Schema, Model } from 'mongoose';

export interface IAvatar {
    public_id: string;
    url: string;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: IAvatar;
    role: string;
    createdAt: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    _id:string;

    getJWTToken(): string;
    comparePassword(password: string): Promise<boolean>;
    getResetPasswordToken(): string;
}

export interface IUserModel extends Model<IUser> {}