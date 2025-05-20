import { User } from "./user";

export interface Project { 
    projectId: string;
    title: string;
    description: string;
    link: string;
    createdDate: string,
    productOwner: User
}
