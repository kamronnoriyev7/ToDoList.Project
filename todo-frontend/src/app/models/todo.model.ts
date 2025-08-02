export interface ToDoListCreateDto {
  title: string;
  discription: string;
  dueDate: Date;
}

export interface ToDoListGetDto {
  id: number;
  title: string;
  discription: string;
  isCompleted: boolean;
  createdAt: Date;
  dueDate: Date;
}

export interface GetAllResponse {
  count: number;
  dtos: ToDoListGetDto[];
}

export interface TodoFilter {
  status: 'all' | 'completed' | 'incomplete';
  dueDate?: Date;
}