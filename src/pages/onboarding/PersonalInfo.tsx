import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NextButton from "../../components/NextButton";
import TextInput from "../../components/inputs/TextInput";
import PhoneInput from "../../components/PhoneInput";
import FormSelect from "../../components/select/FormSelect";
import Progressbar from "../../components/Progressbar";
import Toast from "../../components/Toast";
import checkReqiredField from "../../utils/CheckRequired";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  genderOptions,
  ageRangeOptions,
  OptionType
} from "../../utils/lookups";
import { statesLGAWardList } from "../../utils/StateLGAWard";
import Loading from "../../components/Loader";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function PersonalInfoPage() {
  const { profileDetails, updateProfileDetails, isLoaded } = useOnboarding();
  const navigate = useNavigate();

  // list of required fields for client‑side validation
  const requiredFields = [
    { label: "First name", value: "first_name" },
    { label: "Last name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "LGA", value: "lga" },
    { label: "Ward", value: "ward" },
    { label: "Phone Number", value: "phone_number" },
    { label: "Age Range", value: "age_range" },
    { label: "State of Origin", value: "state_of_origin" },
    { label: "Voting State", value: "voting_engagement_state" },
  ];

  // local component state
  const [states, setStates] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!isLoaded) return <Loading />;

  // populate the top‑level states dropdown once
  useEffect(() => {
    const s = statesLGAWardList.map((s, i) => ({ id: i, label: s.state, value: s.state }));
    setStates(s);
  }, []);

  // helper: given a state name, return its LGAs
  function getLga(stateName: string): OptionType[] {
    const entry = statesLGAWardList.find((s) => s.state === stateName);
    return entry
      ? entry.lgas.map((l, i) => ({ id: i, label: l.lga, value: l.lga }))
      : [];
  }

  // helper: given a state+LGA, return its wards
  function getWard(lgaName: string, stateName: string): OptionType[] {
    const entry = statesLGAWardList.find((s) => s.state === stateName);
    const lgaEntry = entry?.lgas.find((l) => l.lga === lgaName);
    return lgaEntry
      ? lgaEntry.wards.map((w, i) => ({ id: i, label: w, value: w }))
      : [];
  }

  // form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    // client‑side check
    const { is_ok, message } = checkReqiredField(profileDetails, requiredFields);
    if (!is_ok) {
      setToast({ type: "error", message });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/me/personal-info`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileDetails),

      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Update failed");
      navigate("/onboarding/security-validation");
    } catch (err: any) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between px-4 py-4 max-w-[450px] w-full gap-8">
      <Progressbar currentNumber={1} />
      <div>
        <p className="get-started-text xsm:mb-6 md:mb-12 mb-6 text-gray-dark dark:text-gray-100 text-3xl">
          Personal Information
        </p>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <TextInput
            label="First name"
            placeholder="Peter"
            value={profileDetails.first_name || ""}
            onChange={(e) => updateProfileDetails({ first_name: e.target.value })}
            required
          />

          <TextInput
            label="Middle name"
            placeholder="Gregory"
            value={profileDetails.middle_name || ""}
            onChange={(e) => updateProfileDetails({ middle_name: e.target.value })}
          />

          <TextInput
            label="Last name"
            value={profileDetails.last_name || ""}
            placeholder="Obi"
            onChange={(e) => updateProfileDetails({ last_name: e.target.value })}
            required
          />

          <FormSelect
            label="Gender"
            options={genderOptions}
            defaultSelected={profileDetails.gender}
            onChange={(opt) => { if (opt) updateProfileDetails({ gender: opt.value }) }}
            required
          />

          <FormSelect
            label="Age Range"
            options={ageRangeOptions}
            defaultSelected={profileDetails.age_range}
            onChange={(opt) => { if (opt) updateProfileDetails({ age_range: opt.value }) }}
            required
          />

          <FormSelect
            label="Your State of Origin"
            options={states}
            defaultSelected={profileDetails.state_of_origin}
            onChange={(opt) => { if (opt) updateProfileDetails({ state_of_origin: opt.value }) }}
            required
          />

          <PhoneInput
            label="Phone Number"
            defaultPhoneNumber={profileDetails.phone_number}
            defaultCountryCode={profileDetails.country_code || "+234"}
            onChange={(num, cc) => updateProfileDetails({ phone_number: num, country_code: cc })}
          />

          <FormSelect
            label="Voting State"
            options={states}
            defaultSelected={profileDetails.voting_engagement_state}
            onChange={(opt) => { if (opt) updateProfileDetails({ voting_engagement_state: opt.value }) }}
            required
          />

          <FormSelect
            label="LGA of Voting and Political Engagement"
            options={getLga(profileDetails.voting_engagement_state)}
            defaultSelected={profileDetails.lga}
            onChange={(opt) => { if (opt) updateProfileDetails({ lga: opt.value }) }}
            required
          />

          <FormSelect
            label="Ward"
            options={getWard(profileDetails.lga, profileDetails.voting_engagement_state)}
            defaultSelected={profileDetails.ward}
            onChange={(opt) => { if (opt) updateProfileDetails({ ward: opt.value }) }}
            required
          />

          <NextButton content="Next" disabled={loading} />
        </form>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
