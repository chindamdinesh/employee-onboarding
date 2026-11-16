export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  name: string;
  onboardingStatus: string;
}

export interface ProfileData {
  fullName: string;
  email: string;
  status: string;
}

export interface DashboardData {
  name: string;
  email: string;
  completedCount: number;
  progressPercentage: number;
  personalInformationCompleted: boolean;
  readCompanyIntroduction: boolean;
  acknowledgedCompanyPolicy: boolean;
  checklistJoiningDate: boolean;
  checklistFirstDay: boolean;
  checklistOrientation: boolean;
  joiningChecklistCompleted: boolean;
  finalConfirmation: boolean;
  updatedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  phoneNumber: number | null;
  dateOfBirth: string | null;
  emergencyContactName: string | null;
  emergencyContactNumber: string | null;
  address: string | null;
}

export interface ChecklistProgress {
  joiningDate: boolean;
  firstDayInstruction: boolean;
  orientationInformation: boolean;
}
