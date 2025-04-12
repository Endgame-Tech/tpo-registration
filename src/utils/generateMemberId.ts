import { supabase } from "../supabase";

export async function generateMemberId(
  profileData: { [key: string]: any },
  count = 5
):  Promise<string>  {
  const state =
    `${profileData?.voting_engagement_state}` as keyof typeof states; // Ensure 'state' is a valid key of 'states'
  const lga = `${profileData?.lga}`.slice(0, 3).toUpperCase();
  const digits = generateRandomDigits();

  const states = {
    Abia: {
      zone: "South East",
      zone_abbreviation: "SE",
      state_abbreviation: "AB",
    },
    Adamawa: {
      zone: "North East",
      zone_abbreviation: "NE",
      state_abbreviation: "AD",
    },
    "Akwa Ibom": {
      zone: "South South",
      zone_abbreviation: "SS",
      state_abbreviation: "AK",
    },
    Anambra: {
      zone: "South East",
      zone_abbreviation: "SE",
      state_abbreviation: "AN",
    },
    Bauchi: {
      zone: "North East",
      zone_abbreviation: "NE",
      state_abbreviation: "BA",
    },
    Bayelsa: {
      zone: "South South",
      zone_abbreviation: "SS",
      state_abbreviation: "BY",
    },
    Benue: {
      zone: "North Central",
      zone_abbreviation: "NC",
      state_abbreviation: "BE",
    },
    Borno: {
      zone: "North East",
      zone_abbreviation: "NE",
      state_abbreviation: "BO",
    },
    "Cross River": {
      zone: "South South",
      zone_abbreviation: "SS",
      state_abbreviation: "CR",
    },
    Delta: {
      zone: "South South",
      zone_abbreviation: "SS",
      state_abbreviation: "DE",
    },
    Ebonyi: {
      zone: "South East",
      zone_abbreviation: "SE",
      state_abbreviation: "EB",
    },
    Edo: {
      zone: "South South",
      zone_abbreviation: "SS",
      state_abbreviation: "ED",
    },
    Ekiti: {
      zone: "South West",
      zone_abbreviation: "SW",
      state_abbreviation: "EK",
    },
    Enugu: {
      zone: "South East",
      zone_abbreviation: "SE",
      state_abbreviation: "EN",
    },
    Gombe: {
      zone: "North East",
      zone_abbreviation: "NE",
      state_abbreviation: "GO",
    },
    Imo: {
      zone: "South East",
      zone_abbreviation: "SE",
      state_abbreviation: "IM",
    },
    Jigawa: {
      zone: "North West",
      zone_abbreviation: "NW",
      state_abbreviation: "JI",
    },
    Kaduna: {
      zone: "North West",
      zone_abbreviation: "NW",
      state_abbreviation: "KD",
    },
    Kano: {
      zone: "North West",
      zone_abbreviation: "NW",
      state_abbreviation: "KN",
    },
    Katsina: {
      zone: "North West",
      zone_abbreviation: "NW",
      state_abbreviation: "KT",
    },
    Kebbi: {
      zone: "North West",
      zone_abbreviation: "NW",
      state_abbreviation: "KE",
    },
    Kogi: {
      zone: "North Central",
      zone_abbreviation: "NC",
      state_abbreviation: "KO",
    },
    Kwara: {
      zone: "North Central",
      zone_abbreviation: "NC",
      state_abbreviation: "KW",
    },
    Lagos: {
      zone: "South West",
      zone_abbreviation: "SW",
      state_abbreviation: "LA",
    },
    Nasarawa: {
      zone: "North Central",
      zone_abbreviation: "NC",
      state_abbreviation: "NA",
    },
    Niger: {
      zone: "North Central",
      zone_abbreviation: "NC",
      state_abbreviation: "NI",
    },
    Ogun: {
      zone: "South West",
      zone_abbreviation: "SW",
      state_abbreviation: "OG",
    },
    Ondo: {
      zone: "South West",
      zone_abbreviation: "SW",
      state_abbreviation: "ON",
    },
    Osun: {
      zone: "South West",
      zone_abbreviation: "SW",
      state_abbreviation: "OS",
    },
    Oyo: {
      zone: "South West",
      zone_abbreviation: "SW",
      state_abbreviation: "OY",
    },
    Plateau: {
      zone: "North Central",
      zone_abbreviation: "NC",
      state_abbreviation: "PL",
    },
    Rivers: {
      zone: "South South",
      zone_abbreviation: "SS",
      state_abbreviation: "RI",
    },
    Sokoto: {
      zone: "North West",
      zone_abbreviation: "NW",
      state_abbreviation: "SO",
    },
    Taraba: {
      zone: "North East",
      zone_abbreviation: "NE",
      state_abbreviation: "TA",
    },
    Yobe: {
      zone: "North East",
      zone_abbreviation: "NE",
      state_abbreviation: "YO",
    },
    Zamfara: {
      zone: "North West",
      zone_abbreviation: "NW",
      state_abbreviation: "ZA",
    },
    "Federal Capital Territory": {
      zone: "North Central",
      zone_abbreviation: "NC",
      state_abbreviation: "FCT",
    },
  };
  const state_abbreviation = states?.[state]["state_abbreviation"]
  const zone_abbreviation = states?.[state]["zone_abbreviation"]
  const val = `${zone_abbreviation}-${state_abbreviation}-${lga}`
  const prevVal = profileData?.member_id?.split('-')?.slice(0,3)?.join('-')

  if(val === prevVal){
    return profileData.member_id
  }

  let member_id = `${zone_abbreviation}-${state_abbreviation}-${lga}-${digits}`;
  
  const hasId = await CheckMemberId(member_id);

  if (hasId && count > 0) {
    member_id = await generateMemberId(profileData, count--);
  }

  return member_id;
}

function generateRandomDigits() {
  let digits = "";
  for (let i = 0; i < 12; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  return digits;
}

async function CheckMemberId(member_id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profile")
    .select("member_id")
    .eq("member_id", member_id).single();
  console.log(data);

  if (error) return false;
  if (data) return false;
  return true;
}
