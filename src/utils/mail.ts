import nodemailer from "nodemailer";
import emailVerificationToken from "#/models/emailVerificationToken";
import { generateTemplate } from "#/mail/template";
import path from "path";

const generateMailTransporter = () => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const { name, email } = profile;

  const welcomeMessage = `Hi ${name}, welcome to Cadense! There is so much in store for verified users! Use the OTP below to verify your mail`;

  const transport = generateMailTransporter();

  await transport.sendMail({
    to: email,
    from: process.env.VERIFICATION_EMAIL,
    subject: "Welcome to Cadense",
    html: generateTemplate({
      title: "Welcome to Cadense",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

interface Options {
  link: string;
  email: string;
}

export const sendForgotPasswordLink = async (options: Options) => {
  const { link, email } = options;

  const message = `We just received a request that you forgot your password. No issues, click the link below to reset your password`;

  const transport = generateMailTransporter();

  await transport.sendMail({
    to: email,
    from: process.env.VERIFICATION_EMAIL,
    subject: "Password Reset",
    html: generateTemplate({
      title: "Forgot Password",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};

export const sendPasswordResetSuccess = async (name: string, email: string) => {
  const message = `Dear ${name}, you just updated your password. You can now sign in with new password.`;

  const transport = generateMailTransporter();

  await transport.sendMail({
    to: email,
    from: process.env.VERIFICATION_EMAIL,
    subject: "Password Reset",
    html: generateTemplate({
      title: "Password Reset Successful",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: process.env.SIGN_IN_URL,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};
