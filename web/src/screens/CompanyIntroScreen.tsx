import { useEffect, useState } from "react";
import { api } from "../api/client";

import type { StepProps } from "./PersonalInfoScreen";

export function CompanyIntroScreen({ onBack }: StepProps) {
  const [introText, setIntroText] = useState<string | null>(null);
  const [isRead, setIsRead] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getCompanyIntro(), api.getDashboard()])
      .then(([text, dashboard]) => {
        setIntroText(text);
        setIsRead(dashboard.readCompanyIntroduction);
      })
      .catch((err: any) =>
        setError(err.message || "Failed to load introduction"),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = async () => {
    setError(null);
    setSuccessMsg(null);
    setSaving(true);
    try {
      await api.markCompanyIntroRead();
      setIsRead(true);
      setSuccessMsg("Company introduction marked as read! (+20% progress)");
    } catch (err: any) {
      setError(
        err.message || "Failed to save acknowledgment. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="card">Loading Step 2: Company Introduction...</div>;

  return (
    <div className="card">
      <h2>Step 2: Company Introduction</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="content-box">
        <p>{introText}</p>
      </div>

      <p>
        Current Status:{" "}
        <strong className={isRead ? "text-success" : ""}>
          {" "}
          {isRead ? "Read & Acknowledged ✓" : "Not yet marked as read"}
        </strong>
      </p>

      <div className="button-row">
        <button type="button" className="btn-secondary" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleMarkAsRead}
          disabled={saving}
        >
          {saving ? "Saving..." : isRead ? "Marked as Read ✓" : "Mark as Read"}
        </button>
      </div>
    </div>
  );
}
