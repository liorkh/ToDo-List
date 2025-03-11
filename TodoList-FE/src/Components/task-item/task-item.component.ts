import { Component, Input } from '@angular/core';
import { Task } from '../../Models/task.model';
import { TaskService } from '../../Services/Task/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'task-item',
  imports: [CommonModule, FormsModule, MatFormFieldModule,MatCheckbox,MatInputModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent {
  @Input() task!: Task;
  isEditing: boolean = false;  // Flag to toggle edit mode

  constructor(private taskService: TaskService) { }

  // Toggle the completion of a task
  toggleCompleted() {
    this.taskService.updateTask(this.task);
  }

  // Delete the task
  deleteTask() {
    this.taskService.deleteTask(this.task.id);
  }

  // Toggle the edit mode to allow editing the task name
  editTask() {
    this.isEditing = !this.isEditing;  // Toggle between edit and view mode
  }

  // Save the edited task
  saveTask() {
    this.taskService.updateTask(this.task);  // Save the updated task
    this.isEditing = false;  // Exit edit mode
  }
}
