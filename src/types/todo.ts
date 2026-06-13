export type Priority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind class color for backgrounds
  textColor: string; // Tailwind class color for text
  borderColor: string; // Tailwind class color for border
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  priority: Priority;
  categoryId: string;
  createdAt: string;
}

export type ActiveTab = 'tasks' | 'analytics' | 'calendar' | 'finance';
