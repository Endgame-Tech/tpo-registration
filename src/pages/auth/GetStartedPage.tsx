import { useState, useEffect } from "react"; 
import { useNavigate, useLocation, Link } from "react-router";
import Toast from "../../components/Toast.js";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import validatePassword from "../../utils/validatePassword.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const GetStartedPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // get access to URL
  const [referralCode, setReferralCode] = useState(""); // store ref code

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Extract referral code from URL
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferralCode(ref);
    }
  }, [location]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const displayError = (msg: string) => {
    setMessage(msg);
    setToastType("error");
    setShowToast(true);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      displayError("Invalid email address format.");
      setIsLoading(false);
      return;
    }

    const { validPassword, message: pwdMessage, is_ok } = validatePassword(
      password,
      confirmPassword
    );

    if (!is_ok) {
      displayError(pwdMessage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password: validPassword,
          referred_by: referralCode, // Send referral code if available
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        displayError(data.message || "Signup failed");
        setIsLoading(false);
        return;
      }

      setMessage(data.message);
      setToastType("success");
      setShowToast(true);

      navigate("/auth/verify");
    } catch (error: any) {
      displayError(error.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-4"
    >
      <p className="get-started-text text-gray-dark dark:text-gray-100 text-2xl">
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
      </div>

      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">
          Password
        </label>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
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
            type={passwordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {/* <CustomCheckbox
          label="Subscribe to newsletter"
          checked={isNewsLetter}
          onChange={setIsNewsLetter}
        /> */}
        <p className="account-txt text-dark dark:text-gray-300 text-sm mt-2">
          You already have an account?{' '}
          <Link to="/auth/login" className="underline text-accent-green">
            Log in
          </Link>
        </p>
      </div>

      <button
        type="submit"
        className={`flex items-center justify-center bg-accent-green text-white w-full font-medium py-2 px-6 rounded-lg hover:scale-95 duration-300 ${isLoading ? "opacity-50" : ""
          }`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Sign Up"}
      </button>

      {showToast && (
        <Toast message={message} type={toastType} onClose={() => setShowToast(false)} />
      )}
    </form>
  );
};

export default GetStartedPage;

function DisplayPasswordRules({ password = "" }) {
  const { is_ok, message } = validatePassword(password, password);
  return (
    <div className="text-white text-sm flex gap-1 items-center py-2">
      {is_ok ? (
        <CheckCircleIcon className="fill-accent-green size-4" />
      ) : (
        <XCircleIcon className="fill-accent-red size-6 text-background-dark" />
      )}
      <p>{message}</p>
    </div>
  );
}
