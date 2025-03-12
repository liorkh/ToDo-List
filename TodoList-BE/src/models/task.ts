import mongoose, { Document, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  completed: boolean;
  editing: boolean;
}

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

export const Task = mongoose.model<ITask>('Task', taskSchema);
