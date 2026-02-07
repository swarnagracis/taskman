import { useEffect, useState } from "react";
import { getTaskStats } from "../services/taskService";

const StatCard = ({ title, value, subtitle, icon, variant }) => (
  <div className={"summary-card summary-card--" + (variant || "default")}>
    <div className="summary-card-header">
      <span className={"summary-card-icon summary-card-icon--" + (icon || "default")} aria-hidden />
      <span className="summary-card-title">{title}</span>
    </div>
    <div className="summary-card-value">{value}</div>
    {subtitle != null && <div className="summary-card-subtitle">{subtitle}</div>}
  </div>
);

const ProjectSummary = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getTaskStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load stats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="page summary-page">
        <div className="page-header">
          <h2>Project Summary</h2>
          <p className="page-subtitle">Loading performance metrics…</p>
        </div>
        <div className="summary-loading" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="page summary-page">
        <div className="page-header">
          <h2>Project Summary</h2>
        </div>
        <p className="summary-error">{error || "No data available."}</p>
      </div>
    );
  }

  const {
    total,
    toDo,
    inProgress,
    done,
    completionRate,
    completedThisWeek,
    completedLastWeek,
    weekOverWeekChange,
  } = stats;

  return (
    <div className="page summary-page">
      <div className="page-header">
        <h2>Project Summary</h2>
        <p className="page-subtitle">
          Performance metrics and task statistics at a glance.
        </p>
      </div>

      <section className="summary-section">
        <h3 className="summary-section-title">Overview</h3>
        <div className="summary-grid">
          <StatCard
            title="Total tasks"
            value={total}
            subtitle="All time"
            icon="total"
          />
          <StatCard
            title="Completed"
            value={done}
            subtitle={`${completionRate}% completion rate`}
            icon="done"
            variant="success"
          />
          <StatCard
            title="In progress"
            value={inProgress}
            icon="progress"
            variant="warning"
          />
          <StatCard
            title="To do"
            value={toDo}
            icon="todo"
          />
        </div>
      </section>

      <section className="summary-section">
        <h3 className="summary-section-title">Performance over time</h3>
        <div className="summary-grid summary-grid--metrics">
          <StatCard
            title="Completed this week"
            value={completedThisWeek}
            subtitle="Tasks marked done in the current week"
            icon="week"
          />
          <StatCard
            title="Previous week"
            value={completedLastWeek}
            subtitle="Tasks completed in the prior week"
            icon="week"
          />
          <div className="summary-card summary-card--trend">
            <div className="summary-card-header">
              <span className="summary-card-icon summary-card-icon--trend" aria-hidden />
              <span className="summary-card-title">Week-over-week change</span>
            </div>
            <div
              className={
                "summary-card-value summary-card-value--" +
                (weekOverWeekChange >= 0 ? "positive" : "negative")
              }
            >
              {weekOverWeekChange >= 0 ? "+" : ""}
              {weekOverWeekChange}%
            </div>
            <div className="summary-card-subtitle">
              {weekOverWeekChange >= 0
                ? "More tasks completed than last week"
                : "Fewer tasks completed than last week"}
            </div>
          </div>
        </div>
      </section>

      <section className="summary-section">
        <h3 className="summary-section-title">Distribution</h3>
        <div className="summary-distribution">
          <div className="summary-bar">
            <div className="summary-bar-track">
              <div
                className="summary-bar-fill summary-bar-fill--todo"
                style={{ width: total ? `${(toDo / total) * 100}%` : 0 }}
              />
            </div>
            <span className="summary-bar-label">To Do ({toDo})</span>
          </div>
          <div className="summary-bar">
            <div className="summary-bar-track">
              <div
                className="summary-bar-fill summary-bar-fill--progress"
                style={{ width: total ? `${(inProgress / total) * 100}%` : 0 }}
              />
            </div>
            <span className="summary-bar-label">In Progress ({inProgress})</span>
          </div>
          <div className="summary-bar">
            <div className="summary-bar-track">
              <div
                className="summary-bar-fill summary-bar-fill--done"
                style={{ width: total ? `${(done / total) * 100}%` : 0 }}
              />
            </div>
            <span className="summary-bar-label">Done ({done})</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectSummary;
