import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import { StepProps } from "./PersonalInfoScreen";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { styles } from "../styles/styles";

export function ChecklistScreen({ onBack }: StepProps) {
  const [joiningDate, setJoiningDate] = useState(false);
  const [firstDayInstruction, setFirstDayInstruction] = useState(false);
  const [orientationInformation, setOrientationInformation] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    api
      .getJoiningChecklist()
      .then((res) => {
        setFirstDayInstruction(res.firstDayInstruction);
        setJoiningDate(res.joiningDate);
        setOrientationInformation(res.orientationInformation);
      })
      .catch((err: any) =>
        setError(err.message || "Failed to fetch checklist progress"),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccessMsg(null);
    setSaving(true);

    try {
      const saved = await api.saveJoiningChecklist({
        joiningDate,
        firstDayInstruction,
        orientationInformation,
      });
      const allDone =
        saved.firstDayInstruction &&
        saved.joiningDate &&
        saved.orientationInformation;
      setSuccessMsg(
        allDone
          ? "Step 4 completed."
          : "Progress saved! Note: All 3 items must be checked to complete this step.",
      );
    } catch (err: any) {
      setError(err.message || "Failed to save checklist progress");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Step 4: Joining Checklist</Text>
      <Text style={styles.subtitle}>
        All three items must be toggled on to complete this step.
      </Text>

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

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>1. Confirm Joining date</Text>
        <Switch value={joiningDate} onValueChange={setJoiningDate} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>2. Review first-day instructions</Text>
        <Switch
          value={firstDayInstruction}
          onValueChange={setFirstDayInstruction}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>
          3. Acknowledge orientation information
        </Text>
        <Switch
          value={orientationInformation}
          onValueChange={setOrientationInformation}
        />
      </View>

      <Pressable
        style={[styles.btnPrimary, saving && styles.btnDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.btnPrimaryText}>
          {saving ? "Saving..." : "Save Checklist"}
        </Text>
      </Pressable>

      <Pressable style={styles.btnSecondary} onPress={onBack}>
        <Text style={styles.btnSecondaryText}>← Back to Dashboard</Text>
      </Pressable>
    </View>
  );
}
