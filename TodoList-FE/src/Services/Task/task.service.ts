import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { io } from 'socket.io-client';
import { Task } from '../../Models/task.model';
import { config } from '../../app/config/config';
import { TaskEvents } from '../../Enums/task-events.enum' 

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = config.apiUrl; 
  private socket = io(config.socketUrl); 

  tasksSubject = new BehaviorSubject<Task[]>([]);
  socketId: string | undefined;

  constructor(private http: HttpClient) {
    this.socket.on(TaskEvents.TaskAdded, (task: Task) => {
      this.addTaskToList(task);
    });

    this.socket.on(TaskEvents.TaskUpdated, (task: Task) => {
      this.updateTaskInList(task);
    });

    this.socket.on(TaskEvents.TaskDeleted, (task: Task) => {
      this.deleteTaskFromList(task.id);
    });

    this.socket.on(TaskEvents.SocketConnect, () => {  
      this.socketId = this.socket.id;
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(newTask => {
        this.socket.emit(TaskEvents.TaskAdded, newTask);  
      })
    );
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task, { headers: this.getHeaders() }).pipe(
      tap(updatedTask => {
        this.socket.emit(TaskEvents.TaskUpdated, updatedTask);  
      })
    );
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`).pipe(
      tap(() => {
        this.socket.emit(TaskEvents.TaskDeleted, { id: taskId }); 
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
