import { env } from '@/env';
import nodemailer from 'nodemailer';

const config = {
  from: 'QR Platby <info@qrplatby.sk>',
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
  });

  return info;
};
