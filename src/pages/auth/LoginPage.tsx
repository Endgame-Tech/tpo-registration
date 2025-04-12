import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router";
import { supabase } from "../../supabase.js";
import Toast from "../../components/Toast.js";
// import ReCAPTCHA from "react-google-recaptcha";

const GetStartedPage = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  function disPlayError(error: any) {
    setMessage(`Login Error: ${error.message}`);
    console.log(`Login Error: ${error.message}`);
    setToastType("error");
    setShowToast(true);
  }


  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true)


    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      disPlayError(loginError);
      setIsLoading(false)
      return;
    }

    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;

    const { data: user_data, error: selectError } = await supabase
      .from("profile")
      .select("user_id, has_onboarded")
      .eq("user_id", userId);

    if (selectError) {
      disPlayError(selectError);
      setIsLoading(false)
      return;
    }

    if (!user_data[0].has_onboarded) {
      navigate("/onboarding");
      return;
    }

    navigate("/profile");
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-4"
    >
      <p className="text-gray-dark dark:text-gray-100 text-2xl">
        Welcome Back!
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
         <p className="account-txt text-dark dark:text-gray-300 text-sm mt-1">
        You don't have an account?{" "}
        <Link to="/auth/sign-up" className="underline">
          sign up
        </Link>
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
      <p className="text-sm mt-1">
        <Link to="/auth/forgot-password" className="underline text-accent-green">
          Forgot password?
        </Link>
      </p>
      </div>
      {/* <recaptcha /> */}


      <button
        className={`flex items-center justify-center bg-accent-green text-white w-full font-medium py-2 px-6 rounded-lg hover:scale-95 duration-300 ${isLoading? "opacity-50": ""}`}
        type="submit"
        disabled={isLoading}
      >
        <span>{isLoading? "Loading...": "Login"}</span>
      </button>
      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </form>
  );
};

export default GetStartedPage;
