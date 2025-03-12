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
  styleUrls: ['./task-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  @Input() task!: Task;
  isEditing = new BehaviorSubject<boolean>(false);


  constructor(private taskService: TaskService) { }

  toggleCompleted(): void {
    this.taskService.updateTask(this.task);

  }

  deleteTask(): void {
    this.taskService.deleteTask(this.task.id);

  }

  editTask(): void {
    this.task.editing = !this.isEditing.value;
    this.isEditing.next(!this.isEditing.value);
    this.taskService.updateTask(this.task);

  }
}
