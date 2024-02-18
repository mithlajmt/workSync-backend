/* eslint-disable max-len */
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Sends a welcome email to a new employee with login credentials.
 *
 * @param {string} to - The email address of the recipient.
 * @param {string} employeeId - The employee ID for the new employee.
 * @param {string} password -
 *  The temporary password for the new employee's login.
 * @return {Promise<void>} -
 *  A Promise that resolves when the emailsent successfully or rejects on error.
 *
 * @throws {Error} If there is an issue sending the email.
 *
 * @example
 * const to = 'recipient@example.com';
 * const employeeId = '12345';
 * const password = 'temporary_password';
 * sendWelcomeEmail(to, employeeId, password);
 */
async function sendWelcomeEmail(to, employeeId, password) {
  // Authenticate using a secure app password generated from Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS if supported by your server
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GOOGLE_APP_PASS,
    },
  });


  // Create email options with sender information
  const mailOptions = {
    from: {
      name: 'workSync',
      address: process.env.GMAIL_ADDRESS,
    },
    to,
    subject: 'Welcome to the Team!',
    text: `Hey! Congratulations on your new job. We're excited to have you on board! 

    In this email, you'll find your login credentials:

    - Employee ID: ${employeeId}
    - Password: ${password}

    Please note that the password provided is temporary and must be changed upon your first login. You can easily change it by following these steps: profile change password

    We believe you'll have a great career here at your new role. Don't hesitate to reach out to your manager or HR representative if you have any questions.

    Welcome aboard!

    Best regards,
    The WorkSync Team

    P.S. We're excited to see what you'll accomplish! Don't forget to join our community using this link.`,
    html: `Hey! <span style="color: #336699; font-weight: bold;">Congratulations on your new job</span>. We're excited to have you on board! 
    <p style="color: red; font-weight: bold;">Warning: Do not share these login credentials with others. This information is confidential.</p>

    <p>In this email, you'll find your login credentials:</p>

    <ul>
      <li><span style="color: #336699;">Employee ID:</span> ${employeeId}</li>
      <li><span style="color: #336699;">Password:</span> ${password}</li>
    </ul>
    <p>Please note that the password provided is temporary and must be changed upon your first login. You can easily change it by following these steps: from profile change password</p>

    <p>We believe you'll have a great career here at your new role. Don't hesitate to reach out to your manager or HR representative if you have any questions.</p>

    <p>Welcome aboard!</p>

    <p><span style="color: #336699; font-style: italic;">Best regards,</span></p>
    <p><span style="color: #336699; font-weight: bold;">The WorkSync Team</span></p>

    <p><span style="color: #336699; font-weight: bold;">P.S.</span> We're excited to see what you'll accomplish! Don't forget to join our employee Slack channel at [link].</p>`,
  };

  // Send email and handle errors gracefully
  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully!');
  } catch (err) {
    console.error('Error sending welcome email:', err);
  }
}

module.exports = {sendWelcomeEmail};
