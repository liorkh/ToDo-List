import { Component } from '@angular/core';
import { TaskListComponent } from '../Components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  imports: [TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TodoList-FE';
}
