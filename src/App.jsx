import {
  useState,
} from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Header from
  "./components/Header";

import Footer from
  "./components/Footer";

import Login from
  "./pages/Login";

import ModuleSelection from
  "./pages/ModuleSelection";

import Dashboard from
  "./pages/Dashboard";

import DriverVehicleRegistration from
  "./pages/DriverVehicleRegistration";

import AssignVehicleWork from
  "./pages/AssignVehicleWork";

import "./App.css";

function App() {
  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(() => {
    return (
      localStorage.getItem(
        "vehicleUserLoggedIn"
      ) === "true"
    );
  });

  const handleLogin = () => {
    localStorage.setItem(
      "vehicleUserLoggedIn",
      "true"
    );

    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "vehicleUserLoggedIn"
    );

    setIsAuthenticated(false);
  };

  return (
    <div className="app-layout">
      <Header
        isAuthenticated={
          isAuthenticated
        }
        onLogout={handleLogout}
      />

      <Routes>
        {/* Default URL:
            Login first, otherwise modules */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate
                to="/modules"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to="/modules"
                replace
              />
            ) : (
              <Login
                onLogin={
                  handleLogin
                }
              />
            )
          }
        />

        {/* Module Selection Page */}
        <Route
          path="/modules"
          element={
            isAuthenticated ? (
              <ModuleSelection />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* Vehicle Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* Driver and Vehicle Registration */}
        <Route
          path="/driver-vehicle-registration"
          element={
            isAuthenticated ? (
              <DriverVehicleRegistration />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* Assign Vehicle Work */}
        <Route
          path="/assign-vehicle-work"
          element={
            isAuthenticated ? (
              <AssignVehicleWork />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* Invalid URL */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? "/modules"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}
export default App;