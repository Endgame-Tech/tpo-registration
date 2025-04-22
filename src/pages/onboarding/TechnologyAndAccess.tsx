import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import NextButton from "../../components/NextButton";
import Toast from "../../components/Toast";
import Progressbar from "../../components/Progressbar";
import RadioComp from "../../components/buttons/radio";
import MultiSelectComp from "../../components/multi_select/MultiSelectComp";
import checkReqiredField from "../../utils/CheckRequired";
import { useOnboarding } from "../../context/OnboardingContext";
import { preferredSocialMediaOptions, OptionType } from "../../utils/lookups"; // now from static lookups

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function TechnologyAndAccessPage() {
  const navigate = useNavigate();
  const { profileDetails, updateProfileDetails, isLoaded } = useOnboarding();

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedSocialMedia, setSelectedSocialMedia] = useState<OptionType[]>([]);

  useEffect(() => {
    const selected = preferredSocialMediaOptions.filter(opt =>
      profileDetails.preferred_social_media?.includes(opt.value)
    );
    setSelectedSocialMedia(selected);
  }, [profileDetails.preferred_social_media]);

  const requiredFields = [
    { label: "Has Access to Internet?", value: "has_internet_access" },
    { label: "Preferred Social Media Platform", value: "preferred_social_media" },
    { label: "Smartphone User?", value: "is_smartphone_user" },
  ];

  const hasInternetOptions = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "Kind off", value: "kind off" },
  ];

  const isSmartphoneUserOptions = [
    { id: 1, label: "Yes", value: "yes" },
    { id: 2, label: "No", value: "no" },
    { id: 3, label: "Kind off", value: "kind off" },
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
      const res = await fetch(`${API_BASE}/users/me/technology-and-access`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          has_internet_access: profileDetails.has_internet_access,
          preferred_social_media: profileDetails.preferred_social_media,
          is_smartphone_user: profileDetails.is_smartphone_user,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Update failed");
      navigate("/onboarding/survey-questions");
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

      <Progressbar currentNumber={8} />

      <h2 className="text-gray-dark dark:text-gray-100 text-2xl">Technology and Access</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <RadioComp
          label="Has Access to Internet?"
          options={hasInternetOptions}
          value={profileDetails.has_internet_access}
          onChange={(value) => updateProfileDetails({ has_internet_access: value })}
          required
        />

        <MultiSelectComp
          label="Preferred Social Media Platform"
          options={preferredSocialMediaOptions}
          defaultSelected={selectedSocialMedia}
          onChange={(value: OptionType[]) => {
            setSelectedSocialMedia(value);
            const selectedValues = value.map(opt => opt.value);
            updateProfileDetails({ preferred_social_media: selectedValues });
          }}
          required
        />

        <RadioComp
          label="Smartphone User?"
          options={isSmartphoneUserOptions}
          value={profileDetails.is_smartphone_user}
          onChange={(value) => updateProfileDetails({ is_smartphone_user: value })}
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
