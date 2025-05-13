import PasswordResetToken from "#/models/passwordResetToken";
import { RequestHandler } from "express";

export const verifyResetPasswordToken: RequestHandler = async (
  req,
  res,
  next
) => {
  console.log(req.body);
  const { token, userId } = req.body;

  const resetToken = await PasswordResetToken.findOne({ owner: userId });

  if (!resetToken) return res.status(403).json({ error: "Invalid token" });

  const isValid = await resetToken.compareTokens(token);

  if (!isValid) return res.status(403).json({ error: "Invalid token" });

  next();
};
