const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      assignedTo: assignedTo || req.user.id,
      createdBy: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({
      updatedAt: -1
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOne({
      _id: id,
      assignedTo: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      const valid = ["To Do", "In Progress", "Done"];
      if (!valid.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      task.status = status;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ assignedTo: userId });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);

    const byStatus = { "To Do": 0, "In Progress": 0, Done: 0 };
    let completedThisWeek = 0;
    let completedLastWeek = 0;

    tasks.forEach((t) => {
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;
      if (t.status === "Done" && t.updatedAt) {
        const updated = new Date(t.updatedAt);
        if (updated >= startOfWeek) completedThisWeek += 1;
        else if (updated >= startOfLastWeek && updated < startOfWeek)
          completedLastWeek += 1;
      }
    });

    const total = tasks.length;
    const done = byStatus.Done || 0;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    const weekOverWeek =
      completedLastWeek > 0
        ? Math.round(((completedThisWeek - completedLastWeek) / completedLastWeek) * 100)
        : (completedThisWeek > 0 ? 100 : 0);

    res.json({
      total,
      byStatus,
      done,
      toDo: byStatus["To Do"] || 0,
      inProgress: byStatus["In Progress"] || 0,
      completionRate,
      completedThisWeek,
      completedLastWeek,
      weekOverWeekChange: weekOverWeek
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
