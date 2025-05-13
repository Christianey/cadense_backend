import { isValidObjectId } from "mongoose";
import * as yup from "yup";

export const CreateUserSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is missing.")
    .min(3, "Name is too short.")
    .max(20, "Name is too long."),
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is missing"),
  password: yup
    .string()
    .trim()
    .required("Password is missing ")
    .min(8, "Password is too short.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).+$/,
      "Password must contain uppercase, lowercase, number and special character."
    ),
});

export const TokenAndIDSchema = yup.object({
  token: yup.string().trim().required("Invalid token"),
  userId: yup
    .string()
    .trim()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) return value;
      return "";
    })
    .required("Invalid User Id"),
});

export const UpdatePasswordSchema = yup.object({
  token: yup.string().trim().required("Invalid token"),
  userId: yup
    .string()
    .trim()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) return value;
      return "";
    })
    .required("Invalid User Id"),
  password: yup
    .string()
    .trim()
    .required("Password is missing ")
    .min(8, "Password is too short.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).+$/,
      "Password must contain uppercase, lowercase, number and special character."
    ),
});
