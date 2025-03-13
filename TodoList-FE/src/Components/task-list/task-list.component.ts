import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../../Models/task.model';
import { TaskService } from '../../Services/Task/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { AddEditTaskComponent } from '../add-edit-task/add-edit-task.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'task-list',
  imports: [TaskItemComponent, AddEditTaskComponent, CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'] 
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const getTasksSubscription = this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
    this.subscriptions.push(getTasksSubscription); 

    const tasksSubjectSubscription = this.taskService.tasksSubject.subscribe((tasks) => {
      this.tasks = tasks;
    });
    this.subscriptions.push(tasksSubjectSubscription); 
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
