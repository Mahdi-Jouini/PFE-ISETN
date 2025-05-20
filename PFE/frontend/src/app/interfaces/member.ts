export interface Member {
    memberId: string;
    role: string ;
    user:{
        userId: string;
        avatar: string;
        firstName: string;
        lastName: string;
        emailAddress: string;
    } 
}