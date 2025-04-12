import { useEffect, useState } from "react";
import NextButton from "../../components/NextButton.js";
import TextInput from "../../components/inputs/TextInput.tsx";
import { supabase } from "../../supabase.ts";
import { useNavigate } from "react-router";
import Toast from "../../components/Toast.js";
import Progressbar from "../../components/Progressbar.tsx";
import { useOnboarding } from "../../context/OnboardingContext.tsx";
import checkReqiredField from "../../utils/CheckRequired.ts";
import { generateMemberId } from "../../utils/generateMemberId.ts";
import PhoneInput from "../../components/PhoneInput.tsx";
import FormSelect from "../../components/select/FormSelect.tsx";
import { convertData } from "../../utils/ReformatToOption.tsx";
import { statesLGAWardList } from "../../utils/StateLGAWard.ts";


interface SelectOptionType {
  id: number;
  label: string;
  value: any;
  unavailable?: boolean;
}

export default function profileDetailsPage() {
  const { profileDetails, updateProfileDetails } = useOnboarding();
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
      label: "Ward",
      value: "ward",
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

  let navigate = useNavigate();
  const gender = [
    { id: 1, label: "Male", value: "Male", unavailable: false },
    { id: 2, label: "Female", value: "Female", unavailable: false },
  ];

  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [states, setStates] = useState<SelectOptionType[]>([]);
  const [ageRanges, setAgeRange] = useState<SelectOptionType[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (states.length === 0) {
      getStates();
      getAgeRange();
    }
  }, []);


  async function getStates() {
    const formattedState = statesLGAWardList.map((state, indx) => {
      return {
        id: indx + 1,
        label: state?.state,
        value: state?.state,
        unavailable: false,
      };
    });

    setStates(formattedState);
  }

  function getLga(selectedState = "") { 
    if (selectedState === "") {
      return [];
    }

    const [selectedLga] = statesLGAWardList.filter(
      (state) => state.state === selectedState
    );

    const formattedLga = selectedLga?.lgas?.map((lga, indx) => {
      return {
        id: indx + 1,
        label: lga.lga,
        value: lga.lga,
        unavailable: false,
      };
    });
    return formattedLga;
  }
  function getWard(selectedLga = "", selectedState = "") {
    if (selectedLga === "" || selectedState === "") {
      return [];
    }

    const [StateDetails] = statesLGAWardList.filter(
      (state) => state.state === selectedState
    );

    if (!StateDetails) {
      return [];
    }

    const [lgaDetails] = StateDetails.lgas.filter(
      (state) => state.lga === selectedLga
    );

    if (!lgaDetails) {
      return [];
    }

    const formattedLga = lgaDetails?.wards?.map((ward, indx) => {
      return {
        id: indx + 1,
        label: ward,
        value: ward,
        unavailable: false,
      };
    });
    return formattedLga;
  }
  async function getAgeRange() {
    const { data } = await supabase.from("age_range").select("id, name");
    if (data) {
      setAgeRange(convertData(data));
    } else {
      setAgeRange([]);
    }
  }

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
    console.log(profileDetails);

    const memberId = await generateMemberId(profileDetails);
    const UserDetails = {
      ...profileDetails,
      has_onboarded: true,
      member_id: memberId,
    };

    // Insert username into the profile table
    const { error: updateError } = await supabase
      .from("profile")
      .update(UserDetails)
      .eq("user_id", userId);

    if (updateError) {
      console.log(`Error: ${updateError.message}`);
      setMessage(`Error: ${updateError.message}`);
      setToastType("error");
      setShowToast(true);
    } else {
      navigate("/onboarding/security-validation");
    }
  }

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="flex flex-col justify-between px-4 py-4 max-w-[450px] w-full gap-8">
      <Progressbar currentNumber={1} />
      {/* Form Section */}
      <div>
        <p className="get-started-text xsm:mb-6 md:mb-12 text-gray-dark dark:text-gray-100 text-3xl">
          Personal Information
        </p>
        {/* Peter Gregory Obi */}
        <form
          className="grid gap-8"
          onSubmit={(e) => {
            setIsLoading(true);
            e.preventDefault();
            uploadData();
            setIsLoading(false);
          }}
        >
          <TextInput
            label="First name"
            placeholder="Peter"
            type="text"
            value={profileDetails.first_name}
            onChange={(evt) => {
              updateProfileDetails({ first_name: evt.target.value });
            }}
            required={true}
          />
          <TextInput
            label="Middle name"
            placeholder="Gregory"
            type="text"
            value={profileDetails.middle_name}
            onChange={(evt) => {
              updateProfileDetails({ middle_name: evt.target.value });
            }}
          />

          <TextInput
            label="Last name"
            placeholder="Obi"
            type="text"
            value={profileDetails.last_name}
            onChange={(evt) => {
              updateProfileDetails({ last_name: evt.target.value });
            }}
            required={true}
          />

          {/* Gender*/}
          <FormSelect
            required={true}
            defaultSelected={profileDetails.gender}
            label="Gender"
            options={gender}
            onChange={(value) => updateProfileDetails({ gender: value?.value })}
          />

          <FormSelect
            required={true}
            defaultSelected={profileDetails.age_range}
            label="Age Range"
            options={ageRanges}
            onChange={(value) =>
              updateProfileDetails({ age_range: value?.value })
            }
          />

          <FormSelect
            required={true}
            defaultSelected={profileDetails.state_of_origin}
            label="Your State of Origin"
            options={states}
            onChange={(value) =>
              updateProfileDetails({ state_of_origin: value?.value })
            }
          />

          <PhoneInput
            label="Phone Number"
            onChange={(phone_number, country_code) =>
              updateProfileDetails({ phone_number, country_code })
            }
            defaultPhoneNumber={profileDetails.phone_number}
            defaultCountryCode={profileDetails.country_code}
          />

          <FormSelect
            required={true}
            defaultSelected={profileDetails.voting_engagement_state}
            label="State of Voting and Political Engagement"
            options={states}
            onChange={(value) =>
              updateProfileDetails({ voting_engagement_state: value?.value })
            }
          />

          <FormSelect
            required={true}
            defaultSelected={profileDetails.lga}
            label="LGA of Voting and Political Engagement"
            options={getLga(profileDetails.voting_engagement_state)}
            onChange={(value) => updateProfileDetails({ lga: value?.value })}
          />

          <FormSelect
            required={true}
            defaultSelected={profileDetails.ward}
            label="Ward"
            options={getWard(
              profileDetails.lga,
              profileDetails.voting_engagement_state
            )}
            onChange={(value) => updateProfileDetails({ ward: value?.value })}
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
