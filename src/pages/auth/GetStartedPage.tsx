import { useState } from "react";
import { supabase } from "../../supabase.js";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import Toast from "../../components/Toast.js";
import { useNavigate } from "react-router";
import validatePassword from "../../utils/validatePassword.js";
import { XCircleIcon } from "@heroicons/react/24/outline";
import CustomCheckbox from "../../components/CustomCheckbox.js";
import { generateReferralCode } from "../../utils/generateReferralCode.js";

const GetStartedPage = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isNewsLetter, setIsNewsLetter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  function disPlayError(error: any) {
    setMessage(`Sign-up Error: ${error.message}`);
    console.log(`Sign-up Error: ${error.message}`);
    setToastType("error");
    setShowToast(true);
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage("Invalid email address format.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    const { validPassword, message, is_ok } = validatePassword(
      password,
      confirmPassword
    );

    if (!is_ok) {
      disPlayError({ message });
      setIsLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: validPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/login`,
      },
    });

    if (signUpError) {
      setMessage(`Sign-up Error: ${signUpError.message}`);
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Step 2: Call the create_user_with_referral function
    const { error: referralError } = await supabase.rpc(
      "create_user_with_profile_details",
      {
        user_id: data.user?.id,
        email: email,
        referral_code: generateReferralCode(email),
        add_to_newsletter: isNewsLetter,
      }
      // Sign-up Error: insert or update on table "profile" violates foreign key constraint "profile_role_fkey"

    );

    if (referralError) {
      setMessage(`Sign-up Error: ${referralError.message}`);
      setToastType("error");
      setShowToast(true);
      return;
    }

    navigate("/auth/verify");
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-4"
    >
      <p className="get-started-text xsm:mb-6 md:mb-12 text-gray-dark dark:text-gray-100 text-2xl">
        Let's get started
      </p>
      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">
          Email
        </label>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="account-txt text-dark dark:text-gray-300 text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="underline">
            Log in
          </a>
        </p>
      </div>
      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">
          Password
        </label>
        <div className="relative">
          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <EyeSlashIcon className="size-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <EyeIcon className="size-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>
        <DisplayPasswordRules password={password} />
      </div>
      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">
          Confirm Password
        </label>
        <div className="relative">
          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            type={passwordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <EyeSlashIcon className="size-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <EyeIcon className="size-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>
        <CustomCheckbox onClick={setIsNewsLetter}/>
      </div>
      <button
        className={`flex items-center justify-center bg-accent-green text-white w-full font-medium py-2 px-6 rounded-lg hover:scale-95 duration-300 ${
          isLoading ? "opacity-50" : ""
        }`}
        type="submit"
        disabled={isLoading}
      >
        <span>{isLoading ? "Loading..." : "Sign Up"}</span>
      </button>
      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </form>
  );
};

export default GetStartedPage;

function DisplayPasswordRules({ password = "" }) {
  const { is_ok, message } = validatePassword(password, password);
  return (
    <div className="text-white text-sm flex gap-1 items-center py-2">
      {/* <p className={`${is_ok?"":""}`}>{is_ok ? "ok": "bad"}</p> */}
      {is_ok ? (
        <CheckCircleIcon className="fill-accent-green size-4 " />
      ) : (
        <XCircleIcon className="fill-accent-red size-6 text-background-dark " />
      )}
      <p className="">{message}</p>
    </div>
  );
}
