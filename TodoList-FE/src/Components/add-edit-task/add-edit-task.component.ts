import { Component, OnDestroy } from '@angular/core';
import { Task } from '../../Models/task.model';
import { TaskService } from '../../Services/Task/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

@Component({
  selector: 'add-edit-task',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-edit-task.component.html',
  styleUrl: './add-edit-task.component.scss'
})
export class AddEditTaskComponent implements OnDestroy {
  task: Task = { id: '', editing: false, completed: false, title: '' };
  private subscription: Subscription = new Subscription();

  constructor(private taskService: TaskService) { }

  saveTask() : void {
    if (this.task.title.trim()) {
      this.subscription=this.taskService.addTask(this.task).subscribe();
      this.resetForm();
    }
  }

  resetForm(): void {
    this.task = { id: '', editing: false, completed: false, title: '' };
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
