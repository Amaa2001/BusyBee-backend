import { Router } from "express";
import { getUsers, getUser, updateUser, deleteUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getUsers);
router.get("/:id", protect, getUser);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;