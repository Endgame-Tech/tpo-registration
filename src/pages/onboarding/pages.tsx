import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import BackButton from "../../components/buttons/BackButton";
import {  Outlet } from "react-router";
import { OnboardingProvider } from "../../context/OnboardingContext";
import Loading from "../../components/Loader";
import Header from "../../components/Header";
import BackgroundComponent from "../../components/BackgroundComponent";

export default function Onboarding() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data, error } = await supabase.auth.getUser();

    if(error){
      setIsLoading(false);

    }
    setIsEmailVerified(data.user?.user_metadata?.email_verified);
    setIsLoading(false);
  }

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

  if (isEmailVerified !== true) {
    return (
      <div className="min-h-screen  bg-white  dark:text-white transition-colors duration-300 grid grid-rows-[auto,_1fr] font-poppins gap-2">
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

  if (isEmailVerified === true) {
    return (
      <div className="min-h-screen bg-white dark:bg-background-dark transition-colors duration-300 grid grid-rows-[auto,_1fr] font-poppins gap-2 relative">
        {/*  relative overflow-hidden */}
        {/* Dark Mode Toggle and Logo */}
        <Header />

        <div className="flex flex-col items-center w-full z-10 gap-8">
          <div className="px-4 max-w-[450px] w-full">
            <BackButton />
            
          </div>
          <OnboardingProvider>
            <Outlet />
          </OnboardingProvider>
        </div>
        <BackgroundComponent/>
      </div>
    );
  }
}
