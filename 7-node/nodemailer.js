/**
 * NODEMAILER & SMTP NOTES
 * 
 * 1. Nodemailer: A module for Node.js applications to allow easy email sending.
 * 
 * 2. SMTP (Simple Mail Transfer Protocol): The standard protocol for sending emails 
 *    across the internet. Nodemailer uses SMTP by default.
 * 
 * 3. Transporter: This is the object that defines the connection to your email 
 *    service provider (e.g., Gmail, Outlook, Mailtrap).
 * 
 * 4. Auth: Contains the credentials (email and password/app-password) used to 
 *    authenticate with the SMTP server.
 * 
 * 5. Mail Options: Defines the sender, recipient, subject, and content (text/html) 
 *    of the email.
 * 
 * IMPORTANT: For Gmail, you often need to use an "App Password" if 2-Factor 
 * Authentication is enabled, as standard passwords might be blocked.
 */

import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// --- Transporter Configuration ---
// createTransport() initializes the connection to the SMTP server.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// --- Mail Content (Options) ---
// Defines the details of the email to be sent.
const mailData = {
  from: process.env.EMAIL,
  to: "phy.nikhilroy@gmail.com",
  subject: "Welcome to our platform",
  text: "welcome text",
};
// --- Send Email Function ---
// transporter.sendMail() is an asynchronous operation that returns a promise.
async function sendmail() {
  try {
    await transporter.sendMail(mailData);
    console.log("mail sent successfully");
  } catch (err) {
    console.log(err);
  }
}

sendmail();
app.listen(3000, () => {
  console.log("server started");
});
