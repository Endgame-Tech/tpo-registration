import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabase";
import Loading from "../../components/Loader";
import PartyUpdates from "./PartyUpdates";
import exportAsImage from "../../utils/exportAsImage";
import { PhotoIcon } from "@heroicons/react/24/outline";
import FrontOfCard from "./Card/FrontOfCard";
import BackOfCard from "./Card/BackOfCard";

type Profile = {
  first_name: string;
  last_name: string;
  middle_name: string;
  voting_engagement_state: string;
  user_id: string;
  profile_picture_url: string;
  has_onboarded: boolean;
  is_verified_user: boolean;
  member_id: string;
  member_status: string;
  gender: string;
  voting_history: string[];
  top_political_issues: string[];
  is_registered: string;
  referral_code: string;
  position: string;
  ward: string;
};

export default function ProfilePage() {
  let navigate = useNavigate();
  const exportRef = useRef<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  useEffect(() => {
    if (!profile) {
      getProfile();
    }
  }, [profile]);

  async function getProfile() {
    setIsLoading(true);
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error(`Error: ${userError.message}`);
      setIsLoading(false);
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("profile")
      .select(
        "first_name, last_name, middle_name, voting_engagement_state, user_id, profile_picture_url, has_onboarded, member_id, member_status, gender, voting_history, top_political_issues, is_registered, referral_code, is_verified_user, position, ward"
      )
      .eq("user_id", userData?.user?.id);

    if (error) {
      console.error(`Error: ${error.message}`);
      setIsLoading(false);
      return;
    }

    const profileData = data[0];

    if (!profileData) {
      setIsLoading(false);
      navigate("/");
      return;
    }
    if (!profileData?.has_onboarded) {
      setIsLoading(false);
      navigate("/onboarding");
      return;
    }

    if (data) {
      setProfile(profileData);
    }

    setIsLoading(false);
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col items-center w-full  gap-4 px-4 py-8 ">
      <h1 className="w-full text:3xl md:text-4xl dark:text-text-dark">
        Welcome to the movement
      </h1>
      <div className="border-accent-green/50 border-2 shadow-lg text-black  p-2 w-full rounded-xl mb-8 flex flex-col items-start">
        {" "}
        {profile?.is_verified_user && (
          <div className="flex justify-end px-4 md:px-8 pt-4">
            <button
              onClick={() => {
                if (exportRef.current) {
                  exportAsImage(
                    exportRef.current,
                    `${profile.first_name} ${profile.last_name}'s TNNP Membership Card`
                  );
                }
              }}
              className="bg-accent-green hover:bg-accent-green/80 text-white py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <PhotoIcon className="size-6" />
              Download Membership Card
            </button>
          </div>
        )}
        <section
          className="flex flex-wrap  md:grid-cols-[auto,1fr] dark:bg-background-dark p-4 md:p-8 gap-16"
          ref={exportRef}
        >
          {profile ? (
            <>
              <FrontOfCard profile={profile} />
              <BackOfCard />
            </>
          ) : (
            <></>
          )}
        </section>
      </div>
      <PartyUpdates />
    </div>
  );
}
