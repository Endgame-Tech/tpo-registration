import { useState } from "react";
import { Link, useNavigate } from "react-router";
import NextButton from "../../components/NextButton";
import Toast from "../../components/Toast";
import Progressbar from "../../components/Progressbar";
import RadioComp from "../../components/buttons/radio";
import checkReqiredField from "../../utils/CheckRequired";
import { useOnboarding } from "../../context/OnboardingContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function VotingBehaviorPage() {
  const navigate = useNavigate();
  const { profileDetails, updateProfileDetails, isLoaded } = useOnboarding();

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const votingOptions = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "Not Sure Yet", value: "not sure yet" },
  ];

  const requiredFields = [
    { label: "Likely to Vote in Upcoming Elections?", value: "likely_to_vote" },
  ];

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
      const res = await fetch(`${API_BASE}/users/me/voting-behavior`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          likely_to_vote: profileDetails.likely_to_vote,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Update failed");
      navigate("/onboarding/technology-and-access");
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

      <Progressbar currentNumber={7} />

      <h2 className="text-gray-dark dark:text-gray-100 text-2xl">Voting Behavior</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <RadioComp
          label="Likely to Vote in Upcoming Elections?"
          options={votingOptions}
          value={profileDetails.likely_to_vote}
          onChange={(value) => updateProfileDetails({ likely_to_vote: value })}
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
