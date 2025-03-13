import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Task } from '../../Models/task.model';
import { TaskService } from '../../Services/Task/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'task-item',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatCheckbox, MatInputModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent implements OnDestroy {
  @Input() task!: Task;
  isEditing = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = [];

  constructor(private taskService: TaskService) { }

  toggleCompleted(): void {
    if (!this.isEditing) {
      const subscription = this.taskService.updateTask(this.task).subscribe();
      this.subscriptions.push(subscription);
    }
  }

  deleteTask(): void {
    const subscription = this.taskService.deleteTask(this.task.id).subscribe();
    this.subscriptions.push(subscription);
  }

  editTask(): void {
    this.task.editing = !this.isEditing.value;
    this.isEditing.next(!this.isEditing.value);
    const subscription = this.taskService.updateTask(this.task).subscribe();
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
