import { useEffect, useState } from "react";
import NextButton from "../../components/NextButton.js";
import { supabase } from "../../supabase.ts";
import { Link, useNavigate } from "react-router";
import Toast from "../../components/Toast.js";
import Progressbar from "../../components/Progressbar.tsx";
import { getPoliticalIssue, getPoliticalParties } from "../data.ts";
import { useOnboarding } from "../../context/OnboardingContext.tsx";
import checkReqiredField from "../../utils/CheckRequired.ts";
import MultiSelectComp from "../../components/multi_select/MultiSelect.tsx";
import FormSelect from "../../components/select/FormSelect.tsx";


type OptionType = {
  label: string;
  value: any;
  disabled?: boolean;
};
export default function PoliticalPrefrencesPage() {
  let navigate = useNavigate();

  const requiredFields = [
    {
      label: "Political Party Affiliation (If any)",
      value: "party_affiliation",
    },
    {
      label: "Top Political Issues",
      value: "top_political_issues",
    },
  ];

  const { profileDetails, updateProfileDetails } = useOnboarding();
  const [political_issues, setPoliticalIssue] = useState([]);
  const [political_parties, setPoliticalParties] = useState([]);

  useEffect(() => {
    getPoliticalIssue(setPoliticalIssue);
    getPoliticalParties(setPoliticalParties);
  }, []);

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
      navigate("/onboarding/engagement-and-mobilization");
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
      <Progressbar currentNumber={5} />
      {/* Form Section */}
      <h2 className="text-gray-dark dark:text-gray-100 text-2xl">
        Political Prefrences
      </h2>
      <form
        className="flex flex-col gap-8"
        onSubmit={(e) => {
          setIsLoading(true);
          e.preventDefault();
          uploadData();
          setIsLoading(false);
        }}
      >
        <FormSelect
          required={true}
          defaultSelected={profileDetails.party_affiliation}
          label="Political Party Affiliation (If any)"
          options={political_parties}
          onChange={(value) =>
            updateProfileDetails({ party_affiliation: value?.value })
          }
        />
      

        
                <MultiSelectComp
                required={true}
                  options={political_issues}
                  onChange={(value: OptionType[]) =>
                    updateProfileDetails({
                      top_political_issues: value?.map((v) => v.value),
                    })
                  }
                  label="Top Political Issues"
                  placeholder="e.g. facebook"
                  defaultSelected={profileDetails.top_political_issues}
                />

        <NextButton content="Next" disabled={isLoading} />
      </form>
      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </div>
  );
}
