import { Request } from "express";

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface VerifyEmail extends Request {
  body: {
    userId: string;
    token: string;
  };
}
