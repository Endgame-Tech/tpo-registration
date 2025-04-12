import { Link } from "react-router";
import ToggleButton from "../../components/ToggleButton";
import { supabase } from "../../supabase";
import { useEffect, useState } from "react";
import DropdownMenu from "../../components/DropdownMenu";

const LandingPage = (): React.ReactElement => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkUser();
  }, []);

  return (
    <div className="font-poppins min-h-screen flex flex-col justify-center items-center gap-8 bg-white dark:bg-background-dark transition-colors duration-300">
      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4">
        {isLoggedIn ? <DropdownMenu /> : <ToggleButton />}
      </div>

      {/* Logo Section */}
      <div className="flex flex-col justify-center items-center">
        <img
          src="logo.png"
          alt="The New Nigeria Project Logo"
          className="w-60 mb-4"
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-4">


        <Link
          to="/auth/login"
          className="bg-[#2DB475] dark:bg-[#2DB475] text-text-dark font-medium text-sm px-11 py-2 rounded-full w-full text-center"
        >
          Login
        </Link>
        <Link
          to="/auth/sign-up"
          className="border-accent-green border-2 text-accent-green font-medium text-sm px-11 py-2 rounded-full w-full text-center"
        >
          Get Started
        </Link>

      </div>
    </div>
  );
};

export default LandingPage;
