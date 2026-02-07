import { useEffect, useState } from "react";
import CreateTask from "../components/CreateTask";
import TaskList from "../components/TaskList";
import { getMyTasks } from "../services/taskService";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "To Do", label: "Upcoming (To Do)" },
  { key: "In Progress", label: "In Progress" },
  { key: "Done", label: "Completed" },
];

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getMyTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  return (
    <div className="page task-list-page">
      <div className="page-header">
        <h2>Task List</h2>
        <p className="page-subtitle">
          Manage your tasks. Filter by status or create new ones.
        </p>
      </div>

      <div className="task-filters">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`task-filter-btn ${filter === key ? "task-filter-btn--active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <CreateTask onTaskCreated={fetchTasks} />

      {loading ? (
        <p className="task-list-empty">Loading tasks…</p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onTaskUpdated={fetchTasks}
          showFilterSummary={filter === "all"}
        />
      )}
    </div>
  );
};

export default TaskListPage;
