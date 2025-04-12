import RadioComp from "../../components/buttons/radio";
import { useState } from "react";
import NextButton from "../../components/NextButton.js";
import { supabase } from "../../supabase.ts";
import { Link, useNavigate } from "react-router";
import Toast from "../../components/Toast.js";
import Progressbar from "../../components/Progressbar.tsx";
import { useOnboarding } from "../../context/OnboardingContext.tsx";
import checkReqiredField from "../../utils/CheckRequired.ts";


export default function VotingBehavior() {
  let navigate = useNavigate();
  const requiredFields = [
    {
      label: "Likely to Vote in Upcoming Elections?",
      value: "likely_to_vote",
    },
  ];

  const { profileDetails, updateProfileDetails } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const likely_to_vote = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "Not Sure Yet", value: "not sure yet" },
  ];

  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
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
      navigate("/onboarding/technology-and-access");
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
      <Progressbar currentNumber={7} />
      <h2 className="text-gray-dark dark:text-gray-100 text-2xl">
        Voting Behavior
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
          value={profileDetails.likely_to_vote}
          label="Likely to Vote in Upcoming Elections?"
          options={likely_to_vote}
          onChange={(value) => updateProfileDetails({ likely_to_vote: value })}
          required={true}
        />

        <NextButton content="Next" disabled={isLoading} />
      </form>
      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </div>
  );
}
