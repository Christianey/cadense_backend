import otpGenerator from "otp-generator";

export const generateToken = (length: number = 6) => {
  return otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};
