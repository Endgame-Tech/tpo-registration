import User from '../models/User.js';
import { generateMemberId } from "../utils/generateMemberId.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure onboardingData exists if has_onboarded is true
    if (user.has_onboarded && !user.onboardingData) {
      user.onboardingData = {
        personalInfo: {},
        politicalPreferences: {},
        voterRegistration: {},
      };
      // Optionally save the updated user to the database
      await User.findByIdAndUpdate(req.user._id, { $set: { onboardingData: user.onboardingData } });
    }

    return res.json(user);
  } catch (err) {
    console.error('getCurrentUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePersonalInfo = async (req, res) => {
  try {
    const updates = req.body;

    // First, find the user
    let user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if member_id is missing, and generate it
    if (!user.member_id) {
      const member_id = await generateMemberId(updates);
      user.member_id = member_id;
    }

    // Update personalInfo fields
    user.personalInfo = updates;

    await user.save(); // Save all changes

    return res.json({ message: "Personal info updated", member_id: user.member_id });
  } catch (err) {
    console.error("updatePersonalInfo error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkMemberId = async (req, res) => {
  try {
    const { member_id } = req.query;

    if (!member_id) {
      return res.status(400).json({ message: "member_id is required" });
    }

    const existingUser = await User.findOne({ member_id });

    return res.json({ exists: !!existingUser }); // true if exists
  } catch (err) {
    console.error("checkMemberId error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export async function updateSecurityValidation(req, res) {
  try {
    const userId = req.user._id; // assuming your auth middleware set req.user
    const { profile_picture_url } = req.body;

    if (!profile_picture_url) {
      return res
        .status(400)
        .json({ message: "Missing profile_picture_url in request body" });
    }

    // Update the nested field in onboardingData.securityValidation
    await User.findByIdAndUpdate(
      userId,
      { "onboardingData.securityValidation.profile_picture_url": profile_picture_url },
      { new: true }
    );

    return res.json({ message: "Security validation updated successfully" });
  } catch (err) {
    console.error("updateSecurityValidation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export const updateDemographics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.onboardingData.demographics = {
      ...user.onboardingData.demographics,
      ...req.body,
    };

    await user.save();

    res.json({ message: "Demographic info updated successfully" });
  } catch (error) {
    console.error("Error updating demographics:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVoterRegistration = async (req, res) => {
  try {
    const { is_registered, voter_id_number, registration_date } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.onboardingData.votingBehavior = {
      ...user.onboardingData.votingBehavior,
      is_registered,
      voter_id_number,
      registration_date,
    };

    await user.save();

    res.json({ message: "Voter registration info updated successfully" });
  } catch (error) {
    console.error("Error updating voter registration:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /users/me/political-preferences
export const updatePoliticalPreferences = async (req, res) => {
  try {
    const { party_affiliation, top_political_issues } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.onboardingData.politicalPreferences = {
      ...user.onboardingData.politicalPreferences,
      party_affiliation,
      top_political_issues,
    };

    await user.save();

    res.json({ message: "Political preferences updated successfully" });
  } catch (error) {
    console.error("Error updating political preferences:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export async function updateEngagementAndMobilization(req, res) {
  try {
    const userId = req.user._id;
    const { is_volunteering, past_election_participation, preferred_method_of_communication } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update engagementAndMobilization section
    user.onboardingData.engagementAndMobilization.is_volunteering = is_volunteering;
    user.onboardingData.engagementAndMobilization.past_election_participation = past_election_participation;
    user.onboardingData.engagementAndMobilization.preferred_method_of_communication = preferred_method_of_communication;

    await user.save();

    res.json({ message: "Engagement and Mobilization details updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function updateVotingBehavior(req, res) {
  try {
    const userId = req.user._id;
    const { likely_to_vote } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.onboardingData.votingBehavior.likely_to_vote = likely_to_vote;

    await user.save();

    res.json({ message: "Voting behavior updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function updateTechnologyAndAccess(req, res) {
  try {
    const userId = req.user._id;
    const { has_internet_access, preferred_social_media, is_smartphone_user } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.onboardingData.technologyAccess.has_internet_access = has_internet_access;
    user.onboardingData.technologyAccess.preferred_social_media = preferred_social_media;
    user.onboardingData.technologyAccess.is_smartphone_user = is_smartphone_user;

    await user.save();

    res.json({ message: "Technology and Access info updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function updateSurveyQuestions(req, res) {
  try {
    const userId = req.user._id;
    const { vote_impact, trust_in_election_body, has_onboarded } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.onboardingData.surveyQuestions.vote_impact = vote_impact;
    user.onboardingData.surveyQuestions.trust_in_election_body = trust_in_election_body;

    if (has_onboarded) user.has_onboarded = true;

    await user.save();

    res.json({ message: "Survey questions updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
