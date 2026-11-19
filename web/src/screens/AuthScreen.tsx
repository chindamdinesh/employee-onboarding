// import { useState } from "react";
// import api from "../api/client";

import { useState } from "react";
import { api } from "../api/client";

interface AuthScreenProps {
  onLoginSuccess: (token: string, name: string) => void;
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isRegistering) {
        const res = await api.register({ name, email, password });
        setSuccessMsg(res.message || "Registration successful Please sign in.");
        setIsRegistering(false);
        setPassword("");
      } else {
        const res = await api.login({ email, password });
        localStorage.setItem("token", res.token);
        localStorage.setItem("userName", res.name);
        onLoginSuccess(res.token, res.name);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card">
      <h2>{isRegistering ? "New Joiner Registration" : "Employee Sign In"}</h2>
      <p className="subtitle">
        {isRegistering
          ? "Create your personal onboarding account"
          : "Sign in with your personal email to continue onboarding"}
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="form-stack">
        {isRegistering && (
          <label>
            Full Name *
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </label>
        )}

        <label>
          Personal Email *
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="bob@example.com"
            required
          />
        </label>

        <label>
          Password *
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              isRegistering ? "Minimum 8 characters" : "Enter password"
            }
            minLength={isRegistering ? 8 : undefined}
            required
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Please wait..." : isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <div className="auth-switch">
        <button
          type="button"
          className="btn-link"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError(null);
            setSuccessMsg(null);
          }}
        >
          {isRegistering
            ? "Already have an account? Sign In"
            : "New Joiner? Create an Account"}
        </button>
      </div>
    </div>
  );
}
