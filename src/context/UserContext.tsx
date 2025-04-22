import { createContext, useState, useEffect, useContext, ReactNode } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface UserProfile {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  country_code?: string;
  gender: string;
  age_range: string;
  state_of_origin: string;
  voting_engagement_state: string;
  lga: string;
  ward: string;
  ethnicity: string;
  religion: string;
  occupation: string;
  level_of_education: string;
  marital_status: string;
  household_size: string;
  income_bracket: string;
  party_affiliation: string;
  top_political_issues: string[];
  is_volunteering: string;
  past_election_participation: string;
  preferred_method_of_communication: string[];
  has_internet_access: string;
  preferred_social_media: string[];
  is_smartphone_user: string;
  likely_to_vote: string;
  is_registered: string;
  registration_date: string;
  voter_id_number: string;
  vote_impact: string;
  trust_in_election_body: string;
  profile_picture_url?: string;
  has_onboarded: boolean;
  member_id?: string;
  role: "member" | "verified" | "admin";
  emailVerified: boolean;
  is_verified_user: boolean;
}

interface UserContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshProfile() {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/users/me`, {
        credentials: "include",
      });
      const user = await res.json();
      if (!res.ok) throw new Error(user.message || "Failed to fetch user");

      setProfile((prev) => ({
        ...prev,

        // Flatten all onboardingData first
        ...user.onboardingData.securityValidation,
        ...user.onboardingData.demographics,
        ...user.onboardingData.politicalPreferences,
        ...user.onboardingData.engagementAndMobilization,
        ...user.onboardingData.technologyAccess,
        ...user.onboardingData.votingBehavior,
        ...user.onboardingData.surveyQuestions,

        // Then personalInfo LAST to overwrite
        ...user.personalInfo,

        has_onboarded: user.has_onboarded,
        member_id: user.member_id,
        role: user.role,
        emailVerified: user.emailVerified,
        is_verified_user: user.is_verified_user,
      }));
    } catch (err) {
      console.error("Error loading profile:", err);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <UserContext.Provider value={{ profile, isLoading, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
