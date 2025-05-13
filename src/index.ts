import express from "express";
import bcrypt from "bcrypt";

import "./config/db";
import authRouter from "./routers/auth";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public/"));

app.use("/auth", authRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
