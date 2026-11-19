import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { DashboardData } from "../types/onboarding";

interface StepProps {
  onBack: () => void;
}

export function FinalConfirmScreen({ onBack }: StepProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    api
      .getDashboard()
      .then((res) => setData(res))
      .catch((err: any) => setError(err.message || "Failed to load summary"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="card">Loading Step 5: Final Confirmation...</div>;
  if (!data)
    return (
      <div className="card alert alert-error">
        {error || "Unable to load summary"}
      </div>
    );

  const stepsOneToFourComplete =
    data.personalInformationCompleted &&
    data.readCompanyIntroduction &&
    data.acknowledgedCompanyPolicy &&
    data.joiningChecklistCompleted;

  const handleConfirm = async () => {
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const msg = await api.confirmOnboarding();
      setSuccessMsg(msg);
      const updated = await api.getDashboard();
      setData(updated);
    } catch (err: any) {
      setError(err.message || "Could not complete onboarding");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2>Step 5: Final Confirmation</h2>
      <p className="subtitle">
        Review your completion status for Steps 1–4 below.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <ul className="summary-list">
        <li>
          1. Personal Information:{" "}
          <strong>
            {data.personalInformationCompleted ? "Completed ✓" : "Incomplete ✗"}
          </strong>
        </li>
        <li>
          2. Company Introduction:{" "}
          <strong>
            {data.readCompanyIntroduction ? "Completed ✓" : "Incomplete ✗"}
          </strong>
        </li>
        <li>
          3. Company Policies:{" "}
          <strong>
            {data.acknowledgedCompanyPolicy ? "Completed ✓" : "Incomplete ✗"}
          </strong>
        </li>
        <li>
          4. Joining Checklist:{" "}
          <strong>
            {data.joiningChecklistCompleted ? "Completed ✓" : "Incomplete ✗"}
          </strong>
        </li>
      </ul>

      {!stepsOneToFourComplete && (
        <div className="alert alert-error">
          Please complete all of Steps 1–4 before confirming your onboarding.
        </div>
      )}

      {data.finalConfirmation && (
        <div className="alert alert-success">
          🎉 Your onboarding is 100% complete! Welcome aboard, {data.name}!
        </div>
      )}

      <div className="button-row">
        <button type="button" className="btn-secondary" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={
            !stepsOneToFourComplete || data.finalConfirmation || submitting
          }
          onClick={handleConfirm}
        >
          {data.finalConfirmation
            ? "Onboarding Completed ✓"
            : submitting
              ? "Confirming..."
              : "Complete Onboarding"}
        </button>
      </div>
    </div>
  );
}
