// src/pages/profile/ProfileHero.tsx
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
        <div className="h-32 bg-gradient-to-br from-[#219762] to-green-800"></div>

        {/* Profile Info */}
        <div className="p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 -mt-20">
          {/* Left: Profile Image and Basic Info */}
          <div className="flex flex-col md:flex-row items-center gap-8 w-full">
            {/* Profile Image with soft fade-in */}
            <div className="flex-shrink-0">
              <div className="rounded-full -mt-14 bg-background-dark shadow-md overflow-hidden border-2 border-white w-[250px] h-[250px]">
                <motion.img
                  src={profile.profile_picture_url || "/photo.png"}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* Name and Info */}
            <div className="flex flex-col items-center mt-14 max-w-[400px] md:items-start text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-[800] text-white">
                {profile.first_name} {profile.middle_name} {profile.last_name}
              </h1>
              <p className="text-gray-400 mt-2 text-sm">{profile.occupation || "N/A"}</p>
              <p className="text-gray-400 text-sm">{profile.state_of_origin || "N/A"} State</p>
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="hidden md:block mt-20">
            <QRCodeSVG
              value={profile.member_id || "TNNP"}
              size={120}
              fgColor="#ffffff"
              bgColor="transparent"
              className="border p-2 rounded-lg"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 p-6 md:px-10">
          <Link to={"/onboarding"}>
            <button className="bg-white text-black font-semibold py-2 rounded-3xl w-40 hover:bg-gray-200 transition">
              EDIT PROFILE
            </button>
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-white text-white font-semibold py-2 rounded-3xl w-40 hover:bg-white hover:text-black transition"
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
