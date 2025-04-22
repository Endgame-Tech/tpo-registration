import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // Fixed import
import NextButton from "../../components/NextButton";
import Toast from "../../components/Toast";
import Progressbar from "../../components/Progressbar";
import FormSelect from "../../components/select/FormSelect";
import MultiSelectComp from "../../components/multi_select/MultiSelectComp";
import checkReqiredField from "../../utils/CheckRequired";
import { useOnboarding } from "../../context/OnboardingContext";
import { politicalIssueOptions, politicalPartyOptions, OptionType } from "../../utils/lookups";
import Loading from "../../components/Loader"; // Assumed to exist for consistency

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function PoliticalPreferencesPage() {
  const navigate = useNavigate();
  const { profileDetails, updateProfileDetails, isLoaded } = useOnboarding();

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // State to manage selected political issues for MultiSelectComp
  const [selectedIssues, setSelectedIssues] = useState<OptionType[]>([]);

  // Initialize selectedIssues from profileDetails.top_political_issues
  useEffect(() => {
    const selected = politicalIssueOptions.filter(opt =>
      profileDetails.top_political_issues?.includes(opt.value)
    );
    setSelectedIssues(selected);
  }, [profileDetails.top_political_issues]);

  const requiredFields = [
    { label: "Political Party Affiliation", value: "party_affiliation" },
    { label: "Top Political Issues", value: "top_political_issues" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
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
      const res = await fetch(`${API_BASE}/users/me/political-preferences`, {
        method: "PATCH",
        credentials: "include", // Include JWT cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          party_affiliation: profileDetails.party_affiliation,
          top_political_issues: profileDetails.top_political_issues,
        }),
      });

      // Robust error handling for non-JSON responses
      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}`);
      }

      if (!res.ok) throw new Error(body.message || "Update failed");

      navigate("/onboarding/engagement-and-mobilization");
    } catch (err: any) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <Loading />; // Consistent loading UI

  return (
    <div className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-8 mx-auto">
      <Link
        to="/profile"
        className="flex items-center justify-end text-accent-green w-full rounded-lg"
      >
        Skip
      </Link>

      <Progressbar currentNumber={5} />

      <div>
        <p className="text-gray-dark dark:text-gray-100 text-2xl xsm:mb-6 md:mb-12">
          Political Preferences
        </p>

        <form onSubmit={handleSubmit} className="grid gap-8">
          <FormSelect
            label="Political Party Affiliation (If any)"
            options={politicalPartyOptions}
            defaultSelected={profileDetails.party_affiliation || ""}
            onChange={(opt) => {
              if (!opt) return;
              updateProfileDetails({ party_affiliation: opt.value });
            }}
            required
          />

          <MultiSelectComp
            label="Top Political Issues"
            options={politicalIssueOptions}
            defaultSelected={selectedIssues}
            onChange={(value: OptionType[]) => {
              setSelectedIssues(value);
              const selectedValues = value.map(opt => opt.value);
              updateProfileDetails({ top_political_issues: selectedValues });
            }}
            required
            className="w-full"
          />

          <NextButton content="Next" disabled={loading} />
        </form>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}