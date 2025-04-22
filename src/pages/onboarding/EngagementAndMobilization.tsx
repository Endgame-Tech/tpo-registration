import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import NextButton from "../../components/NextButton";
import Toast from "../../components/Toast";
import Progressbar from "../../components/Progressbar";
// import FormSelect from "../../components/select/FormSelect";
import MultiSelectComp from "../../components/multi_select/MultiSelectComp";
import RadioComp from "../../components/buttons/radio";
import checkReqiredField from "../../utils/CheckRequired";
import { useOnboarding } from "../../context/OnboardingContext";
import { OptionType } from "../../utils/lookups";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function EngagementAndMobilizationPage() {
  const navigate = useNavigate();
  const { profileDetails, updateProfileDetails, isLoaded } = useOnboarding();

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // State to manage selected communication options for MultiSelectComp
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);

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

  const volunteeringOptions = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "Not Sure Yet", value: "not sure yet" },
  ];

  const pastParticipationOptions = [
    { id: 1, label: "Yes", value: true },
    { id: 2, label: "No", value: false },
  ];



  const requiredFields = [
    { label: "Are you willing to Volunteer?", value: "is_volunteering" },
    { label: "Have you participated in Previous Elections?", value: "past_election_participation" },
    { label: "Preferred Method of Communication", value: "preferred_method_of_communication" },
  ];

  useEffect(() => {
    if (!isLoaded) return;
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading...</div>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const { is_ok, message } = checkReqiredField(profileDetails, requiredFields);
    if (!is_ok) {
      setToast({ type: "error", message });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/me/engagement-and-mobilization`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_volunteering: profileDetails.is_volunteering,
          past_election_participation: profileDetails.past_election_participation,
          preferred_method_of_communication: profileDetails.preferred_method_of_communication,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Update failed");
      navigate("/onboarding/voting-behavior");
    } catch (err: any) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-8">
      <Link
        to="/profile"
        className="flex items-center justify-end text-accent-green w-full rounded-lg"
      >
        Skip
      </Link>

      <Progressbar currentNumber={6} />

      <h2 className="text-gray-dark dark:text-gray-100 text-2xl">Engagement and Mobilization</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <RadioComp
          label="Are you willing to Volunteer as a Grassroot Mobilizer?"
          options={volunteeringOptions}
          value={profileDetails.is_volunteering}
          onChange={(value) => updateProfileDetails({ is_volunteering: value })}
          required
        />

        <RadioComp
          label="Have you participated in Previous Elections as a Grassroot Mobilizer?"
          options={pastParticipationOptions}
          value={profileDetails.past_election_participation}
          onChange={(value) => updateProfileDetails({ past_election_participation: value })}
          required
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

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
