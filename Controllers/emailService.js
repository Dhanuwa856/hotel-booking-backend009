import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use the desired email service
      auth: {
        // user: process.env.EMAIL_USER, // Replace with your email
        user: "infoname259@gmail.com",
        // pass: process.env.EMAIL_PASS, // Replace with your email's app-specific password
        pass: "dnutpyjaeypfbamj",
      },
    });

    const mailOptions = {
      // from: process.env.EMAIL_USER, // Sender address
      from: "infoname259@gmail.com",
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
