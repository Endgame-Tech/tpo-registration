import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router";
import BackButton from "../../components/buttons/BackButton";
import Loading from "../../components/Loader";
import Header from "../../components/Header";
import BackgroundComponent from "../../components/BackgroundComponent";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function OnboardingLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user
    fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((user) => {
        setIsEmailVerified(user.emailVerified);
      })
      .catch(() => {
        // If they're not even authenticated, send them back to login
        navigate("/auth/login", { replace: true });
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen  bg-white dark:bg-background-dark transition-colors duration-300 grid grid-rows-[auto,_1fr] font-poppins gap-2">
        <Header />
        <div className="flex flex-col items-center w-full  gap-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (!isEmailVerified) {
    return (
      <div className="min-h-screen dark:bg-background-dark  bg-white  dark:text-white transition-colors duration-300 grid grid-rows-[auto,_1fr] font-poppins gap-2">
        <Header />

        <div className="flex flex-col items-center w-full  gap-8 p-4">
          <h1 className="text-3xl">Please verify your email</h1>
          <p>
            We have sent you an email with a link to verify your email address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark transition-colors duration-300 grid grid-rows-[auto,_1fr] font-poppins gap-2 relative">
      {/*  relative overflow-hidden */}
      {/* Dark Mode Toggle and Logo */}
      <Header />

      <div className="flex flex-col items-center w-full z-10 gap-8">
        <div className="px-4 max-w-[450px] w-full">
          <BackButton />

        </div>
        <Outlet />
      </div>
      <BackgroundComponent />
    </div>
  );
}
