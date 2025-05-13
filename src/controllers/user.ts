import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";

import { CreateUser, VerifyEmail } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helpers";
import {
  sendForgotPasswordLink,
  sendPasswordResetSuccess,
  sendVerificationMail,
} from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";

export const createUser: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  const token = generateToken();

  await EmailVerificationToken.create({
    token,
    owner: user._id,
  });

  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (req: VerifyEmail, res) => {
  const { token, userId } = req.body;

  const verficationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verficationToken)
    return res.status(403).json({ error: "Invalid token." });

  const isValid = await verficationToken.compareTokens(token);

  if (!isValid) return res.status(403).json({ error: "Invalid token." });

  await User.findByIdAndUpdate(userId, { verified: true });

  await EmailVerificationToken.findByIdAndDelete(verficationToken._id);

  res.json({ message: "Your email has been verified" });
};

export const resendVerificationTokan: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request." });

  const user = await User.findById(userId);
  console.log({ user, userId });
  if (!user) return res.status(403).json({ error: "Invalid request." });

  const { name, email, _id } = user;

  await EmailVerificationToken.findOneAndDelete({ owner: userId });

  const token = generateToken();

  await EmailVerificationToken.create({
    token,
    owner: userId,
  });

  sendVerificationMail(token, { name, email, userId: _id.toString() });

  res.json({ message: "Please check your mail." });
};

export const generateForgotPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Invalid Email" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found." });

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  const token = crypto.randomBytes(36).toString("hex");
  await PasswordResetToken.create({ owner: user._id, token });

  const resetLink = `${process.env.PASSWORD_RESET_LINK}/?token=${token}&userId=${user._id}`;

  sendForgotPasswordLink({ link: resetLink, email: user.email });

  res.json({ message: "Check your registered mail." });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);

  if (!user) return res.status(403).json({ error: "Unauthorized access" });

  const matched = user.comparePasswords(password);
  if (!matched)
    return res
      .status(422)
      .json({ error: "The new password must be different" });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  sendPasswordResetSuccess(user.name, user.email);

  res.json({ message: "Password reset successful" });
};
