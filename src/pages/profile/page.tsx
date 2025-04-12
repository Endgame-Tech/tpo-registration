import { Outlet } from "react-router";
import Header from "../../components/Header";

export default function ProfileLayout() {
  return (
    <div className="min-h-screen  bg-black/5 dark:bg-background-dark transition-colors duration-300 grid grid-rows-[auto,_1fr] font-poppins gap-2  p-4">
      <Header/>
      <Outlet />
    </div>
  );
}
