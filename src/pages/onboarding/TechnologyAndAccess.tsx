import RadioComp from "../../components/buttons/radio";
import { useEffect, useState } from "react";
import NextButton from "../../components/NextButton.js";
import { supabase } from "../../supabase.ts";
import { Link, useNavigate } from "react-router";
import Toast from "../../components/Toast.js";
import MultiSelectComp from "../../components/multi_select/MultiSelect.tsx";
import Progressbar from "../../components/Progressbar.tsx";
import { getPreferredSocialMedia } from "../data.ts";
import { useOnboarding } from "../../context/OnboardingContext.tsx";
import checkReqiredField from "../../utils/CheckRequired.ts";

type OptionType = {
  label: string;
  value: any;
  disabled?: boolean;
};

export default function TechnologyAndAccessPage() {
  let navigate = useNavigate();
  const requiredFields = [
    {
      label: "Has Access to Internet?",
      value: "has_internet_access",
    },
    {
      label: "Preferred Social Media Platform",
      value: "preferred_social_media",
    },
    {
      label: "Smartphone User?",
      value: "is_smartphone_user",
    },
  ];
  

  const { profileDetails, updateProfileDetails } = useOnboarding();
  const [preferred_social_media, setPreferredSocialMedia] = useState([]);

  useEffect(() => {
    getPreferredSocialMedia(setPreferredSocialMedia);
  }, []);

  const has_internet_access = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "Kind off", value: "kind off" },
  ];
  const is_smartphone_user = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "Kind off", value: "kind off" },
  ];

  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState("");

  async function uploadData() {
    const { is_ok, message } = checkReqiredField(
      profileDetails,
      requiredFields
    );

    if (!is_ok) {
      console.log(message);
      setMessage(message);
      setToastType("error");
      setShowToast(true);
      return;
    }
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;

    const { error: updateError } = await supabase
      .from("profile")
      .update(profileDetails)
      .eq("user_id", userId);

    if (updateError) {
      console.log(`Login Error: ${updateError.message}`);
      setMessage(`Login Error: ${updateError.message}`);
      setToastType("error");
      setShowToast(true);
    } else {
      navigate("/onboarding/survey-questions");
    }
  }

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-8">
       <Link
        to={"/profile"}
        className="flex items-center justify-end text-accent-green  w-full   rounded-lg"
      >
        Skip
      </Link>
      <Progressbar currentNumber={8} />
      <h2 className="text-gray-dark dark:text-gray-100 text-2xl">
        Technology and Access
      </h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          setIsLoading(true);
          e.preventDefault();
          uploadData();
          setIsLoading(false);
        }}
      >
        <RadioComp
          value={profileDetails.has_internet_access}
          label="Has Access to Internet?"
          options={has_internet_access}
          onChange={(value) =>
            updateProfileDetails({ has_internet_access: value })
          }
          required={true}
        />

        <MultiSelectComp
        required={true}
          options={preferred_social_media}
          onChange={(value: OptionType[]) =>
            updateProfileDetails({
              preferred_social_media: value?.map((v) => v.value),
            })
          }
          label="Preferred Social Media Platform"
          placeholder="e.g. facebook"
          defaultSelected={profileDetails.preferred_social_media}
        />

        <RadioComp
        required={true}
          value={profileDetails.is_smartphone_user}
          label="Smartphone User?"
          options={is_smartphone_user}
          onChange={(value) =>
            updateProfileDetails({ is_smartphone_user: value })
          }
        />

        <NextButton content="Next" disabled={isLoading} />
      </form>
      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </div>
  );
}
