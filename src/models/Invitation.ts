import { Group } from "./Group";
import { User } from "./User";

export interface Invitation{
    id:number
    sender: User
    receiver: User
    group:Group
}