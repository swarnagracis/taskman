import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/tasks", label: "Task List", icon: "tasks" },
  { to: "/summary", label: "Project Summary", icon: "chart" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              "sidebar-link " + (isActive ? "sidebar-link--active" : "")
            }
            end={to === "/tasks"}
          >
            <span className={"sidebar-icon sidebar-icon--" + icon} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
