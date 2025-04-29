// src/routes/users.js
import express from 'express';
import { adminOnly, authenticate } from "../middleware/auth.js";
import {
  getCurrentUser,
  getAllUsers,
  updatePersonalInfo,
  updateSecurityValidation,
  updateDemographics,
  updateVoterRegistration,
  updatePoliticalPreferences,
  updateEngagementAndMobilization,
  updateVotingBehavior,
  updateTechnologyAndAccess,
  updateSurveyQuestions,
  checkMemberId,
  searchUsers,
  checkUserName
} from "../controllers/userController.js";

const router = express.Router();

router.get("/check-username", checkUserName);

// Fetch full user document (minus sensitive fields)
router.get("/me", authenticate, adminOnly, getCurrentUser);
router.get("/search", authenticate, adminOnly, searchUsers);
router.get("/", authenticate, adminOnly, getAllUsers);

// Update personal info (name, phone, address, etc)
router.patch("/me/personal-info", authenticate, updatePersonalInfo);

// Update photo URL
router.patch("/me/security-validation", authenticate, updateSecurityValidation);

router.patch("/me/demographics", authenticate, updateDemographics);

router.patch("/me/voter-registration", authenticate, updateVoterRegistration);

router.patch("/me/political-preferences", authenticate, updatePoliticalPreferences);

router.patch("/me/engagement-and-mobilization", authenticate, updateEngagementAndMobilization);

router.patch("/me/voting-behavior", authenticate, updateVotingBehavior);

router.patch("/me/technology-and-access", authenticate, updateTechnologyAndAccess);

router.patch("/me/survey-questions", authenticate, updateSurveyQuestions);

router.get("/check-member-id", checkMemberId);



export default router;
