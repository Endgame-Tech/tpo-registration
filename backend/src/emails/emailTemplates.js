// utils/emailTemplates.js

/**
 * Confirmation Email Template
 * This template is used to confirm the user's email address after signup.
 *
 *
 * @param {string} confirmationLink - The link that the user must click to confirm their email.
 * @returns {string} - The HTML content for the confirmation email.
 */
export function createConfirmationEmailTemplate(confirmationLink) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirm Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #0E4C2D, #082114); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white !important; margin: 0; font-size: 28px;">Confirm Your Email</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #1EBE53;"><strong>Hello,</strong></p>
        <p>Thank you for joining The People's Opposition! To complete your registration, please confirm your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationLink}" style="background-color: #1EBE53; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Confirm Email</a>
        </div>
        <p>If you did not sign up for The People's Opposition, you can safely ignore this email.</p>
        <p>Best regards,<br>The People's Opposition Team</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Password Reset Email Template
 * This template is used when a user requests a password reset.
 *
 * @param {string} name - The recipient's name.
 * @param {string} resetLink - The link for resetting the password.
 * @returns {string} - The HTML content for the password reset email.
 */
export function createPasswordResetEmailTemplate(resetLink) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #0E4C2D, #082114); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white !important; margin: 0; font-size: 28px;">Reset Your Password</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #1EBE53;"><strong>Hello,</strong></p>
        <p>We received a request to reset your password for your account at The People's Opposition. Click the button below to reset your password. This link will expire in 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #1EBE53; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Reset Password</a>
        </div>
        
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,<br>The People's Opposition Team</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Referral Invitation Email Template
 * This template is used when a member invites someone to join The People's Opposition.
 *
 * @param {string} senderName - The name of the member sending the invitation.
 * @param {string} inviteLink - The link that the recipient must click to join.
 * @returns {string} - The HTML content for the referral invitation email.
 */
export function createReferralInvitationEmailTemplate(senderName, inviteLink) {
  return `
    <!DOCTYPE html> 
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>You're Invited to Join The People's Opposition</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #0E4C2D, #082114); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white !important; margin: 0; font-size: 28px;">Invitation to Join</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #1EBE53;"><strong>Hello,</strong></p>
        <p>You have been invited by <strong>${senderName}</strong> to join The People's Opposition. By joining, you can be a part of our movement for transparency and accountability.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="background-color: #1EBE53; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Join Now</a>
        </div>
        <p>Click the button above to create your account and start making a difference.</p>
        <p>If you do not wish to join, please ignore this email.</p>
        <p>Best regards,<br>The People's Opposition Team</p>
      </div>
    </body>
    </html>
  `;
}
