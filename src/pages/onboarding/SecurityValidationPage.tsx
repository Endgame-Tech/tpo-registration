import { useState } from "react";
import NextButton from "../../components/NextButton.js";
import TextInput from "../../components/inputs/TextInput.tsx";
import { useNavigate } from "react-router";
import { supabase } from "../../supabase.ts";
import Avatar from "../../components/select/UploadPhotos.tsx";
import Toast from "../../components/Toast.tsx";
import Progressbar from "../../components/Progressbar.tsx";
import { useOnboarding } from "../../context/OnboardingContext.tsx";
import checkReqiredField from "../../utils/CheckRequired.ts";

export default function Account({}) {
  const requiredFields = [
    {
      label: "Photo",
      value: "profile_picture_url",
    },
 
  ];
  let navigate = useNavigate();
  const { profileDetails, updateProfileDetails } = useOnboarding();

  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

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
      navigate("/onboarding/demographics");
    }
  }

  async function uploadPhoto(avatarUrl = "") {
    updateProfileDetails({ profile_picture_url: avatarUrl });

    const { data: dat, error } = await supabase.storage
      .from("profile-pictures")
      .download(avatarUrl);

    if (error) {
      throw error;
    }
    const url = URL.createObjectURL(dat);
    setAvatarUrl(url);
  }

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-8">
      <Progressbar currentNumber={2} />
      <p className="get-started-text xsm:mb-6 md:mb-12 text-gray-dark dark:text-gray-100 text-3xl">
        Security and Validation
      </p>

      <form
        className="grid gap-8"
        onSubmit={(e) => {
          setIsLoading(true);
          e.preventDefault();
          uploadData();
          setIsLoading(false);
        }}
      >
        <Avatar
          url={avatar_url}
          size={200}
          onUpload={(event, url) => {
            console.log("event", event);
            uploadPhoto(url);
          }}
        />
        
        <TextInput
          label="Name of Citizen who referred you (insert nill if no one refered you)"
          placeholder="John"
          type="text"
          value={profileDetails.referrer_name}
          onChange={(evt) => {
            updateProfileDetails({ referrer_name: evt.target.value });
          }}
          required={false}
        />
        <NextButton content="Next" disabled={isLoading} />
      </form>

      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </div>
  );
}
