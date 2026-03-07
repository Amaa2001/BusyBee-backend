import { Request, Response } from "express";
import Task from "../models/task";

// GET /api/tasks - Get all tasks for the logged-in user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const tasks = await Task.find({ user: userId });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({
      message: "Failed to fetch tasks",
      details: err instanceof Error ? err.message : err
    });
  }
};

// POST /api/tasks - Add a new task
export const addTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await Task.create({ title, user: userId, completed: false });
    res.status(201).json(task);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({
      message: "Failed to add task",
      details: err instanceof Error ? err.message : err
    });
  }
};

// PUT /api/tasks/:id/toggle - Toggle completed status
export const toggleTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Error toggling task:", err);
    res.status(500).json({
      message: "Failed to toggle task",
      details: err instanceof Error ? err.message : err
    });
  }
};

// DELETE /api/tasks/:id - Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({
      message: "Failed to delete task",
      details: err instanceof Error ? err.message : err
    });
  }
};