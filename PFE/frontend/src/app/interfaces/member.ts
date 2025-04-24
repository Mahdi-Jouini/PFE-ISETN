export interface Member {
    memberId: string;
    role: number ;
    user:{
        userId: string;
        avatar: string;
        firstName: string;
        lastName: string;
        emailAddress: string;
    } 
}