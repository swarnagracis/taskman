import { useState } from "react";
import { createTask } from "../services/taskService";

const CreateTask = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await createTask(title.trim(), (description || "").trim());
      setTitle("");
      setDescription("");
      onTaskCreated?.();
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-task">
      <h3>Create Task</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />
      {error && <p className="create-task-error">{error}</p>}
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Adding…" : "Add Task"}
      </button>
    </div>
  );
};

export default CreateTask;
