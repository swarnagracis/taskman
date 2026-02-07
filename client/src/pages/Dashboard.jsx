import { useEffect, useState } from "react";
import CreateTask from "../components/CreateTask";
import TaskList from "../components/TaskList";
import { getMyTasks } from "../services/taskService";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <CreateTask onTaskCreated={fetchTasks} />
      {loading ? (
        <p className="task-list-empty">Loading tasks…</p>
      ) : (
        <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
      )}
    </div>
  );
};

export default Dashboard;

