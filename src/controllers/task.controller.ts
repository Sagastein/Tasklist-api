import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/task.model";

class TaskController {
  public getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await Task.find();
      if (tasks.length === 0) throw new Error("No task found");

      return res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public getTask = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Task id" });
    }

    try {
      const task = await Task.findById(id);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  public createTask = async (req: Request, res: Response) => {
    const { _id } = req.user;
    console.log(_id);
    const { title, description, priority, dueDate }: ITask = req.body;
    if (!title || !description || !priority || !dueDate) {
      return res.json({
        message: "Title, Description, priority and due data are required",
      });
    }

    try {
      const task: ITask = new Task({
        title,
        description,
        priority,
        dueDate,
        user: _id,
      });
      await task.save();
      res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  //complete task
  public completeTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { _id } = req.user;

    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid Task id" });
      }
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      if (task.user.toString() !== _id) {
        return res
          .status(403)
          .json({ message: "You are not authorized to complete this task" });
      }
      if (task.completed)
        return res.status(400).json({ message: "Task already completed" });
      task.completed = true;
      await task.save();
      return res.status(200).json({ message: "Task completed successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  // edit task
  public editTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { _id } = req.user;
    const { title, description, priority, dueDate }: ITask = req.body;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Task id" });
    }
    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      if (task.user.toString() !== _id) {
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this task" });
      }
      task.title = title || task.title;
      task.description = description || task.description;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      await task.save();
      return res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  //delete task
  public deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { _id } = req.user;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Task id" });
    }
    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      if (task.user.toString() !== _id) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this task" });
      }
      await Task.deleteOne({ _id: id });
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

export default new TaskController();
