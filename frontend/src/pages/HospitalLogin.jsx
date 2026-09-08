import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HospitalLogin() {
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

        setMessage("Hospital login successful! 🏥");

        setTimeout(() => {
          navigate("/hospital-dashboard");
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
    <div className="hospital-login-page">

      {/* Main Area */}
      <main className="hospital-login-container">

        {/* Information Panel */}
        <section className="hospital-login-info">

          <div className="hospital-badge">
            🏥 HOSPITAL PORTAL
          </div>

          <h1>
            Help patients get
            <span> the blood they need.</span>
          </h1>

          <p>
            Manage blood requirements, discover compatible donors,
            and respond to emergencies through one intelligent
            platform.
          </p>


          <div className="hospital-highlights">

            <div className="hospital-highlight">
              <span>🩸</span>

              <div>
                <strong>Blood Requests</strong>

                <small>
                  Create and manage blood requirements
                </small>
              </div>
            </div>


            <div className="hospital-highlight">
              <span>🧠</span>

              <div>
                <strong>Smart Matching</strong>

                <small>
                  Identify compatible donors efficiently
                </small>
              </div>
            </div>


            <div className="hospital-highlight">
              <span>📊</span>

              <div>
                <strong>Response Tracking</strong>

                <small>
                  Monitor donor responses in real time
                </small>
              </div>
            </div>

          </div>

        </section>


        {/* Login Card */}
        <section className="hospital-login-card">

          <div className="hospital-login-icon">
            🏥
          </div>

          <h2>Hospital Login</h2>

          <p className="hospital-login-subtitle">
            Access your hospital dashboard
          </p>


          <form onSubmit={handleLogin}>

            <div className="hospital-login-field">

              <label>Username</label>

              <input
                type="text"
                placeholder="Enter hospital username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                required
              />

            </div>


            <div className="hospital-login-field">

              <label>Password</label>

              <div className="hospital-password-wrapper">

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
                  className="hospital-password-toggle"
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
              className="hospital-login-submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing in..."
                : "Sign In to Hospital Portal →"}
            </button>

          </form>


          {/* Message */}
          {message && (
            <div
              className={`hospital-login-message ${
                message.includes("successful")
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </div>
          )}


          <div className="hospital-login-note">
            🔒 Secure access protected by JWT authentication
          </div>

          <div className="hospital-register-link">
            <span>Don't have a hospital account?</span>

            <button
              type="button"
              onClick={() => navigate("/hospital-registration")}
  >
              Register Hospital →
            </button>
          </div>

        </section>

      </main>

    </div>
  );
}

export default HospitalLogin;

