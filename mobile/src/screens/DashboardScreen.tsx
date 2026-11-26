import { useEffect, useState } from "react";
import { DashboardData } from "../types/onboarding";
import { api } from "../api/client";
import { styles } from "../styles/styles";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

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

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Loading Dashboard...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.card}>
        <View style={styles.alertError}>
          <Text style={styles.alertErrorText}>
            {error || "Unable to load dashboard"}
          </Text>
        </View>
        <Pressable style={styles.btnPrimary} onPress={loadDashboard}>
          <Text style={styles.btnPrimaryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

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
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome, {data.name}!</Text>
        <Text style={styles.subtitle}>
          Status:{" "}
          {data.finalConfirmation
            ? "Onboarding Completed"
            : "Onboarding In Progress"}
        </Text>

        <View style={styles.progressLabels}>
          <Text>Completed: {data.completedCount} / 5</Text>
          <Text style={{ fontWeight: "700" }}>{data.progressPercentage} %</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${data.progressPercentage}%` },
            ]}
          />
        </View>

        <Pressable style={styles.btnSecondary} onPress={loadDashboard}>
          <Text style={styles.btnSecondaryText}>↻ Refresh Progress</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={[styles.title, { fontSize: 17, marginBottom: 10 }]}>
          Onboarding Steps
        </Text>

        {steps.map((step) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.stepTitle}>
                Step {step.number}: {step.title}
              </Text>
              <Text
                style={
                  step.completed ? styles.badgeSuccess : styles.badgePending
                }
              >
                {step.completed ? "Completed (20%)" : "Pending"}
              </Text>
            </View>
            <Pressable
              style={[styles.btnSecondary, { marginTop: 0 }]}
              onPress={() => onSelectStep(step.id)}
            >
              <Text style={styles.btnSecondaryText}>
                {step.completed ? "Edit" : "Open"}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
