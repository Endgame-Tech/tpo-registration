import { QRCodeSVG } from "qrcode.react";
import { UserProfile } from "../../context/UserContext";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import MembershipCardModal from "./MembershipCardModal";

export default function ProfileHero({ profile }: { profile: UserProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full rounded-[40px] overflow-hidden bg-[#1e1e1e] shadow-lg">
        {/* Green Banner */}
        <div className="h-28 sm:h-32 bg-gradient-to-br from-[#219762] to-green-800" />

        {/* Profile Info */}
        <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 -mt-20">
          {/* Left: Profile Image and Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 w-full">
            <div className="rounded-full bg-background-dark shadow-md overflow-hidden border-2 border-white w-40 h-40 sm:w-[250px] sm:h-[250px] -mt-10 sm:-mt-14">
              <motion.img
                src={profile.profile_picture_url || "/photo.png"}
                alt="Profile"
                className="object-cover w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            </div>

            {/* Name and Info */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 mt-6 sm:mt-14 max-w-xs sm:max-w-sm">
              <h1 className="text-2xl sm:text-4xl font-[800] text-white">
                {profile.first_name} {profile.middle_name} {profile.last_name}
              </h1>
              <p className="text-gray-400 text-sm">{profile.occupation || "N/A"}</p>
              <p className="text-gray-400 text-sm">{profile.state_of_origin || "N/A"} State</p>
            </div>
          </div>

          {/* QR Code (hidden on large screens if not needed) */}
          <div className="mt-6 sm:mt-0">
            <QRCodeSVG
              value={profile.member_id || "TNNP"}
              size={100}
              fgColor="#ffffff"
              bgColor="transparent"
              className="border p-2 rounded-lg"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 sm:px-10">
          <Link to={"/onboarding"}>
            <button className="bg-white text-black font-semibold py-2 rounded-3xl w-full sm:w-40 hover:bg-gray-200 transition">
              EDIT PROFILE
            </button>
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-white text-white font-semibold py-2 rounded-3xl w-full sm:w-40 hover:bg-white hover:text-black transition"
          >
            SEE ID-Card
          </button>
        </div>
      </div>

      {/* Membership Card Modal */}
      {isModalOpen && (
        <MembershipCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          profile={profile}
        />
      )}
    </>
  );
}
