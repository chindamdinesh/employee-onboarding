import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { PersonalInfo } from "../types/onboarding";

export interface StepProps {
  onBack: () => void;
}

export function PersonalInfoScreen({ onBack }: StepProps) {
  const [formData, setFormData] = useState<PersonalInfo>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPersonalInfo()
      .then((res) => setFormData(res))
      .catch((err: any) => console.error("Failed to load form data: ", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSaving(true);

    try {
      await api.savePersonalInfo(formData);
      setSuccessMsg("Personal Information saved! Step 1 is complete.");
    } catch (err: any) {
      setError(err.message || "Failed to save Personal Information");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="card">Loading Step 1: Personal Information...</div>;

  return (
    <div className="card">
      <h2>Step 1: Personal Information</h2>
      <p className="subtitle">
        Please provide your personal information and emergency contact details.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="form-stack">
        <label>
          Full Name *
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />
        </label>

        <label>
          Phone Number *
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            placeholder="1234567890"
            required
          />
        </label>

        <label>
          Date of Birth *
          <input
            type="date"
            value={formData.dateOfBirth ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            required
          />
        </label>

        <label>
          Emergency Contact Name *
          <input
            type="text"
            value={formData.emergencyContactName}
            onChange={(e) =>
              setFormData({ ...formData, emergencyContactName: e.target.value })
            }
            required
          />
        </label>

        <label>
          Emergency Contact Number *
          <input
            type="tel"
            value={formData.emergencyContactNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                emergencyContactNumber: e.target.value,
              })
            }
            required
          />
        </label>

        <label>
          Residential Address *
          <textarea
            rows={3}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />
        </label>

        <div className="button-row">
          <button type="button" className="btn-secondary" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Personal Information"}
          </button>
        </div>
      </form>
    </div>
  );
}
