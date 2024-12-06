import { HealthCareCard } from "./HelathCareCard";
import { IdCard } from "./IdCard";
import { StudentCard } from "./StudentCard";
import { User } from "./User";

export interface Group {
    id: number;
    name: string;
    createdAt: Date;
    createdBy: User;
    users: User[];
    idCards: IdCard[];
    healthCareCards: HealthCareCard[];
    studentCards: StudentCard[];
}