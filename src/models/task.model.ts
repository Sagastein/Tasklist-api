import mongoose, { Schema, Document } from "mongoose";
enum Priority {
  High = "high",
  Medium = "medium",
  Low = "low",
}
export interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
  user: Schema.Types.ObjectId;
  priority: Priority;
}

const TaskSchema: Schema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, required: true },
    priority: {
      type: String,
      enum: Priority,
      required: true,
      default: Priority.Low,
    },

    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

// pre-save due date must be in future
TaskSchema.pre("save", function (next) {
  if (this.isModified("dueDate")) {
    const currentDate = new Date();
    if (this.dueDate < currentDate) {
      next(new Error("Due date must be in the future"));
    }
  }
  next();
});
const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;
