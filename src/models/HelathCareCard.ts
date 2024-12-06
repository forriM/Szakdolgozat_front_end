import { User } from "./User";

export interface HealthCareCard {
    id: number
    image_front_url: string | undefined;
    user: User;
    name: string;
    birthDate: Date;
    issueDate: Date;
    cardNumber: string;
}