import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    editing: { type: Boolean, default: false },
});


taskSchema.virtual('id').get(function () {
    return this._id.toHexString();
});


taskSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
    },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
