import { Issue } from "./issue";

export interface Sprint {
  sprintId: string,
  title: string,
  description: string,
  duration: string,
  sprintState: string,
  startDate: Date,
  completionDate: Date,
  projectId: string,
}