const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");


require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const DB_NAME = process.env.MONGO_DB_NAME || "taskman";

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: DB_NAME,
  })
  .then(async () => {
    console.log(`MongoDB connected (database: ${DB_NAME})`);
    const User = require("./models/User");
    const Task = require("./models/Task");
    await User.syncIndexes();
    await Task.syncIndexes();
    console.log("Database indexes synced");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("TaskMan API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
