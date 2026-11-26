import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { styles } from "../styles/styles";
import { api } from "../api/client";
import { View, Text, TextInput, Pressable } from "react-native";

interface AuthScreenProps {
  onLoginSuccess: (token: string) => void;
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || (isRegistering && !name.trim())) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isRegistering && !(password === confirmPass)) {
      setError("Passwords didn't match. Try again.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const res = await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        setSuccessMsg(
          res.message || "Registration successful! Please sign in.",
        );
        setIsRegistering(false);
      } else {
        const res = await api.login({ email: email.trim(), password });
        await SecureStore.setItemAsync("token", res.token);
        onLoginSuccess(res.token);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setPassword("");
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {isRegistering ? "New Joiner Registration" : "Sumpositive Sign In"}
      </Text>
      <Text style={styles.subtitle}>
        {isRegistering
          ? "Create your personal onboarding account"
          : "Sign in to continue"}
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

      {isRegistering && (
        <>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />
        </>
      )}

      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password *</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder={isRegistering ? "Minimum 8 characters" : "Password"}
        secureTextEntry
      />

      {isRegistering && (
        <>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            value={confirmPass}
            onChangeText={setConfirmPass}
            placeholder="Enter your password again"
            secureTextEntry
          />
        </>
      )}

      <Pressable
        style={[styles.btnPrimary, loading && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.btnPrimaryText}>
          {loading ? "Please wait..." : isRegistering ? "Register" : "Login"}
        </Text>
      </Pressable>

      <View style={styles.row}>
        <Text>
          {isRegistering ? "Already have an account? " : "New Joiner? "}
        </Text>

        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          onPress={handleToggleMode}
          hitSlop={8}
        >
          <Text style={styles.linkText}>
            {isRegistering ? "Sign In" : "Create an Account"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
