import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task } from '../../Models/task.model';
import { TaskService } from '../../Services/Task/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'task-item',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatCheckbox, MatInputModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  @Input() task!: Task;
  isEditing = new BehaviorSubject<boolean>(false);  // Flag to toggle edit mode

  constructor(private taskService: TaskService) { }

  // Toggle the completion of a task
  toggleCompleted() {
    this.taskService.updateTask(this.task).subscribe();
  }

  // Delete the task
  deleteTask() {
    this.taskService.deleteTask(this.task.id).subscribe();
  }

  // Toggle the edit mode to allow editing the task name
  editTask() {
    if (this.isEditing.value) {
      // If the task is in editing mode, save the updated task
      this.isEditing.next(false);
      this.task.editing = false;
    } else {
      // Enter edit mode
      this.isEditing.next(true);
      this.task.editing = true;
    }
    this.taskService.updateTask(this.task).subscribe();
  }
}
