import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getProfile,
  updateProfile as updateProfileApi,
  changePassword as changePasswordApi,
} from "../services/authService";

function Settings() {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || "", email: user.email || "" });
    } else {
      getProfile()
        .then((u) => {
          setProfile({ name: u.name || "", email: u.email || "" });
          setUser?.(u);
        })
        .catch(() => setProfile({ name: "", email: "" }));
    }
  }, [user, setUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);
    try {
      const updated = await updateProfileApi({
        name: profile.name.trim(),
        email: profile.email.trim().toLowerCase(),
      });
      setUser?.(updated);
      setProfile({ name: updated.name, email: updated.email });
      setProfileSuccess("Profile updated successfully.");
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    setPasswordLoading(true);
    try {
      await changePasswordApi(currentPassword, newPassword);
      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page settings-page">
      <div className="page-header">
        <h2>Settings</h2>
        <p className="page-subtitle">
          Update your profile and account security.
        </p>
      </div>

      <section className="settings-section">
        <h3 className="settings-section-title">Profile</h3>
        <form className="settings-form" onSubmit={handleProfileSubmit}>
          <label className="settings-label">
            Name
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label className="settings-label">
            Email
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="your@email.com"
              autoComplete="email"
            />
          </label>
          {profileSuccess && (
            <p className="settings-message settings-message--success">
              {profileSuccess}
            </p>
          )}
          {profileError && (
            <p className="settings-message settings-message--error">
              {profileError}
            </p>
          )}
          <button
            type="submit"
            className="settings-btn"
            disabled={profileLoading}
          >
            {profileLoading ? "Saving…" : "Save profile"}
          </button>
        </form>
      </section>

      <section className="settings-section">
        <h3 className="settings-section-title">Change password</h3>
        <form className="settings-form" onSubmit={handlePasswordSubmit}>
          <label className="settings-label">
            Current password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </label>
          <label className="settings-label">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </label>
          <label className="settings-label">
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </label>
          {passwordSuccess && (
            <p className="settings-message settings-message--success">
              {passwordSuccess}
            </p>
          )}
          {passwordError && (
            <p className="settings-message settings-message--error">
              {passwordError}
            </p>
          )}
          <button
            type="submit"
            className="settings-btn"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Updating…" : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Settings;
