const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createTask,
  getMyTasks,
  updateTask,
  getTaskStats
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/my", protect, getMyTasks);
router.get("/stats", protect, getTaskStats);
router.patch("/:id", protect, updateTask);

module.exports = router;
