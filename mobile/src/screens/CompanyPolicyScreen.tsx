import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import { api } from "../api/client";
import { styles } from "../styles/styles";
import type { StepProps } from "./PersonalInfoScreen";

export function CompanyPolicyScreen({ onBack }: StepProps) {
  const [policyText, setPolicyText] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSave = async () => {
    if (!checked) {
      setError("Please acknowledge the company policies before saving.");
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setSaving(true);
    try {
      await api.acknowledgeCompanyPolicy();
      setSuccessMsg("Company policies acknowledged and saved!");
    } catch (err: any) {
      setError(err.message || "Failed to save acknowledgement");
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
      <Text style={styles.title}>Step 3: Company Policies</Text>

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

      <View style={styles.contentBox}>
        <Text style={styles.contentText}>{policyText}</Text>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>
          I have read and agree to Sumpositive's attendance, working-hours,
          leave, and conduct policies.
        </Text>
        <Switch value={checked} onValueChange={setChecked} />
      </View>

      <Pressable
        style={[styles.btnPrimary, (saving || !checked) && styles.btnDisabled]}
        onPress={handleSave}
        disabled={saving || !checked}
      >
        <Text style={styles.btnPrimaryText}>
          {saving ? "Saving..." : "Save Acknowledgement"}
        </Text>
      </Pressable>

      <Pressable style={styles.btnSecondary} onPress={onBack}>
        <Text style={styles.btnSecondaryText}>← Back to Dashboard</Text>
      </Pressable>
    </View>
  );
}
