import { useState } from "react";
import { updateTask } from "../services/taskService";

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];

const TaskList = ({ tasks, onTaskUpdated, showFilterSummary = true }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const handleStatusChange = async (taskId, newStatus) => {
    setError("");
    setUpdatingId(taskId);
    try {
      await updateTask(taskId, { status: newStatus });
      onTaskUpdated?.();
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusCounts = tasks.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h3>My Tasks</h3>
        {showFilterSummary && (
          <div className="task-stats">
            {STATUS_OPTIONS.map((s) => (
              <span key={s} className="task-stat">
                {s}: {statusCounts[s] ?? 0}
              </span>
            ))}
          </div>
        )}
      </div>
      {error && <p className="task-list-error">{error}</p>}
      {tasks.length === 0 && (
        <p className="task-list-empty">
          {showFilterSummary ? "No tasks yet. Create one above." : "No tasks in this category."}
        </p>
      )}
      <ul className="task-cards">
        {tasks.map((task) => (
          <li key={task._id} className={`task-card task-card--${task.status.replace(/\s+/g, "-").toLowerCase()}`}>
            <div className="task-card-body">
              <h4 className="task-title">{task.title}</h4>
              {task.description ? (
                <p className="task-description">{task.description}</p>
              ) : null}
              <div className="task-meta">
                <select
                  className="task-status-select"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  disabled={updatingId === task._id}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {updatingId === task._id && (
                  <span className="task-updating">Updating…</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
