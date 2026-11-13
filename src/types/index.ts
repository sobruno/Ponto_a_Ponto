export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: TaskStatus;
  priority: TaskPriority;
  colorStart: string; // Hex color for gradient start
  colorEnd: string;   // Hex color for gradient end
  timeSpentSeconds: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSession {
  id: string;
  taskId: string;
  taskTitle: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
}
