// src/routes/referrals.js
import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getMyUnit, sendReferralInvites, resendReferralInvite } from "../controllers/referralController.js";

const router = express.Router();

router.get("/my-unit", authenticate, getMyUnit);
router.post("/send-invite", authenticate, sendReferralInvites);
router.post("/resend/:inviteId", authenticate, resendReferralInvite);

export default router;
