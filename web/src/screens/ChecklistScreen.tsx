import { useEffect, useState } from "react";
import { api } from "../api/client";

interface StepProps {
  onBack: () => void;
}

export function ChecklistScreen({ onBack }: StepProps) {
  const [joiningDate, setJoiningDate] = useState<boolean>(false);
  const [firstDayInstruction, setFirstDayInstruction] =
    useState<boolean>(false);
  const [orientationInformation, setOrientationInformation] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  useEffect(() => {
    api
      .getJoiningChecklist()
      .then((res) => {
        setJoiningDate(res.joiningDate);
        setFirstDayInstruction(res.firstDayInstruction);
        setOrientationInformation(res.orientationInformation);
      })
      .catch((err: any) => setError(err.message || "Failed to load checklist"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSaving(true);
    try {
      const saved = await api.saveJoiningChecklist({
        joiningDate,
        firstDayInstruction,
        orientationInformation,
      });
      const allThreeDone =
        saved.joiningDate &&
        saved.firstDayInstruction &&
        saved.orientationInformation;

      allThreeDone
        ? setSuccessMsg(
            "All 3 checklist items completed! Step 4 is now complete.",
          )
        : setWarningMsg(
            "Progress saved! Note: All 3 items must be checked to mark Step 4 complete.",
          );
    } catch (err: any) {
      setError(err.message || "Failed to save checklist");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="card">Loading Step 4: Joining Checklist...</div>;

  return (
    <div className="card">
      <h2>Step 4: Joining Checklist</h2>
      <p className="subtitle">
        All three items must be checked to complete this onboarding step.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {warningMsg && <div className="alert alert-warning">{warningMsg}</div>}

      <form onSubmit={handleSave} className="form-stack">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={joiningDate}
            onChange={(e) => setJoiningDate(e.target.checked)}
          />
          <span>1. Confirm joining date</span>
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={firstDayInstruction}
            onChange={(e) => setFirstDayInstruction(e.target.checked)}
          />
          <span>2. Review first-day instructions</span>
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={orientationInformation}
            onChange={(e) => setOrientationInformation(e.target.checked)}
          />
          <span>3. Acknowledge orientation information</span>
        </label>

        <div className="button-row">
          <button type="button" className="btn-secondary" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Checklist"}
          </button>
        </div>
      </form>
    </div>
  );
}
