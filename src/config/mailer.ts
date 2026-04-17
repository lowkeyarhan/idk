import nodemailer from "nodemailer";
import { env } from "./env";
import { logger } from "../utils/logger";

let mailTransporter: nodemailer.Transporter | null = null;

if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  if (!mailTransporter || !env.SMTP_FROM) {
    logger.warn(`Email skipped (No SMTP configurations found). To: ${to}, Subject: ${subject}`);
    return;
  }

  await mailTransporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text,
  });
};
