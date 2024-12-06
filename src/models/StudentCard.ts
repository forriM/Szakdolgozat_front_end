import { User } from "./User";

export interface StudentCard {
    id: number
    image_front_url: string | undefined;
    image_back_url: string | undefined;
    user: User;
    name: string;
    cardNumber: string;
    expiryDate: Date | undefined;
    birthDate: Date | undefined;
    issueDate: Date | undefined;
    OMNUmber: string;
    school: string;
    address: string;
    placeOfBirth: string;
}