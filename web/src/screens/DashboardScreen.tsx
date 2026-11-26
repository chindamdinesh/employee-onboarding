import { useEffect, useState } from "react";
import { api } from "../api/client";

import type { DashboardData } from "../types/onboarding";

export type ScreenName =
  | "dashboard"
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "profile";

interface DashboardScreenProps {
  onSelectStep: (stepScreen: ScreenName) => void;
}

export function DashboardScreen({ onSelectStep }: DashboardScreenProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getDashboard();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading)
    return <div className="card">Loading your onboarding dashboard...</div>;
  if (error) return <div className="card alert alert-error">{error}</div>;
  if (!data) return null;

  const steps: {
    id: ScreenName;
    number: number;
    title: string;
    completed: boolean;
  }[] = [
    {
      id: "step1",
      number: 1,
      title: "Personal Information",
      completed: data.personalInformationCompleted,
    },
    {
      id: "step2",
      number: 2,
      title: "Company Introduction",
      completed: data.readCompanyIntroduction,
    },
    {
      id: "step3",
      number: 3,
      title: "Company Policies",
      completed: data.acknowledgedCompanyPolicy,
    },
    {
      id: "step4",
      number: 4,
      title: "Joining Checklist",
      completed: data.joiningChecklistCompleted,
    },
    {
      id: "step5",
      number: 5,
      title: "Final Confirmation",
      completed: data.finalConfirmation,
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="card">
        <h2>Welcome, {data.name}!</h2>
        <p className="subtitle">
          Status:{" "}
          <strong>
            {data.finalConfirmation
              ? "Onboarding Completed"
              : "Onboarding In Progress"}
          </strong>
        </p>

        <div className="progress-section">
          <div className="progress-labels">
            <span>
              Completed Steps: <strong>{data.completedCount} / 5</strong>
            </span>
            <br></br>
            <span>
              Progress: <strong>{data.progressPercentage}%</strong>
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${data.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Onboarding Steps</h3>
        <div className="step-list">
          {steps.map((step) => (
            <div key={step.id} className="step-item">
              <div>
                <strong>
                  Step {step.number}: {step.title}
                </strong>
                <div className="step-badge-row">
                  <span
                    className={
                      step.completed
                        ? "badge badge-success"
                        : "badge badge-pending"
                    }
                  ></span>
                </div>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onSelectStep(step.id)}
              >
                {step.completed ? "Review / Edit" : "Open Step"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
