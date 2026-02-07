import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (isRegister && !name.trim()) {
      setError("Name is required to register.");
      return;
    }
    setLoading(true);
    try {
      const data = isRegister
        ? await registerUser(name.trim(), email.trim(), password)
        : await loginUser(email.trim(), password);

      if (isRegister) {
        setSuccess("Account created. You can sign in now.");
        setError("");
        setPassword("");
        setIsRegister(false);
        return;
      }
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>{isRegister ? "Create account" : "Sign in"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <br />
            <br />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isRegister ? "new-password" : "current-password"}
        />
        <br />
        <br />
        {success && <p className="auth-success">{success}</p>}
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Please wait…" : isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button
        type="button"
        className="auth-toggle"
        onClick={() => {
          setIsRegister((v) => !v);
          setError("");
          setSuccess("");
        }}
      >
        {isRegister ? "Already have an account? Sign in" : "Create an account"}
      </button>
    </div>
  );
}

export default Login;
