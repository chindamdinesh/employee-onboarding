import { useEffect, useState } from "react";
import { api } from "../api/client";

interface StepProps {
  onBack: () => void;
}

export function CompanyPolicyScreen({ onBack }: StepProps) {
  const [policyText, setPolicyText] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getCompanyPolicy(), api.getDashboard()])
      .then(([text, dashboard]) => {
        setPolicyText(text);
        setChecked(dashboard.acknowledgedCompanyPolicy);
      })
      .catch((err: any) => setError(err.message || "Failed to load policies"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checked) {
      setError(
        "Please check the box to acknowledge the company policies before saving.",
      );
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setSaving(true);
    try {
      await api.acknowledgeCompanyPolicy();
      setSuccessMsg("Company policies acknowledged and saved!");
    } catch (err: any) {
      setError(err.message || "Failed to save policy acknowledgement");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="card">Loading Step 3: Company Policies...</div>;

  return (
    <div className="card">
      <h2>Step 3: Company Policies</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="content-box pre-line">{policyText}</div>

      <form onSubmit={handleSave} className="form-stack">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>
            I have read and agree to abide by the company's attendance,
            working-hours, leave, and conduct policies.
          </span>
        </label>

        <div className="button-row">
          <button type="button" className="btn-secondary" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving || !checked}
          >
            {saving ? "Saving..." : "Save Acknowledgement"}
          </button>
        </div>
      </form>
    </div>
  );
}
