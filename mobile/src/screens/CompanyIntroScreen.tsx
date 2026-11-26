import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { StepProps } from "./PersonalInfoScreen";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { DashboardData } from "../types/onboarding";
import { styles } from "../styles/styles";

export function CompanyIntroScreen({ onBack }: StepProps) {
  const [dashboard, setdashboard] = useState<DashboardData>();
  const [introText, setIntroText] = useState<string>("");
  const [isRead, setIsRead] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const loadCompanyIntro = async () => {
    setLoading(true);
    Promise.all([api.getCompanyIntro(), api.getDashboard()])
      .then(([text, dashboard]) => {
        setIntroText(text);
        setIsRead(dashboard.readCompanyIntroduction);
      })
      .catch((err: any) =>
        setError(err.message || "Failed to load introduction"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCompanyIntro();
  }, []);

  const handleMarkAsRead = async () => {
    setError(null);
    setSuccessMsg(null);
    setSaving(true);

    try {
      await api.markCompanyIntroRead();
      setIsRead(true);
      setSuccessMsg("Company Introduction marked as read!");
    } catch (err: any) {
      setError(err.message || "Failed to save acknowledgment");
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
      <Text style={styles.title}>Step 2: Company Introduction</Text>

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
        <Text style={styles.contentText}>{introText}</Text>
      </View>

      <Text style={{ marginBottom: 8, fontWeight: "600" }}>
        Status: {isRead ? "Read & Acknowledged ✓" : "Not yet marked as read"}
      </Text>

      <Pressable
        style={[styles.btnPrimary, (saving || isRead) && styles.btnDisabled]}
        onPress={handleMarkAsRead}
        disabled={saving || isRead}
      >
        <Text style={styles.btnPrimaryText}>
          {saving ? "Saving..." : isRead ? "Marked as Read" : "Mark as Read"}
        </Text>
      </Pressable>

      <Pressable style={styles.btnSecondary} onPress={onBack}>
        <Text style={styles.btnSecondaryText}>← Back to Dashboard</Text>
      </Pressable>
    </View>
  );
}
