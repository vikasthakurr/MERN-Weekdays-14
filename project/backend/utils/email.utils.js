import transporter from "../config/nodemailer.config.js";

async function sendEmail(to, subject, htmlContent) {
  try {
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || "MERN App"}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.log("Email sent error:", error);
    return false;
  }
}
export default sendEmail;
