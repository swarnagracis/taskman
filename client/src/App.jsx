import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import TaskListPage from "./pages/TaskListPage";
import ProjectSummary from "./pages/ProjectSummary";
import Settings from "./pages/Settings";

function App() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TaskMan</h1>
        <div className="user-info">
          <span>{user.name || user.email}</span>
          <button type="button" className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TaskListPage />} />
            <Route path="/summary" element={<ProjectSummary />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWithRouter;
