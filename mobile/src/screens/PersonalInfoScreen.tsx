import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../api/client";
import { PersonalInfo } from "../types/onboarding";
import { styles } from "../styles/styles";

export interface StepProps {
  onBack: () => void;
}

export function PersonalInfoScreen({ onBack }: StepProps) {
  const [formData, setFormData] = useState<PersonalInfo>({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadPersonalInfo = async () => {
    try {
      setLoading(true);
      const res: PersonalInfo = await api.getPersonalInfo();
      setFormData({
        fullName: res.fullName ?? "",
        phoneNumber: res.phoneNumber ?? "",
        dateOfBirth: res.dateOfBirth ?? "",
        emergencyContactName: res.emergencyContactName ?? "",
        emergencyContactNumber: res.emergencyContactNumber ?? "",
        address: res.address ?? "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch personal information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccessMsg(null);

    if (
      !formData.fullName?.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.dateOfBirth.trim() ||
      !formData.emergencyContactName.trim() ||
      !formData.emergencyContactNumber.trim() ||
      !formData.address.trim()
    ) {
      setError("All personal information fields are required.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth.trim())) {
      setError(
        "Date of Birth must be in YYYY-MM-DD format (e.g., 2001-09-11).",
      );
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      setError("Phone number must only contains numbers and 10-digits long");
      return;
    }

    if (!/^\d{10}$/.test(formData.emergencyContactNumber.trim())) {
      setError(
        "Emergency Contact number must only contains numbers and 10-digits long",
      );
      return;
    }

    setSaving(true);
    try {
      await api.savePersonalInfo(formData);
      setSuccessMsg("Personal Information saved! Step 1 is complete.");
    } catch (err: any) {
      setError(err.message || "Failed to save personal information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3563eb" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Step 1: Personal Information</Text>
      <Text style={styles.subtitle}>
        Enter your personal and emergency contact details.
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

      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />

      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
        keyboardType="phone-pad"
        placeholder="e.g., 9876543210"
      />

      <Text style={styles.label}>Date of Birth *</Text>
      <TextInput
        style={styles.input}
        value={formData.dateOfBirth}
        onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
        placeholder="e.g., 2001-09-11"
      />

      <Text style={styles.label}>Emergency Contact Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.emergencyContactName}
        onChangeText={(text) =>
          setFormData({ ...formData, emergencyContactName: text })
        }
      />

      <Text style={styles.label}>Emergency Contact Number *</Text>
      <TextInput
        style={styles.input}
        value={formData.emergencyContactNumber}
        onChangeText={(text) =>
          setFormData({ ...formData, emergencyContactNumber: text })
        }
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Address *</Text>
      <TextInput
        style={styles.input}
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
        multiline
      />

      <Pressable
        style={[styles.btnPrimary, saving && styles.btnDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.btnPrimaryText}>
          {saving ? "Saving ..." : "Save"}
        </Text>
      </Pressable>

      <Pressable style={styles.btnSecondary} onPress={onBack}>
        <Text style={styles.btnSecondaryText}>← Back to Dashboard</Text>
      </Pressable>
    </View>
  );
}
