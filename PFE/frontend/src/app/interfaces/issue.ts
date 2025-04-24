export interface Issue {
    name: string;
    state: string;
    priority: string;
    assignedTo: string;
    type: 'Test' | 'Task' | 'Bug';
  }