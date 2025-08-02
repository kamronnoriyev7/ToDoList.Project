import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDoListCreateDto, ToDoListGetDto, GetAllResponse } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:5106/api/ToDOList';

  constructor(private http: HttpClient) {}

  createTodo(todo: ToDoListCreateDto): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/Create`, todo);
  }

  getTodoById(id: number): Observable<ToDoListGetDto> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<ToDoListGetDto>(`${this.apiUrl}/GetById`, { params });
  }

  getAllTodos(skip: number = 0, take: number = 10): Observable<GetAllResponse> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('take', take.toString());
    return this.http.get<GetAllResponse>(`${this.apiUrl}/GetAll`, { params });
  }

  getCompletedTodos(skip: number = 0, take: number = 10): Observable<GetAllResponse> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('take', take.toString());
    return this.http.get<GetAllResponse>(`${this.apiUrl}/SelectCompletedAsync`, { params });
  }

  getIncompleteTodos(skip: number = 0, take: number = 10): Observable<GetAllResponse> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('take', take.toString());
    return this.http.get<GetAllResponse>(`${this.apiUrl}/SelectIncompleteAsync`, { params });
  }

  getTodosByDueDate(date: Date): Observable<GetAllResponse> {
    const params = new HttpParams().set('data', date.toISOString());
    return this.http.get<GetAllResponse>(`${this.apiUrl}/SelectByDueDateAsync`, { params });
  }

  updateTodo(todo: ToDoListGetDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Update`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/Delete`, { params });
  }
}