import { Component } from '@angular/core';
import { Task } from '../../Models/task.model';
import { TaskService } from '../../Services/Task/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'add-edit-task',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-edit-task.component.html',
  styleUrl: './add-edit-task.component.scss'
})
export class AddEditTaskComponent {
  task: Task = { id: '', editing: false, completed: false, title: '' };

  constructor(private taskService: TaskService) { }


  saveTask() : void {
    if (this.task.title.trim()) {
      this.taskService.addTask(this.task);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.task = { id: '', editing: false, completed: false, title: '' };
  }
}
