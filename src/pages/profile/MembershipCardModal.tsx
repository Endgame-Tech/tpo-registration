// src/pages/profile/MembershipCardModal.tsx
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FrontOfCard from "./Card/FrontOfCard";
import BackOfCard from "./Card/BackOfCard";
import exportAsImage from "../../utils/exportAsImage";
import { UserProfile } from "../../context/UserContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
};

export default function MembershipCardModal({ isOpen, onClose, profile }: Props) {
  const exportRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-background-dark rounded-2xl p-6 w-full max-w-[100%] shadow-xl flex flex-col gap-8 overflow-auto max-h-[90vh]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            {/* Top Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl dark:text-white font-bold">Membership ID Card</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black dark:hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Card Front and Back */}
            <div className="flex flex-wrap justify-center gap-8" ref={exportRef}>
              <FrontOfCard profile={profile} />
              <BackOfCard />
            </div>

            {/* Download Button if verified */}
            {profile.is_verified_user && (
              <button
                onClick={() => {
                  if (exportRef.current) {
                    exportAsImage(
                      exportRef.current,
                      `${profile.first_name} ${profile.last_name} - TPO Membership Card`
                    );
                  }
                }}
                className="self-center mt-4 px-6 py-3 rounded-lg bg-accent-green text-white hover:bg-green-700"
              >
                Download ID Card
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
