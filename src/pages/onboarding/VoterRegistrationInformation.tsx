import { useState } from "react";
import NextButton from "../../components/NextButton.js";
import { supabase } from "../../supabase.ts";
import { Link, useNavigate } from "react-router";
import Toast from "../../components/Toast.js";
import RadioComp from "../../components/buttons/radio.tsx";
import Progressbar from "../../components/Progressbar.tsx";
import { useOnboarding } from "../../context/OnboardingContext.tsx";
import checkReqiredField from "../../utils/CheckRequired.ts";
import FormSelect from "../../components/select/FormSelect.tsx";

export default function VoterRegistrationInformationPage() {
  let navigate = useNavigate();
  const requiredFields = [
    {
      label: "Are you Registered to Vote?",
      value: "is_registered",
    },
    {
      label: "Voter Registration Year",
      value: "registration_date",
    },
  ];

  const { profileDetails, updateProfileDetails } = useOnboarding();

  const is_registered = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
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
      navigate("/onboarding/political-prefrences");
    }
  }

  function getYears() {
    const minYear = 1960;
    const date = new Date();
    const maxYear = date.getFullYear();
    const diff = maxYear - minYear;

    const years = Array(diff+1).fill("");
    return years.map((_, index) => {
      return {
        id: index,
        label: `${index + minYear}`,
        value: `${index + minYear}`,
        unavailable: false,
      };
    });
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
      <Progressbar currentNumber={4} />
      {/* Form Section */}
      <div>
        <p className="text-gray-dark dark:text-gray-100 text-2xl xsm:mb-6 md:mb-12 text-gray-dark ">
          Voter Registration Information
        </p>

        <form
          className="grid gap-8"
          onSubmit={(e) => {
            setIsLoading(true);
            e.preventDefault();
            uploadData();
            setIsLoading(false);
          }}
        >
          <RadioComp
            label="Are you Registered to Vote?"
            options={is_registered}
            onChange={(value) => updateProfileDetails({ is_registered: value })}
            value={profileDetails.is_registered}
            required={true}
          />


          <FormSelect
            required={true}
            defaultSelected={profileDetails.registration_date}
            label="Voter Registration Year"
            options={getYears()}
            onChange={(value) =>
              updateProfileDetails({ registration_date: value?.value })
            }
          />
          <NextButton content="Next" disabled={isLoading} />
        </form>
      </div>

      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </div>
  );
}
