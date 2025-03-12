import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { io } from 'socket.io-client';
import { Task } from '../../Models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/tasks'; // Your backend API endpoint
  private socket = io('http://localhost:5000'); // Connect to the backend Socket.IO server

  tasksSubject = new BehaviorSubject<Task[]>([]); // Holds the task list
  socketId: string | undefined;

  constructor(private http: HttpClient) {
    // Listen for real-time updates from the backend via Socket.IO
    this.socket.on('taskAdded', (task: Task) => {
      this.addTaskToList(task); // Add new task to the list
    });

    this.socket.on('taskUpdated', (task: Task) => {
      this.updateTaskInList(task); // Update task in the list
    });

    this.socket.on('taskDeleted', (task: Task) => {
      this.deleteTaskFromList(task.id); // Remove task from the list by id
    });

    this.socket.on('connect', () => {
      this.socketId = this.socket.id;
    });
  }

  // Fetch tasks from the backend (initial load)
  getTasks() {
      const headers = this.getHeaders(); // Get the headers from the helper method
      const options = { headers }; // Wrap the headers in an options object
      return this.http.get<Task[]>(this.apiUrl, options).pipe(
        // After fetching tasks from backend, update the local task list
        tap(tasks => this.tasksSubject.next(tasks))
      );   
  }

  // Add a new task via the backend and update the local list
  addTask(task: Task) {
    return this.http.post<Task>(this.apiUrl, task, { headers: this.getHeaders() }).pipe(
      tap(newTask => {
        // Emit the new task to the server via Socket.IO
        this.socket.emit('taskAdded', newTask);
      })
    );
  }

  // Update an existing task via the backend and update the local list
  updateTask(task: Task) {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task, { headers: this.getHeaders() }).pipe(
      tap(updatedTask => {
        // Emit the updated task to the server via Socket.IO
        this.socket.emit('taskUpdated', updatedTask);
      })
    );
  }

  // Delete a task via the backend and update the local list
  deleteTask(taskId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`, { headers: this.getHeaders() }).pipe(
      tap(() => {
        // Emit task deletion event to the server via Socket.IO
        this.socket.emit('taskDeleted', { id: taskId });
        // Update the local task list after deletion
        this.deleteTaskFromList(taskId);
      })
    );
  }

  // Helper method to add the socket id to headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('socket-id', this.socketId || '');
  }

  // Helper methods to manage the local task list in the BehaviorSubject
  private addTaskToList(task: Task) {
    const tasks = [...this.tasksSubject.value, task]; // Add new task to the list
    this.tasksSubject.next(tasks);
  }

  private updateTaskInList(updatedTask: Task) {
    const tasks = this.tasksSubject.value.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasksSubject.next(tasks); // Update the task in the list
  }

  private deleteTaskFromList(taskId: string) {
    const tasks = this.tasksSubject.value.filter(task => task.id !== taskId);
    this.tasksSubject.next(tasks); // Remove task from the list by id
  }

  // Expose tasks as an observable
  get tasks$() {
    return this.tasksSubject.asObservable();
  }
}
