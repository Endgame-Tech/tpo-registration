import { useEffect, useState } from "react";
import NextButton from "../../components/NextButton.js";
import { supabase } from "../../supabase.ts";
import { Link, useNavigate } from "react-router";
import Toast from "../../components/Toast.js";
import Progressbar from "../../components/Progressbar.tsx";
import {
  getEthnicity,
  getHouseholdSize,
  getIncomeBracket,
  getLevelOfEducation,
  getMaritalStatus,
  getOccupation,
  getReligion,
} from "../data.ts";
import { useOnboarding } from "../../context/OnboardingContext.tsx";
import checkReqiredField from "../../utils/CheckRequired.ts";
import FormSelect from "../../components/select/FormSelect.tsx";
import FormCombobox from "../../components/select/FormCombobox.tsx";

export default function DemographicsPage() {
  const requiredFields = [
    {
      label: "Ethnicity",
      value: "ethnicity",
    },
    {
      label: "Religion",
      value: "religion",
    },
    {
      label: "Occupation",
      value: "occupation",
    },
    {
      label: "Level of Education",
      value: "level_of_education",
    },
    {
      label: "Marital Status",
      value: "marital_status",
    },
    {
      label: "Household Size",
      value: "household_size",
    },
    {
      label: "Income Bracket",
      value: "income_bracket",
    },
  ];
  
  let navigate = useNavigate();
  const { profileDetails, updateProfileDetails } = useOnboarding();

  const [ethnicity, setEthnicity] = useState([]);
  const [religion, setReligion] = useState([]);
  const [occupation, setOccupation] = useState([]);
  const [level_of_education, setLevelOfEducation] = useState([]);
  const [marital_status, setMaritalStatus] = useState([]);
  const [household_size, setHouseholdSize] = useState([]);
  const [income_bracket, setIncomeBracket] = useState([]);

  useEffect(() => {
    getEthnicity(setEthnicity);
    getReligion(setReligion);
    getOccupation(setOccupation);
    getLevelOfEducation(setLevelOfEducation);
    getMaritalStatus(setMaritalStatus);
    getHouseholdSize(setHouseholdSize);
    getIncomeBracket(setIncomeBracket);
  }, []);

  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadData() {
        const {is_ok, message} = checkReqiredField(profileDetails, requiredFields )
    
        if (!is_ok) {
          console.log(message);
          setMessage(message);
          setToastType("error");
          setShowToast(true);
          return
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
      navigate("/onboarding/voter-registration-information");
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
      <Progressbar currentNumber={3} />
      {/* Form Section */}
      <p className="text-gray-dark dark:text-gray-100 text-2xl">Demographics</p>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          setIsLoading(true);
          e.preventDefault();
          uploadData();
          setIsLoading(false);
        }}
      >
        <FormCombobox
          required={true}
          defaultSelected={profileDetails.ethnicity}
          label="Ethnicity"
          options={ethnicity}
          onChange={(value) => updateProfileDetails({ ethnicity: value?.value })}
        />

        <FormSelect
          required={true}
          defaultSelected={profileDetails.religion}
          label="Religion"
          options={religion}
          onChange={(value) => updateProfileDetails({ religion: value?.value })}
        />
        <FormSelect
          required={true}
          defaultSelected={profileDetails.occupation}
          label="Occupation"
          options={occupation}
          onChange={(value) =>
            updateProfileDetails({ occupation: value?.value })
          }
        />
        <FormSelect
          required={true}
          defaultSelected={profileDetails.level_of_education}
          label=" Level of Education"
          options={level_of_education}
          onChange={(value) =>
            updateProfileDetails({ level_of_education: value?.value })
          }
        />
        <FormSelect
          required={true}
          defaultSelected={profileDetails.marital_status}
          label="Marital Status"
          options={marital_status}
          onChange={(value) =>
            updateProfileDetails({ marital_status: value?.value })
          }
        />
        <FormSelect
          required={true}
          defaultSelected={profileDetails.household_size}
          label="Household Size"
          options={household_size}
          onChange={(value) =>
            updateProfileDetails({ household_size: value?.value })
          }
        />
        <FormSelect
          required={true}
          defaultSelected={profileDetails.income_bracket}
          label="Income Bracket"
          options={income_bracket}
          onChange={(value) =>
            updateProfileDetails({ income_bracket: value?.value })
          }
        />
        <NextButton content="Next" disabled={isLoading} />
      </form>

      {/* Next Button */}
      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </div>
  );
}
