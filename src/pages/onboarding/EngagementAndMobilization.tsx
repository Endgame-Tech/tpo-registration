import RadioComp from "../../components/buttons/radio";
import { useState } from "react";
import NextButton from "../../components/NextButton.js";
import { supabase } from "../../supabase.ts";
import { Link, useNavigate } from "react-router";
import Toast from "../../components/Toast.js";
import MultiSelectComp from "../../components/multi_select/MultiSelect.tsx";
import Progressbar from "../../components/Progressbar.tsx";
import { useOnboarding } from "../../context/OnboardingContext.tsx";
import checkReqiredField from "../../utils/CheckRequired.ts";

type OptionType = {
  label: string;
  value: any;
  disabled?: boolean;
};
export default function EngagementAndMobilizationPage() {
  let navigate = useNavigate();
  const requiredFields = [
    {
      label: "Are you willing to Volunteer?",
      value: "is_volunteering",
    },
    {
      label: "Interested in Canvassing?",
      value: "is_canvassing",
    },
    {
      label: "Attended Political Rallies or Events?",
      value: "attended_events",
    },
    {
      label: "Have you participated in Previous Elections?",
      value: "past_election_participation",
    },
    {
      label: "Preferred Method of Communication",
      value: "preferred_method_of_communication",
    },
  ];

  const { profileDetails, updateProfileDetails } = useOnboarding();

  const is_volunteering = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "Not Sure Yet", value: "not sure yet" },
  ];

  const is_canvassing = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "Not Sure Yet", value: "not sure yet" },
  ];
  const attended_events = [
    { id: 1, label: "Yes", value: true },
    { id: 2, label: "No", value: false },
  ];

  const past_election_participation = [
    { id: 1, label: "Yes", value: true },
    { id: 2, label: "No", value: false },
  ];
  const preferred_method_of_communication = [
    { id: 1, label: "Call", value: "call" },
    { id: 2, label: "Email", value: "email" },
    { id: 3, label: "Whatsapp", value: "whatsapp" },
    { id: 4, label: "Text Message", value: "text message" },
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
      navigate("/onboarding/voting-behavior");
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
      <Progressbar currentNumber={6} />
      <h2 className="text-gray-dark dark:text-gray-100 text-2xl">
        Engagement and Mobilization
      </h2>
      <form
        onSubmit={(e) => {
          setIsLoading(true);
          e.preventDefault();
          uploadData();
          setIsLoading(false);
        }}
        className="flex flex-col gap-8"
      >
        <RadioComp
          required={true}
          value={profileDetails.is_volunteering}
          label="Are you willing to Volunteer?"
          options={is_volunteering}
          onChange={(value) => updateProfileDetails({ is_volunteering: value })}
        />
        <RadioComp
          required={true}
          value={profileDetails.is_canvassing}
          label="Interested in Canvassing?"
          options={is_canvassing}
          onChange={(value) => updateProfileDetails({ is_canvassing: value })}
        />

        <RadioComp
          required={true}
          value={profileDetails.attended_events}
          label="Attended Political Rallies or Events?"
          options={attended_events}
          onChange={(value) => updateProfileDetails({ attended_events: value })}
        />

        <RadioComp
          required={true}
          value={profileDetails.past_election_participation}
          label="Have you participated in Previous Elections?"
          options={past_election_participation}
          onChange={(value) =>
            updateProfileDetails({
              past_election_participation: value,
            })
          }
        />
        <MultiSelectComp
          required={true}
          defaultSelected={profileDetails.preferred_method_of_communication}
          label="Preferred Method of Communication"
          options={preferred_method_of_communication}
          onChange={(value: OptionType[]) =>
            updateProfileDetails({
              preferred_method_of_communication: value?.map((v) => v.value),
            })
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
