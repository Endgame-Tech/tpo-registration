import { CardLogo } from "../../../components/TopLogo";
import ProfileDetails from "../ProfileDetails";
import { CardImage } from "../../../components/CardImage";
import QRCodeGenerator from "./QRCode";
import { generatQRCodeText } from "../../../utils/GeneratQRCodeText";

export type Profile = {
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

type Props = {
  profile: Profile;
};
export default function FrontOfCard({ profile }: Props) {
  return (
    <section className="grid gap-8 text-text-light ">
      <p className="text-white">Membership Card - Front</p>
      <div
        className=" p-4 gap-4  relative w-[500px] h-[315px] rounded-3xl justify-center  overflow-hidden isolate "
        id="membership-card"
      >
        <img
          src="/tnnp_bkg.jpg"
          className="absolute top-0 left-0 w-[500px] h-[315px] -z-10"
        />
        <div className="grid grid-rows-[auto_1fr_auto] h-full gap-2">
          <section className="flex justify-between items-center">
            <CardLogo className="w-32" />
            <p className="text-[#D1000080] text-xl">Membership Card</p>
          </section>
          <section className="grid grid-cols-[auto_1fr] gap-4 ">
            <CardImage
              src={profile?.profile_picture_url || ""}
              alt="profile pic"
              fallbackSrc="photo.png"
              bucketName="profile-pictures"
              className="object-cover h-[160px] w-[140px] rounded-xl dark:bg-gray-700 overflow-hidden border-accent-green border-2"
            />
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-xl font-bold text-[#096F30]">{`${profile?.first_name || ""
                  } ${profile?.last_name || ""} ${profile?.middle_name || ""
                  }`}</p>
              </div>
              <div className="grid grid-cols-2  ">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <ProfileDetails
                      label="State"
                      value={profile?.voting_engagement_state}
                    />
                    <ProfileDetails label="Gender" value={profile?.gender} />

                  </div>
                  {/* <div className="flex justify-between">
                    <ProfileDetails
                      label="Position"
                      value={profile?.position}
                      capitalize={true}
                    />
                  </div> */}
                  <div className="flex justify-between">
                    <ProfileDetails label="Ward" value={profile?.ward} />
                  </div>
                </div>
                <div className="flex justify-end items-end">
                  <QRCodeGenerator text={generatQRCodeText(profile)} />
                </div>
              </div>
            </div>
          </section>

          <p className="font-black text-2xl text-[#096F30] text-center">
            {profile.member_id}
          </p>
        </div>
      </div>
    </section>
  );
}

// import { CardLogo } from "../../../components/TopLogo";
// import ProfileDetails from "../ProfileDetails";
// import Image from "../../../components/Image";
// type Profile = {
//   first_name: string;
//   last_name: string;
//   voting_engagement_state: string;
//   user_id: string;
//   profile_picture_url: string;
//   has_onboarded: boolean;
//   is_verified_user: boolean;
//   member_id: string;
//   member_status: string;
//   gender: string;
//   voting_history: string[];
//   top_political_issues: string[];
//   is_registered: string;
//   referral_code: string;
// };

// type Props = {
//     profile: Profile
// }
// export default function FrontOfCard({ profile }: Props) {
//   return (
//     <section className="grid gap-8 text-text-light dark:text-text-dark">
//       <p>Membership Card - Front</p>
//       <div
//         className="grid grid-cols-[auto,1fr] p-6 gap-4  relative w-[500px] h-[315px] rounded-lg justify-center  overflow-hidden isolate"
//         id="membership-card"
//       >
//         <img
//           src="/tnnp_bkg.jpg"
//           className="absolute top-0 left-0 w-[500px] h-[300px] -z-10"
//         />
//         <figure className="flex justify-center ">
//           <Image
//             src={profile?.profile_picture_url || ""}
//             alt="profile pic"
//             fallbackSrc="photo.png"
//             bucketName="profile_pictures"
//             className=" object-cover w-[200px] h-[200px] rounded-xl  dark:bg-gray-700 grid place-items-center text-3xl overflow-hidden"
//           />
//         </figure>
//         <div className="flex flex-col justify-between gap-2 z-10">
//           <CardLogo />

//           <ProfileDetails label="Member Id" value={profile?.member_id} />
//           <ProfileDetails
//             label="Name"
//             value={`${profile?.first_name || ""} ${profile?.last_name || ""}`}
//             capitalize={true}
//           />

//           <ProfileDetails label="Gender" value={profile?.gender} />
//           <ProfileDetails
//             label="State of Political Engagement"
//             value={profile?.voting_engagement_state}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }
