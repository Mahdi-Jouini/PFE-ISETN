import { Issue } from "./issue";

export interface Sprint {
    sprintNumber: string;
    creationDate: string;
    issuesNumber: number;
    state: 'Planned' | 'In Progress' | 'Completed';
    issues: Issue[];
  }