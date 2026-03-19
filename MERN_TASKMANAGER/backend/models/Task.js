const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', required: true,
    },
    title: {
      type: String, required: [true, 'Title is required'],
      trim: true, minlength: 1, maxlength: 100,
    },
    description: {
      type: String, trim: true, maxlength: 1000, default: '',
    },
    status: {
      type: String, enum: ['pending', 'completed'], default: 'pending',
    },
    priority: {
      type: String, enum: ['low', 'medium', 'high'], default: 'medium',
    },
    dueDate: {
      type: Date, default: null,
    },
  },
  { timestamps: true }
);

// ── Compound indexes for fast filtered queries ───────────────────
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);
