import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import NextButton from "../../components/NextButton";
import Progressbar from "../../components/Progressbar";
import Toast from "../../components/Toast";
import checkReqiredField from "../../utils/CheckRequired";
import { useOnboarding } from "../../context/OnboardingContext";
import imageCompressor from "../../utils/ImageCompression";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function SecurityValidationPage() {
  const { profileDetails, updateProfileDetails, isLoaded } = useOnboarding();
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState<string>(profileDetails.profile_picture_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const requiredFields = [{ label: "Photo", value: "profile_picture_url" }];

  useEffect(() => {
    // initialize avatarUrl from context
    if (profileDetails.profile_picture_url) {
      setAvatarUrl(profileDetails.profile_picture_url);
    }
  }, [profileDetails.profile_picture_url]);

  if (!isLoaded) {
    return <div>Loading...</div>; // or your Loader component
  }

  // handle file selection and upload to Cloudinary via backend
  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    setToast(null);
    try {
      // compress the file if needed
      // assume imageCompressor returns compressed Blob
      const { error: compressError, compressedFile } = await imageCompressor(file);
      if (compressError || !compressedFile) {
        throw compressError || new Error("Image compression failed");
      }

      const formData = new FormData();
      formData.append('image', compressedFile, compressedFile.name);

      const res = await fetch(`${API_BASE}/upload/profile-picture`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Upload failed');

      const url = body.url; // backend returns { url: string }
      setAvatarUrl(url);
      updateProfileDetails({ profile_picture_url: url });
      setToast({ type: 'success', message: 'Profile photo updated.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);

    const { is_ok, message } = checkReqiredField(profileDetails, requiredFields);
    if (!is_ok) {
      setToast({ type: 'error', message });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/me/security-validation`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_picture_url: avatarUrl }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Update failed');
      navigate('/onboarding/demographics');
    } catch (err: any) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-8">
      <Progressbar currentNumber={2} />
      <p className="get-started-text xsm:mb-6 md:mb-12 text-gray-dark dark:text-gray-100 text-3xl">
        Security and Validation
      </p>
      <form onSubmit={handleSubmit} className="grid gap-8">
        <figure className="flex justify-center">
          <img
            src={avatarUrl || '/photo.png'}
            alt="profile pic"
            className="w-52 h-52 object-cover rounded-full"
          />
        </figure>
        <div className="w-full flex justify-center">
          <label
            htmlFor="avatar"
            className="p-2 w-full bg-secondary-dark text-white rounded-lg text-center cursor-pointer"
          >
            {isLoading ? 'Uploading...' : 'Upload New Photo'}
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        <NextButton content="Next" disabled={isLoading} />
      </form>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
