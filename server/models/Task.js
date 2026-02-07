const mongoose = require("mongoose");

/**
 * Task collection (MongoDB: tasks)
 * References User via assignedTo and createdBy (ObjectId refs).
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["To Do", "In Progress", "Done"],
        message: "Status must be To Do, In Progress, or Done",
      },
      default: "To Do",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must be assigned to a user"],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

// Indexes for application queries
taskSchema.index({ assignedTo: 1, updatedAt: -1 }); // getMyTasks: find by assignee, sort by updated
taskSchema.index({ assignedTo: 1, status: 1 });     // stats and filtered lists by assignee + status
taskSchema.index({ createdBy: 1 });                // optional: "tasks I created"

module.exports = mongoose.model("Task", taskSchema);
