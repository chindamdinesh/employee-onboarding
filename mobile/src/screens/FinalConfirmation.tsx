import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { StepProps } from "./PersonalInfoScreen";
import { useEffect, useState } from "react";
import { DashboardData } from "../types/onboarding";
import { api } from "../api/client";
import { styles } from "../styles/styles";

export function FinalConfirmation({ onBack }: StepProps) {
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb"></ActivityIndicator>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.card}>
        <View style={styles.alertError}>
          <Text style={styles.alertErrorText}>
            {error || "Unable to load summary"}
          </Text>
        </View>
        <Pressable style={styles.btnSecondary} onPress={onBack}>
          <Text style={styles.btnSecondaryText}>← Back to Dashboard</Text>
        </Pressable>
      </View>
    );
  }

  const allStepsCompleted =
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

  const confirmDisabled =
    !allStepsCompleted || submitting || data.finalConfirmation;

  const stepCompletedBtnText = "Completed ✓",
    stepIncompleteBtText = "Incomplete ✗";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Step 5. Final Confirmation</Text>
      <Text style={styles.subtitle}>Summary of Steps 1-4:</Text>
      {error && (
        <View style={styles.alertError}>
          <Text style={styles.alertErrorText}>{error}</Text>
        </View>
      )}
      {successMsg && (
        <View style={styles.alertSuccess}>
          <Text style={styles.alertSuccessText}>{successMsg}</Text>
        </View>
      )}
      <Text style={styles.summaryLine}>
        1. Personal Information:{" "}
        {data.personalInformationCompleted
          ? stepCompletedBtnText
          : stepIncompleteBtText}
      </Text>
      <Text style={styles.summaryLine}>
        2. Company Introduction:{" "}
        {data.readCompanyIntroduction
          ? stepCompletedBtnText
          : stepIncompleteBtText}
      </Text>
      <Text style={styles.summaryLine}>
        3. Company Policy:{" "}
        {data.acknowledgedCompanyPolicy
          ? stepCompletedBtnText
          : stepIncompleteBtText}
      </Text>
      <Text style={styles.summaryLine}>
        4. Joining Checklist:{" "}
        {data.joiningChecklistCompleted
          ? stepCompletedBtnText
          : stepIncompleteBtText}
      </Text>
      {!allStepsCompleted && (
        <View style={styles.alertError}>
          <Text style={styles.alertErrorText}>
            Complete all of Steps 1-4 to finish onboarding.
          </Text>
        </View>
      )}
      {data.finalConfirmation && (
        <View style={styles.alertSuccess}>
          <Text style={styles.alertSuccessText}>
            Onboarding is 100% complete! Welcome aboard, {data.name}!
          </Text>
        </View>
      )}
      <Pressable
        style={[styles.btnPrimary, confirmDisabled && styles.btnDisabled]}
        onPress={handleConfirm}
        disabled={confirmDisabled}
      >
        <Text style={styles.btnPrimaryText}>
          {data.finalConfirmation
            ? "Onboarding Completed"
            : submitting
              ? "Confirming..."
              : "Finish Onboarding"}
        </Text>
      </Pressable>
      <Pressable style={styles.btnSecondary} onPress={onBack}>
        <Text style={styles.btnSecondaryText}>← Back to Dashboard</Text>
      </Pressable>
    </View>
  );
}
