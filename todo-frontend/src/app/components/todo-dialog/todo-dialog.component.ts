import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoService } from '../../services/todo.service';
import { ToDoListCreateDto, ToDoListGetDto } from '../../models/todo.model';

interface DialogData {
  mode: 'create' | 'edit';
  todo?: ToDoListGetDto;
}

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit {
  todoForm: FormGroup;
  isEditMode: boolean;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.todoForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.todo) {
      this.populateForm(this.data.todo);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      discription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      dueDate: ['', Validators.required],
      isCompleted: [false]
    });
  }

  private populateForm(todo: ToDoListGetDto): void {
    this.todoForm.patchValue({
      title: todo.title,
      discription: todo.discription,
      dueDate: new Date(todo.dueDate),
      isCompleted: todo.isCompleted
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.loading = true;
      
      if (this.isEditMode) {
        this.updateTodo();
      } else {
        this.createTodo();
      }
    }
  }

  private createTodo(): void {
    const formValue = this.todoForm.value;
    const createDto: ToDoListCreateDto = {
      title: formValue.title,
      discription: formValue.discription,
      dueDate: formValue.dueDate
    };

    this.todoService.createTodo(createDto).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error creating todo:', error);
        this.loading = false;
      }
    });
  }

  private updateTodo(): void {
    if (!this.data.todo) return;

    const formValue = this.todoForm.value;
    const updateDto: ToDoListGetDto = {
      ...this.data.todo,
      title: formValue.title,
      discription: formValue.discription,
      dueDate: formValue.dueDate,
      isCompleted: formValue.isCompleted
    };

    this.todoService.updateTodo(updateDto).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.todoForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('maxlength')) {
      return `${fieldName} is too long`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} is too short (minimum 10 characters)`;
    }
    return '';
  }
}