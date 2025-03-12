import { Component, OnInit } from '@angular/core';
import { Task } from '../../Models/task.model';
import { TaskService } from '../../Services/Task/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { AddEditTaskComponent } from '../add-edit-task/add-edit-task.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'task-list',
  imports: [TaskItemComponent,AddEditTaskComponent,CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks; // Initial load of tasks
    });

    // Subscribe to the tasks subject for real-time updates
    this.taskService.tasksSubject.subscribe((tasks) => {
      this.tasks = tasks; // Update task list with real-time changes
    });
  }
}
