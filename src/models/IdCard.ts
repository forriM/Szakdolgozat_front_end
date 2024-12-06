import { User } from "./User";


export interface IdCard {
    id:number
    image_front_url: string;  // URL or path to the front image file
    image_back_url: string;   // URL or path to the back image file
    user: User;
    name: string;
    sex: 'male' | 'female';  // Union type for gender
    nationality: string;
    birthDate: Date;
    expiryDate: Date;
    identifier: string;
    can: string;
    mothersName:string;
    birthPlace:string;
}