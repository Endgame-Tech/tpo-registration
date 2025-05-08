import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import NextButton from "../../components/NextButton";
import Progressbar from "../../components/Progressbar";
import Toast from "../../components/Toast";
import RadioComp from "../../components/buttons/radio";
import FormSelect from "../../components/select/FormSelect";
// import TextInput from "../../components/inputs/TextInput";
import checkRequiredField from "../../utils/CheckRequired";
import { useOnboarding } from "../../context/OnboardingContext";
import MultiSelectComp from "../../components/multi_select/MultiSelectComp";
import { OptionType } from "../../utils/lookups";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function VoterRegistrationInformationPage() {
  const navigate = useNavigate();
  const { profileDetails, updateProfileDetails, isLoaded } = useOnboarding();
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);


  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const preferred_method_of_communication = [
    { id: 1, label: "Call", value: "call" },
    { id: 2, label: "Email", value: "email" },
    { id: 3, label: "Whatsapp", value: "whatsapp" },
    { id: 4, label: "Text Message", value: "text message" },
  ];

  useEffect(() => {
    const selected = preferred_method_of_communication.filter(opt =>
      profileDetails.preferred_method_of_communication?.includes(opt.value)
    );
    setSelectedOptions(selected);
  }, [profileDetails.preferred_method_of_communication]);

  const requiredFields = [
    { label: "Are you Registered to Vote?", value: "is_registered" },
    { label: "Preferred Method of Communication", value: "preferred_method_of_communication" },
  ];

  const is_registered = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
  ];

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1960; year <= currentYear; year++) {
      years.push({ id: year, label: year.toString(), value: year.toString() });
    }
    return years;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const res = await fetch(`${API_BASE}/users/me/voter-registration`, {

        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_registered: profileDetails.is_registered,
          // voter_id_number: profileDetails.voter_id_number,
          registration_date: profileDetails.registration_date,
          preferred_method_of_communication: profileDetails.preferred_method_of_communication,
          has_onboarded: true,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Update failed");

      navigate("/profile");
    } catch (err: any) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-8">
      <Link to="/profile" className="flex items-center justify-end text-accent-green w-full rounded-lg">
        Skip
      </Link>

      <Progressbar currentNumber={4} />

      <div>
        <p className="text-gray-dark dark:text-gray-100 text-2xl xsm:mb-6 md:mb-12">
          Voter Registration Information
        </p>

        <form className="grid gap-8" onSubmit={handleSubmit}>
          <RadioComp
            label="Are you Registered to Vote?"
            options={is_registered}
            value={profileDetails.is_registered}
            onChange={(opt) => updateProfileDetails({ is_registered: opt })}
            required
          />

          {/* <TextInput
            label="Voter Identification Number (VIN)"
            placeholder="9018 XXXX XXXX XXXX XXXX"
            type="text"
            value={profileDetails.voter_id_number || ""}
            onChange={(e) => updateProfileDetails({ voter_id_number: e.target.value })}
            required={false}
          /> */}

          <FormSelect
            label="Voter Registration Year"
            options={getYears()}
            defaultSelected={profileDetails.registration_date}
            onChange={(opt) => {
              if (profileDetails.is_registered === "yes" && opt) {
                updateProfileDetails({ registration_date: opt.value });
              }
            }}
            required={profileDetails.is_registered === "yes"}
            disabled={profileDetails.is_registered !== "yes"}
            className={profileDetails.is_registered !== "yes" ? "opacity-50 cursor-not-allowed" : ""}
          />


          <MultiSelectComp
            label="Preferred Method of Communication"
            options={preferred_method_of_communication}
            defaultSelected={selectedOptions}
            onChange={(value: OptionType[]) => {
              setSelectedOptions(value);
              const selectedValues = value.map(opt => opt.value);
              updateProfileDetails({ preferred_method_of_communication: selectedValues });
            }
            }
            required
          />

          <NextButton content="Next" disabled={loading} />
        </form>
      </div>

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
