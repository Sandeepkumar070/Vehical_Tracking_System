import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import pitechLogo from "../assets/pitech-logo.png";
import "../styles/Header.css";

function Header({
  isAuthenticated,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login";

  const handleLogoClick = () => {
    navigate(
      isAuthenticated ? "/" : "/login"
    );
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    onLogout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <button
          type="button"
          className="header-logo-button"
          onClick={handleLogoClick}
          aria-label="Go to home page"
        >
          <img
            src={pitechLogo}
            alt="Pitech Automation"
            className="header-logo-image"
          />
        </button>
      </div>

      <div className="header-center">
        <h1>
          Vehicle Monitoring System
        </h1>

        <p>
          Real-Time Logistics Dashboard
        </p>
      </div>

      <div className="header-right">
        {isAuthenticated && (
          <div className="header-live-status">
            <span className="header-live-dot">
            </span>

            <span>Live</span>
          </div>
        )}

        {!isAuthenticated &&
          !isLoginPage && (
            <button
              type="button"
              className="
                header-action-button
                login-header-button
              "
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}

        {isAuthenticated && (
          <button
            type="button"
            className="
              header-action-button
              logout-header-button
            "
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;