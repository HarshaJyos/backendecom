// src/utils/sendemail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendEmail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: `"Ecommerce" <${process.env.EMAIL_FROM || "no-reply@ecommerce.com"}>`,
    to,
    subject,
    text,
  });
};

