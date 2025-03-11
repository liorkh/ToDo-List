import { Component } from '@angular/core';
import { Task } from '../../Models/task.model';
import { TaskService } from '../../Services/Task/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'add-edit-task',
  imports: [CommonModule,FormsModule,MatFormFieldModule,MatInputModule],
  templateUrl: './add-edit-task.component.html',
  styleUrl: './add-edit-task.component.css'
})
export class AddEditTaskComponent {
  task: Task = { name: '', completed: false, id: '' };

  constructor(private taskService: TaskService) {}


  saveTask() {
    if (this.task.name.trim()) {  
      this.taskService.addTask(this.task);
      this.resetForm();  
    }
  }

  resetForm(): void {
    this.task = { name: '', completed: false, id: '' };
  }
}
