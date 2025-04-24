export interface Project { 
    projectId: string;
    title: string;
    description: string;
    link: string;
    createdDate: string
    productOwner:{
      avatar: string;
      firstName: string;
      lastName: string;
    }
}
