import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { io } from 'socket.io-client';
import { Task } from '../../Models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/tasks';
  private socket = io('http://localhost:5000');

  tasksSubject = new BehaviorSubject<Task[]>([]);
  socketId: string | undefined;

  constructor(private http: HttpClient) {
    this.socket.on('taskAdded', (task: Task) => {
      this.addTaskToList(task);
    });

    this.socket.on('taskUpdated', (task: Task) => {
      this.updateTaskInList(task);
    });

    this.socket.on('taskDeleted', (task: Task) => {
      this.deleteTaskFromList(task.id);
    });

    this.socket.on('connect', () => {
      this.socketId = this.socket.id;
    });
  }

  getTasks(): Observable<Task[]> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get<Task[]>(this.apiUrl, options).pipe(
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { headers: this.getHeaders() }).pipe(
      tap(newTask => {
        this.socket.emit('taskAdded', newTask);
      })
    );
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task, { headers: this.getHeaders() }).pipe(
      tap(updatedTask => {
        this.socket.emit('taskUpdated', updatedTask);
      })
    );
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`, { headers: this.getHeaders() }).pipe(
      tap(() => {
        this.socket.emit('taskDeleted', { id: taskId });
      })
    );
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('socket-id', this.socketId || '');
  }

  private addTaskToList(task: Task): void {
    const tasks = [...this.tasksSubject.value, task];
    this.tasksSubject.next(tasks);
  }

  private updateTaskInList(updatedTask: Task): void {
    const tasks = this.tasksSubject.value.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasksSubject.next(tasks);
  }

  private deleteTaskFromList(taskId: string): void {
    const tasks = this.tasksSubject.value.filter(task => task.id !== taskId);
    this.tasksSubject.next(tasks);
  }
}
