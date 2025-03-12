import mongoose, { Document, Types } from 'mongoose';

// Define the TypeScript interface for the Task
export interface ITask extends Document {
  title: string;
  completed: boolean;
  editing: boolean;
}

// Define the schema for the Task model
const taskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  editing: { type: Boolean, default: false },
});

// Add a virtual for 'id' to be mapped from '_id'
taskSchema.virtual('id').get(function (this: ITask) {  // Explicitly type `this` as ITask
    return (this._id as Types.ObjectId).toHexString(); 
});

// Set 'toJSON' to include the virtuals and remove '_id'
taskSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

// Create the Task model using the schema and export it
export const Task = mongoose.model<ITask>('Task', taskSchema);
