import nodemailer from "nodemailer";
import { env } from "./env";

export const mailTransporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  await mailTransporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text,
  });
};
