import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import backgroundOne from
  "../assets/login-bg-1.png";

import backgroundTwo from
  "../assets/login-bg-2.png";

import backgroundThree from
  "../assets/login-bg-3.png";

import "../styles/Login.css";

const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "Admin@2026";

const BACKGROUND_CHANGE_TIME = 3000;

const backgroundImages = [
  backgroundOne,
  backgroundTwo,
  backgroundThree,
];

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [
    currentBackground,
    setCurrentBackground,
  ] = useState(0);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  /*
    Changes the background automatically
    every three seconds.
  */
  useEffect(() => {
    const backgroundInterval =
      window.setInterval(() => {
        setCurrentBackground(
          (previousBackground) =>
            (
              previousBackground + 1
            ) %
            backgroundImages.length
        );
      }, BACKGROUND_CHANGE_TIME);

    return () => {
      window.clearInterval(
        backgroundInterval
      );
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    const cleanUsername =
      username.trim();

    if (
      !cleanUsername ||
      !password
    ) {
      setError(
        "Please enter username and password."
      );

      return;
    }

    if (
      cleanUsername !==
        ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      setError(
        "Invalid username or password."
      );

      return;
    }

    onLogin();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <main className="login-page">
      {/* Rotating background images */}
      <div
        className="login-backgrounds"
        aria-hidden="true"
      >
        {backgroundImages.map(
          (backgroundImage, index) => (
            <div
              key={backgroundImage}
              className={`login-background ${
                currentBackground === index
                  ? "background-active"
                  : ""
              }`}
              style={{
                backgroundImage:
                  `url(${backgroundImage})`,
              }}
            />
          )
        )}
      </div>

      {/* Dark overlay */}
      <div
        className="login-overlay"
        aria-hidden="true"
      />

      {/* Fixed login card */}
      <section className="login-card">
        <div className="login-heading">
          <div className="login-symbol">
            V
          </div>

          <h2>Welcome Back</h2>

          <p>
            Sign in to the Vehicle
            Monitoring System
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Username field */}
          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <div className="input-container">
              <span
                className="input-icon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="7"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(event) => {
                  setUsername(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Enter username"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="input-container">
              <span
                className="input-icon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 14V17"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Enter password"
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => {
                  setShowPassword(
                    (previousValue) =>
                      !previousValue
                  );
                }}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="login-message error"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Sign-in button */}
          <button
            type="submit"
            className="login-button"
          >
            <span>Sign In</span>

            <span
              className="login-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </form>

        <div className="login-divider">
          <span>
            Real-Time Logistics Dashboard
          </span>
        </div>

        <div className="login-features">
          <div className="login-feature">
            <span className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 19V10M10 19V5M16 19V8M22 19V2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <strong>Track</strong>
            <span>Vehicles</span>
          </div>

          <div className="login-feature">
            <span className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L20 5V11C20 16.2 16.6 20.7 12 22C7.4 20.7 4 16.2 4 11V5L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M12 6V17"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </span>

            <strong>Monitor</strong>
            <span>Safety</span>
          </div>

          <div className="login-feature">
            <span className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="5"
                  cy="6"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <circle
                  cx="19"
                  cy="6"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <circle
                  cx="12"
                  cy="18"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M7 7L11 16M17 7L13 16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </span>

            <strong>Optimize</strong>
            <span>Routes</span>
          </div>
        </div>

        {/* Background controls */}
        <div className="background-indicators">
          {backgroundImages.map(
            (_, index) => (
              <button
                type="button"
                key={index}
                className={
                  currentBackground === index
                    ? "indicator-active"
                    : ""
                }
                onClick={() => {
                  setCurrentBackground(index);
                }}
                aria-label={`Show background ${
                  index + 1
                }`}
              />
            )
          )}
        </div>
      </section>
    </main>
  );
}

export default Login;