import { Outlet } from "react-router";
import Logo from "../../components/TopLogo.tsx";
import BackButton from "../../components/buttons/BackButton.tsx";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase.ts";
import DropdownMenu from "../../components/DropdownMenu.tsx";
import ToggleButton from "../../components/ToggleButton.tsx";
import BackgroundComponent from "../../components/BackgroundComponent.tsx";

const AuthPage = () => {
  
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
    <div className="min-h-screen  bg-white dark:bg-background-dark transition-colors duration-300 grid grid-rows-[auto,_1fr] font-poppins gap-2 relative overflow-hidden">
   
      {/* Dark Mode Toggle and Logo */}
      <header className=" flex justify-between items-center p-4">
        <div className="flex flex-col items-center">
          <Logo />
        </div>
        <div className="absolute top-4 right-4">
      {
         isLoggedIn ? (<DropdownMenu/>): ( <ToggleButton />)
      }

     </div>
      </header>

      <div className="flex flex-col items-center w-full z-10">
        <div className="px-4 max-w-[450px] w-full">
          <BackButton />
        </div>
        <Outlet />
      </div>
      <BackgroundComponent/>
    </div>
  );
};

export default AuthPage;