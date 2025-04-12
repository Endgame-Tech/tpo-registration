import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/20/solid";

export default function AuthButton() {
  let navigate = useNavigate();
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

  const handleLogout = async () => { 
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      navigate("/auth/login");
    }
  };

  if (isLoggedIn) {
    return (
      <button
        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3  hover:bg-black/10 duration-300 delay-100 dark:text-text-dark dark:hover:bg-white/10 text-text-light"
        onClick={handleLogout}
      >
      <ArrowLeftEndOnRectangleIcon className="size-4  fill-accent-green" />
        Logout
      </button>
    );
  }

  return (
    <Link
      to={"/auth/login"}
      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3  hover:bg-black/10 duration-300 delay-100 dark:text-text-dark dark:hover:bg-white/10 text-text-light"
    >
      <ArrowRightEndOnRectangleIcon className="size-4  fill-accent-green" />
      Login
    </Link>
  );
}
