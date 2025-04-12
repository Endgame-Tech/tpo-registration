import { Profile } from "../pages/profile/Card/FrontOfCard";

export  function generatQRCodeText(profile: Profile) {
  const data = { ...profile };

  return JSON.stringify({
    member_id: data.member_id,
    fullname: `${data.first_name} ${data.middle_name} ${data.last_name}`,
    // voting_engagement_state: data.voting_engagement_state,
    // gender: data.gender,
    // position: data.position,
    // ward: data.ward,
  });
}
 