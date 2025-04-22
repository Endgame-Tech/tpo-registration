// utils/emailHandlers.js
import { mailtrapClient, sender } from '../config/mailtrap.js';
import {
  createConfirmationEmailTemplate,
  createPasswordResetEmailTemplate,
  createReferralInvitationEmailTemplate
} from './emailTemplates.js';

/**
 * Send Welcome Email
 * @param {string} email - Recipient's email address.
 * @param {string} name - Recipient's name.
 * @param {string} profileUrl - URL or link for the recipient’s profile (if needed).
 */

/**
 * Send Confirmation Email
 * @param {string} email - Recipient's email address.
 * @param {string} name - Recipient's name.
 * @param {string} confirmationLink - Link for email verification.
 */
export const sendConfirmationEmail = async (email, name, confirmationLink) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Confirm Your Email Address",
      html: createConfirmationEmailTemplate(name, confirmationLink),
      category: "email_confirmation",
    });
    console.log("Confirmation email sent successfully:", response);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

/**
 * Send Password Reset Email
 * @param {string} email - Recipient's email address.
 * @param {string} name - Recipient's name.
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
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

/**
 * Send Referral Invitation Email
 * @param {string} recipientEmail - The email address of the invited recipient.
 * @param {string} senderName - Name of the member sending the referral.
 * @param {string} inviteLink - Link that the recipient can use to sign up.
 */
export const sendReferralInvitationEmail = async (email, senderName, inviteLink) => {
  const recipient = [{ email: email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Invitation to Join The People's Opposition",
      html: createReferralInvitationEmailTemplate(senderName, inviteLink),
      category: "referral_invitation",
    });
    console.log("Referral invitation email sent successfully:", response);
  } catch (error) {
    console.error("Error sending referral invitation email:", error);
    throw error;
  }
};
