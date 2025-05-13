import {
  createUser,
  generateForgotPasswordLink,
  grantValid,
  resendVerificationTokan,
  updatePassword,
  verifyEmail,
} from "#/controllers/user";
import { verifyResetPasswordToken } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  UpdatePasswordSchema,
  TokenAndIDSchema,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserSchema), createUser);

router.post("/verify-email", validate(TokenAndIDSchema), verifyEmail);

router.post("/reverify-email", resendVerificationTokan);

router.post("/forgot-password", generateForgotPasswordLink);

router.post(
  "/verify-reset-password-token",
  validate(TokenAndIDSchema),
  verifyResetPasswordToken,
  grantValid
);

router.post(
  "update-password",
  validate(UpdatePasswordSchema),
  verifyResetPasswordToken,
  updatePassword
);

export default router;
