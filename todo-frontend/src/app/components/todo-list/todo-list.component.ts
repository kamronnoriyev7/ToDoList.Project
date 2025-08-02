import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { ToDoListGetDto, TodoFilter } from '../../models/todo.model';
import { MatDialog } from '@angular/material/dialog';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: ToDoListGetDto[] = [];
  totalCount = 0;
  currentPage = 0;
  pageSize = 10;
  loading = false;
  filter: TodoFilter = { status: 'all' };

  displayedColumns: string[] = ['title', 'description', 'status', 'createdAt', 'dueDate', 'actions'];

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    const skip = this.currentPage * this.pageSize;

    let request;
    switch (this.filter.status) {
      case 'completed':
        request = this.todoService.getCompletedTodos(skip, this.pageSize);
        break;
      case 'incomplete':
        request = this.todoService.getIncompleteTodos(skip, this.pageSize);
        break;
      default:
        request = this.todoService.getAllTodos(skip, this.pageSize);
    }

    request.subscribe({
      next: (response) => {
        this.todos = response.dtos;
        this.totalCount = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.loading = false;
        this.snackBar.open('Error loading todos', 'Close', { duration: 3000 });
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadTodos();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTodos();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTodos();
        this.snackBar.open('Todo created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditDialog(todo: ToDoListGetDto): void {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '500px',
      data: { mode: 'edit', todo: { ...todo } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTodos();
        this.snackBar.open('Todo updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  toggleComplete(todo: ToDoListGetDto): void {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    this.todoService.updateTodo(updatedTodo).subscribe({
      next: () => {
        this.loadTodos();
        this.snackBar.open('Todo status updated', 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        this.snackBar.open('Error updating todo', 'Close', { duration: 3000 });
      }
    });
  }

  deleteTodo(id: number): void {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.loadTodos();
          this.snackBar.open('Todo deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting todo:', error);
          this.snackBar.open('Error deleting todo', 'Close', { duration: 3000 });
        }
      });
    }
  }

  isOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }
}