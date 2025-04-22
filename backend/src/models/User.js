// src/models/User.js
import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for personal information
const PersonalInfoSchema = new Schema({
  first_name: { type: String },
  middle_name: { type: String },
  last_name: { type: String },
  phone_number: { type: String },
  country_code: { type: String },
  gender: { type: String },
  lga: { type: String },
  ward: { type: String },
  age_range: { type: String },
  state_of_origin: { type: String },
  voting_engagement_state: { type: String },
}, { _id: false });

// Schema for onboarding data grouped by category
const OnboardingDataSchema = new Schema({
  securityValidation: {
    profile_picture_url: { type: String },
  },
  demographics: {
    ethnicity: { type: String },
    religion: { type: String },
    occupation: { type: String },
    level_of_education: { type: String },
    marital_status: { type: String },
    household_size: { type: String },
    income_bracket: { type: String },
  },
  politicalPreferences: {
    party_affiliation: { type: String },
    top_political_issues: [{ type: String }],
  },
  engagementAndMobilization: {
    is_volunteering: { type: String },
    past_election_participation: { type: String },
    preferred_method_of_communication: [{ type: String }],
  },
  technologyAccess: {
    has_internet_access: { type: String },
    preferred_social_media: [{ type: String }],
    is_smartphone_user: { type: String },
  },
  votingBehavior: {
    likely_to_vote: { type: String },
    is_registered: { type: String },
    registration_date: { type: String },
    voter_id_number: { type: String },
  },
  surveyQuestions: {
    vote_impact: { type: String },
    trust_in_election_body: { type: String },
  },
}, { _id: false });

// Main User schema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  is_verified_user: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  member_id: { type: String },

  role: {
    type: String,
    enum: ["member", "verified", "admin"],
    default: "member",
  },

  // NEW: track onboarding completion
  has_onboarded: { type: Boolean, default: false },

  // tokens
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },

  // sub‑docs: now optional
  personalInfo: { type: PersonalInfoSchema, default: {} },
  onboardingData: { type: OnboardingDataSchema, default: {} },

  referred_by: { type: String },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
