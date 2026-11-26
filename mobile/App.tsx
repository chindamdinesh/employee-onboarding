import { StatusBar } from "expo-status-bar";
import { use, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { DashboardScreen, ScreenName } from "./src/screens/DashboardScreen";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./src/styles/styles";
import { AuthScreen } from "./src/screens/AuthScreen";
import { PersonalInfoScreen } from "./src/screens/PersonalInfoScreen";
import { CompanyIntroScreen } from "./src/screens/CompanyIntroScreen";
import { CompanyPolicyScreen } from "./src/screens/CompanyPolicyScreen";
import { ChecklistScreen } from "./src/screens/ChecklistScreen";
import { FinalConfirmation } from "./src/screens/FinalConfirmation";
import { ProfileScreen } from "./src/screens/ProfileScreen";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("dashboard");

  useEffect(() => {
    SecureStore.getItemAsync("token")
      .then((savedToken) => setToken(savedToken))
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLoginSuccess = (jwtToken: string) => {
    setToken(jwtToken);
    setCurrentScreen("dashboard");
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    setToken(null);
    setCurrentScreen("dashboard");
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3563eb" />
        </View>
      </SafeAreaView>
    );
  }

  if (!token) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.topNav}>
          <Text style={styles.brand}> Sumpositive Onboarding</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case "step1":
        return (
          <PersonalInfoScreen onBack={() => setCurrentScreen("dashboard")} />
        );
      case "step2":
        return (
          <CompanyIntroScreen onBack={() => setCurrentScreen("dashboard")} />
        );
      case "step3":
        return (
          <CompanyPolicyScreen onBack={() => setCurrentScreen("dashboard")} />
        );
      case "step4":
        return <ChecklistScreen onBack={() => setCurrentScreen("dashboard")} />;
      case "step5":
        return (
          <FinalConfirmation onBack={() => setCurrentScreen("dashboard")} />
        );
      case "profile":
        return <ProfileScreen onBack={() => setCurrentScreen("dashboard")} />;
      case "dashboard":
      default:
        return (
          <DashboardScreen onSelectStep={(step) => setCurrentScreen(step)} />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.topNav}>
        <Pressable onPress={() => setCurrentScreen("dashboard")}>
          <Text style={styles.brand}>Sumpositive</Text>
        </Pressable>
        <View style={styles.navActions}>
          <Pressable
            style={styles.navBtn}
            onPress={() => setCurrentScreen("dashboard")}
          >
            <Text style={styles.navBtnText}>Home</Text>
          </Pressable>
          <Pressable
            style={styles.navBtn}
            onPress={() => setCurrentScreen("profile")}
          >
            <Text style={styles.navBtnText}>Profile</Text>
          </Pressable>
          <Pressable style={styles.navBtn} onPress={handleLogout}>
            <Text style={styles.navBtnText}>Logout</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderActiveScreen()}
      </ScrollView>
    </SafeAreaView>
  );
}
