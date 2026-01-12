"use server";

import nodemailer from "nodemailer";
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: false,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  contact,
  sendTo,
  subject,
  text,
  html,
  attachment,
}: {
  contact: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
  attachment?: {
    filename: string;
    content: string;
    encoding: "base64";
  };
}) {
  try {
    const mailOptions: {
      from: string;
      to: string;
      subject: string;
      text: string;
      html: string;
      attachments?: { filename: string; content: string; encoding: "base64" }[];
    } = {
      from: contact,
      to: sendTo || SITE_MAIL_RECIEVER || "",
      subject: subject,
      text: text,
      html: html ? html : "",
    };

    if (attachment) {
      mailOptions.attachments = [attachment];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Message Sent", info.messageId);
    console.log("Mail sent to", SITE_MAIL_RECIEVER);
    return info;
  } catch (error) {
    console.error(
      "Something Went Wrong",
      SMTP_SERVER_USERNAME,
      SMTP_SERVER_PASSWORD,
      error
    );
    return;
  }
}
