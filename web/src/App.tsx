import { useState } from "react";
import "./App.css";
import { AuthScreen } from "./screens/AuthScreen";
import { ChecklistScreen } from "./screens/ChecklistScreen";
import { CompanyIntroScreen } from "./screens/CompanyIntroScreen";
import { CompanyPolicyScreen } from "./screens/CompanyPolicyScreen";
import { DashboardScreen, type ScreenName } from "./screens/DashboardScreen";
import { PersonalInfoScreen } from "./screens/PersonalInfoScreen";
import { FinalConfirmScreen } from "./screens/FinalConfirmScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("dashboard");

  const handleLoginSuccess = (jwtToken: string) => {
    setToken(jwtToken);
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setCurrentScreen("dashboard");
  };

  // Conditionally render AuthScreen when not logged in (Enforces QA-13 on Logout!)
  if (!token) {
    return (
      <div className="app-shell">
        <header className="top-nav">
          <span className="brand">Company Onboarding Portal</span>
        </header>
        <main className="main-content">
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        </main>
      </div>
    );
  }

  // Conditionally render the selected screen component inside the Parent container
  const renderActiveScreen = () => {
    switch (currentScreen) {
      case "step1":
        return (
          <PersonalInfoScreen onBack={() => setCurrentScreen("dashboard")} />
        );
      case "step2":
        return (
          <CompanyIntroScreen onBack={() => setCurrentScreen("dashboard")} />
        );
      case "step3":
        return (
          <CompanyPolicyScreen onBack={() => setCurrentScreen("dashboard")} />
        );
      case "step4":
        return <ChecklistScreen onBack={() => setCurrentScreen("dashboard")} />;
      case "step5":
        return (
          <FinalConfirmScreen onBack={() => setCurrentScreen("dashboard")} />
        );
      case "profile":
        return <ProfileScreen onBack={() => setCurrentScreen("dashboard")} />;
      case "dashboard":
      default:
        return (
          <DashboardScreen onSelectStep={(step) => setCurrentScreen(step)} />
        );
    }
  };

  return (
    <div className="app-shell">
      <header className="top-nav">
        <span
          className="brand clickable"
          onClick={() => setCurrentScreen("dashboard")}
        >
          Employee Onboarding
        </span>
        <nav className="nav-actions">
          <button
            type="button"
            className="btn-nav"
            onClick={() => setCurrentScreen("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className="btn-nav"
            onClick={() => setCurrentScreen("profile")}
          >
            Profile
          </button>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="main-content">{renderActiveScreen()}</main>
    </div>
  );
}
