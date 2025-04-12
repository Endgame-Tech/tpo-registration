import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "../supabase";
import { generateMemberId } from "../utils/generateMemberId";
import checkReqiredField from "../utils/CheckRequired";

// Define the type
type onboardingValue = { [key: string]: any };

const requiredFields = [
  {
    label: "First name",
    value: "first_name",
  },
  {
    label: "Last name",
    value: "last_name",
  },
  {
    label: "Gender",
    value: "gender",
  },
  {
    label: "LGA",
    value: "lga",
  },
  {
    label: "Phone Number",
    value: "phone_number",
  },
  {
    label: "Age Range",
    value: "age_range",
  },
  {
    label: "Your State of Origin",
    value: "state_of_origin",
  },
  {
    label: "State of Voting and Political Engagement",
    value: "voting_engagement_state",
  },
];

interface OnboardingContextProps {
  profileDetails: onboardingValue;
  updateProfileDetails: (data: any) => void;
}

export const OnboardingContext = createContext<OnboardingContextProps>(
  {} as OnboardingContextProps
);

type childrenProps = {
  children: ReactNode;
};

export const OnboardingProvider = ({ children }: childrenProps) => {
  const [profileDetails, setPersonalInfo] = useState({});

  async function  updateProfileDetails(data: any) {
    let result, memberId;
    let newProfileDetails = {
      ...profileDetails,
      ...data,
    };

    
    try {
      result = checkReqiredField(newProfileDetails, requiredFields);
      memberId = await generateMemberId(newProfileDetails);
    } catch (error) {
      console.log(error);
    }

    newProfileDetails = {
      ...newProfileDetails,
      has_onboarded: result?.is_ok,
      member_id: memberId,
    };

    setPersonalInfo(newProfileDetails);
  }

  useEffect(() => {
    getProfileDetails();
  }, []);

  async function getProfileDetails() {
    const { data } = await supabase.auth.getUser();
    const { data: profileData } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", data?.user?.id);

    if (profileData === null) {
      return;
    }

    updateProfileDetails(profileData[0]);
  }

  return (
    <OnboardingContext.Provider
      value={{ profileDetails, updateProfileDetails }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
