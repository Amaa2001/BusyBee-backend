import { Router, Request, Response } from "express";
import Task from "../models/task";
import { protect } from "../middleware/authMiddleware"; // se till att din middleware exporteras som 'protect'

const router = Router();

/* GET ALL TASKS */
router.get("/", protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({
      message: "Failed to fetch tasks",
      details: err instanceof Error ? err.message : err
    });
  }
});

/* CREATE TASK */
router.post("/", protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await Task.create({ title, user: userId, completed: false });
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({
      message: "Failed to create task",
      details: err instanceof Error ? err.message : err
    });
  }
});

/* TOGGLE TASK */
router.put("/:id/toggle", protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const task = await Task.findOne({ _id: req.params.id, user: userId });
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
});

/* DELETE TASK */
router.delete("/:id", protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const task = await Task.findOne({ _id: req.params.id, user: userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({
      message: "Failed to delete task",
      details: err instanceof Error ? err.message : err
    });
  }
});

export default router;