// utils/emailHandlers.js - FIXED VERSION
import { mailtrapClient, sender } from '../config/mailtrap.js';
import {
  createConfirmationEmailTemplate,
  createPasswordResetEmailTemplate,
  createReferralInvitationEmailTemplate
} from './emailTemplates.js';

/**
 * Send Confirmation Email
 * @param {string} email - Recipient's email address.
 * @param {string} confirmationLink - Link for email verification.
 */
export const sendConfirmationEmail = async (email, confirmationLink) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Confirm Your Email Address",
      html: createConfirmationEmailTemplate(confirmationLink), // Removed name parameter
      category: "email_confirmation",
    });
    console.log("Confirmation email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

/**
 * Send Password Reset Email
 * @param {string} email - Recipient's email address.
 * @param {string} resetLink - Link for resetting password.
 */
export const sendPasswordResetEmail = async (email, resetLink) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: createPasswordResetEmailTemplate(resetLink),
      category: "password_reset",
    });
    console.log("Password reset email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

/**
 * Send Referral Invitation Email
 * @param {string} email - The email address of the invited recipient.
 * @param {string} senderName - Name of the member sending the referral.
 * @param {string} inviteLink - Link that the recipient can use to sign up.
 */
export const sendReferralInvitationEmail = async (email, senderName, inviteLink) => {
  const recipient = [{ email }]; // Simplified
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Invitation to Join The People's Opposition",
      html: createReferralInvitationEmailTemplate(senderName, inviteLink),
      category: "referral_invitation",
    });
    console.log("Referral invitation email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending referral invitation email:", error);
    throw error;
  }
};