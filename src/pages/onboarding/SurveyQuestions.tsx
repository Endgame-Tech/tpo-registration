import RadioComp from "../../components/buttons/radio";
import { useEffect, useState } from "react";
import NextButton from "../../components/NextButton.js";
import { supabase } from "../../supabase.ts";
import { Link, useNavigate } from "react-router";
import Toast from "../../components/Toast.js";
import MultiSelectComp from "../../components/multi_select/MultiSelect.tsx";
import Progressbar from "../../components/Progressbar.tsx";
import { useOnboarding } from "../../context/OnboardingContext.tsx";
import { getElectionConcerns } from "../data.ts";
import checkReqiredField from "../../utils/CheckRequired.ts";

type OptionType = {
  label: string;
  value: any;
  disabled?: boolean;
};
export default function SurveyQuestionsPage() {
  let navigate = useNavigate();
  const { profileDetails, updateProfileDetails } = useOnboarding();
  const [election_concerns, setElectionConcerns] = useState([]);
  const requiredFields = [
    {
      label: "Can your vote make a difference?",
      value: "vote_impact",
    },
    {
      label: "Biggest Concern About the Election Process",
      value: "election_concerns",
    },
    {
      label: "Do You Trust in The Election Management Body",
      value: "trust_in_election_body",
    },
  ];

  useEffect(() => {
    getElectionConcerns(setElectionConcerns);
  }, []);

  const vote_impact = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "I hope it does", value: "i hope it does" },
  ];
  const trust_in_election_body = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "A little", value: "a little" },
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
      navigate("/profile");
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

      <Progressbar currentNumber={9} />
      <h2 className="text-gray-dark dark:text-gray-100 text-2xl">
        Survey Questions (Optional)
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
          required={true}
          value={profileDetails.vote_impact}
          label="Can your vote make a difference?"
          options={vote_impact}
          onChange={(value) => updateProfileDetails({ vote_impact: value })}
        />

        <MultiSelectComp
          required={true}
          defaultSelected={profileDetails.election_concerns}
          options={election_concerns}
          onChange={(value: OptionType[]) =>
            updateProfileDetails({
              election_concerns: value?.map((v) => v.value),
            })
          }
          label="Biggest Concern About the Election Process"
          placeholder="e.g. Electoral Fraud"
        />

        <RadioComp
          required={true}
          value={profileDetails.trust_in_election_body}
          label="Do You Trust in The Election Management Body"
          options={trust_in_election_body}
          onChange={(value) =>
            updateProfileDetails({ trust_in_election_body: value })
          }
        />

        <div>
          <label
            htmlFor=""
            className="block text-dark dark:text-gray-100 mb-2 text-sm"
          >
            Are there any additional notes or comments?
          </label>
          <textarea
            name=""
            id=""
            rows={10}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-secondary-light text-gray-700 dark:text-gray-200 "
            onChange={(e) =>
              updateProfileDetails({ additional_comments: e.target.value })
            }
          ></textarea>
        </div>

        <NextButton content="Next" disabled={isLoading} />
      </form>
      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </div>
  );
}
