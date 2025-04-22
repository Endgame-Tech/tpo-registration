import { useState } from "react";
import { useNavigate } from "react-router";
import Progressbar from "../../components/Progressbar";
import NextButton from "../../components/NextButton";
import FormSelect from "../../components/select/FormSelect";
import FormCombobox from "../../components/select/FormCombobox.tsx";
import Toast from "../../components/Toast";
import { useOnboarding } from "../../context/OnboardingContext";
import { ethnicGroupOptions, religionOptions, occupationCategoryOptions, levelOfEducationOptions, maritalStatusOptions, householdSizeOptions, incomeBracketOptions } from "../../utils/lookups";
import checkRequiredField from "../../utils/CheckRequired";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function DemographicsPage() {
  const { profileDetails, updateProfileDetails, isLoaded } = useOnboarding();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const requiredFields = [
    { label: "Ethnicity", value: "ethnicity" },
    { label: "Religion", value: "religion" },
    { label: "Occupation", value: "occupation" },
    { label: "Level of Education", value: "level_of_education" },
    { label: "Marital Status", value: "marital_status" },
    { label: "Household Size", value: "household_size" },
    { label: "Income Bracket", value: "income_bracket" },
  ];

  if (!isLoaded) return <div>Loading...</div>; // optional, you can use your fancy Loader component

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const { is_ok, message } = checkRequiredField(profileDetails, requiredFields);
    if (!is_ok) {
      setToast({ type: "error", message });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/me/demographics`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileDetails),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Update failed");
      navigate("/onboarding/voter-registration-information");
    } catch (err: any) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-8">
      <Progressbar currentNumber={3} />

      <p className="get-started-text xsm:mb-6 md:mb-12 text-gray-dark dark:text-gray-100 text-3xl">
        Demographic Information
      </p>

      <form onSubmit={handleSubmit} className="grid gap-8">
        <FormCombobox
          label="Ethnicity"
          options={ethnicGroupOptions}
          defaultSelected={profileDetails.ethnicity}
          onChange={(opt) => opt && updateProfileDetails({ ethnicity: opt.value })}
          required
        />

        <FormSelect
          label="Religion"
          options={religionOptions}
          defaultSelected={profileDetails.religion}
          onChange={(opt) => opt && updateProfileDetails({ religion: opt.value })}
          required
        />

        <FormSelect
          label="Occupation"
          options={occupationCategoryOptions}
          defaultSelected={profileDetails.occupation}
          onChange={(opt) => opt && updateProfileDetails({ occupation: opt.value })}
          required
        />

        <FormSelect
          label="Level of Education"
          options={levelOfEducationOptions}
          defaultSelected={profileDetails.level_of_education}
          onChange={(opt) => opt && updateProfileDetails({ level_of_education: opt.value })}
          required
        />

        <FormSelect
          label="Marital Status"
          options={maritalStatusOptions}
          defaultSelected={profileDetails.marital_status}
          onChange={(opt) => opt && updateProfileDetails({ marital_status: opt.value })}
          required
        />

        <FormSelect
          label="Household Size"
          options={householdSizeOptions}
          defaultSelected={profileDetails.household_size}
          onChange={(opt) => opt && updateProfileDetails({ household_size: opt.value })}
          required
        />

        <FormSelect
          label="Income Bracket"
          options={incomeBracketOptions}
          defaultSelected={profileDetails.income_bracket}
          onChange={(opt) => opt && updateProfileDetails({ income_bracket: opt.value })}
          required
        />

        <NextButton content="Next" disabled={loading} />
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
