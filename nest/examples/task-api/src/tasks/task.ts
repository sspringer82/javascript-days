export interface Task {
  id: number;
  ownerId: number;
  title: string;
  done: boolean;
  createdAt: string;
}

export type NewTask = Pick<Task, 'ownerId' | 'title'>;
export type TaskChanges = Partial<Pick<Task, 'title' | 'done'>>;

export interface TaskFilter {
  done?: boolean;
  limit: number;
  offset: number;
}
