import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DonorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        setMessage("Donor login successful! 🩸");

        setTimeout(() => {
          navigate("/donor-dashboard");
        }, 500);
      } else {
        setMessage(
          data.detail || "Invalid username or password."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Django server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Login Area */}
      <main className="login-container">

        {/* Left Panel */}
        <section className="login-info">

          <div className="login-badge">
            🩸 DONOR PORTAL
          </div>

          <h1>
            Welcome back,
            <span> lifesaver.</span>
          </h1>

          <p>
            Sign in to view blood requests that match your
            blood group and help patients who need you.
          </p>

          <div className="login-highlights">

            <div className="login-highlight">
              <span>🩸</span>
              <div>
                <strong>Compatible Requests</strong>
                <small>
                  See requests matching your blood type
                </small>
              </div>
            </div>

            <div className="login-highlight">
              <span>📍</span>
              <div>
                <strong>Distance Based Matching</strong>
                <small>
                  Know how far each request is from you
                </small>
              </div>
            </div>

            <div className="login-highlight">
              <span>⚡</span>
              <div>
                <strong>Quick Response</strong>
                <small>
                  Accept or reject requests instantly
                </small>
              </div>
            </div>

          </div>

        </section>


        {/* Login Card */}
        <section className="login-card">

          <div className="login-card-icon">
            🔐
          </div>

          <h2>Donor Login</h2>

          <p className="login-card-subtitle">
            Access your donor dashboard
          </p>


          <form onSubmit={handleLogin}>

            <div className="login-field">

              <label>Username</label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                required
              />

            </div>


            <div className="login-field">

              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing in..."
                : "Sign In →"}
            </button>

          </form>


          {/* Login Message */}
          {message && (
            <div
              className={`login-message ${
                message.includes("successful")
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </div>
          )}


          <div className="login-divider">
            <span>New donor?</span>
          </div>


          <button
            className="register-link-btn"
            onClick={() =>
              navigate("/donor-registration")
            }
          >
            Create Donor Account
          </button>

        </section>

      </main>

    </div>
  );
}

export default DonorLogin;