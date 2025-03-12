// src/models/taskModel.ts
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  editing: { type: Boolean, default: false },
});

// Create a virtual field 'id' that maps to the _id field
taskSchema.virtual('id').get(function () {
  return this._id.toHexString();  // Convert _id to a string
});

// Ensure that virtuals are included when converting the document to JSON
taskSchema.set('toJSON', {
  virtuals: true,  // Include virtuals in the output
  transform: (doc, ret) => {
    // Remove the _id field from the final output (optional)
    delete ret._id;
  },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
