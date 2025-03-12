// taskRepository.ts
import Task, { ITask } from '../models/taskModel';

class TaskRepository {

    async createTask(title: string): Promise<ITask> {
        const newTask = new Task({ title, completed: false, editing: false });
        return await newTask.save();
    }

    async getAllTasks(): Promise<ITask[]> {
        return await Task.find().select('-__v');
    }

    async updateTask(id: string, title?: string, completed?: boolean, editing?: boolean): Promise<ITask | null> {
        return await Task.findByIdAndUpdate(id, { title, completed, editing }, { new: true });
    }


    async deleteTask(id: string): Promise<ITask | null> {
        return await Task.findByIdAndDelete(id);
    }
}

export default new TaskRepository();
