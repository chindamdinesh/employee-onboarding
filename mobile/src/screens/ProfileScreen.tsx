import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { api } from "../api/client";
import { styles } from "../styles/styles";
import type { ProfileData } from "../types/onboarding";
import type { StepProps } from "./PersonalInfoScreen";

export function ProfileScreen({ onBack }: StepProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getProfile()
      .then((res) => setProfile(res))
      .catch((err: any) => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Employee Profile</Text>

      {error && (
        <View style={styles.alertError}>
          <Text style={styles.alertErrorText}>{error}</Text>
        </View>
      )}

      {profile && (
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.summaryLine}>
            <Text style={styles.boldLabel}>Full Name: </Text>
            {profile.fullName}
          </Text>
          <Text style={styles.summaryLine}>
            <Text style={styles.boldLabel}>Personal Email: </Text>
            {profile.email}
          </Text>
          <Text style={styles.summaryLine}>
            <Text style={styles.boldLabel}>Onboarding Status: </Text>
            {profile.status}
          </Text>
        </View>
      )}

      <Pressable style={styles.btnSecondary} onPress={onBack}>
        <Text style={styles.btnSecondaryText}>← Back to Home</Text>
      </Pressable>
    </View>
  );
}
