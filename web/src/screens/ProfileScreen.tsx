import { useEffect, useState } from "react";
import type { ProfileData } from "../types/onboarding";
import { api } from "../api/client";

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getProfile()
      .then((res) => setProfile(res))
      .catch((err: any) => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <h2>Employee Profile</h2>
      {loading && <p>Loading profile...</p>}
      {error && <div className="alert alert-error">{error}</div>}

      {profile && (
        <div className="profile-details">
          <p>
            <strong>Full Name:</strong> {profile.fullName}
          </p>
          <p>
            <strong>Personal Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Onboarding Status:</strong>{" "}
            <span
              className={
                "badge badge-" +
                (profile.status === "Completed" ? "success" : "pending")
              }
            >
              {profile.status}
            </span>
          </p>
        </div>
      )}
      <button type="button" className="btn-secondary" onClick={onBack}>
        ← Back to Dashboard
      </button>
    </div>
  );
}
