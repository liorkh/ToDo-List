import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../Models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([
    { id: '1', name: 'Task 1', completed: false },
    { id: '2', name: 'Task 2', completed: false },
    { id: '3', name: 'Task 3', completed: true },
  ]);

  private editingTaskSubject = new BehaviorSubject<Task | null>(null);

  constructor() {}

  // Get tasks (reads from the local array)
  getTasks() {
    return this.tasksSubject.asObservable();
  }

  // Add task (adds to the local array)
  addTask(task: Task) {
    task.id = String(this.tasksSubject.value.length + 1); // Simple ID generation
    const tasks = [...this.tasksSubject.value, task];
    this.tasksSubject.next(tasks);
  }

  // Update task (modifies the task in the local array)
  updateTask(task: Task) {
    const tasks = this.tasksSubject.value.map(t =>
      t.id === task.id ? { ...t, completed: task.completed, name: task.name } : t
    );
    this.tasksSubject.next(tasks);
  }

  // Delete task (removes from the local array)
  deleteTask(taskId: string) {
    const tasks = this.tasksSubject.value.filter(t => t.id !== taskId);
    this.tasksSubject.next(tasks);
  }

  // Listen for real-time updates (mocking real-time behavior here)
  listenForRealTimeUpdates() {
    // In a real app, you might use WebSockets or Firebase for real-time updates
  }

  // Set task as the task to edit
  setEditingTask(task: Task) {
    this.editingTaskSubject.next(task);
  }

  // Get the task to edit
  getEditingTask() {
    return this.editingTaskSubject.asObservable();
  }
}
